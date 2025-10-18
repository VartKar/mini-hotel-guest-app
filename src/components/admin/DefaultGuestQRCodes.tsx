import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw, Copy, ExternalLink } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";
import { useState } from "react";

interface DefaultBooking {
  id: string;
  access_token: string;
  room_number: string;
  property_id: string;
  guest_name: string;
}

export const DefaultGuestQRCodes = () => {
  const [refreshingToken, setRefreshingToken] = useState<string | null>(null);

  const { data: defaultBookings, isLoading, refetch } = useQuery({
    queryKey: ["default-guest-bookings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          id,
          access_token,
          guest_name,
          rooms (
            room_number,
            property_id
          )
        `)
        .eq("is_default_guest", true)
        .order("rooms(room_number)");

      if (error) throw error;

      return data.map((booking) => ({
        id: booking.id,
        access_token: booking.access_token || "",
        guest_name: booking.guest_name,
        room_number: (booking.rooms as any)?.room_number || "",
        property_id: (booking.rooms as any)?.property_id || "",
      })) as DefaultBooking[];
    },
  });

  const handleRefreshToken = async (bookingId: string) => {
    setRefreshingToken(bookingId);
    try {
      const newToken = Array.from(crypto.getRandomValues(new Uint8Array(32)))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      const { error } = await supabase
        .from("bookings")
        .update({ access_token: newToken })
        .eq("id", bookingId);

      if (error) throw error;

      toast.success("Токен обновлен");
      refetch();
    } catch (error) {
      console.error("Error refreshing token:", error);
      toast.error("Ошибка обновления токена");
    } finally {
      setRefreshingToken(null);
    }
  };

  const handleDownloadQR = (roomNumber: string, token: string) => {
    const svg = document.getElementById(`qr-${token}`);
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");

      const downloadLink = document.createElement("a");
      downloadLink.download = `QR-Room-${roomNumber}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  if (isLoading) {
    return <div className="p-8">Загрузка...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">QR-коды для комнат</h2>
        <p className="text-muted-foreground mt-2">
          Распечатайте и разместите QR-коды в каждой комнате для быстрого доступа гостей
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {defaultBookings?.map((booking) => {
          const guestUrl = `${window.location.origin}/guest/${booking.access_token}`;

          return (
            <Card key={booking.id}>
              <CardHeader>
                <CardTitle>Комната {booking.room_number}</CardTitle>
                <CardDescription>{booking.property_id}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-center p-4 bg-white rounded-lg">
                  <QRCodeSVG
                    id={`qr-${booking.access_token}`}
                    value={guestUrl}
                    size={200}
                    level="H"
                    includeMargin
                  />
                </div>

                <div className="text-xs text-muted-foreground break-all bg-muted p-2 rounded">
                  {guestUrl}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      navigator.clipboard.writeText(guestUrl);
                      toast.success("Ссылка скопирована");
                    }}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Копировать ссылку
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleDownloadQR(booking.room_number, booking.access_token)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Скачать QR
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRefreshToken(booking.id)}
                    disabled={refreshingToken === booking.id}
                  >
                    <RefreshCw className={`h-4 w-4 ${refreshingToken === booking.id ? "animate-spin" : ""}`} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
