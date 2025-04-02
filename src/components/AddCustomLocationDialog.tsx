
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { useApp } from "@/context/AppContext";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert-dialog";

interface AddCustomLocationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  position: { lat: number; lng: number } | null;
}

const AddCustomLocationDialog: React.FC<AddCustomLocationDialogProps> = ({ 
  open, 
  onOpenChange, 
  position 
}) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [type, setType] = useState<"cafe" | "coworking">("cafe");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPositionWarning, setShowPositionWarning] = useState(false);
  
  const { toast } = useToast();
  const { addLocation } = useApp();

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      setName("");
      setAddress("");
      setType("cafe");
      setShowPositionWarning(!position || position.lat === 40.7128); // Show warning if using default position
    }
  }, [open, position]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!position) {
      toast({
        title: "Invalid location",
        description: "No location coordinates provided",
        variant: "destructive",
      });
      return;
    }

    if (!name.trim() || !address.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both a name and address for the location",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Add the new location
    addLocation({
      name: name.trim(),
      address: address.trim(),
      lat: position.lat,
      lng: position.lng,
      type: type,
    });
    
    // Reset the form
    setName("");
    setAddress("");
    setType("cafe");
    setIsSubmitting(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Custom Location</DialogTitle>
          <DialogDescription>
            Enter details for a location at the selected coordinates.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {position && (
            <div className="p-2 bg-muted/50 rounded text-sm">
              <p>Selected coordinates:</p>
              <p className="font-mono">Latitude: {position.lat.toFixed(6)}</p>
              <p className="font-mono">Longitude: {position.lng.toFixed(6)}</p>
            </div>
          )}
          
          {showPositionWarning && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Using default coordinates. For more accuracy, add a location from the map view by clicking on a specific point.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="name">Location Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter a name for this location"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter the address"
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
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={!position || isSubmitting}
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
      </DialogContent>
    </Dialog>
  );
};

export default AddCustomLocationDialog;
