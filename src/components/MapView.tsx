
import React, { useState, useRef, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { Location, getNoiseLevelFromNumber } from "@/types";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import NoiseSlider from "./NoiseSlider";
import { useLoadScript, GoogleMap, MarkerF } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const defaultCenter = {
  lat: 40.7128,
  lng: -74.0060, // Default to New York City
};

const MapView: React.FC = () => {
  const { locations, setSelectedLocation, filterNoiseLevel, setFilterNoiseLevel } = useApp();
  const [filterOpen, setFilterOpen] = useState(false);
  const [tempFilterValue, setTempFilterValue] = useState<number | null>(filterNoiseLevel || 10);
  const mapRef = useRef<google.maps.Map | null>(null);
  
  // Filter locations based on noise level
  const filteredLocations = filterNoiseLevel !== null
    ? locations.filter(loc => loc.averageNoiseLevel <= filterNoiseLevel)
    : locations;
  
  // Load Google Maps API
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyASsYyj0B3NvD4B7GIhsWaNQvAas7Y1GVc", // This is a public API key, it's okay to include directly
    libraries: ["places"],
  });
  
  const onMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
  };
  
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

  if (loadError) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium">Error loading maps</p>
          <p className="text-sm text-muted-foreground">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full">
      {/* Map container */}
      <div className="h-full">
        {!isLoaded ? (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading map...</span>
          </div>
        ) : (
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={defaultCenter}
            zoom={12}
            onLoad={onMapLoad}
            options={{
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
            }}
          >
            {/* Location markers */}
            {filteredLocations.map(location => (
              <LocationMarker 
                key={location.id}
                location={location}
                onClick={() => setSelectedLocation(location)}
              />
            ))}
          </GoogleMap>
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
          Showing {filteredLocations.length} locations. 
          Click on a marker to see details.
        </p>
      </div>
    </div>
  );
};

interface LocationMarkerProps {
  location: Location;
  onClick: () => void;
}

const LocationMarker: React.FC<LocationMarkerProps> = ({ location, onClick }) => {
  const noiseLevel = getNoiseLevelFromNumber(location.averageNoiseLevel);
  
  let markerIcon: google.maps.Symbol = {
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: "#10b981", // quiet - green
    fillOpacity: 1,
    strokeWeight: 2,
    strokeColor: "#ffffff",
    scale: 10,
  };
  
  if (noiseLevel === "moderate") {
    markerIcon.fillColor = "#f59e0b"; // moderate - amber
  } else if (noiseLevel === "noisy") {
    markerIcon.fillColor = "#ef4444"; // noisy - red
  }
  
  return (
    <MarkerF
      position={{ lat: location.lat, lng: location.lng }}
      onClick={onClick}
      icon={markerIcon}
      title={location.name}
    />
  );
};

export default MapView;
