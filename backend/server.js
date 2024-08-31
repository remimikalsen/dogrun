const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const dbPath = path.resolve(__dirname, './database/leaderboard.db');
const db = new sqlite3.Database(dbPath);

app.use(cors());
app.use(bodyParser.json());

// Create table if it doesn't exist
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS leaderboard (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            initials TEXT NOT NULL,
            bones INTEGER NOT NULL
        )
    `);
});

// API to store the score
app.post('/api/score', (req, res) => {
    const { initials, bones } = req.body;
    if (!initials || !bones) {
        return res.status(400).send('Initials and bones are required');
    }

    db.run('INSERT INTO leaderboard (initials, bones) VALUES (?, ?)', [initials, bones], function(err) {
        if (err) {
            return res.status(500).send('Failed to store score');
        }
        res.status(200).send('Score stored successfully');
    });
});

// API to retrieve the top 10 scores
app.get('/api/leaderboard', (req, res) => {
    db.all('SELECT initials, bones FROM leaderboard ORDER BY bones DESC LIMIT 10', [], (err, rows) => {
        if (err) {
            return res.status(500).send('Failed to retrieve leaderboard');
        }
        res.status(200).json(rows);
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});