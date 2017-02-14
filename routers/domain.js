function DomainRouter(express, domainsService, config) {
    let router = express.Router();

    router.get('/', readMany);
    router.get('/is-available', isAvailable);

    router.get('/:domainId', read);
    router.post('/', buy);
    router.put('/:domainId', update);
    router.delete('/:domainId', remove);

    return router;

    function readMany(req, res) {
        promiseResolver(domainsService.readMany(req.query), res);
    }

    function read(req, res) {
        promiseResolver(domainsService.read(req.params.domainId), res);
    }

    function isAvailable(req, res) {
        promiseResolver(domainsService.isAvailable(req.query.domain), res);
    }

    function buy(req, res) {
        let uId = req.body.userId;
        let domain = req.body.domain;
        promiseResolver(domainsService.buy(uId, domain), res);
    }

    function update(req, res) {
        promiseResolver(domainsService.update(req.params.domainId, req.body), res);
    }

    function remove(req, res) {
        promiseResolver(domainsService.remove(req.params.domainId), res);
    }

    function promiseResolver(promise, res) {
        promise
            .then((data) => res.json(data))
            .catch((err) => res.error(err));
    }
}

module.exports = DomainRouter;
