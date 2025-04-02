
import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import LocationCard from "./LocationCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getNoiseLevelFromNumber } from "@/types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AddCustomLocationDialog from "./AddCustomLocationDialog";

const LocationList: React.FC = () => {
  const { locations, setSelectedLocation, filterNoiseLevel, setFilterNoiseLevel } = useApp();
  const [addCustomLocationOpen, setAddCustomLocationOpen] = useState(false);
  
  // Default to a central position (can be adjusted as needed)
  const [customLocationPosition, setCustomLocationPosition] = useState<{ lat: number; lng: number }>({
    lat: 40.7128,
    lng: -74.0060, // Default to NYC coordinates
  });
  
  const filteredLocations = filterNoiseLevel !== null
    ? locations.filter(loc => loc.averageNoiseLevel <= filterNoiseLevel)
    : locations;
  
  const sortedLocations = [...filteredLocations].sort((a, b) => a.averageNoiseLevel - b.averageNoiseLevel);

  const handleAddCustomLocation = () => {
    // When adding from list view, we use a default position
    setAddCustomLocationOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Locations</h2>
        
        <div className="flex gap-3 items-center">
          <Select
            value={filterNoiseLevel?.toString() || "all"}
            onValueChange={(value) => {
              setFilterNoiseLevel(value === "all" ? null : parseInt(value, 10));
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by noise" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All noise levels</SelectItem>
              <SelectItem value="3">Quiet only</SelectItem>
              <SelectItem value="6">Moderate or less</SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={handleAddCustomLocation}
            size="sm"
            className="whitespace-nowrap"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Custom Location
          </Button>
        </div>
      </div>
      
      {sortedLocations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedLocations.map((location) => (
            <LocationCard
              key={location.id}
              location={location}
              onClick={setSelectedLocation}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-lg text-muted-foreground">No locations match your filters.</p>
          <p className="text-sm mt-2">Try adjusting your filter criteria.</p>
        </div>
      )}

      {/* Add custom location dialog */}
      <AddCustomLocationDialog
        open={addCustomLocationOpen}
        onOpenChange={setAddCustomLocationOpen}
        position={customLocationPosition}
      />
    </div>
  );
};

export default LocationList;
