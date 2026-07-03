/* eslint-disable @typescript-eslint/no-explicit-any */
import { AbsoluteFill, Video, useCurrentFrame, useVideoConfig, delayRender, continueRender, Sequence } from "remotion";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface SceneData {
  video_url: string;
  text_overlay: string;
  duration_in_frames: any;
}

interface TeaserProps {
  theme_color: string;
  scenes: SceneData[];
}

const SceneRenderer: React.FC<{ scene: SceneData }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  // 1. Tell Remotion to hold on!
  const [handle] = useState(() => delayRender("Buffering video..."));

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true });
      gsap.set(".overlay-text", { y: 30, opacity: 0, scale: 0.9 });

      tl.to(".overlay-text", {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: "power3.out"
      }, 0.5);

      timelineRef.current = tl;
    }, containerRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (timelineRef.current) {
      timelineRef.current.seek(frame / fps);
    }
  }, [frame, fps]);

  return (
    <AbsoluteFill ref={containerRef} className="bg-black flex items-center justify-center">
      <Video
        src={scene.video_url}
        className="absolute inset-0 w-full h-full object-cover opacity-70"
        // 2. Release the freeze once the video is ready to play!
        onCanPlay={() => continueRender(handle)}
        onError={(e) => {
          console.error("Video failed to load:", e);
          continueRender(handle); // Release anyway so it doesn't hang forever
        }}
      />

      <div className="relative z-10 w-full flex flex-col items-center justify-center px-12 text-center">
        <h2 className="overlay-text text-white text-5xl font-light tracking-[0.2em] uppercase drop-shadow-2xl">
          {scene.text_overlay}
        </h2>
      </div>
    </AbsoluteFill>
  );
};

export const RealEstateTeaser: React.FC<TeaserProps> = ({ scenes }) => {
  // Add this safety check
  if (!scenes || !Array.isArray(scenes)) {
    return <AbsoluteFill className="bg-black" />;
  }

  return (
    <AbsoluteFill className="bg-black font-sans">
      {scenes.map((scene, index) => {

        // Functionally calculate the start frame by summing the duration of all previous scenes
        const startFrame = scenes
          .slice(0, index)
          .reduce((acc, s) => acc + s.duration_in_frames, 0);

        return (
          <Sequence
            key={index}
            from={startFrame}
            durationInFrames={scene.duration_in_frames}
          >
            <SceneRenderer scene={scene} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};