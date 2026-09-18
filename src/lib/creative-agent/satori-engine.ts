/* eslint-disable @typescript-eslint/no-explicit-any */
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import fs from 'fs';
import path from 'path';

// 1. Load the font required by Satori
const fontPath = path.join(process.cwd(), 'public/fonts/Jost-Regular.ttf');
const defaultFont = fs.readFileSync(fontPath);

/**
 * Maps our custom simplified JSON layout to Satori's expected React-like VDOM object
 */
function buildSatoriTree(element: any): any {
  if (element.type === 'text') {
    return {
      type: 'div',
      props: {
        style: { display: 'flex', ...element.style },
        children: element.content,
      },
    };
  }

  if (element.type === 'image') {
    return {
      type: 'img',
      props: {
        style: { display: 'flex', ...element.style },
        src: element.source,
      },
    };
  }

  // Handle container or groups
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
  width: number,
  height: number
): Promise<Buffer> {

  // 1. Inject variables dynamically into the JSON string (e.g., replacing "{{headline}}" with actual text)
  let injectedJson = layoutJsonString;
  for (const [key, value] of Object.entries(variables)) {
    // Uses global regex to replace all instances of the variable
    const regex = new RegExp(`{{${key}}}`, 'g');
    injectedJson = injectedJson.replace(regex, value);
  }

  // 2. Parse the injected JSON and map it to a Satori Virtual DOM
  const rawLayout = JSON.parse(injectedJson);
  const satoriVdom = buildSatoriTree(rawLayout);

  // 3. Compile VDOM to SVG using Satori
  const svg = await satori(satoriVdom, {
    width,
    height,
    fonts: [
      {
        name: 'Jost',
        data: defaultFont,
        weight: 400,
        style: 'normal',
      },
    ],
  });

  // 4. Convert the SVG to a crisp PNG using Resvg
  const resvg = new Resvg(svg, {
    background: '#ffffff',
    fitTo: { mode: 'original' },
  });

  const pngData = resvg.render();
  return pngData.asPng();
}