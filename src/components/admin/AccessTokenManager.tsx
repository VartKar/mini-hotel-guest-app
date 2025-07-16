
import React, { useState } from "react";
import { Copy, QrCode, RefreshCw, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import QRCode from "qrcode";

interface AccessTokenManagerProps {
  bookingId: string;
  currentToken?: string | null;
}

const AccessTokenManager: React.FC<AccessTokenManagerProps> = ({
  bookingId,
  currentToken
}) => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  const [showQrDialog, setShowQrDialog] = useState(false);
  const queryClient = useQueryClient();

  // Generate new access token
  const generateTokenMutation = useMutation({
    mutationFn: async () => {
      const newToken = crypto.randomUUID() + '-' + Date.now().toString(36);
      
      const { error } = await supabase
        .from('combined')
        .update({ 
          access_token: newToken,
          last_updated_at: new Date().toISOString(),
          last_updated_by: 'admin'
        })
        .eq('id_key', bookingId);
      
      if (error) throw error;
      return newToken;
    },
    onSuccess: (newToken) => {
      queryClient.invalidateQueries({ queryKey: ['admin-all-bookings'] });
      toast.success('Новый токен доступа создан');
    },
    onError: (error) => {
      console.error('Error generating token:', error);
      toast.error('Ошибка при создании токена');
    },
  });

  // Generate QR Code
  const generateQrCode = async (token: string) => {
    try {
      const guestUrl = `${window.location.origin}?token=${token}`;
      const qrDataUrl = await QRCode.toDataURL(guestUrl, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      });
      setQrCodeDataUrl(qrDataUrl);
      setShowQrDialog(true);
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast.error('Ошибка при создании QR кода');
    }
  };

  // Copy to clipboard
  const copyToClipboard = (token: string) => {
    const guestUrl = `${window.location.origin}?token=${token}`;
    navigator.clipboard.writeText(guestUrl);
    toast.success('Ссылка скопирована в буфер обмена');
  };

  // Download QR code
  const downloadQrCode = () => {
    const link = document.createElement('a');
    link.download = `qr-code-${bookingId}.png`;
    link.href = qrCodeDataUrl;
    link.click();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <ExternalLink className="w-5 h-5 mr-2" />
          Персональная ссылка для гостя
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentToken ? (
          <>
            <div className="flex gap-2">
              <Input
                value={`${window.location.origin}?token=${currentToken}`}
                readOnly
                className="font-mono text-sm"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(currentToken)}
              >
                <Copy className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => generateQrCode(currentToken)}
              >
                <QrCode className="w-4 h-4" />
              </Button>
            </div>
            
            <Button
              variant="outline"
              onClick={() => generateTokenMutation.mutate()}
              disabled={generateTokenMutation.isPending}
              className="w-full"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              {generateTokenMutation.isPending ? 'Создание...' : 'Создать новую ссылку'}
            </Button>
          </>
        ) : (
          <Button
            onClick={() => generateTokenMutation.mutate()}
            disabled={generateTokenMutation.isPending}
            className="w-full bg-red-600 hover:bg-red-700"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            {generateTokenMutation.isPending ? 'Создание...' : 'Создать персональную ссылку'}
          </Button>
        )}

        {/* QR Code Dialog */}
        <Dialog open={showQrDialog} onOpenChange={setShowQrDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>QR код для гостя</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center space-y-4">
              {qrCodeDataUrl && (
                <>
                  <img src={qrCodeDataUrl} alt="QR Code" className="border rounded" />
                  <p className="text-sm text-gray-600 text-center">
                    Гость может отсканировать этот QR код для быстрого доступа к своей информации
                  </p>
                  <Button onClick={downloadQrCode} className="w-full">
                    Скачать QR код
                  </Button>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default AccessTokenManager;
