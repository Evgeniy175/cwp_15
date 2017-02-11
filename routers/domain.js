function UserRouter(express, domainsService, config) {
    let router = express.Router();

    router.get('/', readMany);
    router.get('/is-available', isAvailable)
    router.get('/:id', read);

    router.post('/', create);
    router.post('/buy', buy)
    router.post('/:id/pay', pay);

    router.put('/:id', update);

    router.delete('/:id', remove);

    return router;

    function readMany(req, res) {
        promiseResolver(domainsService.readMany(req.query), res);
    }

    function read(req, res) {
        promiseResolver(domainsService.read(req.params.id), res);
    }

    function isAvailable(req, res) {
        promiseResolver(domainsService.isAvailable(req.query.domain), res);
    }

    function create(req, res) {
        promiseResolver(domainsService.create(req.body), res);
    }

    function buy(req, res) {
        let uId = req.decodedToken;
        let domain = req.body.domain;
        promiseResolver(domainsService.buy(uId, domain), res);
    }

    function pay(req, res) {
        let uId = req.decodedToken;
        let domainId = req.params.id;
        let sum = req.body.sum;
        promiseResolver(domainsService.pay(uId, domainId, sum), res);
    }

    function update(req, res) {
        promiseResolver(domainsService.update(req.params.id, req.body), res);
    }

    function remove(req, res) {
        promiseResolver(domainsService.remove(req.params.id), res);
    }

    function promiseResolver(promise, res) {
        promise
            .then((data) => res.json(data))
            .catch((err) => res.error(err));
    }
}

module.exports = UserRouter;
