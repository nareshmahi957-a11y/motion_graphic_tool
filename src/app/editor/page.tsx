"use client";

import React, { useState, Suspense, useEffect } from "react";
import { Player } from "@remotion/player";
import { MasterSequence } from "../../templates/Animations";
import { loadFont as loadMontserrat } from '@remotion/google-fonts/Montserrat';
import { loadFont as loadBebas } from '@remotion/google-fonts/BebasNeue';
import { loadFont as loadPoppins } from '@remotion/google-fonts/Poppins';
import { getTemplateConfig, getDefaultActiveLayers } from "../../config/templateConfig";

// --- 1. DEFINING TYPES ---
interface ChartItem {
  label: string;
  value?: number;
  [key: string]: any;
}

interface Scene {
  visualType: string;
  headerText?: string;
  chartData: ChartItem[];
  color?: string;
  sceneBgColor?: string; // ? NEW: Dedicated background color
  backgroundImage?: string;
  backgroundImage2?: string; 
  leftText?: string; 
  rightText?: string; 
  transition?: "whip" | "fade" | "flash" | "zoom" | "blur" | "none" | "bubble_wipe" | "wave_wipe" | "ice_zoom";
  imagePrompt?: string; 
  logoUrl?: string; // ?? BRAND LOGO SUPPORT ADDED
  customFontSize?: number; // ?? ADD THIS LINE!
  title?: string; // ?? BOOK REVEAL PROPS
  author?: string;
  number?: string;
  coverImage?: string;
  fontColor?: string; // ?? FONT COLOR FOR BOOK REVEAL
  fontSize?: number; // ?? FONT SIZE SCALE FOR BOOK REVEAL
  numberColor?: string; // ?? GIANT NUMBER COLOR FOR BOOK REVEAL
  bgGradientColor?: string; // ?? BACKGROUND GRADIENT COLOR FOR NEON CONCEPT
  topFontSize?: number; // ?? TOP TEXT SIZE FOR NEON CONCEPT
  bottomFontSize?: number; // ?? BOTTOM TEXT SIZE FOR NEON CONCEPT
  topFontColor?: string; // ?? TOP TEXT COLOR FOR NEON CONCEPT
  bottomFontColor?: string; // ?? BOTTOM TEXT COLOR FOR NEON CONCEPT
  diamondColor?: string; // ?? DIAMOND GLOW COLOR FOR NEON CONCEPT
  pillarColorLeft?: string; // ?? LEFT PILLAR COLOR FOR NEON CONCEPT
  pillarColorCenter?: string; // ?? CENTER PILLAR COLOR FOR NEON CONCEPT
  pillarColorRight?: string; // ?? RIGHT PILLAR COLOR FOR NEON CONCEPT
  icons?: string[]; // ??? ROADMAP ICONS FOR KINETIC ROADMAP
  fontFamily?: string; // ?? FONT FAMILY SELECTOR
  topText1?: string; // ?? DARK WEALTH - TOP TEXT 1
  mainText1?: string; // ?? DARK WEALTH - MAIN TEXT 1 ("MONEY")
  topText2?: string; // ?? DARK WEALTH - TOP TEXT 2
  mainText2?: string; // ?? DARK WEALTH - MAIN TEXT 2 ("RICH")
  cardImage?: string; // ?? DARK WEALTH - BLACK CARD IMAGE
  coinImage?: string; // ?? DARK WEALTH - GOLD COIN IMAGE
  noteImage?: string; // ?? DARK WEALTH - CURRENCY NOTE IMAGE
  subText?: string; // ?? PUPPET MASTER - SUBTITLE TEXT
  brainColor?: string; // ?? PUPPET MASTER - BRAIN COLOR (NEW)
  handSpeed?: number; // ?? PUPPET MASTER - HAND MOTION VELOCITY (1-10)
  stringTension?: number; // ?? PUPPET MASTER - STICK SNAP/VIBRATION (1-100)
  handImage?: string; // ?? PUPPET MASTER - CUSTOM HAND IMAGE (NEW)
  handSize?: number; // ?? PUPPET MASTER - HAND SIZE (px)
  handX?: number; // ?? PUPPET MASTER - HAND X OFFSET (px)
  handY?: number; // ?? PUPPET MASTER - HAND Y OFFSET (px)
  handRotation?: number; // ? NEW: PUPPET MASTER - HAND ROTATION
  showLightning?: boolean; // ? BOOK REVEAL - LIGHTNING EFFECT TOGGLE
  image1?: string; // ?? MINDSET FLOW - IMAGE 1
  image2?: string; // ?? MINDSET FLOW - IMAGE 2
  image3?: string; // ?? MINDSET FLOW - IMAGE 3
  bookImage?: string; // ?? MINDSET FLOW - BOOK IMAGE
  img1Size?: number; // ?? MINDSET FLOW - IMAGE 1 SIZE (px)
  img2Size?: number; // ?? MINDSET FLOW - IMAGE 2 SIZE (px)
  img3Size?: number; // ?? MINDSET FLOW - IMAGE 3 SIZE (px)
  img1Y?: number; // ?? MINDSET FLOW - IMAGE 1 Y OFFSET (px)
  img2Y?: number; // ?? MINDSET FLOW - IMAGE 2 Y OFFSET (px)
  img3Y?: number; // ?? MINDSET FLOW - IMAGE 3 Y OFFSET (px)
  tintColor?: string; // ?? MINDSET FLOW - IMAGE DUOTONE TINT COLOR
  reelSpeed?: number; // ??? PANORAMIC REEL - SCROLL SPEED (1-15)
  framesPerStage?: number; // ⚡ PENTAGON_FLOW - STAGE DURATION (45-150 frames)
  status?: "neutral" | "correct" | "wrong"; // ?? COMPARISON_PENTAGON - STATUS ICON
  // ?? PUPPET MASTER - ADVANCED JOINT ASSEMBLY
  palmX?: number; palmY?: number; palmSize?: number;
  f1X?: number; f1Y?: number; f1Size?: number; f1RotOffset?: number; f1Twitch?: number;
  f2X?: number; f2Y?: number; f2Size?: number; f2RotOffset?: number; f2Twitch?: number;
  f3X?: number; f3Y?: number; f3Size?: number; f3RotOffset?: number; f3Twitch?: number;
  f4X?: number; f4Y?: number; f4Size?: number; f4RotOffset?: number; f4Twitch?: number;
  // ?? PUPPET MASTER - STRING ATTACHMENT POINTS
  s1X?: number; s1Y?: number; // String 1 (Index)
  s2X?: number; s2Y?: number; // String 2 (Middle)
  s3X?: number; s3Y?: number; // String 3 (Ring)
  s4X?: number; s4Y?: number; // String 4 (Pinky)
}

interface VideoState {
  isSequence: boolean;
  scenes: Scene[];
  color: string;
  scale: number;
  layout: "vertical" | "horizontal";
  searchQuery?: string;
  backgroundImage?: string;
  layoutMode: "full" | "split"; // ?? ADD THIS
  reactionVideoUrl?: string;    // ?? ADD THIS
  [key: string]: any; 
}

function EditorContent() {
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [isRendering, setIsRendering] = useState(false);
  const [backgroundMode, setBackgroundMode] = useState('black'); // 'black', 'transparent', or 'green'
  const [activeLayers, setActiveLayers] = useState<Record<string, boolean>>({}); // Dynamic per-template
  const [showExportModal, setShowExportModal] = useState(false);
  const [inputProps, setInputProps] = useState<VideoState>({
    isSequence: true,
    scenes: [
      { 
        visualType: "KINETIC_STOMP", 
        headerText: "STARTUP TRUTH", 
        chartData: [{ label: "90% FAIL" }] 
      }
    ],
    color: "#a855f7",
    scale: 1,
    layout: "vertical",
    layoutMode: "full",      // ?? ADD THIS
    reactionVideoUrl: "",    // ?? ADD THIS
    captions: []             // 🟢 ADD THIS LINE
  });

  // ?? Robust draft loading logic
  React.useEffect(() => {
    try {
      const draft = localStorage.getItem("autoae_draft");
      if (draft) {
        const parsed = JSON.parse(draft);
        if (parsed && parsed.scenes && parsed.scenes.length > 0) {
          setInputProps((prev: VideoState) => ({
            ...prev,
            isSequence: true,
            scenes: parsed.scenes,
            color: parsed.color || prev.color,
            videoTitle: parsed.videoTitle || "Untitled Video",
            captions: parsed.captions || [], // ⚡ CRITICAL: Grab the captions from the draft!
            // 🟢 THE FIX: Tell the editor to load the video URL!
            reactionVideoUrl: parsed.reactionVideoUrl || ""
          }));
        } else if (parsed && parsed.visualType) {
          setInputProps((prev: VideoState) => ({
            ...prev,
            isSequence: false,
            scenes: [{
              visualType: parsed.visualType,
              headerText: parsed.headerText || "",
              chartData: parsed.chartData || [],
            }],
            color: parsed.color || prev.color,
            captions: parsed.captions || [], // ⚡ CRITICAL: Grab the captions from the draft!
            // 🟢 THE FIX: Tell the editor to load the video URL here too!
            reactionVideoUrl: parsed.reactionVideoUrl || ""
          }));
        }
      }
    } catch (err) {
      console.error("Failed to load draft:", err);
    }
  }, []);

  const activeScene = inputProps.scenes[activeSceneIndex] || inputProps.scenes[0];
  const currentTemplate = getTemplateConfig(activeScene?.visualType || "BAR_CHART");

  // ?? Update active layers when template changes
  useEffect(() => {
    const templateId = activeScene?.visualType || "BAR_CHART";
    setActiveLayers(getDefaultActiveLayers(templateId));
  }, [activeScene?.visualType]);

  // ?? Toggle a specific layer
  const toggleLayer = (layerId: string) => {
    setActiveLayers(prev => ({
      ...prev,
      [layerId]: !prev[layerId]
    }));
  };

  // 🟢 NEW: Simplified render function for the export button
  const handleRenderAndExport = async () => {
    setIsRendering(true);
    
    try {
      // Calculate total duration. (Assuming 150 frames per scene for standard templates)
      const totalScenes = inputProps.scenes?.length || 1;
      let duration = totalScenes * 150;
      
      // Handle the Pentagon Flow slider exception if it exists
      if (inputProps.scenes?.[0]?.visualType === "PENTAGON_FLOW") {
        duration = (inputProps.scenes[0].chartData?.length || 3) * (inputProps.scenes[0].framesPerStage || 150);
      }

      const response = await fetch("/api/render", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inputProps: inputProps, 
          durationInFrames: duration,
          exportType: "standard" // Start with standard MP4!
        }),
      });

      const data = await response.json();

      if (data.url) {
        // Create a hidden link to force the browser to download the file
        const a = document.createElement('a');
        a.href = data.url;
        a.download = `AutoAE-Export-${Date.now()}.mp4`; 
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        alert("Render failed: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Render request failed:", error);
      alert("Failed to connect to the render server.");
    } finally {
      setIsRendering(false);
    }
  };

  const calculateDuration = (scenes: Scene[]) => {
    const calculateSceneDuration = (scene: Scene) => {
      const type = scene.visualType;
      // ⚡ Set this back to 120 (4 seconds) since each scene handles itself now!
      if (type === "AI_TEST") return 120;
      if (type === "CHASE_ATTENTION") return 60;
      if (type === "KINETIC_STOMP") return (scene.chartData?.length || 1) * 45 + 30;
      if (["CHART_CRASH", "CROWD_SCALE", "PRODUCT_SHOWCASE"].includes(type)) return 270;
      if (["TRIPLE_BUILD", "CAPITAL_VS_ATTENTION", "CHRONO", "VERSUS", "LINE_CHART", "DARK_WEALTH", "PUPPET_MASTER", "FOCUS"].includes(type)) return 150;
      if (type === "BOOK_REVEAL") return 120; // ? Decreased from 180 to 120 (4 seconds)
      if (type === "KINETIC_ROADMAP") return 120; // ? SET TO 4 SECONDS
      if (type === "MINDSET_FLOW") return 180; // ?? 6 seconds for camera pan
      if (type === "PANORAMIC_REEL") return 150; // ??? 5 seconds for horizon slide
      if (type === "KINETIC_SPEAKER") return 90;
      return 120; // fallback
    };
    return scenes.reduce((acc, scene) => acc + calculateSceneDuration(scene), 0) || 600;
  };

  // ?? Update the function signature to handle standard MP4, layered ZIP, and AE script exports
  const handleDownload = async (exportType: "standard" | "layered" | "aescript" | "davinci" = "standard") => {
    if (isRendering) return;
    setIsRendering(true);
    try {
      
      // Determine which layers to export if it's a layered request
      let layersToExport: string[] = [];
      if (exportType === "layered") {
        layersToExport = currentTemplate.availableLayers.map(l => l.id);
      }

      const res = await fetch("/api/render", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: "Main",
          inputProps: { 
            ...inputProps,
            // ? CRITICAL: Send the current sidebar toggle states to the server!
            activeLayers: activeLayers,
            backgroundMode: backgroundMode
          },
          durationInFrames: calculateDuration(inputProps.scenes),
          exportType: exportType,           
          layersToExport: layersToExport    
        }),
      });
      const data = await res.json();
      if (data.url) {
        const link = document.createElement("a");
        link.href = data.url;
        
        let downloadName = "AutoAE-Video.mp4";
        if (exportType === "layered") downloadName = "Layered-Assets.zip";
        if (exportType === "aescript") downloadName = "AutoAE-AE-Project.zip";
        if (exportType === "davinci") downloadName = "AutoAE-DaVinci-Project.zip";
        
        link.download = downloadName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsRendering(false);
    }
  };
  // 🟢 SMART PLAYER DURATION: Bulletproof Caption Parsing!
  let dynamicDuration = 150; // Fallback default
  let safeCaptions = inputProps?.captions || [];

  if (typeof safeCaptions === 'string') {
    try { safeCaptions = JSON.parse(safeCaptions); } 
    catch (e) { safeCaptions = []; }
  }

  const normalizedCaptions = Array.isArray(safeCaptions) ? safeCaptions.map((word: any) => ({
    ...word,
    start: Number(word.start || word.startTime || 0),
    end: Number(word.end || word.endTime || 0)
  })) : [];

  // 🚀 ONLY use caption duration if we actually have a base video to sync with!
  if (inputProps.reactionVideoUrl && normalizedCaptions.length > 0) {
    const lastCaption = normalizedCaptions[normalizedCaptions.length - 1];
    dynamicDuration = Math.max(150, Math.ceil((lastCaption.end / 1000) * 30) + 30);
  } else {
    // 🚀 Otherwise, use standard template lengths (perfect for Prompt-to-Graphic)
    dynamicDuration = calculateDuration(inputProps.scenes);
  }

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white overflow-hidden font-sans">
      <aside className="w-80 bg-[#111] border-r border-white/10 p-6 flex flex-col gap-6 shadow-2xl overflow-y-auto custom-scrollbar">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-purple-600 rounded-lg"></div>
          <h1 className="text-xl font-black uppercase italic">AutoAE PRO</h1>
        </div>

        {/* ?? LAYERS & VISIBILITY PANEL */}
        <div className="bg-gray-900 p-4 rounded-lg mb-6 text-white">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
            Layers & Visibility
          </h3>

          <div className="flex flex-col gap-2">
            
            {/* Universal Background Toggle (Every template needs this) */}
            <div className="flex items-center justify-between bg-gray-800 p-2 rounded">
              <span className="text-sm">Background</span>
              <select 
                className="bg-gray-700 text-xs p-1 rounded border-none outline-none cursor-pointer"
                value={backgroundMode}
                onChange={(e) => setBackgroundMode(e.target.value)}
              >
                <option value="black">? Black</option>
                <option value="green">?? Green Screen</option>
                <option value="transparent">?? Transparent</option>
              </select>
            </div>

            {/* Dynamic Template Layers */}
            {currentTemplate.availableLayers.map((layer) => {
              const isVisible = activeLayers[layer.id] !== false;
              return (
                <div key={layer.id} className="flex items-center justify-between bg-zinc-900/80 border border-white/5 p-2 rounded">
                  <span className="text-xs font-bold text-zinc-300">{layer.label}</span>
                  <button 
                    onClick={() => toggleLayer(layer.id)}
                    className={`text-[9px] px-2 py-1 rounded font-black tracking-widest transition-all ${isVisible ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-white/5 text-zinc-600 border border-white/5'}`}
                  >
                    {isVisible ? '👁️ ON' : '🙈 OFF'}
                  </button>
                </div>
              );
            })}

          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Timeline</h3>
            <button 
              onClick={() => {
                const newScene: Scene = { visualType: "BAR_CHART", headerText: "New Scene", chartData: [] };
                setInputProps((prev: VideoState) => ({ ...prev, scenes: [...prev.scenes, newScene] }));
                setActiveSceneIndex(inputProps.scenes.length);
              }}
              className="text-[10px] font-bold text-purple-400"
            >+ ADD SCENE</button>
          </div>
          <div className="flex gap-2 items-center overflow-x-auto pb-2 custom-scrollbar">
            {inputProps.scenes.map((scene: Scene, i: number) => (
              <React.Fragment key={i}>
                {i > 0 && (
                  <div className="flex flex-col items-center gap-1 group">
                    <select 
                      value={inputProps.scenes[i - 1].transition || "whip"}
                      onChange={(e) => {
                        const newScenes = [...inputProps.scenes];
                        newScenes[i - 1].transition = e.target.value as any;
                        setInputProps(prev => ({ ...prev, scenes: newScenes }));
                      }}
                      className="bg-zinc-800 text-[8px] text-zinc-400 border border-white/5 rounded px-1 outline-none hover:border-purple-500/50 transition-all cursor-pointer"
                    >
                      <option value="whip">WHIP PAN</option>
                      <option value="fade">CROSS FADE</option>
                      <option value="flash">WHITE FLASH</option>
                      <option value="zoom">CINEMATIC ZOOM</option>
                      <option value="blur">SOFT BLUR</option>
                      <option value="none">HARD CUT</option>
                      <option value="bubble_wipe">?? BUBBLE WIPE</option>
                      <option value="ice_zoom">?? Ice Zoom In</option>
                      <option value="wave_wipe">?? Wave Wipe</option>
                    </select>
                    <div className="w-0.5 h-4 bg-zinc-800 group-hover:bg-purple-500/30 transition-colors" />
                  </div>
                )}
                <div className="relative group flex-shrink-0">
                  <button
                    onClick={() => setActiveSceneIndex(i)}
                    className={`px-4 py-2 rounded-lg text-[10px] font-black transition-all ${
                      activeSceneIndex === i ? "bg-purple-600 text-white" : "bg-zinc-900 text-zinc-500 border border-white/5"
                    }`}
                  >SCENE {i + 1}</button>
                  {inputProps.scenes.length > 1 && (
                    <button 
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        const newScenes = inputProps.scenes.filter((__, idx) => idx !== i);
                        setInputProps((prev: VideoState) => ({ ...prev, scenes: newScenes }));
                        setActiveSceneIndex(Math.max(0, i - 1));
                      }}
                      className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-[8px] opacity-0 group-hover:opacity-100 transition-opacity"
                    >?</button>
                  )}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* 📚 TEMPLATE LIBRARY BOX */}
        <div className="mb-4 bg-zinc-900/40 border border-white/5 rounded-xl p-4 shadow-lg">
          <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3 px-1">Template Library</h3>
          
          {/* Scrollable Container limited to exactly 4 rows (~8 templates) */}
          <div className="grid grid-cols-2 gap-2 max-h-[260px] overflow-y-auto pr-2 custom-scrollbar pb-2">
            {([
              { id: "AI_TEST", label: "🤖 AI TEST", icon: "🧪", desc: "DYNAMIC JSON RENDERER" },
              { id: "KINETIC_SPEAKER", label: "SPEAKER", icon: "📢", desc: "WORD POP" },
              { id: "PUPPET_MASTER", label: "PUPPET", icon: "🎭", desc: "BRAIN STRINGS" },
              { id: "FOCUS", label: "FOCUS", icon: "🎯", desc: "PROGRESS BAR" },
              { id: "NEON_CONCEPT", label: "NEON", icon: "💎", desc: "DIAMOND & PILLAR" },
              { id: "BOOK_REVEAL", label: "BOOK", icon: "📖", desc: "3D BOOK REVEAL" },
              { id: "KINETIC_ROADMAP", icon: "🛣️", label: "ROADMAP", desc: "LINE + ICONS" },
              { id: "HYPER_IMPACT", label: "HYPER POP", icon: "💥", desc: "BOTTLE + IMPACT" },
              { id: "MACRO_POUR", label: "THE POUR", icon: "🥤", desc: "MACRO ZOOM" },
              { id: "KINETIC_STOMP", label: "STOMP", icon: "⚡", desc: "AGGRESSIVE HOOK" },
              { id: "CHRONO", label: "CINEMATIC", icon: "🎬", desc: "PRODUCT REVEAL" },
              { id: "PRODUCT_SHOWCASE", label: "SHOWCASE", icon: "✨", desc: "FEATURE FOCUS" },
              { id: "TRIPLE_BUILD", label: "3 PILLARS", icon: "🏛️", desc: "CORE VALUES" },
              { id: "CHASE_ATTENTION", label: "CHASE", icon: "🏃", desc: "PRIORITY SHIFT" },
              { id: "VERSUS", label: "VERSUS", icon: "⚔️", desc: "A VS B SPLIT" },
              { id: "VERTICAL_SPLIT", label: "SPLIT SCREEN", icon: "🔲", desc: "TOP / BOTTOM" },
              { id: "ICE_BUCKET", label: "ICE BUCKET", icon: "❄️", desc: "FLAT LAY" },
              { id: "FESTIVAL_CROWD", label: "NIGHT FESTIVAL", icon: "🎡", desc: "AERIAL DRONE" },
              { id: "BAR_CHART", label: "BAR CHART", icon: "📊", desc: "DATA METRICS" },
              { id: "LINE_CHART", label: "LINE CHART", icon: "📈", desc: "TREND GROWTH" },
              { id: "CROWD_SCALE", label: "SCALE", icon: "👥", desc: "1 VS 1 MILLION" },
              { id: "CHART_CRASH", label: "CRASH", icon: "📉", desc: "FAILING METRICS" },
              { id: "STAMP_CHECKLIST", label: "CHECKLIST", icon: "✅", desc: "HARSH TRUTHS" },
              { id: "CAROUSEL", label: "CAROUSEL", icon: "🎠", desc: "PROCESS FLOW" },
              { id: "NETWORK", label: "NETWORK", icon: "🕸️", desc: "NODE SYSTEMS" },
              { id: "CHAT", label: "CHAT", icon: "💬", desc: "TEXT MESSAGES" },
              { id: "LISTICLE", label: "LISTICLE", icon: "📝", desc: "TOP 5 COUNT" },
              { id: "CAPITAL", label: "CAPITAL", icon: "💰", desc: "INVESTMENT" },
              { id: "DARK_WEALTH", label: "DARK WEALTH", icon: "🤑", desc: "3D PARALLAX FLIP" },
              { id: "MINDSET_FLOW", label: "MINDSET", icon: "🧠", desc: "HABIT JOURNEY" },
              { id: "PANORAMIC_REEL", label: "REEL", icon: "🎞️", desc: "HORIZON SLIDE" },
              { id: "PENTAGON_FLOW", label: "PENTA FLOW", icon: "⬠", desc: "CIRCULAR COMPARE" }

              ]).map((tpl) => (
              <button
                key={tpl.id}
                title={tpl.desc}
                onClick={() => {
                  const newType = tpl.id;
                  const newScenes = [...inputProps.scenes];
                  newScenes[activeSceneIndex].visualType = newType;
                  
                  // 🤖 AI_TEST needs no special setup - uses DynamicSceneRenderer directly
                  if (newType === "AI_TEST") {
                    // Just set the type, DynamicSceneRenderer handles the rest
                  }
                  // ?? Default data for charts
                  else if (["BAR_CHART", "LINE_CHART", "CHART_CRASH", "CROWD_SCALE"].includes(newType)) {
                     newScenes[activeSceneIndex].chartData = [
                       { label: "Item 1", value: 10 },
                       { label: "Item 2", value: 80 }
                     ];
                  }
                  // ??? Default data for KINETIC_SPEAKER
                  else if (newType === "KINETIC_SPEAKER") {
                    newScenes[activeSceneIndex].chartData = [
                      { label: "Iss video main tumhain", value: 0 }, // 0 = Small white text
                      { label: "10 Powerful", value: 1 },            // 1 = Giant glowing text
                      { label: "books", value: 0 }
                    ];
                  }
                  // ?? Default data for NEON_CONCEPT
                  else if (newType === "NEON_CONCEPT") {
                    newScenes[activeSceneIndex].headerText = "These will teach you";
                    newScenes[activeSceneIndex].leftText = "10 powerful skills";
                    newScenes[activeSceneIndex].backgroundImage = ""; // Forces it to load the safe 3D Diamond
                  }
                  // ?? Default data for BOOK_REVEAL
                  else if (newType === "BOOK_REVEAL") {
                    newScenes[activeSceneIndex].number = "1";
                    newScenes[activeSceneIndex].coverImage = "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop";
                  }
                  // ?? Default data for DARK WEALTH
                  else if (newType === "DARK_WEALTH") {
                    newScenes[activeSceneIndex].topText1 = "Kis trah khel skte ho";
                    newScenes[activeSceneIndex].mainText1 = "MONEY";
                    newScenes[activeSceneIndex].topText2 = "How can you become";
                    newScenes[activeSceneIndex].mainText2 = "RICH";
                    newScenes[activeSceneIndex].cardImage = "https://cdn.pixabay.com/photo/2021/07/22/11/04/credit-card-6485023_1280.png";
                    newScenes[activeSceneIndex].coinImage = "https://cdn.pixabay.com/photo/2021/04/30/16/47/bitcoin-6219253_1280.png";
                    newScenes[activeSceneIndex].noteImage = "https://cdn.pixabay.com/photo/2016/09/22/16/38/money-1687705_1280.png";
                  }
                  else if (newType === "PUPPET_MASTER") {
                    newScenes[activeSceneIndex].chartData = [
                      { label: "Influence", value: 0 },
                      { label: "Master Mind", value: 1 },
                      { label: "Control", value: 0 }
                    ];
                    // Inject perfect starting values
                    newScenes[activeSceneIndex].handSize = 600;
                    newScenes[activeSceneIndex].handX = -138;
                    newScenes[activeSceneIndex].handY = -182;
                    newScenes[activeSceneIndex].handRotation = 6;
                    newScenes[activeSceneIndex].handSpeed = 1;
                    newScenes[activeSceneIndex].stringTension = 1;
                  }
                  else if (newType === "MINDSET_FLOW") {
                    newScenes[activeSceneIndex].image1 = "";
                    newScenes[activeSceneIndex].image2 = "";
                    newScenes[activeSceneIndex].image3 = "";
                    newScenes[activeSceneIndex].bookImage = "";
                    newScenes[activeSceneIndex].img1Size = 380;
                    newScenes[activeSceneIndex].img2Size = 380;
                    newScenes[activeSceneIndex].img3Size = 380;
                    newScenes[activeSceneIndex].img1Y = 0;
                    newScenes[activeSceneIndex].img2Y = 0;
                    newScenes[activeSceneIndex].img3Y = 0;
                    newScenes[activeSceneIndex].tintColor = "#00d4ff";
                  }
                  else if (newType === "PANORAMIC_REEL") {
                    newScenes[activeSceneIndex].chartData = [
                      { label: "VILLAGE", image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800" },
                      { label: "CITY", image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800" },
                      { label: "CONSTRUCTION", image: "https://images.unsplash.com/photo-1503387762-592dea58ef23?w=800" }
                    ];
                  }
                  else if (newType === "PENTAGON_FLOW") {
                    newScenes[activeSceneIndex].chartData = [
                      { label: "BRICKS", status: "neutral", image: "" },
                      { label: "IRON", status: "wrong", image: "" },
                      { label: "CEMENT", status: "correct", image: "" }
                    ];
                  }

                  setInputProps((prev: any) => ({ ...prev, scenes: newScenes }));
                }}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all text-center relative group ${
                  activeScene.visualType === tpl.id 
                    ? 'bg-gradient-to-br from-purple-500/20 to-purple-900/10 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.15)]' 
                    : 'bg-black/50 border-white/5 hover:bg-zinc-800 hover:border-white/20'
                }`}
              >
                {activeScene.visualType === tpl.id && (
                  <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full pointer-events-none" />
                )}
                
                <div className="flex flex-col items-center gap-1 z-10 w-full">
                  <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">{tpl.icon}</span>
                  
                  {/* Default Label (Hides on hover) */}
                  <span className={`text-[9px] font-bold uppercase tracking-wider group-hover:hidden ${activeScene.visualType === tpl.id ? 'text-purple-300' : 'text-zinc-300'}`}>
                    {tpl.label}
                  </span>
                  
                  {/* Hover Description (Shows on hover) */}
                  <span className="text-[8px] font-bold text-cyan-400 uppercase tracking-widest hidden group-hover:block text-center leading-tight">
                    {tpl.desc}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>


        {/* ?? STANDARD HEADER TEXT (Hidden for custom scenes) */}
        {activeScene.visualType !== "BOOK_REVEAL" && activeScene.visualType !== "NEON_CONCEPT" && activeScene.visualType !== "KINETIC_SPEAKER" && (
          <div className="mb-4">
            <label className="block text-[10px] font-bold text-zinc-500 mb-2">SCENE HEADER</label>
            <input 
              type="text" 
              value={activeScene.headerText ?? ""} 
              onChange={(e) => {
                const newScenes = [...inputProps.scenes];
                newScenes[activeSceneIndex] = { ...newScenes[activeSceneIndex], headerText: e.target.value };
                setInputProps((prev: VideoState) => ({ ...prev, scenes: newScenes }));
              }}
              className="w-full bg-zinc-900 border border-white/10 rounded p-3 text-sm text-white"
            />
          </div>
        )}

        {/* ? GLOBAL FONT SELECTOR (Visible for all templates!) */}
        <div className="mb-4 bg-zinc-900/60 border border-white/10 rounded-xl p-4 shadow-lg border-l-4 border-l-cyan-500">
          <label className="block text-[10px] font-bold text-zinc-500 mb-2 uppercase tracking-widest">
            Global Font Style
          </label>
          <select 
            value={activeScene.fontFamily || "Montserrat"} 
            onChange={(e) => {
              const fontName = e.target.value;
              const newScenes = [...inputProps.scenes];
              newScenes[activeSceneIndex] = { 
                ...newScenes[activeSceneIndex], 
                fontFamily: fontName 
              };
              setInputProps((prev: VideoState) => ({ ...prev, scenes: newScenes }));
              
              // Load the font immediately when clicked
              if (fontName === 'Bebas Neue') loadBebas();
              if (fontName === 'Poppins') loadPoppins();
              if (fontName === 'Montserrat') loadMontserrat();
            }}
            className="w-full bg-zinc-950 border border-white/10 rounded p-3 text-xs text-white appearance-none cursor-pointer focus:border-cyan-500 transition-colors"
          >
            <option value="Montserrat">Montserrat (Clean & Modern)</option>
            <option value="Bebas Neue">Bebas Neue (Tall & Cinematic)</option>
            <option value="Poppins">Poppins (Soft & Friendly)</option>
            <option value="'Arial Black', Arial, sans-serif">Arial Black (System Default)</option>
          </select>
        </div>

        {/* 📊 CHART / LIST DATA CONTROLS */}
        {["BAR_CHART", "LINE_CHART", "CHART_CRASH", "CROWD_SCALE", "VERSUS", "TRIPLE_BUILD", "LISTICLE"].includes(activeScene.visualType) && (
          <div className="mb-4 bg-zinc-900/40 border border-white/5 rounded-xl p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                {activeScene.visualType === "LISTICLE" ? "📝 List Items" : "📊 Chart Data"}
              </h3>
              {activeScene.visualType !== "LISTICLE" && (
                <span className="text-[9px] text-zinc-600 bg-zinc-900 px-2 py-1 rounded">Auto-Scaling</span>
              )}
            </div>
            
            {/* Value Formatting (Hidden for Listicles) */}
            {activeScene.visualType !== "LISTICLE" && (
              <div className="flex gap-2 mb-4 p-2 bg-black/30 rounded border border-white/5">
                <div className="flex-1">
                  <label className="block text-[8px] font-bold text-zinc-500 mb-1 uppercase">Prefix</label>
                  <input 
                    type="text" 
                    value={activeScene.prefix || ""} 
                    onChange={(e) => {
                      const newScenes = [...inputProps.scenes];
                      newScenes[activeSceneIndex] = { ...newScenes[activeSceneIndex], prefix: e.target.value };
                      setInputProps((prev: any) => ({ ...prev, scenes: newScenes }));
                    }}
                    className="w-full bg-zinc-950 border border-white/10 rounded px-2 py-1.5 text-xs text-white"
                    placeholder="e.g. $"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-[8px] font-bold text-zinc-500 mb-1 uppercase">Suffix</label>
                  <input 
                    type="text" 
                    value={activeScene.suffix || ""} 
                    onChange={(e) => {
                      const newScenes = [...inputProps.scenes];
                      newScenes[activeSceneIndex] = { ...newScenes[activeSceneIndex], suffix: e.target.value };
                      setInputProps((prev: any) => ({ ...prev, scenes: newScenes }));
                    }}
                    className="w-full bg-zinc-950 border border-white/10 rounded px-2 py-1.5 text-xs text-white"
                    placeholder="e.g. % or M"
                  />
                </div>
              </div>
            )}

            {/* Dynamic Data Rows */}
            <div className="flex flex-col gap-2">
              {activeScene.chartData?.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center gap-2 group relative">
                  {/* Remove Button */}
                  <button 
                    onClick={() => {
                      const newScenes = [...inputProps.scenes];
                      newScenes[activeSceneIndex].chartData.splice(idx, 1);
                      setInputProps((prev: any) => ({ ...prev, scenes: newScenes }));
                    }}
                    className="absolute -left-2 -top-2 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-[8px] opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  >✕</button>

                  <input 
                    type="text" 
                    value={item.label}
                    onChange={(e) => {
                      const newScenes = [...inputProps.scenes];
                      newScenes[activeSceneIndex].chartData[idx].label = e.target.value;
                      setInputProps((prev: any) => ({ ...prev, scenes: newScenes }));
                    }}
                    className="flex-[2] bg-zinc-900 border border-white/10 rounded p-2 text-xs text-white"
                    placeholder="Label..."
                  />
                  <input 
                    type="number" 
                    value={item.value ?? 0}
                    onChange={(e) => {
                      const newScenes = [...inputProps.scenes];
                      newScenes[activeSceneIndex].chartData[idx].value = Number(e.target.value);
                      setInputProps((prev: any) => ({ ...prev, scenes: newScenes }));
                    }}
                    className="flex-[1] bg-zinc-900 border border-white/10 rounded p-2 text-xs text-white text-center font-mono"
                    placeholder="Value..."
                  />
                </div>
              ))}
            </div>

            {/* Add Row Button */}
            <button
              onClick={() => {
                const newScenes = [...inputProps.scenes];
                if (!newScenes[activeSceneIndex].chartData) newScenes[activeSceneIndex].chartData = [];
                newScenes[activeSceneIndex].chartData.push({ label: "New Item", value: 50 });
                setInputProps((prev: any) => ({ ...prev, scenes: newScenes }));
              }}
              className="w-full mt-3 py-2 border border-dashed border-white/20 text-zinc-500 rounded-lg text-[10px] font-bold hover:bg-white/5 hover:text-white transition-colors"
            >
              + ADD DATA ROW
            </button>
          </div>
        )}

        {/* ???? KINETIC SPEAKER: CUSTOM TEXT & FONT SIZE UI */}
        {(activeScene.visualType === "KINETIC_SPEAKER" || activeScene.visualType === "PUPPET_MASTER") && (
          <div className="mb-4 bg-zinc-900/40 border border-white/5 rounded-xl p-4">
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Speaker Text & Size</h3>
            {/* ??? Font Size Slider */}
            <div className="mb-4">
              <label className="flex justify-between text-[10px] font-bold text-zinc-400 mb-2">
                <span>HIGHLIGHT FONT SIZE</span>
                <span className="text-purple-400">{activeScene.customFontSize || 135}px</span>
              </label>
              <input 
                type="range" min="60" max="200" step="5"
                value={activeScene.customFontSize || 135}
                onChange={(e) => {
                  const newScenes = [...inputProps.scenes];
                  newScenes[activeSceneIndex].customFontSize = Number(e.target.value);
                  setInputProps((prev: VideoState) => ({ ...prev, scenes: newScenes }));
                }}
                className="w-full accent-purple-500 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            {/* ?? Dynamic Text Line Editors */}
            <div className="flex flex-col gap-2">
              {activeScene.chartData?.map((item: any, idx: number) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input 
                    type="text" 
                    value={item.label}
                    onChange={(e) => {
                      const newScenes = [...inputProps.scenes];
                      newScenes[activeSceneIndex].chartData[idx].label = e.target.value;
                      setInputProps((prev: VideoState) => ({ ...prev, scenes: newScenes }));
                    }}
                    className="flex-1 bg-zinc-950 border border-white/10 rounded p-2 text-xs text-white"
                  />
                  <button
                    onClick={() => {
                      const newScenes = [...inputProps.scenes];
                      newScenes[activeSceneIndex].chartData[idx].value = item.value === 1 ? 0 : 1;
                      setInputProps((prev: VideoState) => ({ ...prev, scenes: newScenes }));
                    }}
                    className={`px-2 py-2 rounded text-[9px] font-bold transition-all ${item.value === 1 ? 'bg-purple-600 text-white shadow-[0_0_10px_rgba(168,85,247,0.4)]' : 'bg-zinc-800 text-zinc-500'}`}
                  >
                    {item.value === 1 ? 'GLOW' : 'NORMAL'}
                  </button>
                  <button
                    onClick={() => {
                      const newScenes = [...inputProps.scenes];
                      newScenes[activeSceneIndex].chartData.splice(idx, 1);
                      setInputProps((prev: VideoState) => ({ ...prev, scenes: newScenes }));
                    }}
                    className="text-zinc-600 hover:text-red-500 px-1 transition-colors"
                  >?</button>
                </div>
              ))}
              <button
                onClick={() => {
                  const newScenes = [...inputProps.scenes];
                  if (!newScenes[activeSceneIndex].chartData) newScenes[activeSceneIndex].chartData = [];
                  newScenes[activeSceneIndex].chartData.push({ label: "New Word", value: 0 });
                  setInputProps((prev: VideoState) => ({ ...prev, scenes: newScenes }));
                }}
                className="w-full mt-1 py-2 border border-dashed border-white/10 text-zinc-500 rounded text-[10px] font-bold hover:bg-white/5 hover:text-white transition-colors"
              >
                + ADD TEXT LINE
              </button>
            </div>
          </div>
        )}

        {/* ?? EXTRA TEXT LABELS (Only for Vertical Split) */}
        {activeScene.visualType === "VERTICAL_SPLIT" && (
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div>
              <label className="block text-[10px] font-bold text-zinc-500 mb-2">TOP LABEL</label>
              <input type="text" value={activeScene.leftText || ""} onChange={(e) => {
                const newScenes = [...inputProps.scenes];
                newScenes[activeSceneIndex].leftText = e.target.value;
                setInputProps((prev: VideoState) => ({ ...prev, scenes: newScenes }));
              }} className="w-full bg-zinc-900 border border-white/10 rounded p-2 text-xs text-white" placeholder="Dull Office" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-zinc-500 mb-2">BOTTOM LABEL</label>
              <input type="text" value={activeScene.rightText || ""} onChange={(e) => {
                const newScenes = [...inputProps.scenes];
                newScenes[activeSceneIndex].rightText = e.target.value;
                setInputProps((prev: VideoState) => ({ ...prev, scenes: newScenes }));
              }} className="w-full bg-zinc-900 border border-white/10 rounded p-2 text-xs text-white" placeholder="Vibrant Beach" />
            </div>
          </div>
        )}

        {/* ? BOOK REVEAL: TEXT & STYLING CONTROLS */}
        {activeScene.visualType === "BOOK_REVEAL" && (
          <div className="mb-4 bg-zinc-900/40 border border-white/5 rounded-xl p-4">
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">?? Book Reveal Controls</h3>
            
            {/* 1. Giant Number Textbox */}
            <div className="mb-3">
              <label className="block text-[10px] font-bold text-zinc-500 mb-2">GIANT BACKGROUND NUMBER</label>
              <input 
                type="text" 
                // ? FIX: Use ?? "" so you can delete it!
                value={activeScene.number ?? ""} 
                onChange={(e) => {
                  const newScenes = [...inputProps.scenes];
                  newScenes[activeSceneIndex].number = e.target.value;
                  setInputProps((prev: VideoState) => ({ ...prev, scenes: newScenes }));
                }}
                className="w-full bg-zinc-900 border border-white/10 rounded p-3 text-sm text-white"
              />
            </div>

            {/* 2. Book Cover Image URL */}
            <div className="mb-3">
              <label className="block text-[10px] font-bold text-zinc-500 mb-2">BOOK COVER IMAGE URL</label>
              <input 
                type="text" 
                placeholder="Paste image URL here..."
                value={activeScene.coverImage || ""} 
                onChange={(e) => {
                  const newScenes = [...inputProps.scenes];
                  newScenes[activeSceneIndex].coverImage = e.target.value;
                  setInputProps((prev: VideoState) => ({ ...prev, scenes: newScenes }));
                }}
                className="w-full bg-zinc-900 border border-white/10 rounded p-3 text-sm text-white"
              />
            </div>

            {/* 3. Book Name / Top Text */}
            <div className="mb-3">
              <label className="block text-[10px] font-bold text-zinc-500 mb-2">BOOK NAME (TOP LINE)</label>
              <input 
                type="text" 
                // ? FIX: Use ?? ""
                value={activeScene.title ?? ""} 
                onChange={(e) => {
                  const newScenes = [...inputProps.scenes];
                  newScenes[activeSceneIndex].title = e.target.value;
                  setInputProps((prev: VideoState) => ({ ...prev, scenes: newScenes }));
                }}
                className="w-full bg-zinc-900 border border-white/10 rounded p-3 text-sm text-white"
              />
            </div>

            {/* 4. Author / Bottom Text */}
            <div className="mb-3">
              <label className="block text-[10px] font-bold text-zinc-500 mb-2">AUTHOR NAME (BOTTOM LINE)</label>
              <input 
                type="text" 
                // ? FIX: Use ?? ""
                value={activeScene.author ?? ""} 
                onChange={(e) => {
                  const newScenes = [...inputProps.scenes];
                  newScenes[activeSceneIndex].author = e.target.value;
                  setInputProps((prev: VideoState) => ({ ...prev, scenes: newScenes }));
                }}
                className="w-full bg-zinc-900 border border-white/10 rounded p-3 text-sm text-white"
              />
            </div>

            <hr className="border-zinc-700/30 my-3" />

            {/* 5. Font Color Picker */}
            <div className="mb-3">
              <label className="block text-[10px] font-bold text-zinc-500 mb-2">GLOBAL FONT COLOR</label>
              <div className="flex gap-2">
                <input 
                  type="color" 
                  value={activeScene.fontColor || "#111111"} 
                  onChange={(e) => {
                    const newScenes = [...inputProps.scenes];
                    newScenes[activeSceneIndex].fontColor = e.target.value;
                    setInputProps((prev: VideoState) => ({ ...prev, scenes: newScenes }));
                  }}
                  className="w-16 h-12 rounded cursor-pointer bg-zinc-900 border border-white/10"
                />
                <input 
                  type="text" 
                  value={activeScene.fontColor || "#111111"} 
                  onChange={(e) => {
                    const newScenes = [...inputProps.scenes];
                    newScenes[activeSceneIndex].fontColor = e.target.value;
                    setInputProps((prev: VideoState) => ({ ...prev, scenes: newScenes }));
                  }}
                  className="flex-1 bg-zinc-900 border border-white/10 rounded p-3 text-sm text-white font-mono uppercase"
                />
              </div>
            </div>

            {/* 6. Font Size Slider */}
            <div className="mb-3">
              <label className="flex justify-between text-[10px] font-bold text-zinc-400 mb-2">
                <span>GLOBAL FONT SIZE SCALE</span>
                <span className="text-purple-400">{activeScene.fontSize || 100}%</span>
              </label>
              <input 
                type="range" 
                min="50" 
                max="150" 
                value={activeScene.fontSize || 100}
                onChange={(e) => {
                  const newScenes = [...inputProps.scenes];
                  newScenes[activeSceneIndex].fontSize = Number(e.target.value);
                  setInputProps((prev: VideoState) => ({ ...prev, scenes: newScenes }));
                }}
                className="w-full accent-purple-500 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <hr className="border-zinc-700/30 my-3" />

            {/* 7. NUMBER COLOR PICKER */}
            <div className="mb-3">
              <label className="block text-[10px] font-bold text-zinc-500 mb-2">GIANT NUMBER COLOR</label>
              <div className="flex gap-2">
                <input 
                  type="color" 
                  value={activeScene.numberColor || "#000000"} 
                  onChange={(e) => {
                    const newScenes = [...inputProps.scenes];
                    newScenes[activeSceneIndex].numberColor = e.target.value;
                    setInputProps((prev: VideoState) => ({ ...prev, scenes: newScenes }));
                  }}
                  className="w-16 h-12 rounded cursor-pointer bg-zinc-900 border border-white/10"
                />
                <input 
                  type="text" 
                  value={activeScene.numberColor || "#000000"} 
                  onChange={(e) => {
                    const newScenes = [...inputProps.scenes];
                    newScenes[activeSceneIndex].numberColor = e.target.value;
                    setInputProps((prev: VideoState) => ({ ...prev, scenes: newScenes }));
                  }}
                  className="flex-1 bg-zinc-900 border border-white/10 rounded p-3 text-sm text-white font-mono uppercase"
                />
              </div>
            </div>

            <hr className="border-zinc-700/30 my-3" />

            {/* ? THE LIGHTNING TOGGLE */}
            <div className="p-3 bg-black/40 rounded-lg border border-white/5">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-[10px] font-bold text-zinc-400">? ENABLE LIGHTNING STRIKE</span>
                <input 
                  type="checkbox" 
                  checked={activeScene.showLightning ?? true}
                  onChange={(e) => {
                    const newScenes = [...inputProps.scenes];
                    newScenes[activeSceneIndex].showLightning = e.target.checked;
                    setInputProps((prev: VideoState) => ({ ...prev, scenes: newScenes }));
                  }}
                  className="w-4 h-4 accent-purple-500 rounded cursor-pointer"
                />
              </label>
            </div>
          </div>
        )}

        {/* ?? MINDSET FLOW: STAGGERED HABIT IMAGES WITH SLIDERS */}
        {/* ?? MINDSET FLOW: STAGGERED HABIT IMAGES WITH SLIDERS */}
        {activeScene.visualType === "MINDSET_FLOW" && (
          <div className="space-y-4 mb-4">
            
            {/* ? THE TINT COLOR BOX */}
            <div className="p-3 bg-black/40 rounded-lg border border-white/5 mb-4">
              <label className="block text-[10px] font-bold text-zinc-500 mb-2 uppercase">?? Image Tint Color</label>
              <div className="flex items-center gap-3">
                <input 
                  type="color" 
                  value={activeScene.tintColor as string || "#00d4ff"} 
                  onChange={(e) => {
                    const newScenes = [...inputProps.scenes];
                    newScenes[activeSceneIndex] = { ...newScenes[activeSceneIndex], tintColor: e.target.value };
                    setInputProps((prev) => ({ ...prev, scenes: newScenes }));
                  }}
                  className="w-12 h-12 rounded cursor-pointer bg-zinc-900 border border-white/10"
                />
                <span className="text-xs text-zinc-400">Applies a cinematic duotone tint to the 3 habit images.</span>
              </div>
            </div>
            
            <label className="block text-xs font-bold text-purple-400 mb-2 uppercase tracking-wider">
              ??? Staggered Habit Images
            </label>
            
            {/* Loop for the 3 Habit Images with individual controls */}
            {[1, 2, 3].map((num) => {
              const imgKey = `image${num}`;
              const sizeKey = `img${num}Size`;
              const yKey = `img${num}Y`;
              
              return (
                <div key={imgKey} className="p-4 bg-black/60 rounded-lg border border-white/10 flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold text-white uppercase">HABIT IMAGE {num}</span>
                    <label className="cursor-pointer bg-zinc-800 hover:bg-zinc-700 px-3 py-1 rounded text-[10px] font-bold text-white transition-colors">
                      Upload File
                      <input 
                        type="file" accept="image/*" className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            // ? FIX: Converted to Base64 so the MP4 renderer can read it!
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              const newScenes = [...inputProps.scenes];
                              newScenes[activeSceneIndex] = { ...newScenes[activeSceneIndex], [imgKey]: reader.result as string };
                              setInputProps((prev) => ({ ...prev, scenes: newScenes }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                  
                  <input 
                    type="text" placeholder="Or Paste URL..." value={activeScene[imgKey as keyof typeof activeScene] as string || ''}
                    onChange={(e) => {
                      const newScenes = [...inputProps.scenes];
                      newScenes[activeSceneIndex] = { ...newScenes[activeSceneIndex], [imgKey]: e.target.value };
                      setInputProps((prev) => ({ ...prev, scenes: newScenes }));
                    }}
                    className="w-full bg-zinc-900 border border-white/10 rounded px-2 py-1.5 text-xs text-white"
                  />

                  {/* SLIDERS: Up/Down & Size */}
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <label className="flex justify-between text-[9px] font-bold text-zinc-400 mb-1">
                        <span>SIZE</span>
                        <span className="text-purple-400">{activeScene[sizeKey as keyof typeof activeScene] as number || 380}px</span>
                      </label>
                      <input 
                        type="range" min="150" max="800" value={activeScene[sizeKey as keyof typeof activeScene] as number || 380}
                        onChange={(e) => {
                          const newScenes = [...inputProps.scenes];
                          newScenes[activeSceneIndex] = { ...newScenes[activeSceneIndex], [sizeKey]: Number(e.target.value) };
                          setInputProps((prev) => ({ ...prev, scenes: newScenes }));
                        }}
                        className="w-full accent-purple-500 h-1 bg-zinc-800 rounded appearance-none"
                      />
                    </div>
                    <div>
                      <label className="flex justify-between text-[9px] font-bold text-zinc-400 mb-1">
                        <span>MOVE (UP/DOWN)</span>
                        <span className="text-purple-400">{activeScene[yKey as keyof typeof activeScene] as number || 0}</span>
                      </label>
                      <input 
                        type="range" min="-400" max="400" value={activeScene[yKey as keyof typeof activeScene] as number || 0}
                        onChange={(e) => {
                          const newScenes = [...inputProps.scenes];
                          newScenes[activeSceneIndex] = { ...newScenes[activeSceneIndex], [yKey]: Number(e.target.value) };
                          setInputProps((prev) => ({ ...prev, scenes: newScenes }));
                        }}
                        className="w-full accent-blue-500 h-1 bg-zinc-800 rounded appearance-none"
                      />
                    </div>
                  </div>
                </div>
              );
            })}

            {/* The Book Image Input at the very bottom */}
            <div className="p-3 bg-black/40 rounded-lg border border-white/5 mt-4">
              <span className="block text-[10px] font-bold text-zinc-500 uppercase mb-2">?? Final Book Image</span>
              <div className="flex gap-2">
                <input 
                  type="text" placeholder="Paste Book URL..." value={activeScene.bookImage as string || ''}
                  onChange={(e) => {
                    const newScenes = [...inputProps.scenes];
                    newScenes[activeSceneIndex] = { ...newScenes[activeSceneIndex], bookImage: e.target.value };
                    setInputProps((prev) => ({ ...prev, scenes: newScenes }));
                  }}
                  className="flex-1 bg-zinc-900 border border-white/10 rounded px-2 py-1.5 text-xs text-white"
                />
                <label className="cursor-pointer bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded text-xs font-bold text-white flex items-center justify-center">
                  Upload
                  <input 
                    type="file" accept="image/*" className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        // ? FIX: Converted to Base64
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          const newScenes = [...inputProps.scenes];
                          newScenes[activeSceneIndex] = { ...newScenes[activeSceneIndex], bookImage: reader.result as string };
                          setInputProps((prev) => ({ ...prev, scenes: newScenes }));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* ?? NEON CONCEPT: TEXT & STYLING CONTROLS */}
        {activeScene.visualType === "NEON_CONCEPT" && (
          <div className="mb-4 bg-zinc-900/40 border border-white/5 rounded-xl p-4">
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">?? Neon Concept Controls</h3>
            
            {/* --- 1. TOP TEXT BLOCK --- */}
            <div className="mb-4 p-3 bg-black/40 rounded-lg border border-white/5">
              <label className="block text-[10px] font-bold text-zinc-500 mb-2">TOP TEXT LINE</label>
              
              {/* Text Box + Size Box (Side-by-side) */}
              <div className="flex gap-2 mb-3">
                <input 
                  type="text" 
                  value={activeScene.headerText ?? ""} 
                  onChange={(e) => {
                    const newScenes = [...inputProps.scenes];
                    newScenes[activeSceneIndex] = { ...newScenes[activeSceneIndex], headerText: e.target.value };
                    setInputProps((prev: VideoState) => ({ ...prev, scenes: newScenes }));
                  }}
                  className="flex-1 bg-zinc-900 border border-white/10 rounded p-2 text-sm text-white"
                  placeholder="Text..."
                />
                <div className="w-20 relative">
                  <input 
                    type="number" 
                    value={activeScene.topFontSize ?? 75} 
                    onChange={(e) => {
                      const newScenes = [...inputProps.scenes];
                      newScenes[activeSceneIndex] = { ...newScenes[activeSceneIndex], topFontSize: Number(e.target.value) };
                      setInputProps((prev: VideoState) => ({ ...prev, scenes: newScenes }));
                    }}
                    className="w-full bg-zinc-900 border border-white/10 rounded p-2 text-sm text-white text-center font-mono"
                    title="Font Size"
                  />
                  <span className="absolute -top-3 right-1 text-[8px] text-zinc-600 font-bold uppercase">Size</span>
                </div>
              </div>

              {/* Color Box (Below) */}
              <div className="flex items-center gap-3">
                <input 
                  type="color" 
                  value={activeScene.topFontColor || "#00ffff"} 
                  onChange={(e) => {
                    const newScenes = [...inputProps.scenes];
                    newScenes[activeSceneIndex] = { ...newScenes[activeSceneIndex], topFontColor: e.target.value };
                    setInputProps((prev: VideoState) => ({ ...prev, scenes: newScenes }));
                  }}
                  className="w-8 h-8 rounded cursor-pointer bg-zinc-900 border border-white/10"
                />
                <span className="text-[10px] font-bold text-zinc-400 uppercase">Text Color</span>
              </div>
            </div>

            {/* --- 2. BOTTOM TEXT BLOCK --- */}
            <div className="mb-4 p-3 bg-black/40 rounded-lg border border-white/5">
              <label className="block text-[10px] font-bold text-zinc-500 mb-2">BOTTOM TEXT LINE (GIANT)</label>
              
              {/* Text Box + Size Box (Side-by-side) */}
              <div className="flex gap-2 mb-3">
                <input 
                  type="text" 
                  value={activeScene.leftText ?? ""} 
                  onChange={(e) => {
                    const newScenes = [...inputProps.scenes];
                    newScenes[activeSceneIndex] = { ...newScenes[activeSceneIndex], leftText: e.target.value };
                    setInputProps((prev: VideoState) => ({ ...prev, scenes: newScenes }));
                  }}
                  className="flex-1 bg-zinc-900 border border-white/10 rounded p-2 text-sm text-white"
                  placeholder="Text..."
                />
                <div className="w-20 relative">
                  <input 
                    type="number" 
                    value={activeScene.bottomFontSize ?? 125} 
                    onChange={(e) => {
                      const newScenes = [...inputProps.scenes];
                      newScenes[activeSceneIndex] = { ...newScenes[activeSceneIndex], bottomFontSize: Number(e.target.value) };
                      setInputProps((prev: VideoState) => ({ ...prev, scenes: newScenes }));
                    }}
                    className="w-full bg-zinc-900 border border-white/10 rounded p-2 text-sm text-white text-center font-mono"
                    title="Font Size"
                  />
                  <span className="absolute -top-3 right-1 text-[8px] text-zinc-600 font-bold uppercase">Size</span>
                </div>
              </div>

              {/* Color Box (Below) */}
              <div className="flex items-center gap-3">
                <input 
                  type="color" 
                  value={activeScene.bottomFontColor || "#00aaff"} 
                  onChange={(e) => {
                    const newScenes = [...inputProps.scenes];
                    newScenes[activeSceneIndex] = { ...newScenes[activeSceneIndex], bottomFontColor: e.target.value };
                    setInputProps((prev: VideoState) => ({ ...prev, scenes: newScenes }));
                  }}
                  className="w-8 h-8 rounded cursor-pointer bg-zinc-900 border border-white/10"
                />
                <span className="text-[10px] font-bold text-zinc-400 uppercase">Text Color</span>
              </div>
            </div>

            <hr className="border-zinc-700/30 my-4" />

            {/* 3. Background Gradient Center Color */}
            <div className="mb-3">
              <label className="block text-[10px] font-bold text-zinc-500 mb-2">BACKGROUND GLOW CENTER</label>
              <div className="flex gap-2">
                <input 
                  type="color" 
                  value={activeScene.bgGradientColor || "#002255"} 
                  onChange={(e) => {
                    const newScenes = [...inputProps.scenes];
                    newScenes[activeSceneIndex] = { ...newScenes[activeSceneIndex], bgGradientColor: e.target.value };
                    setInputProps((prev: VideoState) => ({ ...prev, scenes: newScenes }));
                  }}
                  className="w-16 h-12 rounded cursor-pointer bg-zinc-900 border border-white/10"
                />
                <input 
                  type="text" 
                  value={activeScene.bgGradientColor || "#002255"} 
                  onChange={(e) => {
                    const newScenes = [...inputProps.scenes];
                    newScenes[activeSceneIndex] = { ...newScenes[activeSceneIndex], bgGradientColor: e.target.value };
                    setInputProps((prev: VideoState) => ({ ...prev, scenes: newScenes }));
                  }}
                  className="flex-1 bg-zinc-900 border border-white/10 rounded p-3 text-sm text-white font-mono uppercase"
                />
              </div>
            </div>

          </div>
        )}

        {/* ?? NEON CONCEPT: PILLAR & DIAMOND CONTROLS */}
        {activeScene.visualType === "NEON_CONCEPT" && (
          <div className="mt-4 mb-4 bg-zinc-900/40 border border-white/5 rounded-xl p-4">
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">??? Pillar & Diamond Styling</h3>
            
            {/* Diamond Color */}
            <div className="mb-4">
              <label className="block text-[10px] font-bold text-zinc-500 mb-2">DIAMOND GLOW COLOR</label>
              <div className="flex gap-2">
                <input 
                  type="color" 
                  value={activeScene.diamondColor || "#00d4ff"} 
                  onChange={(e) => {
                    const newScenes = [...inputProps.scenes];
                    newScenes[activeSceneIndex] = { ...newScenes[activeSceneIndex], diamondColor: e.target.value };
                    setInputProps((prev: VideoState) => ({ ...prev, scenes: newScenes }));
                  }}
                  className="w-12 h-10 rounded cursor-pointer bg-zinc-900 border border-white/10"
                />
                <input type="text" readOnly value={activeScene.diamondColor || "#00d4ff"} className="flex-1 bg-zinc-950 border border-white/10 rounded p-2 text-[10px] text-white font-mono uppercase" />
              </div>
            </div>

            {/* Pillar Column Colors */}
            <div className="space-y-3">
              <label className="block text-[10px] font-bold text-zinc-500 uppercase">Pillar Column Colors (Left to Right)</label>
              <div className="grid grid-cols-3 gap-2">
                {/* Left Column */}
                <div className="flex flex-col gap-1">
                  <input 
                    type="color" 
                    value={activeScene.pillarColorLeft || "#00d4ff"} 
                    onChange={(e) => {
                      const newScenes = [...inputProps.scenes];
                      newScenes[activeSceneIndex] = { ...newScenes[activeSceneIndex], pillarColorLeft: e.target.value };
                      setInputProps((prev: VideoState) => ({ ...prev, scenes: newScenes }));
                    }}
                    className="w-full h-10 rounded cursor-pointer bg-zinc-900 border border-white/10"
                  />
                  <span className="text-[8px] text-zinc-600 text-center font-bold">LEFT</span>
                </div>

                {/* Center Column */}
                <div className="flex flex-col gap-1">
                  <input 
                    type="color" 
                    value={activeScene.pillarColorCenter || "#0088cc"} 
                    onChange={(e) => {
                      const newScenes = [...inputProps.scenes];
                      newScenes[activeSceneIndex] = { ...newScenes[activeSceneIndex], pillarColorCenter: e.target.value };
                      setInputProps((prev: VideoState) => ({ ...prev, scenes: newScenes }));
                    }}
                    className="w-full h-10 rounded cursor-pointer bg-zinc-900 border border-white/10"
                  />
                  <span className="text-[8px] text-zinc-600 text-center font-bold">CENTER</span>
                </div>

                {/* Right Column */}
                <div className="flex flex-col gap-1">
                  <input 
                    type="color" 
                    value={activeScene.pillarColorRight || "#001a33"} 
                    onChange={(e) => {
                      const newScenes = [...inputProps.scenes];
                      newScenes[activeSceneIndex] = { ...newScenes[activeSceneIndex], pillarColorRight: e.target.value };
                      setInputProps((prev: VideoState) => ({ ...prev, scenes: newScenes }));
                    }}
                    className="w-full h-10 rounded cursor-pointer bg-zinc-900 border border-white/10"
                  />
                  <span className="text-[8px] text-zinc-600 text-center font-bold">RIGHT</span>
                </div>
              </div>
            </div>

          </div>
        )}
        {/* ??? KINETIC ROADMAP: ICONS */}
        {/* ??? ROADMAP: LINE ART ICON SELECTOR & GALLERY */}
        {activeScene.visualType === "KINETIC_ROADMAP" && (
          <div className="mb-4 bg-zinc-900/40 border border-white/5 rounded-xl p-4">
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">??? Roadmap Icons</h3>
            
            <div className="flex flex-col gap-4">
              {[0, 1, 2, 3].map((i) => (
              <div key={i} className="mb-4 bg-zinc-900/40 border border-white/5 rounded-xl p-3">
                <label className="block text-[10px] font-bold text-zinc-500 mb-2 uppercase tracking-widest">
                  SLOT {i + 1} ICON
                </label>
                <div className="flex gap-2 mb-2">
                  {/* Icon Preview */}
                  <div className="w-10 h-10 bg-zinc-950 border border-white/10 rounded flex justify-center items-center text-lg">
                    {activeScene.icons?.[i] ? '✨' : '❔'}
                  </div>
                  
                  {/* Text Input */}
                  <input 
                    type="text" 
                    value={activeScene.icons?.[i] || ""} 
                    onChange={(e) => {
                      const newIcons = [...(activeScene.icons || [])];
                      newIcons[i] = e.target.value;
                      
                      const newScenes = [...inputProps.scenes];
                      newScenes[activeSceneIndex] = { ...newScenes[activeSceneIndex], icons: newIcons };
                      setInputProps((prev: any) => ({ ...prev, scenes: newScenes }));
                    }}
                    className="flex-1 bg-zinc-950 border border-white/10 rounded px-3 text-xs text-white"
                    placeholder="e.g. RiRocketLine"
                  />
                  
                  {/* Clear Button */}
                  <button 
                    onClick={() => {
                      const newIcons = [...(activeScene.icons || [])];
                      newIcons[i] = "";
                      const newScenes = [...inputProps.scenes];
                      newScenes[activeSceneIndex] = { ...newScenes[activeSceneIndex], icons: newIcons };
                      setInputProps((prev: any) => ({ ...prev, scenes: newScenes }));
                    }}
                    className="w-10 h-10 bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 rounded flex justify-center items-center transition-colors"
                    title="Clear Icon"
                  >
                    ✕
                  </button>
                </div>

                {/* Clean Quick Select Grid */}
                <div className="grid grid-cols-4 gap-1">
                  {[
                    { id: "RiRocketLine", label: "🚀" },
                    { id: "RiLightbulbLine", label: "💡" },
                    { id: "RiTargetLine", label: "🎯" },
                    { id: "RiTrophyLine", label: "🏆" },
                    { id: "RiMoneyDollarCircleLine", label: "💰" },
                    { id: "RiUserSmileLine", label: "👤" },
                    { id: "RiCheckDoubleLine", label: "✅" },
                    { id: "RiGlobalLine", label: "🌍" }
                  ].map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => {
                        const newIcons = [...(activeScene.icons || [])];
                        newIcons[i] = preset.id;
                        const newScenes = [...inputProps.scenes];
                        newScenes[activeSceneIndex] = { ...newScenes[activeSceneIndex], icons: newIcons };
                        setInputProps((prev: any) => ({ ...prev, scenes: newScenes }));
                      }}
                      className="bg-black/30 border border-white/5 hover:bg-white/10 rounded py-1.5 text-sm transition-colors"
                      title={preset.id}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
              ))}
            </div>

        {/* ??? ROADMAP: TEXT STYLING (SIZE & COLOR) */}
        <div className="mt-4 p-3 bg-black/40 rounded-lg border border-white/5">
          <h3 className="text-[10px] font-bold text-zinc-500 uppercase mb-3">Text Styling</h3>
          
          <div className="flex gap-4 items-end">
            {/* ? Item 3: Font Size Box */}
            <div className="flex-1">
              <label className="block text-[9px] font-bold text-zinc-500 mb-2 uppercase">Font Size</label>
              <input 
                type="number" 
                value={activeScene.fontSize ?? 115} 
                onChange={(e) => {
                  const newScenes = [...inputProps.scenes];
                  newScenes[activeSceneIndex] = { ...newScenes[activeSceneIndex], fontSize: Number(e.target.value) };
                  setInputProps((prev: VideoState) => ({ ...prev, scenes: newScenes }));
                }}
                className="w-full bg-zinc-950 border border-white/10 rounded p-2 text-xs text-white font-mono"
              />
            </div>

            {/* ? Item 5: Font Color Box */}
            <div className="flex-1">
              <label className="block text-[9px] font-bold text-zinc-500 mb-2 uppercase">Text Color</label>
              <div className="flex gap-2">
                <input 
                  type="color" 
                  value={activeScene.fontColor || "#ffffff"} 
                  onChange={(e) => {
                    const newScenes = [...inputProps.scenes];
                    newScenes[activeSceneIndex] = { ...newScenes[activeSceneIndex], fontColor: e.target.value };
                    setInputProps((prev: VideoState) => ({ ...prev, scenes: newScenes }));
                  }}
                  className="w-10 h-9 rounded cursor-pointer bg-zinc-900 border border-white/10"
                />
                <input 
                  type="text"
                  value={activeScene.fontColor || "#ffffff"}
                  readOnly
                  className="flex-1 bg-zinc-950 border border-white/10 rounded p-2 text-[10px] text-white font-mono uppercase"
                />
              </div>
            </div>
          </div>
        </div>
          </div>
        )}

        {/* ?? DARK WEALTH: TEXT & ASSET CONTROLS */}
        {activeScene.visualType === "DARK_WEALTH" && (
          <div className="mb-4 bg-zinc-900/40 border border-white/5 rounded-xl p-4">
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">?? Dark Wealth Controls</h3>
            
            {/* --- PHASE 1 TEXT --- */}
            <div className="mb-4 p-3 bg-black/40 rounded-lg border border-white/5">
              <label className="block text-[10px] font-bold text-zinc-500 mb-2">PHASE 1 (Pre-Flip)</label>
              <input 
                type="text" value={activeScene.topText1 ?? ""} 
                onChange={(e) => {
                  const newScenes = [...inputProps.scenes];
                  newScenes[activeSceneIndex] = { ...newScenes[activeSceneIndex], topText1: e.target.value };
                  setInputProps((prev) => ({ ...prev, scenes: newScenes }));
                }}
                className="w-full bg-zinc-900 border border-white/10 rounded p-2 text-xs text-white mb-2" placeholder="Small Top Text..."
              />
              <input 
                type="text" value={activeScene.mainText1 ?? ""} 
                onChange={(e) => {
                  const newScenes = [...inputProps.scenes];
                  newScenes[activeSceneIndex] = { ...newScenes[activeSceneIndex], mainText1: e.target.value };
                  setInputProps((prev) => ({ ...prev, scenes: newScenes }));
                }}
                className="w-full bg-zinc-900 border border-white/10 rounded p-3 text-sm font-bold text-white uppercase tracking-widest" placeholder="GIANT MAIN TEXT..."
              />
            </div>

            {/* --- PHASE 2 TEXT --- */}
            <div className="mb-4 p-3 bg-black/40 rounded-lg border border-white/5">
              <label className="block text-[10px] font-bold text-zinc-500 mb-2">PHASE 2 (Post-Flip)</label>
              <input 
                type="text" value={activeScene.topText2 ?? ""} 
                onChange={(e) => {
                  const newScenes = [...inputProps.scenes];
                  newScenes[activeSceneIndex] = { ...newScenes[activeSceneIndex], topText2: e.target.value };
                  setInputProps((prev) => ({ ...prev, scenes: newScenes }));
                }}
                className="w-full bg-zinc-900 border border-white/10 rounded p-2 text-xs text-white mb-2" placeholder="Small Top Text..."
              />
              <input 
                type="text" value={activeScene.mainText2 ?? ""} 
                onChange={(e) => {
                  const newScenes = [...inputProps.scenes];
                  newScenes[activeSceneIndex] = { ...newScenes[activeSceneIndex], mainText2: e.target.value };
                  setInputProps((prev) => ({ ...prev, scenes: newScenes }));
                }}
                className="w-full bg-zinc-900 border border-white/10 rounded p-3 text-sm font-bold text-white uppercase tracking-widest" placeholder="GIANT MAIN TEXT..."
              />
            </div>

            <hr className="border-zinc-700/30 my-4" />

            {/* --- 3D FLOATING ASSETS --- */}
            <div className="space-y-3">
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Floating 3D Assets</label>
              
              {/* Asset Uploader Helper */}
              {[
                { label: "Left Floating Image (Card)", key: "cardImage" },
                { label: "Right Floating Image (Coin)", key: "coinImage" },
                { label: "Wipe Transition Image (Note)", key: "noteImage" }
              ].map((asset) => (
                <div key={asset.key} className="flex gap-2">
                  <input 
                    type="text" 
                    value={activeScene[asset.key as keyof Scene] as string || ""}
                    onChange={(e) => {
                      const newScenes = [...inputProps.scenes];
                      newScenes[activeSceneIndex] = { ...newScenes[activeSceneIndex], [asset.key]: e.target.value };
                      setInputProps((prev) => ({ ...prev, scenes: newScenes }));
                    }}
                    className="flex-1 bg-zinc-950 border border-white/10 rounded p-2 text-xs text-white"
                    placeholder={`Paste ${asset.label} URL...`}
                  />
                  <label className="cursor-pointer bg-zinc-800 hover:bg-zinc-700 p-2 rounded border border-white/10 transition-colors shrink-0 flex items-center justify-center">
                    ??
                    <input 
                      type="file" className="hidden" accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            const newScenes = [...inputProps.scenes];
                            newScenes[activeSceneIndex] = { ...newScenes[activeSceneIndex], [asset.key]: reader.result as string };
                            setInputProps((prev) => ({ ...prev, scenes: newScenes }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
              ))}
              <p className="text-[8px] text-zinc-600 mt-2 italic">*Use transparent PNGs for the best 3D parallax effect.</p>
            </div>
          </div>
        )}

        {/* ?? PUPPET MASTER EXCLUSIVE CONTROLS (Brain Color & Tension) */}
        {activeScene.visualType === "PUPPET_MASTER" && (
          <div className="space-y-4 mb-4">
            
            {/* ? Custom Hand Image Uploader & Sliders */}
            <div className="p-3 bg-black/40 rounded-lg border border-white/5">
              <span className="block text-[10px] font-bold text-zinc-500 uppercase mb-2">??? Custom Hand Image</span>
              
              <div className="flex gap-2 mb-3">
                <input 
                  type="text" placeholder="Paste Hand Cutout URL..." value={activeScene.handImage as string || ''}
                  onChange={(e) => {
                    const newScenes = [...inputProps.scenes];
                    newScenes[activeSceneIndex] = { ...newScenes[activeSceneIndex], handImage: e.target.value };
                    setInputProps((prev) => ({ ...prev, scenes: newScenes }));
                  }}
                  className="flex-1 bg-zinc-900 border border-white/10 rounded px-2 py-1.5 text-xs text-white"
                />
                <label className="cursor-pointer bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded text-xs font-bold text-white flex items-center justify-center">
                  Upload
                  <input 
                    type="file" accept="image/*" className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          const newScenes = [...inputProps.scenes];
                          newScenes[activeSceneIndex] = { ...newScenes[activeSceneIndex], handImage: reader.result as string };
                          setInputProps((prev) => ({ ...prev, scenes: newScenes }));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>

              {/* ? THE 4 POSITIONING SLIDERS */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="flex justify-between text-[9px] font-bold text-zinc-400 mb-1">
                    <span>SIZE</span>
                    <span className="text-purple-400">{activeScene.handSize ?? 600}px</span>
                  </label>
                  <input 
                    type="range" min="100" max="600" value={activeScene.handSize ?? 600}
                    onChange={(e) => {
                      const newScenes = [...inputProps.scenes];
                      newScenes[activeSceneIndex] = { ...newScenes[activeSceneIndex], handSize: Number(e.target.value) };
                      setInputProps((prev: any) => ({ ...prev, scenes: newScenes }));
                    }}
                    className="w-full accent-purple-500 h-1 bg-zinc-800 rounded appearance-none"
                  />
                </div>
                <div>
                  <label className="flex justify-between text-[9px] font-bold text-zinc-400 mb-1">
                    <span>MOVE X</span>
                    <span className="text-purple-400">{activeScene.handX ?? -138}</span>
                  </label>
                  <input 
                    type="range" min="-300" max="300" value={activeScene.handX ?? -138}
                    onChange={(e) => {
                      const newScenes = [...inputProps.scenes];
                      newScenes[activeSceneIndex] = { ...newScenes[activeSceneIndex], handX: Number(e.target.value) };
                      setInputProps((prev: any) => ({ ...prev, scenes: newScenes }));
                    }}
                    className="w-full accent-blue-500 h-1 bg-zinc-800 rounded appearance-none"
                  />
                </div>
                <div>
                  <label className="flex justify-between text-[9px] font-bold text-zinc-400 mb-1">
                    <span>MOVE Y</span>
                    <span className="text-purple-400">{activeScene.handY ?? -182}</span>
                  </label>
                  <input 
                    type="range" min="-300" max="300" value={activeScene.handY ?? -182}
                    onChange={(e) => {
                      const newScenes = [...inputProps.scenes];
                      newScenes[activeSceneIndex] = { ...newScenes[activeSceneIndex], handY: Number(e.target.value) };
                      setInputProps((prev: any) => ({ ...prev, scenes: newScenes }));
                    }}
                    className="w-full accent-green-500 h-1 bg-zinc-800 rounded appearance-none"
                  />
                </div>
                <div>
                  <label className="flex justify-between text-[9px] font-bold text-zinc-400 mb-1">
                    <span>ROTATE</span>
                    <span className="text-pink-400">{activeScene.handRotation ?? 6}ï¿½</span>
                  </label>
                  <input 
                    type="range" min="-180" max="180" value={activeScene.handRotation ?? 6}
                    onChange={(e) => {
                      const newScenes = [...inputProps.scenes];
                      newScenes[activeSceneIndex] = { ...newScenes[activeSceneIndex], handRotation: Number(e.target.value) };
                      setInputProps((prev: any) => ({ ...prev, scenes: newScenes }));
                    }}
                    className="w-full accent-pink-500 h-1 bg-zinc-800 rounded appearance-none"
                  />
                </div>
              </div>
            </div>

            {/* Brain Color Picker */}
            <div className="p-3 bg-black/40 rounded-lg border border-white/5">
              <label className="block text-[10px] font-bold text-zinc-500 mb-2">? BRAIN COLOR</label>
              <div className="flex items-center gap-3">
                <input 
                  type="color" 
                  value={activeScene.brainColor || "#00d4ff"} 
                  onChange={(e) => {
                    const newScenes = [...inputProps.scenes];
                    newScenes[activeSceneIndex] = { ...newScenes[activeSceneIndex], brainColor: e.target.value };
                    setInputProps((prev) => ({ ...prev, scenes: newScenes }));
                  }}
                  className="w-12 h-12 rounded cursor-pointer bg-zinc-900 border border-white/10"
                />
              </div>
            </div>

            {/* Hand Speed & String Tension Sliders */}
            <div className="grid grid-cols-2 gap-3">
              {/* Hand Speed: 1-10 (controls velocity & smoothness) */}
              <div className="p-3 bg-black/40 rounded-lg border border-white/5">
                <label className="flex justify-between text-[9px] font-bold text-zinc-400 mb-2">
                  <span>HAND SPEED</span>
                  <span className="text-amber-400">{activeScene.handSpeed ?? 1}</span>
                </label>
                <input 
                  type="range" 
                  min="1" 
                  max="10" 
                  step="0.5"
                  value={activeScene.handSpeed ?? 1}
                  onChange={(e) => {
                    const newScenes = [...inputProps.scenes];
                    newScenes[activeSceneIndex].handSpeed = Number(e.target.value);
                    setInputProps((prev) => ({ ...prev, scenes: newScenes }));
                  }}
                  className="w-full accent-amber-500 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                />
                <p className="text-[7px] text-zinc-600 mt-1">Velocity & dampening</p>
              </div>

              {/* String Tension: 1-100 (controls stiffness & snap) */}
              <div className="p-3 bg-black/40 rounded-lg border border-white/5">
                <label className="flex justify-between text-[9px] font-bold text-zinc-400 mb-2">
                  <span>STRING TENSION</span>
                  <span className="text-rose-400">{activeScene.stringTension ?? 1}</span>
                </label>
                <input 
                  type="range" 
                  min="1" 
                  max="100" 
                  step="1"
                  value={activeScene.stringTension ?? 1}
                  onChange={(e) => {
                    const newScenes = [...inputProps.scenes];
                    newScenes[activeSceneIndex].stringTension = Number(e.target.value);
                    setInputProps((prev) => ({ ...prev, scenes: newScenes }));
                  }}
                  className="w-full accent-rose-500 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                />
                <p className="text-[7px] text-zinc-600 mt-1">Snap & vibration</p>
              </div>
            </div>


          </div>
        )}

        {/* IMAGE 1 (Top/Main) & UPLOAD */}
        {/* ?? UPDATED: BACKGROUND VIDEO / IMAGE UPLOADER */}
        <div className="mb-4">
          {/* Change label to specify Video */}
          <label className="block text-[10px] font-bold text-zinc-500 mb-2 uppercase">Background Video / Image</label>
          <div className="flex flex-col gap-2">
            <input 
              type="text" 
              placeholder="Paste .mp4 or Image URL..." 
              value={activeScene.backgroundImage ?? ""} 
              onChange={(e) => {
                const newScenes = [...inputProps.scenes];
                newScenes[activeSceneIndex] = { ...newScenes[activeSceneIndex], backgroundImage: e.target.value };
                setInputProps((prev: VideoState) => ({ ...prev, scenes: newScenes }));
              }}
              className="w-full bg-zinc-900 border border-white/10 rounded p-3 text-xs text-white"
            />
            
            <label className="flex items-center justify-center gap-2 w-full py-3 bg-zinc-800 hover:bg-zinc-700 rounded border border-dashed border-white/20 cursor-pointer transition-all text-xs text-zinc-400">
              <span>?? Upload Local Video or Image</span>
              <input 
                type="file" 
                className="hidden" 
                // ? FIX: Ensure video files are accepted in the file picker
                accept="video/*,image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      const newScenes = [...inputProps.scenes];
                      newScenes[activeSceneIndex] = { ...newScenes[activeSceneIndex], backgroundImage: reader.result as string };
                      setInputProps((prev: VideoState) => ({ ...prev, scenes: newScenes }));
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </label>
          </div>
        </div>

        {/* ??? IMAGE 2 (Bottom - Only shows if Split Screen) */}
        {activeScene.visualType === "VERTICAL_SPLIT" && (
          <div className="mb-4">
            <label className="block text-[10px] font-bold text-zinc-500 mb-2">BOTTOM IMAGE URL (Vibrant)</label>
            <input 
              type="text" 
              value={activeScene.backgroundImage2 || ""} 
              onChange={(e) => {
                const newScenes = [...inputProps.scenes];
                newScenes[activeSceneIndex].backgroundImage2 = e.target.value;
                setInputProps((prev: VideoState) => ({ ...prev, scenes: newScenes }));
              }}
              className="w-full bg-zinc-900 border border-white/10 rounded p-3 text-sm text-white mb-2"
              placeholder="Paste Image URL (Beach)"
            />
          </div>
        )}

        {/* ??? BRAND LOGO UPLOAD (Only for specific scenes) */}
        {(activeScene.visualType === "MACRO_POUR" || activeScene.visualType === "ICE_BUCKET") && (
          <div className="mb-4">
            <label className="block text-[10px] font-bold text-zinc-500 mb-2">
              BRAND LOGO (Transparent PNG/SVG)
            </label>
            <div className="flex flex-col gap-2">
              <input 
                type="text" 
                value={activeScene.logoUrl || ""} 
                onChange={(e) => {
                  const newScenes = [...inputProps.scenes];
                  newScenes[activeSceneIndex].logoUrl = e.target.value;
                  setInputProps((prev: VideoState) => ({ ...prev, scenes: newScenes }));
                }}
                className="w-full bg-zinc-900 border border-white/10 rounded p-3 text-sm text-white"
                placeholder="Paste Logo URL..."
              />
              
              <label className="flex flex-col items-center justify-center w-full h-12 border-2 border-dashed border-white/10 rounded-lg cursor-pointer hover:bg-white/5 hover:border-purple-500 transition-all">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  ??? Upload Logo
                </span>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        const newScenes = [...inputProps.scenes];
                        newScenes[activeSceneIndex].logoUrl = reader.result as string;
                        setInputProps((prev: VideoState) => ({ ...prev, scenes: newScenes }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }} 
                />
              </label>
            </div>
          </div>
        )}

        {/* ?? REEL SETTINGS */}
        {activeScene.visualType === "PANORAMIC_REEL" && (
          <div className="mb-4 bg-zinc-900/40 border border-white/5 rounded-xl p-4">
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Reel Settings</h3>
            <div className="mb-6">
              <label className="flex justify-between text-[10px] font-bold text-zinc-400 mb-2">
                <span>SCROLL SPEED</span>
                <span className="text-orange-400">{activeScene.reelSpeed || 5}x</span>
              </label>
              <input 
                type="range" min="1" max="15" step="0.5"
                value={activeScene.reelSpeed || 5}
                onChange={(e) => {
                  const newScenes = [...inputProps.scenes];
                  newScenes[activeSceneIndex].reelSpeed = Number(e.target.value);
                  setInputProps((prev: any) => ({ ...prev, scenes: newScenes }));
                }}
                className="w-full accent-orange-500 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* ??? Dynamic Image List */}
            <label className="block text-[10px] font-bold text-zinc-500 mb-3 uppercase tracking-widest">Slide Images</label>
            <div className="flex flex-col gap-3">
              {activeScene.chartData?.map((item: any, idx: number) => (
                <div key={idx} className="p-3 bg-black/40 rounded-lg border border-white/10 flex flex-col gap-2 relative group">
                  {/* Remove Button */}
                  <button 
                    onClick={() => {
                      const newScenes = [...inputProps.scenes];
                      newScenes[activeSceneIndex].chartData.splice(idx, 1);
                      setInputProps((prev: any) => ({ ...prev, scenes: newScenes }));
                    }}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  >?</button>

                  <div className="flex gap-2">
                    {/* Label Input */}
                    <input 
                      type="text" 
                      placeholder="Label..."
                      value={item.label}
                      onChange={(e) => {
                        const newScenes = [...inputProps.scenes];
                        newScenes[activeSceneIndex].chartData[idx].label = e.target.value;
                        setInputProps((prev: any) => ({ ...prev, scenes: newScenes }));
                      }}
                      className="flex-1 bg-zinc-900 border border-white/5 rounded px-2 py-1 text-[10px] text-white"
                    />
                    
                    {/* Upload Button */}
                    <label className="cursor-pointer bg-zinc-800 hover:bg-zinc-700 px-2 py-1 rounded text-[9px] font-bold text-white transition-colors flex items-center">
                      UPLOAD
                      <input 
                        type="file" accept="image/*" className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              const newScenes = [...inputProps.scenes];
                              newScenes[activeSceneIndex].chartData[idx].image = reader.result as string;
                              setInputProps((prev: any) => ({ ...prev, scenes: newScenes }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>

                  {/* URL Input (Optional) */}
                  <input 
                    type="text" 
                    placeholder="Or paste URL..."
                    value={item.image || ""}
                    onChange={(e) => {
                      const newScenes = [...inputProps.scenes];
                      newScenes[activeSceneIndex].chartData[idx].image = e.target.value;
                      setInputProps((prev: any) => ({ ...prev, scenes: newScenes }));
                    }}
                    className="w-full bg-zinc-950 border border-white/5 rounded px-2 py-1 text-[9px] text-zinc-400"
                  />
                </div>
              ))}

              {/* ? Add Slide Button */}
              <button
                onClick={() => {
                  const newScenes = [...inputProps.scenes];
                  if (!newScenes[activeSceneIndex].chartData) newScenes[activeSceneIndex].chartData = [];
                  newScenes[activeSceneIndex].chartData.push({ label: `SLIDE ${newScenes[activeSceneIndex].chartData.length + 1}`, image: "" });
                  setInputProps((prev: any) => ({ ...prev, scenes: newScenes }));
                }}
                className="w-full mt-2 py-2 border border-dashed border-white/20 text-zinc-500 rounded-lg text-[10px] font-bold hover:bg-white/5 hover:text-white transition-colors"
              >
                + ADD NEW SLIDE
              </button>
            </div>
          </div>
        )}

        {/* ⬠ PENTAGON FLOW SETTINGS */}
        {activeScene.visualType === "PENTAGON_FLOW" && (
          <div className="mb-4 bg-zinc-900/40 border border-white/5 rounded-xl p-4">
            
            {/* ⚡ THE SPEED SLIDER */}
            <div className="mb-5 bg-black/40 p-3 rounded-lg border border-white/10">
              <label className="text-[10px] font-bold text-white uppercase tracking-widest mb-2 flex justify-between">
                <span>Hold Duration (Speed)</span>
                <span className="text-cyan-400">
                  {((activeScene.framesPerStage || 150) / 30).toFixed(1)}s per item
                </span>
              </label>
              <input 
                type="range" 
                min="45" max="150" step="15"
                value={activeScene.framesPerStage || 150}
                onChange={(e) => {
                  const newScenes = [...inputProps.scenes];
                  newScenes[activeSceneIndex].framesPerStage = parseInt(e.target.value);
                  setInputProps((prev: any) => ({ ...prev, scenes: newScenes }));
                }}
                className="w-full accent-cyan-400"
              />
              <div className="flex justify-between text-[9px] text-zinc-500 font-bold mt-1">
                <span>Fast (1.5s)</span>
                <span>Slow (5.0s)</span>
              </div>
            </div>

            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Flow Stages</h3>
            <div className="flex flex-col gap-3">
              {activeScene.chartData?.map((item: any, idx: number) => (
                <div key={idx} className="p-3 bg-black/40 rounded-lg border border-white/10 flex flex-col gap-2 relative group">
                  {/* Remove Button */}
                  <button 
                    onClick={() => {
                      const newScenes = [...inputProps.scenes];
                      newScenes[activeSceneIndex].chartData.splice(idx, 1);
                      setInputProps((prev: any) => ({ ...prev, scenes: newScenes }));
                    }}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  >✕</button>

                  <div className="flex gap-2">
                    {/* Label Input */}
                    <input 
                      type="text" 
                      placeholder="Label (e.g. EENT)"
                      value={item.label}
                      onChange={(e) => {
                        const newScenes = [...inputProps.scenes];
                        newScenes[activeSceneIndex].chartData[idx].label = e.target.value;
                        setInputProps((prev: any) => ({ ...prev, scenes: newScenes }));
                      }}
                      className="flex-1 bg-zinc-900 border border-white/5 rounded px-2 py-1 text-[10px] text-white font-bold uppercase"
                    />
                    
                    {/* Status Toggle */}
                    <select
                      value={item.status || "neutral"}
                      onChange={(e) => {
                        const newScenes = [...inputProps.scenes];
                        newScenes[activeSceneIndex].chartData[idx].status = e.target.value;
                        setInputProps((prev: any) => ({ ...prev, scenes: newScenes }));
                      }}
                      className="bg-zinc-800 border border-white/5 rounded px-2 py-1 text-[10px] text-white outline-none cursor-pointer"
                    >
                      <option value="neutral">Neutral</option>
                      <option value="wrong">Wrong (✕)</option>
                      <option value="correct">Correct (✓)</option>
                    </select>
                  </div>

                  {/* 🖼️ IMAGE UPLOAD & URL ROW */}
                  <div className="flex flex-col gap-2 mt-2">
                    <div className="flex items-center gap-2">
                      {/* Local File Upload */}
                      <label className="cursor-pointer bg-zinc-800 hover:bg-zinc-700 px-2 py-1.5 rounded text-[9px] font-bold text-white transition-colors whitespace-nowrap">
                        UPLOAD
                        <input 
                          type="file" accept="image/*" className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                const newScenes = [...inputProps.scenes];
                                newScenes[activeSceneIndex].chartData[idx].image = reader.result as string;
                                setInputProps((prev: any) => ({ ...prev, scenes: newScenes }));
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                      
                      <span className="text-[9px] text-zinc-600 font-bold">OR</span>
                      
                      {/* URL Paste Input */}
                      <input 
                        type="text" 
                        placeholder="Paste Image URL..."
                        // We only show the text if it's a URL (starts with http). 
                        // If it's a local file upload, it's a massive base64 string, so we hide that text.
                        value={item.image?.startsWith('http') ? item.image : ''}
                        onChange={(e) => {
                          const newScenes = [...inputProps.scenes];
                          newScenes[activeSceneIndex].chartData[idx].image = e.target.value;
                          setInputProps((prev: any) => ({ ...prev, scenes: newScenes }));
                        }}
                        className="flex-1 bg-zinc-900 border border-white/10 rounded px-2 py-1 text-[9px] text-white outline-none placeholder:text-zinc-600"
                      />
                    </div>
                    
                    {/* Status Indicator */}
                    {item.image && (
                      <div className="text-[9px] text-cyan-400 font-bold truncate">
                        ✓ {item.image.startsWith('data:') ? 'Local Image Added' : 'URL Image Added'}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* ➕ Add Stage Button */}
              <button
                onClick={() => {
                  const newScenes = [...inputProps.scenes];
                  if (!newScenes[activeSceneIndex].chartData) newScenes[activeSceneIndex].chartData = [];
                  newScenes[activeSceneIndex].chartData.push({ label: `ITEM ${newScenes[activeSceneIndex].chartData.length + 1}`, status: "neutral", image: "" });
                  setInputProps((prev: any) => ({ ...prev, scenes: newScenes }));
                }}
                className="w-full mt-2 py-2 border border-dashed border-white/20 text-zinc-500 rounded-lg text-[10px] font-bold hover:bg-white/5 hover:text-white transition-colors"
              >
                + ADD STAGE
              </button>
            </div>
          </div>
        )}

        {/*  COMPARISON SETTINGS */}
        {activeScene.visualType === "COMPARISON_PENTAGON" && (
          <div className="mb-4 bg-zinc-900/40 border border-white/5 rounded-xl p-4">
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Comparison Status</h3>
            <div className="flex gap-2">
              {(["neutral", "wrong", "correct"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    const newScenes = [...inputProps.scenes];
                    newScenes[activeSceneIndex].status = s as "neutral" | "wrong" | "correct";
                    setInputProps((prev: any) => ({ ...prev, scenes: newScenes }));
                  }}
                  className={`flex-1 py-2 rounded-lg text-[9px] font-bold uppercase transition-all ${activeScene.status === s ? 'bg-purple-600 text-white' : 'bg-zinc-800 text-zinc-500'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 🎨 ACCENT / HIGHLIGHT COLOR (GLOBAL) */}
        <div className="mb-4">
          <label className="block text-[10px] font-bold text-zinc-500 mb-2">GLOBAL ACCENT COLOR</label>
          <div className="flex gap-2">
            <input 
              type="color" value={inputProps.color || "#00d4ff"} 
              onChange={(e) => setInputProps((prev: VideoState) => ({ ...prev, color: e.target.value }))}
              className="w-12 h-12 rounded cursor-pointer bg-zinc-900 border border-white/10"
            />
            <input 
              type="text" value={inputProps.color || "#00d4ff"} 
              onChange={(e) => setInputProps((prev: VideoState) => ({ ...prev, color: e.target.value }))}
              className="flex-1 bg-zinc-900 border border-white/10 rounded p-3 text-sm text-white font-mono uppercase"
            />
          </div>
        </div>

        {/* ?? TRUE SCENE BACKGROUND COLOR */}
        <div className="mb-4">
          <label className="block text-[10px] font-bold text-zinc-500 mb-2">SCENE BACKGROUND COLOR</label>
          <div className="flex gap-2">
            <input 
              type="color" value={activeScene.sceneBgColor || "#050505"} 
              onChange={(e) => {
                const newScenes = [...inputProps.scenes];
                newScenes[activeSceneIndex] = { ...newScenes[activeSceneIndex], sceneBgColor: e.target.value };
                setInputProps((prev: VideoState) => ({ ...prev, scenes: newScenes }));
              }}
              className="w-12 h-12 rounded cursor-pointer bg-zinc-900 border border-white/10"
            />
            <input 
              type="text" value={activeScene.sceneBgColor || "#050505"} 
              onChange={(e) => {
                const newScenes = [...inputProps.scenes];
                newScenes[activeSceneIndex] = { ...newScenes[activeSceneIndex], sceneBgColor: e.target.value };
                setInputProps((prev: VideoState) => ({ ...prev, scenes: newScenes }));
              }}
              className="flex-1 bg-zinc-900 border border-white/10 rounded p-3 text-sm text-white font-mono uppercase"
            />
          </div>
        </div>

        <button 
          onClick={handleRenderAndExport}
          disabled={isRendering}
          className={`w-full py-4 rounded-xl font-black text-lg transition-all shadow-lg flex items-center justify-center gap-2 mt-auto 
            ${isRendering ? 'bg-purple-800 text-purple-300 cursor-wait' : 'bg-purple-600 hover:bg-purple-500 text-white hover:shadow-purple-500/25'}`}
        >
          {isRendering ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              RENDERING...
            </>
          ) : (
            "RENDER & EXPORT"
          )}
        </button>
      </aside>

      <main className="flex-1 flex flex-col items-center justify-center bg-[#050505] p-12 relative">
        {/* Your existing Player div below... */}
        {/* ?? Apply checkerboard directly to Player for transparent backgrounds */}
        <div className="h-[80vh] aspect-[9/16] rounded-[2.5rem] border-[12px] border-zinc-900 overflow-hidden shadow-2xl relative ring-1 ring-white/10">
          <Player
            component={MasterSequence}
            inputProps={{
              ...inputProps,
              activeLayers: activeLayers,    // ?? PASSING THE LAYERS OBJECT
              backgroundMode: backgroundMode, // ?? PASSING THE BACKGROUND STATE
              layoutMode: inputProps.layoutMode,
              reactionVideoUrl: inputProps.reactionVideoUrl,
              captions: normalizedCaptions // ⚡ CRITICAL: Use the bulletproof array!
            }}
            durationInFrames={dynamicDuration}
            fps={30}
            compositionWidth={1080}
            compositionHeight={1920}
            style={backgroundMode === 'transparent' ? {
              backgroundImage: `repeating-linear-gradient(45deg, #1f2937 25%, transparent 25%, transparent 75%, #1f2937 75%, #1f2937), repeating-linear-gradient(45deg, #1f2937 25%, #111827 25%, #111827 75%, #1f2937 75%, #1f2937)`,
              backgroundPosition: `0 0, 10px 10px`,
              backgroundSize: `20px 20px`,
              backgroundColor: 'transparent',
              width: "100%",
              height: "100%"
            } : {
              backgroundColor: '#050505',
              width: "100%",
              height: "100%"
            }}
            controls
            autoPlay
          />
        </div>
      </main>

      {/* ?? THE 4-TIER EXPORT MODAL */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6">
          <div className="bg-[#111] border border-white/10 rounded-3xl p-8 max-w-4xl w-full shadow-2xl relative">
            
            {/* Close Button */}
            <button 
              onClick={() => setShowExportModal(false)}
              className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors"
            >
              ?
            </button>

            <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-2">Export Project</h2>
            <p className="text-sm text-zinc-400 mb-8">Choose your preferred format for the ultimate editing workflow.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* TIER 1: FLAT MP4 */}
              <button 
                onClick={() => { setShowExportModal(false); handleDownload(); }}
                className="group flex flex-col items-start text-left p-6 bg-zinc-900/50 hover:bg-zinc-800 border border-white/5 hover:border-green-500/50 rounded-2xl transition-all"
              >
                <div className="w-12 h-12 bg-green-500/20 text-green-400 rounded-lg flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">??</div>
                <h3 className="text-white font-bold mb-1">Standard Video (.mp4)</h3>
                <p className="text-xs text-zinc-500">A single, flat video file. Perfect for beginners or immediate social media posting.</p>
              </button>

              {/* TIER 2: LAYERED ZIP */}
              <button 
                onClick={() => { setShowExportModal(false); handleDownload("layered"); }}
                className="group flex flex-col items-start text-left p-6 bg-zinc-900/50 hover:bg-zinc-800 border border-white/5 hover:border-purple-500/50 rounded-2xl transition-all"
              >
                <div className="w-12 h-12 bg-purple-500/20 text-purple-400 rounded-lg flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">??</div>
                <h3 className="text-white font-bold mb-1">Layered Asset Pack (.zip)</h3>
                <p className="text-xs text-zinc-500">Transparent layers (Hand, Brain, Text) separated into individual WebM files for Premiere/FCP.</p>
              </button>

              {/* TIER 3: AFTER EFFECTS SCRIPT */}
              <button 
                onClick={() => { setShowExportModal(false); handleDownload("aescript"); }}
                className="group flex flex-col items-start text-left p-6 bg-zinc-900/50 hover:bg-zinc-800 border border-white/5 hover:border-blue-500/50 rounded-2xl transition-all"
              >
                <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-lg flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">??</div>
                <h3 className="text-white font-bold mb-1">After Effects Studio Project (.zip)</h3>
                <p className="text-xs text-zinc-500">Downloads a complete package with all your images and a smart .jsx script for a 1:1, zero-effort reconstruction.</p>
              </button>

              {/* TIER 4: DAVINCI RESOLVE */}
              <button 
                // ⚡ FIX: Now actually triggers the download with the "davinci" flag
                onClick={() => { setShowExportModal(false); handleDownload("davinci"); }}
                className="group flex flex-col items-start text-left p-6 bg-zinc-900/50 hover:bg-zinc-800 border border-white/5 hover:border-red-500/50 rounded-2xl transition-all"
              >
                <div className="w-12 h-12 bg-red-500/20 text-red-400 rounded-lg flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">🔥</div>
                <h3 className="text-white font-bold mb-1">DaVinci Python (.py)</h3>
                <p className="text-xs text-zinc-500">Generates a Python API script to automatically reconstruct the timeline and media pool in DaVinci Resolve.</p>
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function EditorPage() {
  return (
    <Suspense fallback={<div className="h-screen w-full bg-black flex items-center justify-center text-white font-bold tracking-widest">LOADING EDITOR...</div>}>
      <EditorContent />
    </Suspense>
  );
}

