type MobileBottomBarProps = {
    phone: string;
    whatsappNumber: string;
};

export function MobileBottomBar({
                                    phone,
                                    whatsappNumber,
                                }: MobileBottomBarProps) {
    return (
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 p-3 backdrop-blur md:hidden">
            <div className="grid grid-cols-3 gap-2">
                <a
                    href={`tel:${phone}`}
                    className="rounded-[var(--radius-button)] border border-slate-300 px-3 py-3 text-center text-sm font-semibold"
                >
                    Call
                </a>
                <a
                    href={`https://wa.me/${whatsappNumber}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-[var(--radius-button)] border border-[var(--color-primary)] px-3 py-3 text-center text-sm font-semibold text-[var(--color-primary)]"
                >
                    WhatsApp
                </a>
                <a
                    href="#menu"
                    className="rounded-[var(--radius-button)] bg-[var(--color-primary)] px-3 py-3 text-center text-sm font-semibold text-white"
                >
                    Menu
                </a>
            </div>
        </div>
    );
}