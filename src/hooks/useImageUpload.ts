import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useImageUpload = () => {
  const uploadImage = async (
    file: File,
    bucket: string = 'shop-items',
    customPath?: string
  ): Promise<string | null> => {
    try {
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Файл слишком большой. Максимум 5MB");
        return null;
      }

      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast.error("Неверный формат файла. Используйте JPG, PNG или WEBP");
        return null;
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = customPath || `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = fileName;

      // Upload file
      const { error: uploadError, data } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          upsert: true,
          contentType: file.type
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        toast.error("Ошибка загрузки файла");
        return null;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      toast.success("Изображение загружено");
      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error("Ошибка при загрузке изображения");
      return null;
    }
  };

  const deleteImage = async (url: string, bucket: string = 'shop-items'): Promise<boolean> => {
    try {
      // Extract path from URL
      const urlParts = url.split(`/storage/v1/object/public/${bucket}/`);
      if (urlParts.length < 2) {
        return false;
      }
      
      const filePath = urlParts[1];

      const { error } = await supabase.storage
        .from(bucket)
        .remove([filePath]);

      if (error) {
        console.error('Delete error:', error);
        return false;
      }

      toast.success("Изображение удалено");
      return true;
    } catch (error) {
      console.error('Error deleting image:', error);
      return false;
    }
  };

  const getPublicUrl = (bucket: string, path: string): string => {
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    
    return publicUrl;
  };

  return {
    uploadImage,
    deleteImage,
    getPublicUrl
  };
};
