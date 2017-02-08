function UserRouter(express, usersService) {
    let router = express.Router();

    router.get('/:id', read);
    router.get('/', readMany);
    router.post('/', create);
    router.put('/:id', update);
    router.delete('/:id', remove);

    return router;

    function create(req, res) {
        promiseResolver(usersService.create(req.body), res);
    }

    function readMany(req, res) {
        promiseResolver(usersService.readMany(req.query), res);
    }

    function read(req, res) {
        promiseResolver(usersService.read(req.params.id), res);
    }

    function update(req, res) {
        promiseResolver(usersService.update(req.body), res);
    }

    function remove(req, res) {
        promiseResolver(usersService.remove(req.body.id), res);
    }

    function search(req, res) {
        promiseResolver(usersService.search(req.query), res);
    }

    function promiseResolver(promise, res) {
        promise
            .then((data) => res.json(data))
            .catch((err) => res.error(err));
    }
}

module.exports = UserRouter;
