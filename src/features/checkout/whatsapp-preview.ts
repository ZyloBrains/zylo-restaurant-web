import type { CheckoutPayload } from "./checkout.types";

export function buildWhatsAppOrderMessage(payload: CheckoutPayload): string {
    const lines: string[] = [
        `Hello ${payload.restaurantName}, I would like to place an order.`,
        "",
        `Name: ${payload.customerName}`,
        `Phone: ${payload.customerPhone}`,
        `Address: ${payload.customerAddress || "-"}`,
        "",
        "Items:",
        ...payload.items.map(
            (item) => `- ${item.name} x ${item.quantity} = NPR ${item.price * item.quantity}`
        ),
        "",
        `Notes: ${payload.customerNotes || "-"}`,
        `Payment: COD`,
        `Total: NPR ${payload.subtotal}`,
    ];

    return lines.join("\n");
}

export function buildWhatsAppLink(phone: string, message: string): string {
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}