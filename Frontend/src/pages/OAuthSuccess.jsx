// pages/OAuthSuccess.jsx
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function OAuthSuccess() {
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    const name = searchParams.get("name");
    const email = searchParams.get("email");

    if (token && name && email) {
      login({ name, email }, token); // ✅ Save to AuthContext/localStorage
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  }, []);

  return <div className="text-center mt-20 text-lg">Logging you in via OAuth...</div>;
}

export default OAuthSuccess;
