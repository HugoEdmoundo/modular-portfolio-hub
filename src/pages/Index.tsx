import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/portfolio/Navbar";
import HeroSection from "@/components/portfolio/HeroSection";
import AboutSection from "@/components/portfolio/AboutSection";
import ProjectsSection from "@/components/portfolio/ProjectsSection";
import GitHubSection from "@/components/portfolio/GitHubSection";
import SkillsSection from "@/components/portfolio/SkillsSection";
import GallerySection from "@/components/portfolio/GallerySection";
import TasksSection from "@/components/portfolio/TasksSection";
import ResumeSection from "@/components/portfolio/ResumeSection";
import {
  fetchSiteConfig,
  fetchFeaturedProjects,
  fetchSkills,
  fetchGallery,
  fetchTasks,
  fetchEducation,
  fetchExperience,
} from "@/lib/api";

const Index = () => {
  const { data: config } = useQuery({ queryKey: ["site-config"], queryFn: fetchSiteConfig });

  // Dynamic favicon and tab title from site config
  useEffect(() => {
    if (config?.hero_name) {
      document.title = config.hero_name;
    }
    if (config?.favicon_url) {
      let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      link.href = config.favicon_url;
    }
  }, [config?.hero_name, config?.favicon_url]);
  const { data: projects } = useQuery({ queryKey: ["featured-projects"], queryFn: fetchFeaturedProjects });
  const { data: skills } = useQuery({ queryKey: ["skills"], queryFn: fetchSkills });
  const { data: gallery } = useQuery({ queryKey: ["gallery"], queryFn: fetchGallery });
  const { data: tasks } = useQuery({ queryKey: ["tasks"], queryFn: fetchTasks });
  const { data: education } = useQuery({ queryKey: ["education"], queryFn: fetchEducation });
  const { data: experience } = useQuery({ queryKey: ["experience"], queryFn: fetchExperience });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection config={config ?? null} />
      <AboutSection config={config ?? null} />
      <ProjectsSection projects={projects ?? []} />
      <GitHubSection username={config?.github_username ?? undefined} />
      <SkillsSection skills={skills ?? []} />
      <GallerySection items={gallery ?? []} />
      <TasksSection tasks={tasks ?? []} />
      <ResumeSection education={education ?? []} experience={experience ?? []} />
      
      {/* Footer */}
      <footer className="section-padding border-t border-border/30">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {config?.site_name ?? "Portfolio"}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
