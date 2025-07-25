"use client";
import { MessageSquare, Send, Share2, ArrowUpRight } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../../../../../components/CommonUI/card";
import { Button } from "../../../../../../components/CommonUI/button";

export default function HackathonCommunity({ sectionRef }) {
  const communityLinks = [
    {
      icon: <MessageSquare className="w-6 h-6 text-indigo-500" />,
      platform: "Discord Server",
      description: "Chat with participants, ask questions, and form teams.",
      url: "https://discord.gg/your-invite-link",
      action: "Join Channel",
    },
    {
      icon: <Send className="w-6 h-6 text-sky-500" />,
      platform: "Telegram Group",
      description: "Get real-time announcements and quick updates.",
      url: "https://t.me/your-telegram-link",
      action: "Join Group",
    },
    {
      icon: <Share2 className="w-6 h-6 text-blue-500" />,
      platform: "Twitter (X)",
      description: "Follow the official hashtag and share your progress.",
      url: "https://twitter.com/your-hackathon",
      action: "Follow Us",
    },
  ];

  return (
    <section ref={sectionRef} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Community</h2>
        <p className="mt-2 text-lg text-gray-600">
          Get involved, ask questions, and connect with other hackers.
        </p>
      </div>

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            Join the Conversation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 flex flex-col gap-2">
            {communityLinks.map((link) => (
              <a
                key={link.platform}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <div className="flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50/75 hover:border-gray-300 transition-all duration-200">
                  <div className="flex items-center gap-5">
                    <div className="bg-gray-100 p-3 rounded-full">
                      {link.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{link.platform}</h3>
                      <p className="text-sm text-gray-500">{link.description}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="text-gray-400 group-hover:text-gray-800">
                    <ArrowUpRight className="w-5 h-5" />
                  </Button>
                </div>
              </a>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}