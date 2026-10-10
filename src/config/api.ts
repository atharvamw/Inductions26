// Production backend server deployed on Vercel
export const DEFAULT_API_BASE_URL = "https://csicoep.pp.ua";

// In development, if VITE_API_URL is not explicitly provided, we use empty string ""
// so requests seamlessly route through Vite's dev proxy (/api -> https://csicoep.pp.ua/api),
// preventing local CORS blockers while developing.
// In production builds, it defaults directly to DEFAULT_API_BASE_URL (https://csicoep.pp.ua).
export const API_BASE_URL = (
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_URL) ||
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.DEV ? "" : DEFAULT_API_BASE_URL)
).replace(/\/$/, "");

export const API_ENDPOINTS = {
  SUBMIT_APPLICATION: `${API_BASE_URL}/api/inductions`,
  GET_STATUS: `${API_BASE_URL}/api/inductions/status`,
};

export const EXTERNAL_LINKS = {
  MAIN_WEBSITE: "https://csi.coep.org.in/",
  PORTAL_LOGIN: `${DEFAULT_API_BASE_URL}/login`,
  WHATSAPP_GROUP: "https://chat.whatsapp.com/LPIOIFLME1pGUO9ffa2cu8",
};
