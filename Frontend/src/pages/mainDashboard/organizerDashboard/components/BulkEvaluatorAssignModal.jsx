import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../../components/DashboardUI/dialog';
import { X, Search, UserPlus, ChevronDown } from 'lucide-react';
import { useToast } from '../../../../hooks/use-toast';

export default function BulkEvaluatorAssignModal({
  open,
  onClose,
  selectedCount = 0,
  onAssign,
  allEvaluators = [], // all possible judges
  initialSelected = [], // array of assigned judge ids
  hackathonId, // required
  roundIndex = 0, // which round we're assigning for
  selectedSubmissionIds = [], // array of selected submission IDs
}) {
  const { toast } = useToast();
  const [evaluatorSearch, setEvaluatorSearch] = useState("");
  const [selectedEvaluators, setSelectedEvaluators] = useState([]);
  const [assignCounts, setAssignCounts] = useState({});
  const [localEvaluators, setLocalEvaluators] = useState([]); // for added evaluators
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addForm, setAddForm] = useState({ firstName: '', lastName: '', email: '', mobile: '', sendEmail: true });
  const [addTouched, setAddTouched] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignmentMode, setAssignmentMode] = useState('manual'); // 'manual' or 'equal'

  useEffect(() => {
    if (open) {
      setSelectedEvaluators([]);
      setAssignCounts({});
      setLocalEvaluators([]);
      setEvaluatorSearch("");
      setAssignmentMode('manual');
    }
  }, [open]);

  // Combine allEvaluators and localEvaluators
  const allEvalList = [...allEvaluators, ...localEvaluators];
  
  // Unassigned = not in selectedEvaluators
  const unassignedEvaluators = allEvalList.filter(ev => !selectedEvaluators.includes(ev.id));
  const filteredUnassigned = unassignedEvaluators.filter(ev =>
    ev.name.toLowerCase().includes(evaluatorSearch.toLowerCase()) ||
    ev.email.toLowerCase().includes(evaluatorSearch.toLowerCase())
  );

  const handleEvaluatorToggle = (id) => {
    setSelectedEvaluators(prev =>
      prev.includes(id) ? prev.filter(eid => eid !== id) : [...prev, id]
    );
  };

  const handleAssign = async () => {
    if (selectedEvaluators.length === 0) {
      toast({
        title: 'No evaluators selected',
        description: 'Please select at least one evaluator to assign submissions.',
        variant: 'destructive',
      });
      return;
    }

    setAssignLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Prepare evaluator assignments
      const evaluatorAssignments = selectedEvaluators.map(evaluatorId => {
        const evaluator = allEvalList.find(e => e.id === evaluatorId);
        return {
          evaluatorId,
          maxSubmissions: parseInt(assignCounts[evaluatorId] || 0) || Math.ceil(selectedCount / selectedEvaluators.length),
          evaluatorEmail: evaluator?.email,
          evaluatorName: evaluator?.name
        };
      });

      const response = await fetch(`/api/judge-management/hackathons/${hackathonId}/bulk-assign-submissions`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({
          submissionIds: selectedSubmissionIds, // This will be filled by the backend based on selected submissions
          evaluatorAssignments,
          assignmentMode,
          roundIndex
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to assign submissions');
      }

      const result = await response.json();
      
      toast({
        title: 'Assignments completed successfully',
        description: `Assigned ${selectedCount} submissions to ${selectedEvaluators.length} evaluators.`,
        variant: 'default',
      });

      // Reset form
      setSelectedEvaluators([]);
      setAssignCounts({});
      setLocalEvaluators([]);
      setEvaluatorSearch("");
      setAssignmentMode('manual');
      
      if (onClose) onClose();
      
    } catch (error) {
      console.error('Assignment error:', error);
      toast({
        title: 'Assignment failed',
        description: error.message || 'Failed to assign submissions to evaluators.',
        variant: 'destructive',
      });
    } finally {
      setAssignLoading(false);
    }
  };

  const handleCountChange = (id, value) => {
    const numValue = parseInt(value.replace(/[^0-9]/g, '')) || 0;
    setAssignCounts(prev => ({ ...prev, [id]: numValue }));
  };

  const handleAssignEqually = () => {
    if (selectedEvaluators.length === 0) return;
    
    const equalCount = Math.ceil(selectedCount / selectedEvaluators.length);
    const newCounts = {};
    selectedEvaluators.forEach(id => {
      newCounts[id] = equalCount;
    });
    setAssignCounts(newCounts);
    setAssignmentMode('equal');
  };

  // Add Evaluator Modal logic
  const handleAddEvaluator = async (e) => {
    e.preventDefault();
    setAddTouched(true);
    if (!addForm.firstName || !addForm.email) return;
    if (!hackathonId) {
      toast({
        title: 'Error',
        description: 'No hackathonId provided!',
        variant: 'destructive',
      });
      return;
    }
    
    setAddLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/judge-management/hackathons/${hackathonId}/assign-judges`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          judgeAssignments: [{
            judgeEmail: addForm.email,
            judgeType: 'platform',
            sponsorCompany: '',
            canJudgeSponsoredPS: false,
            maxSubmissionsPerJudge: 50,
            firstName: addForm.firstName,
            lastName: addForm.lastName,
            mobile: addForm.mobile,
            sendEmail: addForm.sendEmail,
          }],
        }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to assign judge');
      }
      
      const newEvaluator = {
        id: addForm.email,
        name: addForm.firstName + (addForm.lastName ? ' ' + addForm.lastName : ''),
        email: addForm.email,
        mobile: addForm.mobile,
      };
      
      setLocalEvaluators(prev => [...prev, newEvaluator]);
      setAddForm({ firstName: '', lastName: '', email: '', mobile: '', sendEmail: true });
      setAddModalOpen(false);
      setAddTouched(false);
      
      toast({
        title: 'Evaluator added successfully',
        description: addForm.sendEmail ? 'Email invitation sent to the evaluator.' : 'Evaluator added without email notification.',
        variant: 'default',
      });
    } catch (err) {
      console.error('Add evaluator error:', err);
      toast({
        title: 'Failed to add evaluator',
        description: err.message || 'An error occurred while adding the evaluator.',
        variant: 'destructive',
      });
    } finally {
      setAddLoading(false);
    }
  };

  const isAddDisabled = !addForm.firstName || !addForm.email;
  const isAssignDisabled = selectedEvaluators.length === 0 || assignLoading;

  if (!hackathonId) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-lg w-full">
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
          </DialogHeader>
          <div className="text-red-600 p-4">No hackathonId provided to BulkEvaluatorAssignModal.</div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-full">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Assign Evaluators "{selectedCount} Candidates"</DialogTitle>
          <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600" onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </DialogHeader>
        
        {/* Selected Evaluators Section */}
        {selectedEvaluators.length > 0 && (
          <div className="mb-6">
            <div className="text-sm font-semibold mb-3 flex items-center justify-between">
              <span>Select Evaluator</span>
              <button 
                className="text-blue-600 text-xs font-semibold flex items-center gap-1 hover:text-blue-700" 
                onClick={handleAssignEqually}
              >
                Assign Equally <ChevronDown className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-3">
              {selectedEvaluators.map(id => {
                const ev = allEvalList.find(e => e.id === id);
                if (!ev) return null;
                
                return (
                  <div key={id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
                    <input 
                      type="checkbox" 
                      checked 
                      onChange={() => handleEvaluatorToggle(id)}
                      className="h-4 w-4 text-blue-600"
                    />
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                      {ev.name.split(' ').map(n => n[0]).join('').slice(0,2)}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 text-sm">{ev.name}</div>
                      <div className="text-xs text-gray-500">{ev.email}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="rounded-full border border-gray-200 p-1 bg-white text-gray-500 hover:text-blue-600" title="Assign equally">
                        <UserPlus className="w-4 h-4" />
                      </button>
                      <input
                        type="number"
                        min="0"
                        max={selectedCount}
                        className="w-16 border border-gray-200 rounded-lg px-2 py-1 text-sm text-center"
                        value={assignCounts[id] || "0"}
                        onChange={e => handleCountChange(id, e.target.value)}
                        placeholder="0"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Unassigned Evaluators Section */}
        <div className="mb-4">
          <div className="text-sm font-semibold mb-3">Unassigned Evaluators</div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              className="w-full border border-gray-200 rounded-lg pl-10 pr-3 py-2 text-sm"
              placeholder="Search Evaluator by name and email"
              value={evaluatorSearch}
              onChange={e => setEvaluatorSearch(e.target.value)}
            />
          </div>
        </div>
        
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {filteredUnassigned.length === 0 ? (
            <div className="text-gray-400 text-sm text-center py-4">No unassigned evaluators found.</div>
          ) : filteredUnassigned.map(ev => (
            <div key={ev.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
              <input 
                type="checkbox" 
                checked={false} 
                onChange={() => handleEvaluatorToggle(ev.id)}
                className="h-4 w-4 text-blue-600"
              />
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
                {ev.name.split(' ').map(n => n[0]).join('').slice(0,2)}
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900 text-sm">{ev.name}</div>
                <div className="text-xs text-gray-500">{ev.email}</div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Bottom Action Bar */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
          <button 
            className="flex items-center gap-2 text-gray-700 hover:text-blue-700 font-medium text-sm" 
            onClick={() => setAddModalOpen(true)}
          >
            <UserPlus className="w-4 h-4" />
            Evaluator
          </button>
          <button 
            className="bg-gray-300 text-gray-500 px-6 py-2 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed" 
            onClick={handleAssign} 
            disabled={isAssignDisabled}
          >
            {assignLoading ? 'Assigning...' : 'Assign'}
          </button>
        </div>
        
        {/* Add Evaluator Modal */}
        <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
          <DialogContent className="max-w-md w-full">
            <DialogHeader>
              <DialogTitle>Add Evaluator</DialogTitle>
              <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600" onClick={() => setAddModalOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </DialogHeader>
            <form onSubmit={handleAddEvaluator} className="space-y-4 mt-2">
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">First Name <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" 
                    value={addForm.firstName} 
                    onChange={e => setAddForm(f => ({ ...f, firstName: e.target.value }))} 
                    required 
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Last Name</label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" 
                    value={addForm.lastName} 
                    onChange={e => setAddForm(f => ({ ...f, lastName: e.target.value }))} 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Official Email <span className="text-red-500">*</span></label>
                <input 
                  type="email" 
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" 
                  value={addForm.email} 
                  onChange={e => setAddForm(f => ({ ...f, email: e.target.value }))} 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Mobile</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" 
                  value={addForm.mobile} 
                  onChange={e => setAddForm(f => ({ ...f, mobile: e.target.value }))} 
                />
              </div>
              <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-3 py-2">
                <label className="flex-1 text-sm font-medium">Send E-mail to this user</label>
                <input 
                  type="checkbox" 
                  className="h-4 w-4" 
                  checked={addForm.sendEmail} 
                  onChange={e => setAddForm(f => ({ ...f, sendEmail: e.target.checked }))} 
                />
              </div>
              <div className="flex justify-end mt-6">
                <button 
                  type="submit" 
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50" 
                  disabled={isAddDisabled || addLoading}
                >
                  {addLoading ? 'Adding...' : 'Add Evaluator'}
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
} 