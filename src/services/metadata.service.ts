import axios from "axios";
import * as cheerio from "cheerio";

export interface Metadata {
  title: string;
  description: string;
  imageUrl: string;
}

export const extractMetadata = async (url: string): Promise<Metadata> => {
  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Social-SEO-Preview-Bot/1.0",
      },
      timeout: 5000,
    });

    const html = response.data;
    const $ = cheerio.load(html);

    const title =
      $('meta[property="og:title"]').attr("content") ||
      $('meta[name="twitter:title"]').attr("content") ||
      $("title").text() ||
      new URL(url).hostname;

    const description =
      $('meta[property="og:description"]').attr("content") ||
      $('meta[name="twitter:description"]').attr("content") ||
      $('meta[name="description"]').attr("content") ||
      "";

    const imageUrl =
      $('meta[property="og:image"]').attr("content") ||
      $('meta[name="twitter:image"]').attr("content") ||
      "";

    return {
      title: title.trim(),
      description: description.trim(),
      imageUrl: imageUrl.trim(),
    };
  } catch (error) {
    console.error(`Failed to extract metadata for ${url}:`, error);
    // Fallback
    return {
      title: new URL(url).hostname,
      description: "No description available",
      imageUrl: "",
    };
  }
};
