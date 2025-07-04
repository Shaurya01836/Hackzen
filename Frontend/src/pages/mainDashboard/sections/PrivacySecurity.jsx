import { useState, useEffect } from "react";
import TwoFASetup from "../../../components/Security/TwoFASetup";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";

function PrivacySecuritySection({ token }) {
  const [user, setUser] = useState(null);
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
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
      // handle error
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleDisable2FA = async () => {
    try {
      await axios.post("/api/users/2fa/disable", {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUser(); // Refresh user info after disabling
      setShowSetup(false);
    } catch (err) {
      alert("Failed to disable 2FA");
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Two-Factor Authentication (2FA)</h3>
      {twoFAEnabled ? (
        <div>
          <p className="text-green-600 mb-2">2FA is enabled on your account.</p>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded"
            onClick={handleDisable2FA}
          >
            Disable 2FA
          </button>
        </div>
      ) : (
        <div>
          <p className="text-gray-600 mb-2">Add extra security to your account.</p>
          {showSetup ? (
            <TwoFASetup token={token} />
          ) : (
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded"
              onClick={() => setShowSetup(true)}
            >
              Enable 2FA
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default PrivacySecuritySection; 