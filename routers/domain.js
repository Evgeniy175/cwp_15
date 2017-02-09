function UserRouter(express, domainsService) {
    let router = express.Router();

    router.get('/', readMany);
    router.get('/is-available', isAvailable)
    router.get('/:id', read);

    router.post('/', create);
    router.post('/buy', buy)
    router.post('/pay', pay);

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
        let uId = req.signedCookies.__auth_key;
        let domain = req.body.domain;
        promiseResolver(domainsService.buy(uId, domain), res);
    }

    function pay(req, res) {
        let uId = req.signedCookies.__auth_key;
        let domainId = req.body.domainId;
        let sum = req.body.sum;
        promiseResolver(domainsService.pay(uId, domainId, sum), res);
    }

    function update(req, res) {
        promiseResolver(domainsService.update(req.body), res);
    }

    function remove(req, res) {
        promiseResolver(domainsService.remove(req.body.id), res);
    }

    function search(req, res) {
        promiseResolver(domainsService.search(req.query), res);
    }

    function promiseResolver(promise, res) {
        promise
            .then((data) => res.json(data))
            .catch((err) => res.error(err));
    }
}

module.exports = UserRouter;
