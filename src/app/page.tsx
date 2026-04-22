"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGenerate = async () => {
    if (!prompt) {
      alert("Please provide a prompt to generate your graphic!");
      return;
    }

    setLoading(true);

    try {
      console.log("Pinging local Gemini API for Prompt-to-Graphic...");
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });
      
      if (!res.ok) throw new Error("Local Gemini API failed to generate graphic.");
      const aiData = await res.json();

      // Clean up Gemini's markdown backticks safely
      const cleanGeminiData = (data: any) => {
        if (!data) return [];
        if (typeof data !== 'string') return data; 
        try {
          return JSON.parse(data.replace(/```json/gi, '').replace(/```/gi, '').trim());
        } catch(e) {
          console.error("Failed to parse Gemini output:", data);
          return [];
        }
      };

      // SAVE TO LOCALSTORAGE FOR THE EDITOR
      const draftData = {
        visualType: "DYNAMIC_CANVAS",
        scenes: cleanGeminiData(aiData.scenes),
        captions: cleanGeminiData(aiData.captions || []),
        reactionVideoUrl: null // Disabled for Prompt-to-Graphic mode
      };

      localStorage.setItem("autoae_draft", JSON.stringify(draftData));
      
      // Redirect to editor
      window.location.href = "/editor";

    } catch (error) {
      console.error("AI Generation Error:", error);
      alert("Connection error! Check the console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-white p-6">
      <h1 className="text-6xl font-black mb-4 tracking-tight">AutoAE</h1>
      <p className="text-zinc-400 mb-12 text-xl">Turn your ideas into motion graphics instantly.</p>
      
      {/* ⚡ THE AI CREATOR INPUT AREA */}
      <div className="relative w-full max-w-2xl mx-auto flex flex-col gap-4">
        <div className="relative w-full shadow-2xl shadow-purple-900/20 rounded-xl">
          <input 
            type="text" 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !loading && handleGenerate()}
            placeholder="e.g. 3 fastest cars in 2026..." 
            className="w-full bg-zinc-900/80 border border-white/10 text-white rounded-xl py-6 pl-6 pr-40 focus:outline-none focus:border-purple-500 transition-colors text-lg"
          />
          
          <div className="absolute right-2 top-2 bottom-2">
            <button 
              onClick={handleGenerate}
              disabled={loading}
              className={`h-full bg-purple-600 hover:bg-purple-500 text-white font-bold px-8 rounded-lg transition-all flex items-center ${loading ? 'opacity-50 cursor-wait' : ''}`}
            >
              {loading ? "Generating... 🪄" : "Generate"}
            </button>
          </div>
        </div>
      </div>

      {/* 🧪 AI TEST BUTTON */}
      <button 
        onClick={() => {
          const testDraft = {
            isSequence: true,
            scenes: [
              { visualType: "AI_TEST", headerText: "Scene 1" },
              { visualType: "AI_TEST", headerText: "Scene 2" }
            ],
            color: "#a855f7"
          };
          localStorage.setItem("autoae_draft", JSON.stringify(testDraft));
          router.push("/editor");
        }}
        className="mt-12 bg-zinc-900 hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 border border-white/5 font-bold py-3 px-8 rounded-xl transition-all flex items-center gap-2 text-sm"
      >
        <span>🧪</span> RUN ENGINE TEST
      </button>
    </div>
  );
}