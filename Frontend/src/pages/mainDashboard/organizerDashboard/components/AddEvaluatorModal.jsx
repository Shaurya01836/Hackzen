import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../../components/DashboardUI/dialog';
import { X, UserPlus, Mail, User, Building, CheckCircle } from 'lucide-react';
import { useToast } from '../../../../hooks/use-toast';

export default function AddEvaluatorModal({
  open,
  onClose,
  hackathonId,
  onEvaluatorAdded,
  defaultJudgeType = 'platform',
  hideJudgeTypeSelection = false,
  editingJudge = null
}) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    judgeEmail: '',
    firstName: '',
    lastName: '',
    mobile: '',
    judgeType: defaultJudgeType,
    sponsorCompany: '',
    canJudgeSponsoredPS: false,
    maxSubmissionsPerJudge: 50,
    sendEmail: true
  });

  // Update form data when defaultJudgeType changes or when editing
  useEffect(() => {
    if (editingJudge) {
      setFormData({
        judgeEmail: editingJudge.judge?.email || '',
        firstName: editingJudge.judge?.name?.split(' ')[0] || '',
        lastName: editingJudge.judge?.name?.split(' ').slice(1).join(' ') || '',
        mobile: editingJudge.judge?.mobile || '',
        judgeType: editingJudge.judge?.type || defaultJudgeType,
        sponsorCompany: editingJudge.judge?.sponsorCompany || '',
        canJudgeSponsoredPS: editingJudge.judge?.canJudgeSponsoredPS || false,
        maxSubmissionsPerJudge: editingJudge.maxSubmissionsPerJudge || 50,
        sendEmail: false // Don't send email when editing
      });
    } else {
      setFormData(prev => ({
        ...prev,
        judgeType: defaultJudgeType
      }));
    }
  }, [defaultJudgeType, editingJudge]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.judgeEmail || !formData.judgeEmail.includes('@')) {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address.',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.firstName.trim()) {
      toast({
        title: 'Missing Name',
        description: 'Please enter the evaluator\'s first name.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/judge-management/hackathons/${hackathonId}/assign-judges`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          judgeAssignments: [formData]
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add evaluator');
      }

      const result = await response.json();
      
      if (result.results && result.results.length > 0) {
        const firstResult = result.results[0];
        if (firstResult.success) {
          toast({
            title: 'Evaluator Added Successfully',
            description: `Invitation sent to ${formData.judgeEmail}. They will receive an email to accept the role.`,
            variant: 'default',
          });
          
          // Reset form
          setFormData({
            judgeEmail: '',
            firstName: '',
            lastName: '',
            mobile: '',
            judgeType: defaultJudgeType,
            sponsorCompany: '',
            canJudgeSponsoredPS: false,
            maxSubmissionsPerJudge: 50,
            sendEmail: true
          });
          
          if (onClose) onClose();
          if (onEvaluatorAdded) onEvaluatorAdded();
        } else {
          throw new Error(firstResult.error || 'Failed to add evaluator');
        }
      } else {
        throw new Error('No results returned from server');
      }
      
    } catch (error) {
      console.error('Error adding evaluator:', error);
      toast({
        title: 'Failed to Add Evaluator',
        description: error.message || 'An error occurred while adding the evaluator.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const judgeTypes = [
    { value: 'platform', label: 'Platform Judge', description: 'Can judge general problem statements' },
    { value: 'sponsor', label: 'Sponsor Judge', description: 'Can judge sponsored problem statements' },
    { value: 'hybrid', label: 'Hybrid Judge', description: 'Can judge both general and sponsored problem statements' }
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-blue-600" />
            {editingJudge ? 'Edit Evaluator' : 'Add Evaluator'}
          </DialogTitle>
          <p className="text-sm text-gray-600 mt-2">
            {editingJudge ? 'Update evaluator information for this hackathon.' : 'Invite a new evaluator to judge submissions for this hackathon.'}
          </p>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Mail className="w-4 h-4 inline mr-1" />
              Email Address *
            </label>
            <input
              type="email"
              name="judgeEmail"
              value={formData.judgeEmail}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="evaluator@example.com"
              required
            />
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <User className="w-4 h-4 inline mr-1" />
                First Name *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="John"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <User className="w-4 h-4 inline mr-1" />
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Doe"
              />
            </div>
          </div>

          {/* Mobile */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <User className="w-4 h-4 inline mr-1" />
              Mobile Number
            </label>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="+1234567890"
            />
          </div>

          {/* Judge Type */}
          {!hideJudgeTypeSelection && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Building className="w-4 h-4 inline mr-1" />
                Judge Type
              </label>
              <div className="space-y-2">
                {judgeTypes.map((type) => (
                  <label key={type.value} className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="judgeType"
                      value={type.value}
                      checked={formData.judgeType === type.value}
                      onChange={handleInputChange}
                      className="mt-1 h-4 w-4 text-blue-600"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">{type.label}</div>
                      <div className="text-xs text-gray-500">{type.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Sponsor Company (only for sponsor judges) */}
          {formData.judgeType === 'sponsor' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Building className="w-4 h-4 inline mr-1" />
                Sponsor Company *
              </label>
              <input
                type="text"
                name="sponsorCompany"
                value={formData.sponsorCompany}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Company Name"
                required={formData.judgeType === 'sponsor'}
              />
            </div>
          )}

          {/* Can Judge Sponsored PS (for platform judges) */}
          {formData.judgeType === 'platform' && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="canJudgeSponsoredPS"
                checked={formData.canJudgeSponsoredPS}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600"
              />
              <label className="text-sm text-gray-700">
                Can judge sponsored problem statements
              </label>
            </div>
          )}

          {/* Max Submissions */}
          
          {/* Send Email */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="sendEmail"
              checked={formData.sendEmail}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600"
            />
            <label className="text-sm text-gray-700">
              Send invitation email immediately
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? (editingJudge ? 'Updating...' : 'Adding...') : (editingJudge ? 'Update Evaluator' : 'Add Evaluator')}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 