"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Play, X, Film, Smartphone, Image as ImageIcon, ChevronLeft, ChevronRight } from "lucide-react";

// ─── Data ────────────────────────────────────────────────────────────────────

interface WorkItem {
    id: string;
    title: string;
    description?: string;
    youtubeUrl?: string;
    instagramUrl?: string;
    stats?: string;
    imageUrl?: string;
    featured?: boolean;
    category: "short-form" | "long-form" | "graphics";
}

function extractVideoId(url: string): string {
    const match = url.match(
        /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([^&?/]+)/
    );
    return match ? match[1] : "";
}

function getThumbnail(url: string): string {
    const id = extractVideoId(url);
    return id
        ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg`
        : "/placeholder.jpg";
}

// Placeholder data — replace URLs with real ones later
const WORK_ITEMS: WorkItem[] = [
    // ── Short Form ──
    {
        id: "sf-1",
        title: "Pune Through My lens",
        description: "Pune holds special place in our hearts, this is where we started and understood the craft. We absolutely love this city and had blast capturing it.",
        instagramUrl: "https://www.instagram.com/reel/DbxiqP6BGyp/?hl=en",
        stats: "Gained 800K + views in 2 days, generated qualified leads",
        featured: true,
        category: "short-form",
    },
    {
        id: "sf-2",
        title: "The Indian Garage Co.",
        description: "Reworked a bit on their existing IP. Created better way of telling same story.",
        instagramUrl: "https://www.instagram.com/reel/DcFkEDmz3eL/?hl=en",
        stats: "40% hike in engagement and 75% reach to new audience.",
        featured: true,
        category: "short-form",
    },
    {
        id: "sf-3",
        title: "Ishita X Uniqlo",
        description: "We have been working with Ishita for almost a year. We consistency hit 8-9 million views a month with her content.",
        instagramUrl: "https://www.instagram.com/reel/DbigPbzMiR1/?hl=en",
        stats: "General branded reels get around less than 10% total views and engagement. We got 35%.",
        featured: true,
        category: "short-form",
    },
    { id: "grid-1", title: "Short 1", instagramUrl: "https://www.instagram.com/reel/DanJEo-sy1W/?hl=en", category: "short-form", featured: false },
    { id: "grid-2", title: "Short 2", instagramUrl: "https://www.instagram.com/reel/Db3YFiIy2j-/?hl=en", category: "short-form", featured: false },
    { id: "grid-3", title: "Short 3", instagramUrl: "https://www.instagram.com/reel/DZ6ys6EoVkr/?hl=en", category: "short-form", featured: false },
    { id: "grid-4", title: "Short 4", instagramUrl: "https://www.instagram.com/reel/DXdc7iZCEi-/?hl=en", category: "short-form", featured: false },
    { id: "grid-5", title: "Short 5", instagramUrl: "https://www.instagram.com/p/DZ6ym3yIjCD/?hl=en", category: "short-form", featured: false },
    { id: "grid-6", title: "Short 6", instagramUrl: "https://www.instagram.com/reel/DSKUN80ASSD/?hl=en", category: "short-form", featured: false },
    { id: "grid-7", title: "Short 7", instagramUrl: "https://www.instagram.com/reel/DR4kqVMgUnu/?hl=en", category: "short-form", featured: false },
    { id: "grid-8", title: "Short 8", instagramUrl: "https://www.instagram.com/reel/DQ51VbQEQtD/?hl=en", category: "short-form", featured: false },
    { id: "grid-9", title: "Short 9", instagramUrl: "https://www.instagram.com/reel/DaaSsWapKRJ/?hl=en", category: "short-form", featured: false },
    { id: "grid-10", title: "Short 10", instagramUrl: "https://www.instagram.com/reel/DZ5Mu2Cye0c/", category: "short-form", featured: false },
    { id: "grid-11", title: "Short 11", instagramUrl: "https://www.instagram.com/reel/DaS1SlJsM3Q/", category: "short-form", featured: false },
    { id: "grid-12", title: "Short 12", instagramUrl: "https://www.instagram.com/reel/DaLFFUlTWQJ/", category: "short-form", featured: false },
    { id: "grid-13", title: "Short 13", instagramUrl: "https://www.instagram.com/reel/DbWEQWBTOG_/", category: "short-form", featured: false },
    // ── Long Form ──
    {
        id: "lf-1",
        title: "The Art of Visual Storytelling",
        description: "An emotional storytelling journey showcasing the impact of mid-day meals across India.",
        youtubeUrl: "https://youtu.be/EbcoxLnaAIw",
        featured: true,
        category: "long-form",
    },
    {
        id: "lf-2",
        title: "Building the Narrative",
        description: "A 12-minute deep dive into the content strategy behind India's fastest-growing D2C brands.",
        youtubeUrl: "https://youtu.be/pWVEuaTApbo",
        featured: false,
        category: "long-form",
    },
    {
        id: "lf-3",
        title: "Creative Direction Masterclass",
        youtubeUrl: "https://youtu.be/ckflEamFWG0",
        category: "long-form",
    },
    {
        id: "lf-4",
        title: "Behind the Scenes: Production",
        instagramUrl: "https://www.instagram.com/reel/DcDEZnPzEzc/?hl=en",
        category: "long-form",
    },
    {
        id: "lf-5",
        title: "Directing the Vision",
        instagramUrl: "https://www.instagram.com/reel/DbpZ8P0z-oN/?hl=en",
        category: "long-form",
    },
    // ── Graphics ──
    {
        id: "gfx-1",
        title: "Thumbnail Design: Viral Series",
        description: "Click-through rate optimized thumbnails that consistently outperform benchmarks.",
        youtubeUrl: "https://www.youtube.com/watch?v=0gYMtpX8IPY",
        featured: true,
        category: "graphics",
    },
    {
        id: "gfx-2",
        title: "Social Media Carousel",
        description: "Seamless carousel designs that maximize engagement time and swipe-through rates.",
        youtubeUrl: "https://www.youtube.com/watch?v=0gYMtpX8IPY",
        featured: true,
        category: "graphics",
    },
    {
        id: "gfx-3",
        title: "Brand Identity Kit",
        youtubeUrl: "https://www.youtube.com/watch?v=0gYMtpX8IPY",
        category: "graphics",
    },
    {
        id: "gfx-4",
        title: "YouTube Banner Design",
        youtubeUrl: "https://www.youtube.com/watch?v=0gYMtpX8IPY",
        category: "graphics",
    },
    {
        id: "gfx-5",
        title: "Campaign Poster",
        youtubeUrl: "https://www.youtube.com/watch?v=0gYMtpX8IPY",
        category: "graphics",
    },
    {
        id: "gfx-6",
        title: "Motion Poster",
        youtubeUrl: "https://www.youtube.com/watch?v=0gYMtpX8IPY",
        category: "graphics",
    },
];

// ─── Tabs ────────────────────────────────────────────────────────────────────

type TabKey = "short-form" | "long-form" | "graphics";

const TABS: { key: TabKey; label: string; icon: React.ElementType }[] = [
    { key: "short-form", label: "Short Form", icon: Smartphone },
    { key: "long-form", label: "Long Form", icon: Film },
    { key: "graphics", label: "Thumbnails & Graphics", icon: ImageIcon },
];

// ─── YouTube Modal ───────────────────────────────────────────────────────────

function VideoModal({
    videoUrl,
    onClose,
}: {
    videoUrl: string;
    onClose: () => void;
}) {
    const id = extractVideoId(videoUrl);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleEsc);
        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", handleEsc);
        };
    }, [onClose]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center"
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

            {/* Close button */}
            <button
                onClick={onClose}
                className="absolute top-6 right-6 z-10 w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
                <X className="w-5 h-5" />
            </button>

            {/* Player */}
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="relative z-10 w-[92vw] max-w-5xl aspect-video rounded-2xl overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <iframe
                    src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`}
                    title="Video Player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                />
            </motion.div>
        </motion.div>
    );
}

// ─── Custom UI Elements ──────────────────────────────────────────────────────

const PlayButton = ({ delay = 0, inView = true }: { delay?: number, inView?: boolean }) => (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <motion.div
            className="w-16 h-16 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center backdrop-blur-md group-hover:bg-accent/40 group-hover:border-accent/80 transition-all duration-500"
            whileHover={{ scale: 1.1 }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={inView ? { scale: 1, opacity: 1 } : {}}
            transition={{ type: "spring", stiffness: 300, damping: 20, delay }}
        >
            <Play className="w-6 h-6 text-white fill-white ml-1" />
        </motion.div>
    </div>
);

// ─── Tab 1: Short Form (The Scroll-Stoppers) ───────────────────────────────────

function ShortFormGallery({ items, onPlay }: { items: WorkItem[], onPlay: (url: string) => void }) {
    const featuredItems = items.filter(i => i.featured);
    const gridItems = items.filter(i => !i.featured);
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % featuredItems.length);
    const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + featuredItems.length) % featuredItems.length);

    const currentFeatured = featuredItems[currentIndex];

    return (
        <motion.div
            key="short-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full flex flex-col gap-20 md:gap-32"
        >
            {/* The Asymmetrical Exhibit (Featured Carousel) */}
            {currentFeatured && (
                <div className="flex flex-col md:flex-row items-center gap-12 md:gap-24">
                    
                    {/* Left: Isolated Phone Mockup */}
                    <div className="w-full md:w-[45%] lg:w-[40%] flex justify-center md:justify-end">
                        <div className="relative w-full max-w-[200px] md:max-w-[220px] xl:max-w-[240px] 2xl:max-w-[300px] aspect-[9/19] rounded-[40px] p-2 bg-[#11250E] shadow-[0_20px_60px_-15px_rgba(17,37,14,0.3)]">
                            {/* Phone Inner - Preloaded Stack */}
                            <div className="relative w-full h-full rounded-[32px] overflow-hidden bg-black">
                                {featuredItems.map((item, idx) => {
                                    const isActive = idx === currentIndex;
                                    return (
                                        <div
                                            key={item.id}
                                            className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
                                            onClick={() => { if (!item.instagramUrl && item.youtubeUrl) onPlay(item.youtubeUrl); }}
                                        >
                                            {item.instagramUrl ? (
                                                <iframe src={`${item.instagramUrl.split('?')[0]}embed`} width="100%" height="100%" frameBorder="0" scrolling="no" className="absolute top-0 left-0 w-full h-[calc(100%+60px)] pointer-events-auto"></iframe>
                                            ) : (
                                                <div className="relative w-full h-full cursor-pointer group" data-cursor-hover>
                                                    <img src={getThumbnail(item.youtubeUrl || "")} alt={item.title} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out" />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none" />
                                                    <PlayButton delay={0.2} />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                            {/* Subtle glare */}
                            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-white/10 to-transparent rounded-r-[40px] pointer-events-none z-20" />
                        </div>
                    </div>

                    {/* Right: Editorial Writeup & Controls */}
                    <div className="w-full md:w-[55%] lg:w-[60%] flex flex-col items-start px-4 md:px-0">
                        <div className="mb-6 md:mb-8">
                            <h3 className="text-3xl md:text-4xl 2xl:text-5xl font-medium text-primary tracking-tight mb-4 md:mb-6" style={{ fontFamily: "var(--font-tiempos-headline), serif" }}>
                                The Scroll-Stoppers.
                            </h3>
                            <p className="text-xs md:text-sm 2xl:text-base text-primary/60 font-light leading-relaxed max-w-md" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>
                                We engineer retention. By combining rapid-fire editing with hook-driven storytelling, our short form content consistently shatters algorithmic ceilings across TikTok, Reels, and Shorts.
                            </p>
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentFeatured.id + "-text"}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.4 }}
                                className="flex flex-col mb-8 md:mb-12"
                            >
                                <span className="inline-block px-2 md:px-3 py-1 rounded-full bg-accent/10 text-accent text-[10px] md:text-xs font-semibold uppercase tracking-widest w-fit mb-3 md:mb-4">Viral Hit</span>
                                <h4 className="text-xl md:text-2xl 2xl:text-3xl font-medium text-primary leading-tight mb-2 md:mb-3" style={{ fontFamily: "var(--font-tiempos-headline), serif" }}>{currentFeatured.title}</h4>
                                <p className="text-primary/70 font-light text-xs md:text-sm max-w-sm mb-3 md:mb-4" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>{currentFeatured.description}</p>
                                {currentFeatured.stats && (
                                    <div className="p-4 rounded-xl border border-primary/10 bg-white/50 backdrop-blur-sm max-w-sm">
                                        <p className="text-xs text-primary/80 font-medium" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>
                                            <span className="text-accent font-bold">Impact: </span>{currentFeatured.stats}
                                        </p>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>

                        {/* Carousel Controls */}
                        {featuredItems.length > 1 && (
                            <div className="flex items-center gap-4">
                                <button onClick={prevSlide} className="w-12 h-12 rounded-full border border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <span className="text-xs text-primary/40 font-medium" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>
                                    {String(currentIndex + 1).padStart(2, '0')} / {String(featuredItems.length).padStart(2, '0')}
                                </span>
                                <button onClick={nextSlide} className="w-12 h-12 rounded-full border border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Grid for remaining items */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {gridItems.map((item, idx) => (
                    <ShortFormCard key={item.id} item={item} onPlay={onPlay} index={idx} />
                ))}
            </div>
        </motion.div>
    );
}

function ShortFormCard({ item, index, onPlay }: { item: WorkItem, index: number, onPlay: (url: string) => void }) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: "-10%" });
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`group relative w-full aspect-[2/3] rounded-3xl overflow-hidden bg-black/5 ${item.instagramUrl ? '' : 'cursor-pointer'}`}
            onClick={() => { if (!item.instagramUrl && item.youtubeUrl) onPlay(item.youtubeUrl); }}
            data-cursor-hover={!item.instagramUrl}
        >
            {item.instagramUrl ? (
                <iframe src={`${item.instagramUrl.split('?')[0]}embed`} width="100%" height="100%" frameBorder="0" scrolling="no" className="absolute top-0 left-0 w-full h-[calc(100%+60px)] pointer-events-auto bg-[#11250E]"></iframe>
            ) : (
                <>
                    <img src={getThumbnail(item.youtubeUrl || "")} alt={item.title} className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    <PlayButton inView={inView} delay={0.3 + index * 0.1} />
                    <div className="absolute bottom-5 left-5 right-5 transform group-hover:-translate-y-2 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] pointer-events-none">
                        <h4 className="text-white font-medium text-lg leading-tight" style={{ fontFamily: "var(--font-tiempos-headline), serif" }}>{item.title}</h4>
                    </div>
                </>
            )}
        </motion.div>
    );
}

// ─── Tab 2: Long Form (Cinematic Narratives) ───────────────────────────────────

function LongFormGallery({ items, onPlay }: { items: WorkItem[], onPlay: (url: string) => void }) {
    const featuredItems = items.filter(i => i.featured);
    const gridItems = items.filter(i => !i.featured);
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % featuredItems.length);
    };
    const prevSlide = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + featuredItems.length) % featuredItems.length);
    };

    const currentFeatured = featuredItems[currentIndex];

    return (
        <motion.div
            key="long-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full flex flex-col gap-16 md:gap-24"
        >
            <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-end mb-4 border-b border-primary/10 pb-8">
                <h3 className="text-3xl md:text-5xl font-medium text-primary tracking-tight" style={{ fontFamily: "var(--font-tiempos-headline), serif" }}>
                    Cinematic Narratives.
                </h3>
                <p className="max-w-md text-sm md:text-base text-primary/60 font-light" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>
                    Brand films, documentaries, and interviews that build authority. We treat every project like a feature film — obsessive pacing, premium color grading, and impeccable sound design.
                </p>
            </div>

            {/* Distinct Featured Hero for Long Form */}
            {currentFeatured && (
                <div 
                    className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-3xl md:rounded-[40px] overflow-hidden cursor-pointer group shadow-2xl"
                    onClick={() => onPlay(currentFeatured.youtubeUrl || "")}
                    data-cursor-hover
                >
                    <AnimatePresence mode="wait">
                        <motion.img 
                            key={currentFeatured.id}
                            initial={{ opacity: 0, scale: 1.05 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8 }}
                            src={getThumbnail(currentFeatured.youtubeUrl || "")} 
                            alt={currentFeatured.title} 
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105" 
                        />
                    </AnimatePresence>
                    
                    {/* Cinematic gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#11250E]/90 via-[#11250E]/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                    <div className="absolute inset-0 opacity-[0.2] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml;utf8,%3Csvg viewBox=\\"0 0 200 200\\" xmlns=\\"http://www.w3.org/2000/svg\\"%3E%3Cfilter id=\\"noiseFilter\\"%3E%3CfeTurbulence type=\\"fractalNoise\\" baseFrequency=\\"0.8\\" numOctaves=\\"3\\" stitchTiles=\\"stitch\\"/%3E%3C/filter%3E%3Crect width=\\"100%25\\" height=\\"100%25\\" filter=\\"url(%23noiseFilter)\\"/%3E%3C/svg%3E")' }} />
                    
                    <PlayButton delay={0.2} />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 z-10 pointer-events-none">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentFeatured.id + "-text"}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.4 }}
                            >
                                <span className="inline-block px-3 py-1 rounded-full bg-accent text-white text-xs font-semibold uppercase tracking-widest mb-4">Masterpiece</span>
                                <h4 className="text-3xl md:text-5xl lg:text-6xl font-medium text-white leading-tight mb-3 tracking-tight" style={{ fontFamily: "var(--font-tiempos-headline), serif" }}>
                                    {currentFeatured.title}
                                </h4>
                                <p className="text-white/70 max-w-2xl text-sm md:text-base font-light" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>
                                    {currentFeatured.description}
                                </p>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Carousel Controls */}
                    {featuredItems.length > 1 && (
                        <>
                            <button 
                                onClick={prevSlide} 
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/20 border border-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-black/40 hover:scale-110 z-20"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button 
                                onClick={nextSlide} 
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/20 border border-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-black/40 hover:scale-110 z-20"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </>
                    )}
                </div>
            )}

            {/* Split Layout for the rest: List on Left, Grid on Right */}
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 mt-12 md:mt-16">
                
                {/* Left Side: Detailed List */}
                <div className="w-full lg:w-5/12 flex flex-col gap-16">
                    <div className="border-b border-primary/20 pb-4 mb-4">
                        <h4 className="text-sm uppercase tracking-widest text-primary/60 font-semibold" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>Selected Narratives</h4>
                    </div>
                    {gridItems.slice(0, 2).map((item, idx) => (
                        <LongFormListCard key={item.id} item={item} index={idx} onPlay={onPlay} />
                    ))}
                </div>

                {/* Right Side: Dense Grid */}
                <div className="w-full lg:w-7/12 flex flex-col">
                    <div className="border-b border-primary/20 pb-4 mb-12">
                        <h4 className="text-sm uppercase tracking-widest text-primary/60 font-semibold" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>From The Archives</h4>
                    </div>
                    <div className="flex flex-col gap-16">
                        {gridItems.slice(2).map((item, idx) => (
                            <div key={item.id} className="w-full">
                                <LongFormGridCard item={item} index={idx + 2} onPlay={onPlay} />
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </motion.div>
    );
}

function LongFormListCard({ item, index, onPlay }: { item: WorkItem, index: number, onPlay: (url: string) => void }) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: "-10%" });
    
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-6 group"
        >
            <div 
                className={`w-full aspect-[16/9] rounded-[24px] overflow-hidden relative shadow-xl shadow-primary/5 ${item.instagramUrl ? '' : 'cursor-pointer'}`}
                onClick={() => { if (!item.instagramUrl && item.youtubeUrl) onPlay(item.youtubeUrl); }}
                data-cursor-hover={!item.instagramUrl}
            >
                {item.instagramUrl ? (
                    <iframe src={`${item.instagramUrl.split('?')[0]}embed`} width="100%" height="100%" frameBorder="0" scrolling="no" allowTransparency={true} className="absolute top-0 left-0 w-full h-full pointer-events-auto bg-[#11250E]"></iframe>
                ) : (
                    <>
                        <img src={getThumbnail(item.youtubeUrl || "")} alt={item.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.05]" />
                        <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml;utf8,%3Csvg viewBox=\\"0 0 200 200\\" xmlns=\\"http://www.w3.org/2000/svg\\"%3E%3Cfilter id=\\"noiseFilter\\"%3E%3CfeTurbulence type=\\"fractalNoise\\" baseFrequency=\\"0.8\\" numOctaves=\\"3\\" stitchTiles=\\"stitch\\"/%3E%3C/filter%3E%3Crect width=\\"100%25\\" height=\\"100%25\\" filter=\\"url(%23noiseFilter)\\"/%3E%3C/svg%3E")' }} />
                        <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors duration-500 pointer-events-none" />
                        <PlayButton inView={inView} />
                    </>
                )}
            </div>

            <div className="flex flex-col items-start">
                <div className="flex items-baseline gap-4 mb-3">
                    <span className="text-3xl font-light text-primary/20" style={{ fontFamily: "var(--font-tiempos-headline), serif" }}>
                        {String(index + 1).padStart(2, '0')}
                    </span>
                    <h4 className="text-2xl font-medium text-primary leading-tight" style={{ fontFamily: "var(--font-tiempos-headline), serif" }}>
                        {item.title}
                    </h4>
                </div>
                <p className="text-primary/60 font-light leading-relaxed pl-12" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>
                    {item.description || "A deep dive into visual storytelling and pacing, designed to capture attention and hold it for the entire duration of the film."}
                </p>
            </div>
        </motion.div>
    );
}

function LongFormGridCard({ item, index, onPlay }: { item: WorkItem, index: number, onPlay: (url: string) => void }) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: "-10%" });
    
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: (index % 4) * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-4 group"
        >
            <div 
                className={`w-full aspect-[16/9] rounded-2xl overflow-hidden relative shadow-md shadow-primary/5 ${item.instagramUrl ? '' : 'cursor-pointer'}`}
                onClick={() => { if (!item.instagramUrl && item.youtubeUrl) onPlay(item.youtubeUrl); }}
                data-cursor-hover={!item.instagramUrl}
            >
                {item.instagramUrl ? (
                    <iframe src={`${item.instagramUrl.split('?')[0]}embed`} width="100%" height="100%" frameBorder="0" scrolling="no" className="absolute top-0 left-0 w-full h-full pointer-events-auto bg-[#11250E]"></iframe>
                ) : (
                    <>
                        <img src={getThumbnail(item.youtubeUrl || "")} alt={item.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
                        <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/0 transition-colors duration-500 pointer-events-none" />
                        <PlayButton inView={inView} delay={0.1} />
                    </>
                )}
            </div>

            <div className="flex flex-col items-start px-1">
                <h4 className="text-lg font-medium text-primary leading-tight" style={{ fontFamily: "var(--font-tiempos-headline), serif" }}>
                    {item.title}
                </h4>
            </div>
        </motion.div>
    );
}

// ─── Tab 3: Graphics (Visual Identity) ─────────────────────────────────────────

function GraphicsGallery({ items }: { items: WorkItem[] }) {
    const featuredItems = items.filter(i => i.featured);
    const gridItems = items.filter(i => !i.featured);
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % featuredItems.length);
    };
    const prevSlide = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + featuredItems.length) % featuredItems.length);
    };

    const currentFeatured = featuredItems[currentIndex];

    return (
        <motion.div
            key="graphics"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full flex flex-col gap-16 md:gap-24"
        >
            <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-end mb-4 border-b border-primary/10 pb-8">
                <h3 className="text-3xl md:text-5xl font-medium text-primary tracking-tight" style={{ fontFamily: "var(--font-tiempos-headline), serif" }}>
                    Visual Identity.
                </h3>
                <p className="max-w-md text-sm md:text-base text-primary/60 font-light" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>
                    Click-through rate optimized thumbnails, brand kits, and motion posters. The first impression is everything — we design for the click without sacrificing the aesthetic.
                </p>
            </div>

            {/* Distinct Featured Hero for Graphics: "The Gallery Print" */}
            {currentFeatured && (
                <div className="flex flex-col items-center group">
                    <div className="relative w-full max-w-5xl aspect-video md:aspect-[16/7] bg-white p-3 md:p-6 rounded-sm shadow-[0_20px_50px_rgba(17,37,14,0.1)]">
                        <div className="relative w-full h-full overflow-hidden rounded-sm bg-primary/5">
                            <AnimatePresence mode="wait">
                                <motion.img 
                                    key={currentFeatured.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.6 }}
                                    src={getThumbnail(currentFeatured.youtubeUrl ?? "")} 
                                    alt={currentFeatured.title} 
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                                />
                            </AnimatePresence>
                            <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors duration-500 pointer-events-none" />
                        </div>
                    </div>
                    
                    {/* Museum Placard & Controls */}
                    <div className="mt-8 md:mt-12 flex flex-col items-center text-center max-w-2xl px-4 relative w-full">
                        <div className="w-px h-8 bg-primary/20 mb-6" />
                        
                        <div className="flex items-center gap-6 mb-3">
                            {featuredItems.length > 1 && (
                                <button onClick={prevSlide} className="w-10 h-10 rounded-full border border-primary/20 flex items-center justify-center text-primary/60 hover:bg-primary hover:text-white transition-all hover:scale-105 shadow-sm">
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                            )}
                            <span className="text-xs text-primary/50 uppercase tracking-[0.2em] font-medium" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>
                                Exhibition — {String(currentIndex + 1).padStart(2, '0')}
                            </span>
                            {featuredItems.length > 1 && (
                                <button onClick={nextSlide} className="w-10 h-10 rounded-full border border-primary/20 flex items-center justify-center text-primary/60 hover:bg-primary hover:text-white transition-all hover:scale-105 shadow-sm">
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            )}
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentFeatured.id + "-text"}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.4 }}
                                className="flex flex-col items-center"
                            >
                                <h4 className="text-2xl md:text-4xl font-medium text-primary leading-tight mb-4" style={{ fontFamily: "var(--font-tiempos-headline), serif" }}>{currentFeatured.title}</h4>
                                <p className="text-primary/70 font-light text-sm md:text-base leading-relaxed" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>{currentFeatured.description}</p>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            )}

            {/* Masonry-style Moodboard for the rest */}
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 md:space-y-8">
                {gridItems.map((item, idx) => (
                    <GraphicsCard key={item.id} item={item} index={idx} />
                ))}
            </div>
        </motion.div>
    );
}

function GraphicsCard({ item, index }: { item: WorkItem, index: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: "-10%" });
    
    // Varying border radiuses and background mats for moodboard feel
    const radiuses = ["rounded-2xl", "rounded-[40px]", "rounded-br-[60px] rounded-tl-[60px] rounded-tr-2xl rounded-bl-2xl"];
    const radius = radiuses[index % radiuses.length];
    
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.7, delay: (index % 3) * 0.15, type: "spring", stiffness: 200, damping: 25 }}
            className={`relative break-inside-avoid overflow-hidden bg-white p-2 md:p-3 shadow-xl shadow-primary/[0.03] group ${radius}`}
            data-cursor-hover
        >
            <div className={`relative overflow-hidden w-full h-full ${radius.replace('rounded', 'rounded')}`}>
                <img src={getThumbnail(item.youtubeUrl ?? "")} alt={item.title} className="w-full h-auto object-cover transition-transform duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-110" />
                
                {/* Reveal overlay on hover */}
                <div className="absolute inset-0 bg-primary/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 text-center">
                    <ImageIcon className="w-8 h-8 text-accent mb-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500" />
                    <h4 className="text-white font-medium text-lg md:text-xl leading-tight transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75" style={{ fontFamily: "var(--font-tiempos-headline), serif" }}>{item.title}</h4>
                    {item.description && <p className="text-white/60 text-xs mt-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100">{item.description}</p>}
                </div>
            </div>
        </motion.div>
    );
}

// ─── Tab Content Wrapper ───────────────────────────────────────────────────────

function TabContent({ tabKey, onPlay }: { tabKey: TabKey, onPlay: (url: string) => void }) {
    const items = WORK_ITEMS.filter((i) => i.category === tabKey);
    
    if (tabKey === "short-form") return <ShortFormGallery items={items} onPlay={onPlay} />;
    if (tabKey === "long-form") return <LongFormGallery items={items} onPlay={onPlay} />;
    return <GraphicsGallery items={items} />;
}

function TabBar({ activeTab, onTabChange }: { activeTab: TabKey, onTabChange: (key: TabKey) => void }) {
    const [isTabsStuck, setIsTabsStuck] = useState(false);
    const tabWrapperRef = useRef<HTMLDivElement>(null);
    const tabAnchorRef = useRef<HTMLDivElement>(null);

    const handleTabChange = useCallback((key: TabKey) => {
        onTabChange(key);
        if (isTabsStuck && tabAnchorRef.current) {
            const y = tabAnchorRef.current.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({ top: y - 150, behavior: "smooth" });
        }
    }, [isTabsStuck, onTabChange]);

    useEffect(() => {
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    if (tabWrapperRef.current) {
                        setIsTabsStuck(tabWrapperRef.current.getBoundingClientRect().top <= 81);
                    }
                    ticking = false;
                });
                ticking = true;
            }
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <div ref={tabAnchorRef} className="w-full h-0" />
            <div ref={tabWrapperRef} className="sticky top-[60px] md:top-[80px] z-50 flex justify-center w-full mb-12 md:mb-16 pointer-events-none">
                <motion.div 
                    animate={{
                        scale: isTabsStuck ? 0.7 : 1,
                        y: isTabsStuck ? -10 : 0
                    }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-center gap-1 md:gap-2 p-1.5 rounded-full w-fit pointer-events-auto backdrop-blur-2xl bg-transparent border border-primary/20 shadow-[0_4px_24px_0_rgba(17,37,14,0.08)]"
                >
                    {TABS.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.key;
                        return (
                            <button
                                key={tab.key}
                                onClick={() => handleTabChange(tab.key)}
                                data-cursor-hover
                                className={`relative flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-full text-xs md:text-sm font-medium transition-colors duration-300 ${
                                    isActive
                                        ? "text-background"
                                        : "text-primary/60 hover:text-primary"
                                }`}
                                style={{
                                    fontFamily: "var(--font-space-grotesk), sans-serif",
                                }}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="work-tab-indicator"
                                        className="absolute inset-0 bg-primary rounded-full"
                                        transition={{
                                            type: "spring",
                                            stiffness: 400,
                                            damping: 30,
                                        }}
                                    />
                                )}
                                <Icon className="relative z-10 w-4 h-4" />
                                <span className="relative z-10 hidden sm:inline">
                                    {tab.label}
                                </span>
                            </button>
                        );
                    })}
                </motion.div>
            </div>
        </>
    );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function WorkShowcase() {
    const [activeTab, setActiveTab] = useState<TabKey>("short-form");
    const [modalVideo, setModalVideo] = useState<string | null>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const isHeaderInView = useInView(headerRef, { once: true, margin: "-10%" });

    const openModal = useCallback((url: string) => setModalVideo(url), []);
    const closeModal = useCallback(() => setModalVideo(null), []);

    return (
        <section className="relative w-full min-h-screen bg-background overflow-clip">
            {/* Subtle grain overlay */}
            <div
                className="fixed inset-0 pointer-events-none opacity-[0.03] z-0"
                style={{
                    backgroundImage:
                        'url("data:image/svg+xml;utf8,%3Csvg viewBox=\\"0 0 200 200\\" xmlns=\\"http://www.w3.org/2000/svg\\"%3E%3Cfilter id=\\"noiseFilter\\"%3E%3CfeTurbulence type=\\"fractalNoise\\" baseFrequency=\\"0.65\\" numOctaves=\\"3\\" stitchTiles=\\"stitch\\"/%3E%3C/filter%3E%3Crect width=\\"100%25\\" height=\\"100%25\\" filter=\\"url(%23noiseFilter)\\"/%3E%3C/svg%3E")',
                    backgroundRepeat: "repeat",
                    backgroundSize: "256px 256px",
                }}
            />


            <div className="relative z-10 w-full max-w-[1070px] mx-auto px-6 md:px-16 pt-10 md:pt-16 pb-24 md:pb-32">
            {/* ── Cinematic Hero Banner ── */}
                <div className="mb-14 md:mb-20 -mx-6 md:-mx-16">
                    <motion.div
                        ref={headerRef}
                        className="relative w-full rounded-[24px] md:rounded-[32px] overflow-hidden"
                        style={{ minHeight: "clamp(320px, 50vh, 520px)" }}
                    >
                        {/* Background image */}
                        <motion.img
                            src="/assets/work-hero-bg.jpg"
                            alt=""
                            aria-hidden="true"
                            className="absolute inset-0 w-full h-full object-cover"
                            style={{ filter: "brightness(0.7) saturate(1.2)" }}
                            initial={{ clipPath: "polygon(0% 0%, 0% 0%, 0% 0%)", scale: 1.1 }}
                            animate={{ clipPath: "polygon(0% 0%, 250% 0%, 0% 250%)", scale: 1 }}
                            transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
                        />

                        {/* Gradient overlays for depth */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#11250E]/90 via-[#11250E]/60 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#11250E]/80 via-transparent to-[#11250E]/30" />

                        {/* Content */}
                        <div className="relative z-10 flex flex-col justify-end h-full px-8 md:px-14 py-10 md:py-14" style={{ minHeight: "clamp(320px, 50vh, 520px)" }}>

                            {/* Top-left accent label */}
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="absolute top-8 md:top-10 left-8 md:left-14 flex items-center gap-3"
                            >
                                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                                <span
                                    className="text-[10px] md:text-xs text-[#F8F3E6]/50 uppercase tracking-[0.25em] font-medium"
                                    style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
                                >
                                    Portfolio &mdash; 2024
                                </span>
                            </motion.div>

                            {/* Top-right project count */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={isHeaderInView ? { opacity: 1 } : {}}
                                transition={{ duration: 0.6, delay: 0.5 }}
                                className="absolute top-8 md:top-10 right-8 md:right-14"
                            >
                                <span
                                    className="text-[10px] md:text-xs text-[#F8F3E6]/40 uppercase tracking-[0.15em] font-medium"
                                    style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
                                >
                                    {WORK_ITEMS.length} Projects
                                </span>
                            </motion.div>

                            {/* Main heading */}
                            <div className="max-w-2xl">
                                <div className="overflow-hidden mb-1">
                                    <motion.p
                                        initial={{ y: "110%" }}
                                        animate={isHeaderInView ? { y: 0 } : { y: "110%" }}
                                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
                                        className="text-sm md:text-base text-accent font-medium tracking-wide mb-3"
                                        style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
                                    >
                                        The work speaks for itself.
                                    </motion.p>
                                </div>
                                <div className="overflow-hidden mb-2">
                                    <motion.h1
                                        initial={{ y: "110%" }}
                                        animate={isHeaderInView ? { y: 0 } : { y: "110%" }}
                                        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
                                        className="text-4xl md:text-6xl lg:text-7xl font-medium text-[#F8F3E6] leading-[1] tracking-tight"
                                        style={{ fontFamily: "var(--font-tiempos-headline), serif" }}
                                    >
                                        Stories that
                                    </motion.h1>
                                </div>
                                <div className="overflow-hidden mb-6">
                                    <motion.h1
                                        initial={{ y: "110%" }}
                                        animate={isHeaderInView ? { y: 0 } : { y: "110%" }}
                                        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
                                        className="text-4xl md:text-6xl lg:text-7xl font-medium text-accent italic leading-[1] tracking-tight"
                                        style={{ fontFamily: "var(--font-tiempos-headline), serif" }}
                                    >
                                        move people.
                                    </motion.h1>
                                </div>
                                <motion.p
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ duration: 0.7, delay: 0.6 }}
                                    className="text-sm md:text-base text-[#F8F3E6]/50 max-w-md leading-relaxed"
                                    style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
                                >
                                    From 30-second hooks to full-length brand films — every frame is engineered to stop the scroll, spark emotion, and drive measurable impact.
                                </motion.p>
                            </div>

                            {/* Scroll indicator */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={isHeaderInView ? { opacity: 1 } : {}}
                                transition={{ duration: 0.5, delay: 0.9 }}
                                className="absolute bottom-8 md:bottom-10 right-8 md:right-14 flex flex-col items-center gap-2"
                            >
                                <span
                                    className="text-[9px] text-[#F8F3E6]/30 uppercase tracking-[0.2em] font-medium"
                                    style={{ fontFamily: "var(--font-space-grotesk), sans-serif", writingMode: "vertical-rl" }}
                                >
                                    Explore
                                </span>
                                <motion.div
                                    animate={{ y: [0, 6, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                    className="w-px h-8 bg-gradient-to-b from-accent/60 to-transparent"
                                />
                            </motion.div>
                        </div>

                        {/* Subtle inner border */}
                        <div className="absolute inset-0 rounded-[24px] md:rounded-[32px] ring-1 ring-inset ring-white/[0.06]" />
                    </motion.div>
                </div>

                {/* ── Tab Bar ── */}
                <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

                {/* ── Content ── */}
                <AnimatePresence mode="wait">
                    <TabContent
                        key={activeTab}
                        tabKey={activeTab}
                        onPlay={openModal}
                    />
                </AnimatePresence>
            </div>

            {/* ── Video Modal ── */}
            <AnimatePresence>
                {modalVideo && (
                    <VideoModal videoUrl={modalVideo} onClose={closeModal} />
                )}
            </AnimatePresence>
        </section>
    );
}
