
import React from "react";
import { Map, Volume2, VolumeX, Menu } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";

interface LayoutProps {
  children: React.ReactNode;
  handleOpenLogin: () => void;
  handleOpenAddLocation: () => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children,
  handleOpenLogin,
  handleOpenAddLocation
}) => {
  const { currentUser, currentView, setCurrentView } = useApp();
  const { toast } = useToast();

  const handleAddLocation = () => {
    if (!currentUser) {
      toast({
        title: "You need to log in",
        description: "Please log in to add a location",
        variant: "destructive",
      });
      return;
    }
    handleOpenAddLocation();
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <VolumeX className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold">QuietSpotter</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className={`${currentView === 'map' ? 'bg-secondary' : ''}`}
              onClick={() => setCurrentView("map")}
            >
              <Map className="h-5 w-5 mr-1" />
              Map
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`${currentView === 'list' ? 'bg-secondary' : ''}`}
              onClick={() => setCurrentView("list")}
            >
              <Volume2 className="h-5 w-5 mr-1" />
              List
            </Button>
            
            <div className="ml-2">
              {currentUser ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="relative">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-white">
                          {currentUser.username.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <div className="px-2 py-1.5 text-sm font-medium">
                      {currentUser.username}
                    </div>
                    <DropdownMenuItem onClick={handleAddLocation}>
                      Add Location
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toast({ title: "Reports", description: `You've submitted ${currentUser.reports} reports` })}>
                      My Reports ({currentUser.reports})
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button size="sm" onClick={handleOpenLogin}>
                  Log In
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;
