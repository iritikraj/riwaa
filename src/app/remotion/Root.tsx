/* eslint-disable @typescript-eslint/no-explicit-any */
// riwaa/src/remotion/Root.tsx
import { Composition } from 'remotion';
import { MainComposition, MainCompositionProps } from './MainComposition';
import { PremiumComposition } from './PremiumComposition';
import { RealEstateTeaser } from './RealEstateTeaser';

// We keep the strict typing here, so your data is still 100% type-safe!
const defaultProps: MainCompositionProps = {
  theme: { primaryColor: '#bc9c22', fontFamily: 'sans-serif' },
  assets: {
    backgroundUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1080',
    productUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600'
  },
  copy: {
    language: 'en',
    direction: 'ltr',
    headline: 'Experience Pure Elegance',
    subtext: 'Crafted carefully for premium quality.',
    cta: 'Shop Now'
  }
};

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="Square-1x1"
        component={RealEstateTeaser as React.FC<any>}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={defaultProps}
      />

      <Composition
        id="Vertical-9x16"
        component={RealEstateTeaser as React.FC<any>}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={defaultProps}
      />
    </>
  );
};