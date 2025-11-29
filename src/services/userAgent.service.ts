export const isSocialBot = (userAgent: string): boolean => {
  if (!userAgent) return false;

  const bots = [
    "facebookexternalhit",
    "Twitterbot",
    "LinkedInBot",
    "WhatsApp",
    "Discordbot",
    "Slackbot",
    "TelegramBot",
    "Applebot",
    "Pinterest",
    "SkypeUriPreview",
    "redditbot",
  ];

  const lowerUA = userAgent.toLowerCase();
  return bots.some((bot) => lowerUA.includes(bot.toLowerCase()));
};

export const getPlatform = (userAgent: string): string => {
  if (!userAgent) return "Unknown";

  const lowerUA = userAgent.toLowerCase();

  if (lowerUA.includes("facebookexternalhit")) return "Facebook";
  if (lowerUA.includes("twitterbot")) return "Twitter";
  if (lowerUA.includes("linkedinbot")) return "LinkedIn";
  if (lowerUA.includes("whatsapp")) return "WhatsApp";
  if (lowerUA.includes("discordbot")) return "Discord";
  if (lowerUA.includes("slackbot")) return "Slack";
  if (lowerUA.includes("telegrambot")) return "Telegram";

  // Basic Browser Detection (Simplified)
  if (lowerUA.includes("chrome")) return "Chrome";
  if (lowerUA.includes("firefox")) return "Firefox";
  if (lowerUA.includes("safari") && !lowerUA.includes("chrome"))
    return "Safari";

  return "Other";
};
