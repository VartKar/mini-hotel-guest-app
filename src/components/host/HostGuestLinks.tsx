import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Download } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";

interface HostGuestLinksProps {
  hostEmail: string;
}

interface RoomQRCode {
  id: string;
  access_token: string;
  room_number: string;
  property_id: string;
}

export const HostGuestLinks = ({ hostEmail }: HostGuestLinksProps) => {
  const { data: roomQRCodes, isLoading } = useQuery({
    queryKey: ["host-room-qr-codes", hostEmail],
    queryFn: async () => {
      // Get rooms for this host
      const { data: rooms, error: roomsError } = await supabase
        .from("rooms")
        .select("id, room_number, property_id")
        .eq("host_email", hostEmail)
        .eq("is_active", true)
        .order("room_number");

      if (roomsError) throw roomsError;

      // Get default bookings for these rooms
      const roomIds = rooms?.map(r => r.id) || [];
      if (roomIds.length === 0) return [];

      const { data: bookings, error: bookingsError } = await supabase
        .from("bookings")
        .select("id, access_token, room_id")
        .in("room_id", roomIds)
        .eq("is_default_guest", true);

      if (bookingsError) throw bookingsError;

      // Map bookings to rooms
      return rooms?.map(room => {
        const booking = bookings?.find(b => b.room_id === room.id);
        return {
          id: booking?.id || "",
          access_token: booking?.access_token || "",
          room_number: room.room_number,
          property_id: room.property_id,
        };
      }).filter(qr => qr.access_token) as RoomQRCode[];
    },
  });
  const handleCopyLink = (token: string) => {
    const url = `${window.location.origin}/guest/${token}`;
    navigator.clipboard.writeText(url);
    toast.success("Ссылка скопирована");
  };

  const handleDownloadQR = (roomNumber: string, token: string) => {
    const svg = document.getElementById(`qr-host-${token}`);
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
      downloadLink.download = `QR-Guest-${roomNumber}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>QR-коды для комнат</CardTitle>
          <CardDescription>Загрузка...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!roomQRCodes || roomQRCodes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ссылки для гостей</CardTitle>
          <CardDescription>
            Нет бронирований с персональными ссылками
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>QR-коды для комнат</CardTitle>
        <CardDescription>
          Распечатайте и разместите QR-коды в комнатах или отправьте ссылки гостям
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roomQRCodes.map((room) => {
            const guestUrl = `${window.location.origin}/guest/${room.access_token}`;

            return (
              <div key={room.id} className="border rounded-lg p-4 space-y-4">
                <div>
                  <h3 className="font-medium">Комната {room.room_number}</h3>
                  <p className="text-sm text-muted-foreground">{room.property_id}</p>
                </div>

                <div className="flex justify-center p-4 bg-white rounded-lg">
                  <QRCodeSVG
                    id={`qr-host-${room.access_token}`}
                    value={guestUrl}
                    size={150}
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
                    onClick={() => handleCopyLink(room.access_token)}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Ссылка
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleDownloadQR(room.room_number, room.access_token)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    QR
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
