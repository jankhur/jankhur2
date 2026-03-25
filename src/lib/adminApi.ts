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

function processImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      const MAX = 2400;
      if (width > MAX || height > MAX) {
        if (width >= height) {
          height = Math.round(height * (MAX / width));
          width = MAX;
        } else {
          width = Math.round(width * (MAX / height));
          height = MAX;
        }
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.imageSmoothingEnabled = true;
ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Canvas toBlob failed"));
        },
        "image/webp",
        0.92
      );
      URL.revokeObjectURL(img.src);
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

export async function uploadImage(file: File): Promise<string> {
  const blob = await processImage(file);
  const baseName = file.name.replace(/\.[^.]+$/, "");
  const safeName = baseName.replace(/\s+/g, "-").toLowerCase();
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}-${safeName}.webp`;

  const { error } = await supabase.storage
    .from("images")
    .upload(path, blob, { contentType: "image/webp" });

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
