// src/messages/index.ts

import de from "./de.json";
import en from "./en.json";
import fa from "./fa.json";

export const messagesMap: Record<string, Record<string, string>> = {
  en,
  fa,
  de,
};
