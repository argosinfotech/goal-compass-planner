
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { Settings, Bell, Shield, User } from 'lucide-react';

const SettingsPage = () => {
  const [generalSettings, setGeneralSettings] = useState({
    companyName: 'Acme Corp',
    teamName: 'Product Team',
    weekStart: 'monday',
    timeZone: 'America/Los_Angeles',
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyDigest: true,
    mentionAlerts: true,
    goalCompletions: true,
  });

  const handleGeneralSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Settings updated',
      description: 'Your general settings have been saved.',
    });
  };

  const handleNotificationToggle = (setting: string) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev],
    }));
    toast({
      title: 'Notification settings updated',
      description: 'Your notification preferences have been saved.',
    });
  };

  const handleAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Account updated',
      description: 'Your account details have been saved.',
    });
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account settings and preferences
          </p>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid grid-cols-3 max-w-md mb-8">
            <TabsTrigger value="general">
              <Settings className="h-4 w-4 mr-2" />
              General
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="account">
              <User className="h-4 w-4 mr-2" />
              Account
            </TabsTrigger>
          </TabsList>

          {/* General Settings Tab */}
          <TabsContent value="general">
            <Card>
              <form onSubmit={handleGeneralSubmit}>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>
                    Configure your organization and general preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      value={generalSettings.companyName}
                      onChange={(e) => 
                        setGeneralSettings({ ...generalSettings, companyName: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="teamName">Team Name</Label>
                    <Input
                      id="teamName"
                      value={generalSettings.teamName}
                      onChange={(e) => 
                        setGeneralSettings({ ...generalSettings, teamName: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weekStart">Week Starts On</Label>
                    <select
                      id="weekStart"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={generalSettings.weekStart}
                      onChange={(e) => 
                        setGeneralSettings({ ...generalSettings, weekStart: e.target.value })
                      }
                    >
                      <option value="monday">Monday</option>
                      <option value="sunday">Sunday</option>
                      <option value="saturday">Saturday</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timeZone">Time Zone</Label>
                    <select
                      id="timeZone"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={generalSettings.timeZone}
                      onChange={(e) => 
                        setGeneralSettings({ ...generalSettings, timeZone: e.target.value })
                      }
                    >
                      <option value="America/Los_Angeles">Pacific Time (US & Canada)</option>
                      <option value="America/New_York">Eastern Time (US & Canada)</option>
                      <option value="UTC">UTC</option>
                      <option value="Europe/London">London</option>
                      <option value="Asia/Tokyo">Tokyo</option>
                    </select>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit">Save Changes</Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Configure how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-sm text-muted-foreground">
                      Receive updates and alerts via email
                    </p>
                  </div>
                  <Switch 
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={() => handleNotificationToggle('emailNotifications')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Push Notifications</h4>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications on your device
                    </p>
                  </div>
                  <Switch 
                    checked={notificationSettings.pushNotifications}
                    onCheckedChange={() => handleNotificationToggle('pushNotifications')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Weekly Digest</h4>
                    <p className="text-sm text-muted-foreground">
                      Get a summary of activity each week
                    </p>
                  </div>
                  <Switch 
                    checked={notificationSettings.weeklyDigest}
                    onCheckedChange={() => handleNotificationToggle('weeklyDigest')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Mention Alerts</h4>
                    <p className="text-sm text-muted-foreground">
                      Get notified when you're mentioned in comments
                    </p>
                  </div>
                  <Switch 
                    checked={notificationSettings.mentionAlerts}
                    onCheckedChange={() => handleNotificationToggle('mentionAlerts')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Goal Completions</h4>
                    <p className="text-sm text-muted-foreground">
                      Get notified when objectives or key results are completed
                    </p>
                  </div>
                  <Switch 
                    checked={notificationSettings.goalCompletions}
                    onCheckedChange={() => handleNotificationToggle('goalCompletions')}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Account Tab */}
          <TabsContent value="account">
            <Card>
              <form onSubmit={handleAccountSubmit}>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>
                    Update your personal information and settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name</Label>
                    <Input id="name" defaultValue="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" defaultValue="john.doe@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input id="role" defaultValue="Product Manager" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea id="bio" placeholder="Tell us about yourself" />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" type="button">
                    Change Password
                  </Button>
                  <Button type="submit">Update Profile</Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default SettingsPage;
