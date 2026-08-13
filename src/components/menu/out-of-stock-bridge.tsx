export function OutOfStockBridge() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
      <span className="rounded-full border border-white/25 bg-red-600 px-5 py-2 text-xs font-bold uppercase tracking-[0.25em] text-white shadow-[0_4px_16px_-2px_rgba(0,0,0,0.45)]">
        Out of Stock
      </span>
    </div>
  );
}
