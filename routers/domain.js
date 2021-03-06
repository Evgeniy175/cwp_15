function DomainRouter(express, domainsService, config) {
    const resolvers = {
        'xml': promiseResolverXml,
        'json': promiseResolverJson
    };

    let router = express.Router();

    router.get('/', readMany);

    router.get('/:domainId', read);
    router.post('/', buy);
    router.put('/:domainId', update);
    router.delete('/:domainId', remove);

    return router;

    function readMany(req, res) {
        resolvers[req.format](domainsService.readMany(req.query), res, 200);
    }

    function read(req, res) {
        resolvers[req.format](domainsService.read(req.params.domainId), res, 200);
    }

    function buy(req, res) {
        let uId = req.body.message.userId;
        let domain = req.body.message.domain;
        resolvers[req.format](domainsService.buy(uId, domain), res, 200);
    }

    function update(req, res) {
        resolvers[req.format](domainsService.update(req.params.domainId, req.body.message), res, 200);
    }

    function remove(req, res) {
        resolvers[req.format](domainsService.remove(req.params.domainId), res, 200);
    }

    function promiseResolverJson(promise, res, status) {
        promise.then((data) => {res.status(status); res.json(data);})
            .catch((err) => {res.error(err);});
    }

    function promiseResolverXml(promise, res, status) {
        promise.then((data) => {res.xml(status, "data", data);})
            .catch((err) => {res.error(err);});
    }
}

module.exports = DomainRouter;
