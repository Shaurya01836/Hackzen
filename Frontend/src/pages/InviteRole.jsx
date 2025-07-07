import { useEffect, useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function InviteRole() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token, refreshUser } = useAuth();
  const [invite, setInvite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMsg, setActionMsg] = useState(null);

  // Parse token from URL
  const urlParams = new URLSearchParams(location.search);
  const inviteToken = urlParams.get('token');

  // User info is now handled by AuthContext
  console.log('AuthContext user:', user);
  console.log('AuthContext token:', !!token);

  // Fetch invite details
  useEffect(() => {
    if (!inviteToken) {
      setError('No invite token provided.');
      setLoading(false);
      return;
    }
    async function fetchInvite() {
      setLoading(true);
      try {
        console.log('Fetching invite with token:', inviteToken);
        const res = await fetch(`/api/role-invites/${inviteToken}`);
        console.log('Invite fetch response:', res.status);
        if (res.ok) {
          const data = await res.json();
          console.log('Invite data:', data);
          setInvite(data);
        } else {
          const errorData = await res.json();
          console.log('Invite fetch failed:', errorData);
          setError('Invalid or expired invite.');
        }
      } catch (error) {
        console.error('Invite fetch error:', error);
        setError('Failed to fetch invite.');
      }
      setLoading(false);
    }
    fetchInvite();
  }, [inviteToken]);

  // If not logged in, prompt login/register
  if (!token || !user) {
    return (
      <div style={{ maxWidth: 400, margin: '40px auto', textAlign: 'center' }}>
        <h2>Login Required</h2>
        <p>You must be logged in to respond to this invitation.</p>
        <button
          onClick={() => {
            // Save current location for redirect after login
            localStorage.setItem('invite_redirect', location.pathname + location.search);
            navigate(`/login?redirectTo=${encodeURIComponent(location.pathname + location.search)}`);
          }}
          style={{ padding: '10px 24px', background: '#6366f1', color: 'white', border: 'none', borderRadius: 6 }}
        >
          Login / Register
        </button>
      </div>
    );
  }

  if (loading) return <div style={{ textAlign: 'center', marginTop: 40 }}>Loading...</div>;
  if (error) return <div style={{ color: 'red', textAlign: 'center', marginTop: 40 }}>{error}</div>;
  if (!invite) return null;

  const handleAction = async (action) => {
    setActionMsg('Processing...');
    try {
      console.log('Making action request:', action);
      console.log('Using token:', !!token);
      
      const res = await fetch(`/api/role-invites/${inviteToken}/${action}`, {
        method: 'POST',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Action response status:', res.status);
      const data = await res.json();
      console.log('Action response data:', data);
      
      if (res.ok) {
        setActionMsg(data.message);
        // Update invite status
        setInvite((prev) => ({ ...prev, status: action === 'accept' ? 'accepted' : 'declined' }));
        
        // If accepted, refresh user info to get updated role
        if (action === 'accept') {
          await refreshUser();
        }
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate('/dashboard/profile');
        }, 2000);
      } else {
        setActionMsg(data.error || 'Action failed.');
      }
    } catch (error) {
      console.error('Action error:', error);
      setActionMsg('Action failed.');
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: '40px auto', padding: 24, border: '1px solid #eee', borderRadius: 8 }}>
      <h2>Invitation to become a {invite.role}</h2>
      <p><b>Hackathon:</b> {invite.hackathon?.title || 'Loading...'}</p>
      <p><b>Your Email:</b> {invite.email}</p>
      <p><b>Status:</b> {invite.status.charAt(0).toUpperCase() + invite.status.slice(1)}</p>
      {actionMsg && <div style={{ margin: '16px 0', color: '#6366f1' }}>{actionMsg}</div>}
      {invite.status === 'pending' && !actionMsg && (
        <div style={{ marginTop: 24 }}>
          <button
            onClick={() => handleAction('accept')}
            style={{ marginRight: 16, padding: '10px 24px', background: '#10B981', color: 'white', border: 'none', borderRadius: 6 }}
          >
            Accept
          </button>
          <button
            onClick={() => handleAction('decline')}
            style={{ padding: '10px 24px', background: '#EF4444', color: 'white', border: 'none', borderRadius: 6 }}
          >
            Decline
          </button>
        </div>
      )}
      {invite.status !== 'pending' && (
        <div style={{ marginTop: 24, color: '#888' }}>
          You have {invite.status} this invitation.
        </div>
      )}
    </div>
  );
} 