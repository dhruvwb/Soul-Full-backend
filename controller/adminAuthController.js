const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getAllDocs, createDoc, queryDocs } = require('../utils/firestoreHelpers');

const ensureSeedAdmin = async () => {
  const email = (process.env.ADMIN_EMAIL || 'tiwarivaibhavi123@gmail.com').toLowerCase();
  const password = process.env.ADMIN_PASSWORD || 'admin@123';

  const allUsers = await getAllDocs('adminUsers');
  const existing = allUsers.find(u => u.email === email);
  if (existing) {
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await createDoc('adminUsers', { email, passwordHash, name: 'Admin', role: 'admin' });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const allUsers = await getAllDocs('adminUsers');
  const user = allUsers.find(u => u.email === String(email || '').toLowerCase());

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const ok = await bcrypt.compare(password || '', user.passwordHash);
  if (!ok) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    process.env.JWT_SECRET || 'change-me',
    { expiresIn: '7d' }
  );

  return res.json({
    token,
    user: { email: user.email, role: user.role, name: user.name }
  });
};

module.exports = { login, ensureSeedAdmin };
