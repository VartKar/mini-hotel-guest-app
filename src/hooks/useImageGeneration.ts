import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useImageGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const generateImage = async (prompt: string, width: number = 1280, height: number = 720): Promise<string | null> => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-service-image', {
        body: { prompt, width, height }
      });

      if (error) {
        console.error('Error generating image:', error);
        if (error.message?.includes('429')) {
          toast.error("Превышен лимит запросов. Попробуйте позже.");
        } else if (error.message?.includes('402')) {
          toast.error("Требуется пополнение. Добавьте кредиты в workspace.");
        } else {
          toast.error("Ошибка генерации изображения");
        }
        return null;
      }

      if (!data?.imageUrl) {
        toast.error("Изображение не было создано");
        return null;
      }

      toast.success("Изображение успешно сгенерировано!");
      return data.imageUrl;
    } catch (error) {
      console.error('Error:', error);
      toast.error("Ошибка генерации изображения");
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const saveGeneratedImage = async (
    base64Url: string, 
    fileName: string,
    serviceTitle: string,
    serviceType: "hotel" | "travel"
  ): Promise<boolean> => {
    setIsSaving(true);
    try {
      // Convert base64 to blob
      const response = await fetch(base64Url);
      const blob = await response.blob();
      const file = new File([blob], fileName, { type: 'image/webp' });

      // Upload to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('service-images')
        .upload(fileName, file, {
          upsert: true,
          contentType: 'image/webp'
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        toast.error("Ошибка загрузки изображения в Storage");
        return false;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('service-images')
        .getPublicUrl(fileName);

      // Update database
      const tableName = serviceType === "hotel" ? 'hotel_services' : 'travel_services';
      const { error: updateError } = await supabase
        .from(tableName)
        .update({ image_url: publicUrl })
        .eq('title', serviceTitle);

      if (updateError) {
        console.error('DB update error:', updateError);
        toast.error("Ошибка обновления базы данных");
        return false;
      }

      toast.success("Изображение сохранено и база данных обновлена!");
      return true;
    } catch (error) {
      console.error('Error saving image:', error);
      toast.error("Ошибка сохранения изображения");
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return { generateImage, saveGeneratedImage, isGenerating, isSaving };
};
