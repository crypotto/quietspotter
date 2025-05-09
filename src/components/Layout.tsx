
import React from "react";
import { Map, Volume2, VolumeX, Menu, LogOut, Plus, User } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const { currentUser, currentView, setCurrentView, logout } = useApp();
  const { toast } = useToast();
  const isMobile = useIsMobile();

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
    <div className="flex flex-col h-screen bg-gradient-to-b from-[#1A1F2C] to-[#403E43] text-white">
      {/* Header */}
      <header className="bg-[#222831] border-b border-[#2A2E3A] sticky top-0 z-10">
        <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4 flex justify-between items-center">
          <div className="flex items-center gap-1 sm:gap-2">
            <VolumeX className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            <h1 className="text-lg sm:text-xl font-semibold text-white">QuietSpotter</h1>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2">
            {!isMobile && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`text-gray-300 hover:text-white ${currentView === 'map' ? 'bg-[#2A2E3A]' : ''}`}
                  onClick={() => setCurrentView("map")}
                >
                  <Map className="h-4 w-4 sm:h-5 sm:w-5 mr-1" />
                  <span className="hidden sm:inline">Map</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`text-gray-300 hover:text-white ${currentView === 'list' ? 'bg-[#2A2E3A]' : ''}`}
                  onClick={() => setCurrentView("list")}
                >
                  <Volume2 className="h-4 w-4 sm:h-5 sm:w-5 mr-1" />
                  <span className="hidden sm:inline">List</span>
                </Button>
              </>
            )}
            
            <div className="ml-1 sm:ml-2">
              {currentUser ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="relative hover:bg-[#2A2E3A]">
                      <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
                        <AvatarFallback className="bg-primary text-white text-xs sm:text-sm">
                          {currentUser.username.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-[#222831] border-[#2A2E3A] text-white min-w-[180px]">
                    <div className="px-2 py-1.5 text-sm font-medium">
                      {currentUser.username}
                    </div>
                    
                    {isMobile && (
                      <>
                        <DropdownMenuItem 
                          className="hover:bg-[#2A2E3A] focus:bg-[#2A2E3A]"
                          onClick={() => setCurrentView("map")}
                        >
                          <Map className="h-4 w-4 mr-2" />
                          Map View
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem 
                          className="hover:bg-[#2A2E3A] focus:bg-[#2A2E3A]"
                          onClick={() => setCurrentView("list")}
                        >
                          <Volume2 className="h-4 w-4 mr-2" />
                          List View
                        </DropdownMenuItem>
                        
                        <DropdownMenuSeparator className="bg-[#2A2E3A]" />
                      </>
                    )}
                    
                    <DropdownMenuItem onClick={handleAddLocation} className="hover:bg-[#2A2E3A] focus:bg-[#2A2E3A]">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Location
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem onClick={() => toast({ title: "Reports", description: `You've submitted ${currentUser.reports} reports` })} className="hover:bg-[#2A2E3A] focus:bg-[#2A2E3A]">
                      <User className="h-4 w-4 mr-2" />
                      My Reports ({currentUser.reports})
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator className="bg-[#2A2E3A]" />
                    
                    <DropdownMenuItem onClick={logout} className="text-red-400 hover:text-red-300 hover:bg-[#2A2E3A] focus:bg-[#2A2E3A]">
                      <LogOut className="h-4 w-4 mr-2" />
                      Log Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button size="sm" className="bg-primary hover:bg-primary/90 px-3 text-xs sm:text-sm sm:px-4" onClick={handleOpenLogin}>
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
