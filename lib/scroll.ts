export const scrollToTarget = (
  target: string | HTMLElement | number | null | undefined,
  options?: { offset?: number; duration?: number; immediate?: boolean }
) => {
  if (typeof window === "undefined" || target === null || target === undefined) return;

  const lenis = (window as unknown as { lenis?: { scrollTo: (target: HTMLElement | number | string, opts?: Record<string, unknown>) => void } }).lenis;

  if (target === 0 || target === "top") {
    if (lenis && typeof lenis.scrollTo === "function") {
      lenis.scrollTo(0, {
        duration: options?.duration ?? 1.4,
        easing: (t: number) => 1 - Math.pow(1 - t, 3),
        immediate: options?.immediate,
      });
    } else {
      window.scrollTo({ top: 0, behavior: options?.immediate ? "auto" : "smooth" });
    }
    return;
  }

  const el: HTMLElement | null =
    typeof target === "string"
      ? (document.getElementById(target.replace(/^#/, "")) || document.querySelector(target))
      : typeof target === "number"
      ? null
      : target;

  if (!el) return;

  if (lenis && typeof lenis.scrollTo === "function") {
    lenis.scrollTo(el, {
      offset: options?.offset ?? -96,
      duration: options?.duration ?? 1.4,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      immediate: options?.immediate,
    });
  } else {
    el.scrollIntoView({ behavior: options?.immediate ? "auto" : "smooth" });
  }
};
