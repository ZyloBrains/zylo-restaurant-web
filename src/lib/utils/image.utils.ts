const BACKEND_IMAGE_BASE_URL=process.env.NEXT_PUBLIC_API_URL
? `${process.env.NEXT_PUBLIC_API_URL}/images`
: 'http://localhost:8082/api/v1/images';

export function getSafeImage(imageUrl?:string|null):string{
    if(!imageUrl || imageUrl.trim() === ""){
        return "/images/placeholder-food.jpg";
    }

    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  const cleanUrl = imageUrl.startsWith("/") ? imageUrl.slice(1) : imageUrl;
  
  return `${BACKEND_IMAGE_BASE_URL}/${cleanUrl}`;
}