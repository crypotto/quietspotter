
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { useApp } from "@/context/AppContext";

interface AddLocationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddLocationDialog: React.FC<AddLocationDialogProps> = ({ open, onOpenChange }) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [type, setType] = useState<"cafe" | "coworking">("cafe");
  const [lat, setLat] = useState<number | string>("");
  const [lng, setLng] = useState<number | string>("");
  
  const { toast } = useToast();
  const { addLocation } = useApp();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate coordinates
    const latNum = Number(lat);
    const lngNum = Number(lng);
    
    if (isNaN(latNum) || isNaN(lngNum)) {
      toast({
        title: "Invalid coordinates",
        description: "Please enter valid latitude and longitude values.",
        variant: "destructive",
      });
      return;
    }

    // Add the new location
    addLocation({
      name: name.trim(),
      address: address.trim(),
      lat: latNum,
      lng: lngNum,
      type: type,
    });
    
    // Reset the form
    setName("");
    setAddress("");
    setType("cafe");
    setLat("");
    setLng("");
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
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Location Name</Label>
            <Input
              id="name"
              placeholder="Coffee House, Coworking Hub, etc."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              placeholder="123 Main St, City, Country"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                placeholder="e.g. 51.5074"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                placeholder="e.g. -0.1278"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                required
              />
            </div>
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
          
          <Button type="submit" className="w-full" disabled={!name.trim() || !address.trim() || !lat || !lng}>
            Add Location
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddLocationDialog;
