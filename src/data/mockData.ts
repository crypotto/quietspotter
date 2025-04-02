
import { Location, NoiseReport, User } from "../types";

export const mockLocations: Location[] = [
  {
    id: "1",
    name: "Quiet Corner Cafe",
    address: "123 Main St, Anytown, USA",
    lat: 40.7128,
    lng: -74.006,
    averageNoiseLevel: 2,
    totalReports: 12,
    imageUrl: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80",
    type: "cafe"
  },
  {
    id: "2",
    name: "Focus Hub Coworking",
    address: "456 Oak Ave, Anytown, USA",
    lat: 40.7148,
    lng: -74.01,
    averageNoiseLevel: 4,
    totalReports: 8,
    imageUrl: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80",
    type: "coworking"
  },
  {
    id: "3",
    name: "Busy Beans",
    address: "789 Elm St, Anytown, USA",
    lat: 40.7118,
    lng: -74.003,
    averageNoiseLevel: 8,
    totalReports: 15,
    imageUrl: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80",
    type: "cafe"
  },
  {
    id: "4",
    name: "The Productive Space",
    address: "101 Pine Rd, Anytown, USA",
    lat: 40.7135,
    lng: -74.008,
    averageNoiseLevel: 3,
    totalReports: 10,
    imageUrl: "https://images.unsplash.com/photo-1572025442646-866d16c84a54?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80",
    type: "coworking"
  },
  {
    id: "5",
    name: "Espresso Express",
    address: "202 Maple Blvd, Anytown, USA",
    lat: 40.714,
    lng: -74.002,
    averageNoiseLevel: 6,
    totalReports: 7,
    imageUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80",
    type: "cafe"
  }
];

export const mockReports: NoiseReport[] = [
  {
    id: "1",
    locationId: "1",
    userId: "user1",
    noiseLevel: 2,
    comment: "Perfect for deep work. Almost library-quiet.",
    timestamp: "2023-09-10T14:30:00Z",
    username: "Alice"
  },
  {
    id: "2",
    locationId: "1",
    userId: "user2",
    noiseLevel: 3,
    comment: "Usually quiet but gets busier around lunch.",
    timestamp: "2023-09-08T10:15:00Z",
    username: "Bob"
  },
  {
    id: "3",
    locationId: "2",
    userId: "user1",
    noiseLevel: 4,
    comment: "Good working environment, occasional meetings nearby.",
    timestamp: "2023-09-09T16:45:00Z",
    username: "Alice"
  },
  {
    id: "4",
    locationId: "3",
    userId: "user3",
    noiseLevel: 8,
    comment: "Too loud for work. Popular spot for social gatherings.",
    timestamp: "2023-09-07T13:20:00Z",
    username: "Charlie"
  },
  {
    id: "5",
    locationId: "4",
    userId: "user2",
    noiseLevel: 3,
    comment: "Quiet most of the time, good for focus work.",
    timestamp: "2023-09-06T11:10:00Z",
    username: "Bob"
  }
];

export const mockUsers: User[] = [
  {
    id: "user1",
    username: "Alice",
    reports: 2,
    createdAt: "2023-08-15T00:00:00Z"
  },
  {
    id: "user2",
    username: "Bob",
    reports: 2,
    createdAt: "2023-08-20T00:00:00Z"
  },
  {
    id: "user3",
    username: "Charlie",
    reports: 1,
    createdAt: "2023-08-25T00:00:00Z"
  }
];
