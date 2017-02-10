function AuthRouter(express, sessionsService, usersService, config, errors) {
    let freeAccessRoutes = ["/sign-up", "/auth", "/sign-in", "/domain"];

    let router = express.Router();

    router.get('*', checkPermissions);
    router.post('*', checkPermissions);

    router.post('/sign-up', signUp);
    router.post('/sign-in', signIn);
    router.post('/logout', logout);

    return router;

    function checkPermissions(req, res, next) {
        let isFreeAccessRoute = freeAccessRoutes.some((elem) => req.url.startsWith(elem));
        let isUserSigned = req.signedCookies[config.cookie.authKey] === config.cookie.authValue;

        if (isFreeAccessRoute || isUserSigned) {
            next();
        } else {
            res.json(errors.accessDenied);
        }
    }

    function signUp(req, res) {
        usersService.create(req.body)
            .then((data) => res.json(data))
            .catch((err) => res.error(err));
    }

    function signIn(req, res) {
        sessionsService.signIn(req.body)
            .then((userId) => {
                res.cookie(config.cookie.authKey, userId, {signed: true});
                res.json(userId);
            })
            .catch((err) => res.error(err));
    }

    function logout(req, res) {
        res.cookie(config.cookie.authKey, '');
        res.end();
    }
}

module.exports = AuthRouter;
