import { useState } from "react";
import { LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import type { User } from "@shared/schema";
import NotesSection from "@/components/notes-section";
import PoemsSection from "@/components/poems-section";
import ConsoleSection from "@/components/console-section";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"notes" | "poems" | "console">("notes");
  const { user } = useAuth();
  const userData = user as User | undefined;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header Navigation */}
      <header className="bg-card border-b border-border shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">TN</span>
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-foreground tracking-tight">TALKING NOTES</h1>
                {userData && (
                  <p className="text-sm text-muted-foreground">Welcome back, {userData.firstName || userData.email || 'Friend'}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Logout Button */}
              <a
                href="/api/logout"
                className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-muted"
                data-testid="link-logout"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm">Logout</span>
              </a>
              
              {/* Navigation Tabs */}
              <nav className="flex space-x-1 bg-muted p-1 rounded-xl">
              <button 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-primary/20 ${
                  activeTab === "notes" ? "nav-tab active" : "nav-tab text-muted-foreground"
                }`}
                onClick={() => setActiveTab("notes")}
                data-testid="tab-notes"
              >
                Notes
              </button>
              <button 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-primary/20 ${
                  activeTab === "poems" ? "nav-tab active" : "nav-tab text-muted-foreground"
                }`}
                onClick={() => setActiveTab("poems")}
                data-testid="tab-poems"
              >
                Poems
              </button>
              <button 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-primary/20 ${
                  activeTab === "console" ? "nav-tab active" : "nav-tab text-muted-foreground"
                }`}
                onClick={() => setActiveTab("console")}
                data-testid="tab-console"
              >
                Console
              </button>
              </nav>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        {activeTab === "notes" && <NotesSection />}
        {activeTab === "poems" && <PoemsSection />}
        {activeTab === "console" && <ConsoleSection />}
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-6 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-muted-foreground text-sm">
            Your thoughts are safe and private. All data is stored locally and encrypted.
          </p>
        </div>
      </footer>
    </div>
  );
}
