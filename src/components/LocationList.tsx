
import React from "react";
import { useApp } from "@/context/AppContext";
import LocationCard from "./LocationCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getNoiseLevelFromNumber } from "@/types";

const LocationList: React.FC = () => {
  const { locations, setSelectedLocation, filterNoiseLevel, setFilterNoiseLevel } = useApp();
  
  const filteredLocations = filterNoiseLevel !== null
    ? locations.filter(loc => loc.averageNoiseLevel <= filterNoiseLevel)
    : locations;
  
  const sortedLocations = [...filteredLocations].sort((a, b) => a.averageNoiseLevel - b.averageNoiseLevel);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Locations</h2>
        
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
    </div>
  );
};

export default LocationList;
