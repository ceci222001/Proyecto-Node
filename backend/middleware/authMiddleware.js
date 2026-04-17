const users = require('../db/users');

const authMiddleware = (req, res, next) => {
    const username = req.query.username?.trim();

  if (!username) {
    return res.status(400).json({ message: 'Falta el usuario' });
  }

  const user = users.find(user => user.username === username);
  
  if (!user) {
    return res.status(403).json({ message: 'Usuario no reconocido' });
  }

  req.user = user;
  next();
};

module.exports = authMiddleware;
