/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs/promises';
import path from 'path';

export async function updateLocalGmapsData(itemId: string, aiResult: { sentiment: string, reply_draft: string }) {
  // 1. Define the absolute path to your JSON file
  const filePath = path.join(process.cwd(), 'src/utils/data/gmaps-data.json');

  try {
    // 2. Read and parse the current file
    const fileContents = await fs.readFile(filePath, 'utf8');
    const gmapsData = JSON.parse(fileContents);

    // 3. Find the index of the review we are enriching
    const itemIndex = gmapsData.data.findIndex((item: any) => item.id === itemId);

    if (itemIndex === -1) {
      throw new Error('Item not found in local JSON');
    }

    // 4. Update the specific fields
    gmapsData.data[itemIndex].sentiment = aiResult.sentiment;
    gmapsData.data[itemIndex].ai_suggestion = aiResult.reply_draft;
    // (Note: mapping reply_draft from AI to ai_suggestion in your JSON)

    // 5. Write the updated data back to the file with pretty formatting (2 spaces)
    await fs.writeFile(filePath, JSON.stringify(gmapsData, null, 2), 'utf8');

    return true;
  } catch (error) {
    console.error('Error updating local JSON file:', error);
    return false;
  }
}