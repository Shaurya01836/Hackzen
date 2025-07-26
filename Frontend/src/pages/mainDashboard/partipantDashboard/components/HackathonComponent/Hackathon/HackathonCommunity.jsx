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
    <section ref={sectionRef} className="space-y-6 max-w-5xl mx-auto">
      {/* Main Container Card */}
      <Card className="shadow-none hover:shadow-none">
        {/* Section Header */}
        <CardHeader className="border-b border-gray-100 bg-gray-50/50">
          <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <div className="w-1 h-8 bg-indigo-500 rounded-full"></div>
            Community
          </CardTitle>
        </CardHeader>

        <CardContent className="p-8 space-y-8">
          {/* Community Introduction */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 my-4">
              <h3 className="text-xl font-semibold text-gray-900">Join the Conversation</h3>
            </div>
            <div className="">
              <p className="text-gray-700 leading-relaxed text-lg mb-6">
                Get involved, ask questions, and connect with other hackers. Join our community platforms to stay updated and collaborate with fellow participants.
              </p>
              
              <ul className="space-y-4">
                {communityLinks.map((link, index) => (
                  <li key={link.platform} className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                      {link.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-lg text-gray-900 mb-1">
                            {link.platform}
                          </h4>
                          <p className="text-gray-700 leading-relaxed">
                            {link.description}
                          </p>
                        </div>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-4"
                        >
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition-colors duration-200"
                          >
                            {link.action}
                            <ArrowUpRight className="w-4 h-4 ml-2" />
                          </Button>
                        </a>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
