import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { TopBar } from "@/components/TopBar";
import { ChatInterface } from "@/components/ChatInterface";
import SearchOverlay from "@/components/SearchOverlay";
import NewChatModal from "@/components/NewChatModal";
import SettingsModal from "@/components/SettingsModal";

const Artie = () => {
  return (
    <SidebarProvider defaultOpen={true} className="min-h-screen">
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <TopBar />
          <main className="flex-1 overflow-hidden border-l border-border">
            <ChatInterface />
          </main>
          <SearchOverlay />
          <NewChatModal />
          <SettingsModal />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Artie;