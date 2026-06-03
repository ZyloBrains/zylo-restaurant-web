import type { CheckoutPayload } from "./checkout.types";
import type { PaymentMethod } from "@/features/payment/payment.types";

function paymentLabel(method: PaymentMethod): string {
  switch (method) {
    case "cash":
      return "Cash on Delivery";
    case "esewa":
      return "eSewa Wallet";
    case "khalti":
      return "Khalti Wallet";
  }
}

export function buildWhatsAppOrderMessage(payload: CheckoutPayload): string {
  const {
    customerName,
    customerPhone,
    customerAddress,
    customerNotes,
    paymentMethod,
    items,
    subtotal,
    restaurantName,
  } = payload;

  const lines: string[] = [
    `🍽 *${restaurantName}*`,
    `Hello, I would like to place an order.`,
    "",
    `👤 *Customer Details*`,
    `Name: ${customerName}`,
    `Phone: ${customerPhone}`,
    `Address: ${customerAddress || "-"}`,
    "",
    `🧾 *Order Items*`,
    ...items.map(
      (item) =>
        `• ${item.name} × ${item.quantity} = NPR ${item.price * item.quantity}`
    ),
    "",
    `📝 Notes: ${customerNotes || "-"}`,
    `💳 Payment: ${paymentLabel(paymentMethod)}`,
    "",
    `💰 *Total: NPR ${subtotal}*`,
  ];

  return lines.join("\n");
}

export function buildWhatsAppLink(phone: string, message: string): string {
  const cleanPhone = phone.replace(/\D/g, "");
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
