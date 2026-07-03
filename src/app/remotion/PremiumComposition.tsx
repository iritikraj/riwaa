import { AbsoluteFill, useCurrentFrame, useVideoConfig, Img } from "remotion";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface PremiumAdProps {
  theme: { primaryColor: string; fontFamily: string };
  assets: { backgroundUrl: string; productUrl: string };
  copy: { language: string; direction: string; headline: string; subtext: string; cta: string };
}

export const PremiumComposition: React.FC<PremiumAdProps> = ({ theme, assets, copy }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const containerRef = useRef<HTMLDivElement>(null);
  const [timeline, setTimeline] = useState<gsap.core.Timeline | null>(null);

  useEffect(() => {
    // 1. Initialize GSAP context for React cleanup safety
    const ctx = gsap.context(() => {
      // Create a paused timeline that Remotion will drive
      const tl = gsap.timeline({ paused: true });

      // Initial Setup
      gsap.set(".bg-overlay", { opacity: 0 });
      gsap.set(".text-line", { y: 60, opacity: 0, clipPath: "inset(100% 0 0 0)" });

      // Step 1: Fade in the atmospheric background
      tl.to(".bg-overlay", { opacity: 0.7, duration: 1.5, ease: "power2.inOut" }, 0);

      // Step 2: The Hero Asset (Product)
      // We introduce it clearly, ensuring it stays fully visible as it moves to the right side of the content
      tl.fromTo(
        ".hero-asset",
        { scale: 0.85, x: -100, opacity: 0, rotationY: -15 },
        { scale: 1, x: 50, opacity: 1, rotationY: 0, duration: 2.5, ease: "expo.out" },
        0.3
      );

      // Step 3: Staggered Premium Typography Reveal
      tl.to(
        ".text-line",
        { y: 0, opacity: 1, clipPath: "inset(0% 0 0 0)", duration: 1.5, stagger: 0.15, ease: "power4.out" },
        0.8
      );

      // Step 4: Call to Action button swell
      tl.fromTo(
        ".cta-button",
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 1.2, ease: "elastic.out(1, 0.5)" },
        1.5
      );

      setTimeline(tl);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // 2. The Engine Bridge: Scrub the GSAP timeline using Remotion's frame tick
  useEffect(() => {
    if (timeline) {
      timeline.seek(frame / fps);
    }
  }, [frame, fps, timeline]);

  return (
    <AbsoluteFill ref={containerRef} className="bg-black flex overflow-hidden font-sans">

      {/* BACKGROUND LAYER */}
      <AbsoluteFill>
        <Img src={assets.backgroundUrl} className="w-full h-full object-cover scale-105" />
        <div className="bg-overlay absolute inset-0 bg-gradient-to-r from-black/90 to-black/40" />
      </AbsoluteFill>

      {/* COMPOSITION GRID */}
      <div className="relative z-10 w-full h-full flex flex-row items-center justify-between px-24">

        {/* LEFT COMPARTMENT: Typography */}
        <div className="flex flex-col w-[55%] text-left z-20">
          <div className="overflow-hidden pb-2">
            <h1
              className="text-line text-7xl font-light tracking-tight leading-tight text-white mb-6"
              style={{ fontFamily: theme.fontFamily }}
            >
              {copy.headline}
            </h1>
          </div>

          <div className="overflow-hidden pb-2 mb-12">
            <p className="text-line text-2xl text-neutral-300 font-light leading-relaxed max-w-xl">
              {copy.subtext}
            </p>
          </div>

          <div className="cta-button self-start">
            <div
              className="px-10 py-4 rounded-sm text-black font-medium tracking-[0.2em] uppercase text-sm"
              style={{ backgroundColor: theme.primaryColor }}
            >
              {copy.cta}
            </div>
          </div>
        </div>

        {/* RIGHT COMPARTMENT: Hero Asset */}
        <div className="w-[45%] h-full flex items-center justify-end z-10">
          <Img
            src={assets.productUrl}
            className="hero-asset w-full max-w-[600px] max-h-[800px] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
          />
        </div>

      </div>
    </AbsoluteFill>
  );
};