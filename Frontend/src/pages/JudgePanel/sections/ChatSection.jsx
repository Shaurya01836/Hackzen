"use client"
import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/CommonUI/card"
import { Input } from "../../../components/CommonUI/input"
import { Button } from "../../../components/CommonUI/button"
import { MessageSquare, Send } from "lucide-react"

export function ChatSection() {
  const [messages, setMessages] = React.useState([
    { id: 1, author: "Alice", text: "Has anyone reviewed EcoTrack yet?" },
    { id: 2, author: "Bob", text: "Yes, working on it now 😊" }
  ])
  const [draft, setDraft] = React.useState("")

  function sendMessage() {
    if (!draft.trim()) return
    setMessages([
      ...messages,
      { id: Date.now(), author: "You", text: draft.trim() }
    ])
    setDraft("")
  }

  return (
    <Card className="border-0 shadow-lg flex flex-col h-[75vh] animate-in fade-in-50 duration-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-blue-600" />
          Judges Chat
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto space-y-4">
        {messages.map(m => (
          <div key={m.id} className="flex flex-col">
            <span className="text-sm font-medium text-gray-800">
              {m.author}
            </span>
            <span className="text-sm text-gray-700">{m.text}</span>
          </div>
        ))}
      </CardContent>
      <div className="border-t p-4 flex gap-2">
        <Input
          placeholder="Type a message…"
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
        />
        <Button onClick={sendMessage}>
          <Send className="h-4 w-4 mr-1" />
          Send
        </Button>
      </div>
    </Card>
  )
}
