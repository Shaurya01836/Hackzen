"\"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../../../components/CommonUI/card"

const scoresData = [
  {
    id: 1,
    projectName: "AI Study Buddy",
    team: "Neural Networks",
    track: "AI/ML",
    totalScore: 8.5,
    innovation: 9.0,
    technical: 8.5,
    ux: 8.0,
    business: 8.0,
    presentation: 8.5,
    feedback:
      "Excellent AI implementation with intuitive user interface. Great potential for market adoption.",
    dateReviewed: "2024-12-15",
    status: "submitted"
  },
  {
    id: 2,
    projectName: "HealthConnect Telemedicine",
    team: "MedTech Innovators",
    track: "Healthcare",
    totalScore: 7.8,
    innovation: 7.5,
    technical: 8.0,
    ux: 8.5,
    business: 8.0,
    presentation: 7.0,
    feedback:
      "Solid healthcare solution with good technical implementation. Presentation could be more engaging.",
    dateReviewed: "2024-12-14",
    status: "submitted"
  },
  {
    id: 3,
    projectName: "CryptoWallet Security Suite",
    team: "BlockChain Builders",
    track: "Blockchain",
    totalScore: 9.2,
    innovation: 9.5,
    technical: 9.0,
    ux: 9.0,
    business: 9.0,
    presentation: 9.5,
    feedback:
      "Innovative security features with excellent code quality. Strong potential for real-world adoption.",
    dateReviewed: "2024-12-13",
    status: "submitted"
  }
]

export function ScoresSection() {
  return (
    <div className="animate-in fade-in-50 duration-500 space-y-6">
      {scoresData.map(score => (
        <Card key={score.id} className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>{score.projectName}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span>Team: {score.team}</span>
              <span>Track: {score.track}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Score: {score.totalScore}</span>
              <span>Date Reviewed: {score.dateReviewed}</span>
            </div>
            <p>Feedback: {score.feedback}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
