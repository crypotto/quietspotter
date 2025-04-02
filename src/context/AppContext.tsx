
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Location, NoiseReport, User } from "../types";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AppContextType {
  locations: Location[];
  reports: NoiseReport[];
  users: User[];
  currentUser: User | null;
  selectedLocation: Location | null;
  setSelectedLocation: (location: Location | null) => void;
  addReport: (report: Omit<NoiseReport, "id" | "userId" | "timestamp" | "username">) => void;
  filterNoiseLevel: number | null;
  setFilterNoiseLevel: (level: number | null) => void;
  currentView: "map" | "list";
  setCurrentView: (view: "map" | "list") => void;
  login: (user: User) => void;
  addLocation: (locationData: Omit<Location, "id" | "averageNoiseLevel" | "totalReports" | "imageUrl">) => void;
  logout: () => void;
  isInitializing: boolean;
  fetchLocations: () => Promise<void>;
  fetchReports: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [reports, setReports] = useState<NoiseReport[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [filterNoiseLevel, setFilterNoiseLevel] = useState<number | null>(null);
  const [currentView, setCurrentView] = useState<"map" | "list">("map");
  const [isInitializing, setIsInitializing] = useState(true);
  
  const { toast } = useToast();

  const fetchLocations = async () => {
    try {
      const { data, error } = await supabase
        .from('locations')
        .select("*");

      if (error) {
        console.error("Error fetching locations:", error);
        return;
      }

      if (data) {
        const formattedLocations: Location[] = data.map((loc) => ({
          id: loc.id,
          name: loc.name,
          address: loc.address,
          lat: parseFloat(loc.latitude.toString()),
          lng: parseFloat(loc.longitude.toString()),
          averageNoiseLevel: loc.average_noise_level || 0,
          totalReports: loc.total_reports || 0,
          imageUrl: loc.image_url,
          type: loc.type as "cafe" | "coworking",
        }));

        setLocations(formattedLocations);
      }
    } catch (error) {
      console.error("Error in fetchLocations:", error);
    }
  };

  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from('noise_reports')
        .select("*");

      if (error) {
        console.error("Error fetching reports:", error);
        return;
      }

      if (data) {
        const formattedReports: NoiseReport[] = await Promise.all(
          data.map(async (report) => {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('username')
              .eq('id', report.user_id)
              .single();

            return {
              id: report.id,
              locationId: report.location_id,
              userId: report.user_id,
              noiseLevel: report.noise_level,
              comment: report.comment || "",
              timestamp: report.timestamp || new Date().toISOString(),
              username: profileData?.username || "Anonymous",
            };
          })
        );

        setReports(formattedReports);
      }
    } catch (error) {
      console.error("Error in fetchReports:", error);
    }
  };

  useEffect(() => {
    const initApp = async () => {
      setIsInitializing(true);
      
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (event === 'SIGNED_IN' && session?.user) {
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select("*")
              .eq("id", session.user.id)
              .single();

            if (!profileError && profileData) {
              setCurrentUser({
                id: session.user.id,
                username: profileData.username || 'User',
                reports: profileData.reports || 0,
                createdAt: profileData.created_at || new Date().toISOString(),
              });
            }
          } else if (event === 'SIGNED_OUT') {
            setCurrentUser(null);
          }
        }
      );

      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (!profileError && profileData) {
          setCurrentUser({
            id: session.user.id,
            username: profileData.username || 'User',
            reports: profileData.reports || 0,
            createdAt: profileData.created_at || new Date().toISOString(),
          });
        }
      }

      await fetchLocations();
      await fetchReports();
      
      setIsInitializing(false);
      
      return () => subscription.unsubscribe();
    };

    initApp();
  }, []);

  const addReport = async (reportData: Omit<NoiseReport, "id" | "userId" | "timestamp" | "username">) => {
    if (!currentUser) {
      toast({
        title: "You need to log in",
        description: "Please log in to submit a report",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: newReport, error } = await supabase
        .from('noise_reports')
        .insert({
          location_id: reportData.locationId,
          user_id: currentUser.id,
          noise_level: reportData.noiseLevel,
          comment: reportData.comment,
        })
        .select()
        .single();

      if (error) {
        toast({
          title: "Error submitting report",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (newReport) {
        const formattedReport: NoiseReport = {
          id: newReport.id,
          locationId: newReport.location_id,
          userId: newReport.user_id,
          noiseLevel: newReport.noise_level,
          comment: newReport.comment || "",
          timestamp: newReport.timestamp || new Date().toISOString(),
          username: currentUser.username,
        };

        setReports((prev) => [formattedReport, ...prev]);

        const { data: updatedLocation, error: locationError } = await supabase
          .from('locations')
          .select("*")
          .eq("id", reportData.locationId)
          .single();

        if (!locationError && updatedLocation) {
          setLocations((prev) =>
            prev.map((loc) => {
              if (loc.id === updatedLocation.id) {
                return {
                  ...loc,
                  averageNoiseLevel: updatedLocation.average_noise_level || 0,
                  totalReports: updatedLocation.total_reports || 0,
                };
              }
              return loc;
            })
          );

          setCurrentUser((prev) => {
            if (prev) {
              return {
                ...prev,
                reports: prev.reports + 1,
              };
            }
            return prev;
          });
        }

        toast({
          title: "Report submitted",
          description: "Thank you for your contribution!",
        });
      }
    } catch (error) {
      console.error("Error adding report:", error);
      toast({
        title: "Error submitting report",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const login = (user: User) => {
    setCurrentUser(user);
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast({
          title: "Error signing out",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      
      setCurrentUser(null);
      
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
    } catch (error) {
      console.error("Error in logout:", error);
      toast({
        title: "Error signing out",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const addLocation = async (locationData: Omit<Location, "id" | "averageNoiseLevel" | "totalReports" | "imageUrl">) => {
    if (!currentUser) {
      toast({
        title: "You need to log in",
        description: "Please log in to add a location",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { data: newLocation, error } = await supabase
        .from('locations')
        .insert({
          name: locationData.name,
          address: locationData.address,
          latitude: locationData.lat,
          longitude: locationData.lng,
          type: locationData.type,
          created_by: currentUser.id,
        })
        .select()
        .single();

      if (error) {
        toast({
          title: "Error adding location",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (newLocation) {
        const formattedLocation: Location = {
          id: newLocation.id,
          name: newLocation.name,
          address: newLocation.address,
          lat: parseFloat(newLocation.latitude.toString()),
          lng: parseFloat(newLocation.longitude.toString()),
          averageNoiseLevel: 0,
          totalReports: 0,
          type: newLocation.type as "cafe" | "coworking",
        };
        
        setLocations((prev) => [...prev, formattedLocation]);
        
        toast({
          title: "Location added",
          description: `${formattedLocation.name} has been added successfully!`,
        });
        
        setSelectedLocation(formattedLocation);
      }
    } catch (error) {
      console.error("Error adding location:", error);
      toast({
        title: "Error adding location",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const value = {
    locations,
    reports,
    users,
    currentUser,
    selectedLocation,
    setSelectedLocation,
    addReport,
    filterNoiseLevel,
    setFilterNoiseLevel,
    currentView,
    setCurrentView,
    login,
    addLocation,
    logout,
    isInitializing,
    fetchLocations,
    fetchReports,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
