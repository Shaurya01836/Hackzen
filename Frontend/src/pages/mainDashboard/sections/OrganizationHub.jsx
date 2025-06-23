import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/CommonUI/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/CommonUI/card";
import { Button } from "../../../components/CommonUI/button";

export const OrganizationHub = ({ onBack }) => {
  return (
    <div className="p-6 bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50 md:min-h-screen">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Organization Hub</h2>
        <Button variant="outline" onClick={onBack}>Back</Button>
      </div>

      <Tabs defaultValue="apply" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="apply">Apply as Organizer</TabsTrigger>
          <TabsTrigger value="applications">My Applications</TabsTrigger>
          <TabsTrigger value="organizations">My Organizations</TabsTrigger>
        </TabsList>

        {/* Apply as Organizer */}
        <TabsContent value="apply">
          <Card>
            <CardHeader>
              <CardTitle>Apply to Become an Organizer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* TODO: Add form here */}
              <p className="text-gray-600">
                Fill out your details and organization information to apply.
              </p>
              <Button variant="default">Open Application Form</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* View Applications */}
        <TabsContent value="applications">
          <Card>
            <CardHeader>
              <CardTitle>My Organizer Applications</CardTitle>
            </CardHeader>
            <CardContent>
              {/* TODO: Show list of user’s applications with statuses */}
              <p className="text-gray-500">You have no applications yet.</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* My Organizations */}
        <TabsContent value="organizations">
          <Card>
            <CardHeader>
              <CardTitle>My Organizations</CardTitle>
            </CardHeader>
            <CardContent>
              {/* TODO: Display list of organizations the user is part of */}
              <p className="text-gray-500">You are not part of any organizations yet.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
