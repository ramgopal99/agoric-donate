'use client';

import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

const personalInfoSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  bio: z.string().max(160).min(4, { message: "Bio must be between 4 and 160 characters." }),
  avatar: z.string().url().optional(),
});

type PersonalInfoValues = z.infer<typeof personalInfoSchema>;

export function PersonalInfo({ onProfileCreated }: { onProfileCreated: () => void }) {
  const { toast } = useToast();
  const { data: session } = useSession();
  const [isEdited, setIsEdited] = useState(false);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false); // Ensure one-time fetch

  const form = useForm<PersonalInfoValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      fullName: "",
      email: "",
      bio: "",
      avatar: "",
    },
  });

  // Fetch profile information only if not already fetched and user is authenticated
  useEffect(() => {
    if (!session?.user?.id || hasFetched) return;

    const fetchProfileInfo = async () => {
      try {
        // Check if the profile exists for the user
        const response = await fetch(`/api/profile/checkProfile`);
        const data = await response.json();

        if (response.ok && data.profileId) {
          setProfileId(data.profileId);

          // Fetch profile details
          const infoResponse = await fetch(`/api/profile/getProfileInfo?profileId=${data.profileId}`);
          const infoData = await infoResponse.json();

          if (infoResponse.ok && infoData.profile) {
            form.setValue("fullName", infoData.profile.fullName || "");
            form.setValue("email", infoData.profile.email || "");
            form.setValue("bio", infoData.profile.bio || "");
            form.setValue("avatar", infoData.profile.avatar || "");
          }
        }
        setHasFetched(true); // Mark fetch as completed
      } catch (error) {
        console.error("Error fetching profile information:", error);
      }
    };

    fetchProfileInfo();
  }, [session, hasFetched, form]);

  const handleSubmit = async (data: PersonalInfoValues) => {
    try {
      const response = await fetch("/api/profile/savePersonalInfo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          userId: session?.user?.id,
          profileId: profileId || undefined,
        }),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.error || "Failed to save profile information.");

      if (!profileId && result.profileId) {
        setProfileId(result.profileId); // Save the newly created profileId
        onProfileCreated(); // Notify parent to re-fetch profile status
      }

      toast({
        variant: "default",
        title: "Profile Updated",
        description: "Your personal information has been saved successfully.",
      });

      setIsEdited(false);
    } catch (error) {
      console.error("Error saving personal information:", error);
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: "Failed to save your personal information. Please try again.",
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-8"
        onChange={() => setIsEdited(true)}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="avatar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/avatar.jpg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about yourself"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        <Button type="submit" disabled={!isEdited}>
          {isEdited ? "Save Changes" : "Up to Date"}
        </Button>
      </form>
    </Form>
  );
}
