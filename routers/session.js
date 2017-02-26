function SessionRouter(express, sessionsService, jwt, config, errors) {
    const resolvers = {
        xml: xmlRepsonce,
        json: jsonReposonce
    };

    const defaultResolver = 'json';

    let router = express.Router();
    
    router.post('/', signIn);
    router.delete('/', logout);

    return router;

    function signIn(req, res) {
        sessionsService.signIn(req.body)
            .then((data) => {
                let token = jwt.sign(data.user.id, config.jwt.secret);
                res.cookie(config.cookies.tokenKey, token, {signed: true});

                let resolverName = getResolverName();
                resolvers[resolverName](res, _getUserForReposonce(data.user), 200);
            })
            .catch((err) => res.error(err));
    }

    function _getUserForReposonce(user) {
        return {
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname
        };
    }

    function logout(req, res) {
        let resolverName = getResolverName();

        res.cookie(config.cookies.tokenKey, '');

        resolvers[resolverName](res, {success:true}, 200);
    }

    function xmlRepsonce(res, data, status) {
        res.xml(status, 'data', data);
    }

    function jsonReposonce(res, data, status) {
        res.status(200);
        res.json(data);
    }

    function getResolverName() {
        return config.settings.return in resolvers ? config.settings.return : defaultResolver;
    }
}

module.exports = SessionRouter;
