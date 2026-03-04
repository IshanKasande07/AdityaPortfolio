"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ContactDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

/**
 * ContactDrawer
 *
 * A glassmorphism right-edge drawer containing the contact form.
 * Slides in from the right with staggered field entrance.
 * Closeable via ✕ button or Escape key.
 */
export default function ContactDrawer({ isOpen, onClose }: ContactDrawerProps) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [company, setCompany] = useState("");
    const [number, setNumber] = useState("");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFocusedField, setIsFocusedField] = useState<string | null>(null);

    // ── Escape key handler ──────────────────────────────────────────────────
    const handleEscape = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        },
        [onClose]
    );

    useEffect(() => {
        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden"; // prevent background scroll
        }
        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "";
        };
    }, [isOpen, handleEscape]);

    // ── Form submit ─────────────────────────────────────────────────────────
    const sendData = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;

        if (!name || !email || !company || !number || !message) {
            alert("Please fill all the fields.");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch(
                "https://monarchmediahousebackend.netlify.app/.netlify/functions/server/contactData",
                {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({
                        name,
                        email,
                        companyName: company,
                        number,
                        message,
                    }),
                }
            );

            if (response.status === 200) {
                alert("Sent successfully!");
                setName("");
                setEmail("");
                setNumber("");
                setCompany("");
                setMessage("");
                onClose();
            } else {
                alert("Backend Error. Please try again later.");
            }
        } catch (err) {
            console.error(err);
            alert("An error occurred. Please try again.");
        }

        setIsSubmitting(false);
    };

    // ── Field data for stagger ──────────────────────────────────────────────
    const fields = [
        { key: "name", label: "Name", type: "text", value: name, setter: setName, placeholder: "John Doe" },
        { key: "email", label: "Email", type: "email", value: email, setter: setEmail, placeholder: "john@company.com" },
        { key: "company", label: "Company", type: "text", value: company, setter: setCompany, placeholder: "Acme Corp" },
        { key: "phone", label: "Phone", type: "tel", value: number, setter: setNumber, placeholder: "+1 (555) 000-0000" },
    ];

    // ── Animations ──────────────────────────────────────────────────────────
    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 },
    };

    const panelVariants = {
        hidden: { x: "100%" },
        visible: {
            x: 0,
            transition: {
                type: "spring" as const,
                damping: 30,
                stiffness: 300,
                mass: 0.8,
                delayChildren: 0.1,
                staggerChildren: 0.06,
            },
        },
        exit: {
            x: "100%",
            transition: { duration: 0.4, ease: [0.4, 0, 1, 1] as const },
        },
    };

    const fieldVariants = {
        hidden: { opacity: 0, x: 40 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
        exit: { opacity: 0, x: 20, transition: { duration: 0.15 } },
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* ── Backdrop ────────────────────────────────────────── */}
                    <motion.div
                        key="drawer-backdrop"
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.35 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[10000]"
                    />

                    {/* ── Panel ───────────────────────────────────────────── */}
                    <motion.div
                        key="drawer-panel"
                        variants={panelVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="fixed right-0 top-0 h-full w-[min(500px,90vw)] z-[10001]
                            bg-surface/95 backdrop-blur-xl border-l border-white/10
                            flex flex-col overflow-y-auto"
                        style={{ willChange: "transform", transform: "translate3d(0,0,0)" }}
                    >
                        {/* ── Header ─────────────────────────────────────── */}
                        <div className="flex items-center justify-between px-8 pt-8 pb-4">
                            <motion.h2
                                variants={fieldVariants}
                                className="text-2xl md:text-3xl font-display font-semibold text-primary leading-tight"
                            >
                                Let's Talk.
                            </motion.h2>
                            <motion.button
                                variants={fieldVariants}
                                onClick={onClose}
                                className="w-10 h-10 flex items-center justify-center rounded-full border border-white/20 text-muted hover:text-primary hover:border-accent transition-colors duration-200"
                                aria-label="Close drawer"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                            </motion.button>
                        </div>

                        <motion.p variants={fieldVariants} className="px-8 text-sm text-muted mb-8">
                            Ready to build authority through education? Fill out the form below.
                        </motion.p>

                        {/* ── Form ───────────────────────────────────────── */}
                        <form onSubmit={sendData} className="flex flex-col gap-6 px-8 pb-10 flex-1">
                            {/* Grid fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {fields.map((f) => (
                                    <motion.div key={f.key} variants={fieldVariants} className="flex flex-col gap-1.5">
                                        <label className="text-xs font-mono uppercase tracking-widest text-muted">
                                            {f.label}
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={f.type}
                                                value={f.value}
                                                onChange={(e) => f.setter(e.target.value)}
                                                onFocus={() => setIsFocusedField(f.key)}
                                                onBlur={() => setIsFocusedField(null)}
                                                placeholder={f.placeholder}
                                                className="w-full bg-transparent text-primary px-0 py-2.5 border-b border-white/15 focus:outline-none placeholder-white/10 text-sm transition-colors"
                                            />
                                            {/* Expanding accent underline */}
                                            <motion.div
                                                initial={false}
                                                animate={{ scaleX: isFocusedField === f.key ? 1 : 0 }}
                                                transition={{ duration: 0.3, ease: "circOut" }}
                                                className="absolute bottom-0 left-0 w-full h-[2px] bg-accent origin-center"
                                            />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Message textarea */}
                            <motion.div variants={fieldVariants} className="flex flex-col gap-1.5">
                                <label className="text-xs font-mono uppercase tracking-widest text-muted">
                                    Project Brief
                                </label>
                                <div className="relative">
                                    <textarea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        onFocus={() => setIsFocusedField("message")}
                                        onBlur={() => setIsFocusedField(null)}
                                        placeholder="Tell us about your brand, audience and content goals..."
                                        className="w-full bg-transparent text-primary px-0 py-2.5 border-b border-white/15 focus:outline-none min-h-[100px] resize-none placeholder-white/10 text-sm transition-colors"
                                    />
                                    <motion.div
                                        initial={false}
                                        animate={{ scaleX: isFocusedField === "message" ? 1 : 0 }}
                                        transition={{ duration: 0.3, ease: "circOut" }}
                                        className="absolute bottom-0 left-0 w-full h-[2px] bg-accent origin-center"
                                    />
                                </div>
                            </motion.div>

                            {/* Submit */}
                            <motion.div variants={fieldVariants} className="mt-auto pt-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="group relative w-full overflow-hidden rounded-full py-4 px-8 border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {/* Hover fill */}
                                    <div className="absolute inset-0 bg-accent translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] rounded-full" />
                                    <div className="relative z-10 flex items-center justify-center text-sm font-medium text-white group-hover:text-black transition-colors duration-300">
                                        {isSubmitting ? "Submitting..." : "Send Message"}
                                        <span className="ml-2 flex items-center transition-transform duration-500 group-hover:translate-x-2">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <line x1="5" y1="12" x2="19" y2="12" />
                                                <polyline points="12 5 19 12 12 19" />
                                            </svg>
                                        </span>
                                    </div>
                                </button>
                                <p className="text-xs text-muted font-mono tracking-wide text-center mt-4">
                                    We reply within 48 hours.
                                </p>
                            </motion.div>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
