import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  try {
    const body = await req.json();
    const { action, data } = body;

    if (action !== "payment.updated" && action !== "payment.created") {
      return new Response("OK", { status: 200 });
    }

    const paymentId = data?.id?.toString();
    if (!paymentId) return new Response("OK", { status: 200 });

    const MERCADOPAGO_ACCESS_TOKEN = Deno.env.get("MERCADOPAGO_ACCESS_TOKEN");
    if (!MERCADOPAGO_ACCESS_TOKEN) return new Response("No MP config", { status: 200 });

    // Fetch payment details from Mercado Pago
    const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${MERCADOPAGO_ACCESS_TOKEN}` },
    });
    const mpData = await mpResponse.json();

    if (mpData.status === "approved") {
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );

      // Update order payment status
      await supabase
        .from("orders")
        .update({
          payment_status: "paid",
          order_status: "paid",
        })
        .eq("payment_id", paymentId);

      console.log(`Payment ${paymentId} confirmed via webhook`);
    }

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response("Error", { status: 500 });
  }
});
