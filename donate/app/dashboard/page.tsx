/* eslint-disable react/no-children-prop */
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageOff } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Donation {
  id: number;
  title: string;
  category: string;
  amountRaised: number;
  goal: number;
  image: string;
  description: string;
  userId: string;
  createdAt: Date;
}

const ImageWithFallback = ({ title, imageUrl }: { title: string, imageUrl: string }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="w-full h-40 bg-gray-100 flex items-center justify-center rounded-t-lg">
        <div className="text-center">
          <ImageOff className="w-8 h-8 mx-auto text-gray-400" />
          <p className="text-sm text-gray-500 mt-2">Image not available</p>
        </div>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={title}
      className="w-full h-40 object-cover rounded-t-lg"
      onError={() => setHasError(true)}
    />
  );
};

export default function DashboardPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Calculate total amount raised
  const totalAmountRaised = donations.reduce((sum, donation) => sum + donation.amountRaised, 0);

  useEffect(() => {
    const fetchUserAndDonations = async () => {
      try {
        // Fetch current user
        const userResponse = await fetch('/api/auth/session');
        const userData = await userResponse.json();
        setCurrentUserId(userData?.user?.id || null);

        // Fetch donations
        const donationsResponse = await fetch("/api/donations");
        if (!donationsResponse.ok) {
          throw new Error("Failed to fetch donations");
        }
        const data = await donationsResponse.json();
        setDonations(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserAndDonations();
  }, [toast]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const filteredDonations = donations.filter((donation) => 
    donation.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === "all" || donation.category === selectedCategory)
  );

  const handleDonateClick = (donationId: number) => {
    window.location.href = `http://localhost:5173/?donationId=${donationId}`;
  };

  const handleEditClick = (donationId: number) => {
    window.location.href = `/dashboard/editdonation/${donationId}`;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center">Loading donations...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Donation Dashboard</h1>
          <Button onClick={() => window.location.href = '/dashboard/createdonation'}>
            Create New Donation
          </Button>
        </div>
        
        {/* Total Amount Raised Card */}
        <Card className="mb-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">Total Amount Raised</h2>
              <p className="text-4xl font-bold">${totalAmountRaised.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4 mb-6">
          <Input
            placeholder="Search donations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="healthcare">Healthcare</SelectItem>
              <SelectItem value="environment">Environment</SelectItem>
              <SelectItem value="community">Community</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDonations.map((donation) => (
          <Card key={donation.id} className="overflow-hidden">
            <ImageWithFallback title={donation.title} imageUrl={donation.image} />
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{donation.title}</CardTitle>
                <Badge>{donation.category}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{donation.description}</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Raised:</span>
                  <span className="font-semibold">${donation.amountRaised.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Goal:</span>
                  <span className="font-semibold">${donation.goal.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div
                    className="bg-indigo-600 dark:bg-indigo-500 h-2.5 rounded-full"
                    style={{ width: `${Math.min((donation.amountRaised / donation.goal) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between gap-2">
              {currentUserId && donation.userId === currentUserId && (
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => handleEditClick(donation.id)}
                >
                  Edit
                </Button>
              )}
              <Button 
                className={currentUserId && donation.userId === currentUserId ? "flex-1" : "w-full"}
                onClick={() => handleDonateClick(donation.id)}
              >
                Donate
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}