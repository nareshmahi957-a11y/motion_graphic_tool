import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing, Series } from "remotion";
import React from "react";

// --- 🎬 SCENE 1: HYPER IMPACT (Fallback / Stomp) ---
export const HyperImpactTemplate: React.FC<any> = ({ headerText = "IMPACT", color = "#F40009", backgroundImage }) => {
  const frame = useCurrentFrame();
  const scale = spring({ frame, fps: 30, config: { damping: 12, stiffness: 200 } });
  
  return (
    <AbsoluteFill style={{ backgroundColor: color, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
      {backgroundImage && (
        <img src={backgroundImage} style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4, mixBlendMode: 'overlay' }} alt="bg" />
      )}
      <h1 style={{ 
        fontSize: '90px', color: 'white', fontWeight: 900, 
        transform: `scale(${scale})`, textAlign: 'center', 
        textTransform: 'uppercase', textShadow: '0 20px 40px rgba(0,0,0,0.5)', lineHeight: 1
      }}>
        {headerText.split(' ').join('\n')}
      </h1>
    </AbsoluteFill>
  );
};

// --- 🎬 SCENE 2: THE MACRO POUR ---
export const CinematicPourTemplate: React.FC<any> = ({ headerText = "POUR", color = "#F40009" }) => {
  const frame = useCurrentFrame();

  const zoomScale = interpolate(frame, [50, 130], [1, 3.2], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const panX = interpolate(frame, [50, 130], [0, 120], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const panY = interpolate(frame, [50, 130], [0, -40], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const fillLevel = interpolate(frame, [15, 65], [0, 85], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const bottleY = interpolate(frame, [0, 15, 60, 75], [-400, -180, -180, -450], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const bottleTilt = interpolate(frame, [0, 15, 60, 75], [0, 105, 105, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const streamOpacity = interpolate(frame, [10, 15, 55, 60], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const streamWobble = Math.sin(frame) * 2; 

  const iceFloat = interpolate(fillLevel, [0, 85], [0, -80]);
  const tableIce = new Array(45).fill(0).map((_, i: number) => ({
    x: -900 + (i * 40), yOffset: Math.sin(i) * 20, size: 25 + (i % 5) * 20, rot: (i * 117) % 360 
  }));

  const droplets = new Array(35).fill(0).map((_, i: number) => ({
    x: 5 + (i * 37) % 90, y: 10 + (i * 53) % 80, size: 4 + (i % 8), speed: 0.2 + (i % 4) * 0.4 
  }));

  const textOpacity = interpolate(frame, [90, 110], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: '#050000', overflow: 'hidden' }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at center, #4a0000 0%, #050000 100%)` }}>
        <div style={{ position: 'absolute', top: '20%', left: '30%', width: '500px', height: '500px', background: '#880000', filter: 'blur(150px)', opacity: 0.3 }} />
        <div style={{ position: 'absolute', top: '60%', right: '10%', width: '400px', height: '400px', background: '#aa2200', filter: 'blur(120px)', opacity: 0.15 }} />
      </AbsoluteFill>

      <AbsoluteFill style={{ transform: `scale(${zoomScale}) translate(${panX}px, ${panY}px)`, justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ position: 'absolute', top: `${bottleY}px`, left: '50%', transformOrigin: 'top center', transform: `translateX(-50%) rotate(${bottleTilt}deg)`, zIndex: 15, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: '28px', height: '14px', backgroundColor: '#silver', borderRadius: '3px', border: '1px solid #999', boxShadow: '0 5px 10px rgba(0,0,0,0.5)' }} />
          <div style={{ width: '36px', height: '90px', background: 'linear-gradient(90deg, #0a0200 0%, #3a0a00 30%, #5a0c00 50%, #0a0200 100%)', borderRadius: '8px 8px 0 0', borderLeft: '2px solid rgba(255,255,255,0.4)', boxShadow: 'inset 0 0 10px rgba(0,0,0,0.8)' }} />
          <div style={{ width: '90px', height: '200px', background: 'linear-gradient(90deg, #050100 0%, #2a0500 20%, #4a0a00 50%, #050100 100%)', borderRadius: '40px 40px 10px 10px', borderLeft: '3px solid rgba(255,255,255,0.3)', borderRight: '1px solid rgba(255,255,255,0.1)', boxShadow: 'inset 0 -30px 50px rgba(0,0,0,0.9)', position: 'relative', overflow: 'hidden' }}>
             <div style={{ position: 'absolute', top: '50px', width: '100%', height: '50px', backgroundColor: '#e60000', borderTop: '1px solid #ff4444', borderBottom: '1px solid #ff4444', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><div style={{ color: 'white', fontSize: '10px', letterSpacing: '2px' }}>COLA</div></div>
          </div>
        </div>

        <div style={{ position: 'absolute', top: '-180px', left: `calc(50% + ${streamWobble}px)`, marginLeft: '-8px', width: '16px', height: '380px', background: 'linear-gradient(to right, rgba(80,10,0,0.95), rgba(40,5,0,0.8), rgba(80,10,0,0.95))', opacity: streamOpacity, filter: 'blur(2px)', zIndex: 12, borderRadius: '10px' }} />

        <div style={{ position: 'absolute', top: '55%', width: '100%', height: '100px', zIndex: 5, filter: 'blur(3px)' }}>
          {tableIce.map((ice: any, i: number) => (
            <div key={i} style={{ position: 'absolute', left: `calc(50% + ${ice.x}px)`, top: `${ice.yOffset}px`, width: `${ice.size}px`, height: `${ice.size}px`, background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.05) 100%)', border: '1px solid rgba(255,255,255,0.6)', borderRadius: '8px', transform: `rotate(${ice.rot}deg)`, backdropFilter: 'blur(6px)', boxShadow: 'inset 0 0 15px rgba(255,255,255,0.8), 0 15px 25px rgba(0,0,0,0.6)' }} />
          ))}
        </div>

        <div style={{ width: '230px', height: '380px', position: 'relative', overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(4px)', borderRadius: '10px 10px 30px 30px', border: '3px solid rgba(255,255,255,0.4)', borderTop: 'none', boxShadow: 'inset 0 0 50px rgba(0,0,0,0.8), 0 20px 40px rgba(0,0,0,0.5)', marginTop: '100px', zIndex: 10 }}>
          <div style={{ position: 'absolute', top: 0, left: '5%', width: '90%', height: '10px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)', borderRadius: '50%', zIndex: 25 }} />
          <div style={{ position: 'absolute', bottom: `calc(10% - ${iceFloat}px)`, left: '15%', width: '75px', height: '75px', background: 'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.1) 100%)', border: '2px solid rgba(255,255,255,0.9)', borderRadius: '12px', transform: 'rotate(15deg)', backdropFilter: 'blur(4px)', boxShadow: 'inset 0 0 20px rgba(255,255,255,0.8)', zIndex: 5 }} />
          <div style={{ position: 'absolute', bottom: `calc(30% - ${iceFloat * 1.3}px)`, right: '15%', width: '60px', height: '60px', background: 'linear-gradient(135deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.05) 100%)', border: '2px solid rgba(255,255,255,0.7)', borderRadius: '10px', transform: 'rotate(-25deg)', backdropFilter: 'blur(4px)', boxShadow: 'inset 0 0 15px rgba(255,255,255,0.6)', zIndex: 5 }} />
          <div style={{ position: 'absolute', bottom: 0, width: '100%', height: `${fillLevel}%`, background: 'linear-gradient(to top, #0a0100 0%, #2a0800 60%, #4a0c00 100%)', boxShadow: 'inset 0 20px 30px rgba(0,0,0,0.6)', zIndex: 10 }} />
          <div style={{ position: 'absolute', top: '45%', left: '0', width: '100%', display: 'flex', justifyContent: 'center', zIndex: 15, transform: 'rotate(-5deg)' }}>
             <img src="https://upload.wikimedia.org/wikipedia/commons/c/ce/Coca-Cola_logo.svg" alt="Coca-Cola" style={{ width: '180px', filter: 'brightness(0) invert(1) drop-shadow(0px 2px 4px rgba(0,0,0,0.8))', opacity: 0.9 }} />
          </div>
          {droplets.map((d: any, i: number) => {
             const slide = interpolate(frame, [80, 150], [0, d.speed * 40], { extrapolateRight: 'clamp' });
             return <div key={i} style={{ position: 'absolute', top: `${d.y}%`, left: `${d.x}%`, width: `${d.size}px`, height: `${d.size * 1.3}px`, transform: `translateY(${slide}px)`, zIndex: 20, borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9) 0%, transparent 50%)', boxShadow: 'inset 0 -2px 5px rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.2)' }} />
          })}
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'flex-end', paddingRight: '50px', opacity: textOpacity, pointerEvents: 'none', zIndex: 50 }}>
        <h1 style={{ fontSize: '85px', fontWeight: 900, color: 'white', textTransform: 'uppercase', textAlign: 'right', lineHeight: 1.1, textShadow: `0 10px 40px rgba(0,0,0,0.9), 0 0 40px ${color}` }}>
          {headerText.split(' ').join('\n')}
        </h1>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// --- 🎬 SCENE 3: VERTICAL SPLIT ---
export const VerticalSplitTemplate: React.FC<any> = ({ headerText = "SPLIT", leftText = "DULL OFFICE", rightText = "VIBRANT BEACH", backgroundImage, backgroundImage2, color = "#F40009" }) => {
  const frame = useCurrentFrame();
  const topImage = backgroundImage || "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&q=80";
  const bottomImage = backgroundImage2 || "https://images.unsplash.com/photo-1520116468816-95b69f847357?w=800&q=80";
  const introSpring = spring({ frame, fps: 30, config: { damping: 14 } });
  const dividerWidth = interpolate(introSpring, [0, 1], [0, 100]);
  const panTop = interpolate(frame, [0, 150], [0, -50]);
  const panBottom = interpolate(frame, [0, 150], [0, 50]);

  return (
    <AbsoluteFill style={{ backgroundColor: color }}>
      <AbsoluteFill style={{ height: '50%', top: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: '120%', height: '100%', transform: `translateX(${panTop}px)` }}>
          <img src={topImage} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(100%) contrast(120%) brightness(80%)' }} alt="top" />
        </div>
        <div style={{ position: 'absolute', top: '40px', left: '40px', background: 'rgba(0,0,0,0.7)', padding: '10px 30px', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.2)', color: 'white', fontSize: '25px', fontWeight: 'bold', backdropFilter: 'blur(10px)' }}>
          {leftText}
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{ height: '50%', top: '50%', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: '120%', height: '100%', transform: `translateX(${panBottom}px)`, left: '-10%' }}>
          <img src={bottomImage} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(180%) contrast(110%) brightness(110%)' }} alt="bottom" />
        </div>
        <div style={{ position: 'absolute', bottom: '40px', right: '40px', background: 'rgba(255,255,255,0.95)', padding: '10px 30px', borderRadius: '50px', color: 'black', fontSize: '25px', fontWeight: 'bold', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
          {rightText}
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', pointerEvents: 'none', zIndex: 10 }}>
         <div style={{ width: `${dividerWidth}%`, height: '8px', backgroundColor: '#ffffff', boxShadow: `0 0 20px rgba(255,255,255,0.8)` }} />
         <div style={{ position: 'absolute', background: color, padding: '15px 50px', borderRadius: '15px', transform: `scale(${introSpring})`, border: `4px solid #ffffff`, boxShadow: '0 15px 40px rgba(0,0,0,0.6)' }}>
           <h1 style={{ fontSize: '55px', fontWeight: 900, color: 'white', textTransform: 'uppercase', margin: 0, letterSpacing: '3px', textAlign: 'center', lineHeight: '1.1' }}>
              {headerText.split(' ').join('\n')}
           </h1>
         </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// --- 🎬 SCENE 4: ICE BUCKET FLAT LAY ---
export const IceBucketTemplate: React.FC<any> = ({ headerText = "ICE COLD", color = "#F40009" }) => {
  const frame = useCurrentFrame();

  const zoomScale = interpolate(frame, [0, 150], [0.85, 1.15], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const cameraRotate = interpolate(frame, [0, 150], [-5, 5], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const sunRayPosition = interpolate(frame, [0, 120], [-50, 150], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const sunOpacity = interpolate(frame, [0, 30, 90, 150], [0, 0.8, 0.8, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const crushedIce = new Array(150).fill(0).map((_, i: number) => {
    const radius = (i % 50) * 6; const angle = i * 13.7; 
    return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius, size: 20 + (i % 4) * 15, rot: (i * 73) % 360 };
  });

  const bottles = [0, 120, 240];
  const textOpacity = interpolate(frame, [60, 90], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: '#1a1a1a', overflow: 'hidden' }}>
      <AbsoluteFill style={{ background: 'radial-gradient(circle at center, #333 0%, #000 100%)' }} />
      <AbsoluteFill style={{ transform: `scale(${zoomScale}) rotate(${cameraRotate}deg)`, justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: '700px', height: '700px', borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, #444 0%, #111 80%)', border: '25px solid #888', boxShadow: 'inset 20px 20px 60px rgba(0,0,0,0.9), 40px 40px 80px rgba(0,0,0,0.9)', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-25px', left: '-25px', right: '-25px', bottom: '-25px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.4)', pointerEvents: 'none', zIndex: 50 }} />
          <div style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 5 }}>
            {crushedIce.map((ice: any, i: number) => (
              <div key={i} style={{ position: 'absolute', left: `calc(50% + ${ice.x}px - ${ice.size / 2}px)`, top: `calc(50% + ${ice.y}px - ${ice.size / 2}px)`, width: `${ice.size}px`, height: `${ice.size}px`, background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.05) 100%)', border: '1px solid rgba(255,255,255,0.6)', borderRadius: '6px', transform: `rotate(${ice.rot}deg)`, backdropFilter: 'blur(3px)', boxShadow: '4px 4px 10px rgba(0,0,0,0.5), inset 0 0 10px rgba(255,255,255,0.8)' }} />
            ))}
          </div>
          {bottles.map((rotation, index) => (
            <div key={index} style={{ position: 'absolute', width: '100%', height: '100%', transform: `rotate(${rotation}deg)`, zIndex: 10, pointerEvents: 'none' }}>
              <div style={{ position: 'absolute', top: '80px', left: '50%', transform: 'translateX(-50%)', width: '100px', height: '320px', display: 'flex', flexDirection: 'column', alignItems: 'center', filter: 'drop-shadow(30px 30px 15px rgba(0,0,0,0.8))' }}>
                <div style={{ width: '30px', height: '20px', background: 'linear-gradient(90deg, #999 0%, #eee 50%, #999 100%)', borderRadius: '3px', borderTop: '2px solid white' }} />
                <div style={{ width: '40px', height: '90px', background: 'linear-gradient(90deg, #1a0500 0%, #4a0a00 20%, #8a1a00 50%, #1a0500 100%)', borderRadius: '5px 5px 0 0', borderLeft: '2px solid rgba(255,255,255,0.5)' }} />
                <div style={{ width: '100px', height: '210px', background: 'linear-gradient(90deg, #0a0100 0%, #2a0500 20%, #4a0a00 50%, #0a0100 100%)', borderRadius: '30px 30px 15px 15px', position: 'relative', overflow: 'hidden', borderLeft: '3px solid rgba(255,255,255,0.4)', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
                   <div style={{ position: 'absolute', top: '60px', width: '100%', height: '55px', backgroundColor: color, display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 5px 15px rgba(0,0,0,0.5)' }}>
                     <img src="https://upload.wikimedia.org/wikipedia/commons/c/ce/Coca-Cola_logo.svg" alt="Coca-Cola" style={{ width: '80px', filter: 'brightness(0) invert(1)', transform: 'rotate(-90deg)' }} />
                   </div>
                   <div style={{ position: 'absolute', top: '10px', left: '10px', width: '15px', height: '190px', background: 'linear-gradient(180deg, rgba(255,255,255,0.6) 0%, transparent 100%)', borderRadius: '10px', filter: 'blur(1px)' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `linear-gradient(45deg, transparent ${sunRayPosition - 20}%, rgba(255,250,220,0.15) ${sunRayPosition - 10}%, rgba(255,250,200,0.4) ${sunRayPosition}%, rgba(255,250,220,0.15) ${sunRayPosition + 10}%, transparent ${sunRayPosition + 20}%)`, mixBlendMode: 'screen', opacity: sunOpacity, pointerEvents: 'none', zIndex: 40 }} />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', opacity: textOpacity, pointerEvents: 'none', zIndex: 50 }}>
        <div style={{ background: 'rgba(0,0,0,0.6)', padding: '20px 50px', borderRadius: '15px', backdropFilter: 'blur(10px)', border: `2px solid ${color}`, boxShadow: '0 20px 50px rgba(0,0,0,0.8)' }}>
          <h1 style={{ fontSize: '60px', fontWeight: 900, color: 'white', textTransform: 'uppercase', textAlign: 'center', margin: 0, letterSpacing: '5px' }}>
            {headerText.split(' ').join('\n')}
          </h1>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};


// --- 🎬 FALLBACK TEMPLATES (So your app doesn't crash) ---
export const CokeCinematicTemplate: React.FC<any> = ({ headerText = "CHRONO", color = "#F40009" }) => (
  <AbsoluteFill style={{ backgroundColor: color, justifyContent: 'center', alignItems: 'center' }}>
    <h1 style={{ fontSize: '60px', color: 'white' }}>{headerText}</h1>
  </AbsoluteFill>
);
export const GenericTemplate: React.FC<any> = ({ headerText = "TEMPLATE", color = "#F40009" }) => (
  <AbsoluteFill style={{ backgroundColor: '#111', justifyContent: 'center', alignItems: 'center' }}>
    <h1 style={{ fontSize: '60px', color: color }}>{headerText}</h1>
  </AbsoluteFill>
);


// --- 🎛️ SCENE SWITCHBOARD ---
export const renderSceneComponent = (scene: any, color: string) => {
  const type = scene.visualType;
  
  if (type === "HYPER_IMPACT" || type === "KINETIC_STOMP" || type === "BOTTLE_POP" || type === "IMPACT_VIDEO") return <HyperImpactTemplate {...scene} color={color} />;
  if (type === "MACRO_POUR") return <CinematicPourTemplate {...scene} color={color} />;
  if (type === "VERTICAL_SPLIT") return <VerticalSplitTemplate {...scene} color={color} />;
  if (type === "ICE_BUCKET") return <IceBucketTemplate {...scene} color={color} />;
  
  // Original/Fallback routes
  if (type === "CHRONO") return <CokeCinematicTemplate {...scene} color={color} />;
  
  // Generic safe fallbacks for your older templates so it never crashes
  return <GenericTemplate {...scene} color={color} />;
};


// --- 🎬 MASTER SCENE WRAPPER (Handles ALL Transitions) ---
export const SceneWrapper: React.FC<{ scene: any, color: string, duration: number }> = ({ scene, color, duration }) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  const transType = scene.transition || "bubble_wipe";

  // Timing Logic
  const isEnding = frame >= duration - 30; 
  const wipeProgress = interpolate(frame, [duration - 30, duration], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const fastProgress = interpolate(frame, [duration - 15, duration], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const zoomProgress = interpolate(frame, [duration - 30, duration], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.poly(4)) });

  // Dynamic Styles
  let transform = 'none';
  let opacity = 1;
  let filter = 'none';
  let transformOrigin = 'center center';
  let flashOpacity = 0;

  if (isEnding) {
    switch (transType) {
      case 'whip': 
        transform = `translateX(${interpolate(fastProgress, [0, 1], [0, -width])}px)`;
        break;
      case 'fade': 
        opacity = interpolate(wipeProgress, [0, 1], [1, 0]);
        break;
      case 'zoom': 
        transform = `scale(${interpolate(wipeProgress, [0, 1], [1, 2.5])})`;
        opacity = interpolate(wipeProgress, [0.5, 1], [1, 0]);
        break;
      case 'blur': 
        filter = `blur(${interpolate(wipeProgress, [0, 1], [0, 30])}px)`;
        break;
      case 'flash': 
        flashOpacity = interpolate(fastProgress, [0, 1], [0, 1]);
        break;
      case 'ice_zoom': 
        transformOrigin = '35% 70%';
        transform = `scale(${interpolate(zoomProgress, [0, 1], [1, 40])})`;
        filter = `blur(${interpolate(zoomProgress, [0.5, 1], [0, 15])}px)`;
        flashOpacity = interpolate(zoomProgress, [0.7, 1], [0, 1]); 
        break;
      case 'bubble_wipe': 
        opacity = interpolate(wipeProgress, [0.8, 1], [1, 0]);
        break;
    }
  }

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      
      {/* 🎥 THE SCENE RENDERER */}
      <AbsoluteFill style={{ transform, opacity, filter, transformOrigin, willChange: 'transform, filter, opacity' }}>
        {renderSceneComponent(scene, color)}
      </AbsoluteFill>

      {/* ⚡ WHITE FLASH OVERLAY */}
      {flashOpacity > 0 && (
        <AbsoluteFill style={{ backgroundColor: 'white', opacity: flashOpacity, pointerEvents: 'none', zIndex: 90 }} />
      )}

      {/* 🫧 THE BUBBLE WIPE OVERLAY */}
      {transType === "bubble_wipe" && isEnding && (
        <AbsoluteFill style={{ zIndex: 100, pointerEvents: 'none' }}>
           {new Array(70).fill(0).map((_, i) => {
             const size = 40 + (i * 47) % 160; 
             const startDelay = (i % 10) / 15;
             const bubbleY = interpolate(wipeProgress, [startDelay, 1], [-20, 120], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
             const xPos = (i * 13.7) % 100; 
             const wobble = Math.sin((frame + i * 10) / 5) * 15; 

             return (
               <div key={i} style={{
                 position: 'absolute', left: `calc(${xPos}% + ${wobble}px)`, bottom: `${bubbleY}%`,
                 width: `${size}px`, height: `${size}px`, borderRadius: '50%', border: '2px solid rgba(255, 255, 255, 0.4)', 
                 background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.9) 5%, rgba(255, 255, 255, 0.4) 30%, transparent 60%)',
                 backdropFilter: 'blur(4px)', boxShadow: 'inset 0 0 25px rgba(255,255,255,0.7)', filter: 'blur(3px)', willChange: 'bottom',
               }} />
             );
           })}
           <AbsoluteFill style={{ backgroundColor: 'white', opacity: interpolate(wipeProgress, [0.8, 1], [0, 1]) }} />
        </AbsoluteFill>
      )}

    </AbsoluteFill>
  );
};

// --- 5. MASTER SEQUENCE (The Main Video Timeline) ---
export const calculateSceneDuration = (scene: any) => {
  return scene.duration || 90; // Default to 3 seconds if not set
};

export const MasterSequence: React.FC<{ scenes: any[], color: string }> = ({ scenes, color }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <Series>
        {scenes.map((scene, index) => {
          const duration = calculateSceneDuration(scene);
          return (
            <Series.Sequence key={index} durationInFrames={duration}>
              <SceneWrapper scene={scene} color={color} duration={duration} />
            </Series.Sequence>
          );
        })}
      </Series>
    </AbsoluteFill>
  );
};