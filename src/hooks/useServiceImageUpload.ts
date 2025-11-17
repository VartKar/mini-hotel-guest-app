import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ImageMapping {
  name: string;
  path: string;
  type: "hotel" | "travel";
  title: string;
}

export const useServiceImageUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadAllImages = async () => {
    const images: ImageMapping[] = [
      { name: "flowers-delivery.webp", path: "/images/services/flowers-delivery.webp", type: "hotel", title: "Доставка цветов" },
      { name: "food-delivery.webp", path: "/images/services/food-delivery.webp", type: "hotel", title: "Доставка еды" },
      { name: "spa-services.webp", path: "/images/services/spa-services.webp", type: "hotel", title: "СПА услуги" },
      { name: "laundry.webp", path: "/images/services/laundry.webp", type: "hotel", title: "Прачечная" },
      { name: "late-checkout.webp", path: "/images/services/late-checkout.webp", type: "hotel", title: "Поздний выезд" },
      { name: "room-cleaning.webp", path: "/images/services/room-cleaning.webp", type: "hotel", title: "Уборка номера" },
      { name: "horse-riding.webp", path: "/images/services/horse-riding.webp", type: "travel", title: "Конная прогулка" },
      { name: "rafting.webp", path: "/images/services/rafting.webp", type: "travel", title: "Рафтинг" },
      { name: "wine-tasting.webp", path: "/images/services/wine-tasting.webp", type: "travel", title: "Дегустация вин" },
      { name: "cable-car.webp", path: "/images/services/cable-car.webp", type: "travel", title: "Канатная дорога" },
      { name: "dendrarium.webp", path: "/images/services/dendrarium.webp", type: "travel", title: "Дендрарий" },
    ];

    setIsUploading(true);
    setProgress(0);

    try {
      const results: { success: boolean; image: ImageMapping; url?: string; error?: string }[] = [];

      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        
        try {
          // Fetch the image from public folder
          const response = await fetch(image.path);
          if (!response.ok) {
            throw new Error(`Failed to fetch ${image.name}`);
          }

          const blob = await response.blob();
          const file = new File([blob], image.name, { type: 'image/webp' });

          // Upload to Supabase Storage
          const { error: uploadError, data } = await supabase.storage
            .from('service-images')
            .upload(image.name, file, {
              upsert: true,
              contentType: 'image/webp'
            });

          if (uploadError) {
            console.error(`Upload error for ${image.name}:`, uploadError);
            results.push({ success: false, image, error: uploadError.message });
            continue;
          }

          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('service-images')
            .getPublicUrl(image.name);

          // Update database
          if (image.type === "hotel") {
            const { error: updateError } = await supabase
              .from('hotel_services')
              .update({ image_url: publicUrl })
              .eq('title', image.title);

            if (updateError) {
              console.error(`DB update error for ${image.title}:`, updateError);
              results.push({ success: false, image, url: publicUrl, error: updateError.message });
              continue;
            }
          } else {
            const { error: updateError } = await supabase
              .from('travel_services')
              .update({ image_url: publicUrl })
              .eq('title', image.title);

            if (updateError) {
              console.error(`DB update error for ${image.title}:`, updateError);
              results.push({ success: false, image, url: publicUrl, error: updateError.message });
              continue;
            }
          }

          results.push({ success: true, image, url: publicUrl });
        } catch (error) {
          console.error(`Error processing ${image.name}:`, error);
          results.push({ 
            success: false, 
            image, 
            error: error instanceof Error ? error.message : 'Unknown error' 
          });
        }

        setProgress(Math.round(((i + 1) / images.length) * 100));
      }

      // Show results
      const successful = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;

      if (failed === 0) {
        toast.success(`Успешно загружено ${successful} изображений и обновлена база данных!`);
      } else {
        toast.warning(`Загружено ${successful} из ${images.length}. Ошибок: ${failed}`);
      }

      return results;
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error("Ошибка при загрузке изображений");
      return [];
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  return {
    uploadAllImages,
    isUploading,
    progress
  };
};
