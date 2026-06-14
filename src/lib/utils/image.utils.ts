import { API_BASE_URL } from "@/lib/constants/env";

const BACKEND_IMAGE_BASE_URL = `${API_BASE_URL}/images`;

export function getSafeImage(imageUrl?: string | null): string {
    if(!imageUrl || imageUrl.trim() === ""){
        return "/images/placeholder-food.jpg";
    }

    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  const cleanUrl = imageUrl.startsWith("/") ? imageUrl.slice(1) : imageUrl;
  
  return `${BACKEND_IMAGE_BASE_URL}/${cleanUrl}`;
}