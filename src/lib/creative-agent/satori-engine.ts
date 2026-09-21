/* eslint-disable @typescript-eslint/no-explicit-any */
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import fs from 'fs';
import path from 'path';

// 1. Load the font required by Satori
// const fontPath = path.join(process.cwd(), 'public/fonts/Jost-Regular.ttf');
// const defaultFont = fs.readFileSync(fontPath);

/**
 * Maps our custom simplified JSON layout to Satori's expected React-like VDOM object
 */
export function buildSatoriTree(element: any): any {
  if (element.type === 'text') {
    return {
      type: 'div',
      props: {
        style: { display: 'flex', ...element.style },
        children: element.content || element.value || element.text || '',
      },
    };
  }

  // Catch both "image" and "img" to prevent fallback to empty divs
  if (element.type === 'image' || element.type === 'img') {
    return {
      type: 'img',
      props: {
        style: { display: 'flex', ...element.style },
        // Safely extract src from either the root or a nested props object
        src: element.source || element.src || (element.props && element.props.src) || '',
      },
    };
  }

  return {
    type: 'div',
    props: {
      style: { display: 'flex', ...element.style },
      children: element.children ? element.children.map(buildSatoriTree) : [],
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