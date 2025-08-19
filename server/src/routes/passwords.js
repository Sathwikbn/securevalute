import express from 'express';
import CryptoJS from 'crypto-js';
import auth from '../middleware/auth.js';
import Password from '../models/Password.js';

const router = express.Router();

const AES_SECRET = process.env.AES_SECRET || 'aes_dev_secret_key_change_me';

// Helper encrypt/decrypt (server-side encryption)
function encryptPassword(plain) {
  return CryptoJS.AES.encrypt(plain, AES_SECRET).toString();
}

function decryptPassword(cipher) {
  try {
    const bytes = CryptoJS.AES.decrypt(cipher, AES_SECRET);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (e) {
    return '';
  }
}

// Get all passwords for user (without plaintext)
router.get('/', auth, async (req, res) => {
  const items = await Password.find({ userId: req.userId }).sort({ updatedAt: -1 });
  return res.json(items);
});

// Create new credential
router.post('/', auth, async (req, res) => {
  try {
    const { website, username, password, category } = req.body;
    if (!website || !username || !password) return res.status(400).json({ message: 'Missing fields' });
    const encryptedPassword = encryptPassword(password);
    const created = await Password.create({ userId: req.userId, website, username, encryptedPassword, category });
    return res.status(201).json(created);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Update credential
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { website, username, password, category } = req.body;
    const update = { website, username, category };
    if (password) update.encryptedPassword = encryptPassword(password);
    const updated = await Password.findOneAndUpdate({ _id: id, userId: req.userId }, update, { new: true });
    if (!updated) return res.status(404).json({ message: 'Not found' });
    return res.json(updated);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Delete credential
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Password.findOneAndDelete({ _id: id, userId: req.userId });
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    return res.json({ success: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Decrypt one credential temporarily
router.get('/:id/decrypt', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Password.findOne({ _id: id, userId: req.userId });
    if (!item) return res.status(404).json({ message: 'Not found' });
    const plain = decryptPassword(item.encryptedPassword);
    return res.json({ password: plain });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;

