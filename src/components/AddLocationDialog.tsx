
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";

interface AddLocationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddLocationDialog: React.FC<AddLocationDialogProps> = ({ open, onOpenChange }) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [type, setType] = useState<"cafe" | "coworking">("cafe");
  
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, we would send this data to the backend
    toast({
      title: "Feature coming soon",
      description: "Adding new locations will be available in the next update!",
    });
    
    setName("");
    setAddress("");
    setType("cafe");
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
          
          <Button type="submit" className="w-full" disabled={!name.trim() || !address.trim()}>
            Add Location
          </Button>
          
          <p className="text-xs text-muted-foreground text-center">
            Note: In this demo, new locations won't be saved.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddLocationDialog;
