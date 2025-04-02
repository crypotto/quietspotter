
import React, { useState } from "react";
import { AppProvider } from "@/context/AppContext";
import Layout from "@/components/Layout";
import MapView from "@/components/MapView";
import LocationList from "@/components/LocationList";
import LocationDetail from "@/components/LocationDetail";
import LoginDialog from "@/components/LoginDialog";
import AddLocationDialog from "@/components/AddLocationDialog";
import { useApp } from "@/context/AppContext";

const IndexContent: React.FC = () => {
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [locationDetailOpen, setLocationDetailOpen] = useState(false);
  const [addLocationOpen, setAddLocationOpen] = useState(false);
  const { currentView, selectedLocation } = useApp();

  // When a location is selected, open the detail dialog
  React.useEffect(() => {
    if (selectedLocation) {
      setLocationDetailOpen(true);
    }
  }, [selectedLocation]);

  return (
    <>
      <Layout 
        handleOpenLogin={() => setLoginDialogOpen(true)} 
        handleOpenAddLocation={() => setAddLocationOpen(true)}
      >
        <div className="h-full">
          {currentView === "map" ? <MapView /> : <LocationList />}
        </div>
      </Layout>

      {/* Dialogs */}
      <LoginDialog 
        open={loginDialogOpen} 
        onOpenChange={setLoginDialogOpen} 
      />
      
      <LocationDetail 
        open={locationDetailOpen} 
        onOpenChange={setLocationDetailOpen} 
      />
      
      <AddLocationDialog
        open={addLocationOpen}
        onOpenChange={setAddLocationOpen}
      />
    </>
  );
};

const Index: React.FC = () => {
  return (
    <AppProvider>
      <IndexContent />
    </AppProvider>
  );
};

export default Index;
