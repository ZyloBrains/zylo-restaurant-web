"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import {
  X,
  CheckCircle2,
  Wallet,
  DollarSign,
  Loader2,
  ExternalLink,
  Info,
  ArrowLeft,
} from "lucide-react";
import { useCart } from "@/features/cart/cart-context";
import { useAuthStore } from "@/features/auth/auth.store";
import { LoginModal } from "@/components/auth/login-modal";
import type { CheckoutFormData } from "@/features/checkout/checkout.types";
import type { PaymentMethod } from "@/features/payment/payment.types";
import {
  buildWhatsAppLink,
  buildWhatsAppOrderMessage,
} from "@/features/checkout/whatsapp-preview";
import { paymentService } from "@/services/payment.service";
import { orderService } from "@/services/order.service";
import { notificationService } from "@/services/notification.service";
import { useTenantStore } from "@/features/tenant/tenant.store";
import Link from "next/link";

type Props = {
  restaurantName: string;
  whatsappNumber: string;
  tenantSlug: string;
};

const initialForm: CheckoutFormData = {
  customerName: "",
  customerPhone: "",
  customerAddress: "",
  customerNotes: "",
  paymentMethod: "cash",
};

type Step = "details" | "confirm" | "processing" | "success";

const paymentOptions: {
  value: PaymentMethod;
  label: string;
  description: string;
  icon: typeof Wallet;
}[] = [
  {
    value: "cash",
    label: "Cash",
    description: "Pay when you receive",
    icon: DollarSign,
  },
  {
    value: "esewa",
    label: "eSewa",
    description: "Pay via eSewa wallet",
    icon: Wallet,
  },
  {
    value: "khalti",
    label: "Khalti",
    description: "Pay via Khalti wallet",
    icon: Wallet,
  },
];

export function CheckoutModal({ restaurantName, whatsappNumber, tenantSlug }: Props) {
  const { items, subtotal, clearCart, closeCart } = useCart();
  const slug=useTenantStore((s)=>s.tenantSlug) as string;
  const isLoggedIn = !!useAuthStore((s) => s.user);

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("details");
  const [form, setForm] = useState(initialForm);
  const [processing, setProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  const message = useMemo(
    () =>
      buildWhatsAppOrderMessage({
        ...form,
        items,
        subtotal,
        restaurantName,
        orderNumber,
      }),
    [form, items, subtotal, restaurantName, orderNumber]
  );

  const waLink = useMemo(
    () => buildWhatsAppLink(whatsappNumber, message),
    [whatsappNumber, message]
  );

  function updateField<K extends keyof CheckoutFormData>(
    key: K,
    value: CheckoutFormData[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handlePlaceOrder() {
    const currentUser = useAuthStore.getState().user;
    if (!currentUser) {
      setShowLogin(true);
      return;
    }

    setProcessing(true);
    setStep("processing");

    try {
      // 1. Create the order on backend
      setStatusText("Creating your order...");
      const order = await orderService.placeOrder(tenantSlug, currentUser.id, {
        customerName: form.customerName,
        customerPhone: form.customerPhone,
        customerAddress: form.customerAddress || "N/A",
        customerNote: form.customerNotes || undefined,
        paymentMethod: form.paymentMethod.toUpperCase(),
      });
      setOrderNumber(order.orderNumber);

      // 2. Process based on payment method
      if (form.paymentMethod === "cash") {
        await handleCashFlow(order.id, currentUser.id);
      } else if (form.paymentMethod === "esewa") {
        await handleEsewaFlow(order.id, currentUser.id);
      } else if (form.paymentMethod === "khalti") {
        await handleKhaltiFlow(order.id, currentUser.id);
      }

      // 3. Send notification to system users
      setStatusText("Sending notification...");
      try {
        await notificationService.sendOrderNotification({
          tenantSlug,
          orderId: order.orderNumber,
          customerName: form.customerName,
          customerPhone: form.customerPhone,
          customerAddress: form.customerAddress,
          customerNotes: form.customerNotes,
          paymentMethod: form.paymentMethod,
          items: items.map((i) => ({
            name: i.name,
            quantity: i.quantity,
            price: i.price,
          })),
          totalAmount: subtotal,
          restaurantName,
        });
      } catch {
        // best-effort
      }

      setStep("success");
      setProcessing(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setStatusText(msg);
      // Stay on processing so user can see the error, then allow retry
      setTimeout(() => {
        setStep("details");
        setProcessing(false);
      }, 2000);
    }
  }

  async function handleCashFlow(orderId: number, _userId: number) {
    setStatusText("Registering cash payment...");
    const cashResult = await paymentService.initiateCash(tenantSlug, {
      amount: subtotal,
      orderId: String(orderId),
      userId: _userId,
      description: `Order from ${restaurantName}`,
    });

    setStatusText("Confirming payment...");
    await paymentService.confirmCash(tenantSlug, cashResult.transaction_uuid);
  }

  async function handleEsewaFlow(orderId: number, _userId: number) {
    setStatusText("Initiating eSewa payment...");
    const result = await paymentService.initiateEsewa(tenantSlug, {
      amount: subtotal,
      orderId: String(orderId),
      userId: _userId,
      description: `Order from ${restaurantName}`,
    });

    const formEl = document.createElement("form");
    formEl.method = "POST";
    formEl.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

    const fields: Record<string, string> = {
      amount: result.amount,
      tax_amount: result.tax_amount,
      total_amount: result.total_amount,
      transaction_uuid: result.transaction_uuid,
      product_code: result.product_code,
      product_service_charge: result.product_service_charge,
      product_delivery_charge: result.product_delivery_charge,
      success_url: result.success_url,
      failure_url: result.failure_url,
      signed_field_names: result.signed_field_names,
      signature: result.signature,
    };

    for (const [key, val] of Object.entries(fields)) {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
          input.value = val;
      formEl.appendChild(input);
    }

    document.body.appendChild(formEl);
    formEl.submit();
  }

  async function handleKhaltiFlow(orderId: number, _userId: number) {
    setStatusText("Initiating Khalti payment...");
    const result = await paymentService.initiateKhalti(tenantSlug, {
      amount: subtotal,
      orderId: String(orderId),
      userId: _userId,
      description: `Order from ${restaurantName}`,
    });

    window.open(result.payment_url, "_blank");

    setStatusText("Payment initiated! Complete in the new tab.");
    await new Promise((r) => setTimeout(r, 1500));
    setStep("success");
    setProcessing(false);
  }

  function handleDone() {
    if (form.paymentMethod === "cash") {
      window.open(waLink, "_blank");
    }
    clearCart();
    closeCart();
    setOpen(false);
    setStep("details");
    setForm(initialForm);
    setOrderNumber("");
  }

  const isValid =
    form.customerName.trim().length > 0 &&
    form.customerPhone.trim().length > 0;

  return (
    <>
      <button onClick={() => setOpen(true)} className="btn-primary  w-full">
        Place Order
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm md:items-center">
          <div className="flex max-h-[90dvh] w-full max-w-3xl flex-col rounded-t-3xl bg-[var(--color-card)] shadow-2xl md:rounded-3xl">
            {/* HEADER */}
            <div className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-4">
              <h2 className="text-lg font-semibold text-[var(--color-text)]">
                {step === "details" && "Checkout"}
                {step === "confirm" && "Confirm Order"}
                {step === "processing" && (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {statusText}
                  </span>
                )}
                {step === "success" && "Order Placed!"}
              </h2>
              <button
                onClick={() => {
                  setOpen(false);
                  setStep("details");
                  setForm(initialForm);
                  setOrderNumber("");
                }}
                className="rounded-lg border border-[var(--color-border)] p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
              >
                <X size={18} />
              </button>
            </div>

            {/* BODY */}
            <div className="flex-1 overflow-y-auto">
              {step === "processing" && (
                <div className="flex flex-col items-center justify-center gap-4 px-6 py-20">
                  <Loader2 className="h-10 w-10 animate-spin text-[var(--color-primary)]" />
                  <p className="text-sm text-[var(--color-text-muted)]">
                    {statusText}
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    Please do not close this window
                  </p>
                </div>
              )}

              {step === "success" && (
                <div className="flex flex-col items-center px-6 py-16 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950"
                  >
                    <CheckCircle2 className="h-8 w-8 text-emerald-500 dark:text-emerald-400" strokeWidth={2.5} />
                  </motion.div>
                  <h3 className="text-xl font-bold text-[var(--color-text)]">
                    Order Confirmed!
                  </h3>
                  {orderNumber && (
                    <p className="mt-1 text-xs font-medium text-[var(--color-primary)]">
                      {orderNumber}
                    </p>
                  )}
                  <p className="mt-2 max-w-sm text-sm text-[var(--color-text-muted)]">
                    {form.paymentMethod === "cash"
                      ? "Your order has been placed. We will contact you shortly."
                      : "Payment processed successfully. We will confirm your order shortly."}
                  </p>
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                    {form.paymentMethod === "cash" && (
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-primary inline-flex items-center gap-2"
                      >
                        <ExternalLink size={16} />
                        Send via WhatsApp
                      </a>
                    )}
                    <Link 
                    href={`/${slug}`}
                    className="btn-secondary">
                      Done
                    </Link>
                  </div>
                </div>
              )}

              {step === "confirm" && (
                <div className="grid md:grid-cols-2">
                  {/* LEFT - ORDER & CUSTOMER SUMMARY */}
                  <div className="space-y-5 p-6">
                    {/* CUSTOMER DETAILS */}
                    <div>
                      <h3 className="mb-1 text-sm font-semibold text-[var(--color-text)]">
                        Customer Details
                      </h3>
                      <div className="space-y-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-sm">
                        <div className="flex justify-between">
                          <span className="text-[var(--color-text-muted)]">Name</span>
                          <span className="font-medium text-[var(--color-text)]">{form.customerName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[var(--color-text-muted)]">Phone</span>
                          <span className="font-medium text-[var(--color-text)]">{form.customerPhone}</span>
                        </div>
                        {form.customerAddress && (
                          <div className="flex justify-between">
                            <span className="text-[var(--color-text-muted)]">Address</span>
                            <span className="font-medium text-[var(--color-text)]">{form.customerAddress}</span>
                          </div>
                        )}
                        {form.customerNotes && (
                          <div className="flex justify-between">
                            <span className="text-[var(--color-text-muted)]">Notes</span>
                            <span className="font-medium text-[var(--color-text)]">{form.customerNotes}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* PAYMENT METHOD */}
                    <div>
                      <h3 className="mb-1 text-sm font-semibold text-[var(--color-text)]">
                        Payment Method
                      </h3>
                      <div className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3">
                        {form.paymentMethod === "cash" ? (
                          <DollarSign className="h-5 w-5 text-emerald-500" />
                        ) : (
                          <Wallet className="h-5 w-5 text-[var(--color-primary)]" />
                        )}
                        <div>
                          <p className="text-sm font-medium text-[var(--color-text)]">
                            {paymentOptions.find((o) => o.value === form.paymentMethod)?.label}
                          </p>
                          <p className="text-xs text-[var(--color-text-muted)]">
                            {paymentOptions.find((o) => o.value === form.paymentMethod)?.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* WALLET TEST CREDENTIALS */}
                    {form.paymentMethod === "esewa" && (
                      <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/50 p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Info size={14} className="text-amber-600 dark:text-amber-400" />
                          <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">
                            eSewa Test Credentials
                          </span>
                        </div>
                        <ul className="space-y-1 text-xs text-amber-600 dark:text-amber-400">
                          <li>Merchant: <strong>merchant@esewa.com.np</strong></li>
                          <li>OTP: <strong>123456</strong></li>
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* RIGHT - ORDER SUMMARY */}
                  <div className="border-t border-[var(--color-border)] bg-[var(--color-surface)] p-6 md:border-l md:border-t-0">
                    <h3 className="mb-1 text-sm font-semibold text-[var(--color-text)]">
                      Order Summary
                    </h3>
                    <p className="mb-4 text-xs text-[var(--color-text-muted)]">
                      {items.length} item{items.length !== 1 ? "s" : ""}
                    </p>

                    <div className="space-y-3">
                      {items.map((item) => (
                        <div
                          key={item.menuItemId}
                          className="flex items-center justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2.5"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-[var(--color-text)]">
                              {item.name}
                            </p>
                            <p className="text-xs text-[var(--color-text-muted)]">
                              Qty: {item.quantity}
                            </p>
                          </div>
                          <span className="ml-3 text-sm font-semibold text-[var(--color-primary)]">
                            NPR {item.price * item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>

                    <hr className="my-4 border-[var(--color-border)]" />

                    <div className="space-y-1.5 text-sm">
                      <div className="flex justify-between text-[var(--color-text-muted)]">
                        <span>Subtotal</span>
                        <span>NPR {subtotal}</span>
                      </div>
                      <div className="flex justify-between text-[var(--color-text-muted)]">
                        <span>Delivery</span>
                        <span>Free</span>
                      </div>
                    </div>

                    <hr className="my-4 border-[var(--color-border)]" />

                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[var(--color-text)]">Total</span>
                      <span className="text-lg font-bold text-[var(--color-primary)]">
                        NPR {subtotal}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              {step === "details" && (
                <div className="grid md:grid-cols-2">
                  {/* LEFT - FORM */}
                  <div className="space-y-5 p-6">
                    {/* CUSTOMER DETAILS */}
                    <div>
                      <h3 className="mb-1 text-sm font-semibold text-[var(--color-text)]">
                        Customer Details
                      </h3>
                      <p className="mb-4 text-xs text-[var(--color-text-muted)]">
                        Fill in your contact information
                      </p>

                      <div className="space-y-3">
                        <input
                          className="input-base"
                          placeholder="Your Name *"
                          value={form.customerName}
                          onChange={(e) =>
                            updateField("customerName", e.target.value)
                          }
                        />
                        <input
                          className="input-base"
                          placeholder="Phone Number *"
                          type="tel"
                          value={form.customerPhone}
                          onChange={(e) =>
                            updateField("customerPhone", e.target.value)
                          }
                        />
                        <input
                          className="input-base"
                          placeholder="Delivery Address"
                          value={form.customerAddress}
                          onChange={(e) =>
                            updateField("customerAddress", e.target.value)
                          }
                        />
                        <textarea
                          className="input-base"
                          placeholder="Special notes / instructions"
                          rows={3}
                          value={form.customerNotes}
                          onChange={(e) =>
                            updateField("customerNotes", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    {/* PAYMENT METHOD */}
                    <div>
                      <h3 className="mb-1 text-sm font-semibold text-[var(--color-text)]">
                        Payment Method
                      </h3>
                      <p className="mb-3 text-xs text-[var(--color-text-muted)]">
                        Choose how you want to pay
                      </p>

                      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                        {paymentOptions.map((opt) => {
                          const selected = form.paymentMethod === opt.value;
                          const Icon = opt.icon;
                          return (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => updateField("paymentMethod", opt.value)}
                              className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition sm:flex-col sm:items-center sm:text-center ${
                                selected
                                  ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5"
                                  : "border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-text-muted)]"
                              }`}
                            >
                              <Icon
                                className={`h-5 w-5 ${
                                  selected
                                    ? "text-[var(--color-primary)]"
                                    : "text-[var(--color-text-muted)]"
                                }`}
                              />
                              <div>
                                <p
                                  className={`text-sm font-semibold ${
                                    selected
                                      ? "text-[var(--color-primary)]"
                                      : "text-[var(--color-text)]"
                                  }`}
                                >
                                  {opt.label}
                                </p>
                                <p className="text-xs text-[var(--color-text-muted)]">
                                  {opt.description}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {form.paymentMethod !== "cash" && (
                        <p className="mt-3 flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
                          <ExternalLink size={12} />
                          You will be redirected to complete the payment.
                        </p>
                      )}

                      {form.paymentMethod === "esewa" && (
                        <div className="mt-4 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/50 p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Info size={14} className="text-amber-600 dark:text-amber-400" />
                            <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">
                              eSewa Test Mode
                            </span>
                          </div>
                          <ul className="space-y-1 text-xs text-amber-600 dark:text-amber-400">
                            <li>Merchant: <strong>merchant@esewa.com.np</strong></li>
                            <li>OTP: <strong>123456</strong></li>
                            <li>Environment: Test (rc.esewa.com.np)</li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* RIGHT - ORDER SUMMARY */}
                  <div className="border-t border-[var(--color-border)] bg-[var(--color-surface)] p-6 md:border-l md:border-t-0">
                    <h3 className="mb-1 text-sm font-semibold text-[var(--color-text)]">
                      Order Summary
                    </h3>
                    <p className="mb-4 text-xs text-[var(--color-text-muted)]">
                      {items.length} item{items.length !== 1 ? "s" : ""} in your order
                    </p>

                    <div className="space-y-3">
                      {items.map((item) => (
                        <div
                          key={item.menuItemId}
                          className="flex items-center justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2.5"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-[var(--color-text)]">
                              {item.name}
                            </p>
                            <p className="text-xs text-[var(--color-text-muted)]">
                              Qty: {item.quantity}
                            </p>
                          </div>
                          <span className="ml-3 text-sm font-semibold text-[var(--color-primary)]">
                            NPR {item.price * item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>

                    <hr className="my-4 border-[var(--color-border)]" />

                    <div className="space-y-1.5 text-sm">
                      <div className="flex justify-between text-[var(--color-text-muted)]">
                        <span>Subtotal</span>
                        <span>NPR {subtotal}</span>
                      </div>
                      <div className="flex justify-between text-[var(--color-text-muted)]">
                        <span>Delivery</span>
                        <span>Free</span>
                      </div>
                    </div>

                    <hr className="my-4 border-[var(--color-border)]" />

                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[var(--color-text)]">Total</span>
                      <span className="text-lg font-bold text-[var(--color-primary)]">
                        NPR {subtotal}
                      </span>
                    </div>

                    {form.paymentMethod === "esewa" && (
                      <div className="mt-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 p-3 text-xs text-amber-700 dark:text-amber-300">
                        <p className="font-medium mb-1">Test Credentials</p>
                        <p>Use test OTP <strong>123456</strong> to complete payment</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* FOOTER ACTION */}
            {step === "details" && (
              <div className="border-t border-[var(--color-border)] px-6 py-4">
                <button
                  onClick={() => {
                    if (!isLoggedIn) {
                      setShowLogin(true);
                      return;
                    }
                    setStep("confirm");
                  }}
                  disabled={!isValid}
                  className="btn-primary w-full disabled:opacity-50"
                >
                  {!isLoggedIn ? (
                    <span className="flex items-center justify-center gap-2">
                      <ArrowLeft size={16} />
                      Login to Place Order
                    </span>
                  ) : (
                    `Continue – NPR ${subtotal}`
                  )}
                </button>
                {!isValid && (
                  <p className="mt-1.5 text-center text-xs text-red-500">
                    Name and phone number are required
                  </p>
                )}
              </div>
            )}

            {step === "confirm" && (
              <div className="flex items-center justify-between gap-3 border-t border-[var(--color-border)] px-6 py-4">
                <button
                  onClick={() => setStep("details")}
                  className="btn-secondary flex items-center gap-2 px-5"
                >
                  <ArrowLeft size={16} />
                  Back
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={processing}
                  className="btn-primary flex-1 disabled:opacity-50"
                >
                  {processing ? (
                    <span className="inline-flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    `Confirm & Place Order – NPR ${subtotal}`
                  )}
                </button>
              </div>
            )}

            {/* LOGIN MODAL */}
            {showLogin && (
              <LoginModal
                onClose={() => setShowLogin(false)}
                onSuccess={() => {
                  setShowLogin(false);
                  handlePlaceOrder();
                }}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
