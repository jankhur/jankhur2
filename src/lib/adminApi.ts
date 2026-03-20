import { supabase } from "@/integrations/supabase/client";

const PROJECT_ID = import.meta.env.VITE_SUPABASE_PROJECT_ID;

function getAdminPassword(): string {
  return sessionStorage.getItem("admin_password") || "";
}

export async function adminApi(body: Record<string, unknown>) {
  const url = `https://${PROJECT_ID}.supabase.co/functions/v1/admin`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-admin-password": getAdminPassword(),
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Admin API error");
  }
  return res.json();
}

export async function uploadImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  
  const { error } = await supabase.storage
    .from("images")
    .upload(path, file, { contentType: file.type });
  
  if (error) throw error;
  
  const { data } = supabase.storage.from("images").getPublicUrl(path);
  return data.publicUrl;
}

export function getAspectRatio(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve(img.width / img.height);
      URL.revokeObjectURL(img.src);
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}
