const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Route to get bank details of the user
router.get('/bank-details', authMiddleware, (req, res) => {
  const user = req.user;

  if (!user) {
    return res.status(403).json({ message: 'Usuario no reconocido' });
  }

  return res.json({
    message: 'Datos bancarios obtenidos correctamente',
    accountDetails: {
      username: user.username,
      accountNumber: user.accountNumber,
      balance: user.balance,
    },
  });
});

module.exports = router;
