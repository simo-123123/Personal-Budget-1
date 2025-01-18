const db = require('./db-connect');
db.prepare('DROP TABLE IF EXISTS Envelope').run();

db.prepare(`CREATE TABLE Envelope (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    budget NUMERIC NOT NULL,
    CHECK(budget >= 0)
    )`).run();