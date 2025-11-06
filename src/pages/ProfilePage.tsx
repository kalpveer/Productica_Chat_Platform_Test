import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { TopBar } from "@/components/TopBar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useStartupContext } from "@/hooks/useStartupContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const { user, signOut } = useAuth();
  const { startupProfile, syncStartupProfile } = useStartupContext();
  const [fullName, setFullName] = useState(user?.full_name || "");
  const [title, setTitle] = useState("Founder, Productica");
  const navigate = useNavigate();

  const handleSave = async () => {
    // In demo mode, just show a success UI; real app would update Supabase user
    // Optionally sync startup tagline as a convenience
    if (startupProfile) {
      syncStartupProfile({ ...startupProfile, tagline: startupProfile.tagline });
    }
    alert("Profile updated");
  };

  return (
    <SidebarProvider defaultOpen={true} className="min-h-screen">
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <TopBar />
          <main className="flex-1 overflow-y-auto border-l border-border p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16 border border-border">
                  <AvatarImage src={user?.avatar_url} alt={user?.full_name || "User"} />
                  <AvatarFallback>{user?.full_name?.[0] || user?.email?.[0] || "U"}</AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl font-semibold">My Account</h1>
                  <p className="text-sm text-muted-foreground">Manage your personal details and startups</p>
                </div>
              </div>

              <Card className="bg-card border-border rounded-2xl">
                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Name</Label>
                      <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input value={user?.email || ""} disabled />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="title">Role / Title</Label>
                      <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="secondary" onClick={handleSave} className="rounded-xl">Save</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border rounded-2xl">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium">Linked Startups</h2>
                    <Button variant="secondary" onClick={() => navigate('/my-startup')} className="rounded-xl">Add New</Button>
                  </div>
                  {startupProfile ? (
                    <div className="rounded-xl border border-border p-4">
                      <div className="font-medium">{startupProfile.startupName}</div>
                      <div className="text-sm text-muted-foreground">{startupProfile.tagline}</div>
                      <div className="mt-2 flex gap-2">
                        <Button size="sm" variant="secondary" onClick={() => navigate('/my-startup')} className="rounded-xl">View</Button>
                        <Button size="sm" variant="secondary" onClick={() => navigate('/my-startup')} className="rounded-xl">Edit</Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No startups linked yet.</p>
                  )}
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button variant="destructive" onClick={signOut} className="rounded-xl">Logout</Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ProfilePage;
