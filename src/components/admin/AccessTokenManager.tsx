
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Copy, RefreshCw, QrCode } from "lucide-react";
import QRCode from "qrcode";

interface AccessTokenManagerProps {
  bookingId: string;
  currentToken?: string;
  onTokenUpdated: (token: string) => void;
}

const AccessTokenManager = ({ bookingId, currentToken, onTokenUpdated }: AccessTokenManagerProps) => {
  const [loading, setLoading] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const { toast } = useToast();

  const generateToken = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  const updateAccessToken = async () => {
    try {
      setLoading(true);
      const newToken = generateToken();
      
      const { error } = await supabase
        .from('combined')
        .update({ access_token: newToken })
        .eq('id_key', bookingId);

      if (error) throw error;

      onTokenUpdated(newToken);
      toast({
        title: "Токен обновлен",
        description: "Новый токен доступа создан успешно",
      });
    } catch (error) {
      console.error('Error updating access token:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить токен",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateQRCode = async (token: string) => {
    try {
      const guestUrl = `${window.location.origin}/?token=${token}`;
      const qrDataUrl = await QRCode.toDataURL(guestUrl, {
        width: 256,
        margin: 2,
      });
      setQrCodeUrl(qrDataUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось создать QR-код",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Скопировано",
        description: "Ссылка скопирована в буфер обмена",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось скопировать ссылку",
        variant: "destructive",
      });
    }
  };

  const guestUrl = currentToken ? `${window.location.origin}/?token=${currentToken}` : "";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-5 w-5" />
          Персональная ссылка гостя
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Токен доступа:</label>
          <div className="flex gap-2">
            <Input 
              value={currentToken || "Не создан"} 
              readOnly 
              className="font-mono text-sm"
            />
            <Button
              onClick={updateAccessToken}
              disabled={loading}
              variant="outline"
              size="icon"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        {currentToken && (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">Персональная ссылка:</label>
              <div className="flex gap-2">
                <Input 
                  value={guestUrl} 
                  readOnly 
                  className="text-sm"
                />
                <Button
                  onClick={() => copyToClipboard(guestUrl)}
                  variant="outline"
                  size="icon"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">QR-код:</label>
                <Button
                  onClick={() => generateQRCode(currentToken)}
                  variant="outline"
                  size="sm"
                >
                  Создать QR-код
                </Button>
              </div>
              
              {qrCodeUrl && (
                <div className="flex flex-col items-center space-y-2 p-4 border rounded-lg">
                  <img src={qrCodeUrl} alt="QR Code" className="max-w-64" />
                  <p className="text-xs text-muted-foreground text-center">
                    QR-код для быстрой авторизации гостя
                  </p>
                  <Button
                    onClick={() => {
                      const link = document.createElement('a');
                      link.download = `qr-code-${bookingId}.png`;
                      link.href = qrCodeUrl;
                      link.click();
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Скачать QR-код
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AccessTokenManager;
