import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Предпросмотр изображений сервисов</h1>
          <p className="text-muted-foreground">
            Нажмите на изображение для увеличения
          </p>
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
