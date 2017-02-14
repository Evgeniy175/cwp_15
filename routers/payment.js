function PaymentRouter(express, paymentsService, config) {
    let router = express.Router();
    
    router.get('/:userId', readAllUserPaymentsForDomain);
    router.post('/:userId', pay);

    return router;

    function readAllUserPaymentsForDomain(req, res) {
        let uId = req.params.userId;
        let dId = req.body.domainId;
        promiseResolver(paymentsService.readAllUserPaymentsForDomain(uId, dId), res);
    }

    function pay(req, res) {
        let uId = req.params.userId;
        let domainId = req.body.domainId;
        let sum = req.body.sum;
        promiseResolver(paymentsService.pay(uId, domainId, sum), res);
    }

    function promiseResolver(promise, res) {
        promise
            .then((data) => res.json(data))
            .catch((err) => res.error(err));
    }
}

module.exports = PaymentRouter;
