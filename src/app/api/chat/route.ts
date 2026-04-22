export const dynamic = 'force-dynamic';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      throw new Error("Missing GEMINI_API_KEY in .env file");
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-3-flash-preview",
      generationConfig: { responseMimeType: "application/json" }
    });

    const systemPrompt = `
    Role: Master Motion Graphics Director & Strict JSON Parser.
    User Topic/Command: "${prompt}"

    CRITICAL INSTRUCTION:
    1. STRICT LIMIT: You must generate EXACTLY ONE SCENE (a single template from the list) that best represents the user's prompt. DO NOT generate multiple scenes, intros, or outros unless the user explicitly types words like "slideshow", "sequence", or "multiple scenes". 
    2. If the User Prompt contains explicit instructions for templates, colors, text, or specific Image URLs, YOU MUST OBEY THEM EXACTLY. Do not invent your own story or alter the URLs if the user gave you a specific script. 
    3. Keep data concise. For example, if asked for top 3 items, use a single BAR_CHART or LISTICLE scene with those 3 items.

    AVAILABLE TEMPLATES & REQUIRED FIELDS:
    - LISTICLE: Numbered list. Use for "Top 5", "Rules", or generic tips. (Do NOT use for "roadmaps", "journeys", or "phases"). Uses 'headerText', 'chartData', and 'searchQuery'.
    - TRIPLE_SHOWCASE: 3D Gallery. BEST FOR visual portfolios, 3 distinct products, or image examples. DO NOT use for text-heavy tips. Uses 'cards' object.
    - TRIPLE_BUILD: 3 Pillars visualization. PERFECT for "3 pillars", "foundations", "core values", or 3 main concepts. Uses 'headerText', 'chartData' (exactly 3 items), and 'searchQuery'.
    - LINE_CHART: PERFECT for showing "growth", "trends", "history", or "changes over time" (e.g., years like 2020-2024). Uses 'headerText', 'chartData', and 'searchQuery'.
    - BAR_CHART: PERFECT for comparing different distinct items, entities, or categories (e.g., 5 different cars or companies). Uses 'headerText', 'chartData', and 'searchQuery'.
    - PUPPET_MASTER: Giant hand pulling strings. PERFECT for themes of "control", "manipulation", "mind", "psychology", or "invisible forces" (Overrides other templates if the prompt is about controlling). Uses 'chartData' (the items being controlled), 'handSpeed' (1-10), 'color', and 'brainColor'.
    - MINDSET_FLOW: Uses 'image1', 'image2', 'image3', 'bookImage' (URLs), 'tintColor'.
    - DARK_WEALTH: Uses 'topText1', 'mainText1', 'topText2', 'mainText2', 'cardImage', 'coinImage'.
    - KINETIC_SPEAKER: Big text behind subject. Break down the EXACT quote or phrase from the user's prompt into the 'chartData' array (e.g. if prompt is 'say NEVER GIVE UP', chartData should be [{label: 'NEVER', value: 0}, {label: 'GIVE UP', value: 1}]). Do NOT invent list items. Set 'value' to 1 for the MAIN highlighted words, and 0 for small supporting words. Uses 'searchQuery'.
    - HYPER_IMPACT: Uses 'headerText', 'backgroundImage', 'transition'.
    - MACRO_POUR: Uses 'headerText', 'logoUrl', 'transition'.
    - VERTICAL_SPLIT: Uses 'headerText', 'leftText', 'rightText', 'backgroundImage', 'backgroundImage2'.
    - PRODUCT_SHOWCASE: Uses 'headerText', 'backgroundImage'.
    - KINETIC_ROADMAP: Glowing horizon path with icons. PERFECT for "roadmaps", "journeys", "growth paths", or "milestones". (Use this instead of Listicle if the word 'roadmap' or 'path' is present). Uses 'headerText', 'chartData' (up to 4 milestones), and 'searchQuery'. *For 'AI Video', searchQuery should focus on 'professional video editing' or 'cinematography' to avoid generic grid backgrounds.*
    - KINETIC_STOMP, CHRONO, CHASE_ATTENTION, CROWD_SCALE, VERSUS: Use 'chartData' and 'searchQuery'.

    SCENE OBJECT SCHEMA (All fields are optional depending on the template):
    {
      "visualType": "STRING (e.g., TRIPLE_SHOWCASE)",
      "headerText": "STRING",
      "chartData": [{"label": "STRING", "value": NUMBER}],
      "imagePrompt": "STRING (Only if generating AI images, skip if URL is provided)",
      "backgroundImage": "STRING (URL)",
      "backgroundImage2": "STRING (URL)",
      "searchQuery": "STRING (e.g., 'supercars racing', short query for Pexels background)",
      "logoUrl": "STRING (URL)",
      "leftText": "STRING",
      "rightText": "STRING",
      "topText1": "STRING",
      "mainText1": "STRING",
      "topText2": "STRING",
      "mainText2": "STRING",
      "cardImage": "STRING (URL)",
      "coinImage": "STRING (URL)",
      "image1": "STRING (URL)",
      "image2": "STRING (URL)",
      "image3": "STRING (URL)",
      "bookImage": "STRING (URL)",
      "cards": {
        "slot1": { "type": "image", "src": "URL" },
        "slot2": { "type": "image", "src": "URL" },
        "slot3": { "type": "video", "src": "URL" }
      },
      "transition": "whip | fade | flash | zoom | blur | none | bubble_wipe | wave_wipe | ice_zoom"
    }

    STRICT JSON OUTPUT REQUIRED:
    {
      "isSequence": true,
      "videoTitle": "Catchy Title",
      "color": "Vibrant #HEX matching the brand (Use user's exact HEX if provided)",
      "scenes": [ 
        // Array of scene objects matching the schema above
      ],
      "captions": []
    }
    `;

    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const text = response.text();
    console.log("AI RESPONSE RAW:", text);

    // Robust JSON extraction
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("AI did not return valid JSON. Raw text:", text);
      return NextResponse.json({ error: "Invalid AI response format" }, { status: 500 });
    }

    try {
      const cleanJson = JSON.parse(jsonMatch[0]);
      return NextResponse.json(cleanJson);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError, "Cleaned text:", jsonMatch[0]);
      return NextResponse.json({ error: "Failed to parse AI data" }, { status: 500 });
    }
  } catch (error) {
    console.error("AI Error:", error);
    return NextResponse.json({ error: "Rate limit or parse error" }, { status: 500 });
  }
}
