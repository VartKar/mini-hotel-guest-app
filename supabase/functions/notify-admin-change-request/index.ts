
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ChangeRequestNotification {
  host_email: string;
  property_id: string;
  booking_id: string;
  request_type: string;
  request_details: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      host_email, 
      property_id, 
      booking_id, 
      request_type, 
      request_details 
    }: ChangeRequestNotification = await req.json();

    const adminEmail = "monaco1@ya.ru"; // Hidden from search engines

    const emailResponse = await resend.emails.send({
      from: "Host Portal <onboarding@resend.dev>",
      to: [adminEmail],
      subject: `Новый запрос на изменение от хоста: ${host_email}`,
      html: `
        <h2>Запрос на изменение от хоста</h2>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Хост:</strong> ${host_email}</p>
          <p><strong>ID объекта:</strong> ${property_id}</p>
          <p><strong>ID бронирования:</strong> ${booking_id || 'Не указано'}</p>
          <p><strong>Тип запроса:</strong> ${request_type}</p>
        </div>
        
        <h3>Детали запроса:</h3>
        <div style="background: #fff; border-left: 4px solid #007bff; padding: 15px; margin: 10px 0;">
          <p>${request_details}</p>
        </div>
        
        <p style="color: #666; font-size: 12px; margin-top: 30px;">
          Этот запрос был отправлен через панель управления хоста.
        </p>
      `,
    });

    console.log("Admin notification email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in notify-admin-change-request function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
