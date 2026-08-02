const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

const bnMonths = [
  "জানুয়ারি",
  "ফেব্রুয়ারি",
  "মার্চ",
  "এপ্রিল",
  "মে",
  "জুন",
  "জুলাই",
  "আগস্ট",
  "সেপ্টেম্বর",
  "অক্টোবর",
  "নভেম্বর",
  "ডিসেম্বর",
];

function toBanglaNumber(num: number | string): string {
  return String(num).replace(/\d/g, (d) => bnDigits[parseInt(d, 10)]);
}

export function formatBDT(amount: number): string {
  const formatted = new Intl.NumberFormat("en-BD").format(amount);
  return `৳ ${formatted}`;
}

export function formatDate(date: string): string {
  const d = new Date(date);
  const day = toBanglaNumber(d.getDate());
  const month = bnMonths[d.getMonth()];
  const year = toBanglaNumber(d.getFullYear());
  return `${day} ${month} ${year}`;
}

export function formatPhone(phone: string | null | undefined): string {
  if (!phone) return "";
  const cleaned = phone.replace(/\D/g, "");
  const local = cleaned.startsWith("880") ? cleaned.slice(3) : cleaned;
  if (local.length !== 11) return phone;
  return `+880 ${local.slice(0, 2)} ${local.slice(2, 3)}${local.slice(3, 5)}-${local.slice(5)}`;
}

export function toWhatsAppLink(phone: string, message?: string): string {
  const cleaned = phone.replace(/\D/g, "");
  const full = cleaned.startsWith("880") ? cleaned : `88${cleaned}`;
  const text = message
    ? `?text=${encodeURIComponent(message)}`
    : "";
  return `https://wa.me/${full}${text}`;
}

export function isFutureDate(date: string): boolean {
  return new Date(date) > new Date();
}
