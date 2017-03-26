function UserRouter(express, config, usersService) {
    const resolvers = {
        'xml': promiseResolverXml,
        'json': promiseResolverJson
    };

    const defaultResolver = 'json';

    let router = express.Router();

    router.get('/', readMany);
    router.get('/:id', read);
    router.post('/', signUp);
    router.put('/:id', update);
    router.delete('/:id', remove);

    return router;

    function signUp(req, res) {
        resolvers[req.format](usersService.create(req.body.message), res, 201);
    }

    function readMany(req, res) {
        resolvers[req.format](usersService.readMany(req.query), res, 200);
    }

    function read(req, res) {
        resolvers[req.format](usersService.read(req.params.id), res, 200);
    }

    function update(req, res) {
        resolvers[req.format](usersService.update(req.params.id, req.body.message), res, 204);
    }

    function remove(req, res) {
        resolvers[req.format](usersService.remove(req.params.id), res, 200);
    }

    function promiseResolverJson(promise, res, status) {
        promise.then((data) => {res.status(status); res.json(data);})
            .catch((err) => {res.error(err);});
    }

    function promiseResolverXml(promise, res, status) {
        promise.then((data) => {
            res.xml(status, "data", data);})
            .catch((err) => {res.error(err);});
    }
}

module.exports = UserRouter;
