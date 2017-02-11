function AuthRouter(express, sessionsService, usersService, jwt, config, errors) {
    let freeAccessRoutes = ["/sign-up", "/sign-in", "/logout"];

    let router = express.Router();

    router.get('*', checkPermissions);
    router.post('*', checkPermissions);

    router.post('/sign-up', signUp);

    router.post('/sign-in', signIn);

    router.get('/logout', logout);

    return router;

    function checkPermissions(req, res, next) {
        let isFreeAccessRoute = freeAccessRoutes.some((elem) => req.url.startsWith(elem));
        let isUserSigned = req.signedCookies[config.cookies.tokenKey] == undefined ? false : true;
        
        if (isUserSigned) req.decodedToken = jwt.verify(req.signedCookies[config.cookies.tokenKey], config.jwt.secret);

        if (isFreeAccessRoute || isUserSigned) next();
        else res.json(errors.accessDenied);
    }

    function signUp(req, res) {
        usersService.create(req.body)
            .then((data) => res.json(data))
            .catch((err) => res.error(err));
    }

    function signIn(req, res) {
        sessionsService.signIn(req.body)
            .then((userId) => {
                let token = jwt.sign(userId, config.jwt.secret);
                res.cookie(config.cookies.tokenKey, token, {signed: true});
                res.json(userId);
            })
            .catch((err) => res.error(err));
    }

    function logout(req, res) {
        res.cookie(config.cookies.tokenKey, '');
        res.end();
    }
}

module.exports = AuthRouter;
