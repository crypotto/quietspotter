
export interface Location {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  averageNoiseLevel: number;
  totalReports: number;
  imageUrl?: string;
  type: "cafe" | "coworking";
}

export interface NoiseReport {
  id: string;
  locationId: string;
  userId: string;
  noiseLevel: number;
  comment: string;
  timestamp: string;
  username: string;
}

export interface User {
  id: string;
  username: string;
  reports: number;
  createdAt: string;
}

export type NoiseLevel = "quiet" | "moderate" | "noisy";

export const getNoiseLevelFromNumber = (level: number): NoiseLevel => {
  if (level < 3) return "quiet";
  if (level < 7) return "moderate";
  return "noisy";
};

export const getNoiseLevelColor = (level: NoiseLevel): string => {
  switch (level) {
    case "quiet":
      return "noise-quiet";
    case "moderate":
      return "noise-moderate";
    case "noisy":
      return "noise-noisy";
    default:
      return "noise-moderate";
  }
};
