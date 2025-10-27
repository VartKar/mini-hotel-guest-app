import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, Gift, Check } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

const registrationSchema = z.object({
  email: z.string()
    .trim()
    .email({ message: "Некорректный email" })
    .max(255, { message: "Email не должен превышать 255 символов" }),
  name: z.string()
    .trim()
    .min(2, { message: "Имя должно содержать минимум 2 символа" })
    .max(100, { message: "Имя не должно превышать 100 символов" }),
  phone: z.string()
    .trim()
    .max(20, { message: "Телефон не должен превышать 20 символов" })
    .optional()
    .or(z.literal('')),
  consentGiven: z.boolean()
    .refine(val => val === true, { message: "Необходимо дать согласие на обработку данных" })
});

interface WalkInRegistrationCardProps {
  onSuccess: () => void;
  currentRoomId: string;
  sessionToken: string;
}

export const WalkInRegistrationCard: React.FC<WalkInRegistrationCardProps> = ({
  onSuccess,
  currentRoomId,
  sessionToken
}) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [consentGiven, setConsentGiven] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = registrationSchema.safeParse({
      email,
      name,
      phone: phone || undefined,
      consentGiven
    });

    if (!validation.success) {
      const firstError = validation.error.errors[0];
      toast.error(firstError.message);
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('register-walkin-guest', {
        body: {
          email: email.trim().toLowerCase(),
          name: name.trim(),
          phone: phone.trim() || null,
          currentRoomId,
          sessionToken,
          consentGiven: true
        }
      });

      if (error) throw error;

      if (!data?.success) {
        throw new Error(data?.error || 'Registration failed');
      }

      toast.success("Регистрация завершена!", {
        description: `Вам начислено ${data.bonuses_awarded} бонусов${data.past_orders_linked > 0 ? `. Найдено ${data.past_orders_linked} прошлых заказов.` : '.'}`
      });

      onSuccess();

    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || "Произошла ошибка при регистрации");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-gray-200 bg-white">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base">
          <Gift className="h-5 w-5 text-gray-600" />
          Впервые у нас? Создайте профиль
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Для гостей без предварительной регистрации
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 mb-4">
          <div className="flex items-start gap-2">
            <Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
            <p className="text-sm text-gray-700">Сохраните историю заказов</p>
          </div>
          <div className="flex items-start gap-2">
            <Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
            <p className="text-sm text-gray-700">Получите 100 бонусных баллов</p>
          </div>
          <div className="flex items-start gap-2">
            <Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
            <p className="text-sm text-gray-700">Персональные рекомендации</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-sm font-medium">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              disabled={isSubmitting}
              className="mt-1"
              maxLength={255}
            />
          </div>

          <div>
            <Label htmlFor="name" className="text-sm font-medium">
              Имя <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Иван"
              disabled={isSubmitting}
              className="mt-1"
              maxLength={100}
            />
          </div>

          <div>
            <Label htmlFor="phone" className="text-sm font-medium">
              Телефон <span className="text-gray-400 text-xs">(опционально)</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+7 (999) 123-45-67"
              disabled={isSubmitting}
              className="mt-1"
              maxLength={20}
            />
          </div>

          <div className="flex items-start gap-3 p-3 border rounded-lg bg-white">
            <Checkbox
              id="consent"
              checked={consentGiven}
              onCheckedChange={(checked) => setConsentGiven(checked === true)}
              disabled={isSubmitting}
              className="mt-0.5"
            />
            <Label
              htmlFor="consent"
              className="text-xs text-gray-600 leading-relaxed cursor-pointer"
            >
              Я даю согласие на обработку персональных данных в соответствии с{" "}
              <a href="/privacy-policy" target="_blank" className="text-blue-600 underline">
                политикой конфиденциальности
              </a>
              {" "}<span className="text-red-500">*</span>
            </Label>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || !consentGiven}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Регистрация...
              </>
            ) : (
              "Зарегистрироваться"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
