import React, { useState, useEffect } from 'react';
import { Button } from '../../../components/CommonUI/button';
import { Badge } from '../../../components/CommonUI/badge';
import { Card, CardHeader, CardContent, CardTitle } from '../../../components/CommonUI/card';
import { Table, TableHead, TableBody, TableRow, TableCell, TableHeader } from '../../../components/AdminUI/table';
import { BadgeCheck, Eye, FileText } from 'lucide-react';
import {
  ACard,
  ACardContent,
} from "../../../components/DashboardUI/AnimatedCard";

export default function SponsoredPSList({ proposals, onSelectProposal }) {
  const [organizerNames, setOrganizerNames] = useState({});

  // Fetch organizer names for each proposal
  useEffect(() => {
    const fetchOrganizerNames = async () => {
      const names = {};
      await Promise.all(proposals.map(async (proposal) => {
        if (proposal.hackathon) {
          let hackathonId = null;
          if (typeof proposal.hackathon === 'object' && proposal.hackathon._id) {
            hackathonId = proposal.hackathon._id;
          } else if (typeof proposal.hackathon === 'string') {
            hackathonId = proposal.hackathon;
          }
          
          if (hackathonId) {
            try {
              const hackathonRes = await fetch(`/api/hackathons/${hackathonId}`);
              if (hackathonRes.ok) {
                const hackathon = await hackathonRes.json();
                let organizerId = null;
                if (hackathon.organizer) {
                  if (typeof hackathon.organizer === 'object' && hackathon.organizer._id) {
                    organizerId = hackathon.organizer._id;
                  } else if (typeof hackathon.organizer === 'string') {
                    organizerId = hackathon.organizer;
                  }
                }
                if (organizerId) {
                  const organizerRes = await fetch(`/api/users/${organizerId}`);
                  if (organizerRes.ok) {
                    const organizer = await organizerRes.json();
                    names[hackathonId] = organizer.name || 'Unknown Organizer';
                  }
                }
              }
            } catch (error) {
              console.error('Error fetching organizer name:', error);
            }
          }
        }
      }));
      setOrganizerNames(names);
    };

    if (proposals.length > 0) {
      fetchOrganizerNames();
    }
  }, [proposals]);

  const total = proposals.length;
  const approved = proposals.filter(p => p.status === 'approved').length;
  const pending = proposals.filter(p => p.status === 'pending').length;

  return (
    <div className="flex-1 space-y-6 p-6 bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50 md:min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Sponsored Problem Statements</h1>
          <p className="text-gray-500 text-sm">Manage and view your sponsored problem statements</p>
        </div>

        {/* Stats Cards - Modern, Clean, Animated */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <ACard>
            <ACardContent className="pt-4">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{total}</p>
                  <p className="text-sm text-gray-500">Total Proposals</p>
                </div>
              </div>
            </ACardContent>
          </ACard>
          <ACard>
            <ACardContent className="pt-4">
              <div className="flex items-center gap-3">
                <BadgeCheck className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{approved}</p>
                  <p className="text-sm text-gray-500">Approved</p>
                </div>
              </div>
            </ACardContent>
          </ACard>
          <ACard>
            <ACardContent className="pt-4">
              <div className="flex items-center gap-3">
                <BadgeCheck className="w-8 h-8 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold">{pending}</p>
                  <p className="text-sm text-gray-500">Pending</p>
                </div>
              </div>
            </ACardContent>
          </ACard>
        </div>

        {/* Table Section */}
        <Card className="bg-white border border-gray-200 shadow-none rounded-xl bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50">
          <CardHeader className="px-4 py-3 border-b border-gray-100">
            <CardTitle className="text-lg font-semibold text-gray-800 pt-4">Your Sponsored Statements</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-100">
                  <TableHead className="text-gray-700 text-xs font-semibold">Problem Statement</TableHead>
                  <TableHead className="text-gray-700 text-xs font-semibold">Hackathon</TableHead>
                  <TableHead className="text-gray-700 text-xs font-semibold">Organizer</TableHead>
                  <TableHead className="text-gray-700 text-xs font-semibold">Status</TableHead>
                  <TableHead className="text-gray-700 text-xs font-semibold">Description</TableHead>
                  <TableHead className="text-gray-700 text-xs font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {proposals.map((p) => {
                  const hackathonName = p.hackathon?.title || 'Unknown';
                  const hackathonId = typeof p.hackathon === 'object' ? p.hackathon._id : p.hackathon;
                  const organizerName = organizerNames[hackathonId] || 'Loading...';
                  const statusColor = p.status === 'approved' 
                    ? 'bg-green-500 text-white' 
                    : p.status === 'pending' 
                    ? 'bg-yellow-400 text-white' 
                    : 'bg-red-400 text-white';
                  return (
                    <TableRow key={p._id} className="border-b border-gray-100 hover:bg-gray-50">
                      {/* Problem Statement */}
                      <TableCell className="align-middle">
                        <span className="font-semibold text-gray-900 flex items-center gap-2">
                          <BadgeCheck className="w-4 h-4 text-gray-300" /> {p.title}
                        </span>
                        <div className="text-xs text-gray-400">ID: {p._id.slice(-8)}</div>
                      </TableCell>
                      {/* Hackathon */}
                      <TableCell className="align-middle">
                        <span className="text-gray-800">{hackathonName}</span>
                      </TableCell>
                      {/* Organizer */}
                      <TableCell className="align-middle">
                        <span className="text-gray-700">{organizerName}</span>
                      </TableCell>
                      {/* Status */}
                      <TableCell className="align-middle">
                        <Badge className={statusColor + ' text-xs px-2 py-1 rounded-full font-medium'}>{p.status}</Badge>
                      </TableCell>
                      {/* Description */}
                      <TableCell className="align-middle">
                        <span className="text-gray-600 text-sm">{p.description?.slice(0, 80) || 'No description available'}</span>
                      </TableCell>
                      {/* Actions */}
                      <TableCell className="align-middle">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => onSelectProposal(p)}
                          className="text-blue-600 border-blue-100 hover:bg-blue-50"
                        >
                          <Eye className="w-4 h-4 mr-2" /> 
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 