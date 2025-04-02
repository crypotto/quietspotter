
import React, { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { useApp } from "@/context/AppContext";
import { useLoadScript } from "@react-google-maps/api";
import { Loader2 } from "lucide-react";

interface AddLocationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddLocationDialog: React.FC<AddLocationDialogProps> = ({ open, onOpenChange }) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [type, setType] = useState<"cafe" | "coworking">("cafe");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);
  
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  
  const { toast } = useToast();
  const { addLocation } = useApp();

  // Load Google Maps Places API
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyASsYyj0B3NvD4B7GIhsWaNQvAas7Y1GVc",
    libraries: ["places"],
  });

  // Initialize autocomplete when component mounts
  useEffect(() => {
    if (!isLoaded || !inputRef.current) return;

    // Initialize Google Maps Places Autocomplete
    autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
      fields: ["name", "formatted_address", "geometry"],
      types: ["establishment"],
    });

    // Add listener for place selection
    autocompleteRef.current.addListener("place_changed", () => {
      if (!autocompleteRef.current) return;
      
      const place = autocompleteRef.current.getPlace();
      if (!place.geometry || !place.geometry.location) {
        toast({
          title: "Invalid location",
          description: "Please select a location from the dropdown list",
          variant: "destructive",
        });
        return;
      }

      setSelectedPlace(place);
      setName(place.name || "");
      setAddress(place.formatted_address || "");
    });

    return () => {
      // Clean up
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [isLoaded, toast]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPlace || !selectedPlace.geometry?.location) {
      toast({
        title: "Invalid location",
        description: "Please select a location from the dropdown list",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Add the new location
    const lat = selectedPlace.geometry.location.lat();
    const lng = selectedPlace.geometry.location.lng();
    
    addLocation({
      name: name.trim(),
      address: address.trim(),
      lat,
      lng,
      type: type,
    });
    
    // Reset the form
    setName("");
    setAddress("");
    setType("cafe");
    setSelectedPlace(null);
    setIsSubmitting(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a New Location</DialogTitle>
          <DialogDescription>
            Share a cafe or coworking space with the community.
          </DialogDescription>
        </DialogHeader>
        
        {!isLoaded ? (
          <div className="py-8 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="location-search">Search for a location</Label>
              <Input
                id="location-search"
                ref={inputRef}
                placeholder="Type to search cafes or coworking spaces"
                className="w-full"
                autoComplete="off"
              />
              <p className="text-xs text-muted-foreground">
                Select a location from the dropdown suggestions
              </p>
            </div>
            
            {selectedPlace && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Location Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Type</Label>
                  <RadioGroup 
                    value={type} 
                    onValueChange={(value) => setType(value as "cafe" | "coworking")}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cafe" id="cafe" />
                      <Label htmlFor="cafe">Café</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="coworking" id="coworking" />
                      <Label htmlFor="coworking">Coworking Space</Label>
                    </div>
                  </RadioGroup>
                </div>
              </>
            )}
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={!selectedPlace || isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </span>
              ) : (
                "Add Location"
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddLocationDialog;
