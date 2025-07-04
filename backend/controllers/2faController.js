const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const User = require('../model/UserModel');

exports.generate2FA = async (req, res) => {
  try {
    const secret = speakeasy.generateSecret({ name: `YourApp (${req.user.email})` });
    req.user.twoFA = { enabled: false, secret: secret.base32 };
    await req.user.save();

    const otpauth_url = secret.otpauth_url;
    qrcode.toDataURL(otpauth_url, (err, data_url) => {
      if (err) return res.status(500).json({ message: 'QR code error' });
      res.json({ qr: data_url, secret: secret.base32 });
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to generate 2FA', error: err.message });
  }
};

exports.verify2FA = async (req, res) => {
  try {
    const { token } = req.body;
    const user = req.user;
    const verified = speakeasy.totp.verify({
      secret: user.twoFA.secret,
      encoding: 'base32',
      token,
    });
    if (verified) {
      user.twoFA.enabled = true;
      await user.save();
      return res.json({ success: true });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid code' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Failed to verify 2FA', error: err.message });
  }
};

exports.login2FA = async (req, res) => {
  const { userId, token } = req.body;
  const user = await User.findById(userId);
  if (!user || !user.twoFA.enabled) return res.status(400).json({ message: '2FA not enabled' });

  const verified = speakeasy.totp.verify({
    secret: user.twoFA.secret,
    encoding: 'base32',
    token,
  });
  if (!verified) return res.status(400).json({ message: 'Invalid 2FA code' });

  // Issue JWT/session here (pseudo-code, replace with your logic)
  // const token = generateJWT(user._id);
  // res.json({ success: true, token, user });
  res.json({ success: true, user });
};

exports.disable2FA = async (req, res) => {
  try {
    req.user.twoFA = { enabled: false, secret: null };
    await req.user.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Failed to disable 2FA' });
  }
}; 