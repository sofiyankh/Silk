/**
 * SILK STREETWEAR - WHATSAPP NOTIFIER SERVICE
 * ============================================
 * Handles formatting client command orders and sending them
 * individually to WhatsApp via CallMeBot (Free), Twilio, or Meta Cloud API.
 */

/**
 * Format a client command order into a clean, professional WhatsApp message
 */
function formatOrderWhatsAppMessage(order) {
  const dateStr = order.createdAt
    ? new Date(order.createdAt).toLocaleString("fr-FR", {
        timeZone: "Africa/Tunis",
        dateStyle: "short",
        timeStyle: "short",
      })
    : new Date().toLocaleString("fr-FR");

  // Format ordered items list
  let itemsList = "• Aucun article";
  if (order.items && order.items.length > 0) {
    itemsList = order.items
      .map((it) => {
        const unitDinars = ((it.unitPriceMillimes || 0) / 1000).toFixed(3);
        return `  • *${it.productName}* (${it.color} / ${it.size}) x ${it.quantity} — ${unitDinars} TND`;
      })
      .join("\n");
  } else if (order.itemsSummary) {
    itemsList = `  • ${order.itemsSummary}`;
  }

  const subtotalTND = ((order.subtotalMillimes || 0) / 1000).toFixed(3);
  const discountTND = ((order.discountMillimes || 0) / 1000).toFixed(3);
  const shippingTND =
    (order.shippingMillimes || 0) === 0
      ? "Gratuit"
      : `${((order.shippingMillimes || 0) / 1000).toFixed(3)} TND`;
  const totalTND = ((order.totalMillimes || 0) / 1000).toFixed(3);

  const discountLine =
    order.discountMillimes && order.discountMillimes > 0
      ? `\n  • Remise (${order.discountCode || "Promo"}): -${discountTND} TND`
      : "";

  const notesLine = order.notes && order.notes.trim() ? `\n📝 *Note client:* ${order.notes.trim()}` : "";

  return (
`🛍️ *NOUVELLE COMMANDE CLIENT - SILK*
━━━━━━━━━━━━━━━━━━━━━━
📦 *Commande #:* ${order.orderNumber}
📅 *Date:* ${dateStr}

👤 *Client:* ${order.customerName}
📞 *Téléphone:* ${order.customerPhone}
${order.customerEmail ? `✉️ *Email:* ${order.customerEmail}\n` : ""}📍 *Destination:* ${order.city || "Tunis"}, ${order.governorate || "Tunis"}
🏠 *Adresse:* ${order.shippingAddress || "Non spécifiée"} (Code: ${order.postalCode || "1000"})

🏷️ *Articles commandés:*
${itemsList}

💰 *Détails Paiement (COD):*
  • Sous-total: ${subtotalTND} TND${discountLine}
  • Livraison: ${shippingTND}
  • *TOTAL À ENCAISSER:* *${totalTND} TND*
  • Mode: ${order.paymentMethod || "Paiement à la livraison (COD)"}${notesLine}
━━━━━━━━━━━━━━━━━━━━━━
⚡ _Vérification requise avant expédition._`
  );
}

/**
 * Send a WhatsApp message to the admin.
 * Supports:
 * 1. CallMeBot API (100% Free, zero setup personal WhatsApp bot)
 * 2. Twilio WhatsApp API
 * 3. Meta Cloud API / Custom Webhook
 * 4. Fallback: Console output + direct wa.me link
 */
async function sendWhatsAppNotification(order, customPhone = null) {
  const isProd = process.env.NODE_ENV === "production";
  const adminPhone = customPhone || process.env.ADMIN_WHATSAPP_PHONE || process.env.WHATSAPP_PHONE;
  if (!adminPhone) {
    console.warn(`[WhatsApp] Order ${order.orderNumber}: skipped (ADMIN_WHATSAPP_PHONE missing)`);
    return { success: false, reason: "ADMIN_WHATSAPP_PHONE missing" };
  }

  const message = formatOrderWhatsAppMessage(order);
  const cleanPhone = adminPhone.replace(/[^0-9]/g, "");

  if (!isProd) {
    console.log(`\n======================================================`);
    console.log(`📲 PREPARING WHATSAPP MESSAGE FOR ORDER: ${order.orderNumber}`);
    console.log(`👤 Recipient: ${adminPhone}`);
    console.log(`------------------------------------------------------`);
    console.log(message);
    console.log(`======================================================\n`);
  }

  // 1. CALLMEBOT FREE API
  // To get an API Key: Send "I allow callmebot to send me messages" to +34 911 06 63 94 on WhatsApp
  const callMeBotKey = process.env.CALLMEBOT_API_KEY;
  if (callMeBotKey) {
    try {
      const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(
        cleanPhone
      )}&text=${encodeURIComponent(message)}&apikey=${encodeURIComponent(callMeBotKey)}`;

      const res = await fetch(url, {
        method: "GET",
        signal: AbortSignal.timeout(5000),
      });
      const text = await res.text();
      if (isProd) {
        console.log(`[WhatsApp] Order ${order.orderNumber}: sent (callmebot)`);
      } else {
        console.log(`✅ [CallMeBot] WhatsApp Notification Sent! Result:`, text.trim());
      }
      return { success: true, provider: "callmebot", response: text };
    } catch (err) {
      if (isProd) {
        console.error(`[WhatsApp] Order ${order.orderNumber}: failed (callmebot)`);
      } else {
        console.error(`❌ [CallMeBot] Error sending WhatsApp message:`, err.message);
      }
    }
  }

  // 2. TWILIO WHATSAPP API
  const twilioSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioFrom = process.env.TWILIO_WHATSAPP_FROM || "whatsapp:+14155238886"; // Default Twilio Sandbox
  if (twilioSid && twilioToken) {
    try {
      const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`;
      const authHeader = "Basic " + Buffer.from(`${twilioSid}:${twilioToken}`).toString("base64");

      const params = new URLSearchParams();
      params.append("From", twilioFrom.startsWith("whatsapp:") ? twilioFrom : `whatsapp:${twilioFrom}`);
      params.append("To", adminPhone.startsWith("whatsapp:") ? adminPhone : `whatsapp:${adminPhone}`);
      params.append("Body", message);

      const res = await fetch(twilioUrl, {
        method: "POST",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      });

      const data = await res.json();
      if (res.ok) {
        if (isProd) {
          console.log(`[WhatsApp] Order ${order.orderNumber}: sent (twilio)`);
        } else {
          console.log(`✅ [Twilio] WhatsApp Notification Sent! SID: ${data.sid}`);
        }
        return { success: true, provider: "twilio", response: data };
      } else {
        if (isProd) {
          console.error(`[WhatsApp] Order ${order.orderNumber}: failed (twilio)`);
        } else {
          console.error(`❌ [Twilio] Failed to send WhatsApp:`, data);
        }
      }
    } catch (err) {
      if (isProd) {
        console.error(`[WhatsApp] Order ${order.orderNumber}: failed (twilio)`);
      } else {
        console.error(`❌ [Twilio] Error:`, err.message);
      }
    }
  }

  // 3. META CLOUD API / CUSTOM WEBHOOK
  const metaWebhookUrl = process.env.WHATSAPP_WEBHOOK_URL;
  if (metaWebhookUrl) {
    try {
      const res = await fetch(metaWebhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(process.env.WHATSAPP_BEARER_TOKEN
            ? { Authorization: `Bearer ${process.env.WHATSAPP_BEARER_TOKEN}` }
            : {}),
        },
        body: JSON.stringify({
          recipient: adminPhone,
          orderNumber: order.orderNumber,
          message,
          rawOrder: order,
        }),
      });

      const resData = await res.text();
      if (isProd) {
        console.log(`[WhatsApp] Order ${order.orderNumber}: sent (webhook)`);
      } else {
        console.log(`✅ [WhatsApp Webhook] Sent! Response:`, resData);
      }
      return { success: true, provider: "webhook", response: resData };
    } catch (err) {
      if (isProd) {
        console.error(`[WhatsApp] Order ${order.orderNumber}: failed (webhook)`);
      } else {
        console.error(`❌ [WhatsApp Webhook] Error:`, err.message);
      }
    }
  }

  // 4. FALLBACK / DIRECT LINK (when no third-party API is configured yet)
  const directWaLink = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  if (!isProd) {
    console.log(`💡 [WhatsApp Direct Link]: Click below to send directly via WhatsApp:`);
    console.log(directWaLink);
    console.log(`\n(Tip: Configure CALLMEBOT_API_KEY or TWILIO credentials in .env for fully automated sending without clicking)\n`);
  } else {
    console.log(`[WhatsApp] Order ${order.orderNumber}: skipped (no automated provider configured)`);
  }

  return {
    success: true,
    provider: "manual_link",
    ...(isProd ? {} : { message, directWaLink }),
  };
}

module.exports = {
  formatOrderWhatsAppMessage,
  sendWhatsAppNotification,
};
