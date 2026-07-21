"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Check, Shield, Flame, Star, Zap, Cpu, Terminal } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UpgradePage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showSimulatedModal, setShowSimulatedModal] = useState(false);
  const [simulatedSubId, setSimulatedSubId] = useState("");

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleUpgrade = async () => {
    setLoading(true);
    if (typeof window !== "undefined" && (window as any).posthog) {
      (window as any).posthog.capture("upgrade_clicked", {
        source: "upgrade_page"
      });
    }
    try {
      const res = await fetch("/api/payment/create-subscription", {
        method: "POST"
      });
      const data = await res.json();

      if (data.error) {
        alert(`Payment error: ${data.error}`);
        setLoading(false);
        return;
      }

      if (data.simulated) {
        setSimulatedSubId(data.subscriptionId);
        setShowSimulatedModal(true);
        setLoading(false);
        return;
      }

      // Real checkout
      const loaded = await loadRazorpay();
      if (!loaded) {
        alert("Failed to load Razorpay SDK.");
        setLoading(false);
        return;
      }

      const options = {
        key: data.key,
        subscription_id: data.subscriptionId,
        name: "CodeQuest AI",
        description: "Monthly Pro Access",
        handler: async function (response: any) {
          // Success
          if (typeof window !== "undefined" && (window as any).posthog) {
            (window as any).posthog.capture("payment_completed", {
              subscriptionId: data.subscriptionId,
              paymentId: response.razorpay_payment_id,
              simulated: false
            });
          }
          router.push("/dashboard/city?upgrade=success");
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || ""
        },
        theme: {
          color: "#7F77DD"
        }
      };

      const rzp = (window as any).Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error(err);
      alert("Upgrade system failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSimulatedSuccess = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch("/api/payment/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          simulated: true,
          userId: user.id,
          event: "subscription.activated",
          subscription: {
            id: simulatedSubId
          }
        })
      });
      if (res.ok) {
        if (typeof window !== "undefined" && (window as any).posthog) {
          (window as any).posthog.capture("payment_completed", {
            subscriptionId: simulatedSubId,
            simulated: true
          });
        }
        setShowSimulatedModal(false);
        router.push("/dashboard/city?upgrade=success");
      } else {
        alert("Simulated upgrade failed.");
      }
    } catch (err) {
      alert("Simulation error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      {/* Simulation Modal */}
      {showSimulatedModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-[var(--color-surface)] border border-[var(--color-primary)] rounded-2xl p-8 max-w-md w-full shadow-[0_0_50px_rgba(127,119,221,0.3)]">
            <h3 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2 mb-4">
              <Terminal className="text-[var(--color-primary)]" /> Razorpay Sandbox
            </h3>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              No Razorpay API keys were found in the server config. We've initialized a simulated sandbox session for subscription ID: <span className="font-mono text-[var(--color-primary)]">{simulatedSubId}</span>.
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleSimulatedSuccess}
                disabled={loading}
                className="flex-1 py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/80 text-white font-bold rounded transition-colors"
              >
                {loading ? "PROCESSING..." : "SIMULATE SUCCESS"}
              </button>
              <button
                onClick={() => setShowSimulatedModal(false)}
                className="flex-1 py-3 bg-transparent border border-[#2A2A35] hover:bg-[#2A2A35]/30 text-gray-400 rounded transition-colors"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-10 mt-4">
        <div className="heading-tag mb-3">
          // NEURAL_NETWORK_CLEARANCE
        </div>
        <h1 className="city-heading text-4xl md:text-5xl" data-text="UPGRADE CLEARANCE">
          UPGRADE CLEARANCE
          <span className="heading-badge ml-4" style={{ color: "#FAC775", borderColor: "rgba(250, 199, 117, 0.35)", background: "rgba(250, 199, 117, 0.12)" }}>PRO_REQUIRED</span>
        </h1>
        <p
          className="text-sm mt-4 border-l-2 pl-3 max-w-xl"
          style={{ borderColor: "#7F77DD", color: "#6B6A72" }}
        >
          Free nodes are restricted in their network processing capacities. Bypass firewalls and unlock the full grid.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        {/* FREE PLAN */}
        <div className="border border-[#2A2A35] bg-[var(--color-surface)]/50 rounded-2xl p-8 flex flex-col justify-between relative opacity-85">
          <div>
            <div className="text-xs font-bold text-gray-500 uppercase mb-4 tracking-wider">Default Clearance</div>
            <h3 className="text-3xl font-black text-white uppercase mb-2">Grid Rookie</h3>
            <p className="text-xs text-gray-400 mb-6">Standard processing bounds.</p>
            <div className="text-4xl font-black text-white mb-8">₹0 <span className="text-sm font-normal text-gray-500">/ forever</span></div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start text-sm text-gray-400">
                <Check className="w-4 h-4 text-green-500 mr-3 mt-0.5 shrink-0" />
                Access to Chapter 1-3
              </li>
              <li className="flex items-start text-sm text-gray-400">
                <Check className="w-4 h-4 text-green-500 mr-3 mt-0.5 shrink-0" />
                Main + Side Missions only
              </li>
              <li className="flex items-start text-sm text-gray-400">
                <Check className="w-4 h-4 text-green-500 mr-3 mt-0.5 shrink-0" />
                3 sandbox run attempts per day
              </li>
              <li className="flex items-start text-sm text-gray-500 line-through">
                Boss Missions Locked
              </li>
              <li className="flex items-start text-sm text-gray-500 line-through">
                AI Tech Mentor Mode
              </li>
            </ul>
          </div>
          <div className="w-full text-center py-3 bg-[#2A2A35]/30 text-gray-500 rounded font-semibold text-sm cursor-not-allowed">
            ACTIVE ACCESS
          </div>
        </div>

        {/* PRO PLAN */}
        <div className="border-2 border-[var(--color-primary)] bg-[var(--color-surface)] rounded-2xl p-8 flex flex-col justify-between relative shadow-[0_0_30px_rgba(127,119,221,0.2)]">
          <div className="absolute top-0 right-8 -translate-y-1/2 bg-[var(--color-primary)] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded flex items-center gap-1 shadow-lg">
            <Star className="w-3 h-3 fill-white" /> Recommended
          </div>
          <div>
            <div className="text-xs font-bold text-[var(--color-primary)] uppercase mb-4 tracking-wider">Ultimate clearance</div>
            <h3 className="text-3xl font-black text-white uppercase mb-2">Neural Fixed Pro</h3>
            <p className="text-xs text-gray-400 mb-6">Unlimited throughput & ultimate guidance.</p>
            <div className="text-4xl font-black text-white mb-8">₹499 <span className="text-sm font-normal text-gray-500">/ month</span></div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start text-sm text-white">
                <Check className="w-4 h-4 text-[var(--color-primary)] mr-3 mt-0.5 shrink-0" />
                Unlock Chapters 4 & 5
              </li>
              <li className="flex items-start text-sm text-white">
                <Check className="w-4 h-4 text-[var(--color-primary)] mr-3 mt-0.5 shrink-0" />
                All Boss & Elite Boss Missions
              </li>
              <li className="flex items-start text-sm text-white">
                <Check className="w-4 h-4 text-[var(--color-primary)] mr-3 mt-0.5 shrink-0" />
                Unlimited compiler executions
              </li>
              <li className="flex items-start text-sm text-white">
                <Check className="w-4 h-4 text-[var(--color-primary)] mr-3 mt-0.5 shrink-0" />
                AI Mentor Mode (exclusive hints)
              </li>
              <li className="flex items-start text-sm text-white">
                <Check className="w-4 h-4 text-[var(--color-primary)] mr-3 mt-0.5 shrink-0" />
                "Inner Circle" Golden profile badge
              </li>
            </ul>
          </div>
          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="w-full flex items-center justify-center py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/80 text-white font-bold rounded transition-all shadow-[0_0_15px_rgba(127,119,221,0.3)] hover:shadow-[0_0_25px_rgba(127,119,221,0.5)] disabled:opacity-50"
          >
            {loading ? "CONNECTING CLEARANCE..." : "UPGRADE INSTANTLY"}
          </button>
        </div>
      </div>
    </div>
  );
}
