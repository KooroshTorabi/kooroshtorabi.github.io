import de from "./de.json";
import en from "./en.json";
import fa from "./fa.json";

/**
 * تعریف یک نوع بازگشتی (Recursive Type) برای پشتیبانی از ترجمه‌های تودرتو.
 * یک مقدار پیام می‌تواند یک رشته باشد یا یک شیء که خود شامل مقادیر پیام است.
 */
type MessageValue = string | { [key: string]: MessageValue };

/**
 * map اصلی که زبان (string) را به آبجکت ترجمه (MessageValue) نگاشت می‌کند.
 * تغییرات: محتوای هر فایل اکنون زیر کلید 'main-page' قرار می‌گیرد.
 */
export const messagesMap: Record<string, MessageValue> = {
  en: { "main-page": en as MessageValue }, // 👈 Wrap content under 'main-page'
  fa: { "main-page": fa as MessageValue }, // 👈 Wrap content under 'main-page'
  de: { "main-page": de as MessageValue }, // 👈 Wrap content under 'main-page'
};
