function DomainRouter(express, domainsService, config) {
    const resolvers = {
        'xml': promiseResolverXml,
        'json': promiseResolverJson
    };
    const defaultResolver = 'json';

    let router = express.Router();

    router.get('/', readMany);

    router.get('/:domainId', read);
    router.post('/', buy);
    router.put('/:domainId', update);
    router.delete('/:domainId', remove);

    return router;

    function readMany(req, res) {
        let resolverName = getResolverName();
        resolvers[resolverName](domainsService.readMany(req.query), res, 200);
    }

    function read(req, res) {
        let resolverName = getResolverName();
        resolvers[resolverName](domainsService.read(req.params.domainId), res, 200);
    }

    function buy(req, res) {
        let uId = req.body.userId;
        let domain = req.body.domain;
        let resolverName = getResolverName();

        resolvers[resolverName](domainsService.buy(uId, domain), res, 200);
    }

    function update(req, res) {
        let resolverName = getResolverName();
        resolvers[resolverName](domainsService.update(req.params.domainId, req.body), res, 200);
    }

    function remove(req, res) {
        let resolverName = getResolverName();
        resolvers[resolverName](domainsService.remove(req.params.domainId), res, 200);
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

module.exports = DomainRouter;
