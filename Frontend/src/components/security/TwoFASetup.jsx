import { useState } from 'react';

export default function TwoFASetup({ token }) {
  const [qr, setQr] = useState(null);
  const [secret, setSecret] = useState('');
  const [code, setCode] = useState('');
  const [enabled, setEnabled] = useState(false);
  const [error, setError] = useState('');

  const start2FA = async () => {
    setError('');
    try {
      const res = await fetch('/api/users/2fa/generate', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        setError('Failed to start 2FA');
        return;
      }
      const text = await res.text();
      if (!text) {
        setError('No response from server');
        return;
      }
      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        setError('Invalid response from server');
        return;
      }
      setQr(data.qr);
      setSecret(data.secret);
    } catch (err) {
      setError('Failed to start 2FA');
    }
  };

  const verify2FA = async () => {
    setError('');
    try {
      const res = await fetch('/api/users/2fa/verify', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: code })
      });
      if (!res.ok) {
        setError('Invalid code');
        return;
      }
      // Only parse if there is a response
      const text = await res.text();
      if (text) {
        let data;
        try {
          data = JSON.parse(text);
        } catch (err) {
          setError('Invalid response from server');
          return;
        }
        if (data.success) setEnabled(true);
        else setError('Invalid code');
      } else {
        setEnabled(true); // fallback: treat as success
      }
    } catch (err) {
      setError('Failed to verify 2FA');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded bg-white shadow">
      {!qr && (
        <button onClick={start2FA} className="px-4 py-2 bg-blue-600 text-white rounded">Enable 2FA</button>
      )}
      {qr && (
        <div className="space-y-4">
          <img src={qr} alt="Scan this QR" className="mx-auto" />
          <p className="text-center">Or enter this secret: <b>{secret}</b></p>
          <input
            type="text"
            placeholder="Enter 6-digit code"
            value={code}
            onChange={e => setCode(e.target.value)}
            className="w-full border px-2 py-1 rounded"
          />
          <button onClick={verify2FA} className="w-full px-4 py-2 bg-green-600 text-white rounded">Verify & Enable</button>
        </div>
      )}
      {enabled && <p className="text-green-600 text-center mt-4">✅ 2FA Enabled!</p>}
      {error && <p className="text-red-600 text-center mt-2">{error}</p>}
    </div>
  );
} 