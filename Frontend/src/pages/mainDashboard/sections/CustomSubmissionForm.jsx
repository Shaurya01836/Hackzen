"use client"

import { useState } from "react"
import { Button } from "../../../components/CommonUI/button"
import { Input } from "../../../components/CommonUI/input"
import { Label } from "../../../components/CommonUI/label"
import { Textarea } from "../../../components/CommonUI/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/CommonUI/card"
import { Separator } from "../../../components/CommonUI/separator"
import { Plus, Trash2, ArrowLeft, Save, FileText, HelpCircle } from "lucide-react"

export default function CustomSubmissionForm({ hackathon, onCancel }) {
  const [questions, setQuestions] = useState([])
  const [terms, setTerms] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const addQuestion = () => {
    const newQuestion = {
      id: Date.now().toString(),
      text: "",
      required: true
    }
    setQuestions([...questions, newQuestion])
  }

  const removeQuestion = id => {
    setQuestions(questions.filter(q => q.id !== id))
  }

  const updateQuestion = (id, value) => {
    setQuestions(
      questions.map(q =>
        q.id === id ? { ...q, text: value } : q
      )
    )
  }

  const addTermsCondition = () => {
    const newTerm = {
      id: Date.now().toString(),
      text: ""
    }
    setTerms([...terms, newTerm])
  }

  const removeTermsCondition = id => {
    setTerms(terms.filter(t => t.id !== id))
  }

  const updateTermsCondition = (id, value) => {
    setTerms(
      terms.map(t =>
        t.id === id ? { ...t, text: value } : t
      )
    )
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log("Custom Questions:", questions)
      console.log("Terms & Conditions:", terms)
      console.log("Hackathon:", hackathon)
      
      // Show success message or redirect
      alert("Submission form saved successfully!")
      
      // Reset form after successful save
      setQuestions([])
      setTerms([])
    } catch (error) {
      console.error("Error saving form:", error)
      alert("Failed to save form. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    if (questions.length > 0 || terms.length > 0) {
      const confirmCancel = window.confirm(
        "Are you sure you want to cancel? All unsaved changes will be lost."
      )
      if (!confirmCancel) return
    }
    
    setQuestions([])
    setTerms([])
    if (onCancel) onCancel()
  }

  const hasUnsavedChanges = questions.length > 0 || terms.length > 0

  return (
    <div className="flex-1 min-h-screen bg-slate-50">
      <div className="container max-w-5xl mx-auto p-6 space-y-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="gap-2 text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="h-8 w-px bg-slate-300" />
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Submission Form Builder
              </h1>
              <p className="text-slate-600 mt-1">
                {hackathon?.title ? `For ${hackathon.title}` : "Create custom questions and terms"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {hasUnsavedChanges && (
              <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1 rounded-full text-sm">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                Unsaved changes
              </div>
            )}
            <Button
              onClick={handleSave}
              disabled={isLoading || (!questions.length && !terms.length)}
              className="gap-2 bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Form
                </>
              )}
            </Button>
          </div>
        </div>

        <Separator className="bg-slate-200" />

        {/* Questions Section */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="bg-slate-50 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <HelpCircle className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-xl text-slate-900">
                    Submission Questions
                  </CardTitle>
                  <p className="text-sm text-slate-600 mt-1">
                    Add questions that participants must answer when submitting their projects
                  </p>
                </div>
              </div>
              <Button onClick={addQuestion} size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4" />
                Add Question
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {questions.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-lg border-2 border-dashed border-slate-300">
                <HelpCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 font-medium">No questions added yet</p>
                <p className="text-sm text-slate-500 mt-1">
                  Click "Add Question" to create your first submission question
                </p>
                <Button onClick={addQuestion} className="mt-4 gap-2" variant="outline">
                  <Plus className="h-4 w-4" />
                  Add First Question
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {questions.map((q, index) => (
                  <div key={q.id} className="group relative p-4 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <Label className="text-sm font-medium text-slate-700 mb-2 block">
                          Question {index + 1}
                        </Label>
                        <Input
                          className="w-full"
                          placeholder={`Enter your question here...`}
                          value={q.text}
                          onChange={e => updateQuestion(q.id, e.target.value)}
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeQuestion(q.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Terms Section */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="bg-slate-50 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FileText className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-xl text-slate-900">
                    Terms & Conditions
                  </CardTitle>
                  <p className="text-sm text-slate-600 mt-1">
                    Add terms and conditions that participants must agree to
                  </p>
                </div>
              </div>
              <Button onClick={addTermsCondition} size="sm" className="gap-2 bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4" />
                Add Term
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {terms.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-lg border-2 border-dashed border-slate-300">
                <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 font-medium">No terms added yet</p>
                <p className="text-sm text-slate-500 mt-1">
                  Click "Add Term" to create terms and conditions for your hackathon
                </p>
                <Button onClick={addTermsCondition} className="mt-4 gap-2" variant="outline">
                  <Plus className="h-4 w-4" />
                  Add First Term
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {terms.map((term, index) => (
                  <div key={term.id} className="group relative p-4 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-medium text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <Label className="text-sm font-medium text-slate-700 mb-2 block">
                          Term {index + 1}
                        </Label>
                        <Textarea
                          className="w-full"
                          placeholder={`Enter term or condition here...`}
                          value={term.text}
                          onChange={e => updateTermsCondition(term.id, e.target.value)}
                          rows={3}
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTermsCondition(term.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-6 border-t border-slate-200">
          <div className="text-sm text-slate-500">
            {questions.length > 0 || terms.length > 0 ? (
              <span>
                {questions.length} question{questions.length !== 1 ? 's' : ''} and {terms.length} term{terms.length !== 1 ? 's' : ''} added
              </span>
            ) : (
              <span>No content added yet</span>
            )}
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={handleCancel}
              className="gap-2 border-slate-300 text-slate-700 hover:bg-slate-100"
            >
              <ArrowLeft className="h-4 w-4" />
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={isLoading || (!questions.length && !terms.length)}
              className="gap-2 bg-blue-600 hover:bg-blue-700 min-w-[120px]"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Form
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}