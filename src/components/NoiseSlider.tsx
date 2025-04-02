
import React from "react";
import { Slider } from "@/components/ui/slider";
import { VolumeX, Volume1, Volume2 } from "lucide-react";

interface NoiseSliderProps {
  value: number;
  onChange: (value: number) => void;
}

const NoiseSlider: React.FC<NoiseSliderProps> = ({ value, onChange }) => {
  const getIcon = () => {
    if (value < 3) {
      return <VolumeX className="h-5 w-5 text-noise-quiet" />;
    } else if (value < 7) {
      return <Volume1 className="h-5 w-5 text-noise-moderate" />;
    } else {
      return <Volume2 className="h-5 w-5 text-noise-noisy" />;
    }
  };

  const getLabel = () => {
    if (value < 3) {
      return "Quiet";
    } else if (value < 7) {
      return "Moderate";
    } else {
      return "Noisy";
    }
  };

  const getTrackColor = () => {
    if (value < 3) {
      return "bg-gradient-to-r from-noise-quiet to-noise-quiet";
    } else if (value < 7) {
      return "bg-gradient-to-r from-noise-quiet via-noise-moderate to-noise-moderate";
    } else {
      return "bg-gradient-to-r from-noise-quiet via-noise-moderate to-noise-noisy";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium flex items-center gap-1">
          {getIcon()} {getLabel()}
        </span>
        <span className="text-sm font-medium">{value}/10</span>
      </div>
      <Slider
        value={[value]}
        min={1}
        max={10}
        step={1}
        onValueChange={(vals) => onChange(vals[0])}
        className={getTrackColor()}
      />
      <div className="flex justify-between text-xs text-muted-foreground mt-1">
        <span>Library quiet</span>
        <span>Moderate chatter</span>
        <span>Very noisy</span>
      </div>
    </div>
  );
};

export default NoiseSlider;
