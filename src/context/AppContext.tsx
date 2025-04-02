
import React, { createContext, useContext, useState, ReactNode } from "react";
import { Location, NoiseReport, User } from "../types";
import { mockLocations, mockReports, mockUsers } from "../data/mockData";
import { useToast } from "@/components/ui/use-toast";

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
  login: (username: string) => void;
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
  const [locations, setLocations] = useState<Location[]>(mockLocations);
  const [reports, setReports] = useState<NoiseReport[]>(mockReports);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [filterNoiseLevel, setFilterNoiseLevel] = useState<number | null>(null);
  const [currentView, setCurrentView] = useState<"map" | "list">("map");
  
  const { toast } = useToast();

  const addReport = (reportData: Omit<NoiseReport, "id" | "userId" | "timestamp" | "username">) => {
    if (!currentUser) {
      toast({
        title: "You need to log in",
        description: "Please log in to submit a report",
        variant: "destructive",
      });
      return;
    }

    const newReport: NoiseReport = {
      id: `report-${Date.now()}`,
      userId: currentUser.id,
      timestamp: new Date().toISOString(),
      username: currentUser.username,
      ...reportData,
    };

    // Add the report
    setReports((prev) => [...prev, newReport]);

    // Update the location's average noise level
    setLocations((prev) =>
      prev.map((loc) => {
        if (loc.id === reportData.locationId) {
          const locationReports = [...reports, newReport].filter(
            (r) => r.locationId === loc.id
          );
          const totalNoiseLevel = locationReports.reduce(
            (sum, r) => sum + r.noiseLevel,
            0
          );
          return {
            ...loc,
            averageNoiseLevel: Math.round(totalNoiseLevel / locationReports.length),
            totalReports: loc.totalReports + 1,
          };
        }
        return loc;
      })
    );

    // Update the user's report count
    setUsers((prev) =>
      prev.map((user) => {
        if (user.id === currentUser.id) {
          return {
            ...user,
            reports: user.reports + 1,
          };
        }
        return user;
      })
    );

    // Update current user
    setCurrentUser((prev) => {
      if (prev) {
        return {
          ...prev,
          reports: prev.reports + 1,
        };
      }
      return prev;
    });

    toast({
      title: "Report submitted",
      description: "Thank you for your contribution!",
    });
  };

  const login = (username: string) => {
    // Find if user exists
    const existingUser = users.find((u) => u.username.toLowerCase() === username.toLowerCase());
    
    if (existingUser) {
      setCurrentUser(existingUser);
      toast({
        title: "Welcome back!",
        description: `Logged in as ${existingUser.username}`,
      });
    } else {
      // Create new user
      const newUser: User = {
        id: `user-${Date.now()}`,
        username,
        reports: 0,
        createdAt: new Date().toISOString(),
      };
      
      setUsers((prev) => [...prev, newUser]);
      setCurrentUser(newUser);
      
      toast({
        title: "Welcome!",
        description: `Account created as ${username}`,
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
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
