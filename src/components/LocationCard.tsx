
import React from "react";
import { Location, getNoiseLevelFromNumber, getNoiseLevelColor } from "@/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Coffee, Briefcase, Volume1, Volume2, VolumeX } from "lucide-react";

interface LocationCardProps {
  location: Location;
  onClick: (location: Location) => void;
}

const LocationCard: React.FC<LocationCardProps> = ({ location, onClick }) => {
  const noiseLevel = getNoiseLevelFromNumber(location.averageNoiseLevel);
  const noiseColor = getNoiseLevelColor(noiseLevel);
  
  const renderNoiseIcon = () => {
    if (location.averageNoiseLevel < 3) {
      return <VolumeX className="h-4 w-4" />;
    } else if (location.averageNoiseLevel < 7) {
      return <Volume1 className="h-4 w-4" />;
    } else {
      return <Volume2 className="h-4 w-4" />;
    }
  };

  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onClick(location)}
    >
      <div 
        className="h-32 bg-cover bg-center rounded-t-lg" 
        style={{ 
          backgroundImage: location.imageUrl 
            ? `url(${location.imageUrl})` 
            : "url('https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80')" 
        }}
      />
      
      <CardHeader className="py-3">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-1.5">
              {location.type === "cafe" ? (
                <Coffee className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="text-sm text-muted-foreground capitalize">
                {location.type}
              </span>
            </div>
            <h3 className="font-medium mt-1">{location.name}</h3>
          </div>
          <Badge className={`bg-${noiseColor}`}>
            <span className="flex items-center gap-1">
              {renderNoiseIcon()}
              {noiseLevel}
            </span>
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="py-0">
        <p className="text-sm text-muted-foreground truncate">{location.address}</p>
      </CardContent>
      
      <CardFooter className="py-3">
        <p className="text-xs text-muted-foreground">
          {location.totalReports} {location.totalReports === 1 ? 'report' : 'reports'}
        </p>
      </CardFooter>
    </Card>
  );
};

export default LocationCard;
