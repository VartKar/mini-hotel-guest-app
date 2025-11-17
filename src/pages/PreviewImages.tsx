import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useServiceImageUpload } from "@/hooks/useServiceImageUpload";
import { Upload, ArrowLeft } from "lucide-react";

const images = [
  { name: "Доставка цветов", path: "/images/services/flowers-delivery.webp", type: "hotel" },
  { name: "Доставка еды", path: "/images/services/food-delivery.webp", type: "hotel" },
  { name: "СПА услуги", path: "/images/services/spa-services.webp", type: "hotel" },
  { name: "Прачечная", path: "/images/services/laundry.webp", type: "hotel" },
  { name: "Поздний выезд", path: "/images/services/late-checkout.webp", type: "hotel" },
  { name: "Уборка номера", path: "/images/services/room-cleaning.webp", type: "hotel" },
  { name: "Конная прогулка", path: "/images/services/horse-riding.webp", type: "travel" },
  { name: "Рафтинг", path: "/images/services/rafting.webp", type: "travel" },
  { name: "Дегустация вин", path: "/images/services/wine-tasting.webp", type: "travel" },
  { name: "Канатная дорога", path: "/images/services/cable-car.webp", type: "travel" },
  { name: "Дендрарий", path: "/images/services/dendrarium.webp", type: "travel" },
];

export default function PreviewImages() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { uploadAllImages, isUploading, progress } = useServiceImageUpload();

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Предпросмотр изображений сервисов</h1>
          <p className="text-muted-foreground mb-4">
            Нажмите на изображение для увеличения
          </p>
          
          <div className="flex gap-4 items-center">
            <Button 
              onClick={uploadAllImages} 
              disabled={isUploading}
              size="lg"
              className="gap-2"
            >
              <Upload className="h-5 w-5" />
              {isUploading ? "Загрузка..." : "Загрузить в Supabase Storage"}
            </Button>
            
            {isUploading && (
              <div className="flex-1 max-w-md">
                <Progress value={progress} className="h-2" />
                <p className="text-sm text-muted-foreground mt-1">{progress}%</p>
              </div>
            )}
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
              <CardContent>
                <img
                  src={image.path}
                  alt={image.name}
                  className="w-full h-48 object-cover rounded-md"
                  onClick={() => setSelectedImage(image.path)}
                />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Button size="lg" onClick={() => window.location.href = "/"} variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
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
