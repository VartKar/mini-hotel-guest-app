import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useImageGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);

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

  return { generateImage, isGenerating };
};
