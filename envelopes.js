const express = require('express');
const envelopesRouter = express.Router();

const { getAllEnvelopes,
    getSingleEnvelope,
    createEnvelope,
    updateEnvelope,
    deleteEnvelope } = require('./utils/db-functions');

const validateEnvelope = require('./utils/validate-envelope');

envelopesRouter.param('id', (req, res, next, id) => {
    const envelope = getSingleEnvelope(id);

    if (!envelope) {
        return res.sendStatus(404);
    }

    req.envelope = envelope;
    next();
});

envelopesRouter.get('/', (req, res) => {
    res.json({ envelopes: getAllEnvelopes() });
});

envelopesRouter.get('/:id', (req, res) => {
    res.json({ envelope: req.envelope });
});

envelopesRouter.post('/', validateEnvelope, (req, res) => {
    const createdEnvelope = createEnvelope(req.newEnvelope);
    res.status(201).json({ envelope: createdEnvelope });
});

module.exports = envelopesRouter;