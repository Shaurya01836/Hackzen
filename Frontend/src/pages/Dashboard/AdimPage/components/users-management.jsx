"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "./ui/AdminCard";
import { Input } from "./ui/input";
import { Button } from "./ui/AdminButton";
import { Badge } from "./ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "./ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "./ui/dropdown-menu";
import {
  Search,
  Filter,
  Eye,
  Ban,
  Shield,
  MoreHorizontal
} from "lucide-react";

export function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("https://hackzen.onrender.com/api/users", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };

    fetchUsers();
  }, []);

  const handleChangeRole = async (userId) => {
    const newRole = prompt(
      "Enter new role:\nparticipant, organizer, mentor, judge, admin"
    );
    if (!newRole) return;

    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `https://hackzen.onrender.com/api/users/${userId}/role`,
        { newRole },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      alert("User role updated");
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      alert("Failed to update role");
    }
  };

  const formatRole = (role) =>
    role.charAt(0).toUpperCase() + role.slice(1);

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "Inactive":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "Banned":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "organizer":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      case "mentor":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "judge":
        return "bg-orange-500/20 text-orange-300 border-orange-500/30";
      case "admin":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Users Management</h1>
        <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
          Export Users
        </Button>
      </div>

      <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white">User Directory</CardTitle>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/5 border-purple-500/20 text-white placeholder-gray-400"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-purple-500/20 text-white hover:bg-white/5">
                  <Filter className="w-4 h-4 mr-2" />
                  Role: {selectedRole}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-black/90 backdrop-blur-xl border-purple-500/20">
                {["All", "Participant", "Organizer", "Mentor", "Judge", "Admin"].map((role) => (
                  <DropdownMenuItem
                    key={role}
                    onClick={() => setSelectedRole(role)}
                    className="text-white hover:bg-white/5"
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
                <TableHead className="text-gray-300">User</TableHead>
                <TableHead className="text-gray-300">Role</TableHead>
                <TableHead className="text-gray-300">Joined On</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user._id} className="border-purple-500/20 hover:bg-white/5">
                  <TableCell className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {user.name?.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-white font-medium">{user.name}</div>
                      <div className="text-gray-400 text-sm">{user.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRoleColor(user.role)}>
                      {formatRole(user.role)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor("Active")}>Active</Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-black/90 backdrop-blur-xl border-purple-500/20">
                        <DropdownMenuItem className="text-white hover:bg-white/5">
                          <Eye className="w-4 h-4 mr-2" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-white hover:bg-white/5" onClick={() => handleChangeRole(user._id)}>
                          <Shield className="w-4 h-4 mr-2" />
                          Change Role
                        </DropdownMenuItem>
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
