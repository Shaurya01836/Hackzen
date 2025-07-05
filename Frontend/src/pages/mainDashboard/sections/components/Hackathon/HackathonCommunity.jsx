"use client";
import { MessageSquare } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../../../../components/CommonUI/card";

export default function HackathonCommunity({ sectionRef }) {
  return (
    <section ref={sectionRef} className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-800 border-b pb-4">Community</h2>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-pink-500" />
            Join the Conversation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-gray-700">
            Stay connected with fellow participants, mentors, and organizers through our
            official community channels.
          </p>

          <ul className="list-disc ml-6 text-sm text-blue-600 space-y-2">
            <li>
              <a href="https://discord.gg/your-invite-link" target="_blank" rel="noopener noreferrer">
                Join our Discord Server
              </a>
            </li>
            <li>
              <a href="https://t.me/your-telegram-link" target="_blank" rel="noopener noreferrer">
                Join the Telegram Group
              </a>
            </li>
            <li>
              <a href="https://twitter.com/your-hackathon" target="_blank" rel="noopener noreferrer">
                Follow us on Twitter
              </a>
            </li>
          </ul>
        </CardContent>
      </Card>
    </section>
  );
}
