function AvailableDomainsRouter(express, domainsService, config) {
    const resolvers = {
        'xml': promiseResolverXml,
        'json': promiseResolverJson
    };
    
    const defaultResolver = 'json';

    let router = express.Router();

    router.get('/', isAvailable);

    return router;

    function isAvailable(req, res) {
        let resolverName = getResolverName();
        resolvers[resolverName](domainsService.isAvailable(req.query.domain), res, 200);
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

module.exports = AvailableDomainsRouter;
