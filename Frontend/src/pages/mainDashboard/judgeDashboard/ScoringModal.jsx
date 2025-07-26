import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../components/DashboardUI/dialog";
import { Button } from "../../../components/CommonUI/button";
import { Textarea } from "../../../components/CommonUI/textarea";
import { Label } from "../../../components/CommonUI/label";
import { X } from "lucide-react";
import { toast } from "../../../hooks/use-toast";
import axios from '../../../lib/api';

export default function ScoringModal({
  open,
  onClose,
  submission,
  onScoreSubmit,
  roundIndex = 0
}) {
  const [criteria, setCriteria] = useState([]);
  const [scores, setScores] = useState({});
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [criteriaLoading, setCriteriaLoading] = useState(false);
  const [submissionType, setSubmissionType] = useState('project');

  useEffect(() => {
    if (open && submission && submission.hackathonId && roundIndex !== undefined) {
      fetchCriteria();
    }
    // eslint-disable-next-line
  }, [open, submission, roundIndex]);

  const fetchCriteria = async () => {
    setCriteriaLoading(true);
    try {
      // Determine type: project or presentation
      // You may want to pass this as a prop or infer from submission
      let type = submission?.type || submission?.submissionType || 'project';
      setSubmissionType(type);
      const res = await axios.get(`/api/judge-management/hackathons/${submission.hackathonId}/rounds/${roundIndex}/judging-criteria`);
      const crit = res.data.criteria?.[type] || [];
      setCriteria(crit);
      // Initialize scores state
      const initialScores = {};
      crit.forEach(c => {
        initialScores[c.name] = '';
      });
      setScores(initialScores);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load judging criteria',
        variant: 'destructive',
      });
    } finally {
      setCriteriaLoading(false);
    }
  };

  const handleScoreChange = (name, value, maxScore) => {
    let v = value;
    if (v === '') v = '';
    else v = Math.max(0, Math.min(Number(v), maxScore));
    setScores(prev => ({ ...prev, [name]: v }));
  };

  const handleScoreSubmit = async () => {
    // Validate all criteria
    for (const c of criteria) {
      if (scores[c.name] === '' || isNaN(scores[c.name])) {
        toast({
          title: 'Score Required',
          description: `Please provide a score for "${c.name}"`,
          variant: 'destructive',
        });
        return;
      }
      if (scores[c.name] < 0 || scores[c.name] > c.maxScore) {
        toast({
          title: 'Invalid Score',
          description: `Score for "${c.name}" must be between 0 and ${c.maxScore}`,
          variant: 'destructive',
        });
        return;
      }
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/judge-management/submissions/${submission._id}/score`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          scores,
          feedback,
          roundIndex,
          submissionType
        })
      });
      if (response.ok) {
        toast({
          title: 'Score submitted successfully',
          description: 'Your evaluation has been recorded.',
          variant: 'default',
        });
        if (onScoreSubmit) {
          onScoreSubmit(submission._id, scores, feedback);
        }
        setScores({});
        setFeedback("");
        onClose();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit score');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit score',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!submission) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-full">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Score Submission</DialogTitle>
          <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600" onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </DialogHeader>
        <div className="space-y-6">
          {/* Submission Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Submission Details</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium text-gray-700">Team:</span>{" "}
                <span className="text-gray-900">{submission.team?.name || 'No Team'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Project:</span>{" "}
                <span className="text-gray-900">
                  {submission.projectTitle || submission.title || 'Untitled Project'}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Submitted:</span>{" "}
                <span className="text-gray-900">
                  {submission.submittedAt ? new Date(submission.submittedAt).toLocaleString() : '--'}
                </span>
              </div>
            </div>
          </div>
          {/* Dynamic Scoring Section */}
          <div className="space-y-4">
            {criteriaLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <>
                <Label className="text-base font-semibold text-gray-900 mb-2 block">Scoring Criteria</Label>
                <div className="space-y-4">
                  {criteria.map((c, idx) => (
                    <div key={c.name} className="p-3 border border-gray-200 rounded-lg bg-white">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-900">{c.name}</span>
                        <span className="text-xs text-gray-500">Max: {c.maxScore} | Weight: {c.weight}</span>
                      </div>
                      {c.description && (
                        <div className="text-xs text-gray-600 mb-2">{c.description}</div>
                      )}
                      <input
                        type="number"
                        min={0}
                        max={c.maxScore}
                        value={scores[c.name]}
                        onChange={e => handleScoreChange(c.name, e.target.value, c.maxScore)}
                        className="w-32 px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        placeholder={`0-${c.maxScore}`}
                        disabled={loading}
                      />
                    </div>
                  ))}
                </div>
              </>
            )}
            <div>
              <Label htmlFor="feedback" className="text-base font-semibold text-gray-900">
                Feedback (Optional)
              </Label>
              <Textarea
                id="feedback"
                placeholder="Provide detailed feedback about the submission..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="mt-2 min-h-[120px]"
                disabled={loading}
              />
            </div>
          </div>
          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleScoreSubmit}
              disabled={loading || criteria.some(c => scores[c.name] === '' || isNaN(scores[c.name]))}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? 'Submitting...' : 'Submit Score'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 