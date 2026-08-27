"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

interface BrutalistInputProps {
    label: string;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    placeholder: string;
    isTextArea?: boolean;
    onDark?: boolean;
}

const BrutalistInput = ({ label, type = "text", value, onChange, placeholder, isTextArea = false, onDark = false }: BrutalistInputProps) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isValidated, setIsValidated] = useState(false);

    const isValid = (() => {
        const val = value || "";
        if (!val.trim()) return false;
        if (type === "email") return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
        if (type === "tel") return val.replace(/\D/g, '').length >= 5;
        return true;
    })();

    const handleBlur = () => {
        setIsFocused(false);
        setIsValidated(true);
    };

    const handleFocus = () => {
        setIsFocused(true);
    };

    const showCheck = isValidated && isValid;

    const labelClass = onDark
        ? "text-mist/70 group-hover:text-background"
        : "text-muted group-hover:text-primary";
    const fieldClass = onDark
        ? "text-background border-background/25 placeholder-background/40"
        : "text-primary border-primary/20 placeholder-primary/30";
    // Focus underline and the valid tick both need to be the ground's own
    // accent: clay on light (4.0:1 as a 2px rule, fine), saffron on dark
    // (7.5:1 on forest, 3.5:1 on rust as a large graphic).
    const markClass = onDark ? "bg-saffron" : "bg-clay";
    const checkClass = onDark ? "text-saffron" : "text-clay-deep";

    return (
        <div className='flex flex-col gap-2 w-full group'>
            <p className={`text-xs font-mono uppercase tracking-widest transition-colors ${labelClass}`}>{label}</p>
            <div className="relative w-full">
                {isTextArea ? (
                    <textarea
                        value={value}
                        onChange={onChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        placeholder={placeholder}
                        className={`w-full bg-transparent text-sm pl-0 pr-8 py-2 border-b focus:outline-none min-h-[10vh] resize-none transition-colors ${fieldClass}`}
                    />
                ) : (
                    <input
                        type={type}
                        value={value}
                        onChange={onChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        placeholder={placeholder}
                        className={`w-full bg-transparent text-sm pl-0 pr-8 py-2 border-b focus:outline-none transition-colors ${fieldClass}`}
                    />
                )}
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: isFocused ? 1 : 0 }}
                    transition={{ duration: 0.3, ease: "circOut" }}
                    className={`absolute bottom-0 left-0 w-full h-[2px] origin-center ${markClass}`}
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: showCheck ? 1 : 0, scale: showCheck ? 1 : 0.5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className={`absolute right-0 bottom-2 pointer-events-none ${checkClass}`}
                >
                    <Check className="w-5 h-5 stroke-[2.5]" />
                </motion.div>
            </div>
        </div>
    );
};

/**
 * `onDark` is opt-in, so /contact (which stays on a cream ground) is
 * untouched and only the home-page rust band asks for the dark variant.
 */
const ContactForm = ({ onDark = false }: { onDark?: boolean }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [company, setCompany] = useState("");
    const [number, setNumber] = useState("");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const sendData = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isSubmitting) {
            if (!name || !email || !company || !number || !message) {
                alert("Please fill all the data.");
                return;
            }

            setIsSubmitting(true);

            try {
                const response = await fetch("https://monarchmediahousebackend.netlify.app/.netlify/functions/server/contactData", {
                    method: "POST",
                    headers: {
                        "content-type": "application/json"
                    },
                    body: JSON.stringify({ name, email, companyName: company, number, message })
                });

                if (response.status === 200) {
                    alert("Data sent successfully!");
                    setName("");
                    setEmail("");
                    setNumber("");
                    setCompany("");
                    setMessage("");
                } else {
                    alert("Backend Error. Please try again later.");
                }
            } catch (err) {
                console.error(err);
                alert("An error occurred. Please try again.");
            }

            setIsSubmitting(false);
        }
    };

    return (
        <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            onSubmit={sendData}
            className='w-full flex flex-col items-center justify-center gap-6 md:gap-8 relative z-10'
        >
            <div className='flex flex-col md:flex-row gap-6 md:gap-8 items-center justify-between w-full'>
                <BrutalistInput label="Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" onDark={onDark} />
                <BrutalistInput label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@company.com" onDark={onDark} />
            </div>
            <div className='flex flex-col md:flex-row gap-6 md:gap-8 items-center justify-between w-full'>
                <BrutalistInput label="Company" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Acme Corp" onDark={onDark} />
                <BrutalistInput label="Phone Number" type="tel" value={number} onChange={(e) => setNumber(e.target.value)} placeholder="+1 (555) 000-0000" onDark={onDark} />
            </div>

            <BrutalistInput label="Project Brief" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tell us about your brand, audience and content goals..." isTextArea={true} onDark={onDark} />

            <button
                type='submit'
                disabled={isSubmitting}
                className='group relative w-full overflow-hidden rounded-full py-4 md:py-5 px-8 mt-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-90 active:duration-75 transition-transform duration-100'
            >
                {/* Base fill.
                    On light: clay-deep, not clay. Clay #C25A34 is only 3.7:1
                    against forest text and 4.0:1 against cream, both of which
                    fail AA for a 14-16px label. clay-deep gives cream text
                    6.8:1 and reads richer as a large pill anyway.
                    On dark (the rust band): the fill inverts to cream with a
                    rust label, because clay-deep on clay-deep is 1.0:1. */}
                <div className={`absolute inset-0 rounded-full -z-10 ${onDark ? "bg-background" : "bg-clay-deep"}`} />

                {/* Hover expanding background: deep forest, both variants. */}
                <div className="absolute inset-0 bg-surface translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] rounded-full z-0" />

                <div className={`relative z-10 flex items-center justify-center text-base md:text-[1vw] font-medium transition-colors duration-300 ${onDark ? "text-clay-deep group-hover:text-background" : "text-background"}`}>
                    {isSubmitting ? "Submitting..." : "Let's Talk"}
                    <span className='ml-3 flex items-center justify-center transition-transform duration-500 group-hover:translate-x-3'>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                    </span>
                </div>
            </button>
            <p className={`text-xs md:text-[0.85vw] font-mono tracking-wide ${onDark ? "text-mist/60" : "text-muted"}`}>We reply to all applications within 48 hours.</p>
        </motion.form>
    );
};

export default ContactForm;
