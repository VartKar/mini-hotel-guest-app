import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";

const images = [
  { name: "Доставка цветов", path: "/images/services/flowers-delivery.webp", type: "hotel" },
  { name: "Доставка еды", path: "/images/services/food-delivery.webp", type: "hotel" },
  { name: "СПА услуги", path: "/images/services/spa-services.webp", type: "hotel" },
  { name: "Прачечная", path: "/images/services/laundry.webp", type: "hotel" },
  { name: "Поздний выезд", path: "/images/services/late-checkout.webp", type: "hotel" },
  { name: "Уборка номера", path: "/images/services/room-cleaning.webp", type: "hotel" },
  { name: "Ранний заезд", path: "/images/services/early-checkin.webp", type: "hotel" },
  { name: "Конная прогулка", path: "/images/services/horse-riding.webp", type: "travel" },
  { name: "Рафтинг", path: "/images/services/rafting.webp", type: "travel" },
  { name: "Дегустация вин", path: "/images/services/wine-tasting.webp", type: "travel" },
  { name: "Канатная дорога", path: "/images/services/cable-car.webp", type: "travel" },
  { name: "Дендрарий", path: "/images/services/dendrarium.webp", type: "travel" },
];

export default function PreviewImages() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const downloadImage = async (imagePath: string, imageName: string) => {
    try {
      const response = await fetch(imagePath);
      const blob = await response.blob();
      
      // Проверяем поддержку File System Access API
      if ('showSaveFilePicker' in window) {
        try {
          const handle = await (window as any).showSaveFilePicker({
            suggestedName: `${imageName}.webp`,
            types: [{
              description: 'WebP Images',
              accept: { 'image/webp': ['.webp'] }
            }]
          });
          const writable = await handle.createWritable();
          await writable.write(blob);
          await writable.close();
          toast.success(`Изображение "${imageName}" скачано`);
        } catch (err: any) {
          if (err.name === 'AbortError') {
            toast.info('Скачивание отменено');
          } else {
            throw err;
          }
        }
      } else {
        // Fallback для старых браузеров
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${imageName}.webp`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        toast.success(`Изображение "${imageName}" скачано в папку загрузок`);
      }
    } catch (error) {
      toast.error(`Ошибка при скачивании "${imageName}"`);
      console.error(error);
    }
  };

  const downloadAllImages = async () => {
    try {
      // Проверяем поддержку File System Access API для выбора директории
      if ('showDirectoryPicker' in window) {
        const dirHandle = await (window as any).showDirectoryPicker();
        toast.info(`Начинаем скачивание ${images.length} изображений...`);
        
        for (const image of images) {
          try {
            const response = await fetch(image.path);
            const blob = await response.blob();
            const fileHandle = await dirHandle.getFileHandle(`${image.name}.webp`, { create: true });
            const writable = await fileHandle.createWritable();
            await writable.write(blob);
            await writable.close();
            await new Promise(resolve => setTimeout(resolve, 300));
          } catch (error) {
            console.error(`Ошибка при скачивании ${image.name}:`, error);
          }
        }
        toast.success("Все изображения скачаны!");
      } else {
        // Fallback - скачиваем по одному в папку загрузок
        toast.info(`Начинаем скачивание ${images.length} изображений в папку загрузок...`);
        for (const image of images) {
          await downloadImage(image.path, image.name);
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        toast.success("Все изображения скачаны в папку загрузок!");
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        toast.info('Скачивание отменено');
      } else {
        toast.error('Ошибка при скачивании изображений');
        console.error(error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Предпросмотр изображений сервисов</h1>
              <p className="text-muted-foreground">
                Нажмите на изображение для увеличения
              </p>
            </div>
            <Button size="lg" onClick={downloadAllImages}>
              <Download className="mr-2 h-4 w-4" />
              Скачать все
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg">{image.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {image.type === "hotel" ? "Отель" : "Туризм"}
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                <img
                  src={image.path}
                  alt={image.name}
                  className="w-full h-48 object-cover rounded-md cursor-pointer"
                  onClick={() => setSelectedImage(image.path)}
                />
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => downloadImage(image.path, image.name)}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Скачать
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Button size="lg" onClick={() => window.location.href = "/"}>
            Вернуться на главную
          </Button>
        </div>
      </div>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl">
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Preview"
              className="w-full h-auto"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
