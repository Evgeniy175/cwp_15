function AuthRouter(express, usersService) {
    let router = express.Router();

    //router.get('/register', register);
    router.post('/register', register);

    //router.get('/auth', auth);
    router.post('/auth', auth);

    //router.get('/autorize', auth);
    router.post('/autorize', auth);

    return router;

    function register() {
        
    }

    function auth() {
        // todo
    }

    function autorize() {

    }
}

module.exports = AuthRouter;
