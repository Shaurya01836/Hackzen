"use client";
import { useEffect, useState } from "react";
import {
  ArrowLeft, MessageSquare, Users, Search, Hash, Volume2, VolumeX
} from "lucide-react";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "../../AdimPage/components/ui/card";
import { Button } from "../../AdimPage/components/ui/button";
import { Badge } from "../../AdimPage/components/ui/badge";
import { Input } from "../../AdimPage/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../../AdimPage/components/ui/avatar";
import socket from "../../../../utils/socket";
import { useAuth } from "../../../../context/AuthContext";

export function ChatRooms({ onBack, hackathonId }) {
  const { user, token } = useAuth();
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeRoomId, setActiveRoomId] = useState(null);

  // ✅ Debug log props and auth
  console.log("👤 user:", user);
  console.log("🔐 token:", token);
  console.log("🏁 hackathonId:", hackathonId);

  // ✅ Fetch chat rooms from backend
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        console.log("📡 Fetching rooms for:", hackathonId);

        const res = await fetch(`/api/chatrooms/hackathon/${hackathonId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const errText = await res.text();
          console.error("❌ Fetch failed:", res.status, errText);
          throw new Error("Fetch failed");
        }

        const data = await res.json();
        console.log("✅ Chat rooms fetched:", data);
        setChatRooms(data);
      } catch (err) {
        console.error("🔥 Error loading rooms:", err);
      } finally {
        setLoading(false);
      }
    };

    if (hackathonId && token) {
      fetchRooms();
    } else {
      console.warn("🚫 Missing hackathonId or token");
      setLoading(false);
    }
  }, [hackathonId, token]);

  // ✅ Socket setup
  useEffect(() => {
    if (user?._id) {
      socket.emit("registerUser", user._id);

      socket.on("receiveNotification", (notif) => {
        console.log("🔔 Notification:", notif);
      });

      return () => socket.disconnect();
    }
  }, [user]);

  const joinRoom = (roomId, roomName) => {
    socket.emit("joinRoom", roomId);
    setActiveRoomId(roomId);
    console.log(`✅ Joined room: ${roomName}`);
  };

  if (loading) return <div className="p-6">🔄 Loading chat rooms...</div>;

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button
          variant="default"
          size="sm"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Chat Rooms</h1>
          <p className="text-sm text-gray-500">
            Connect and collaborate with other participants
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Room Cards */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input placeholder="Search chat rooms..." className="pl-10" />
            </div>
            <Button>
              <MessageSquare className="w-4 h-4 mr-2" />
              Create Room
            </Button>
          </div>

          {chatRooms.length === 0 ? (
            <div className="text-gray-500 text-center mt-4">No chat rooms found for this hackathon.</div>
          ) : (
            chatRooms.map((room) => (
              <Card key={room._id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="p-8 flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="flex items-center gap-2">
                        <Hash className="w-5 h-5 text-gray-500" />
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{room.type} Room</h3>
                          <Badge variant="outline" className="text-xs">
                            {room.team ? "Team" : "General"}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          ID: {room._id}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            {room.team ? (
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                <span>Team Chat</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 text-green-600">
                                <Volume2 className="w-4 h-4" />
                                <span>Open</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button size="lg" className="ml-4">
                      Join
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Sidebar Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Chat Overview</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Rooms</span>
                <span className="font-medium">{chatRooms.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Unread Messages</span>
                <span className="font-medium text-red-600">--</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Messages</CardTitle>
              <CardDescription>Will be live updated here</CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <p className="text-sm text-gray-500">Coming soon</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
