
import React, { useState } from "react";
import { Location, NoiseReport, getNoiseLevelFromNumber, getNoiseLevelColor } from "@/types";
import { useApp } from "@/context/AppContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Coffee, Briefcase, Volume1, Volume2, VolumeX, MapPin, X } from "lucide-react";
import NoiseSlider from "./NoiseSlider";
import { Textarea } from "@/components/ui/textarea";

interface LocationDetailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LocationDetail: React.FC<LocationDetailProps> = ({ open, onOpenChange }) => {
  const { selectedLocation, reports, addReport, currentUser } = useApp();
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [newNoiseLevel, setNewNoiseLevel] = useState(5);
  const [comment, setComment] = useState("");
  
  if (!selectedLocation) return null;
  
  const locationReports = reports.filter(
    (report) => report.locationId === selectedLocation.id
  ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  
  const noiseLevel = getNoiseLevelFromNumber(selectedLocation.averageNoiseLevel);
  const noiseColor = getNoiseLevelColor(noiseLevel);
  
  const handleSubmitReport = () => {
    addReport({
      locationId: selectedLocation.id,
      noiseLevel: newNoiseLevel,
      comment
    });
    
    setIsSubmittingReport(false);
    setNewNoiseLevel(5);
    setComment("");
  };
  
  const renderNoiseIcon = (level: number) => {
    if (level < 3) {
      return <VolumeX className="h-4 w-4" />;
    } else if (level < 7) {
      return <Volume1 className="h-4 w-4" />;
    } else {
      return <Volume2 className="h-4 w-4" />;
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                {selectedLocation.type === "cafe" ? (
                  <Coffee className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="text-sm text-muted-foreground capitalize">
                  {selectedLocation.type}
                </span>
              </div>
              <DialogTitle className="mt-1">{selectedLocation.name}</DialogTitle>
            </div>
            <Badge className={`bg-${noiseColor} ml-2`}>
              <span className="flex items-center gap-1">
                {renderNoiseIcon(selectedLocation.averageNoiseLevel)}
                {selectedLocation.averageNoiseLevel}/10
              </span>
            </Badge>
          </div>
        </DialogHeader>
        
        <div 
          className="h-48 bg-cover bg-center rounded-lg my-4" 
          style={{ 
            backgroundImage: selectedLocation.imageUrl 
              ? `url(${selectedLocation.imageUrl})` 
              : "url('https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80')" 
          }}
        />
        
        <div className="mb-4">
          <div className="flex items-center text-sm text-muted-foreground mb-2">
            <MapPin className="h-4 w-4 mr-1" />
            {selectedLocation.address}
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-sm">
              <span className="font-medium">{selectedLocation.totalReports}</span> 
              <span className="text-muted-foreground"> {selectedLocation.totalReports === 1 ? 'report' : 'reports'}</span>
            </div>
            
            {!isSubmittingReport ? (
              <Button 
                size="sm"
                onClick={() => setIsSubmittingReport(true)}
                disabled={!currentUser}
              >
                Add Report
              </Button>
            ) : (
              <Button 
                size="sm"
                variant="ghost"
                onClick={() => setIsSubmittingReport(false)}
              >
                <X className="h-4 w-4 mr-1" /> Cancel
              </Button>
            )}
          </div>
        </div>
        
        {isSubmittingReport && (
          <div className="space-y-4 mb-6 border rounded-lg p-4">
            <h3 className="font-medium">New Noise Report</h3>
            <NoiseSlider 
              value={newNoiseLevel} 
              onChange={setNewNoiseLevel} 
            />
            
            <Textarea
              placeholder="Add any comments about the noise level..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="resize-none"
              rows={3}
            />
            
            <Button 
              onClick={handleSubmitReport} 
              className="w-full"
            >
              Submit Report
            </Button>
          </div>
        )}
        
        <div className="space-y-3">
          <h3 className="font-medium">Recent Reports</h3>
          {locationReports.length > 0 ? (
            locationReports.map((report) => (
              <div key={report.id} className="border rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{report.username}</span>
                  <Badge variant="outline" className="text-xs">
                    <span className="flex items-center gap-1">
                      {renderNoiseIcon(report.noiseLevel)}
                      {report.noiseLevel}/10
                    </span>
                  </Badge>
                </div>
                <p className="text-sm">{report.comment}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(report.timestamp).toLocaleDateString()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No reports yet. Be the first to add one!</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LocationDetail;
