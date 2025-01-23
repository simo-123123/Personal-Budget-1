const express = require('express');
const envelopesRouter = express.Router();

const { getAllEnvelopes,
    getSingleEnvelope,
    createEnvelope,
    updateEnvelope,
    deleteEnvelope } = require('./db-utils/db-functions');

envelopesRouter.param('id', (req, res, next, id) => {
    const envelope = getSingleEnvelope(id);

    if (!envelope) {
        return res.sendStatus(404);
    }

    req.envelope = envelope;
    next();
}) 

envelopesRouter.get('/', (req, res) => {
    res.json({ envelopes: getAllEnvelopes() })
});

module.exports = envelopesRouter;