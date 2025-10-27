import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Download, ExternalLink } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";
import { HostBooking } from "@/hooks/useHostData";

interface HostGuestLinksProps {
  bookings: HostBooking[];
}

export const HostGuestLinks = ({ bookings }: HostGuestLinksProps) => {
  const handleCopyLink = (token: string) => {
    const url = `${window.location.origin}/guest/${token}`;
    navigator.clipboard.writeText(url);
    toast.success("Ссылка скопирована");
  };

  const handleOpenLink = (token: string) => {
    const url = `${window.location.origin}/guest/${token}`;
    window.open(url, "_blank");
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

  // Filter bookings that have access tokens
  const bookingsWithTokens = bookings.filter((b) => b.access_token);

  if (bookingsWithTokens.length === 0) {
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
        <CardTitle>Ссылки для гостей</CardTitle>
        <CardDescription>
          Отправьте эти ссылки или QR-коды вашим гостям для доступа к их бронированию
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookingsWithTokens.map((booking) => {
            const guestUrl = `${window.location.origin}/guest/${booking.access_token}`;

            return (
              <div key={booking.id} className="border rounded-lg p-4 space-y-4">
                <div>
                  <h3 className="font-medium">{booking.guest_name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Комната {booking.room_number}
                  </p>
                </div>

                <div className="flex justify-center p-4 bg-white rounded-lg">
                  <QRCodeSVG
                    id={`qr-host-${booking.access_token}`}
                    value={guestUrl}
                    size={150}
                    level="H"
                    includeMargin
                  />
                </div>

                <div className="text-xs text-muted-foreground break-all bg-muted p-2 rounded">
                  {guestUrl}
                </div>

                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyLink(booking.access_token!)}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Копировать ссылку
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleOpenLink(booking.access_token!)}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleDownloadQR(booking.room_number, booking.access_token!)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
