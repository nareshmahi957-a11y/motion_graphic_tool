import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import archiver from "archiver"; // ⚡ NEW: For creating the .zip file

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // ⚡ NEW: Extract exportType and layersToExport
    const { inputProps, durationInFrames, exportType, layersToExport } = body;

    const host = req.headers.get("host") || "localhost:3000";
    const protocol = req.headers.get("x-forwarded-proto") || "http";
    const baseUrl = `${protocol}://${host}`;

    // 🟢 THE FIX: Convert relative URLs to absolute URLs so the headless browser (Port 3001) 
    // knows to fetch the video from Next.js (Port 3000)!
    if (inputProps.reactionVideoUrl && inputProps.reactionVideoUrl.startsWith('/')) {
      inputProps.reactionVideoUrl = `${baseUrl}${inputProps.reactionVideoUrl}`;
    }

    const outDir = path.join(process.cwd(), "public", "renders");
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    // Intercept Base64 strings and save them (UNTOUCHED)
    if (inputProps && inputProps.scenes) {
      inputProps.scenes.forEach((scene: any, i: number) => {
        Object.keys(scene).forEach((key) => {
          const val = scene[key];
          if (typeof val === 'string' && val.startsWith('data:image/')) {
            const parts = val.split(';base64,');
            if (parts.length === 2) {
              const extMatch = parts[0].match(/image\/(jpeg|png|webp|gif)/);
              const ext = extMatch ? extMatch[1] : 'png';
              const buffer = Buffer.from(parts[1], 'base64');
              const fileName = `local-asset-${Date.now()}-${i}-${key}.${ext}`;
              const filePath = path.join(outDir, fileName);
              fs.writeFileSync(filePath, buffer);
              scene[key] = `${baseUrl}/renders/${fileName}`;
            }
          }
        });
      });
    }

    const entryPoint = path.resolve(process.cwd(), "src", "remotion", "Root.tsx"); 

    console.log("Bundling video...");
    const serveUrl = await bundle({ entryPoint });

    console.log("Selecting composition...");
    const composition = await selectComposition({
      serveUrl,
      id: "Main", 
      inputProps,
      timeoutInMilliseconds: 120000, // ⚡ FIX: Added 2-minute timeout to prevent headless browser crash
    });

    const finalDuration = durationInFrames || composition.durationInFrames;

    // 🚀 NEW BRANCH: TIER 2 LAYERED EXPORT
    if (exportType === "layered" && Array.isArray(layersToExport)) {
      console.log(`Starting Layered Export for ${layersToExport.length} layers...`);
      const renderedFiles: { path: string; name: string }[] = [];

      // Loop through each requested layer and render it alone
      for (const layerId of layersToExport) {
        console.log(`Rendering layer: ${layerId} as standard MP4...`);
        // ⚡ CHANGE 1: Universal .mp4 extension
        const layerOutputLocation = path.join(outDir, `${layerId}-${Date.now()}.mp4`); 
        
        const explicitLayerState: any = {};
        for (const id of layersToExport) {
          explicitLayerState[id] = false;
        }
        explicitLayerState[layerId] = true;

        const isolatedProps = {
          ...inputProps,
          // ⚡ CHANGE 2: Pure black background (Industry standard for "Screen" blending)
          backgroundMode: 'black', 
          activeLayers: explicitLayerState
        };

        const layerComposition = await selectComposition({
          serveUrl,
          id: "Main",
          inputProps: isolatedProps,
          timeoutInMilliseconds: 120000, // ⚡ FIX: Added 2-minute timeout here as well
        });

        await renderMedia({
          composition: { ...layerComposition, durationInFrames: finalDuration },
          serveUrl,
          outputLocation: layerOutputLocation,
          inputProps: isolatedProps,
          // ⚡ CHANGE 3: Standard codec, no transparency flags needed
          codec: "h264", 
          timeoutInMilliseconds: 120000, 
          concurrency: 2, 
          chromiumOptions: {
            disableWebSecurity: true,
            args: ["--force-color-profile=display-p3-d65", "--disable-web-security"]
          } as any,
        });

        renderedFiles.push({ path: layerOutputLocation, name: `${layerId}.mp4` });
      }

      console.log("Zipping layers...");
      const zipFileName = `Layered-Assets-${Date.now()}.zip`;
      const zipFilePath = path.join(outDir, zipFileName);
      
      await new Promise<void>((resolve, reject) => {
        const output = fs.createWriteStream(zipFilePath);
        const archive = archiver('zip', { zlib: { level: 9 } });
        
        output.on('close', () => resolve());
        archive.on('error', (err) => reject(err));
        
        archive.pipe(output);
        renderedFiles.forEach(file => {
          archive.file(file.path, { name: file.name });
        });
        archive.finalize();
      });

      console.log("✅ Layered ZIP Complete!");
      return NextResponse.json({ url: `/renders/${zipFileName}` });
    } 
    
    // 🚀 NEW BRANCH: TIER 3 AFTER EFFECTS SCRIPT
    // 🚀 TIER 3: PRECISION AE STUDIO PROJECT (RECONSTRUCTION)
    else if (exportType === "aescript") {
      const scene = inputProps.scenes[0];
      const exportId = `AE-Studio-${Date.now()}`;
      const projectDir = path.join(outDir, exportId);
      const assetsDir = path.join(projectDir, "Assets");

      if (!fs.existsSync(projectDir)) fs.mkdirSync(projectDir, { recursive: true });
      if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });

      // 1. Asset Sync
      const allAssets = ['palm.png', 'finger1.png', 'finger2.png', 'finger3.png', 'finger4.png', 'brain.png'];
      allAssets.forEach(file => {
        try {
          const srcPath = path.join(process.cwd(), 'public', 'renders', 'hand', file);
          if (fs.existsSync(srcPath)) fs.copyFileSync(srcPath, path.join(assetsDir, file));
        } catch (e) { console.error(`Missing: ${file}`); }
      });

      const hexToAe = (hex: string) => {
        const c = hex.replace('#', '');
        return `[${parseInt(c.substr(0,2),16)/255}, ${parseInt(c.substr(2,2),16)/255}, ${parseInt(c.substr(4,2),16)/255}]`;
      };

      const jsxContent = `
app.beginUndoGroup("AutoAE Precision Rebuild");
var mainComp = app.project.items.addComp("AutoAE_Studio_Final", 1080, 1920, 1, 10, 30);
mainComp.openInViewer();

// 1. Dynamic Background
var bg = mainComp.layers.addSolid(${hexToAe(scene.sceneBgColor || "#050505")}, "AUTOAE_BG", 1080, 1920, 1);
bg.locked = true;

var folder = new File($.fileName).parent.fsName;
var assetsPath = folder + ($.os.indexOf("Windows") !== -1 ? "\\\\Assets\\\\" : "/Assets/");

function addAsset(file, name) {
    var f = new File(assetsPath + file);
    if (!f.exists) return null;
    var l = mainComp.layers.add(app.project.importFile(new ImportOptions(f)));
    l.name = name;
    return l;
}

// 2. THE RIG (Precision Knuckle Alignment)
var handX = 540 + (${scene.handX || -138});
var handY = 300 + (${scene.handY || -182});
var handScale = (${scene.handSize || 600} / 6); 

var palm = addAsset("palm.png", "AUTOAE_PALM");
palm.property("Position").setValue([handX, handY]);
palm.property("Rotation").setValue(${scene.handRotation || 6});
palm.property("Scale").setValue([handScale, handScale]);
// Floating Hand Expression
palm.property("Position").expression = "value + [0, Math.sin(time*3)*20]";

function rigFinger(file, name, xPct, yPct, rot) {
    var f = addAsset(file, name);
    if (!f) return null;
    // ⚡ STEP 1: Move Anchor Point to the knuckle (far left of image)
    f.property("Anchor Point").setValue([0, f.height/2]);
    // ⚡ STEP 2: Parent BEFORE positioning to zero-out coordinates
    f.parent = palm;
    // ⚡ STEP 3: Apply percentages relative to palm width/height
    var xOff = (xPct / 100) * palm.width;
    var yOff = (yPct / 100) * palm.height;
    f.property("Position").setValue([xOff, yOff]);
    f.property("Rotation").setValue(rot);
    f.property("Scale").setValue([100, 100]); // Reset scale inherited from palm
    return f;
}

var f1 = rigFinger("finger1.png", "AUTOAE_INDEX", 14, 41, 33);
var f2 = rigFinger("finger2.png", "AUTOAE_MIDDLE", 14, 45, 33);
var f3 = rigFinger("finger3.png", "AUTOAE_RING", 8, 47, 33);
var f4 = rigFinger("finger4.png", "AUTOAE_PINKY", 33, -50, 0);

// 3. The Brain (Hero Object)
var brain = addAsset("brain.png", "AUTOAE_BRAIN");
if (brain) {
    brain.property("Position").setValue([540, 850]);
    brain.property("Position").expression = "value + [0, Math.sin(time*2.5)*35]";
    var g = brain.Effects.addProperty("ADBE Glo2");
    g.property("Glow Radius").setValue(60);
    g.property("Color A").setValue(${hexToAe(scene.color || "#00ffff")});
}

// 4. Connecting Strings (Beam Logic)
function addString(name, startLayer, endLayer) {
    var s = mainComp.layers.addSolid([1,1,1], name, 1080, 1920, 1);
    var b = s.Effects.addProperty("ADBE Beam");
    b.property("Starting Point").expression = "thisComp.layer('" + startLayer.name + "').transform.position";
    b.property("Ending Point").expression = "thisComp.layer('" + endLayer.name + "').transform.position";
    b.property("Starting Thickness").setValue(2.5);
    b.property("Ending Thickness").setValue(1);
    b.property("Inside Color").setValue([1,1,1]);
    s.moveAfter(palm);
}

if(f1 && brain) addString("STRING_INDEX", f1, brain);
if(f2 && brain) addString("STRING_MIDDLE", f2, brain);

// 5. Precision Per-Character Typewriter Zoom Animation
function addText(str, size, col, y, delayFrames, isHighlight) {
    if(!str) return;
    var t = mainComp.layers.addText(str);
    var p = t.property("Source Text");
    var d = p.value;
    d.fontSize = size; 
    d.fillColor = col; 
    d.justification = ParagraphJustification.CENTER_JUSTIFY;
    p.setValue(d);
    t.property("Position").setValue([540, y]);
    
    // Add the Animator for Per-Character Scaling
    var animator = t.Text.Animators.addProperty("ADBE Text Animator");
    var scaleProp = animator.property("ADBE Text Animator Properties").addProperty("ADBE Text Scale");
    scaleProp.setValue([0, 0, 0]); // Start at 0 size

    // Add Range Selector and the cascading math
    var selector = animator.Selectors.addProperty("ADBE Text Selector");
    var delaySec = delayFrames / 30;
    
    // This expression creates the individual "pop" for each character
    selector.property("ADBE Text Percent Start").setValue(0);
    selector.property("ADBE Text Percent End").setValue(100);
    
    // The "Offset" handles the typewriter timing
    var offsetExpr = "var d = " + delaySec + "; var dur = 0.5; if(time < d) { -100 } else { linear(time, d, d + dur, -100, 100) }";
    selector.property("ADBE Text Index Offset").expression = offsetExpr;
    
    // Smooth out the scale-up (Ease High/Low)
    selector.property("ADBE Text Selector Advanced").property("ADBE Text Smoothness").setValue(0);
}

// Update the calls to include the highlight flag
addText("${scene.chartData?.[0]?.label || ""}", 45, [1,1,1], 1350, 0, false);
addText("${scene.chartData?.[1]?.label || ""}", ${scene.customFontSize || 135}, ${hexToAe(scene.color || "#00ffff")}, 1450, 15, true);
addText("${scene.chartData?.[2]?.label || ""}", 40, [1,1,1], 1550, 30, false);

alert("AutoAE Pro: Zero-Effort Studio Rig Complete!");
app.endUndoGroup();
`;

      fs.writeFileSync(path.join(projectDir, "AutoAE-Builder.jsx"), jsxContent);
      const zipFileName = `${exportId}.zip`;
      const zipFilePath = path.join(outDir, zipFileName);
      const output = fs.createWriteStream(zipFilePath);
      const archive = archiver('zip', { zlib: { level: 9 } });
      await new Promise((res, rej) => {
        output.on('close', res); archive.on('error', rej);
        archive.pipe(output); archive.directory(projectDir, false); archive.finalize();
      });
      return NextResponse.json({ url: `/renders/${zipFileName}` });
    }
    
    // 🚀 TIER 4: DAVINCI RESOLVE PYTHON SCRIPT
    else if (exportType === "davinci") {
      console.log("Generating DaVinci Resolve Python Script...");
      const exportId = `DaVinci-Studio-${Date.now()}`;
      const projectDir = path.join(outDir, exportId);
      const assetsDir = path.join(projectDir, "Assets");

      if (!fs.existsSync(projectDir)) fs.mkdirSync(projectDir, { recursive: true });
      if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });

      // 1. Asset Sync (Pulling the transparent parts)
      const allAssets = ['palm.png', 'finger1.png', 'finger2.png', 'finger3.png', 'finger4.png', 'brain.png'];
      allAssets.forEach(file => {
        try {
          const srcPath = path.join(process.cwd(), 'public', 'renders', 'hand', file);
          if (fs.existsSync(srcPath)) fs.copyFileSync(srcPath, path.join(assetsDir, file));
        } catch (e) { console.error(`Missing: ${file}`); }
      });

      // 2. The Python API Script for DaVinci Resolve
      const pythonContent = `#!/usr/bin/env python
import os
import sys

print("Initializing AutoAE DaVinci Build...")

# 1. Connect to DaVinci Resolve API
try:
    import DaVinciResolveScript as dvr_script
    resolve = dvr_script.scriptapp("Resolve")
except ImportError:
    print("Error: Could not connect to DaVinci Resolve API. Ensure Resolve is open and External Scripting is set to Local.")
    sys.exit()

projectManager = resolve.GetProjectManager()
project = projectManager.GetCurrentProject()
mediaPool = project.GetMediaPool()

if not project:
    print("Please open a project in DaVinci Resolve first.")
    sys.exit()

# 2. Setup Paths
script_dir = os.path.dirname(os.path.abspath(__file__))
assets_dir = os.path.join(script_dir, "Assets")

if not os.path.exists(assets_dir):
    print(f"Error: Assets folder not found at {assets_dir}")
    sys.exit()

# 3. Create a dedicated Bin
root_folder = mediaPool.GetRootFolder()
new_bin = mediaPool.AddSubFolder(root_folder, "AutoAE_Assets_${Date.now().toString().slice(-4)}")
mediaPool.SetCurrentFolder(new_bin)

# 4. Import Media
files_to_import = [os.path.join(assets_dir, f) for f in os.listdir(assets_dir) if f.endswith(('.png', '.mp4', '.jpg'))]
print(f"Importing {len(files_to_import)} assets...")
imported_items = mediaPool.ImportMedia(files_to_import)

if not imported_items:
    print("No media imported. Check asset paths.")
    sys.exit()

# 5. Create Timeline
timeline_name = "AutoAE_Studio_Build"
timeline = mediaPool.CreateEmptyTimeline(timeline_name)
if not timeline:
    print("Failed to create timeline.")
    sys.exit()

project.SetCurrentTimeline(timeline)

# 6. Stack Assets on Timeline (Layering)
# We loop through imported items and drop them onto consecutive video tracks
for idx, item in enumerate(imported_items):
    clip_info = {
        "mediaPoolItem": item,
        "startFrame": 0,
        "endFrame": ${finalDuration}, # Matches Remotion exact duration
        "trackIndex": idx + 1,        # Stacks on V1, V2, V3...
        "mediaType": 1                # 1 = Video Type
    }
    mediaPool.AppendToTimeline([clip_info])

print("✅ AutoAE Build Complete! Check your timeline.")
`;

      fs.writeFileSync(path.join(projectDir, "AutoAE-Builder.py"), pythonContent);
      
      // 3. Zip it all up
      const zipFileName = `${exportId}.zip`;
      const zipFilePath = path.join(outDir, zipFileName);
      const output = fs.createWriteStream(zipFilePath);
      const archive = archiver('zip', { zlib: { level: 9 } });
      
      await new Promise((res, rej) => {
        output.on('close', res); 
        archive.on('error', rej);
        archive.pipe(output); 
        archive.directory(projectDir, false); 
        archive.finalize();
      });

      console.log("✅ DaVinci ZIP Complete!");
      return NextResponse.json({ url: `/renders/${zipFileName}` });
    }
    
    // 🎥 ORIGINAL BRANCH: TIER 1 STANDARD MP4
    else {
      console.log(`Rendering Standard MP4! Total frames: ${finalDuration}`);
      const outputLocation = path.join(outDir, `video-${Date.now()}.mp4`);

      await renderMedia({
        composition: { ...composition, durationInFrames: finalDuration },
        serveUrl,
        outputLocation,
        inputProps,
        codec: "h264",
        timeoutInMilliseconds: 120000, 
        concurrency: 2, 
        chromiumOptions: {
          disableWebSecurity: true,
          args: ["--force-color-profile=display-p3-d65", "--disable-web-security"]
        } as any,
      });

      console.log("✅ Standard Render Complete!");
      return NextResponse.json({ url: `/renders/${path.basename(outputLocation)}` });
    }

  } catch (error: any) {
    console.error("Render Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}