import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Save, Eye } from 'lucide-react';
import { useToast } from '../../../hooks/use-toast';
import axios from '../../../lib/api';

const JudgingCriteriaModal = ({ 
  isOpen, 
  onClose, 
  hackathonId, 
  roundIndex, 
  roundName 
}) => {
  const [criteria, setCriteria] = useState({
    project: [],
    presentation: []
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && hackathonId && roundIndex !== undefined) {
      fetchCriteria();
    }
  }, [isOpen, hackathonId, roundIndex]);

  const fetchCriteria = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/api/judge-management/hackathons/${hackathonId}/rounds/${roundIndex}/judging-criteria`
      );
      setCriteria(response.data.criteria || {
        project: [
          { name: 'Innovation', description: 'Originality and creativity of the solution', maxScore: 10, weight: 1 },
          { name: 'Impact', description: 'Potential impact and value of the solution', maxScore: 10, weight: 1 },
          { name: 'Technicality', description: 'Technical complexity and implementation', maxScore: 10, weight: 1 },
          { name: 'Presentation', description: 'Quality of presentation and communication', maxScore: 10, weight: 1 }
        ],
        presentation: [
          { name: 'Clarity', description: 'Clear and understandable presentation', maxScore: 10, weight: 1 },
          { name: 'Engagement', description: 'How engaging and compelling the presentation is', maxScore: 10, weight: 1 },
          { name: 'Content', description: 'Quality and relevance of content', maxScore: 10, weight: 1 },
          { name: 'Delivery', description: 'Quality of delivery and communication skills', maxScore: 10, weight: 1 }
        ]
      });
    } catch (error) {
      console.error('Error fetching criteria:', error);
      toast({
        title: "Error",
        description: "Failed to load judging criteria",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await axios.put(
        `/api/judge-management/hackathons/${hackathonId}/rounds/${roundIndex}/judging-criteria`,
        { criteria }
      );
      
      toast({
        title: "Success",
        description: "Judging criteria updated successfully",
      });
      
      onClose();
    } catch (error) {
      console.error('Error saving criteria:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to save judging criteria",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const addCriterion = (type) => {
    setCriteria(prev => ({
      ...prev,
      [type]: [...prev[type], {
        name: '',
        description: '',
        maxScore: 10,
        weight: 1
      }]
    }));
  };

  const removeCriterion = (type, index) => {
    setCriteria(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const updateCriterion = (type, index, field, value) => {
    setCriteria(prev => ({
      ...prev,
      [type]: prev[type].map((criterion, i) => 
        i === index ? { ...criterion, [field]: value } : criterion
      )
    }));
  };

  const renderCriteriaForm = (type, criteriaList) => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 capitalize">
          {type} Criteria
        </h3>
        <button
          type="button"
          onClick={() => addCriterion(type)}
          className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="w-4 h-4" />
          Add Criterion
        </button>
      </div>

      <div className="space-y-3">
        {criteriaList.map((criterion, index) => (
          <div key={index} className="p-4 border border-gray-200 rounded-lg bg-white">
            <div className="flex items-start justify-between mb-3">
              <h4 className="font-medium text-gray-900">Criterion {index + 1}</h4>
              <button
                type="button"
                onClick={() => removeCriterion(type, index)}
                className="text-red-500 hover:text-red-700 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={criterion.name}
                  onChange={(e) => updateCriterion(type, index, 'name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Innovation, Technicality"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Score
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={criterion.maxScore}
                  onChange={(e) => updateCriterion(type, index, 'maxScore', parseInt(e.target.value) || 10)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weight
                </label>
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={criterion.weight}
                  onChange={(e) => updateCriterion(type, index, 'weight', parseFloat(e.target.value) || 1)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={criterion.description}
                  onChange={(e) => updateCriterion(type, index, 'description', e.target.value)}
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe what this criterion evaluates..."
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPreview = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
        <button
          type="button"
          onClick={() => setPreviewMode(false)}
          className="text-blue-600 hover:text-blue-700 transition"
        >
          Back to Edit
        </button>
      </div>

      {['project', 'presentation'].map(type => (
        <div key={type} className="space-y-3">
          <h4 className="text-md font-semibold text-gray-800 capitalize">
            {type} Criteria
          </h4>
          <div className="space-y-2">
            {criteria[type].map((criterion, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">{criterion.name}</span>
                  <span className="text-sm text-gray-600">
                    Max: {criterion.maxScore} | Weight: {criterion.weight}
                  </span>
                </div>
                {criterion.description && (
                  <p className="text-sm text-gray-600 mt-1">{criterion.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Judging Criteria - {roundName}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Define scoring criteria for projects and presentations
            </p>
          </div>
          <div className="flex items-center gap-2">
            {!previewMode && (
              <button
                type="button"
                onClick={() => setPreviewMode(true)}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                <Eye className="w-4 h-4" />
                Preview
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : previewMode ? (
            renderPreview()
          ) : (
            <div className="space-y-8">
              {renderCriteriaForm('project', criteria.project)}
              <div className="border-t border-gray-200 pt-6"></div>
              {renderCriteriaForm('presentation', criteria.presentation)}
            </div>
          )}
        </div>

        {!previewMode && (
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {saving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Save className="w-4 h-4" />
              )}
              {saving ? 'Saving...' : 'Save Criteria'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JudgingCriteriaModal; 