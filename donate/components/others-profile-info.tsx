'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const skillLevels = ["Beginner", "Intermediate", "Advanced", "Expert"] as const;

const socialPlatforms = [
  { name: "LinkedIn", icon: "🔗" },
  { name: "Twitter", icon: "🐦" },
  { name: "Facebook", icon: "📘" },
  { name: "Instagram", icon: "📸" },
];

const skillSchema = z.object({
  name: z.string().min(1, "Skill name is required"),
  level: z.enum(skillLevels),
});

const projectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().min(1, "Project description is required"),
  link: z.string().url("Invalid URL").optional(),
});

const socialLinkSchema = z.object({
  platform: z.string().min(1, "Platform is required"),
  url: z.string().url("Invalid URL"),
});

const profileSchema = z.object({
  skills: z.array(skillSchema).min(1, { message: "At least one skill is required." }),
  projects: z.array(projectSchema),
  socialLinks: z.array(socialLinkSchema),
});

type ProfileValues = z.infer<typeof profileSchema>;

export function OthersProfileInfo() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [profileId, setProfileId] = useState<string | null>(null);
  const [isEdited, setIsEdited] = useState(false);

  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      skills: [],
      projects: [],
      socialLinks: [],
    },
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch(`/api/profile/getOthersData?userId=${session.user.id}`);
          const data = await response.json();

          if (response.ok && data.profileId) {
            setProfileId(data.profileId);
            form.reset(data);
          } else {
            console.log("Profile data not found:", data);
          }
        } catch (error) {
          console.error("Error fetching profile data:", error);
        }
      }
    };

    fetchProfileData();
  }, [session, form]);

  const handleSubmit = async (data: ProfileValues) => {
    if (!profileId) {
      toast({
        variant: "destructive",
        title: "Profile ID Missing",
        description: "Please provide a valid profile ID.",
        duration: 2000,
      });
      return;
    }

    try {
      const response = await fetch("/api/profile/saveOthersData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, profileId }),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.error || "Failed to save profile data.");

      toast({
        title: "Success",
        description: "Profile data updated successfully.",
        duration: 2000,
      });

      setIsEdited(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "An error occurred while saving profile data.",
        duration: 2000,
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit, (errors) => {
          toast({
            variant: "destructive",
            title: "Validation Error",
            description: "Please fix the highlighted errors and try again.",
            duration: 3000,
          });
          console.error("Validation errors:", errors);
        })}
        className="space-y-8"
        onChange={() => setIsEdited(true)}
      >
        {/* Skills Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Skills</CardTitle>
            <CardDescription>Add or update your professional skills</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {form.watch("skills").map((skill, index) => (
              <div key={index} className="space-y-2">
                <Input
                  placeholder="Skill name"
                  {...form.register(`skills.${index}.name`)}
                  onChange={(e) => {
                    form.setValue(`skills.${index}.name`, e.target.value);
                    setIsEdited(true);
                  }}
                />
                {form.formState.errors.skills?.[index]?.name && (
                  <p className="text-red-500">
                    {form.formState.errors.skills[index].name?.message}
                  </p>
                )}
                <Select
                  onValueChange={(value) => {
                    form.setValue(`skills.${index}.level`, value as any);
                    setIsEdited(true);
                  }}
                  defaultValue={skill.level}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {skillLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    const skills = form.getValues("skills");
                    skills.splice(index, 1);
                    form.setValue("skills", skills);
                    setIsEdited(true);
                  }}
                >
                  Remove Skill
                </Button>
              </div>
            ))}
            <Button
              type="button"
              onClick={() => {
                const skills = form.getValues("skills");
                skills.push({ name: "", level: "Beginner" });
                form.setValue("skills", skills);
                setIsEdited(true);
              }}
            >
              Add Skill
            </Button>
          </CardContent>
        </Card>

        {/* Projects Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Projects</CardTitle>
            <CardDescription>Add your notable projects</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {form.watch("projects").map((project, index) => (
              <div key={index} className="space-y-2">
                <Input
                  placeholder="Project name"
                  {...form.register(`projects.${index}.name`)}
                  onChange={(e) => {
                    form.setValue(`projects.${index}.name`, e.target.value);
                    setIsEdited(true);
                  }}
                />
                {form.formState.errors.projects?.[index]?.name && (
                  <p className="text-red-500">
                    {form.formState.errors.projects[index].name?.message}
                  </p>
                )}
                <Textarea
                  placeholder="Project description"
                  {...form.register(`projects.${index}.description`)}
                  onChange={(e) => {
                    form.setValue(`projects.${index}.description`, e.target.value);
                    setIsEdited(true);
                  }}
                />
                {form.formState.errors.projects?.[index]?.description && (
                  <p className="text-red-500">
                    {form.formState.errors.projects[index].description?.message}
                  </p>
                )}
                <Input
                  placeholder="Project link (optional)"
                  {...form.register(`projects.${index}.link`)}
                  onChange={(e) => {
                    form.setValue(`projects.${index}.link`, e.target.value);
                    setIsEdited(true);
                  }}
                />
                {form.formState.errors.projects?.[index]?.link && (
                  <p className="text-red-500">
                    {form.formState.errors.projects[index].link?.message}
                  </p>
                )}
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    const projects = form.getValues("projects");
                    projects.splice(index, 1);
                    form.setValue("projects", projects);
                    setIsEdited(true);
                  }}
                >
                  Remove Project
                </Button>
              </div>
            ))}
            <Button
              type="button"
              onClick={() => {
                const projects = form.getValues("projects");
                projects.push({ name: "", description: "", link: "" });
                form.setValue("projects", projects);
                setIsEdited(true);
              }}
            >
              Add Project
            </Button>
          </CardContent>
        </Card>


        {/* Social Links Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Social Links</CardTitle>
            <CardDescription>Add links to your social profiles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {form.watch("socialLinks").map((link, index) => (
              <div key={index} className="space-y-2">
                <Select
                  onValueChange={(value) => {
                    form.setValue(`socialLinks.${index}.platform`, value);
                    setIsEdited(true);
                  }}
                  defaultValue={link.platform}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {socialPlatforms.map((platform) => (
                      <SelectItem key={platform.name} value={platform.name}>
                        {platform.icon} {platform.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.socialLinks?.[index]?.platform && (
                  <p className="text-red-500">
                    {form.formState.errors.socialLinks[index].platform?.message}
                  </p>
                )}
                <Input
                  placeholder="URL"
                  {...form.register(`socialLinks.${index}.url`)}
                  onChange={(e) => {
                    form.setValue(`socialLinks.${index}.url`, e.target.value);
                    setIsEdited(true);
                  }}
                />
                {form.formState.errors.socialLinks?.[index]?.url && (
                  <p className="text-red-500">
                    {form.formState.errors.socialLinks[index].url?.message}
                  </p>
                )}
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    const links = form.getValues("socialLinks");
                    links.splice(index, 1);
                    form.setValue("socialLinks", links);
                    setIsEdited(true);
                  }}
                >
                  Remove Social Link
                </Button>
              </div>
            ))}
            <Button
              type="button"
              onClick={() => {
                const links = form.getValues("socialLinks");
                links.push({ platform: "", url: "" });
                form.setValue("socialLinks", links);
                setIsEdited(true);
              }}
            >
              Add Social Link
            </Button>
          </CardContent>
        </Card>


        <Button type="submit" disabled={!isEdited}>
          {isEdited ? "Save Changes" : "Up to Date"}
        </Button>
      </form>
    </Form>
  );
}
