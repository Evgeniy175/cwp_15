function AuthRouter(express, sessionsService, usersService, config, errors) {
    let freeAccessRoutes = ["/sign-up", "/auth", "/sign-in", "/domain"];

    let router = express.Router();

    router.get('*', checkPermissions);
    router.post('*', checkPermissions);

    router.get('/sign-up', signUp);
    router.post('/sign-up', signUp);

    router.get('/auth', auth);
    router.post('/auth', auth);

    router.get('/sign-in', signIn);
    router.post('/sign-in', signIn);

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

    function signUp(req, res, next) {
        usersService.create(req.body)
            .then((data) => res.json(data))
            .catch((err) => res.error(err));
    }

    function auth(req, res, next) {
        // todo
    }

    function signIn(req, res, next) {
        sessionsService.signIn(req.body)
            .then((userId) => {
                res.cookie(config.cookie.authKey, userId, {signed: true});
                res.json(userId);
            })
            .catch((err) => res.error(err));
    }
}

module.exports = AuthRouter;
