import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../../../components/CommonUI/card";
import { Button } from "../../../../components/CommonUI/button";
import { Badge } from "../../../../components/CommonUI/badge";
import { Edit, Trash2, Target, FileText, Building, Globe, Plus, AlertCircle, X, Save } from "lucide-react";
import { toast } from "../../../../hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../../../components/DashboardUI/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../../../components/DashboardUI/alert-dialog";
import { Label } from "../../../../components/CommonUI/label";
import { Input } from "../../../../components/CommonUI/input";
import { Textarea } from "../../../../components/CommonUI/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/CommonUI/select";
import { editProblemStatement, deleteProblemStatement } from "../../../../lib/api";

export default function JudgeManagementProblemStatements({ hackathon, onEdit, onDelete }) {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editingPS, setEditingPS] = useState(null);
  const [deletingPS, setDeletingPS] = useState(null);
  const [editForm, setEditForm] = useState({
    statement: '',
    type: 'general',
    sponsorCompany: ''
  });
  const [loading, setLoading] = useState(false);

  const problemStatements = hackathon?.problemStatements || [];
  
  // Count sponsored vs general problem statements
  const sponsoredCount = problemStatements.filter(ps => {
    if (typeof ps === 'object' && ps.type) {
      const psType = ps.type.toLowerCase();
      return psType === 'sponsored' || psType === 'sponsored challenge';
    }
    return false;
  }).length;
  
  const generalCount = problemStatements.filter(ps => {
    if (typeof ps === 'object' && ps.type) {
      const psType = ps.type.toLowerCase();
      return psType !== 'sponsored' && psType !== 'sponsored challenge';
    }
    return true; // Default to general if no type specified
  }).length;
  


  const handleEdit = (ps, index) => {
    // Handle both string and object problem statements
    const isObject = typeof ps === 'object' && ps !== null;
    const statement = isObject ? ps.statement : ps;
    
    // Map the existing type to our expected format
    let type = 'general';
    if (isObject && ps.type) {
      const psType = ps.type.toLowerCase();
      if (psType === 'sponsored' || psType === 'sponsored challenge') {
        type = 'sponsored';
      } else {
        type = 'general';
      }
    }
    
    const sponsorCompany = isObject ? ps.sponsorCompany : '';
    
    setEditingPS({ ...ps, index });
    setEditForm({
      statement: statement || '',
      type: type,
      sponsorCompany: sponsorCompany || ''
    });
    setEditModalOpen(true);
  };

  const handleDelete = (ps, index) => {
    setDeletingPS({ ...ps, index });
    setDeleteModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingPS || !hackathon?._id) return;

    setLoading(true);
    try {
      const hackathonId = hackathon._id || hackathon.id;
      
      const data = {
        statement: editForm.statement,
        type: editForm.type,
        sponsorCompany: editForm.type === 'sponsored' ? editForm.sponsorCompany : null
      };
      
      const result = await editProblemStatement(hackathonId, editingPS._id, data);
      
      toast({
        title: "Success",
        description: "Problem statement updated successfully",
        variant: "default",
      });
      setEditModalOpen(false);
      setEditingPS(null);
      // Refresh the hackathon data
      if (onEdit) {
        onEdit(result.problemStatement, editingPS.index);
      }
    } catch (error) {
      console.error('Error updating problem statement:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update problem statement",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingPS || !hackathon?._id) return;

    setLoading(true);
    try {
      const hackathonId = hackathon._id || hackathon.id;
      

      
      const result = await deleteProblemStatement(hackathonId, deletingPS._id);
      
      toast({
        title: "Success",
        description: "Problem statement deleted successfully",
        variant: "default",
      });
      setDeleteModalOpen(false);
      setDeletingPS(null);
      // Refresh the hackathon data
      if (onDelete) {
        onDelete(deletingPS, deletingPS.index);
      }
    } catch (error) {
      console.error('Error deleting problem statement:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete problem statement",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">


      {/* Header Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Problem Statements Management</h2>
        <p className="text-gray-600">
          Create and manage problem statements that participants will work on during the hackathon
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="shadow-none hover:shadow-none border-0 bg-gradient-to-br from-indigo-50 to-indigo-100">
          <CardContent className="p-6 pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-600 rounded-xl">
                <Target className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-indigo-900">
                  {problemStatements.length}
                </p>
                <p className="text-sm font-medium text-indigo-700">Total Statements</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-none hover:shadow-none border-0 bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6 pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-600 rounded-xl">
                <Building className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-green-900">
                  {sponsoredCount}
                </p>
                <p className="text-sm font-medium text-green-700">Sponsored</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-none hover:shadow-none border-0 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6 pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-600 rounded-xl">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-blue-900">
                  {generalCount}
                </p>
                <p className="text-sm font-medium text-blue-700">General</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Problem Statements List */}
      <Card className="shadow-none hover:shadow-none">
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Target className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <CardTitle className="text-xl">Active Problem Statements</CardTitle>
                <CardDescription>
                  Manage and organize problem statements for participants
                </CardDescription>
              </div>
            </div>
            {problemStatements.length > 0 && (
              <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200">
                {problemStatements.length} statements
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {problemStatements.length === 0 ? (
            <div className="text-center py-16">
              <div className="p-4 bg-gray-100 rounded-full mb-4 w-20 h-20 flex items-center justify-center mx-auto">
                <FileText className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Problem Statements Yet
              </h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                Get started by adding your first problem statement. Participants will choose from these challenges during the hackathon.
              </p>
              <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add First Problem Statement
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {problemStatements.map((ps, index) => (
                <div
                  key={index}
                  className="group relative p-6 border-0 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 hover:from-indigo-50 hover:to-indigo-100 transition-all duration-300"
                >
                  {/* Problem Statement Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        (typeof ps === 'object' && ps.type && ps.type.toLowerCase() === "sponsored") 
                          ? "bg-green-100" 
                          : "bg-blue-100"
                      }`}>
                        {(typeof ps === 'object' && ps.type && ps.type.toLowerCase() === "sponsored") ? (
                          <Building className={`w-5 h-5 ${
                            (typeof ps === 'object' && ps.type && ps.type.toLowerCase() === "sponsored") ? "text-green-600" : "text-blue-600"
                          }`} />
                        ) : (
                          <Globe className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <Badge 
                            variant={(typeof ps === 'object' && ps.type && ps.type.toLowerCase() === "sponsored") ? "default" : "secondary"}
                            className={
                              (typeof ps === 'object' && ps.type && ps.type.toLowerCase() === "sponsored") 
                                ? "bg-green-100 text-green-700 border-green-200" 
                                : "bg-blue-100 text-blue-700 border-blue-200"
                            }
                          >
                            {(typeof ps === 'object' && ps.type && ps.type.toLowerCase() === "sponsored") ? "Sponsored Challenge" : "General Challenge"}
                          </Badge>
                          <Badge variant="outline" className="bg-white text-gray-600">
                            PS #{index + 1}
                          </Badge>
                        </div>
                        {(typeof ps === 'object' && ps.type && ps.type.toLowerCase() === "sponsored" && ps.sponsorCompany) && (
                          <div className="flex items-center gap-2">
                            <Building className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-700 bg-white px-3 py-1 rounded-full">
                              {ps.sponsorCompany}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleEdit(ps, index)}
                        className="border-gray-300 hover:bg-white hover:border-indigo-300 hover:text-indigo-600"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-gray-300 hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                        onClick={() => handleDelete(ps, index)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>

                  {/* Problem Statement Content */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2">Problem Description</h4>
                    <p className="text-gray-700 leading-relaxed">
                      {typeof ps === "object" ? ps.statement : ps}
                    </p>
                  </div>

                  {/* Additional Details */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        <span>Problem Statement</span>
                      </div>
                      {ps.difficulty && (
                        <div className="flex items-center gap-1">
                          <Target className="w-4 h-4" />
                          <span>Difficulty: {ps.difficulty}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="text-xs text-gray-400">
                      Last modified: {new Date().toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional Information Section */}
      {problemStatements.length > 0 && (
        <Card className="shadow-none hover:shadow-none border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardContent className="p-6 pt-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Problem Statement Guidelines</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• <strong>General statements</strong> can be judged by any platform or hybrid judge</li>
                  <li>• <strong>Sponsored statements</strong> require specific company judges or hybrid judges</li>
                  <li>• Each statement should provide clear objectives and evaluation criteria</li>
                  <li>• Consider including technical requirements and expected deliverables</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Problem Statement Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5 text-indigo-600" />
              Edit Problem Statement
            </DialogTitle>
            <DialogDescription>
              Update the problem statement details. Changes will be reflected immediately.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="statement">Problem Statement</Label>
              <Textarea
                id="statement"
                value={editForm.statement}
                onChange={(e) => setEditForm({ ...editForm, statement: e.target.value })}
                placeholder="Describe the problem participants need to solve..."
                rows={4}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="type">Type</Label>
              <Select
                value={editForm.type}
                onValueChange={(value) => setEditForm({ ...editForm, type: value })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select problem statement type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="sponsored">Sponsored</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {editForm.type === 'sponsored' && (
              <div>
                <Label htmlFor="sponsorCompany">Sponsor Company</Label>
                <Input
                  id="sponsorCompany"
                  value={editForm.sponsorCompany}
                  onChange={(e) => setEditForm({ ...editForm, sponsorCompany: e.target.value })}
                  placeholder="Enter sponsor company name"
                  className="mt-1"
                />
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditModalOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={loading || !editForm.statement.trim()}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <AlertDialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-red-600" />
              Delete Problem Statement
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div>
                <p>Are you sure you want to delete this problem statement? This action cannot be undone.</p>
                {deletingPS && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm font-medium text-red-800 mb-2">Problem Statement to Delete:</p>
                    <p className="text-sm text-red-700">{deletingPS.statement}</p>
                    {deletingPS.type === 'sponsored' && deletingPS.sponsorCompany && (
                      <p className="text-sm text-red-600 mt-1">Sponsor: {deletingPS.sponsorCompany}</p>
                    )}
                  </div>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Problem Statement
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
