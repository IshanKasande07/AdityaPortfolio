'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './ResultsSection.module.css';

const stats = [
    { value: '10', suffix: 'M+', label: 'Views' },
    { value: '1,200', suffix: '+', label: 'Creatives' },
    { value: '20', suffix: '+', label: 'Brands' },
    { value: '150', suffix: '%', label: 'Traffic Growth' },
];

function revealLetters(word: string) {
    return Array.from(word).map((letter, index) => (
        <span className={styles.characterMask} key={`${letter}-${index}`}>
            <span className={styles.character}>{letter}</span>
        </span>
    ));
}

export default function ResultsSection() {
    const root = useRef<HTMLElement>(null);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);
        const media = gsap.matchMedia();
        // Touch and reduced-motion visitors get the complete landscape in normal flow.
        media.add('(min-width: 768px) and (prefers-reduced-motion: no-preference) and (pointer: fine)', () => {
            const context = gsap.context(() => {
                const left = `.${styles.left}`;
                const right = `.${styles.right}`;
                const scrollCue = `.${styles.scrollCue}`;
                gsap.set(left, { clipPath: 'inset(30% 51% 20% 19% round 24px)', yPercent: 5 });
                gsap.set(right, { clipPath: 'inset(30% 19% 20% 51% round 24px)', yPercent: -5 });
                gsap.set(`.${styles.full}`, { opacity: 0 });
                gsap.set(`.${styles.proof}`, { autoAlpha: 0, y: 30 });
                gsap.set(`.${styles.atmosphere}`, { opacity: 0 });
                gsap.set(scrollCue, { display: 'flex', autoAlpha: 1, y: 0 });
                gsap.set(`.${styles.cueFill}`, { scaleX: 0, transformOrigin: 'left center' });
                gsap.set(`.${styles.cueDot}`, { x: 0 });

                gsap.timeline({
                    scrollTrigger: {
                        trigger: root.current, start: 'top top',
                        end: () => `+=${window.innerHeight * 1.35}`,
                        scrub: 0.7, invalidateOnRefresh: true,
                    },
                    defaults: { ease: 'power2.inOut' },
                })
                    .to([left, right], { yPercent: 0, duration: .28 }, 0)
                    .to(left, { clipPath: 'inset(30% 49.98% 20% 19% round 0px)', duration: .22 }, .18)
                    .to(right, { clipPath: 'inset(30% 19% 20% 49.98% round 0px)', duration: .22 }, .18)
                    .to(left, { clipPath: 'inset(0% 49.98% 0% 0% round 0px)', duration: .5 }, .4)
                    .to(right, { clipPath: 'inset(0% 0% 0% 49.98% round 0px)', duration: .5 }, .4)
                    .to(`.${styles.cueFill}`, { scaleX: 1, duration: .56, ease: 'none' }, .14)
                    .to(`.${styles.cueDot}`, { x: 48, duration: .56, ease: 'none' }, .14)
                    .set(`.${styles.full}`, { opacity: 1 }, .9)
                    .set([left, right], { opacity: 0 }, .9)
                    .to(scrollCue, { autoAlpha: 0, y: -16, duration: .18 }, .74)
                    .set(scrollCue, { display: 'none' }, .92)
                    .fromTo(`.${styles.atmosphere}`, { opacity: 0 }, { opacity: 1, duration: .35 }, .72)
                    .fromTo(`.${styles.proof}`, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: .3 }, .94);
            }, root);
            return () => context.revert();
        });
        media.add('(prefers-reduced-motion: no-preference)', () => {
            const context = gsap.context(() => {
                gsap.from(`.${styles.character}`, {
                    yPercent: 118,
                    rotate: 2,
                    duration: 0.78,
                    stagger: 0.035,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: root.current,
                        start: 'top 80%',
                        end: 'bottom 20%',
                        toggleActions: 'restart reset restart reset',
                    },
                });
            }, root);
            return () => context.revert();
        });
        return () => media.revert();
    }, []);

    return (
        <section ref={root} id="results" className={styles.section} aria-labelledby="results-title">
            <div className={styles.stage}>
                {[styles.left, styles.right, styles.full].map(part => (
                    <div key={part} className={`${styles.landscape} ${part}`} aria-hidden="true">
                        <Image src="/assets/results/cloud-ascent.png" alt="" fill sizes="100vw" className={styles.photo} />
                    </div>
                ))}
                <div className={styles.atmosphere} aria-hidden="true" />
                <div className={styles.inner}>
                    <header className={styles.header}>
                        <h2 id="results-title" className={styles.headingReveal} aria-label="Results That Speak.">
                            <span className={styles.revealWord} aria-hidden="true">{revealLetters('Results')}</span>
                            <span className={styles.revealWord} aria-hidden="true">{revealLetters('That')}</span>
                            <em className={styles.revealWord} aria-hidden="true">{revealLetters('Speak.')}</em>
                        </h2>
                    </header>
                    <div className={styles.scrollCue}>
                        <span className={styles.cueIcon} aria-hidden="true"><ArrowDown size={18} strokeWidth={1.7} /></span>
                        <span className={styles.cueCopy}>
                            <strong>Scroll to reveal results</strong>
                            <small>The numbers are just ahead</small>
                        </span>
                        <span className={styles.cueJourney} aria-hidden="true">
                            <small>Scene</small>
                            <span className={styles.cueRail}>
                                <i className={styles.cueFill} />
                                <b className={styles.cueDot} />
                            </span>
                            <small>Proof</small>
                        </span>
                    </div>
                    <div className={styles.proof}>
                        <div className={styles.summary}>
                            <p>We don&apos;t just talk about growth. We engineer it. Here&apos;s a snapshot of the tangible value we&apos;ve delivered.</p>
                            <Link href="/work" className={styles.workLink} data-cursor-hover>
                                Explore the work <ArrowUpRight size={20} strokeWidth={1.5} aria-hidden="true" />
                            </Link>
                        </div>
                        <dl className={styles.metrics}>
                            {stats.map(stat => (
                                <div key={stat.label} className={styles.metric}>
                                    <dt>{stat.label}</dt>
                                    <dd>{stat.value}<span className={styles.suffix}>{stat.suffix}</span></dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>
            </div>
        </section>
    );
}
