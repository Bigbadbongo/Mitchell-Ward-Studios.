import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

let resolvedFilename = "";
let resolvedDirname = "";

try {
  resolvedFilename = __filename;
  resolvedDirname = __dirname;
} catch (e) {
  resolvedFilename = fileURLToPath(import.meta.url);
  resolvedDirname = path.dirname(resolvedFilename);
}

const __filenameWorkaround = resolvedFilename;
const __dirnameWorkaround = resolvedDirname;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Server-side lazy initialization of Google GenAI SDK
  let aiClient: GoogleGenAI | null = null;
  function getGenAI() {
    if (!aiClient) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey) {
        aiClient = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              "User-Agent": "aistudio-build",
            },
          },
        });
      }
    }
    return aiClient;
  }

  // API endpoint for AI Curation (Surprise Me!)
  app.post("/api/curate-artwork", async (req, res) => {
    try {
      const { mood, stylePreference, catalog } = req.body;
      const ai = getGenAI();

      // IF a custom catalog is provided (containing pre-seeded + user-uploaded paintings/photos)
      if (catalog && Array.isArray(catalog) && catalog.length > 0) {
        if (!ai) {
          // Fallback selection from the catalog when GEMINI_API_KEY is not defined
          const selectedIndex = Math.floor(Math.random() * catalog.length);
          const chosen = catalog[selectedIndex];
          return res.json({
            status: "fallback",
            selectedId: chosen.id,
            curationNotes: `Curated dynamically to harmonize with the '${mood || "curated"}' mood. This original piece, "${chosen.title}" by ${chosen.artist}, elegantly transforms and anchors the atmosphere.`,
            framePreference: "Oak"
          });
        }

        // We have active Gemini AI! Let's let Gemini choose the best match from the user's catalog
        const simplifiedCatalog = catalog.map((item: any) => ({
          id: item.id,
          title: item.title,
          artist: item.artist,
          description: item.description,
          medium: item.medium,
          category: item.category,
          style: item.style
        }));

        const prompt = `You are the master art curator at 'Studio Canvas'.
Your client is requesting a fine art piece from the gallery's portfolio catalog that perfectly captures this aesthetic theme/mood: "${mood || "surprise me"}".

Here is the portfolio catalog of available artworks:
${JSON.stringify(simplifiedCatalog, null, 2)}

Please review the available items carefully, selection the absolute best piece that embodies and elevates the mood, and justify your choice with poetic gallery critique.

Provide the output in valid structural JSON format with exactly these fields:
- selectedId: The matching "id" string of the chosen artwork from the catalog. Must match an existing ID from the list exactly.
- curationNotes: A deeply inspiring, lyrical, and eloquent curatorial review of 2-3 sentences explaining why this specific work matches the mood. Speak with professional gallery prestige.
- framePreference: Recommend a floating frame option. Must be exactly one of: 'Black', 'White', 'Oak', 'None'.

Do not wrap the output in markdown code blocks. Return only raw JSON.`;

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                selectedId: { type: Type.STRING },
                curationNotes: { type: Type.STRING },
                framePreference: { type: Type.STRING }
              },
              required: ["selectedId", "curationNotes", "framePreference"]
            }
          }
        });

        const parsedStr = response.text ? response.text.trim() : "";
        const resultObj = JSON.parse(parsedStr);

        // Verify the returning selectedId actually exists in catalog, otherwise fallback safely
        const chosenIdResult = catalog.some((a: any) => a.id === resultObj.selectedId)
          ? resultObj.selectedId
          : catalog[0].id;

        return res.json({
          status: "success",
          selectedId: chosenIdResult,
          curationNotes: resultObj.curationNotes || "Elegantly chosen from your personal custom catalog to anchor your collection.",
          framePreference: resultObj.framePreference || "Oak"
        });
      }

      // FALLBACK TO GENERATIVE ART IN CASE CATALOG IS ABSENT
      if (!ai) {
        // Fallback generator when GEMINI_API_KEY is not defined
        const fallbackCollections = [
          {
            title: "Solstice Glow",
            description: "A gorgeous study of natural sunset shafts entering a silent concrete hall, mixing severe minimalist shapes with fluid golden light shadows.",
            medium: "Textured Pigment and Gold Dust on Canvas",
            primaryColor: "#E6A15C",
            secondaryColor: "#3E4C5E",
            tertiaryColor: "#FFF6EC",
            price: 360,
            visualType: "geometric",
            framePreference: "Oak"
          },
          {
            title: "Nebula Whisper",
            description: "Deep stygian velvet washes collide with luminous lilac smoke cloud patterns, presenting an ethereal depiction of outer cosmic nebulas.",
            medium: "Dilute Acrylic Ink and Mica Shimmer",
            primaryColor: "#4B0082",
            secondaryColor: "#DA70D6",
            tertiaryColor: "#0F172A",
            price: 780,
            visualType: "cosmic",
            framePreference: "Black"
          },
          {
            title: "Aegean Tides",
            description: "Thick impasto palette knife layers of deep sea azul, seafoam white, and subtle sandy beige, evoking the raw ocean breezes of the Greek coasts.",
            medium: "Structures Acrylic Gel and Beach Sand",
            primaryColor: "#0284C7",
            secondaryColor: "#E0F2FE",
            tertiaryColor: "#F59E0B",
            price: 1250,
            visualType: "fluid",
            framePreference: "White"
          },
          {
            title: "Botanical Echo",
            description: "Sparsely applied natural sage water-colours combined with sharp, delicate charcoal branches. Ideal for earthy spaces seeking tranquil nature sounds.",
            medium: "Earthy Water-colour and Organic Clay",
            primaryColor: "#4D7C0F",
            secondaryColor: "#F7FEE7",
            tertiaryColor: "#78350F",
            price: 190,
            visualType: "botanical",
            framePreference: "Oak"
          }
        ];

        // Randomly select or filter by mood
        const selected = fallbackCollections[Math.floor(Math.random() * fallbackCollections.length)];
        return res.json({
          status: "fallback",
          artwork: {
            ...selected,
            title: mood ? `${mood} - ${selected.title}` : selected.title
          }
        });
      }

      const prompt = `You are a professional gallery curator. Curate a completely unique, highly descriptive modern abstract artwork based on the mood constraint "${mood || "surprise me"}" and category "${stylePreference || "any"}".

Provide the output in valid structural JSON format with exactly these fields:
- title: A distinctive, evocative artistic title.
- description: A detailed, beautiful 2-3 sentence description of the artwork's visual elements, brushstrokes, composition, and mood.
- medium: The specific artistic medium used (e.g. 'Gold Leaf and Heavy Acrylic Impasto on French Linen Canvas' or 'Long Exposure Giclée Archive Print on Baryta Paper').
- primaryColor: A valid hexadecimal color code representing the dominant tone.
- secondaryColor: A valid hexadecimal color code representing the offset tone.
- tertiaryColor: A valid hexadecimal color code representing the accent highlight.
- price: A realistic pricing integer in USD between 150 and 2400.
- visualType: Must be exactly one of: 'geometric', 'cosmic', 'fluid', 'botanical', 'minimalist'.
- framePreference: Recommend a floating box frame. Must be exactly one of: 'Black', 'White', 'Oak', 'None'.

Be incredibly creative, distinct, and elegant. Do not wrap the JSON inside markdown code blocks like \`\`\`json. Return only the raw JSON string.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              medium: { type: Type.STRING },
              primaryColor: { type: Type.STRING },
              secondaryColor: { type: Type.STRING },
              tertiaryColor: { type: Type.STRING },
              price: { type: Type.INTEGER },
              visualType: { type: Type.STRING },
              framePreference: { type: Type.STRING }
            },
            required: [
              "title",
              "description",
              "medium",
              "primaryColor",
              "secondaryColor",
              "tertiaryColor",
              "price",
              "visualType",
              "framePreference"
            ]
          }
        }
      });

      const parsedStr = response.text ? response.text.trim() : "";
      const artObj = JSON.parse(parsedStr);

      res.json({
        status: "success",
        artwork: artObj
      });
    } catch (err: any) {
      console.error("Gemini API Error:", err.message);
      res.json({
        status: "error",
        message: err.message,
        // Safe hardcoded creative default in case of catastrophic parsing failures
        artwork: {
          title: "Symphony of Rust",
          description: "An evocative arrangement of textured iron oxides, oxidized coppers, and pale linen washes, highlighting raw industrial erosion.",
          medium: "Iron Powder, Acrylic Medium, and Linen Wash",
          primaryColor: "#C2410C",
          secondaryColor: "#0D9488",
          tertiaryColor: "#FAF7F0",
          price: 480,
          visualType: "geometric",
          framePreference: "Black"
        }
      });
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    // Development Mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production Mode
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server launched and running on http://localhost:${PORT}`);
  });
}

startServer();
