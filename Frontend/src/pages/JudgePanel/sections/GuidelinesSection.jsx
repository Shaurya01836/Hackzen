"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../../../components/CommonUI/card"
import { Badge } from "../../../components/CommonUI/badge"
import { FileText } from "lucide-react"

/**
 * Judges’ reference page.
 * Displays the scoring rubric and general rules.
 */
export function GuidelinesSection() {
  return (
    <div className="animate-in fade-in-50 duration-500 space-y-6">
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Judging Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none">
          <h3>Scoring Criteria</h3>
          <ul>
            <li>
              <strong>Innovation (25%)</strong> – Originality and creativity of
              the solution
            </li>
            <li>
              <strong>Technical Implementation (25%)</strong> – Code quality and
              technical complexity
            </li>
            <li>
              <strong>User Experience (20%)</strong> – Design and usability of
              the application
            </li>
            <li>
              <strong>Business Viability (15%)</strong> – Market potential and
              feasibility
            </li>
            <li>
              <strong>Presentation (15%)</strong> – Quality of demo and pitch
            </li>
          </ul>

          <h3>General Rules</h3>
          <ol>
            <li>
              All submissions must be original work created during the hackathon
              period.
            </li>
            <li>
              External libraries and frameworks are allowed but must be cited.
            </li>
            <li>
              Judges should avoid conflicts of interest and recuse themselves if
              necessary.
            </li>
            <li>
              Feedback should be constructive and actionable for participants.
            </li>
          </ol>

          <h3>Example Resources</h3>
          <p>
            Review past winning projects for inspiration:
            <Badge variant="outline" className="ml-2">
              2023 Winners
            </Badge>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
