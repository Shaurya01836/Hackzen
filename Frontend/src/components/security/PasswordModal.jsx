import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../DashboardUI/dialog";
import { Button } from "../CommonUI/button";
import { Input } from "../CommonUI/input";
import { Label } from "../CommonUI/label";

export default function PasswordModal({ isOpen, onClose, onConfirm, loading, error }) {
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setPassword('');
      setLocalError('');
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!password.trim()) {
      setLocalError('Password is required');
      return;
    }
    setLocalError('');
    onConfirm(password);
  };

  const handleCancel = () => {
    setPassword('');
    setLocalError('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Disable Two-Factor Authentication
          </DialogTitle>
          <DialogDescription>
            Enter your current password to disable 2FA. This will remove the extra security layer from your account.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Current Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (localError) setLocalError('');
              }}
              placeholder="Enter your current password"
              disabled={loading}
              autoFocus
            />
            {(localError || error) && (
              <p className="text-sm text-red-600">{localError || error}</p>
            )}
          </div>
          
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={loading || !password.trim()}
            >
              {loading ? 'Disabling...' : 'Disable 2FA'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 