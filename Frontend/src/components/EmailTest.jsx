import React, { useState } from 'react';
import { Button } from '../components/DashboardUI/button';

const EmailTest = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const testEmail = async () => {
    if (!email) {
      alert('Please enter an email address');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/test/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ recipientEmail: email })
      });

      const data = await response.json();

      if (response.ok) {
        setResult({
          success: true,
          message: data.message,
          messageId: data.messageId
        });
      } else {
        setResult({
          success: false,
          message: data.message || 'Failed to send test email',
          error: data.error
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: 'Network error',
        error: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">🧪 Email Test</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Test Email Address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email address to test"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <Button
        onClick={testEmail}
        disabled={loading || !email}
        className="w-full"
      >
        {loading ? 'Sending Test Email...' : 'Send Test Email'}
      </Button>

      {result && (
        <div className={`mt-4 p-4 rounded-md ${
          result.success 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          <h3 className="font-semibold mb-2">
            {result.success ? '✅ Success' : '❌ Error'}
          </h3>
          <p className="text-sm">{result.message}</p>
          {result.messageId && (
            <p className="text-xs mt-1">Message ID: {result.messageId}</p>
          )}
          {result.error && (
            <p className="text-xs mt-1 text-red-600">{result.error}</p>
          )}
        </div>
      )}

      <div className="mt-4 text-xs text-gray-600">
        <p>This will send a test winner email to verify SMTP configuration.</p>
        <p>Check your email configuration in the backend .env file.</p>
      </div>
    </div>
  );
};

export default EmailTest; 