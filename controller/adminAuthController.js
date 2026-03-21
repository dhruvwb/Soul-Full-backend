const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AdminUser = require('../models/adminUserModel');

const ensureSeedAdmin = async () => {
  const email = (process.env.ADMIN_EMAIL || 'tiwarivaibhavi123@gmail.com').toLowerCase();
  const password = process.env.ADMIN_PASSWORD || 'admin@123';

  const existing = await AdminUser.findOne({ email });
  if (existing) {
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await AdminUser.create({ email, passwordHash, name: 'Admin', role: 'admin' });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await AdminUser.findOne({ email: String(email || '').toLowerCase() });

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const ok = await bcrypt.compare(password || '', user.passwordHash);
  if (!ok) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role, name: user.name },
    process.env.JWT_SECRET || 'change-me',
    { expiresIn: '7d' }
  );

  return res.json({
    token,
    user: { email: user.email, role: user.role, name: user.name }
  });
};

module.exports = { login, ensureSeedAdmin };
