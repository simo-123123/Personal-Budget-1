const validateBody = (req, res, next) => {
    if (!req.body) {
        return res.status(400).json({ message: 'Missing request body' });
    }

    next();
}

const validateEnvelope = (req, res, next) => {
    const { envelope } = req.body;
    
    if (!envelope || typeof envelope.title !== 'string' || envelope.title === '' || typeof envelope.budget !== 'number' || envelope.budget < 0) {
        return res.status(400).json({ message: 'Invalid request body' });
    }

    req.newEnvelope = envelope;
    next();
}

const validateAmount = (req, res, next) => {
    const { amount } = req.body;

    if (!amount || typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ message: 'Missing or invalid amount' });
    }

    req.amount = amount;
    next();
}

const validateEnvelopesArray = (req, res, next) => {
    const { envelopes } = req.body;

    if (!Array.isArray(envelopes) || envelopes.length === 0) {
        return res.status(400).json({ message: '"envelopes" must be a non-empty array' });
    }

    req.envelopes = envelopes;
    next();
}

module.exports = {
    validateBody,
    validateEnvelope,
    validateAmount,
    validateEnvelopesArray
};