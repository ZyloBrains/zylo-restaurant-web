import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CartProvider, useCart } from "@/features/cart/cart-context";

function Probe() {
  const { addItem, increaseQty, decreaseQty, getItemQty } = useCart();
  const qty = getItemQty("3");
  return (
    <div>
      <span data-testid="qty">{qty}</span>
      <button onClick={() => addItem({ menuItemId: "3", itemId: 3, name: "X", price: 10, imageUrl: "" })}>add</button>
      <button onClick={() => increaseQty("3")}>inc</button>
      <button onClick={() => decreaseQty("3")}>dec</button>
    </div>
  );
}

describe("cart getItemQty reactivity", () => {
  it("updates qty when increase/decrease is called", () => {
    render(
      <CartProvider slug="test">
        <Probe />
      </CartProvider>
    );

    expect(screen.getByTestId("qty").textContent).toBe("0");

    fireEvent.click(screen.getByText("add"));
    expect(screen.getByTestId("qty").textContent).toBe("1");

    fireEvent.click(screen.getByText("inc"));
    expect(screen.getByTestId("qty").textContent).toBe("2");

    fireEvent.click(screen.getByText("dec"));
    expect(screen.getByTestId("qty").textContent).toBe("1");
  });
});
