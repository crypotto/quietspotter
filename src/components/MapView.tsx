
import React, { useState, useRef, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { Location, getNoiseLevelFromNumber } from "@/types";
import { MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import NoiseSlider from "./NoiseSlider";

// Since we don't have a real map integration in this demo, we'll make a simulated map view
const MapView: React.FC = () => {
  const { locations, setSelectedLocation, filterNoiseLevel, setFilterNoiseLevel } = useApp();
  const [isLoading, setIsLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [tempFilterValue, setTempFilterValue] = useState<number | null>(filterNoiseLevel || 10);
  const mapRef = useRef<HTMLDivElement>(null);
  
  // Filter locations based on noise level
  const filteredLocations = filterNoiseLevel !== null
    ? locations.filter(loc => loc.averageNoiseLevel <= filterNoiseLevel)
    : locations;
  
  // Simulate map loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Apply filter
  const applyFilter = () => {
    setFilterNoiseLevel(tempFilterValue);
    setFilterOpen(false);
  };
  
  // Reset filter
  const resetFilter = () => {
    setTempFilterValue(null);
    setFilterNoiseLevel(null);
    setFilterOpen(false);
  };

  return (
    <div className="relative h-full">
      {/* Map container */}
      <div 
        ref={mapRef}
        className="h-full bg-[#f8f9fa] relative overflow-hidden"
        style={{
          backgroundImage: "url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/-74.006,40.7128,12,0/1200x800?access_token=pk.placeholder')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading map...</span>
          </div>
        ) : (
          <>
            {/* Pins on the map */}
            {filteredLocations.map(location => (
              <LocationPin 
                key={location.id}
                location={location}
                onClick={() => setSelectedLocation(location)}
              />
            ))}
          </>
        )}
      </div>
      
      {/* Filter control */}
      <div className="absolute left-4 top-4 z-10">
        <Popover open={filterOpen} onOpenChange={setFilterOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="bg-white shadow-sm">
              {filterNoiseLevel !== null ? (
                <span>Noise ≤ {filterNoiseLevel}/10</span>
              ) : (
                <span>Filter by noise</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <h4 className="font-medium">Maximum Noise Level</h4>
              {tempFilterValue !== null ? (
                <NoiseSlider
                  value={tempFilterValue}
                  onChange={setTempFilterValue}
                />
              ) : (
                <p className="text-sm text-muted-foreground">No filter applied</p>
              )}
              <div className="flex justify-between">
                <Button variant="outline" size="sm" onClick={resetFilter}>
                  Reset
                </Button>
                <Button size="sm" onClick={applyFilter}>
                  Apply Filter
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      {/* Info box */}
      <div className="absolute right-4 bottom-4 bg-white p-3 rounded-lg shadow-md text-sm max-w-xs">
        <p className="font-medium mb-1">Map View</p>
        <p className="text-muted-foreground text-xs">
          This is a simulated map view for demonstration purposes. In a real app, 
          this would be an interactive map using Mapbox or Google Maps.
        </p>
      </div>
    </div>
  );
};

interface LocationPinProps {
  location: Location;
  onClick: () => void;
}

const LocationPin: React.FC<LocationPinProps> = ({ location, onClick }) => {
  const noiseLevel = getNoiseLevelFromNumber(location.averageNoiseLevel);
  
  // Randomize position a bit to simulate map placement
  const left = `${25 + Math.random() * 50}%`;
  const top = `${15 + Math.random() * 60}%`;
  
  let pinColor = "bg-noise-quiet";
  if (noiseLevel === "moderate") pinColor = "bg-noise-moderate";
  if (noiseLevel === "noisy") pinColor = "bg-noise-noisy";
  
  return (
    <button
      className={`absolute ${pinColor} text-white rounded-full p-2 hover:scale-110 transition-transform shadow-md z-10`}
      style={{ left, top }}
      onClick={onClick}
    >
      <MapPin className="h-5 w-5" />
    </button>
  );
};

export default MapView;
