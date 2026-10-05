/* eslint-disable @typescript-eslint/no-explicit-any */
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import fs from 'fs';
import path from 'path';

// 1. Load the font required by Satori
// const fontPath = path.join(process.cwd(), 'public/fonts/Jost-Regular.ttf');
// const defaultFont = fs.readFileSync(fontPath);

/**
 * Maps our custom simplified JSON layout to Satori's expected React-like VDOM object.
 * Bulletproofed to handle both raw LLM outputs and strict AST formats.
 */
export function buildSatoriTree(element: any): any {
  const props = element.props || {};
  const style = element.style || props.style || {};
  const children = element.children || props.children;
  const src = element.source || element.src || props.src || '';
  const textContent = element.content || element.value || element.text || (typeof children === 'string' ? children : '');

  // 1. DESIGN SYSTEM COMPONENTS (Dynamic Color Injections)

  if (element.type === 'GradientScrim') {
    // LLM provides a raw RGB string (e.g., "0, 0, 0" or "255, 215, 0") based on image mood
    const rgb = style.scrimRgb || '20, 24, 31';
    return {
      type: 'div',
      props: {
        style: {
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          backgroundImage: style.direction === 'top'
            ? `linear-gradient(to bottom, rgba(${rgb}, 0.95) 0%, rgba(${rgb}, 0) 70%)`
            : `linear-gradient(to top, rgba(${rgb}, 0.95) 0%, rgba(${rgb}, 0) 70%)`,
          ...style
        },
        children: Array.isArray(children) ? children.map(buildSatoriTree) : [],
      }
    };
  }

  if (element.type === 'LuxuryTitle') {
    return {
      type: 'div',
      props: {
        style: {
          fontSize: '72px',
          fontWeight: 700,
          lineHeight: 1.1,
          textTransform: 'uppercase',
          textShadow: '0px 4px 12px rgba(0,0,0,0.3)',
          color: style.color || '#FFFFFF', // Dynamic LLM Color
          ...style
        },
        children: textContent,
      }
    };
  }

  if (element.type === 'Metadata') {
    return {
      type: 'div',
      props: {
        style: {
          fontSize: '18px',
          fontWeight: 500,
          letterSpacing: '2px',
          lineHeight: 1.4,
          textTransform: 'uppercase',
          marginBottom: '16px',
          color: style.color || '#b8924a', // Dynamic LLM Color
          ...style
        },
        children: textContent,
      }
    };
  }

  if (element.type === 'CTA') {
    return {
      type: 'div',
      props: {
        style: {
          fontSize: '16px',
          fontWeight: 700,
          letterSpacing: '4px',
          textTransform: 'uppercase',
          padding: '16px 32px',
          borderRadius: '2px',
          marginTop: '24px',
          color: style.color || '#14181F', // Dynamic LLM Text Color
          backgroundColor: style.backgroundColor || '#FFFFFF', // Dynamic LLM Button Color
          ...style
        },
        children: textContent,
      }
    };
  }

  // 2. STANDARD HTML FALLBACKS
  if (element.type === 'image' || element.type === 'img') {
    return { type: 'img', props: { style: { display: 'flex', ...style }, src: src } };
  }

  if (element.type === 'text') {
    return { type: 'div', props: { style: { display: 'flex', ...style }, children: textContent } };
  }

  let processedChildren: any = [];
  if (Array.isArray(children)) {
    processedChildren = children.map(buildSatoriTree);
  } else if (typeof children === 'string') {
    processedChildren = children;
  } else if (textContent) {
    processedChildren = textContent;
  }

  return {
    type: 'div',
    props: {
      style: { display: 'flex', ...style },
      children: processedChildren,
    },
  };
}

/**
 * Compiles a JSON layout and dynamic data into a static PNG buffer
 */
export async function generateCreativeBuffer(
  layoutJsonString: string,
  variables: Record<string, string>,
  width: number = 1080,
  height: number = 1080
): Promise<Buffer> {

  // A. Parse the AI's raw JSON string into a JavaScript object
  const rawLayout = JSON.parse(layoutJsonString);

  // B. THIS IS WHERE IT'S USED: Translate the AI's object into a Satori tree
  const satoriElementTree = buildSatoriTree(rawLayout);

  // Load your fonts (Update these paths to point to your actual local font files)
  const jostRegular = fs.readFileSync(path.join(process.cwd(), 'public/fonts/Jost-Regular.ttf'));
  const jostMedium = fs.readFileSync(path.join(process.cwd(), 'public/fonts/Jost-Regular.ttf'));
  const jostBold = fs.readFileSync(path.join(process.cwd(), 'public/fonts/Jost-Regular.ttf'));

  // C. Pass the translated tree to Satori
  const svg = await satori(satoriElementTree, {
    width,
    height,
    fonts: [
      { name: 'Jost', data: jostRegular, weight: 400, style: 'normal' },
      { name: 'Jost', data: jostMedium, weight: 500, style: 'normal' },
      { name: 'Jost', data: jostBold, weight: 700, style: 'normal' },
    ],
  });

  // D. Convert the SVG to a crisp PNG Buffer
  const resvg = new Resvg(svg, {
    background: 'rgba(20, 24, 31, 1)', // Dark background fallback
    fitTo: { mode: 'original' },
  });

  const pngData = resvg.render();
  return pngData.asPng();
}