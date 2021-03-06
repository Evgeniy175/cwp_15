function PaymentRouter(express, paymentsService, config) {
    const resolvers = {
        'xml': promiseResolverXml,
        'json': promiseResolverJson
    };

    let router = express.Router();
    
    router.get('/', readAllUserPaymentsForDomain);
    router.post('/:userId', pay);

    return router;

    function readAllUserPaymentsForDomain(req, res) {
        let uId = req.query.userId;
        let dId = req.query.domainId;
        resolvers[req.format](paymentsService.readAllUserPaymentsForDomain(uId, dId), res, 200);
    }

    function pay(req, res) {
        let uId = req.params.userId;
        let domainId = req.body.message.domainId;
        let sum = req.body.message.sum;
        resolvers[req.format](paymentsService.pay(uId, domainId, sum), res, 201);
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

module.exports = PaymentRouter;
