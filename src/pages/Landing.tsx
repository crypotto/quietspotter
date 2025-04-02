
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
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Header */}
      <header className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <VolumeX className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-semibold">QuietSpotter</h1>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <section className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Find Your Perfect <span className="text-primary">Quiet</span> Space
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Discover and share noise-free locations for working, studying, or relaxing.
          Join our community of quiet-seekers today.
        </p>
      </section>

      {/* Preview cards */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Map View Preview */}
          <Card className="overflow-hidden border-2 hover:border-primary transition-all duration-300 hover:shadow-lg">
            <CardHeader className="bg-primary/5">
              <CardTitle className="flex items-center gap-2">
                <Map className="h-5 w-5" />
                Map View
              </CardTitle>
              <CardDescription>
                Explore quiet locations visually on our interactive map
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative aspect-video bg-gradient-to-br from-blue-50 to-sky-100 flex items-center justify-center">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1')] bg-cover bg-center opacity-50" />
                <div className="absolute inset-0 flex flex-col items-center justify-center backdrop-blur-[1px]">
                  <Map className="h-12 w-12 text-primary mb-2" />
                  <p className="text-sm">Interactive noise level map</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-end p-4">
              <Link to="/app/map">
                <Button>
                  Open Map View
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* List View Preview */}
          <Card className="overflow-hidden border-2 hover:border-primary transition-all duration-300 hover:shadow-lg">
            <CardHeader className="bg-primary/5">
              <CardTitle className="flex items-center gap-2">
                <List className="h-5 w-5" />
                List View
              </CardTitle>
              <CardDescription>
                Browse and filter locations sorted by noise level
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative aspect-video bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1')] bg-cover bg-center opacity-50" />
                <div className="absolute inset-0 flex flex-col items-center justify-center backdrop-blur-[1px]">
                  <List className="h-12 w-12 text-primary mb-2" />
                  <p className="text-sm">Organized location listings</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-end p-4">
              <Link to="/app/list">
                <Button>
                  Open List View
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-12 border-t text-center text-muted-foreground">
        <p>QuietSpotter — Find your peaceful place</p>
      </footer>
    </div>
  );
};

export default Landing;
