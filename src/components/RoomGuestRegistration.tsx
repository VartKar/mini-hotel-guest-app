
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, User, Mail, Phone } from 'lucide-react';

interface RoomGuestRegistrationProps {
  onRegister: (guestData: {
    guest_email?: string;
    guest_phone?: string;
    guest_name?: string;
  }) => Promise<boolean>;
  error?: string | null;
}

const RoomGuestRegistration = ({ onRegister, error }: RoomGuestRegistrationProps) => {
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🔄 Form submitted with data:', {
      guestName: guestName.trim(),
      guestEmail: guestEmail.trim(),
      guestPhone: guestPhone.trim()
    });

    if (!guestName.trim()) {
      console.log('❌ Guest name is required');
      return;
    }

    setIsSubmitting(true);
    console.log('⏳ Setting isSubmitting to true');
    
    try {
      console.log('🚀 Calling onRegister function...');
      const success = await onRegister({
        guest_name: guestName.trim(),
        guest_email: guestEmail.trim() || undefined,
        guest_phone: guestPhone.trim() || undefined,
      });

      console.log('✅ Registration result:', success);

      if (success) {
        console.log('🎉 Registration successful, clearing form');
        setGuestName('');
        setGuestEmail('');
        setGuestPhone('');
      } else {
        console.log('❌ Registration failed');
      }
    } catch (error) {
      console.error('💥 Error during registration:', error);
    } finally {
      console.log('🔄 Setting isSubmitting to false');
      setIsSubmitting(false);
    }
  };

  const isButtonDisabled = isSubmitting || !guestName.trim();

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Регистрация в номере</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="guestName">Имя <span className="text-red-500">*</span></Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="guestName"
                  type="text"
                  placeholder="Ваше имя"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="pl-10"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="guestEmail">Email (опционально)</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="guestEmail"
                  type="email"
                  placeholder="your@email.com"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  className="pl-10"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="guestPhone">Телефон (опционально)</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="guestPhone"
                  type="tel"
                  placeholder="+7 (XXX) XXX-XX-XX"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  className="pl-10"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <p className="text-sm text-gray-600">
              Для входа в номер достаточно указать только имя. Email и телефон опциональны.
            </p>

            {error && (
              <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-200">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={isButtonDisabled}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center ${
                isButtonDisabled 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-sm hover:shadow-md'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Регистрация...
                </>
              ) : (
                'Зарегистрироваться'
              )}
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoomGuestRegistration;
