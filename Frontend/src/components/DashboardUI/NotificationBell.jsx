import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BellIcon, Check, Eye, EyeOff, Filter } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { AnimatedList } from "../Magic UI/AnimatedList";
import { useToast } from '../../hooks/use-toast';
import useDropdownTimeout from '../../hooks/useDropdownTimeout';

const ROLE_OPTIONS = [
  { value: "all", label: "All Roles" },
  { value: "organizer", label: "Organizer" },
  { value: "participant", label: "Participant" },
  { value: "judge", label: "Judge" },
  { value: "mentor", label: "Mentor" },
  { value: "admin", label: "Admin" },
];
const READ_OPTIONS = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
  { value: "read", label: "Read" },
];

function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, action: null, notification: null });
  const [roleFilter, setRoleFilter] = useState("all");
  const [readFilter, setReadFilter] = useState("unread");
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { handleMouseEnter: bellEnter, handleMouseLeave: bellLeave } = useDropdownTimeout(setShowNotificationDropdown);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/api/notifications/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data) {
        setNotifications(data);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  // Mark as read
  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:3000/api/notifications/${id}/read`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchNotifications();
    } catch (err) {
      toast({ title: "Error", description: "Failed to mark as read." });
    }
  };

  // Mark as unread
  const markAsUnread = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:3000/api/notifications/${id}/unread`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchNotifications();
    } catch (err) {
      toast({ title: "Error", description: "Failed to mark as unread." });
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token");
      const unreadIds = notifications.filter(n => !n.read).map(n => n._id);
      await Promise.all(unreadIds.map(id =>
        fetch(`http://localhost:3000/api/notifications/${id}/read`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        })
      ));
      fetchNotifications();
    } catch (err) {
      toast({ title: "Error", description: "Failed to mark all as read." });
    }
  };

  // Accept team invite
  const handleAcceptInvite = (notification) => {
    setConfirmDialog({ open: true, action: 'accept', notification });
  };

  // Decline team invite
  const handleDeclineInvite = (notification) => {
    setConfirmDialog({ open: true, action: 'decline', notification });
  };

  // Confirm action (accept/decline)
  const handleConfirmAction = async () => {
    const { action, notification } = confirmDialog;
    if (!notification) return;
    setConfirmDialog({ open: false, action: null, notification: null });
    if (action === 'accept') {
      try {
        const token = localStorage.getItem('token');
        const inviteId = notification.link.split('/').pop();
        const res = await fetch(`http://localhost:3000/api/team-invites/${inviteId}/accept`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          toast({ title: 'Invite Accepted', description: data.message || 'You’ve joined the team!' });
          fetchNotifications();
          // Immediately redirect to registration form
          navigate(`/invite/${inviteId}?register=1`);
        } else {
          toast({ title: 'Error', description: data.error || 'Failed to accept invite.' });
        }
      } catch (err) {
        toast({ title: 'Error', description: 'Failed to accept invite.' });
      }
    } else if (action === 'decline') {
      try {
        const token = localStorage.getItem('token');
        const inviteId = notification.link.split('/').pop();
        const res = await fetch(`http://localhost:3000/api/team-invites/${inviteId}/respond`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ status: 'declined' })
        });
        const data = await res.json();
        if (res.ok) {
          toast({ title: 'Invite Declined', description: data.message || 'You have declined the invite.' });
          fetchNotifications();
        } else {
          toast({ title: 'Error', description: data.error || 'Failed to decline invite.' });
        }
      } catch (err) {
        toast({ title: 'Error', description: 'Failed to decline invite.' });
      }
    }
  };

  useEffect(() => {
    if (user) fetchNotifications();
  }, [user]);

  // Dropdown handlers
  // Toggle dropdown on bell click
  const handleBellClick = () => setShowNotificationDropdown((open) => !open);

  // Filtering logic
  const filteredNotifications = notifications.filter((n) => {
    // Read/unread filter
    if (readFilter === "read" && !n.read) return false;
    if (readFilter === "unread" && n.read) return false;
    // Role filter
    if (roleFilter !== "all") {
      if (!n.sender || n.sender.role !== roleFilter) return false;
    }
    return true;
  });

  return (
    <div className="relative" onMouseEnter={bellEnter} onMouseLeave={bellLeave}>
      <button onClick={handleBellClick}>
        <BellIcon className="w-6 h-6 text-[#1b0c3f]" />
        {notifications.filter(n => !n.read).length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
            {notifications.filter(n => !n.read).length}
          </span>
        )}
      </button>
      {showNotificationDropdown && (
        <div className="absolute right-0 mt-2 w-96 rounded-xl shadow-2xl z-50 border border-gray-200 bg-white text-sm overflow-hidden">
          <div className="p-4 border-b border-black/10 font-semibold text-lg flex items-center gap-2 justify-between">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 mr-1" />
              Filter
            </div>
            <button
              className="text-xs px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded disabled:bg-gray-300 disabled:text-gray-500"
              onClick={markAllAsRead}
              disabled={notifications.filter(n => !n.read).length === 0}
            >
              Mark All as Read
            </button>
          </div>
          {/* Filter UI */}
          <div className="flex gap-2 px-4 pb-2">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Role</label>
              <select
                className="border rounded px-2 py-1 text-xs"
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value)}
              >
                {ROLE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Status</label>
              <select
                className="border rounded px-2 py-1 text-xs"
                value={readFilter}
                onChange={e => setReadFilter(e.target.value)}
              >
                {READ_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="max-h-80 min-h-80 overflow-y-auto px-2 py-1 scrollbar-hide">
            {filteredNotifications.length === 0 ? (
              <div className="p-4 text-center text-gray-300">
                No notifications found
              </div>
            ) : (
              <AnimatedList>
                {filteredNotifications.map((n) => (
                  <div
                    key={n._id}
                    className={`group bg-white rounded-lg px-4 py-3 mb-2 border border-black/10 transition hover:scale-[101%] ${n.read ? 'opacity-60' : ''}`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="font-medium text-black ">
                        {n.message}
                        {n.sender && n.sender.role && (
                          <span className="ml-2 text-xs px-2 py-0.5 rounded bg-gray-100 border border-gray-200 text-gray-700 capitalize">
                            {n.sender.role}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-1 items-center">
                        {n.read ? (
                          <button
                            title="Mark as Unread"
                            className="p-1 rounded hover:bg-gray-200"
                            onClick={() => markAsUnread(n._id)}
                          >
                            <EyeOff className="w-4 h-4 text-gray-500" />
                          </button>
                        ) : (
                          <button
                            title="Mark as Read"
                            className="p-1 rounded hover:bg-gray-200"
                            onClick={() => markAsRead(n._id)}
                          >
                            <Eye className="w-4 h-4 text-gray-500" />
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-gray-700 mt-1">
                      {new Date(n.createdAt).toLocaleString()}
                    </div>
                    {n.type === 'team-invite' && n.status === 'pending' && (
                      <div className="flex gap-2 mt-2">
                        <button
                          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs"
                          onClick={() => handleAcceptInvite(n)}
                        >
                          Accept
                        </button>
                        <button
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                          onClick={() => handleDeclineInvite(n)}
                        >
                          Decline
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </AnimatedList>
            )}
          </div>
        </div>
      )}
      {/* Confirm Dialog (optional, can be implemented with a modal if needed) */}
      {confirmDialog.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <div className="mb-4 font-semibold text-lg">
              {confirmDialog.action === 'accept' ? 'Accept Invitation?' : 'Decline Invitation?'}
            </div>
            <div className="mb-6 text-gray-700">
              {confirmDialog.notification?.message}
            </div>
            <div className="flex gap-4 justify-end">
              <button
                className="px-4 py-2 bg-gray-200 rounded"
                onClick={() => setConfirmDialog({ open: false, action: null, notification: null })}
              >
                Cancel
              </button>
              <button
                className={`px-4 py-2 rounded text-white ${confirmDialog.action === 'accept' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                onClick={handleConfirmAction}
              >
                {confirmDialog.action === 'accept' ? 'Accept' : 'Decline'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell; 