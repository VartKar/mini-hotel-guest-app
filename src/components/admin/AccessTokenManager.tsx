
import React, { useState, useEffect } from "react";
import { Copy, QrCode, RefreshCw, ExternalLink, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  const [token, setToken] = useState<string | null>(currentToken || null);
  const queryClient = useQueryClient();

  // Auto-generate token if it doesn't exist
  useEffect(() => {
    if (!currentToken && bookingId) {
      generateTokenMutation.mutate();
    }
  }, [currentToken, bookingId]);

  // Update local token state when currentToken changes
  useEffect(() => {
    setToken(currentToken || null);
  }, [currentToken]);

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
      setToken(newToken);
      queryClient.invalidateQueries({ queryKey: ['admin-all-bookings'] });
      
      if (currentToken) {
        toast.success('Новая персональная ссылка создана');
      } else {
        toast.success('Персональная ссылка автоматически создана');
      }
    },
    onError: (error) => {
      console.error('Error generating token:', error);
      toast.error('Ошибка при создании токена');
    },
  });

  // Generate QR Code
  const generateQrCode = async (tokenToUse: string) => {
    try {
      const guestUrl = `${window.location.origin}?token=${tokenToUse}`;
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
  const copyToClipboard = (tokenToUse: string) => {
    const guestUrl = `${window.location.origin}?token=${tokenToUse}`;
    navigator.clipboard.writeText(guestUrl);
    toast.success('Персональная ссылка скопирована в буфер обмена');
  };

  // Download QR code
  const downloadQrCode = () => {
    const link = document.createElement('a');
    link.download = `guest-link-qr-${bookingId}.png`;
    link.href = qrCodeDataUrl;
    link.click();
  };

  const currentTokenToUse = token || currentToken;

  return (
    <Card className="bg-green-50 border-green-200">
      <CardHeader>
        <CardTitle className="flex items-center text-lg text-green-800">
          <CheckCircle2 className="w-5 h-5 mr-2" />
          Персональная ссылка для гостя
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentTokenToUse ? (
          <>
            <div className="bg-white p-3 rounded-lg border border-green-200">
              <div className="text-sm text-green-700 mb-2 font-medium">
                Готовая ссылка для отправки гостю:
              </div>
              <div className="flex gap-2">
                <Input
                  value={`${window.location.origin}?token=${currentTokenToUse}`}
                  readOnly
                  className="font-mono text-sm bg-gray-50 border-gray-200"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(currentTokenToUse)}
                  className="bg-green-600 hover:bg-green-700 text-white border-green-600"
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => generateQrCode(currentTokenToUse)}
                  className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                >
                  <QrCode className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <div className="text-sm text-blue-700 mb-2">
                💡 <strong>Как использовать:</strong>
              </div>
              <ul className="text-sm text-blue-600 space-y-1">
                <li>• Отправьте ссылку гостю в мессенджере или email</li>
                <li>• Гость перейдет по ссылке и автоматически попадет в свою личную информацию</li>
                <li>• Или покажите QR-код для быстрого доступа</li>
              </ul>
            </div>
            
            <Button
              variant="outline"
              onClick={() => generateTokenMutation.mutate()}
              disabled={generateTokenMutation.isPending}
              className="w-full text-orange-600 border-orange-200 hover:bg-orange-50"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              {generateTokenMutation.isPending ? 'Создание новой ссылки...' : 'Создать новую ссылку'}
            </Button>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="text-sm text-gray-600 mb-3">
              Автоматически создается персональная ссылка...
            </div>
            <Button
              disabled={generateTokenMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              {generateTokenMutation.isPending ? 'Создание...' : 'Создать ссылку'}
            </Button>
          </div>
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
                  <Button onClick={downloadQrCode} className="w-full bg-blue-600 hover:bg-blue-700">
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
