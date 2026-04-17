const express = require('express');
const bodyParser = require('body-parser');
const bankRoutes = require('./routes/bank');
const cors = require('cors');
const app = express();
const PORT = 5000;
const users = require('./db/users');

app.use(cors({ origin: 'http://localhost:3000' }));

// Middleware
app.use(bodyParser.json());

app.use('/bank', bankRoutes);

app.post('/login', (req, res) => {
    const username = req.body.username?.trim();
    const password = req.body.password?.trim();

    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Usuario y contraseña son obligatorios' });
    }

    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        return res.json({ success: true, username: user.username });
    }
    return res.status(401).json({ success: false, message: 'Usuario o contraseña incorrectos' });
});

// Register route
app.post('/register', (req, res) => {
    const username = req.body.username?.trim();
    const password = req.body.password?.trim();

    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Usuario y contraseña son obligatorios' });
    }

    const userExists = users.some(u => u.username === username);
    if (userExists) {
        return res.status(400).json({ success: false, message: 'El usuario ya existe' });
    }
    users.push({ username, password });
    return res.json({ success: true, username });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
