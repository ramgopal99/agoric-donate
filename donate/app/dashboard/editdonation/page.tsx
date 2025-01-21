"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function EditDonationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const donationId = searchParams.get('id');
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    goal: "",
    image: "",
  });

  useEffect(() => {
    const fetchDonation = async () => {
      if (!donationId) {
        router.push('/dashboard/createdonation');
        return;
      }

      try {
        const response = await fetch(`/api/donations/${donationId}`);
        if (!response.ok) throw new Error('Failed to fetch donation');
        const donation = await response.json();
        setFormData({
          title: donation.title,
          category: donation.category,
          description: donation.description,
          goal: donation.goal.toString(),
          image: donation.image,
        });
      } catch (error) {
        console.error('Error fetching donation:', error);
        router.push('/dashboard/createdonation');
      }
    };

    fetchDonation();
  }, [donationId, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!donationId) return;

    try {
      const response = await fetch(`/api/donations`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: donationId,
          ...formData,
          userId: session?.user?.id // Include user ID for verification
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        if (response.status === 403) {
          toast.error("Access Denied", {
            description: "You are not authorized to edit this donation"
          });
          router.push('/dashboard');
          return;
        }
        throw new Error(error.message || 'Failed to update donation');
      }

      toast.success("Success", {
        description: "Donation updated successfully"
      });
      router.push('/dashboard');
    } catch (error) {
      console.error('Error updating donation:', error);
      toast.error("Error", {
        description: "Failed to update donation"
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Edit Donation Campaign</h1>
      <Card>
        <CardHeader>
          <CardTitle>Campaign Details</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Campaign Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter campaign title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={handleSelectChange} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="medical">Medical</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="disaster">Disaster Relief</SelectItem>
                  <SelectItem value="animal">Animal Welfare</SelectItem>
                  <SelectItem value="environment">Environment</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your campaign"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="goal">Goal Amount ($)</Label>
              <Input
                id="goal"
                name="goal"
                type="number"
                value={formData.goal}
                onChange={handleInputChange}
                placeholder="Enter goal amount"
                required
                min="1"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                name="image"
                type="url"
                value={formData.image}
                onChange={handleInputChange}
                placeholder="Enter image URL"
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex gap-4 justify-end">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => router.push('/dashboard')}
            >
              Cancel
            </Button>
            <Button type="submit">Update Campaign</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
