import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { TopBar } from "@/components/TopBar";
import StartupForm from "@/components/StartupForm";

const MyStartup = () => {
  return (
    <SidebarProvider defaultOpen={true} className="min-h-screen">
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <TopBar />
          <main className="flex-1 overflow-auto border-l border-border">
            <StartupForm />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MyStartup;
