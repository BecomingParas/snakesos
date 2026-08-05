// Telegram integration utilities - extracted from @/lib/telegram references

export interface TelegramConfig {
  botToken: string;
  chatId: string;
  enabled: boolean;
}

export interface TelegramStatus {
  enabled: boolean;
  botTokenSet: boolean;
  chatIdSet: boolean;
}

export async function getTelegramStatus(): Promise<TelegramStatus> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  
  return {
    enabled: process.env.TELEGRAM_ENABLED === 'true',
    botTokenSet: !!botToken,
    chatIdSet: !!chatId,
  };
}

export async function sendTelegramMessage(message: string): Promise<boolean> {
  const config = await getTelegramStatus();
  
  if (!config.enabled || !config.botTokenSet || !config.chatIdSet) {
    console.warn('Telegram not configured properly');
    return false;
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'HTML',
        }),
      }
    );

    return response.ok;
  } catch (error) {
    console.error('Failed to send Telegram message:', error);
    return false;
  }
}

export async function sendRescueAlert(rescue: {
  id: string;
  name: string;
  phone: string;
  municipality: string;
  address: string;
  lat?: number | null;
  lng?: number | null;
}): Promise<boolean> {
  const message = `
🚨 <b>EMERGENCY SNAKE RESCUE REQUEST</b>

👤 <b>Name:</b> ${rescue.name}
📞 <b>Phone:</b> ${rescue.phone}  
📍 <b>Location:</b> ${rescue.address}, ${rescue.municipality}
${rescue.lat && rescue.lng ? `🗺️ <b>GPS:</b> ${rescue.lat}, ${rescue.lng}` : ''}

🆔 <b>Ticket ID:</b> BSR-${rescue.id.slice(0, 8).toUpperCase()}

⚡ Immediate response required!
  `;

  return sendTelegramMessage(message);
}