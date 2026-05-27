export async function getUnsplashImage(query: string) {
  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query + " luxury dubai")}&per_page=1`,
      {
        headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` },
      }
    );
    const data = await res.json();
    return data.results[0]?.urls?.regular || "https://images.unsplash.com/photo-1512453979798-5ea266f8880c"; // Fallback to Dubai Skyline
  } catch {
    return "https://images.unsplash.com/photo-1512453979798-5ea266f8880c";
  }
}