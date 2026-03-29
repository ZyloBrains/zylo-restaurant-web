import type { CheckoutPayload } from "./checkout.types";

export function buildWhatsAppOrderMessage(payload: CheckoutPayload): string {
    const {
        customerName,
        customerPhone,
        customerAddress,
        customerNotes,
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
            (item) => `• ${item.name} × ${item.quantity} = NPR ${item.price * item.quantity}`
        ),
        "",
        `📝 Notes: ${customerNotes || "-"}`,
        `💳 Payment: Cash on Delivery`,
        "",
        `💰 *Total: NPR ${subtotal}*`,
    ];

    return lines.join("\n");
}

export function buildWhatsAppLink(phone: string, message: string): string {
    const cleanPhone = phone.replace(/\D/g, "");
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}