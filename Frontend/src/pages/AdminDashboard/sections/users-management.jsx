"use client";

import { useEffect, useState } from "react";
import ChangeRoleDialog from "../../../components/AdminUI/ChangeRoleDialog";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/CommonUI/card";
import { Input } from "../../../components/CommonUI/input";
import { Button } from "../../../components/CommonUI/button";
import { Badge } from "../../../components/CommonUI/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/AdminUI/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/AdminUI/dropdown-menu";
import {
  Search,
  Filter,
  Eye,
  Ban,
  Shield,
  MoreHorizontal,
  Shuffle,
} from "lucide-react";

export function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:3000/api/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };

    fetchUsers();
  }, []);

  const formatRole = (role) => role.charAt(0).toUpperCase() + role.slice(1);

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-500 text-white border-green-500/30";
      case "Inactive":
        return "bg-yellow-500 text-white border-yellow-500/30";
      case "Banned":
        return "bg-red-500 text-white border-red-500/30";
      default:
        return "bg-gray-500 text-white border-gray-500/30";
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "organizer":
        return "bg-purple-500 text-white border-purple-500/30";
      case "mentor":
        return "bg-blue-500 text-white border-blue-500/30";
      case "judge":
        return "bg-orange-500 text-white border-orange-500/30";
      case "admin":
        return "bg-red-500 text-white border-red-500/30";
      default:
        return "bg-gray-500 text-white border-gray-500/30";
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole =
      selectedRole === "All" || user.role === selectedRole.toLowerCase();
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50 text-black">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Users Management</h1>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          Export Users
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-gray-700">User Directory</CardTitle>
          <div className="pt-4 flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700 w-4 h-4" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/5 border-purple-500/20 text-black placeholder-gray-500"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="border-purple-500/20 text-gray-700 hover:bg-white/5"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Role: {selectedRole}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white/90 text-black backdrop-blur-xl border-purple-500/20">
                {[
                  "All",
                  "Participant",
                  "Organizer",
                  "Mentor",
                  "Judge",
                  "Admin",
                ].map((role) => (
                  <DropdownMenuItem
                    key={role}
                    onClick={() => setSelectedRole(role)}
                    className=" hover:bg-black hover:text-white"
                  >
                    {role}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-purple-500/20">
                <TableHead className="text-gray-800">User</TableHead>
                <TableHead className="text-gray-800">Role</TableHead>
                <TableHead className="text-gray-800">Joined On</TableHead>
                <TableHead className="text-gray-800">Status</TableHead>
                <TableHead className="text-gray-800">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow
                  key={user._id}
                  className="border-purple-500/20 hover:bg-white/5"
                >
                  <TableCell className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {user.name?.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-gray-700 font-medium">
                        {user.name}
                      </div>
                      <div className="text-gray-400 text-sm">{user.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRoleColor(user.role)}>
                      {formatRole(user.role)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-black">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor("Active")}>Active</Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-400 hover:text-black"
                        >
                          <Shuffle className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-black/90 backdrop-blur-xl border-purple-500/20">
                        <DropdownMenuItem className="text-white hover:bg-white/5">
                          <Eye className="w-4 h-4 mr-2" />
                          View Profile
                        </DropdownMenuItem>
                        <ChangeRoleDialog
                          userId={user._id}
                          currentRole={user.role}
                          onRoleUpdate={(newRole) => {
                            setUsers((prev) =>
                              prev.map((u) =>
                                u._id === user._id ? { ...u, role: newRole } : u
                              )
                            );
                          }}
                        />
                        <DropdownMenuItem className="text-red-400 hover:bg-red-500/10">
                          <Ban className="w-4 h-4 mr-2" />
                          Ban User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
