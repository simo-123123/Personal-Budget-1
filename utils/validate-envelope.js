const validateEnvelope = (req, res, next) => {
    if (!req.body) {
        return res.sendStatus(400);
    }

    const { envelope } = req.body;
    
    if (!envelope || typeof envelope.title !== 'string' || envelope.title === '' || typeof envelope.budget !== 'number' || envelope.budget < 0) {
        return res.sendStatus(400);
    }

    req.newEnvelope = envelope;
    next();
}

module.exports = validateEnvelope;