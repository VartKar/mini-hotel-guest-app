import { useState } from "react";
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

const images = [
  { name: "Доставка цветов", fileName: "flowers-delivery.webp", path: "/images/services/flowers-delivery.webp", type: "hotel" as const, title: "Доставка цветов" },
  { name: "Доставка еды", fileName: "food-delivery.webp", path: "/images/services/food-delivery.webp", type: "hotel" as const, title: "Доставка еды" },
  { name: "СПА услуги", fileName: "spa-services.webp", path: "/images/services/spa-services.webp", type: "hotel" as const, title: "СПА услуги" },
  { name: "Прачечная", fileName: "laundry.webp", path: "/images/services/laundry.webp", type: "hotel" as const, title: "Прачечная" },
  { name: "Поздний выезд", fileName: "late-checkout.webp", path: "/images/services/late-checkout.webp", type: "hotel" as const, title: "Поздний выезд" },
  { name: "Уборка номера", fileName: "room-cleaning.webp", path: "/images/services/room-cleaning.webp", type: "hotel" as const, title: "Уборка номера" },
  { name: "Конная прогулка", fileName: "horse-riding.webp", path: "/images/services/horse-riding.webp", type: "travel" as const, title: "Конная прогулка" },
  { name: "Рафтинг", fileName: "rafting.webp", path: "/images/services/rafting.webp", type: "travel" as const, title: "Рафтинг" },
  { name: "Дегустация вин", fileName: "wine-tasting.webp", path: "/images/services/wine-tasting.webp", type: "travel" as const, title: "Дегустация вин" },
  { name: "Канатная дорога", fileName: "cable-car.webp", path: "/images/services/cable-car.webp", type: "travel" as const, title: "Канатная дорога" },
  { name: "Дендрарий", fileName: "dendrarium.webp", path: "/images/services/dendrarium.webp", type: "travel" as const, title: "Дендрарий" },
];

export default function PreviewImages() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [width, setWidth] = useState(1280);
  const [height, setHeight] = useState(720);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [selectedServiceForGeneration, setSelectedServiceForGeneration] = useState<typeof images[0] | null>(null);
  
  const { uploadAllImages, isUploading, progress } = useServiceImageUpload();
  const { generateImage, saveGeneratedImage, isGenerating, isSaving } = useImageGeneration();

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
      // Reload page to show updated images
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  const openGenerateDialog = (service: typeof images[0]) => {
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{image.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {image.type === "hotel" ? "Отель" : "Туризм"}
                </p>
              </CardHeader>
              <CardContent className="space-y-2">
                <img
                  src={image.path}
                  alt={image.name}
                  className="w-full h-48 object-cover rounded-md cursor-pointer"
                  onClick={() => setSelectedImage(image.path)}
                />
                <Button 
                  onClick={() => openGenerateDialog(image)}
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
