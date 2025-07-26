import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../../components/DashboardUI/dialog';
import { X, Search, UserPlus, ChevronDown, CheckCircle, Clock, XCircle, Users, FileText } from 'lucide-react';
import { useToast } from '../../../../hooks/use-toast';
import AddEvaluatorModal from './AddEvaluatorModal';

export default function BulkEvaluatorAssignModal({
  open,
  onClose,
  selectedCount = 0,
  onAssign,
  hackathonId,
  roundIndex = 0,
  selectedSubmissionIds = [],
  onAssignmentComplete,
}) {
  const { toast } = useToast();
  const [evaluatorSearch, setEvaluatorSearch] = useState("");
  const [selectedEvaluators, setSelectedEvaluators] = useState([]);
  const [assignCounts, setAssignCounts] = useState({});
  const [allEvaluators, setAllEvaluators] = useState([]);
  const [loading, setLoading] = useState(false);
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignmentMode, setAssignmentMode] = useState('manual'); // 'manual' or 'equal'
  
  // New state for multiple judges per project
  const [multipleJudgesMode, setMultipleJudgesMode] = useState(false);
  const [judgesPerProject, setJudgesPerProject] = useState(1);
  const [judgesPerProjectMode, setJudgesPerProjectMode] = useState('manual'); // 'manual' or 'equal'
  const [showAddEvaluatorModal, setShowAddEvaluatorModal] = useState(false);

  // Assignment overview state
  const [assignmentOverview, setAssignmentOverview] = useState(null);
  const [overviewLoading, setOverviewLoading] = useState(false);



  // Fetch evaluators when modal opens
  useEffect(() => {
    if (open && hackathonId) {
      fetchEvaluators();
      fetchAssignmentOverview();
    }
  }, [open, hackathonId, roundIndex]);

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setSelectedEvaluators([]);
      setAssignCounts({});
      setEvaluatorSearch("");
      setAssignmentMode('manual');
      setMultipleJudgesMode(false);
      setJudgesPerProject(1);
      setJudgesPerProjectMode('manual');
      setShowAddEvaluatorModal(false);
    }
  }, [open]);

  const fetchEvaluators = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/judge-management/hackathons/${hackathonId}/evaluators`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setAllEvaluators(data.evaluators);
      } else {
        throw new Error('Failed to fetch evaluators');
      }
    } catch (error) {
      console.error('Error fetching evaluators:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch evaluators',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignmentOverview = async () => {
    setOverviewLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/judge-management/hackathons/${hackathonId}/assignment-overview`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setAssignmentOverview(data);
      } else {
        console.error('Failed to fetch assignment overview');
      }
    } catch (error) {
      console.error('Error fetching assignment overview:', error);
    } finally {
      setOverviewLoading(false);
    }
  };



  const handleEvaluatorAdded = () => {
    // Refresh the evaluators list
    fetchEvaluators();
    setShowAddEvaluatorModal(false);
  };

  // Filter evaluators based on search
  const filteredEvaluators = allEvaluators.filter(ev =>
    ev.name.toLowerCase().includes(evaluatorSearch.toLowerCase()) ||
    ev.email.toLowerCase().includes(evaluatorSearch.toLowerCase())
  );

  // Separate evaluators by status
  const activeEvaluators = filteredEvaluators.filter(ev => ev.status === 'active');
  const pendingEvaluators = filteredEvaluators.filter(ev => ev.status === 'pending');
  const declinedEvaluators = filteredEvaluators.filter(ev => ev.status === 'declined');

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

    if (!assignmentOverview) {
      toast({
        title: 'Assignment data not loaded',
        description: 'Please wait for assignment data to load before assigning submissions.',
        variant: 'destructive',
      });
      return;
    }

    // Refresh assignment overview to ensure we have the latest data
    await fetchAssignmentOverview();

    // Validate multiple judges per project settings
    if (multipleJudgesMode) {
      if (judgesPerProject < 1) {
        toast({
          title: 'Invalid judges per project',
          description: 'Judges per project must be at least 1.',
          variant: 'destructive',
        });
        return;
      }
      
      // Warn if more judges per project than available evaluators
      if (judgesPerProject > selectedEvaluators.length) {
        console.warn(`Warning: ${judgesPerProject} judges per project requested but only ${selectedEvaluators.length} evaluators available`);
      }
    }

    // Check if we have enough evaluators for all submissions
    const totalAssigned = selectedEvaluators.reduce((sum, id) => {
      const count = parseInt(assignCounts[id] || 0);
      return sum + count;
    }, 0);

    if (totalAssigned < selectedCount) {
      toast({
        title: 'Insufficient assignments',
        description: `You need to assign ${selectedCount} submissions, but only assigned ${totalAssigned}.`,
        variant: 'destructive',
      });
      return;
    }

    setAssignLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Filter out already assigned submissions using assignment overview data
      console.log('🔍 Debugging assignment filtering:', {
        selectedSubmissionIds,
        assignmentOverview: assignmentOverview ? {
          unassignedSubmissions: assignmentOverview.unassignedSubmissions?.map(s => s._id),
          assignedSubmissions: assignmentOverview.assignedSubmissions?.map(s => s._id),
          totalUnassigned: assignmentOverview.unassignedSubmissions?.length || 0,
          totalAssigned: assignmentOverview.assignedSubmissions?.length || 0
        } : null,
        roundIndex
      });

      // Get list of unassigned submission IDs from assignment overview
      const unassignedSubmissionIdsFromOverview = assignmentOverview?.unassignedSubmissions?.map(s => s._id) || [];
      
      console.log('🔍 Available unassigned submissions:', unassignedSubmissionIdsFromOverview);
      console.log('🔍 Selected submissions:', selectedSubmissionIds);
      
      // Filter selected submissions to only include unassigned ones
      const unassignedSubmissionIds = selectedSubmissionIds.filter(submissionId => {
        const isUnassigned = unassignedSubmissionIdsFromOverview.includes(submissionId);
        console.log(`🔍 Submission ${submissionId} is unassigned: ${isUnassigned}`);
        return isUnassigned;
      });

      if (unassignedSubmissionIds.length === 0) {
        toast({
          title: 'No unassigned submissions',
          description: `All ${selectedSubmissionIds.length} selected submissions are already assigned to judges. Only ${assignmentOverview?.unassignedSubmissions?.length || 0} submissions are available for assignment. Please select from the "Unassigned Submissions" section.`,
          variant: 'destructive',
        });
        setAssignLoading(false);
        return;
      }

      console.log(`🔍 Proceeding with assignment: ${unassignedSubmissionIds.length} unassigned submissions out of ${selectedSubmissionIds.length} selected`);

      // Prepare evaluator assignments
      const evaluatorAssignments = selectedEvaluators.map(evaluatorId => {
        const evaluator = allEvaluators.find(e => e.id === evaluatorId);
        return {
          evaluatorId,
          maxSubmissions: parseInt(assignCounts[evaluatorId] || 0),
          evaluatorEmail: evaluator?.email,
          evaluatorName: evaluator?.name
        };
      });

      console.log('🔍 Sending bulk assignment request:', {
        originalSubmissionIds: selectedSubmissionIds,
        filteredSubmissionIds: unassignedSubmissionIds,
        evaluatorAssignments,
        assignmentMode,
        roundIndex,
        multipleJudgesMode,
        judgesPerProject,
        judgesPerProjectMode
      });

      const response = await fetch(`/api/judge-management/hackathons/${hackathonId}/bulk-assign-submissions`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({
          submissionIds: unassignedSubmissionIds,
          evaluatorAssignments,
          assignmentMode,
          roundIndex,
          multipleJudgesMode,
          judgesPerProject,
          judgesPerProjectMode
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to assign submissions');
      }

      const result = await response.json();
      
      if (result.assignedSubmissions > 0) {
        toast({
          title: 'Assignments completed successfully',
          description: `Assigned ${result.assignedSubmissions} submissions to ${selectedEvaluators.length} evaluators${multipleJudgesMode ? ` with ${judgesPerProjectMode === 'manual' ? judgesPerProject : Math.ceil(selectedEvaluators.length / selectedCount)} judges per project` : ''}.`,
          variant: 'default',
        });
      } else {
        toast({
          title: 'No assignments made',
          description: 'All selected submissions were already assigned to judges.',
          variant: 'default',
        });
      }

      // Reset form
      setSelectedEvaluators([]);
      setAssignCounts({});
      setEvaluatorSearch("");
      setAssignmentMode('manual');
      setMultipleJudgesMode(false);
      setJudgesPerProject(1);
      setJudgesPerProjectMode('manual');
      
      // Refresh assignment overview and submissions status
      console.log('🔄 Refreshing assignment overview after successful assignment...');
      await fetchAssignmentOverview();
      
      // Notify parent component and close modal
      if (onAssignmentComplete) {
        console.log('🔄 Calling onAssignmentComplete callback...');
        onAssignmentComplete();
      }
      if (onClose) {
        console.log('🔄 Closing assignment modal...');
        onClose();
      }
      if (onAssign) {
        console.log('🔄 Calling onAssign callback...');
        onAssign(selectedEvaluators);
      }
      
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'declined':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Accepted';
      case 'pending':
        return 'Pending';
      case 'declined':
        return 'Declined';
      default:
        return status;
    }
  };

  const totalAssigned = selectedEvaluators.reduce((sum, id) => {
    const count = parseInt(assignCounts[id] || 0);
    return sum + count;
  }, 0);

  const remainingToAssign = selectedCount - totalAssigned;

  if (!hackathonId) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-lg w-full">
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
          </DialogHeader>
          <div className="text-red-600 p-4">No hackathonId provided to BulkEvaluatorAssignModal.        </div>
      </DialogContent>
      
      {/* Add Evaluator Modal */}
      <AddEvaluatorModal
        open={showAddEvaluatorModal}
        onClose={() => setShowAddEvaluatorModal(false)}
        hackathonId={hackathonId}
        onEvaluatorAdded={handleEvaluatorAdded}
      />
    </Dialog>
  );
}

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Assign {selectedCount} Submission{selectedCount > 1 ? 's' : ''} to Judges
          </DialogTitle>
          <p className="text-sm text-gray-600 mt-2">
            Select judges to evaluate the selected submissions. Judges will only see submissions assigned to them.
          </p>
          
          {/* Assignment Overview */}
          {assignmentOverview && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">Unassigned Projects:</span>
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold">
                      {assignmentOverview.unassignedSubmissions?.length || 0}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-green-600" />
                    <span className="font-medium">Assigned Projects:</span>
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
                      {assignmentOverview.assignedSubmissions?.length || 0}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-600" />
                    <span className="font-medium">Active Judges:</span>
                    <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-semibold">
                      {assignmentOverview.judges?.length || 0}
                    </span>
                  </div>
                </div>
                {overviewLoading && (
                  <div className="text-xs text-gray-500">Loading...</div>
                )}
              </div>
            </div>
          )}
          
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
            
            {/* Multiple Judges Per Project Section */}
            <div className="mb-4 p-3 border border-blue-200 rounded-lg bg-blue-50">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-800">Multiple Judges Per Project</span>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={multipleJudgesMode}
                    onChange={(e) => setMultipleJudgesMode(e.target.checked)}
                    className="h-4 w-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Enable multiple judges per project</span>
                </label>
              </div>
              
              {multipleJudgesMode && (
                <div className="mt-3 space-y-3">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="judgesPerProjectMode"
                        checked={judgesPerProjectMode === 'manual'}
                        onChange={() => setJudgesPerProjectMode('manual')}
                        className="h-4 w-4 text-blue-600"
                      />
                      <span className="text-sm text-gray-700">Manual assignment</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="judgesPerProjectMode"
                        checked={judgesPerProjectMode === 'equal'}
                        onChange={() => setJudgesPerProjectMode('equal')}
                        className="h-4 w-4 text-blue-600"
                      />
                      <span className="text-sm text-gray-700">Equal distribution</span>
                    </div>
                  </div>
                  
                  {judgesPerProjectMode === 'manual' && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-700">Judges per project:</span>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="1"
                          className="w-20 border border-gray-200 rounded-lg px-2 py-1 text-sm text-center"
                          value={judgesPerProject}
                          onChange={(e) => setJudgesPerProject(parseInt(e.target.value) || 1)}
                        />
                        <div className="flex items-center gap-1 ml-2">
                          {[...Array(Math.min(judgesPerProject, 5))].map((_, i) => (
                            <Users key={i} className="w-4 h-4 text-blue-600" />
                          ))}
                          {judgesPerProject > 5 && (
                            <span className="text-xs text-blue-600 font-medium">+{judgesPerProject - 5}</span>
                          )}
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">(recommended: ≤ {selectedEvaluators.length})</span>
                      {judgesPerProject > selectedEvaluators.length && (
                        <span className="text-xs text-red-500 ml-2">Warning: More judges per project than available evaluators!</span>
                      )}
                    </div>
                  )}
                  
                  {judgesPerProjectMode === 'equal' && (
                    <div className="text-sm text-gray-600">
                      <div className="flex items-center gap-2 mb-2">
                        <span>Each project will be assigned to {Math.ceil(selectedEvaluators.length / selectedCount)} judges equally</span>
                        <div className="flex items-center gap-1">
                          {[...Array(Math.min(Math.ceil(selectedEvaluators.length / selectedCount), 5))].map((_, i) => (
                            <Users key={i} className="w-3 h-3 text-blue-600" />
                          ))}
                          {Math.ceil(selectedEvaluators.length / selectedCount) > 5 && (
                            <span className="text-xs text-blue-600 font-medium">+{Math.ceil(selectedEvaluators.length / selectedCount) - 5}</span>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        Distribution: {selectedCount} projects × {Math.ceil(selectedEvaluators.length / selectedCount)} judges = {selectedCount * Math.ceil(selectedEvaluators.length / selectedCount)} total assignments
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="space-y-3">
              {selectedEvaluators.map(id => {
                const ev = allEvaluators.find(e => e.id === id);
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
          {loading ? (
            <div className="text-gray-400 text-sm text-center py-4">Loading evaluators...</div>
          ) : filteredEvaluators.length === 0 ? (
            <div className="text-gray-400 text-sm text-center py-4">No evaluators found.</div>
          ) : (
            filteredEvaluators.map(ev => (
              <div key={ev.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
                <input 
                  type="checkbox" 
                  checked={selectedEvaluators.includes(ev.id)} 
                  onChange={() => handleEvaluatorToggle(ev.id)}
                  className="h-4 w-4 text-blue-600"
                  disabled={ev.status !== 'active'}
                />
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
                  {ev.name.split(' ').map(n => n[0]).join('').slice(0,2)}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 text-sm">{ev.name}</div>
                  <div className="text-xs text-gray-500">{ev.email}</div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(ev.status)}
                  <span className="text-xs text-gray-500">{getStatusText(ev.status)}</span>
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* Assignment Preview */}
        {multipleJudgesMode && selectedEvaluators.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-blue-800 text-sm font-semibold">Assignment Preview</span>
            </div>
            <div className="text-sm text-blue-700">
              {judgesPerProjectMode === 'manual' ? (
                <div>
                  <span>Each project will have {judgesPerProject} judge(s)</span>
                  <div className="flex items-center gap-1 mt-1">
                    {[...Array(Math.min(judgesPerProject, 5))].map((_, i) => (
                      <Users key={i} className="w-3 h-3 text-blue-600" />
                    ))}
                    {judgesPerProject > 5 && (
                      <span className="text-xs text-blue-600 font-medium">+{judgesPerProject - 5}</span>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <span>Equal distribution: {Math.ceil(selectedEvaluators.length / selectedCount)} judges per project</span>
                  <div className="flex items-center gap-1 mt-1">
                    {[...Array(Math.min(Math.ceil(selectedEvaluators.length / selectedCount), 5))].map((_, i) => (
                      <Users key={i} className="w-3 h-3 text-blue-600" />
                    ))}
                    {Math.ceil(selectedEvaluators.length / selectedCount) > 5 && (
                      <span className="text-xs text-blue-600 font-medium">+{Math.ceil(selectedEvaluators.length / selectedCount) - 5}</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Warning Bar */}
        {remainingToAssign > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">i</span>
                </div>
                <span className="text-orange-800 text-sm">
                  +{remainingToAssign} candidate(s) still need to be selected!
                </span>
              </div>
              <button 
                className="text-blue-600 text-sm font-semibold hover:text-blue-700"
                onClick={handleAssignEqually}
              >
                Assign equally
              </button>
            </div>
          </div>
        )}
        
        {/* Bottom Action Bar */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
          <button 
            className="flex items-center gap-2 text-gray-700 hover:text-blue-700 font-medium text-sm" 
            onClick={() => setShowAddEvaluatorModal(true)}
          >
            <UserPlus className="w-4 h-4" />
            Add Evaluator
          </button>
          <button 
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              remainingToAssign === 0 && selectedEvaluators.length > 0
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            onClick={handleAssign} 
            disabled={remainingToAssign > 0 || selectedEvaluators.length === 0 || assignLoading}
          >
            {assignLoading ? 'Assigning...' : 'Assign'}
          </button>
        </div>
      </DialogContent>
      
      {/* Add Evaluator Modal */}
      <AddEvaluatorModal
        open={showAddEvaluatorModal}
        onClose={() => setShowAddEvaluatorModal(false)}
        hackathonId={hackathonId}
        onEvaluatorAdded={handleEvaluatorAdded}
      />
    </Dialog>
  );
} 