import type { CheckoutPayload } from "./checkout.types";

export function buildWhatsAppOrderMessage(payload: CheckoutPayload): string {
    const {
        customer,
        items,
        pricing,
        restaurantName,
    } = payload;

    const lines: string[] = [
        `Hello ${restaurantName}, I would like to place an order.`,
        "",
        `Name: ${customer.name}`,
        `Phone: ${customer.phone}`,
        `Address: ${customer.address || "-"}`,
        "",
        "Items:",
        ...items.map(
            (item) =>
                `- ${item.name} x ${item.quantity} = NPR ${
                    item.price * item.quantity
                }`
        ),
        "",
        `Notes: ${customer.notes || "-"}`,
        `Payment: COD`,
        `Total: NPR ${pricing.subtotal}`,
    ];

    return lines.join("\n");
}

export function buildWhatsAppLink(phone: string, message: string): string {
    const cleanPhone = phone.replace(/\D/g, ""); // remove spaces, dashes
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}