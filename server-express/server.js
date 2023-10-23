const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cookieParser());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
const jwt = require('jsonwebtoken');
const secretKey = '123'; // Test key as example

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  // Easy name/password as example
  if (username === 'Artem' && password === '123') {
    const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true, sameSite: 'strict', maxAge: 3600000 }); // 1 hour expiration
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: 'Incorrect username or password.' });
  }
});

//token check
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ success: false, message: 'Unauthorized' });

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.status(403).json({ success: false, message: 'Invalid token' });
    req.user = user;
    next();
  });
};
//redirect page after success authentification
app.get('/api/dashboard', authenticateToken, (req, res) => {
  const { username } = req.user;
  res.json({ success: true, message: `Welcome to the dashboard, ${username}!` });
});
//logout endpoint
app.get('/api/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logged out successfully.' });
});
