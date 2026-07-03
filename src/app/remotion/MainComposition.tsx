// riwaa/src/remotion/MainComposition.tsx
import { AbsoluteFill, Img, useVideoConfig, spring, interpolate, useCurrentFrame } from 'remotion';

// 1. Export the interface so Root.tsx can use it
export interface MainCompositionProps {
  theme: { primaryColor: string; fontFamily: string };
  assets: { backgroundUrl: string; productUrl: string };
  copy: { language: string; direction: 'ltr' | 'rtl'; headline: string; subtext: string; cta: string };
}

// 2. Drop React.FC and type the arguments directly
export const MainComposition = ({ theme, assets, copy }: MainCompositionProps) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const isVertical = height > width;

  // 1. Ken Burns background scale
  const bgScale = interpolate(frame, [0, 150], [1, 1.08], { extrapolateRight: 'clamp' });

  // 2. Premium product bounce entrance
  const productEntrance = spring({
    frame: frame - 10,
    fps,
    config: { damping: 14, mass: 0.8, stiffness: 90 }
  });
  const productScale = interpolate(productEntrance, [0, 1], [0.6, 1]);
  const productOpacity = interpolate(productEntrance, [0, 0.2], [0, 1]);

  // 3. Text fade up
  const textEntrance = spring({ frame: frame - 25, fps, config: { damping: 15 } });
  const textTranslateY = interpolate(textEntrance, [0, 1], [40, 0]);
  const textOpacity = interpolate(textEntrance, [0, 1], [0, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: '#050505', fontFamily: theme.fontFamily, overflow: 'hidden' }}>

      {/* BACKGROUND */}
      <AbsoluteFill style={{ transform: `scale(${bgScale})` }}>
        <Img src={assets.backgroundUrl} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }} />
      </AbsoluteFill>

      {/* PRODUCT */}
      <div style={{
        position: 'absolute',
        top: isVertical ? '25%' : '15%',
        left: 0,
        right: 0,
        height: isVertical ? '40%' : '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `scale(${productScale})`,
        opacity: productOpacity,
      }}>
        <Img src={assets.productUrl} style={{ maxHeight: '100%', maxWidth: '80%', objectFit: 'contain' }} />
      </div>

      {/* MULTI-LINGUAL TEXT */}
      <div
        dir={copy.direction}
        style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          padding: isVertical ? '0 10% 15% 10%' : '0 8% 8% 8%',
          display: 'flex', flexDirection: 'column',
          alignItems: copy.direction === 'rtl' ? 'flex-end' : 'flex-start',
          transform: `translateY(${textTranslateY}px)`,
          opacity: textOpacity,
        }}
      >
        <h1 style={{
          color: '#ffffff',
          margin: '0 0 15px 0',
          lineHeight: 1.1,
          fontWeight: 800,
          textAlign: copy.direction === 'rtl' ? 'right' : 'left',
          fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
        }}>
          {copy.headline}
        </h1>

        <p style={{
          color: 'rgba(255,255,255,0.9)',
          margin: '0 0 30px 0',
          maxWidth: '550px',
          lineHeight: 1.5,
          fontSize: 'clamp(1.2rem, 2vw, 1.8rem)',
          textAlign: copy.direction === 'rtl' ? 'right' : 'left',
        }}>
          {copy.subtext}
        </p>

        {/* CTA BUTTON */}
        <div style={{
          backgroundColor: theme.primaryColor,
          color: '#ffffff',
          padding: '16px 36px',
          borderRadius: '4px',
          fontSize: '1.2rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          boxShadow: '0 4px 14px rgba(0,0,0,0.3)'
        }}>
          {copy.cta}
        </div>
      </div>

    </AbsoluteFill>
  );
};