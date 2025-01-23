const express = require('express');
const envelopesRouter = express.Router();

const { getAllEnvelopes,
    getSingleEnvelope,
    createEnvelope,
    updateEnvelope,
    deleteEnvelope } = require('./db-utils/db-functions');

envelopesRouter.get('/', (req, res) => {
    res.json({ envelopes: getAllEnvelopes() })
});

module.exports = envelopesRouter;