
import React from "react";
import { Link } from "react-router-dom";
import { Map, List, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { VolumeX } from "lucide-react";

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1A1F2C] to-[#403E43] text-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <VolumeX className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-semibold text-white">QuietSpotter</h1>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <section className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Find Your Perfect <span className="text-primary">Quiet</span> Space
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8">
          Discover and share noise-free locations for working, studying, or relaxing.
          Join our community of quiet-seekers today.
        </p>
      </section>

      {/* Preview cards */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Map View Preview */}
          <Card className="overflow-hidden border-2 border-[#2A2E3A] bg-[#222831] hover:border-primary transition-all duration-300 hover:shadow-xl">
            <CardHeader className="bg-[#2A2E3A]/50">
              <CardTitle className="flex items-center gap-2 text-white">
                <Map className="h-5 w-5 text-primary" />
                Map View
              </CardTitle>
              <CardDescription className="text-gray-400">
                Explore quiet locations visually on our interactive map
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative aspect-video bg-[#2A2E3A] flex items-center justify-center">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1')] bg-cover bg-center opacity-30" />
                <div className="absolute inset-0 flex flex-col items-center justify-center backdrop-blur-[1px]">
                  <Map className="h-12 w-12 text-primary mb-2" />
                  <p className="text-sm text-white">Interactive noise level map</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-end p-4">
              <Link to="/app/map">
                <Button variant="outline" className="bg-[#2A2E3A] text-white hover:bg-[#3A3F4A]">
                  Open Map View
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* List View Preview */}
          <Card className="overflow-hidden border-2 border-[#2A2E3A] bg-[#222831] hover:border-primary transition-all duration-300 hover:shadow-xl">
            <CardHeader className="bg-[#2A2E3A]/50">
              <CardTitle className="flex items-center gap-2 text-white">
                <List className="h-5 w-5 text-primary" />
                List View
              </CardTitle>
              <CardDescription className="text-gray-400">
                Browse and filter locations sorted by noise level
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative aspect-video bg-[#2A2E3A] flex items-center justify-center">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1')] bg-cover bg-center opacity-30" />
                <div className="absolute inset-0 flex flex-col items-center justify-center backdrop-blur-[1px]">
                  <List className="h-12 w-12 text-primary mb-2" />
                  <p className="text-sm text-white">Organized location listings</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-end p-4">
              <Link to="/app/list">
                <Button variant="outline" className="bg-[#2A2E3A] text-white hover:bg-[#3A3F4A]">
                  Open List View
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-12 border-t border-[#2A2E3A] text-center text-gray-400">
        <p>QuietSpotter — Find your peaceful place</p>
      </footer>
    </div>
  );
};

export default Landing;
