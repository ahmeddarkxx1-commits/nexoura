export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(price);
}

export function buildWhatsAppLink(message: string): string {
  const phone = "201152628515"; // Updated to real number
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function buildProjectWhatsApp(
  projectTitle: string,
  price: number,
  upsells: string[],
  refCode?: string | null
): string {
  const lines = [
    `Hi Nexoura! I'm interested in purchasing:`,
    ``,
    `📦 Template: ${projectTitle}`,
    `💰 Base Price: $${price}`,
    ...(upsells.length > 0 ? [`➕ Add-ons: ${upsells.join(", ")}`] : []),
    ...(refCode ? [``, `🔗 Ref: ${refCode}`] : []),
    ``,
    `Please send me payment details. Thank you!`,
  ];
  return buildWhatsAppLink(lines.join("\n"));
}
