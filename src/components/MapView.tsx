
import React, { useState, useRef } from "react";
import { useApp } from "@/context/AppContext";
import { Location, getNoiseLevelFromNumber } from "@/types";
import { Loader2, MapPin, Plus, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import NoiseSlider from "./NoiseSlider";
import { useLoadScript, GoogleMap, MarkerF } from "@react-google-maps/api";
import AddLocationDialog from "./AddLocationDialog";
import AddCustomLocationDialog from "./AddCustomLocationDialog";
import { useIsMobile } from "@/hooks/use-mobile";

// Define libraries outside of the component to avoid reloading
const libraries = ["places"];

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const defaultCenter = {
  lat: 40.7128,
  lng: -74.0060, // Default to New York City
};

// Use the provided Google Maps API key
const GOOGLE_MAPS_API_KEY = "AIzaSyAeBLYF8zcuSCppMrju5_PBHclDxEOfvFk";

const MapView: React.FC = () => {
  const { locations, setSelectedLocation, filterNoiseLevel, setFilterNoiseLevel } = useApp();
  const [filterOpen, setFilterOpen] = useState(false);
  const [tempFilterValue, setTempFilterValue] = useState<number | null>(filterNoiseLevel || 10);
  const [addLocationOpen, setAddLocationOpen] = useState(false);
  const [addCustomLocationOpen, setAddCustomLocationOpen] = useState(false);
  const [mapClickPosition, setMapClickPosition] = useState<{lat: number, lng: number} | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const isMobile = useIsMobile();
  
  // Filter locations based on noise level
  const filteredLocations = filterNoiseLevel !== null
    ? locations.filter(loc => loc.averageNoiseLevel <= filterNoiseLevel)
    : locations;
  
  // Load Google Maps API with the provided key
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: libraries as any,
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

  // Handle map click
  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      setMapClickPosition({
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      });
      setAddCustomLocationOpen(true);
    }
  };

  if (loadError) {
    return (
      <div className="h-full flex items-center justify-center bg-[#1A1F2C]">
        <div className="text-center p-4">
          <p className="text-lg font-medium text-white">Error loading maps</p>
          <p className="text-sm text-gray-400">{loadError.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full">
      {/* Map container */}
      <div className="h-full">
        {!isLoaded ? (
          <div className="absolute inset-0 flex items-center justify-center bg-[#1A1F2C]/80">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-white">Loading map...</span>
          </div>
        ) : (
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={defaultCenter}
            zoom={12}
            onLoad={onMapLoad}
            onClick={handleMapClick}
            options={{
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
              styles: [
                {
                  featureType: "all",
                  elementType: "all",
                  stylers: [{ saturation: -100 }, { lightness: -20 }]
                },
                {
                  featureType: "water",
                  elementType: "all",
                  stylers: [{ color: "#182236" }]
                },
                {
                  featureType: "road",
                  elementType: "all",
                  stylers: [{ color: "#2A2E3A" }]
                }
              ]
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
      
      {/* Controls - For Mobile they are at the bottom */}
      {isMobile ? (
        <div className="absolute bottom-4 left-0 right-0 px-4 z-10 flex flex-col gap-2">
          <div className="flex gap-2">
            <Popover open={filterOpen} onOpenChange={setFilterOpen}>
              <PopoverTrigger asChild className="flex-1">
                <Button variant="outline" className="bg-[#222831] border-[#2A2E3A] text-white hover:bg-[#2A2E3A] w-full">
                  <Filter className="h-4 w-4 mr-2" />
                  {filterNoiseLevel !== null ? (
                    <span>Noise ≤ {filterNoiseLevel}/10</span>
                  ) : (
                    <span>Filter by noise</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[calc(100vw-40px)] bg-[#222831] border-[#2A2E3A] text-white">
                <div className="space-y-4">
                  <h4 className="font-medium">Maximum Noise Level</h4>
                  {tempFilterValue !== null ? (
                    <NoiseSlider
                      value={tempFilterValue}
                      onChange={setTempFilterValue}
                    />
                  ) : (
                    <p className="text-sm text-gray-400">No filter applied</p>
                  )}
                  <div className="flex justify-between">
                    <Button variant="outline" size="sm" onClick={resetFilter} className="border-[#2A2E3A] hover:bg-[#2A2E3A]">
                      Reset
                    </Button>
                    <Button size="sm" onClick={applyFilter} className="bg-primary hover:bg-primary/90">
                      Apply Filter
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={() => setAddLocationOpen(true)}
              className="bg-[#222831] text-primary hover:bg-[#2A2E3A] border border-[#2A2E3A] flex-1"
              variant="outline"
            >
              <MapPin className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="text-xs sm:text-sm">Add from Search</span>
            </Button>
            <Button 
              variant="secondary"
              className="bg-[#222831] text-primary hover:bg-[#2A2E3A] border border-[#2A2E3A] flex-1"
              onClick={() => {
                if (mapRef.current) {
                  const center = mapRef.current.getCenter();
                  if (center) {
                    setMapClickPosition({
                      lat: center.lat(),
                      lng: center.lng()
                    });
                    setAddCustomLocationOpen(true);
                  }
                }
              }}
            >
              <Plus className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="text-xs sm:text-sm">Add Location</span>
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* Desktop filter controls */}
          <div className="absolute left-4 top-4 z-10">
            <Popover open={filterOpen} onOpenChange={setFilterOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="bg-[#222831] border-[#2A2E3A] text-white hover:bg-[#2A2E3A]">
                  {filterNoiseLevel !== null ? (
                    <span>Noise ≤ {filterNoiseLevel}/10</span>
                  ) : (
                    <span>Filter by noise</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 bg-[#222831] border-[#2A2E3A] text-white">
                <div className="space-y-4">
                  <h4 className="font-medium">Maximum Noise Level</h4>
                  {tempFilterValue !== null ? (
                    <NoiseSlider
                      value={tempFilterValue}
                      onChange={setTempFilterValue}
                    />
                  ) : (
                    <p className="text-sm text-gray-400">No filter applied</p>
                  )}
                  <div className="flex justify-between">
                    <Button variant="outline" size="sm" onClick={resetFilter} className="border-[#2A2E3A] hover:bg-[#2A2E3A]">
                      Reset
                    </Button>
                    <Button size="sm" onClick={applyFilter} className="bg-primary hover:bg-primary/90">
                      Apply Filter
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Desktop add location buttons */}
          <div className="absolute right-4 top-4 z-10 flex flex-col gap-2">
            <Button 
              onClick={() => setAddLocationOpen(true)}
              className="bg-[#222831] text-primary hover:bg-[#2A2E3A] border border-[#2A2E3A]"
              variant="outline"
            >
              <MapPin className="mr-2 h-4 w-4" />
              Add from Search
            </Button>
            <Button 
              variant="secondary"
              className="bg-[#222831] text-primary hover:bg-[#2A2E3A] border border-[#2A2E3A]"
              onClick={() => {
                if (mapRef.current) {
                  const center = mapRef.current.getCenter();
                  if (center) {
                    setMapClickPosition({
                      lat: center.lat(),
                      lng: center.lng()
                    });
                    setAddCustomLocationOpen(true);
                  }
                }
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Custom Location
            </Button>
          </div>
          
          {/* Info box - desktop only */}
          <div className="absolute right-4 bottom-4 bg-[#222831]/90 border border-[#2A2E3A] p-3 rounded-lg shadow-md text-sm max-w-xs">
            <p className="font-medium mb-1 text-white">Map View</p>
            <p className="text-gray-400 text-xs">
              Showing {filteredLocations.length} locations. 
              Click on a marker to see details or click anywhere on the map to add a custom location.
            </p>
          </div>
        </>
      )}

      {/* Dialogs */}
      <AddLocationDialog 
        open={addLocationOpen} 
        onOpenChange={setAddLocationOpen} 
      />
      <AddCustomLocationDialog
        open={addCustomLocationOpen}
        onOpenChange={setAddCustomLocationOpen}
        position={mapClickPosition}
      />
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
