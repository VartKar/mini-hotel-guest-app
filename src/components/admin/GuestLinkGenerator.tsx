
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, ExternalLink, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { ensureGuestToken, generateGuestToken } from '@/utils/tokenUtils';
import { supabase } from '@/integrations/supabase/client';

interface GuestLinkGeneratorProps {
  bookingId: string;
  currentToken?: string | null;
  onTokenUpdate?: (newToken: string) => void;
}

const GuestLinkGenerator: React.FC<GuestLinkGeneratorProps> = ({
  bookingId,
  currentToken,
  onTokenUpdate
}) => {
  const [token, setToken] = useState(currentToken || '');
  const [loading, setLoading] = useState(false);

  const guestUrl = token ? `${window.location.origin}/guest/${token}` : '';

  const generateNewToken = async () => {
    setLoading(true);
    try {
      const newToken = generateGuestToken();
      
      const { error } = await supabase
        .from('bookings')
        .update({ access_token: newToken })
        .eq('id', bookingId);

      if (error) throw error;

      setToken(newToken);
      onTokenUpdate?.(newToken);
      toast.success('Новая персональная ссылка создана');
    } catch (error) {
      console.error('Error generating token:', error);
      toast.error('Ошибка при создании ссылки');
    } finally {
      setLoading(false);
    }
  };

  const ensureToken = async () => {
    if (token) return;
    
    setLoading(true);
    try {
      const newToken = await ensureGuestToken(bookingId);
      if (newToken) {
        setToken(newToken);
        onTokenUpdate?.(newToken);
      }
    } catch (error) {
      console.error('Error ensuring token:', error);
      toast.error('Ошибка при создании ссылки');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (guestUrl) {
      navigator.clipboard.writeText(guestUrl);
      toast.success('Ссылка скопирована в буфер обмена');
    }
  };

  const openInNewTab = () => {
    if (guestUrl) {
      window.open(guestUrl, '_blank');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ExternalLink className="w-5 h-5" />
          Персональная ссылка для гостя
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!token ? (
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Персональная ссылка не создана
            </p>
            <Button 
              onClick={ensureToken}
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Создание...' : 'Создать персональную ссылку'}
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">Ссылка для гостя:</label>
              <div className="flex gap-2">
                <Input
                  value={guestUrl}
                  readOnly
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={openInNewTab}
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={generateNewToken}
                disabled={loading}
                className="flex-1"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Обновить ссылку
              </Button>
            </div>

            <div className="text-xs text-gray-500">
              <p>• Ссылка действует только для этого бронирования</p>
              <p>• Гость будет автоматически авторизован при переходе</p>
              <p>• Можно отправить ссылку гостю любым удобным способом</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default GuestLinkGenerator;
