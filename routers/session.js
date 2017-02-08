function AuthRouter(express, sessionsService, usersService, config, errors) {
    let freeAccessRoutes = ["/signUp", "/auth", "/signIn"];

    let router = express.Router();

    router.get('*', checkPermissions);
    router.post('*', checkPermissions);

    router.get('/signUp', signUp);
    router.post('/signUp', signUp);

    router.get('/auth', auth);
    router.post('/auth', auth);

    router.get('/signIn', signIn);
    router.post('/signIn', signIn);

    return router;

    function checkPermissions(req, res, next) {
        let isFreeAccessRoute = freeAccessRoutes.some((elem) => req.url.startsWith(elem));
        let isUserSigned = req.signedCookies[config.cookie.authKey] === config.cookie.authValue;

        if (isFreeAccessRoute || isUserSigned) {
            next();
        } else {
            res.json(errors.wrongCredentials);
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
            .then((data) => res.json(data))
            .catch((err) => res.error(err));
    }
}

module.exports = AuthRouter;
