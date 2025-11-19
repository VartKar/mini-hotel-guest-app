import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useServiceImageUpload } from "@/hooks/useServiceImageUpload";
import { useImageGeneration } from "@/hooks/useImageGeneration";
import { Upload, ArrowLeft, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

  const images = [
    { name: "Доставка цветов", fileName: "flowers-delivery.webp", path: "/images/services/flowers-delivery.webp", type: "hotel" as const, title: "Цветы в номер" },
    { name: "Доставка еды", fileName: "food-delivery.webp", path: "/images/services/food-delivery.webp", type: "hotel" as const, title: "Еда в номер" },
    { name: "СПА услуги", fileName: "spa-services.webp", path: "/images/services/spa-services.webp", type: "hotel" as const, title: "Спа-услуги" },
    { name: "Прачечная", fileName: "laundry.webp", path: "/images/services/laundry.webp", type: "hotel" as const, title: "Услуги прачечной" },
    { name: "Поздний выезд", fileName: "late-checkout.webp", path: "/images/services/late-checkout.webp", type: "hotel" as const, title: "Поздний выезд" },
    { name: "Уборка номера", fileName: "room-cleaning.webp", path: "/images/services/room-cleaning.webp", type: "hotel" as const, title: "Уборка номера" },
    { name: "Конная прогулка", fileName: "horse-riding.webp", path: "/images/services/horse-riding.webp", type: "travel" as const, title: "Конная прогулка" },
    { name: "Рафтинг", fileName: "rafting.webp", path: "/images/services/rafting.webp", type: "travel" as const, title: "Рафтинг по реке Мзымта" },
    { name: "Дегустация вин", fileName: "wine-tasting.webp", path: "/images/services/wine-tasting.webp", type: "travel" as const, title: "Дегустация вин" },
    { name: "Канатная дорога", fileName: "cable-car.webp", path: "/images/services/cable-car.webp", type: "travel" as const, title: "Канатная дорога на Ахун" },
    { name: "Дендрарий", fileName: "dendrarium.webp", path: "/images/services/dendrarium.webp", type: "travel" as const, title: "Экскурсия по Дендрарию" },
  ];

type ServiceImage = {
  id: string;
  name: string;
  fileName: string;
  path: string;
  type: "hotel" | "travel";
  title: string;
  image_url: string | null;
};

export default function PreviewImages() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [width, setWidth] = useState(1280);
  const [height, setHeight] = useState(720);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [selectedServiceForGeneration, setSelectedServiceForGeneration] = useState<ServiceImage | null>(null);
  const [servicesWithImages, setServicesWithImages] = useState<ServiceImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { uploadAllImages, isUploading, progress } = useServiceImageUpload();
  const { generateImage, saveGeneratedImage, isGenerating, isSaving } = useImageGeneration();

  useEffect(() => {
    loadServicesWithImages();
  }, []);

  const loadServicesWithImages = async () => {
    setIsLoading(true);
    try {
      const [hotelResponse, travelResponse] = await Promise.all([
        supabase.from("hotel_services").select("id, title, image_url").eq("city", "Сочи"),
        supabase.from("travel_services").select("id, title, image_url").eq("city", "Сочи")
      ]);

      const servicesData: ServiceImage[] = [];

      // Map hotel services
      images.filter(img => img.type === "hotel").forEach(img => {
        const service = hotelResponse.data?.find(s => s.title === img.title);
        if (service) {
          servicesData.push({
            ...img,
            id: service.id,
            image_url: service.image_url,
            path: service.image_url || img.path
          });
        }
      });

      // Map travel services
      images.filter(img => img.type === "travel").forEach(img => {
        const service = travelResponse.data?.find(s => s.title === img.title);
        if (service) {
          servicesData.push({
            ...img,
            id: service.id,
            image_url: service.image_url,
            path: service.image_url || img.path
          });
        }
      });

      setServicesWithImages(servicesData);
    } catch (error) {
      console.error("Error loading services:", error);
      toast.error("Ошибка загрузки данных");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = async () => {
    const imageUrl = await generateImage(prompt, width, height);
    if (imageUrl) {
      setGeneratedImage(imageUrl);
    }
  };

  const handleSaveGenerated = async () => {
    if (!generatedImage || !selectedServiceForGeneration) {
      toast.error("Нет изображения для сохранения");
      return;
    }

    const success = await saveGeneratedImage(
      generatedImage,
      selectedServiceForGeneration.fileName,
      selectedServiceForGeneration.title,
      selectedServiceForGeneration.type
    );

    if (success) {
      setShowGenerateDialog(false);
      setGeneratedImage(null);
      setPrompt("");
      setSelectedServiceForGeneration(null);
      // Reload services data
      await loadServicesWithImages();
    }
  };

  const openGenerateDialog = (service: ServiceImage) => {
    setSelectedServiceForGeneration(service);
    setPrompt(`${service.name}, профессиональное фото высокого качества`);
    setShowGenerateDialog(true);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Предпросмотр изображений сервисов</h1>
          <p className="text-muted-foreground mb-4">
            Нажмите на изображение для увеличения
          </p>
          
          <div className="flex flex-wrap gap-4 items-center">
            <Button 
              onClick={() => setShowGenerateDialog(true)}
              size="lg"
              className="gap-2"
              variant="default"
            >
              <Sparkles className="h-5 w-5" />
              Сгенерировать изображение
            </Button>

            <Button 
              onClick={uploadAllImages} 
              disabled={isUploading}
              size="lg"
              className="gap-2"
              variant="secondary"
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

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Progress value={50} className="w-64" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicesWithImages.map((service) => (
              <Card key={service.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{service.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {service.type === "hotel" ? "Отель" : "Туризм"}
                  </p>
                </CardHeader>
                <CardContent className="space-y-2">
                  <img
                    src={service.path}
                    alt={service.name}
                    className="w-full h-48 object-cover rounded-md cursor-pointer"
                    onClick={() => setSelectedImage(service.path)}
                  />
                  <Button 
                    onClick={() => openGenerateDialog(service)}
                    variant="outline"
                    size="sm"
                    className="w-full gap-2"
                  >
                    <Sparkles className="h-4 w-4" />
                    Сгенерировать новое
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

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

      <Dialog open={showGenerateDialog} onOpenChange={(open) => {
        setShowGenerateDialog(open);
        if (!open) {
          setGeneratedImage(null);
          setPrompt("");
          setSelectedServiceForGeneration(null);
        }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedServiceForGeneration ? `Сгенерировать: ${selectedServiceForGeneration.name}` : "Сгенерировать изображение"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="prompt">Описание изображения</Label>
              <Textarea
                id="prompt"
                placeholder="Например: Доставка цветов в номер отеля, профессиональное фото"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="width">Ширина (px)</Label>
                <Input
                  id="width"
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  min={512}
                  max={1920}
                  step={32}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Высота (px)</Label>
                <Input
                  id="height"
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  min={512}
                  max={1920}
                  step={32}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={handleGenerate} 
                disabled={isGenerating || !prompt}
                className="flex-1"
              >
                {isGenerating ? "Генерация..." : "Сгенерировать"}
              </Button>
              
              {generatedImage && (
                <Button 
                  onClick={handleSaveGenerated} 
                  disabled={isSaving}
                  variant="default"
                  className="flex-1"
                >
                  {isSaving ? "Сохранение..." : "Сохранить и применить"}
                </Button>
              )}
            </div>

            {generatedImage && (
              <div className="space-y-2">
                <Label>Результат:</Label>
                <img src={generatedImage} alt="Generated" className="w-full rounded-lg border" />
                <p className="text-sm text-muted-foreground">
                  После сохранения изображение заменит текущее в базе данных
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
