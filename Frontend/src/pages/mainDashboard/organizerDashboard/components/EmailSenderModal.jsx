import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../../components/DashboardUI/dialog';
import { Button } from '../../../../components/CommonUI/button';
import { Checkbox } from '../../../../components/DashboardUI/checkbox';
import { Badge } from '../../../../components/CommonUI/badge';
import { Crown, Mail, Users, Trophy, AlertCircle } from 'lucide-react';

const EmailSenderModal = ({ 
  isOpen, 
  onClose, 
  hackathonId, 
  hackathonTitle,
  onEmailSent 
}) => {
  const [loading, setLoading] = useState(false);
  const [includeShortlisted, setIncludeShortlisted] = useState(false);
  const [winners, setWinners] = useState([]);
  const [shortlistedCount, setShortlistedCount] = useState(0);
  const [emailPreview, setEmailPreview] = useState(null);
  const [emailConfig, setEmailConfig] = useState({
    smtpConfigured: false,
    testEmail: ''
  });

  // Fetch winners and shortlisted participants
  useEffect(() => {
    if (isOpen && hackathonId) {
      fetchWinnersData();
      checkEmailConfiguration();
    }
  }, [isOpen, hackathonId]);

  const fetchWinnersData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch winners
      const winnersResponse = await fetch(`/api/judge-management/hackathons/${hackathonId}/rounds/1/winners`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (winnersResponse.ok) {
        const winnersData = await winnersResponse.json();
        setWinners(winnersData.winners || []);
      }

      // Fetch shortlisted count using the correct endpoint
      const shortlistedResponse = await fetch(`/api/judge-management/hackathons/${hackathonId}/rounds/1/leaderboard`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (shortlistedResponse.ok) {
        const shortlistedData = await shortlistedResponse.json();
        const shortlistedCount = shortlistedData.leaderboard?.filter(entry => entry.status === 'shortlisted').length || 0;
        setShortlistedCount(shortlistedCount);
      }
    } catch (error) {
      console.error('Error fetching winners data:', error);
    }
  };

  const checkEmailConfiguration = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/test/test-email-config', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const config = await response.json();
        setEmailConfig({
          smtpConfigured: config.configured,
          testEmail: config.testEmail || ''
        });
      } else {
        console.error('Failed to check email configuration:', response.status);
        setEmailConfig({
          smtpConfigured: false,
          testEmail: ''
        });
      }
    } catch (error) {
      console.error('Error checking email configuration:', error);
      setEmailConfig({
        smtpConfigured: false,
        testEmail: ''
      });
    }
  };

  const generateEmailPreview = () => {
    if (winners.length === 0) return null;

    const sampleWinner = winners[0];
    const previewData = {
      winnerData: {
        _id: sampleWinner._id,
        projectTitle: sampleWinner.projectTitle,
        teamName: sampleWinner.teamName,
        leaderName: sampleWinner.leaderName,
        pptScore: sampleWinner.pptScore,
        projectScore: sampleWinner.projectScore,
        combinedScore: sampleWinner.combinedScore
      },
      hackathonData: {
        title: hackathonTitle,
        winners: winners.map((winner, index) => ({
          _id: winner._id,
          projectTitle: winner.projectTitle,
          teamName: winner.teamName,
          combinedScore: winner.combinedScore,
          position: index + 1
        }))
      },
      position: 1
    };

    return previewData;
  };

  const sendEmails = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/judge-management/hackathons/${hackathonId}/send-winner-emails`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          includeShortlisted
        })
      });

      const data = await response.json();

      if (response.ok) {
        onEmailSent?.(data);
        onClose();
      } else {
        throw new Error(data.message || 'Failed to send emails');
      }
    } catch (error) {
      console.error('Error sending emails:', error);
      alert(`Failed to send emails: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testEmailConfiguration = async () => {
    if (!emailConfig.testEmail) {
      alert('Please enter a test email address first');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/test/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          recipientEmail: emailConfig.testEmail
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert(`✅ Test email sent successfully! Check ${emailConfig.testEmail} for the test email.`);
      } else {
        throw new Error(data.message || data.error || 'Failed to send test email');
      }
    } catch (error) {
      console.error('Error sending test email:', error);
      let errorMessage = error.message;
      
      if (error.message.includes('Unexpected token')) {
        errorMessage = 'Server error: Invalid response format. Please check your backend configuration.';
      } else if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Network error: Cannot connect to the server. Please check if the backend is running.';
      }
      
      alert(`❌ Failed to send test email: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const previewData = generateEmailPreview();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" aria-describedby="email-sender-description">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-600" />
            Send Winner Emails
          </DialogTitle>
        </DialogHeader>
        <div id="email-sender-description" className="sr-only">
          Modal for sending winner emails to participants with options for winners and shortlisted participants
        </div>

        <div className="space-y-6">
          {/* Email Configuration Status */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Email Configuration
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant={emailConfig.smtpConfigured ? "default" : "destructive"}>
                  {emailConfig.smtpConfigured ? "✅ Configured" : "❌ Not Configured"}
                </Badge>
                <span className="text-sm text-gray-600">
                  {emailConfig.smtpConfigured 
                    ? "SMTP is properly configured" 
                    : "Please configure SMTP settings in backend/.env file"
                  }
                </span>
              </div>
              
              {!emailConfig.smtpConfigured && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
                  <p><strong>To configure emails:</strong></p>
                  <ol className="list-decimal list-inside mt-1 space-y-1">
                    <li>Add SMTP settings to backend/.env file</li>
                    <li>Restart the backend server</li>
                    <li>Test the configuration below</li>
                  </ol>
                </div>
              )}
            </div>
          </div>

          {/* Test Email Configuration */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Test Email Configuration</h3>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter test email address"
                value={emailConfig.testEmail}
                onChange={(e) => setEmailConfig(prev => ({ ...prev, testEmail: e.target.value }))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
              />
              <Button
                onClick={testEmailConfiguration}
                disabled={loading || !emailConfig.testEmail}
                variant="outline"
                size="sm"
              >
                {loading ? 'Sending...' : 'Test Email'}
              </Button>
            </div>
          </div>

          {/* Email Recipients */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Users className="w-4 h-4" />
              Email Recipients
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Winners */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="w-4 h-4 text-yellow-600" />
                  <span className="font-medium">Winners</span>
                  <Badge variant="default">{winners.length}</Badge>
                </div>
                <p className="text-sm text-gray-600">
                  All winners will receive congratulatory emails with their position and scores.
                </p>
                {winners.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {winners.slice(0, 3).map((winner, index) => (
                      <div key={winner._id} className="text-xs bg-white p-2 rounded border">
                        <span className="font-medium">{index + 1}. {winner.teamName}</span>
                        <br />
                        <span className="text-gray-500">{winner.projectTitle}</span>
                      </div>
                    ))}
                    {winners.length > 3 && (
                      <div className="text-xs text-gray-500">
                        +{winners.length - 3} more winners
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Shortlisted */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">Shortlisted Participants</span>
                  <Badge variant="secondary">{shortlistedCount}</Badge>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Checkbox
                    id="includeShortlisted"
                    checked={includeShortlisted}
                    onCheckedChange={setIncludeShortlisted}
                  />
                  <label htmlFor="includeShortlisted" className="text-sm">
                    Send emails to shortlisted participants
                  </label>
                </div>
                <p className="text-sm text-gray-600">
                  Shortlisted participants will receive encouraging emails with the winners list.
                </p>
              </div>
            </div>
          </div>

          {/* Email Preview */}
          {previewData && (
            <div className="space-y-4">
              <h3 className="font-semibold">Email Preview</h3>
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="space-y-2">
                  <div>
                    <strong>Subject:</strong> 🏆 Congratulations! You're a Winner - {hackathonTitle}
                  </div>
                  <div>
                    <strong>Recipient:</strong> {previewData.winnerData.leaderName}
                  </div>
                  <div>
                    <strong>Position:</strong> {previewData.position === 1 ? '🥇 1st Place' : 
                      previewData.position === 2 ? '🥈 2nd Place' : 
                      previewData.position === 3 ? '🥉 3rd Place' : 
                      `${previewData.position}th Place`}
                  </div>
                  <div>
                    <strong>Project:</strong> {previewData.winnerData.projectTitle}
                  </div>
                  <div>
                    <strong>Team:</strong> {previewData.winnerData.teamName}
                  </div>
                  <div>
                    <strong>Scores:</strong> PPT: {previewData.winnerData.pptScore}/10, 
                    Project: {previewData.winnerData.projectScore}/10, 
                    Combined: {previewData.winnerData.combinedScore}/10
                  </div>
                </div>
                <div className="mt-4 text-xs text-gray-500">
                  <p>📧 Email includes: Professional HTML design, winners table, motivational content</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={sendEmails}
              disabled={loading || !emailConfig.smtpConfigured || winners.length === 0}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? 'Sending Emails...' : `Send Emails to ${winners.length} Winners${includeShortlisted ? ` + ${shortlistedCount} Shortlisted` : ''}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmailSenderModal; 