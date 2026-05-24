"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { envConfig } from "@/config/env.config";
import { Plus, Eye, FileText, Users } from "lucide-react";

export default function AdminDashboardPlaceholder() {
  const { user, logout } = useAuth();

  return (
    <div className="p-gutter space-y-stack-lg max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-headline-md text-headline-md text-on-surface">Dashboard Overview</h2>
          <p className="text-on-surface-variant font-ui-sm">Welcome back, {user?.name || "Admin"}!</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => logout()}>
            Sign Out
          </Button>
          <Button variant="primary">
            <Plus className="w-[18px] h-[18px] mr-2" />
            New Post
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <Eye className="w-6 h-6 text-primary" />
              <span className="text-secondary font-ui-medium text-ui-sm">+12%</span>
            </div>
            <CardTitle>12.5k</CardTitle>
            <CardDescription>Total Views</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <FileText className="w-6 h-6 text-primary" />
              <span className="text-secondary font-ui-medium text-ui-sm">+4</span>
            </div>
            <CardTitle>48</CardTitle>
            <CardDescription>Published Posts</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <Users className="w-6 h-6 text-primary" />
              <span className="text-secondary font-ui-medium text-ui-sm">+2%</span>
            </div>
            <CardTitle>1,204</CardTitle>
            <CardDescription>Active Users</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>Traffic overview for the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-surface-container-low rounded-lg border border-outline-variant/30 border-dashed">
              <span className="text-on-surface-variant font-ui-medium">Chart Visualization Placeholder</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Session</CardTitle>
            <CardDescription>Your current login profile</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-surface-container rounded-lg border border-outline-variant/30 flex items-center gap-4">
               <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-lg">
                 {user?.name?.[0]?.toUpperCase() || "A"}
               </div>
               <div>
                 <p className="font-ui-medium text-on-surface">{user?.name || "Admin User"}</p>
                 <p className="text-ui-sm text-on-surface-variant capitalize">{user?.role || "SuperAdmin"}</p>
               </div>
            </div>
            <p className="text-ui-sm text-on-surface-variant">
               You have full administrative access to all {envConfig.siteName} modules and settings.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
