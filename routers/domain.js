function UserRouter(express, domainsService) {
    let router = express.Router();

    router.get('/', readMany);
    router.post('/', create);
    router.put('/:id', update);
    router.delete('/:id', remove);
    router.get('/:id', read);

    return router;

    function create(req, res) {
        promiseResolver(domainsService.create(req.body), res);
    }

    function readMany(req, res) {
        promiseResolver(domainsService.readMany(req.query), res);
    }

    function read(req, res) {
        promiseResolver(domainsService.read(req.params.id), res);
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
