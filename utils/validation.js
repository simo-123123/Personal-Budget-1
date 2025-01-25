const validateBody = (req, res, next) => {
    if (!req.body) {
        return res.sendStatus(400);
    }

    next();
}

const validateEnvelope = (req, res, next) => {
    const { envelope } = req.body;
    
    if (!envelope || typeof envelope.title !== 'string' || envelope.title === '' || typeof envelope.budget !== 'number' || envelope.budget < 0) {
        return res.sendStatus(400);
    }

    req.newEnvelope = envelope;
    next();
}

const validateAmount = (req, res, next) => {
    const { amount } = req.body;

    if (!amount || typeof amount !== 'number' || amount <= 0) {
        return res.sendStatus(400);
    }

    req.amount = amount;
    next();
}

module.exports = {
    validateBody,
    validateEnvelope,
    validateAmount
};