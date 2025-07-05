import { useState, useEffect } from "react";
import TwoFASetup from "../../../components/security/TwoFASetup";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";

function PrivacySecuritySection({ token }) {
  const [user, setUser] = useState(null);
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();

  // Fetch user info from backend
  const fetchUser = async () => {
    try {
      const res = await axios.get("/api/users/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data);
      setTwoFAEnabled(res.data.twoFA?.enabled || false);
      // Update context/localStorage
      login(res.data, token);
      localStorage.setItem("user", JSON.stringify(res.data));
    } catch (err) {
      console.error("Error fetching user:", err);
      setError("Failed to load user information");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleDisable2FA = async () => {
    const currentPassword = prompt("Please enter your current password to disable 2FA:");
    if (!currentPassword) return;

    setLoading(true);
    setError("");
    
    try {
      await axios.post("/api/users/2fa/disable", 
        { currentPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      await fetchUser(); // Refresh user info after disabling
      setShowSetup(false);
    } catch (err) {
      console.error("2FA disable error:", err);
      setError(err.response?.data?.message || "Failed to disable 2FA");
    } finally {
      setLoading(false);
    }
  };

  const handle2FASuccess = async () => {
    await fetchUser(); // Refresh user info after enabling
    setShowSetup(false);
  };

  const handle2FACancel = () => {
    setShowSetup(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Two-Factor Authentication (2FA)</h3>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {twoFAEnabled ? (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-green-800 font-medium">2FA is enabled</p>
                  <p className="text-green-600 text-sm">Your account is protected with two-factor authentication</p>
                </div>
              </div>
              <button
                onClick={handleDisable2FA}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? "Disabling..." : "Disable 2FA"}
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <p className="text-blue-800 font-medium">2FA is not enabled</p>
                  <p className="text-blue-600 text-sm">Add an extra layer of security to your account</p>
                </div>
              </div>
              <button
                onClick={() => setShowSetup(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Enable 2FA
              </button>
            </div>
          </div>
        )}
      </div>

      {showSetup && (
        <div className="border-t pt-6">
          <TwoFASetup 
            token={token} 
            onSuccess={handle2FASuccess}
            onCancel={handle2FACancel}
          />
        </div>
      )}
    </div>
  );
}

export default PrivacySecuritySection; 