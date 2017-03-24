function PermissionRouter(express, jwt, config, errors) {
    const resolvers = {
        'xml': promiseResolverXml,
        'json': promiseResolverJson
    };

    const defaultResolver = 'json';

    let router = express.Router();

    router.all('*', checkPermissions);

    return router;

    function checkPermissions(req, res, next) {
        let resolverName = getResolverName();
        
        let freeAccessRoutes = ["/sessions", "/users"];
        let isFreeAccessRoute = freeAccessRoutes.some(elem => (req.url == elem) || (req.url == elem + '/'));
        let isUserSigned = req.signedCookies[config.cookies.tokenKey] == undefined ? false : true;
        
        if (isUserSigned) req.decodedToken = jwt.verify(req.signedCookies[config.cookies.tokenKey], config.jwt.secret);

        if (isFreeAccessRoute || isUserSigned) next();
        else res.error(errors.accessDenied);
    }

    function promiseResolverJson(promise, res, status) {
        promise.then((data) => {res.status(status); res.json(data);})
            .catch((err) => {res.error(err);});
    }

    function promiseResolverXml(promise, res, status) {
        promise.then((data) => {res.xml(status, "data", data);})
            .catch((err) => {res.error(err);});
    }

    function getResolverName() {
        return config.settings.return in resolvers ? config.settings.return : defaultResolver;
    }
}

module.exports = PermissionRouter;
