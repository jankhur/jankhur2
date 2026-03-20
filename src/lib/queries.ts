import { supabase } from "@/integrations/supabase/client";

export async function fetchLandingImages() {
  const { data, error } = await supabase
    .from("landing_images")
    .select("*")
    .eq("published", true)
    .order("sort_order");
  if (error) throw error;
  return data;
}

export async function fetchEditorialProjects() {
  const { data, error } = await supabase
    .from("editorial_projects")
    .select("*")
    .eq("published", true)
    .order("sort_order");
  if (error) throw error;
  return data;
}

export async function fetchEditorialImages(projectSlug: string) {
  const { data, error } = await supabase
    .from("editorial_images")
    .select("*")
    .eq("project_slug", projectSlug)
    .order("sort_order");
  if (error) throw error;
  return data;
}

export async function fetchJourneyProjects() {
  const { data, error } = await supabase
    .from("journey_projects")
    .select("*")
    .eq("published", true)
    .order("sort_order");
  if (error) throw error;
  return data;
}

export async function fetchJourneyImages(projectSlug: string) {
  const { data, error } = await supabase
    .from("journey_images")
    .select("*")
    .eq("project_slug", projectSlug)
    .order("sort_order");
  if (error) throw error;
  return data;
}

export async function fetchNotesImages() {
  const { data, error } = await supabase
    .from("notes_images")
    .select("*")
    .order("year")
    .order("sort_order");
  if (error) throw error;
  return data;
}
