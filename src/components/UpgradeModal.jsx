import { useState } from "react";
import api, { getErrorMessage } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { IconClose, IconCrown, IconLoader } from "./Icons";

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

const PERKS = [
  "Unlimited AI subtask generation",
  "Priority real-time sync across devices",
  "File attachments up to higher limits",
  "Early access to new workspace features",
];

export default function UpgradeModal({ onClose }) {
  const { user, refreshUser } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const scriptOk = await loadRazorpayScript();
      if (!scriptOk) {
        toast.error("Couldn't load payment gateway. Check your connection.");
        setLoading(false);
        return;
      }

      const { data: order } = await api.post("/payment/create-order");

      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "CollabDesk",
        description: "Premium plan upgrade",
        order_id: order.id,
        prefill: { name: user?.name, email: user?.email },
        theme: { color: "#f2a93b" },
        handler: async (response) => {
          try {
            await api.post("/payment/verify-payment", response);
            await refreshUser();
            toast.success("You're on Premium now. Welcome up top.");
            onClose();
          } catch (err) {
            toast.error(getErrorMessage(err, "Payment verification failed"));
          }
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      });

      rzp.on("payment.failed", () => {
        toast.error("Payment failed. Please try again.");
        setLoading(false);
      });

      rzp.open();
      setLoading(false);
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't start checkout"));
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md animate-fade-in-up rounded-2xl border border-border bg-surface shadow-2xl">
        <div className="flex items-start justify-between p-5 border-b border-border-soft">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber/15 text-amber">
              <IconCrown />
            </span>
            <div>
              <h2 className="font-display font-semibold text-text">Go Premium</h2>
              <p className="text-xs text-text-muted">One-time upgrade for this account</p>
            </div>
          </div>
          <button onClick={onClose} className="text-text-muted hover:text-text">
            <IconClose />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex items-baseline gap-1">
            <span className="font-display text-3xl font-bold text-text">₹499</span>
            <span className="text-sm text-text-muted">/ lifetime</span>
          </div>

          <ul className="space-y-2">
            {PERKS.map((perk) => (
              <li key={perk} className="flex items-start gap-2 text-sm text-text-muted">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber" />
                {perk}
              </li>
            ))}
          </ul>

          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-amber py-2.5 font-display font-semibold text-bg transition hover:bg-amber-dim disabled:opacity-60"
          >
            {loading ? <IconLoader /> : <IconCrown />}
            {loading ? "Opening checkout…" : "Pay & upgrade"}
          </button>
          <p className="text-center text-xs text-text-faint">Secured by Razorpay</p>
        </div>
      </div>
    </div>
  );
}
