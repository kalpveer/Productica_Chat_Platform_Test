import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { TopBar } from "@/components/TopBar";
import { Homepage } from "@/components/Homepage";
import { HelpButton } from "@/components/HelpButton";
import { QuickActionButton } from "@/components/QuickActionButton";
import SearchOverlay from "@/components/SearchOverlay";
import NewChatModal from "@/components/NewChatModal";
import SettingsModal from "@/components/SettingsModal";

const Index = () => {
  return (
    <SidebarProvider defaultOpen={true} className="min-h-screen">
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <TopBar />
          <main className="flex-1 overflow-hidden lg:border-l border-border lg:shadow-[inset_1px_0_0_0_hsl(var(--sidebar-border))]">
            <Homepage />
          </main>
          <SearchOverlay />
          <NewChatModal />
          <SettingsModal />
        </div>
        
        <HelpButton />
        <QuickActionButton />
      </div>
    </SidebarProvider>
  );
};

export default Index;