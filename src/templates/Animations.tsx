import React from 'react';
import { staticFile, AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Sequence, Video, Img } from 'remotion';
import { DynamicSceneRenderer } from '../blocks/DynamicSceneRenderer';
import { ChromaKeyVideo } from '../components/ChromaKeyVideo';
import { ViralCaptions } from '../components/ViralCaptions';
import { PexelsVideo } from '../remotion/PexelsVideo';

// --- 🎬 SCENE 5: FESTIVAL CROWD (Aerial Drone Shot) ---
export const FestivalCrowdTemplate: React.FC<any> = ({ headerText = "FEEL THE ENERGY", color = "#F40009", fontFamily = "Montserrat", activeLayers = { crowd: true, text: true }, backgroundMode = 'black' }) => {
  const frame = useCurrentFrame();
  const bgColor = backgroundMode === 'green' ? '#00FF00' : backgroundMode === 'transparent' ? 'transparent' : '#020005';

  const flightProgress = interpolate(frame, [0, 150], [0, 1200]);
  const strobe1 = (Math.sin(frame / 2) + 1) / 2; 
  const strobe2 = (Math.cos(frame / 3) + 1) / 2;

  // 🟢 Changed to 120 for performance
  const crowd = new Array(120).fill(0).map((_, i: number) => {
    const row = Math.floor(i / 15);
    const col = i % 15;
    const x = (col * 80) - 600 + (Math.sin(i * 13) * 30);
    const y = (row * 80) - 800 + (Math.cos(i * 17) * 30);
    const jumpPhase = (x + y) * 0.05;
    return { x, y, jumpPhase, size: 4 + (i % 4) };
  });

  const textScale = interpolate(frame, [0, 150], [0.9, 1.15]);
  const textOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor, overflow: 'hidden', perspective: '800px', fontFamily: fontFamily }}>
      <AbsoluteFill style={{
        transform: `rotateX(60deg) translateY(${flightProgress}px)`,
        transformOrigin: 'center center', justifyContent: 'center', alignItems: 'center'
      }}>
        <div style={{
          position: 'absolute', top: '-1200px', width: '2000px', height: '800px',
          background: `radial-gradient(ellipse at bottom, ${color} 0%, transparent 70%)`,
          opacity: strobe1 * 0.8 + 0.2, filter: 'blur(60px)', zIndex: 1
        }} />
        {crowd.map((person, i) => {
           const jump = Math.sin((frame * 0.2) + person.jumpPhase) * 40;
           const lightCatch = Math.max(0.2, Math.sin((frame * 0.1) + person.jumpPhase));
           return (
             <div key={i} style={{
               position: 'absolute', left: `calc(50% + ${person.x}px)`, top: `calc(50% + ${person.y}px)`,
               width: `${person.size}px`, height: `${person.size}px`, backgroundColor: lightCatch > 0.8 ? '#fff' : color, 
               borderRadius: '50%', transform: `translateZ(${Math.max(0, jump)}px)`, 
               boxShadow: `0 0 ${10 + jump / 2}px ${color}`, opacity: 0.9, willChange: 'transform'
             }} />
           );
        })}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 30% -10%, rgba(255,255,255,${strobe1 * 0.15}) 0%, transparent 60%)`, mixBlendMode: 'screen', pointerEvents: 'none', zIndex: 40 }} />
      <AbsoluteFill style={{ background: `radial-gradient(circle at 70% -10%, rgba(255,255,255,${strobe2 * 0.15}) 0%, transparent 60%)`, mixBlendMode: 'screen', pointerEvents: 'none', zIndex: 40 }} />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', opacity: textOpacity, pointerEvents: 'none', zIndex: 50 }}>
        <h1 style={{ 
           fontSize: '100px', fontWeight: 900, color: 'white', textTransform: 'uppercase', textAlign: 'center', margin: 0, letterSpacing: '8px', lineHeight: 1.1,
           transform: `scale(${textScale})`, textShadow: `0 20px 50px rgba(0,0,0,0.9), 0 0 60px ${color}`
        }}>
          {headerText?.split(' ').join('\n')}
        </h1>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// --- 🎬 SCENE 1: THE HYPER IMPACT TEMPLATE ---
export const HyperImpactTemplate: React.FC<any> = ({ headerText = "IMPACT", backgroundImage, color = "#F40009", fontFamily = "Montserrat", activeLayers = { impact: true, text: true }, backgroundMode = 'black' }) => {
  const bgColor = backgroundMode === 'green' ? '#00FF00' : backgroundMode === 'transparent' ? 'transparent' : '#000000';
  const frame = useCurrentFrame();
  const impact = spring({ frame: frame - 20, fps: 30, config: { stiffness: 200, damping: 12, mass: 0.5 } });
  const popSpring = spring({ frame: frame - 20, fps: 30, config: { stiffness: 70, damping: 15, mass: 1 } });
  const capY = interpolate(popSpring, [0, 1], [0, -600]);
  const capRotation = interpolate(popSpring, [0, 1], [0, 360]); 
  const mistScale = interpolate(impact, [0, 1], [0.2, 5]);
  const mistOpacity = interpolate(impact, [0, 0.15, 1], [0, 1, 0]);
  const shakeX = interpolate(impact, [0, 0.1, 0.2, 0.3, 0.4, 1], [0, 30, -30, 15, -15, 0]);
  const flashOpacity = interpolate(impact, [0, 0.1, 0.6], [0, 0.8, 0]);
  const bottlePath = "M 80,0 L 120,0 L 120,100 C 120,160 180,220 180,300 C 180,380 140,420 140,480 C 140,540 180,580 180,600 L 20,600 C 20,580 60,540 60,480 C 60,420 20,380 20,300 C 20,220 80,160 80,100 Z";

  const bubbles = new Array(20).fill(0).map((_, i) => {
    const x = 40 + (i * 123) % 120; const size = 5 + (i * 7) % 15; const speed = 2 + (i * 3) % 4; const yOffset = (frame * speed * 2) % 600;
    return { x, size, yOffset };
  });

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor, overflow: 'hidden', fontFamily: fontFamily }}>
      <AbsoluteFill style={{ transform: `scale(${1 + impact * 0.15}) translate(${shakeX}px)` }}>
        {/* ✨ FIX: Removed mixBlendMode and bumped opacity to 0.4 so the image is fully visible! */}
        {backgroundImage ? ( <img src={backgroundImage} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }} alt="Bg" /> ) : ( <div style={{ backgroundColor: color, width: '100%', height: '100%', opacity: 0.3 }} /> )}
      </AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: 'white', opacity: flashOpacity, zIndex: 5, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '55%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 10, width: '200px', height: '600px' }}>
        <div style={{ position: 'absolute', top: '-100px', left: '100px', marginLeft: '-250px', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0.4) 40%, transparent 70%)', transform: `scale(${mistScale})`, opacity: mistOpacity, pointerEvents: 'none', zIndex: 20 }} />
        <div style={{ position: 'absolute', width: '100%', height: '100%', clipPath: `path('${bottlePath}')`, WebkitClipPath: `path('${bottlePath}')` }}>
           <div style={{ position: 'absolute', bottom: 0, width: '100%', height: '85%', backgroundColor: color, opacity: 0.8 }} />
           {bubbles.map((b, i) => ( <div key={i} style={{ position: 'absolute', left: `${b.x}px`, bottom: `${b.yOffset - 20}px`, width: `${b.size}px`, height: `${b.size}px`, backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: '50%', boxShadow: '0 0 10px rgba(255,255,255,0.5)' }} /> ))}
        </div>
        <svg width="200" height="600" style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', zIndex: 15, filter: `drop-shadow(0 0 20px ${color}88)` }}>
           <path d={bottlePath} fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.8)" strokeWidth="6" />
           <path d={bottlePath} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="15" style={{ transform: 'translateX(-5px)' }} />
        </svg>
        <div style={{ position: 'absolute', top: '-25px', left: '70px', width: '60px', height: '25px', backgroundColor: '#e5e7eb', borderRadius: '4px 4px 2px 2px', borderBottom: '5px solid #9ca3af', transform: `translateY(${capY}px) rotate(${capRotation}deg)`, opacity: interpolate(impact, [0.9, 1], [1, 0]), zIndex: 25, boxShadow: '0 10px 20px rgba(0,0,0,0.5)' }} />
      </div>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', zIndex: 30, pointerEvents: 'none', padding: '0 40px' }}>
        <h1 style={{ fontSize: '85px', fontWeight: 900, color: 'white', textTransform: 'uppercase', textAlign: 'center', lineHeight: 1.1, margin: 0, letterSpacing: interpolate(impact, [0, 1], [0, 10]), transform: `scale(${interpolate(impact, [0, 1], [0.8, 1.05])})`, opacity: interpolate(impact, [0, 0.2], [0, 1]), textShadow: `0 10px 40px rgba(0,0,0,0.8), 0 0 40px ${color}` }}>
          {headerText?.split(' ').join('\n')}
        </h1>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// --- 🎬 SCENE 2: THE MACRO POUR ---
export const CinematicPourTemplate: React.FC<any> = ({ headerText = "POUR", color = "#F40009", logoUrl, fontFamily = "Montserrat", activeLayers = { pour: true, text: true }, backgroundMode = 'black' }) => {
  const bgColor = backgroundMode === 'green' ? '#00FF00' : backgroundMode === 'transparent' ? 'transparent' : '#000000';
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
  const tableIce = new Array(45).fill(0).map((_, i) => ({ x: -900 + (i * 40), yOffset: Math.sin(i) * 20, size: 25 + (i % 5) * 20, rot: (i * 117) % 360 }));
  const droplets = new Array(35).fill(0).map((_, i) => ({ x: 5 + (i * 37) % 90, y: 10 + (i * 53) % 80, size: 4 + (i % 8), speed: 0.2 + (i % 4) * 0.4 }));
  const textOpacity = interpolate(frame, [90, 110], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor, overflow: 'hidden', fontFamily: fontFamily }}>
      {/* ✨ FIX: Dynamic background glow using your color */}
      <AbsoluteFill style={{ background: `radial-gradient(circle at center, ${color}33 0%, #050000 100%)` }}>
        <div style={{ position: 'absolute', top: '20%', left: '30%', width: '500px', height: '500px', backgroundColor: color, filter: 'blur(150px)', opacity: 0.3 }} />
        <div style={{ position: 'absolute', top: '60%', right: '10%', width: '400px', height: '400px', backgroundColor: color, filter: 'blur(120px)', opacity: 0.15 }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${zoomScale}) translate(${panX}px, ${panY}px)`, justifyContent: 'center', alignItems: 'center' }}>
        {/* ✨ FIX: Dynamic Bottle Color with 3D inset shadows instead of red linear-gradients */}
        <div style={{ position: 'absolute', top: `${bottleY}px`, left: '50%', transformOrigin: 'top center', transform: `translateX(-50%) rotate(${bottleTilt}deg)`, zIndex: 15, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: '28px', height: '14px', backgroundColor: '#silver', borderRadius: '3px', border: '1px solid #999', boxShadow: '0 5px 10px rgba(0,0,0,0.5)' }} />
          <div style={{ width: '36px', height: '90px', backgroundColor: color, borderRadius: '8px 8px 0 0', borderLeft: '2px solid rgba(255,255,255,0.4)', boxShadow: 'inset 12px 0 20px rgba(0,0,0,0.8), inset -5px 0 10px rgba(0,0,0,0.5)' }} />
          <div style={{ width: '90px', height: '200px', backgroundColor: color, borderRadius: '40px 40px 10px 10px', borderLeft: '3px solid rgba(255,255,255,0.3)', borderRight: '1px solid rgba(255,255,255,0.1)', boxShadow: 'inset 25px -20px 50px rgba(0,0,0,0.9), inset -10px 0 20px rgba(0,0,0,0.6)', position: 'relative', overflow: 'hidden' }}>
             <div style={{ position: 'absolute', top: '50px', width: '100%', height: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {/* 🏷️ LOGO SUPPORT */}
                <img src={logoUrl || "https://upload.wikimedia.org/wikipedia/commons/c/ce/Coca-Cola_logo.svg"} alt="Logo" style={{ width: '70px', objectFit: 'contain', filter: 'brightness(0) invert(1) drop-shadow(0 2px 5px rgba(0,0,0,0.8))' }} />
             </div>
          </div>
        </div>

        {/* ✨ FIX: Dynamic Stream Color */}
        <div style={{ position: 'absolute', top: '-180px', left: `calc(50% + ${streamWobble}px)`, marginLeft: '-8px', width: '16px', height: '380px', backgroundColor: color, opacity: streamOpacity, filter: 'blur(2px)', zIndex: 12, borderRadius: '10px', boxShadow: `0 0 15px ${color}` }} />

        <div style={{ position: 'absolute', top: '55%', width: '100%', height: '100px', zIndex: 5, filter: 'blur(3px)' }}>
          {tableIce.map((ice: any, i: number) => ( <div key={i} style={{ position: 'absolute', left: `calc(50% + ${ice.x}px)`, top: `${ice.yOffset}px`, width: `${ice.size}px`, height: `${ice.size}px`, background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.05) 100%)', border: '1px solid rgba(255,255,255,0.6)', borderRadius: '8px', transform: `rotate(${ice.rot}deg)`, backdropFilter: 'blur(6px)', boxShadow: 'inset 0 0 15px rgba(255,255,255,0.8), 0 15px 25px rgba(0,0,0,0.6)' }} /> ))}
        </div>

        <div style={{ width: '230px', height: '380px', position: 'relative', overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(4px)', borderRadius: '10px 10px 30px 30px', border: '3px solid rgba(255,255,255,0.4)', borderTop: 'none', boxShadow: 'inset 0 0 50px rgba(0,0,0,0.8), 0 20px 40px rgba(0,0,0,0.5)', marginTop: '100px', zIndex: 10 }}>
          {/* ✨ FIX: Dynamic Glass Fill Color */}
          <div style={{ position: 'absolute', bottom: 0, width: '100%', height: `${fillLevel}%`, backgroundColor: color, boxShadow: 'inset 0 20px 40px rgba(0,0,0,0.8)', zIndex: 10 }} />
          <div style={{ position: 'absolute', top: '45%', left: '0', width: '100%', display: 'flex', justifyContent: 'center', zIndex: 15, transform: 'rotate(-5deg)' }}>
             <img src={logoUrl || "https://upload.wikimedia.org/wikipedia/commons/c/ce/Coca-Cola_logo.svg"} alt="Logo" style={{ width: '160px', filter: 'brightness(0) invert(1) drop-shadow(0px 2px 4px rgba(0,0,0,0.8))', opacity: 0.9, objectFit: 'contain' }} />
          </div>
          {/* Inner Ice and Bubbles... */}
          <div style={{ position: 'absolute', bottom: `calc(10% - ${iceFloat}px)`, left: '15%', width: '75px', height: '75px', background: 'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.1) 100%)', border: '2px solid rgba(255,255,255,0.9)', borderRadius: '12px', transform: 'rotate(15deg)', backdropFilter: 'blur(4px)', boxShadow: 'inset 0 0 20px rgba(255,255,255,0.8)', zIndex: 5 }} />
          {droplets.map((d: any, i: number) => {
             const slide = interpolate(frame, [80, 150], [0, d.speed * 40], { extrapolateRight: 'clamp' });
             return <div key={i} style={{ position: 'absolute', top: `${d.y}%`, left: `${d.x}%`, width: `${d.size}px`, height: `${d.size * 1.3}px`, transform: `translateY(${slide}px)`, zIndex: 20, borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9) 0%, transparent 50%)', boxShadow: 'inset 0 -2px 5px rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.2)' }} />
          })}
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'flex-end', paddingRight: '50px', opacity: textOpacity, pointerEvents: 'none', zIndex: 50 }}>
        <h1 style={{ fontSize: '85px', fontWeight: 900, color: 'white', textTransform: 'uppercase', textAlign: 'right', lineHeight: 1.1, textShadow: `0 10px 40px rgba(0,0,0,0.9), 0 0 40px ${color}` }}>{headerText?.split(' ').join('\n')}</h1>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// --- 🎬 SCENE 3: VERTICAL SPLIT ---
export const VerticalSplitTemplate: React.FC<any> = ({ headerText, leftText = "DULL OFFICE", rightText = "VIBRANT BEACH", backgroundImage, backgroundImage2, color = "#F40009", fontFamily = "Montserrat", activeLayers = { left: true, right: true, text: true }, backgroundMode = 'black' }) => {
  const frame = useCurrentFrame();
  const topImage = backgroundImage || "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&q=80";
  const bottomImage = backgroundImage2 || "https://images.unsplash.com/photo-1520116468816-95b69f847357?w=800&q=80";
  const introSpring = spring({ frame, fps: 30, config: { damping: 14 } });
  const dividerWidth = interpolate(introSpring, [0, 1], [0, 100]);
  const panTop = interpolate(frame, [0, 150], [0, -50]);
  const panBottom = interpolate(frame, [0, 150], [0, 50]);

  return (
    <AbsoluteFill style={{ backgroundColor: color, fontFamily: fontFamily }}>
      <AbsoluteFill style={{ height: '50%', top: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: '120%', height: '100%', transform: `translateX(${panTop}px)` }}> <img src={topImage} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(100%) contrast(120%) brightness(80%)' }} /> </div>
        <div style={{ position: 'absolute', top: '40px', left: '40px', background: 'rgba(0,0,0,0.7)', padding: '10px 30px', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.2)', color: 'white', fontSize: '25px', fontWeight: 'bold', backdropFilter: 'blur(10px)' }}>{leftText}</div>
      </AbsoluteFill>
      <AbsoluteFill style={{ height: '50%', top: '50%', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: '120%', height: '100%', transform: `translateX(${panBottom}px)`, left: '-10%' }}> <img src={bottomImage} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(180%) contrast(110%) brightness(110%)' }} /> </div>
        <div style={{ position: 'absolute', bottom: '40px', right: '40px', background: 'rgba(255,255,255,0.95)', padding: '10px 30px', borderRadius: '50px', color: 'black', fontSize: '25px', fontWeight: 'bold', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>{rightText}</div>
      </AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', pointerEvents: 'none', zIndex: 10 }}>
         <div style={{ width: `${dividerWidth}%`, height: '8px', backgroundColor: '#ffffff', boxShadow: `0 0 20px rgba(255,255,255,0.8)` }} />
         <div style={{ position: 'absolute', background: color, padding: '15px 50px', borderRadius: '15px', transform: `scale(${introSpring})`, border: `4px solid #ffffff`, boxShadow: '0 15px 40px rgba(0,0,0,0.6)' }}>
           <h1 style={{ fontSize: '55px', fontWeight: 900, color: 'white', textTransform: 'uppercase', margin: 0, letterSpacing: '3px', textAlign: 'center', lineHeight: '1.1' }}>{headerText?.split(' ').join('\n')}</h1>
         </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// --- 🎬 SCENE 4: ICE BUCKET ---
export const IceBucketTemplate: React.FC<any> = ({ headerText = "COLD", color = "#F40009", logoUrl, fontFamily = "Montserrat", activeLayers = { bucket: true, text: true }, backgroundMode = 'black' }) => {
  const bgColor = backgroundMode === 'green' ? '#00FF00' : backgroundMode === 'transparent' ? 'transparent' : '#0a0a0a';
  const frame = useCurrentFrame();
  const zoomScale = interpolate(frame, [0, 150], [0.85, 1.15], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const cameraRotate = interpolate(frame, [0, 150], [-5, 5], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const sunRayPosition = interpolate(frame, [0, 120], [-50, 150], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const sunOpacity = interpolate(frame, [0, 30, 90, 150], [0, 0.8, 0.8, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const crushedIce = new Array(150).fill(0).map((_, i) => { const radius = (i % 50) * 6; const angle = i * 13.7; return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius, size: 20 + (i % 4) * 15, rot: (i * 73) % 360 }; });
  const bottles = [0, 120, 240];
  const textOpacity = interpolate(frame, [60, 90], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor, overflow: 'hidden', fontFamily: fontFamily }}>
      <AbsoluteFill style={{ background: 'radial-gradient(circle at center, #333 0%, #000 100%)' }} />
      <AbsoluteFill style={{ transform: `scale(${zoomScale}) rotate(${cameraRotate}deg)`, justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: '700px', height: '700px', borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, #444 0%, #111 80%)', border: '25px solid #888', boxShadow: 'inset 20px 20px 60px rgba(0,0,0,0.9), 40px 40px 80px rgba(0,0,0,0.9)', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-25px', left: '-25px', right: '-25px', bottom: '-25px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.4)', pointerEvents: 'none', zIndex: 50 }} />
          <div style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 5 }}>
            {crushedIce.map((ice: any, i: number) => ( 
              <div key={i} style={{ 
                position: 'absolute', left: `calc(50% + ${ice.x}px - ${ice.size / 2}px)`, top: `calc(50% + ${ice.y}px - ${ice.size / 2}px)`, 
                width: `${ice.size}px`, height: `${ice.size}px`, 
                background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.05) 100%)', 
                border: '1px solid rgba(255,255,255,0.6)', borderRadius: '6px', 
                transform: `rotate(${ice.rot}deg)`, 
                // ⚡ SPEED FIX: Removed backdropFilter entirely!
                boxShadow: '4px 4px 10px rgba(0,0,0,0.5), inset 0 0 10px rgba(255,255,255,0.8)' 
              }} /> 
            ))}
          </div>
          {bottles.map((rotation, index) => (
            <div key={index} style={{ position: 'absolute', width: '100%', height: '100%', transform: `rotate(${rotation}deg)`, zIndex: 10, pointerEvents: 'none' }}>
              <div style={{ position: 'absolute', top: '80px', left: '50%', transform: 'translateX(-50%)', width: '100px', height: '320px', display: 'flex', flexDirection: 'column', alignItems: 'center', filter: 'drop-shadow(30px 30px 15px rgba(0,0,0,0.8))' }}>
                <div style={{ width: '30px', height: '20px', background: 'linear-gradient(90deg, #999 0%, #eee 50%, #999 100%)', borderRadius: '3px', borderTop: '2px solid white' }} />
                {/* ✨ FIX: Dynamic Flat-Lay Bottles */}
                <div style={{ width: '40px', height: '90px', backgroundColor: color, borderRadius: '5px 5px 0 0', borderLeft: '2px solid rgba(255,255,255,0.5)', boxShadow: 'inset 10px 0 15px rgba(0,0,0,0.8)' }} />
                <div style={{ width: '100px', height: '210px', backgroundColor: color, borderRadius: '30px 30px 15px 15px', position: 'relative', overflow: 'hidden', borderLeft: '3px solid rgba(255,255,255,0.4)', borderRight: '1px solid rgba(255,255,255,0.1)', boxShadow: 'inset 20px 0 40px rgba(0,0,0,0.9)' }}>
                   <div style={{ position: 'absolute', top: '60px', width: '100%', height: '55px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <img src={logoUrl || "https://upload.wikimedia.org/wikipedia/commons/c/ce/Coca-Cola_logo.svg"} alt="Logo" style={{ width: '60px', filter: 'brightness(0) invert(1) drop-shadow(0 2px 4px rgba(0,0,0,0.8))', transform: 'rotate(-90deg)', objectFit: 'contain' }} />
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
          <h1 style={{ fontSize: '60px', fontWeight: 900, color: 'white', textTransform: 'uppercase', textAlign: 'center', margin: 0, letterSpacing: '5px' }}>{headerText?.split(' ').join('\n')}</h1>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};


// --- 🎬 RESTORED: FULL UI TEMPLATES (Fixed for empty states) ---
export const CokeCinematicTemplate: React.FC<any> = ({ headerText, color = "#F40009", backgroundImage, activeLayers = { cinematic: true, text: true }, backgroundMode = 'black' }) => {
  const bgColor = backgroundMode === 'green' ? '#00FF00' : backgroundMode === 'transparent' ? 'transparent' : '#000000';
  const frame = useCurrentFrame();
  const floatY = Math.sin(frame / 15) * 20;
  const rotateY = Math.sin(frame / 25) * 25;
  const heroImage = backgroundImage || "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&q=80"; // Coke glass fallback
  return (
    <AbsoluteFill style={{ backgroundColor: bgColor }}>
      <AbsoluteFill style={{ backgroundColor: color, background: `radial-gradient(circle at center, ${color} 0%, #000 120%)` }} />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
         <h1 style={{ fontSize: "140px", fontWeight: 900, color: 'rgba(255,255,255,0.08)', textTransform: 'uppercase', textAlign: 'center', lineHeight: '0.9', transform: `scale(${1 + Math.sin(frame/40) * 0.05})` }}>
            {headerText?.split(' ').join('\n')}
         </h1>
      </AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ transform: `perspective(1200px) rotateY(${rotateY}deg) translateY(${floatY}px) rotateZ(-5deg)`, filter: `drop-shadow(0px 80px 60px rgba(0,0,0,0.6))`, borderRadius: '20px', overflow: 'hidden', border: '10px solid white' }}>
          <img src={heroImage} style={{ width: "600px", height: "800px", objectFit: "cover" }} alt="Hero" />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const ListicleTemplate: React.FC<any> = ({ 
  headerText, 
  chartData, 
  color = "#F40009", 
  fontFamily = "Montserrat", 
  activeLayers = {}, 
  backgroundMode = 'black',
  backgroundImage,
  searchQuery
}) => {
  const bgColor = backgroundMode === 'green' ? '#00FF00' : backgroundMode === 'transparent' ? 'transparent' : '#000000';
  const frame = useCurrentFrame();
  const titleProgress = spring({ frame: Math.max(0, frame - 10), fps: 30, config: { damping: 12 } });
  
  // ⚡ THE FIX: Default to true if undefined!
  // This prevents items from disappearing if the editor sidebar doesn't explicitly send "items: true".
  const showText = activeLayers.text !== false;
  const showItems = activeLayers.items !== false && activeLayers.labels !== false;

  return (
    <AbsoluteFill style={{ padding: '80px', justifyContent: 'center', alignItems: 'center', backgroundColor: bgColor, fontFamily: fontFamily }}>
      
      {/* ⚡ THE BACKGROUND IMAGE & PEXELS WRAPPER */}
      {(backgroundImage || searchQuery) && (
        <AbsoluteFill style={{ opacity: 0.4 }}>
           {searchQuery ? (
             <PexelsVideo searchQuery={searchQuery} />
           ) : backgroundImage?.endsWith('.mp4') ? (
             <Video src={backgroundImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
           ) : (
             <Img src={backgroundImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
           )}
        </AbsoluteFill>
      )}

      {/* ⚡ THE MAIN CONTENT BOX */}
      <div style={{ width: '90%', padding: '60px', borderRadius: '40px', backgroundColor: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(20px) saturate(180%)', border: '1px solid rgba(255, 255, 255, 0.15)', opacity: titleProgress, zIndex: 10 }}>
        {showText && (
          <h1 style={{ color: 'white', fontSize: '65px', fontWeight: '900', transform: `translateY(${(1 - titleProgress) * -20}px)` }}>{headerText}</h1>
        )}
        
        {showItems && (chartData || []).map((item: any, i: number) => {
          const itemProgress = spring({ frame: Math.max(0, frame - 30 - (i * 15)), fps: 30, config: { damping: 12 } });
          return (
            <div key={i} style={{ color: 'white', fontSize: '42px', display: 'flex', alignItems: 'center', gap: '25px', padding: '20px', opacity: itemProgress, transform: `translateX(${(1 - itemProgress) * -50}px)` }}>
              <span style={{ backgroundColor: color, minWidth: '60px', height: '60px', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '12px', fontWeight: 'bold' }}>{i + 1}</span> 
              {item.label}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const StampChecklistTemplate: React.FC<any> = ({ headerText, chartData, color = "#F40009", fontFamily = "Montserrat", activeLayers = { items: true, stamps: true, text: true }, backgroundMode = 'black' }) => (
  <AbsoluteFill style={{ padding: '80px', justifyContent: 'center', backgroundColor: '#111', fontFamily: fontFamily }}>
    <h1 style={{ color: 'white', fontSize: '70px', marginBottom: '60px' }}>{headerText}</h1>
    {(chartData || []).map((item: any, i: number) => (
      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '30px', marginBottom: '30px' }}>
        <div style={{ minWidth: '50px', height: '50px', backgroundColor: color, display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '10px', fontSize: '30px' }}>✅</div>
        <div style={{ color: 'white', fontSize: '45px' }}>{item.label}</div>
      </div>
    ))}
  </AbsoluteFill>
);

export const CarouselTemplate: React.FC<any> = ({ headerText, chartData, color = "#F40009", fontFamily = "Montserrat", activeLayers = { carousel: true, text: true }, backgroundMode = 'black' }) => {
  const frame = useCurrentFrame();
  const shift = (frame % 150) / 150 * 100;
  return (
    <AbsoluteFill style={{ justifyContent: 'center', overflow: 'hidden', backgroundColor: '#111', fontFamily: fontFamily }}>
      <h1 style={{ color: 'white', textAlign: 'center', marginBottom: '100px', fontSize: '60px' }}>{headerText}</h1>
      <div style={{ display: 'flex', gap: '40px', transform: `translateX(-${shift}%)` }}>
        {(chartData || []).map((item: any, i: number) => (
          <div key={i} style={{ minWidth: '400px', padding: '40px', background: 'rgba(255,255,255,0.1)', borderRadius: '20px', border: `2px solid ${color}` }}>
            <h2 style={{ color: 'white', fontSize: '40px' }}>{item.label}</h2>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// --- ✨ ROTATING PRODUCT SHOWCASE ---
export const ProductShowcaseTemplate: React.FC<any> = ({ headerText = "NEW ARRIVAL", backgroundImage, color = "#F40009", fontFamily = "Montserrat", activeLayers = { product: true, text: true }, backgroundMode = 'black' }) => {
  const frame = useCurrentFrame();
  const pop = spring({ frame, fps: 30, config: { damping: 12 } });
  
  // 🔄 The Rotation Magic (Now spins side-to-side on the Y-axis)
  const rotation = frame * 1.5; 
  const floatY = Math.sin(frame / 15) * 20; 
  // Using a 100% bot-safe Wikimedia image as the fallback instead!
  const imageSrc = backgroundImage || "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/512px-React-icon.svg.png"; 

  return (
    <AbsoluteFill style={{ backgroundColor: '#05000A', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', fontFamily: fontFamily }}>
      
      {/* 🔦 Spotlight Glow */}
      {/* 🔦 Spotlight Glow (⚡ SPEED FIX: Uses a natural gradient instead of a CSS blur) */}
      <div style={{
        position: 'absolute', width: '1000px', height: '1000px',
        background: `radial-gradient(circle, ${color}77 0%, ${color}00 60%)`, 
        transform: `scale(${pop})`
      }} />

      {/* 🔄 Rotating Image Container (Added perspective and rotateY) */}
      <div style={{
        transform: `perspective(1000px) scale(${pop}) translateY(${floatY}px) rotateY(${rotation}deg)`,
        zIndex: 10, display: 'flex', justifyContent: 'center', alignItems: 'center'
      }}>
        <img 
           src={imageSrc} 
           style={{ height: '450px', width: 'auto', objectFit: 'contain', filter: `drop-shadow(0 30px 50px rgba(0,0,0,0.8))` }} 
           alt="Product"
        />
      </div>

      {/* ✍️ Header Text */}
      <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: '100px', zIndex: 20 }}>
        <h1 style={{
          fontSize: '85px', fontWeight: 900, color: 'white', textTransform: 'uppercase',
          textAlign: 'center', margin: 0, letterSpacing: '8px', lineHeight: 1.1,
          transform: `translateY(${(1 - pop) * 50}px)`, opacity: pop,
          textShadow: `0 10px 30px rgba(0,0,0,0.9), 0 0 40px ${color}`
        }}>
          {headerText?.split(' ').join('\n')}
        </h1>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const TripleBuildTemplate: React.FC<any> = ({ 
  headerText, 
  chartData, 
  color = "#F40009", 
  fontFamily = "Montserrat", 
  activeLayers = {}, 
  backgroundMode = 'black',
  backgroundImage,
  searchQuery
}) => {
  const bgColor = backgroundMode === 'green' ? '#00FF00' : backgroundMode === 'transparent' ? 'transparent' : '#050505';
  const frame = useCurrentFrame();

  // Title Animation
  const titleDrop = spring({ frame: Math.max(0, frame - 10), fps: 30, config: { damping: 14 } });

  const safeData = chartData && chartData.length >= 3 ? chartData.slice(0, 3) : [
    { label: "PILLAR 1" }, { label: "PILLAR 2" }, { label: "PILLAR 3" }
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor, fontFamily }}>

      {/* ⚡ THE BACKGROUND IMAGE & PEXELS WRAPPER */}
      {(backgroundImage || searchQuery) && (
        <AbsoluteFill style={{ opacity: 0.3 }}>
           {searchQuery ? (
             <PexelsVideo searchQuery={searchQuery} />
           ) : backgroundImage?.endsWith('.mp4') ? (
             <Video src={backgroundImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
           ) : (
             <Img src={backgroundImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
           )}
        </AbsoluteFill>
      )}

      {/* HEADER TEXT */}
      {activeLayers.text !== false && (
        <div style={{ position: "absolute", top: "180px", left: "0", width: "100%", padding: "0 60px", display: "flex", justifyContent: "center", zIndex: 20 }}>
          <h1 style={{
            fontSize: "75px", color: "white", fontWeight: 900, textTransform: "uppercase", textAlign: "center",
            transform: `translateY(${(1 - titleDrop) * -50}px)`, opacity: titleDrop, margin: 0, lineHeight: 1.1,
            textShadow: '0 10px 30px rgba(0,0,0,0.9)'
          }}>
            {headerText}
          </h1>
        </div>
      )}

      {/* THE PILLARS */}
      {activeLayers.elements !== false && (
        <AbsoluteFill style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: '50px', paddingBottom: '200px', paddingLeft: '40px', paddingRight: '40px', zIndex: 10 }}>
          {safeData.map((d: any, i: number) => {
            const pop = spring({ frame: Math.max(0, frame - 20 - (i * 15)), fps: 30, config: { damping: 14 } });
            
            // The middle pillar is a bit taller like a podium!
            const targetHeight = i === 1 ? 850 : 700;

            return (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '280px' }}>
                
                {/* The Label */}
                <div style={{
                  color: 'white', fontSize: '32px', fontWeight: 800, textAlign: 'center', textTransform: 'uppercase',
                  marginBottom: '30px', opacity: pop, transform: `translateY(${(1 - pop) * 20}px)`,
                  textShadow: '0 5px 20px rgba(0,0,0,0.9)'
                }}>
                  {d.label}
                </div>

                {/* The 3D Pillar */}
                <div style={{
                  width: '100%', height: `${targetHeight * pop}px`, position: 'relative',
                  display: 'flex', justifyContent: 'center', overflow: 'hidden',
                  borderRadius: '15px 15px 0 0'
                }}>
                  {/* Front Base Color */}
                  <div style={{ position: 'absolute', bottom: 0, width: '100%', height: '100%', backgroundColor: color, borderTop: '4px solid rgba(255,255,255,0.6)', boxShadow: `0 0 60px ${color}66` }} />
                  
                  {/* 3D Cylinder Shading Overlay */}
                  <div style={{ position: 'absolute', bottom: 0, width: '100%', height: '100%', background: 'linear-gradient(90deg, rgba(0,0,0,0.5) 0%, rgba(255,255,255,0.25) 50%, rgba(0,0,0,0.7) 100%)' }} />
                  
                  {/* Giant Number Imprint */}
                  <div style={{ position: 'absolute', bottom: '80px', fontSize: '150px', fontWeight: 900, color: 'rgba(0,0,0,0.25)', transform: 'scaleY(1.5)' }}>
                    {i + 1}
                  </div>
                </div>
              </div>
            );
          })}
        </AbsoluteFill>
      )}

    </AbsoluteFill>
  );
};

export const ChaseAttentionTemplate: React.FC<any> = ({ headerText, chartData, color = "#F40009", fontFamily = "Montserrat", activeLayers = { chase: true, text: true }, backgroundMode = 'black' }) => (
  <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", backgroundColor: '#111', fontFamily: fontFamily }}>
    <h1 style={{ fontSize: "60px", color: "white", marginBottom: "60px", textAlign: 'center' }}>{headerText}</h1>
    <div style={{ fontSize: "60px", color: "rgba(255,255,255,0.4)", textDecoration: "line-through", textAlign: 'center' }}>{chartData?.[0]?.label || "Old Way"}</div>
    <div style={{ fontSize: "90px", color: color, fontWeight: "bold", marginTop: "20px", textAlign: 'center' }}>{chartData?.[1]?.label || "New Way"}</div>
  </AbsoluteFill>
);

export const CrowdScaleTemplate: React.FC<any> = ({ headerText, chartData, color = "#F40009", fontFamily = "Montserrat", activeLayers = { crowd: true, text: true }, backgroundMode = 'black' }) => (
  <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", backgroundColor: '#111', fontFamily: fontFamily }}>
    <h1 style={{ fontSize: "65px", color: "white", textAlign: 'center', padding: '0 40px' }}>{headerText}</h1>
    <div style={{ display: "flex", flexDirection: 'column', gap: "80px", marginTop: "80px" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "110px", color: "white", fontWeight: "bold" }}>{chartData?.[0]?.value || "1"}</div>
        <div style={{ fontSize: "45px", color: color }}>{chartData?.[0]?.label || "Person"}</div>
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "110px", color: "white", fontWeight: "bold" }}>{chartData?.[1]?.value || "1M+"}</div>
        <div style={{ fontSize: "45px", color: color }}>{chartData?.[1]?.label || "People"}</div>
      </div>
    </div>
  </AbsoluteFill>
);

export const ChartCrashTemplate: React.FC<any> = ({ headerText, chartData, fontFamily = "Montserrat", activeLayers = { chart: true, text: true }, backgroundMode = 'black' }) => (
  <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", backgroundColor: '#111', fontFamily: fontFamily }}>
    <h1 style={{ fontSize: "70px", color: "#ff4444", fontWeight: "bold", textAlign: 'center' }}>{headerText}</h1>
    <div style={{ fontSize: "60px", color: "white", marginTop: "40px" }}>{chartData?.[0]?.label || "Error"}: {chartData?.[0]?.value || "0"}</div>
  </AbsoluteFill>
);

export const VersusTemplate: React.FC<any> = ({ headerText, chartData, color = "#F40009", fontFamily = "Montserrat", activeLayers = { left: true, right: true, text: true }, backgroundMode = 'black' }) => (
  <AbsoluteFill style={{ flexDirection: "column", fontFamily: fontFamily }}>
    <div style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.8)", display: "flex", justifyContent: "center", alignItems: "center", padding: "40px" }}>
      <h2 style={{ fontSize: "60px", color: "white", textAlign: "center" }}>{chartData?.[0]?.label || "Option A"}</h2>
    </div>
    <div style={{ height: "10px", backgroundColor: color, zIndex: 10 }} />
    <div style={{ flex: 1, backgroundColor: color, display: "flex", justifyContent: "center", alignItems: "center", padding: "40px" }}>
      <h2 style={{ fontSize: "60px", color: "white", fontWeight: "bold", textAlign: "center" }}>{chartData?.[1]?.label || "Option B"}</h2>
    </div>
    <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "100%", textAlign: "center", zIndex: 20 }}>
      <h1 style={{ fontSize: "80px", color: "white", textShadow: "0 4px 20px rgba(0,0,0,0.8)" }}>{headerText || "VS"}</h1>
    </div>
  </AbsoluteFill>
);
// --- B-ROLL TEMPLATE ---
export const BRollTemplate: React.FC<any> = ({ bRollUrl, backgroundMode = 'black' }) => {
  const bgColor = backgroundMode === 'green' ? '#00FF00' : backgroundMode === 'transparent' ? 'transparent' : '#000000';

  if (!bRollUrl) {
    return (
      <AbsoluteFill style={{ backgroundColor: bgColor, justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ color: 'white', fontSize: 48, fontWeight: 'bold' }}>Missing B-Roll URL</div>
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor }}>
      <Video src={bRollUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </AbsoluteFill>
  );
};

export const BarChartTemplate: React.FC<any> = ({ 
  headerText, 
  chartData, 
  color = "#F40009", 
  fontFamily = "Montserrat", 
  activeLayers = { bars: true, labels: true, text: true }, 
  backgroundMode = 'black',
  backgroundImage,
  searchQuery,
  prefix = "",
  suffix = ""
}) => {
  const bgColor = backgroundMode === 'green' ? '#00FF00' : backgroundMode === 'transparent' ? 'transparent' : '#111';
  const frame = useCurrentFrame();

  const titleDrop = spring({ frame: Math.max(0, frame - 10), fps: 30, config: { damping: 14 } });
  const titleY = interpolate(titleDrop, [0, 1], [-50, 0]);
  
  const safeChartData = chartData && chartData.length > 0 ? chartData : [
    { label: "A", value: 50 }, { label: "B", value: 100 }
  ];
  const maxVal = Math.max(...safeChartData.map((d: any) => d.value || 1), 1);

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor, fontFamily }}>
      
      {/* ⚡ THE BACKGROUND IMAGE & PEXELS FIX */}
      {(backgroundImage || searchQuery) && (
        <AbsoluteFill style={{ opacity: 0.3 }}>
           {searchQuery ? (
             <PexelsVideo searchQuery={searchQuery} />
           ) : backgroundImage?.endsWith('.mp4') ? (
             <Video src={backgroundImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
           ) : (
             <Img src={backgroundImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
           )}
        </AbsoluteFill>
      )}

      {/* Wrapper to handle padding and push items to the bottom */}
      <AbsoluteFill style={{ padding: "80px", justifyContent: "flex-end" }}>
        
        {/* ⚡ THE TEXT WRAPPING FIX */}
        {activeLayers.text && (
          <div style={{ position: "absolute", top: "100px", left: "0", width: "100%", padding: "0 60px", display: "flex", justifyContent: "center" }}>
            <h1 style={{ 
              fontSize: "60px", color: "white", fontWeight: 900, textTransform: "uppercase", textAlign: "center",
              transform: `translateY(${titleY}px)`, opacity: titleDrop, margin: 0, lineHeight: 1.1
            }}>
              {headerText}
            </h1>
          </div>
        )}

        {/* THE ANIMATED BARS */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: "40px", height: "600px", width: "100%", padding: "0 40px", zIndex: 10 }}>
          {safeChartData.map((d: any, i: number) => {
            const barPop = spring({ frame: Math.max(0, frame - 20 - (i * 10)), fps: 30, config: { damping: 12, stiffness: 100 } });
            const finalHeight = Math.max(((d.value || 10) / maxVal) * 500, 50); 
            const animatedHeight = finalHeight * barPop;

            return (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                
                {/* Number Value + Prefix/Suffix */}
                {activeLayers.labels && (
                  <div style={{ color: "white", fontSize: "35px", marginBottom: "20px", fontWeight: "bold", opacity: barPop, transform: `translateY(${(1-barPop)*20}px)` }}>
                    {prefix}{d.value}{suffix}
                  </div>
                )}
                
                {/* The Bar Itself */}
                {activeLayers.bars && (
                  <div style={{ 
                    width: "100%", height: `${animatedHeight}px`, backgroundColor: color, 
                    borderRadius: "20px 20px 0 0", boxShadow: `0 0 20px ${color}88` 
                  }} />
                )}
                
                {/* Bottom Label (Text Wrapping Fix for Labels too!) */}
                {activeLayers.labels && (
                  <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "22px", marginTop: "20px", fontWeight: "bold", opacity: barPop, textAlign: "center", lineHeight: 1.2 }}>
                    {d.label}
                  </div>
                )}

              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const LineChartTemplate: React.FC<any> = ({ 
  headerText, 
  chartData, 
  color = "#00FFCC", 
  fontFamily = "Montserrat", 
  activeLayers = {}, 
  backgroundMode = 'black',
  backgroundImage,
  searchQuery,
  prefix = "",
  suffix = ""
}) => {
  const bgColor = backgroundMode === 'green' ? '#00FF00' : backgroundMode === 'transparent' ? 'transparent' : '#050505';
  const frame = useCurrentFrame();

  const safeChartData = chartData && chartData.length > 0 ? chartData : [{ label: "A", value: 10 }, { label: "B", value: 50 }];
  const maxVal = Math.max(...safeChartData.map((d: any) => Number(d.value) || 1), 1);

  // Layer toggles (Default to true so they don't vanish)
  const showText = activeLayers.text !== false;
  const showGrid = activeLayers.grid !== false;
  const showLine = activeLayers.line !== false;
  const showLabels = activeLayers.labels !== false;

  // Title Animation
  const titleDrop = spring({ frame: Math.max(0, frame - 10), fps: 30, config: { damping: 14 } });
  const titleY = interpolate(titleDrop, [0, 1], [-50, 0]);

  // Chart Dimensions & Scaling
  const chartWidth = 860;
  const chartHeight = 700;
  const startX = 110;    // Padding from left
  const startY = 1350;   // Padding from top (pushes chart down)

  // Map data to X/Y pixel coordinates
  const points = safeChartData.map((d: any, i: number) => {
    const x = startX + (i / Math.max(1, safeChartData.length - 1)) * chartWidth;
    const y = startY - ((Number(d.value) || 0) / maxVal) * chartHeight;
    return { x, y, label: d.label, value: d.value };
  });

  // Construct SVG Paths
  const linePath = points.map((p: any, i: number) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(" ");
  // To shade the area, we draw the line, then drop straight down to the axis, go back to the start, and close it.
  const fillPath = `${linePath} L ${points[points.length - 1].x} ${startY} L ${points[0].x} ${startY} Z`;

  // Draw Animation (0 to 1 over 60 frames = 2 seconds)
  const drawProgress = Math.min(1, Math.max(0, (frame - 20) / 60));
  
  // A rough large number to act as the max stroke length for CSS drawing
  const pathLength = 4000; 
  const strokeDashoffset = pathLength - (drawProgress * pathLength);

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor, fontFamily }}>
      
      {/* ⚡ THE BACKGROUND IMAGE & PEXELS WRAPPER */}
      {(backgroundImage || searchQuery) && (
        <AbsoluteFill style={{ opacity: 0.25 }}>
           {searchQuery ? (
             <PexelsVideo searchQuery={searchQuery} />
           ) : backgroundImage?.endsWith('.mp4') ? (
             <Video src={backgroundImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
           ) : (
             <Img src={backgroundImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
           )}
        </AbsoluteFill>
      )}

      {/* HEADER TEXT */}
      {showText && (
        <div style={{ position: "absolute", top: "150px", left: "0", width: "100%", padding: "0 60px", display: "flex", justifyContent: "center" }}>
          <h1 style={{ 
            fontSize: "65px", color: "white", fontWeight: 900, textTransform: "uppercase", textAlign: "center",
            transform: `translateY(${titleY}px)`, opacity: titleDrop, margin: 0, lineHeight: 1.1
          }}>
            {headerText}
          </h1>
        </div>
      )}

      {/* THE CHART CANVAS */}
      <svg style={{ position: 'absolute', top: 0, left: 0, width: '1080px', height: '1920px', overflow: 'visible' }}>
        
        {/* Dynamic Gradient Def & Clip Path */}
        <defs>
          <linearGradient id="lineFillGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.6" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
          <clipPath id="fillClip">
            <rect x="0" y="0" width={startX + (chartWidth * drawProgress)} height="1920" />
          </clipPath>
        </defs>

        {/* Horizontal Grid Lines */}
        {showGrid && [0, 0.25, 0.5, 0.75, 1].map(ratio => (
          <line
            key={ratio}
            x1={startX} y1={startY - chartHeight * ratio}
            x2={startX + chartWidth} y2={startY - chartHeight * ratio}
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="3"
            strokeDasharray="15 15"
          />
        ))}

        {/* The Shaded Fill Area */}
        {showLine && (
          <path
            d={fillPath}
            fill="url(#lineFillGradient)"
            clipPath="url(#fillClip)"
          />
        )}

        {/* The Glowing Animated Line */}
        {showLine && (
          <path
            d={linePath}
            fill="none"
            stroke={color}
            strokeWidth="14"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={pathLength}
            strokeDashoffset={strokeDashoffset}
            style={{ filter: `drop-shadow(0px 10px 20px ${color})` }}
          />
        )}
      </svg>

      {/* DATA DOTS & TEXT LABELS */}
      {points.map((p: any, i: number) => {
        // Stagger the pop-in of each dot based on how far along the line it is
        const popFrameDelay = 20 + (i * (60 / points.length));
        const pop = spring({ frame: Math.max(0, frame - popFrameDelay), fps: 30, config: { damping: 12 } });
        
        return (
          <div key={i} style={{ position: 'absolute', left: `${p.x}px`, top: `${p.y}px`, transform: 'translate(-50%, -50%)', opacity: pop, zIndex: 20 }}>
            
            {/* The Dot */}
            {showLine && (
              <div style={{ width: '30px', height: '30px', backgroundColor: '#050505', border: `8px solid ${color}`, borderRadius: '50%', boxShadow: `0 0 25px ${color}` }} />
            )}

            {/* The Value (Top) */}
            {showLabels && (
              <div style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', color: 'white', fontSize: '38px', fontWeight: '900', textShadow: '0 10px 20px rgba(0,0,0,0.8)', whiteSpace: 'nowrap' }}>
                {prefix}{p.value}{suffix}
              </div>
            )}

            {/* The Axis Label (Bottom) */}
            {showLabels && (
              <div style={{ position: 'absolute', top: `${startY - p.y + 50}px`, left: '50%', transform: 'translateX(-50%)', color: 'rgba(255,255,255,0.6)', fontSize: '28px', fontWeight: 'bold', whiteSpace: 'nowrap', textTransform: 'uppercase' }}>
                {p.label}
              </div>
            )}
          </div>
        );
      })}

    </AbsoluteFill>
  );
};

// --- 🎛️ SCENE SWITCHBOARD ---
export const renderSceneComponent = (scene: any, color: string, activeLayers: any = {}, backgroundMode: string = 'black', sceneIndex: number = 0) => {
  const type = scene.visualType;

  // 🤖 THE NEW DYNAMIC LEGO ENGINE
  if (type === "DYNAMIC_CANVAS") {
    return <DynamicSceneRenderer elements={scene.elements || []} sceneBgColor={scene.sceneBgColor || backgroundMode} />;
  }

  if (type === "B_ROLL") return <BRollTemplate {...scene} backgroundMode={backgroundMode} />;

  if (type === "HYPER_IMPACT" || type === "KINETIC_STOMP" || type === "BOTTLE_POP" || type === "IMPACT_VIDEO") return <HyperImpactTemplate {...scene} color={color} activeLayers={activeLayers} backgroundMode={backgroundMode} />;
  if (type === "CHRONO") return <CokeCinematicTemplate {...scene} color={color} activeLayers={activeLayers} backgroundMode={backgroundMode} />;
  if (type === "MACRO_POUR") return <CinematicPourTemplate {...scene} color={color} logoUrl={scene.logoUrl} activeLayers={activeLayers} backgroundMode={backgroundMode} />;
  if (type === "VERTICAL_SPLIT") return <VerticalSplitTemplate {...scene} color={color} activeLayers={activeLayers} backgroundMode={backgroundMode} />;
  if (type === "ICE_BUCKET") return <IceBucketTemplate {...scene} color={color} logoUrl={scene.logoUrl} activeLayers={activeLayers} backgroundMode={backgroundMode} />;
  if (type === "FESTIVAL_CROWD") return <FestivalCrowdTemplate {...scene} color={color} activeLayers={activeLayers} backgroundMode={backgroundMode} />;

  // --- NEW TEMPLATES ---
  if (type === "KINETIC_SPEAKER") return <KineticSpeakerTemplate {...scene} color={color} activeLayers={activeLayers} backgroundMode={backgroundMode} />;
  if (type === "NEON_CONCEPT") return <NeonConceptTemplate {...scene} color={color} activeLayers={activeLayers} backgroundMode={backgroundMode} />;
  if (type === "BOOK_REVEAL") return <BookRevealTemplate {...scene} color={color} numberColor={scene.numberColor || "#000000"} showLightning={scene.showLightning ?? true} activeLayers={activeLayers} backgroundMode={backgroundMode} />;
  if (type === "KINETIC_ROADMAP") return <KineticRoadmapTemplate {...scene} color={color} activeLayers={activeLayers} backgroundMode={backgroundMode} />;
  if (type === "DARK_WEALTH") return <DarkWealthTemplate {...scene} color={color} activeLayers={activeLayers} backgroundMode={backgroundMode} />;
  if (type === "TRIPLE_SHOWCASE") return <TripleShowcaseTemplate {...scene} backgroundMode={backgroundMode} />;
  if (type === "PUPPET_MASTER") return <PuppetMasterTemplate {...scene} chartData={scene.chartData || []} customFontSize={scene.customFontSize || 135} color={color} sceneBgColor={scene.sceneBgColor || "#050505"} brainColor={scene.brainColor || "#00d4ff"} handSpeed={scene.handSpeed ?? 1} stringTension={scene.stringTension ?? 1} handImage={scene.handImage} handSize={scene.handSize ?? 600} handX={scene.handX ?? -138} handY={scene.handY ?? -182} handRotation={scene.handRotation ?? 6} activeLayers={activeLayers} backgroundMode={backgroundMode} />;
  if (type === "FOCUS") return <FocusTemplate {...scene} color={color} backgroundImage={scene.backgroundImage} activeLayers={activeLayers} backgroundMode={backgroundMode} />;
  if (type === "MINDSET_FLOW") return <MindsetFlowTemplate {...scene} image1={scene.image1} image2={scene.image2} image3={scene.image3} bookImage={scene.bookImage} img1Size={scene.img1Size || 380} img2Size={scene.img2Size || 380} img3Size={scene.img3Size || 380} img1Y={scene.img1Y || 0} img2Y={scene.img2Y || 0} img3Y={scene.img3Y || 0} tintColor={scene.tintColor || "#00d4ff"} color={color} activeLayers={activeLayers} backgroundMode={backgroundMode} />;

  // Restored Data Templates
  if (type === "LISTICLE") return <ListicleTemplate {...scene} color={color} activeLayers={activeLayers} backgroundMode={backgroundMode} />;
  if (type === "CAROUSEL") return <CarouselTemplate {...scene} color={color} activeLayers={activeLayers} backgroundMode={backgroundMode} />;
  if (type === "STAMP_CHECKLIST") return <StampChecklistTemplate {...scene} color={color} activeLayers={activeLayers} backgroundMode={backgroundMode} />;
  if (type === "PRODUCT_SHOWCASE") return <ProductShowcaseTemplate {...scene} color={color} activeLayers={activeLayers} backgroundMode={backgroundMode} />;

  if (type === "ORBIT_GRID") return <OrbitingNodesGrid {...scene} color={color} />;
  if (type === "BROWSER_SEARCH") return <BrowserSearchReveal {...scene} color={color} />;
  if (type === "TRIPLE_BUILD") return <TripleBuildTemplate {...scene} color={color} activeLayers={activeLayers} backgroundMode={backgroundMode} />;
  if (type === "CHASE_ATTENTION") return <ChaseAttentionTemplate {...scene} color={color} activeLayers={activeLayers} backgroundMode={backgroundMode} />;
  if (type === "CHART_CRASH") return <ChartCrashTemplate {...scene} color={color} activeLayers={activeLayers} backgroundMode={backgroundMode} />;
  if (type === "CROWD_SCALE") return <CrowdScaleTemplate {...scene} color={color} activeLayers={activeLayers} backgroundMode={backgroundMode} />;
  if (type === "VERSUS") return <VersusTemplate {...scene} color={color} activeLayers={activeLayers} backgroundMode={backgroundMode} />;
  if (type === "BAR_CHART") return <BarChartTemplate {...scene} color={color} activeLayers={activeLayers} backgroundMode={backgroundMode} />;
  if (type === "LINE_CHART") return <LineChartTemplate {...scene} color={color} activeLayers={activeLayers} backgroundMode={backgroundMode} />;
  if (type === "PANORAMIC_REEL") return <PanoramicReelTemplate {...scene} color={color} />;
  if (type === "COMPARISON_PENTAGON") return <ComparisonPentagonTemplate {...scene} color={color} />;
  if (type === "PROCESS_FLOW") return <ProcessFlowTemplate {...scene} color={color} />;
  if (type === "PENTAGON_FLOW") return <PentagonFlowTemplate {...scene} color={color} />;

  if (type === "FLOATING_BADGE") return <FloatingBadgeCard {...scene} color={color} />;
  if (type === "CHAT_STORY") return <ChatBubbleSequence {...scene} color={color} />;
  if (type === "KINETIC_LIST") return <StaggeredKineticList {...scene} items={scene.chartData?.map((d: any) => d.label) || scene.items} color={color} />;

  return <div style={{ color: 'white', fontSize: '40px', backgroundColor: '#000', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>Error: {type} not found</div>;
};



// --- 5. THE TIMELINE (CONTINUOUS PLAYBACK) ---
export const MasterSequence: React.FC<any> = ({ 
  scenes = [], 
  captions = [], 
  color = "#000000", 
  activeLayers = {}, 
  backgroundMode = 'black', 
  layoutMode = 'full', 
  reactionVideoUrl 
}) => {
  const { fps, durationInFrames: totalDuration } = useVideoConfig();

  // 1️⃣ Convert Milliseconds to Frames accurately
  const scenesWithTiming = scenes.map((scene: any) => {
    // ⚡ PROMPT-TO-GRAPHIC FIX: If no timestamps exist, stretch the scene to fill the whole video!
    if (scene.startMs === undefined && scene.endMs === undefined) {
      return { ...scene, startFrame: 0, durationInFrames: totalDuration };
    }

    const startMs = scene.startMs || 0; 
    const endMs = scene.endMs || (startMs + 5000); 

    // Subtract 500ms from the start time for smoother transitions
    const adjustedStartMs = Math.max(0, startMs - 500); 

    const startFrame = Math.round((adjustedStartMs / 1000) * fps);
    const durationInFrames = Math.round(((endMs - adjustedStartMs) / 1000) * fps);
    
    return { ...scene, startFrame, durationInFrames };
  });

  return (
    <AbsoluteFill>
      {/* YOUR BASE VIDEO (Only active in Video-to-Motion mode) */}
      {reactionVideoUrl && (
        <ChromaKeyVideo src={reactionVideoUrl} startFrom={0} />
      )}

      {/* 2️⃣ THE DYNAMIC SCENES */}
      {scenesWithTiming.map((scene: any, index: number) => {
        return (
          <Sequence key={index} from={scene.startFrame} durationInFrames={scene.durationInFrames}>
            {/* ⚡ THE FIX: This now properly renders ALL templates via the switchboard! */}
            {renderSceneComponent(scene, color, activeLayers, backgroundMode, index)}
          </Sequence>
        );
      })}

      {/* YOUR CAPTIONS */}
      <AbsoluteFill style={{ zIndex: 20 }}>
        <ViralCaptions captions={captions} />
      </AbsoluteFill>

    </AbsoluteFill>
  );
};

// --- 🎬 NEW: KINETIC SPEAKER (Talking Head + Popping Text) ---

// --- 🎬 SCENE 1: KINETIC SPEAKER (Slower Pacing & Dynamic Fonts) ---
// --- 🎬 SCENE 1: KINETIC SPEAKER (Slower Pacing & Dynamic Fonts) ---
// --- 🎬 SCENE 1: KINETIC SPEAKER (Ultra-Slow Cinematic Count) ---
// --- 🎬 SCENE 1: KINETIC SPEAKER (Dynamic Scaling & Alignment) ---
export const KineticSpeakerTemplate: React.FC<any> = ({ 
  chartData = [], 
  backgroundImage, 
  searchQuery, // ⚡ ADDED
  color = "#00d4ff", 
  customFontSize = 135, 
  fontFamily = "Montserrat", 
  activeLayers = { speaker: true, text: true }, 
  backgroundMode = 'black' 
}) => {
  const bgColor = backgroundMode === 'green' ? '#00FF00' : backgroundMode === 'transparent' ? 'transparent' : '#000000';
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor, overflow: 'hidden', fontFamily: fontFamily }}>
      
      {/* ⚡ THE BACKGROUND IMAGE & PEXELS WRAPPER */}
      {(backgroundImage || searchQuery) && (
        <AbsoluteFill style={{ opacity: 0.5 }}>
           {searchQuery ? (
             <PexelsVideo searchQuery={searchQuery} />
           ) : backgroundImage?.endsWith('.mp4') ? (
             <Video src={backgroundImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
           ) : (
             <Img src={backgroundImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
           )}
        </AbsoluteFill>
      )}

      {/* Vignette to make text pop */}
      <AbsoluteFill style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 40%, transparent 80%)' }} />

      {/* ⚡ CENTERED VERTICALLY */}
      <AbsoluteFill style={{ 
        justifyContent: 'center', alignItems: 'center', 
        display: 'flex', flexDirection: 'column'
      }}>
        <div style={{
          display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center', width: 'max-content'
        }}>
          {chartData.map((item: any, index: number) => {
            const delay = index * 30; 
            const activeFrame = Math.max(0, frame - delay);
            
            const pop = spring({ frame: activeFrame, fps: 30, config: { stiffness: 90, damping: 16 } });
            const isHighlight = item.value === 1;
            
            const scale = isHighlight ? interpolate(pop, [0, 1], [2.5, 1]) : interpolate(pop, [0, 1], [0.5, 1]); 
            const tracking = isHighlight ? interpolate(activeFrame, [0, 30], [250, 0], { extrapolateRight: 'clamp' }) : 0;
            
            let swapBlur = 0;
            if (isHighlight) {
               if (activeFrame > 12 && activeFrame < 18) swapBlur = interpolate(activeFrame, [12, 15, 18], [0, 12, 0]);
               if (activeFrame > 27 && activeFrame < 33) swapBlur = interpolate(activeFrame, [27, 30, 33], [0, 12, 0]);
            }
            const baseMotionBlur = isHighlight ? interpolate(pop, [0, 1], [15, 0], { extrapolateRight: 'clamp' }) : 0;
            const totalBlur = baseMotionBlur + swapBlur;

            const slideY = interpolate(pop, [0, 1], [60, 0]); 
            const opacity = interpolate(activeFrame, [0, 5], [0, 1], { extrapolateRight: 'clamp' });
            
            let numText = "";
            let wordText = item.label;

            if (isHighlight && item.label.toLowerCase().includes("10 powerful")) {
              if (activeFrame < 15) { numText = "8"; wordText = "Powerful"; }
              else if (activeFrame >= 15 && activeFrame < 30) { numText = "9"; wordText = "Powerful"; }
              else { numText = "10"; wordText = "Powerful"; }
            } else if (isHighlight) {
              const parts = item.label.split(" ");
              if (parts.length > 1 && !isNaN(Number(parts[0]))) {
                  numText = parts[0];
                  wordText = parts.slice(1).join(" ");
              }
            }

            const dynamicBigSize = customFontSize;
            const dynamicSmallSize = Math.max(35, Math.round(customFontSize * 0.35));

            const isTopText = !isHighlight && index < 1;
            const isBottomText = !isHighlight && index >= 2;

            return (
              <div key={index} style={{
                transform: `translateY(${slideY}px) scale(${scale})`,
                opacity: opacity,
                // ⚡ FIX: Remove the filter entirely if blur is 0 to prevent the Chromium rendering bug
                filter: totalBlur > 0 ? `blur(${totalBlur}px)` : undefined, 
                fontSize: isHighlight ? `${dynamicBigSize}px` : `${dynamicSmallSize}px`, 
                fontWeight: isHighlight ? 800 : 600, 
                color: isHighlight ? color : 'white',
                lineHeight: 1, 
                // ⚡ FIX: Removed hex-alphas (AA/66) which breaks text-shadow in headless MP4 render
                textShadow: isHighlight 
                  ? `0 10px 20px rgba(0,0,0,0.8), 0 0 50px ${color}, 0 0 90px ${color}` 
                  : '0 5px 15px rgba(0,0,0,0.9)',
                zIndex: 10,
                display: 'flex', 
                alignItems: 'center',
                // ⚡ PERFECT DIAGONAL ALIGNMENT: Pushes to the true edges of the parent container
                alignSelf: isHighlight ? 'center' : (isTopText ? 'flex-start' : 'flex-end'),
                textAlign: isHighlight ? 'center' : (isTopText ? 'left' : 'right'),
                // Tiny optical nudges so it looks perfectly aligned with the curved letters
                paddingLeft: isTopText ? '5px' : '0px',
                paddingRight: isBottomText ? '10px' : '0px',
              }}>
                
                {!isHighlight ? (
                  <span style={{ letterSpacing: '-1px' }}>{item.label}</span>
                ) : (
                  <>
                    {numText && (
                      <span style={{ 
                        display: 'inline-block', 
                        width: '1.4em', // ⚡ GAVE THE NUMBERS MORE ROOM
                        textAlign: 'left', 
                        letterSpacing: '-2px',
                        marginRight: '15px', // ⚡ RESTORED THE GAP
                        flexShrink: 0
                      }}>
                        {numText}
                      </span>
                    )}

                    <span style={{ display: 'flex', flexDirection: 'row' }}>
                      {wordText.split('').map((char: string, charIdx: number) => (
                        <span key={charIdx} style={{ 
                          display: 'block', 
                          transform: `translateX(${tracking * charIdx}px)`, 
                          marginRight: charIdx !== wordText.length - 1 ? '-3px' : '0px',
                          whiteSpace: char === ' ' ? 'pre' : 'normal' // ⚡ PREVENTS SPACES FROM COLLAPSING
                        }}>
                          {char}
                        </span>
                      ))}
                    </span>
                  </>
                )}

              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
// --- 🎬 SCENE 2: NEON CONCEPT (Proportions & Gap Adjustments) ---
// --- 🎬 SCENE 2: NEON CONCEPT (Dynamic Diamond & Pillar Colors) ---
export const NeonConceptTemplate: React.FC<any> = ({
  activeLayers = { pillars: true, diamond: true, text: true },
  backgroundMode = 'black', 
  headerText = "These will teach you", 
  leftText = "10 powerful skills", 
  backgroundImage, 
  color = "#00d4ff",
  bgGradientColor = "#002255",
  // ⚡ NEW: Individual Size and Color Props!
  topFontSize = 75,
  bottomFontSize = 125,
  topFontColor = "#00ffff",
  bottomFontColor = "#00aaff",
  // ⚡ NEW: Diamond & Pillar Customization
  diamondColor = "#00d4ff",
  pillarColorLeft = "#00d4ff",
  pillarColorCenter = "#0088cc",
  pillarColorRight = "#001a33",
  // ⚡ NEW: Font Family
  fontFamily = "Montserrat"
}) => {
  const frame = useCurrentFrame();

  const liftProgress = spring({ frame: Math.max(0, frame - 5), fps: 30, config: { stiffness: 25, damping: 18 } });
  const masterY = interpolate(liftProgress, [0, 1], [1400, 320]); 
  
  const floatY = Math.sin(frame / 15) * 15;

  const topWords = (headerText || "").split(' ');
  const bottomWords = (leftText || "").split(' ');

  return (
    <AbsoluteFill style={{ backgroundColor: '#000208', overflow: 'hidden', fontFamily: fontFamily }}>
      
      {/* ⚡ WIRED: The radial gradient now starts with the user's chosen color in the center and fades to the dark #000208 edges! */}
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 60%, ${bgGradientColor} 0%, #000208 65%)` }} />

      <AbsoluteFill style={{
        justifyContent: 'center', alignItems: 'center', transform: `translateY(${masterY}px)`,
        display: 'flex', flexDirection: 'column', paddingTop: '10px' 
      }}>
        
        {/* --- MASTER TEXT CONTAINER --- */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '10px' }}>
          
          {/* ======================================= */}
          {/* 1. TOP TEXT ("These will teach you") */}
          {/* ======================================= */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', width: '100%', height: '80px' }}>
            
            {/* BACK LAYER (Shadow & 3D Depth) */}
            <div style={{ display: 'flex', gap: '15px', color: '#001a44', transform: 'translateY(3px)', textShadow: '0px 10px 20px rgba(0,0,0,1)' }}>
              {topWords.map((word: string, i: number) => {
                const wordPop = spring({ frame: Math.max(0, frame - (i * 3)), fps: 30, config: { stiffness: 80, damping: 14 } });
                return (
                  // ⚡ APPLIED: topFontSize
                  <span key={i} style={{ transform: `translateY(${interpolate(wordPop, [0, 1], [20, 0])}px)`, opacity: interpolate(wordPop, [0, 1], [0, 1]), fontSize: `${topFontSize}px`, fontWeight: 700 }}>{word}</span>
                );
              })}
            </div>

            {/* FRONT LAYER (Dynamic Gradient Face) */}
            {/* ⚡ COLOR FIX: Moved the gradient styles from this parent div directly onto the span below */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, display: 'flex', gap: '15px', justifyContent: 'center' }}>
              {topWords.map((word: string, i: number) => {
                const wordPop = spring({ frame: Math.max(0, frame - (i * 3)), fps: 30, config: { stiffness: 80, damping: 14 } });
                return (
                  <span key={i} style={{ 
                    transform: `translateY(${interpolate(wordPop, [0, 1], [20, 0])}px)`, 
                    opacity: interpolate(wordPop, [0, 1], [0, 1]), 
                    fontSize: `${topFontSize}px`, 
                    fontWeight: 700,
                    // ⚡ COLOR FIX: Gradient is now locked directly to the moving word!
                    backgroundImage: `linear-gradient(to right, ${topFontColor} 0%, #ffffff 50%, ${topFontColor} 100%)`, 
                    WebkitBackgroundClip: 'text', 
                    WebkitTextFillColor: 'transparent', 
                    backgroundClip: 'text',
                    color: 'transparent'
                  }}>{word}</span>
                );
              })}
            </div>

          </div>

          {/* ======================================= */}
          {/* 2. BOTTOM TEXT ("10 powerful skills") */}
          {/* ======================================= */}
          {/* ⚡ GAP FIX: Adjusted marginTop to -12px to pull it perfectly close to the top text without touching */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', width: '100%', height: '140px', marginTop: '-12px' }}>
            
            {/* BACK LAYER (Heavy 3D Bevel & Massive Shadow) */}
            <div style={{ display: 'flex', gap: '6px', color: '#001133', transform: 'translateY(6px)', textShadow: '0px 15px 30px rgba(0,0,0,1)' }}>
              {bottomWords.map((word: string, i: number) => {
                const delay = (topWords.length * 3) + (i * 4);
                const wordPop = spring({ frame: Math.max(0, frame - delay), fps: 30, config: { stiffness: 80, damping: 14 } });
                return (
                  // ⚡ APPLIED: bottomFontSize
                  <span key={i} style={{ transform: `scaleX(0.9) scaleY(1.05) translateY(${interpolate(wordPop, [0, 1], [30, 0])}px)`, opacity: interpolate(wordPop, [0, 1], [0, 1]), fontSize: `${bottomFontSize}px`, fontWeight: 900, letterSpacing: '-4px' }}>{word}</span>
                );
              })}
            </div>

            {/* FRONT LAYER (Bottom Dynamic Gradient) */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, display: 'flex', gap: '6px', justifyContent: 'center' }}>
              {bottomWords.map((word: string, i: number) => {
                const delay = (topWords.length * 3) + (i * 4);
                const wordPop = spring({ frame: Math.max(0, frame - delay), fps: 30, config: { stiffness: 80, damping: 14 } });
                return (
                  <span key={i} style={{ 
                    transform: `scaleX(0.9) scaleY(1.05) translateY(${interpolate(wordPop, [0, 1], [30, 0])}px)`, 
                    opacity: interpolate(wordPop, [0, 1], [0, 1]), 
                    fontSize: `${bottomFontSize}px`, 
                    fontWeight: 900, 
                    letterSpacing: '-4px',
                    // ⚡ COLOR FIX: Locked directly to the span!
                    backgroundImage: `linear-gradient(to right, ${bottomFontColor} 0%, #ffffff 50%, ${bottomFontColor} 100%)`, 
                    WebkitBackgroundClip: 'text', 
                    WebkitTextFillColor: 'transparent', 
                    backgroundClip: 'text',
                    color: 'transparent'
                  }}>{word}</span>
                );
              })}
            </div>

          </div>

        </div>

        {/* --- ⚡ THE DIAMOND (Dynamic Color) --- */}
        <div style={{
          transform: `translateY(${floatY}px)`, 
          zIndex: 10, display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          {backgroundImage ? (
            <img src={backgroundImage} style={{width: '550px', filter: `drop-shadow(0 0 50px ${diamondColor}88)`}} alt="3D Object" />
          ) : (
            // Applying the diamondColor to the emoji using a drop-shadow glow
            <span style={{ 
              fontSize: '380px', 
              filter: `drop-shadow(0 0 50px ${diamondColor}) brightness(1.2)` 
            }}>💎</span>
          )}
        </div>

        {/* --- ⚡ THE PILLAR (Dynamic 3-Column Colors) --- */}
        <div style={{
          marginTop: '-10px', 
          width: '520px', 
          height: '2500px', 
          display: 'flex', position: 'relative',
          boxShadow: `0 -15px 80px ${diamondColor}44`, zIndex: 1
        }}>
           {/* The Top Rim Light (uses left pillar color for glow) */}
           <div style={{ 
             position: 'absolute', top: 0, left: 0, right: 0, height: '3px', 
             background: '#ffffff', boxShadow: `0 0 15px 3px ${pillarColorLeft}`, zIndex: 5 
           }} />
           
           {/* ⚡ COLUMN 1: LEFT */}
           <div style={{ flex: 1, background: pillarColorLeft }} />
           
           {/* ⚡ COLUMN 2: CENTER */}
           <div style={{ flex: 1, background: pillarColorCenter }} />
           
           {/* ⚡ COLUMN 3: RIGHT */}
           <div style={{ 
             flex: 1, 
             background: pillarColorRight, 
             borderRight: '2px solid rgba(255, 255, 255, 0.4)' 
           }} />
        </div>

      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// --- 🎬 SCENE 3: 3D BOOK REVEAL ---
export const BookRevealTemplate: React.FC<any> = ({
  activeLayers = { book: true, text: true, lightning: true },
  backgroundMode = 'black', 
  number = "1", 
  // ⚡ NEW: Added numberColor prop for the editor
  numberColor = "#000000",
  backgroundImage, 
  coverImage = "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop",
  title = "Clear thinking by", 
  author = "Shane Parish",
  fontColor = "#111111", 
  fontSize = 100,
  color = "#DCE8F2", 
  fontFamily = "Montserrat",
  showLightning = true // ⚡ ADD THIS
}) => {
  const frame = useCurrentFrame();
  const textScale = fontSize / 100;
  const finalCoverImage = backgroundImage || coverImage;

  // ⚡ ADD THESE TWO ANIMATION VARIABLES:
  // This creates a rapid double-flash effect between frames 5 and 16
  const lightningOpacity = interpolate(
    frame,
    [5, 7, 8, 10, 12, 16],
    [0, 1, 0, 1, 0.8, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  
  // This flashes the entire background slightly white to illuminate the "room"
  const bgFlash = interpolate(
    frame,
    [5, 7, 8, 10, 12, 16],
    [0, 0.4, 0, 0.5, 0.2, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // 1. THE NUMBER DROP
  const numberDrop = spring({ frame: Math.max(0, frame - 10), fps: 30, config: { stiffness: 60, damping: 18 } });
  const numberY = interpolate(numberDrop, [0, 1], [-150, 0]); 

  // 2. THE 3D BOOK PHYSICS 
  const flightProgress = spring({ frame: Math.max(0, frame - 5), fps: 30, config: { mass: 1.5, stiffness: 60, damping: 12 } });
  const bookY = interpolate(flightProgress, [0, 1], [1500, 0]);
  const bookRotateX = interpolate(flightProgress, [0, 1], [60, 20]);
  const bookRotateY = interpolate(flightProgress, [0, 1], [-180, -25]);
  const bookRotateZ = interpolate(flightProgress, [0, 1], [45, -5]);

  const topWords = (title || "").split(' ');
  const bottomWords = (author || "").split(' ');

  return (
    <AbsoluteFill style={{ backgroundColor: color, overflow: 'hidden', fontFamily: fontFamily }}>
      
      {/* ⚡ THE MULTI-STRIKE LIGHTNING EFFECT */}
      {showLightning && (
        <>
          {/* Full-screen ambient flash (Illuminates the room) */}
          <AbsoluteFill style={{ backgroundColor: '#ffffff', opacity: bgFlash, zIndex: 1 }} />
          
          {/* 3 Lightning Bolts reaching down to the red mark */}
          <div style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            opacity: lightningOpacity, zIndex: 2, pointerEvents: 'none'
          }}>
            {/* viewBox matches a 1080x1920 screen so coordinates are perfectly precise */}
            <svg width="100%" height="100%" viewBox="0 0 1080 1920">
              
              {/* ⚡ CENTER BOLT (Thickest) */}
              <path d="M540,-50 L480,200 L580,450 L450,700 L550,950 L500,1200" 
                    fill="none" stroke="#ffffff" strokeWidth="8" 
                    style={{ filter: 'drop-shadow(0 0 20px #ffffff) drop-shadow(0 0 50px #00d4ff)' }} />
              <path d="M580,450 L680,550 L620,700" fill="none" stroke="#ffffff" strokeWidth="4" style={{ filter: 'drop-shadow(0 0 15px #00d4ff)' }} />

              {/* ⚡ LEFT BOLT */}
              <path d="M250,-50 L350,150 L200,400 L350,650 L250,900 L300,1150" 
                    fill="none" stroke="#ffffff" strokeWidth="5" 
                    style={{ filter: 'drop-shadow(0 0 20px #00d4ff)' }} />
              <path d="M200,400 L100,500 L150,650" fill="none" stroke="#ffffff" strokeWidth="3" style={{ filter: 'drop-shadow(0 0 10px #00d4ff)' }} />

              {/* ⚡ RIGHT BOLT */}
              <path d="M850,-50 L750,250 L900,500 L750,800 L850,1000 L780,1250" 
                    fill="none" stroke="#ffffff" strokeWidth="6" 
                    style={{ filter: 'drop-shadow(0 0 20px #00d4ff)' }} />
              <path d="M900,500 L1000,650 L950,800" fill="none" stroke="#ffffff" strokeWidth="3" style={{ filter: 'drop-shadow(0 0 10px #00d4ff)' }} />
            
            </svg>
          </div>
        </>
      )}
      
      {/* --- THE GIANT NUMBER --- */}
      <AbsoluteFill style={{ justifyContent: 'flex-start', alignItems: 'center', top: '0px', zIndex: 1 }}>
        <div style={{
          fontSize: '850px', 
          fontWeight: 900, 
          // ⚡ FIXED: Now uses the numberColor prop from the editor
          color: numberColor, 
          opacity: 1, 
          lineHeight: 1,
          transform: `translateY(${numberY}px)`,
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 90%)',
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 90%)'
        }}>
          {number}
        </div>
      </AbsoluteFill>

      {/* --- THE 3D BOOK ASSEMBLY --- */}
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', perspective: '1500px', top: '80px', zIndex: 10 }}>
        <div style={{
          width: '360px', height: '540px', position: 'relative', transformStyle: 'preserve-3d',
          transform: `translateY(${bookY}px) rotateX(${bookRotateX}deg) rotateY(${bookRotateY}deg) rotateZ(${bookRotateZ}deg)`,
          boxShadow: flightProgress > 0.8 ? '-20px 30px 50px rgba(0,0,0,0.3)' : 'none', transition: 'box-shadow 0.2s ease-out',
        }}>
          <div style={{ position: 'absolute', width: '100%', height: '100%', backgroundImage: `url(${finalCoverImage})`, backgroundSize: 'cover', backgroundPosition: 'center', transform: 'translateZ(25px)', borderRadius: '2px 8px 8px 2px', overflow: 'hidden', boxShadow: 'inset 4px 0 10px rgba(0,0,0,0.1)' }} />
          <div style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: '#111', transform: 'rotateY(180deg) translateZ(25px)', borderRadius: '8px 2px 2px 8px' }} />
          <div style={{ position: 'absolute', width: '50px', height: '100%', backgroundColor: '#222', transform: 'rotateY(-90deg) translateZ(25px)', left: '-25px' }} />
          <div style={{ position: 'absolute', width: '48px', height: '98%', backgroundColor: '#f4f4f4', transform: 'rotateY(90deg) translateZ(335px)', top: '1%', backgroundImage: 'repeating-linear-gradient(to bottom, transparent 0px, transparent 2px, rgba(0,0,0,0.05) 3px)' }} />
          <div style={{ position: 'absolute', width: '98%', height: '48px', backgroundColor: '#f4f4f4', transform: 'rotateX(90deg) translateZ(25px)', left: '1%', top: '-24px', backgroundImage: 'repeating-linear-gradient(to right, transparent 0px, transparent 2px, rgba(0,0,0,0.05) 3px)' }} />
        </div>
      </AbsoluteFill>

      {/* --- THE WATERFALL TEXT --- */}
      <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: '210px', zIndex: 10 }}>
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,1) 40%)',
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,1) 40%)'
        }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '5px' }}>
            {topWords.map((word: string, i: number) => {
              const wordPop = spring({ frame: Math.max(0, frame - 5 - (i * 4)), fps: 30, config: { stiffness: 120, damping: 14 } });
              return (
                <span key={i} style={{
                  fontSize: `${55 * textScale}px`, 
                  fontWeight: 700, 
                  color: fontColor, 
                  letterSpacing: '-1px',
                  opacity: wordPop,
                  transform: `translateY(${interpolate(wordPop, [0, 1], [30, 0])}px)`
                }}>
                  {word}
                </span>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            {bottomWords.map((word: string, i: number) => {
              const delay = 5 + (topWords.length * 4) + (i * 5); 
              const wordPop = spring({ frame: Math.max(0, frame - delay), fps: 30, config: { stiffness: 120, damping: 14 } });
              return (
                <span key={i} style={{
                  fontSize: `${95 * textScale}px`, 
                  fontWeight: 900, 
                  color: fontColor, 
                  letterSpacing: '-3px', lineHeight: 1,
                  opacity: wordPop,
                  transform: `translateY(${interpolate(wordPop, [0, 1], [40, 0])}px)`
                }}>
                  {word}
                </span>
              );
            })}
          </div>
        </div>
      </AbsoluteFill>

    </AbsoluteFill>
  );
};

// --- 🎬 SCENE 4: KINETIC ROADMAP (Expansion Zoom Fix) ---
export const KineticRoadmapTemplate: React.FC<any> = ({
  activeLayers = { roadmap: true, icons: true, text: true },
  backgroundMode = 'black', 
  headerText = "Good Habits", 
  backgroundImage,
  searchQuery,
  chartData = [],
  color = "#00d4ff",
  // ⚡ FIX 1: Change default emojis to standard Line Art IDs
  icons = ["RiRocketLine", "RiLightbulbLine", "RiBookLine", "RiTargetLine"],
  fontSize = 115,
  fontColor = "#ffffff",
  fontFamily = "Montserrat"
}) => {
  const frame = useCurrentFrame();
  
  // 1. Zoom Logic
  const bgZoom = interpolate(frame, [0, 120], [1, 1.05]);
  
  // ⚡ START SMALL TO BIG: Zooming from 0.75 (small) to 1.1 (final size)
  const diagramZoom = interpolate(frame, [0, 120], [0.75, 1.1], {
    extrapolateRight: 'clamp'
  });

  // 2. Animation Springs
  const lineProgress = spring({ frame: Math.max(0, frame - 30), fps: 30, config: { stiffness: 35, damping: 20 } });

  return (
    <AbsoluteFill style={{ backgroundColor: '#000', overflow: 'hidden', fontFamily: fontFamily }}>
      
      {/* 1. SOLID BLACK BASE */}
      <AbsoluteFill style={{ backgroundColor: '#000000' }} />

      {/* 2. THE BACKGROUND MEDIA (Full Opacity) */}
      {(backgroundImage || searchQuery) && (
        <AbsoluteFill style={{ transform: `scale(${bgZoom})` }}>
           {searchQuery ? (
             <PexelsVideo searchQuery={searchQuery} />
           ) : backgroundImage?.endsWith('.mp4') ? (
             <Video src={backgroundImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
           ) : (
             <Img src={backgroundImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
           )}
        </AbsoluteFill>
      )}

      {/* 3. HEAVY DARK OVERLAY (Dims the video, sits below UI) */}
      <AbsoluteFill style={{ backgroundColor: 'rgba(0,0,0,0.75)', zIndex: 1 }} />

      {/* 4. THE MASTER UI CONTAINER (Ensure zIndex is high!) */}
      <AbsoluteFill style={{ 
        justifyContent: 'flex-end', 
        alignItems: 'center', 
        paddingBottom: '250px',
        transform: `scale(${diagramZoom})`,
        transformOrigin: 'bottom center',
        zIndex: 10 /* ⚡ Forces everything inside above the overlay */
      }}>
        
        {/* ⚡ THE HORIZON LINE: Anchored precisely to hit the diamonds */}
        <div style={{ 
          position: 'absolute', 
          bottom: '380px', 
          width: '120%', 
          left: '-10%', 
          height: '6px', 
          transform: `scaleX(${lineProgress})`,
          background: `linear-gradient(to right, transparent, ${color}, white, ${color}, transparent)`,
          boxShadow: `0 0 35px ${color}`, 
          zIndex: 5,
          borderRadius: '10px'
        }} />

        {/* --- ICONS + DIAMONDS AREA --- */}
        <div style={{ 
          position: 'relative', 
          width: '100%', 
          height: '240px', 
          display: 'flex', 
          justifyContent: 'space-evenly', 
          alignItems: 'center', 
          marginBottom: '50px',
          zIndex: 10
        }}>
          {icons.slice(0, 4).map((rawIcon: string, i: number) => {
            // ⚡ FIX 2: Safe fallback! If the slot is empty, default to a checkmark
            const icon = rawIcon || "RiCheckLine";
            
            const delay = 45 + (i * 12);
            const itemSpring = spring({ frame: Math.max(0, frame - delay), fps: 30, config: { stiffness: 100, damping: 12 } });

            return (
              <div key={i} style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                opacity: itemSpring, 
                transform: `translateY(${(1 - itemSpring) * 30}px)` 
              }}>
                
                {/* ⚡ THE CIRCLE: Now "empty" (Transparent) with white border */}
                <div style={{ 
                  width: '135px', 
                  height: '135px', 
                  borderRadius: '50%', 
                  // Thick white border as seen in reference
                  border: '6px solid #ffffff', 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  fontSize: '70px',
                  // ⚡ FIX: Making the background perfectly empty
                  background: 'transparent', 
                  // Removing the backdropFilter blur as requested
                  backdropFilter: 'none', 
                  marginBottom: '25px',
                  // Clean white halo shadow
                  boxShadow: `0 0 25px rgba(255,255,255,0.7)`
                }}>
                  {/* ⚡ THE ICON: SVG Masking for Unified Icon Rendering */}
                  <div style={{
                    width: '75px',
                    height: '75px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    // ⚡ THE MAGIC: SVG MASKING
                    // This treats the icon as a stencil. Only the lines of the icon will show the color.
                    backgroundColor: color, // This fills the "lines" with your Cyan
                    WebkitMaskImage: `url(${icon.startsWith('http') || icon.startsWith('data:') ? icon : `https://api.iconify.design/ri:${icon.replace('Ri', '').replace('Line', '').toLowerCase()}-line.svg`})`,
                    WebkitMaskRepeat: 'no-repeat',
                    WebkitMaskPosition: 'center',
                    WebkitMaskSize: 'contain',
                    maskImage: `url(${icon.startsWith('http') || icon.startsWith('data:') ? icon : `https://api.iconify.design/ri:${icon.replace('Ri', '').replace('Line', '').toLowerCase()}-line.svg`})`,
                    maskRepeat: 'no-repeat',
                    maskSize: 'contain',
                    // Adds the neon glow around the lines only
                    filter: `drop-shadow(0 0 12px ${color})`, 
                  }}>
                    {/* The container is the icon itself now, so no inner <img> or <span> needed! */}
                  </div>
                </div>

                {/* THE DIAMOND CONNECTOR (Stays the same) */}
                <div style={{ 
                  width: '26px', height: '26px', backgroundColor: color, 
                  transform: 'rotate(45deg)', boxShadow: `0 0 20px ${color}`,
                  border: '2px solid white'
                }} />

                {/* ⚡ THE LABEL UNDER THE DIAMOND */}
                <div style={{
                  position: 'absolute', top: '190px', width: '200px', textAlign: 'center',
                  color: 'white', fontSize: '24px', fontWeight: 'bold', textTransform: 'uppercase',
                  letterSpacing: '1px', textShadow: '0 5px 15px rgba(0,0,0,0.8)'
                }}>
                  {chartData[i]?.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* --- ⚡ UPDATED MAIN TEXT --- */}
        <div style={{ 
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '2px',
          width: '100%', /* ⚡ Give it max width */
          fontSize: headerText.length > 12 ? '65px' : '95px', /* ⚡ Shrinks earlier so long words fit */
          fontWeight: 900, 
          color: 'white', /* ⚡ Forced Pure White */
          textAlign: 'center',
          letterSpacing: '-2px', /* ⚡ Reduced letter spacing slightly to help fit */
          lineHeight: 1,
          zIndex: 20
        }}>
          {headerText.split('').map((char: string, i: number) => {
            // Delay each letter by 2 frames for a fast, kinetic sequence
            const delay = 15 + (i * 2); 
            const letterSpring = spring({ 
              frame: Math.max(0, frame - delay), 
              fps: 30, 
              config: { stiffness: 150, damping: 12 } 
            });

            return (
              <span key={i} style={{
                display: 'inline-block',
                opacity: letterSpring,
                transform: `scale(${letterSpring}) translateY(${(1 - letterSpring) * 30}px)`,
                // Glow stays linked to the THEME color (cyan) for contrast
                textShadow: `0 0 20px rgba(0,0,0,1), 0 10px 40px rgba(0,0,0,1), 0 0 50px ${color}88`,
                // Preserve space between words
                whiteSpace: char === ' ' ? 'pre' : 'normal'
              }}>
                {char}
              </span>
            );
          })}
        </div>

      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// --- 🎬 SCENE: DARK WEALTH (Continuous Zoom & Flip Transition) ---
export const DarkWealthTemplate: React.FC<any> = ({
  activeLayers = { card: true, coin: true, text: true },
  backgroundMode = 'black', 
  topText1 = "Kis trah khel skte ho",
  mainText1 = "MONEY",
  topText2 = "How you become",
  mainText2 = "RICH",
  cardImage = "https://img.icons8.com/fluency/512/bank-cards.png", 
  coinImage = "https://img.icons8.com/fluency/512/bitcoin.png", 
  noteImage = "https://img.icons8.com/fluency/512/stack-of-money.png" 
}) => {
  const frame = useCurrentFrame();

  // 🎥 1. MASTER CAMERA ZOOM (⚡ EXTENDED TO 180 FRAMES)
  const masterZoom = interpolate(frame, [0, 180], [1, 1.9], { extrapolateRight: 'clamp' });

  // 🌌 2. BACKGROUND STITCH RINGS (⚡ EXTENDED TO 180 FRAMES)
  const ringRotateCenter = interpolate(frame, [0, 180], [0, 54]);
  const ringRotateLeft = interpolate(frame, [0, 180], [0, -72]);
  const ringRotateRight = interpolate(frame, [0, 180], [0, 36]);

  // 🔀 3. TIMING LOGIC
  const mainText1Scale = spring({ frame: Math.max(0, frame - 5), fps: 30, config: { stiffness: 120, damping: 14 } });
  const text1Length = Math.floor(interpolate(frame, [25, 45], [0, topText1.length], { extrapolateRight: 'clamp' }));
  const visibleTopText1 = topText1.substring(0, text1Length);
  const mainText1Opacity = interpolate(frame, [65, 75], [1, 0], { extrapolateRight: 'clamp' });
  
  // ⚡ FIX: Shifted the spring start to frame 45 (it will be fully settled by frame 75 when the note is covering the screen)
  const mainText2Scale = spring({ frame: Math.max(0, frame - 45), fps: 30, config: { stiffness: 120, damping: 14 } });
  
  // ⚡ FIX: Typewriter for "How you become" also shifted earlier so it's ready when the note drops
  const text2Length = Math.floor(interpolate(frame, [65, 85], [0, topText2.length], { extrapolateRight: 'clamp' }));
  const visibleTopText2 = topText2.substring(0, text2Length);
  
  // ⚡ FIX: Snaps to 100% visible exactly at frame 75 (the exact moment the wiping note covers the center)
  const mainText2Opacity = interpolate(frame, [74, 75], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

  // 💵 4. THE CURRENCY NOTE FLIP TRANSITION
  const noteY = interpolate(frame, [60, 75, 90], [1000, 0, -1000], { extrapolateRight: 'clamp' });
  const noteScale = interpolate(frame, [60, 75, 90], [1, 7, 1], { extrapolateRight: 'clamp' });
  const noteFlip = interpolate(frame, [60, 90], [-60, 60]); 
  
  const cardFloat = Math.sin(frame / 15) * 20;
  const coinFloat = Math.cos(frame / 20) * 30;

  //  5. GENERATE FLOWING DUST PARTICLES
  // We use Math.sin/cos with fixed multipliers to generate pseudo-random but perfectly consistent particles 
  // so they don't jump around every time the component re-renders.
  const dustParticles = new Array(80).fill(0).map((_, i) => ({
    id: i,
    startX: Math.abs(Math.sin(i * 12.3)) * 100, 
    startY: Math.abs(Math.cos(i * 45.6)) * 100, 
    size: Math.abs(Math.sin(i * 78.9)) * 3 + 1,
    driftX: Math.sin(i * 32.1) * 70, // Drift slightly further over 6 seconds
    driftY: Math.cos(i * 65.4) * 120 - 60,
    baseOpacity: Math.abs(Math.sin(i * 98.7)) * 0.4 + 0.2
  }));

  // 🎨 HELPER: Layered Text Component
  const LayeredWealthText = ({ topText, mainText, scale, opacity }: { topText: string, mainText: string, scale: number, opacity: number }) => {
    const firstChar = mainText ? mainText.charAt(0) : "";
    const restChars = mainText ? mainText.slice(1) : "";

    const gothicFont = '"Old English Text MT", "UnifrakturMaguntia", "Pirata One", serif';
    const serifFont = "'Playfair Display', 'Times New Roman', serif";

    const rainbowShadow = `
      0px 2px 0px rgba(255,0,0,0.9),
      0px 4px 0px rgba(255,165,0,0.9),
      0px 6px 0px rgba(255,255,0,0.9),
      0px 8px 0px rgba(0,255,0,0.9),
      0px 10px 0px rgba(0,255,255,0.9),
      0px 12px 0px rgba(0,0,255,0.9),
      0px 20px 40px rgba(0,0,0,0.9)
    `;

    const dashTexture = `repeating-linear-gradient(
      -45deg,
      #FDE047 0px,       
      #FDE047 2px,       
      transparent 2px,   
      transparent 6px    
    )`;

    return (
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', opacity }}>
        <div style={{ 
          fontFamily: "'Montserrat', 'Inter', sans-serif", 
          color: '#ffffff', 
          fontSize: '32px', 
          fontWeight: 500, 
          letterSpacing: '4px', 
          marginBottom: '-20px', 
          zIndex: 20, 
          textShadow: '0 0 15px rgba(255,255,255,0.4)' 
        }}>
          {topText}
        </div>

        <div style={{
          transform: `scale(${scale}) scaleY(1.25)`, 
          position: 'relative',
          fontSize: '190px',
          fontWeight: 'normal',
          fontStyle: 'italic', 
          lineHeight: 1,
          display: 'inline-block',
          filter: 'drop-shadow(0 0 25px rgba(255, 215, 0, 0.4)) brightness(1.2)'
        }}>
          {/* LAYER 1: Glitch Core */}
          <div style={{
            position: 'absolute', top: 0, left: 0, width: '100%',
            color: '#050505',
            textShadow: rainbowShadow,
            zIndex: 1,
            whiteSpace: 'nowrap'
          }}>
            <span style={{ fontFamily: gothicFont }}>{firstChar}</span>
            <span style={{ fontFamily: serifFont, marginLeft: '4px' }}>{restChars}</span>
          </div>

          {/* LAYER 2: The distinct dashes */}
          <div style={{
            position: 'relative',
            zIndex: 2,
            backgroundImage: dashTexture,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            WebkitTextFillColor: 'transparent', 
            whiteSpace: 'nowrap'
          }}>
            <span style={{ fontFamily: gothicFont }}>{firstChar}</span>
            <span style={{ fontFamily: serifFont, marginLeft: '4px' }}>{restChars}</span>
          </div>
        </div>
      </AbsoluteFill>
    );
  };

  return (
    <AbsoluteFill style={{ backgroundColor: '#020202', overflow: 'hidden' }}>
      
      {/* --- 🌌 BACKGROUND STITCHES / THREADS --- */}
      <AbsoluteFill style={{ opacity: 0.6, perspective: '1000px' }}>
        
        {/* ⚡ FIX 1: Left Side Threads (Much wider strokeWidth and bigger dashes) */}
        <div style={{ position: 'absolute', left: '-15%', top: '30%', transform: `rotateX(65deg) rotateY(15deg) rotateZ(${ringRotateLeft}deg)` }}>
          <svg width="600" height="600" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="48" fill="none" stroke="#ffffff" strokeWidth="1.2" strokeDasharray="2 4" opacity="0.8" />
            <circle cx="50" cy="50" r="42" fill="none" stroke="#FFD700" strokeWidth="0.8" strokeDasharray="4 6" opacity="0.6" />
          </svg>
        </div>

        {/* ⚡ FIX 1: Bottom Right Threads (Much wider strokeWidth) */}
        <div style={{ position: 'absolute', right: '5%', bottom: '5%', transform: `rotateX(75deg) rotateY(-15deg) rotateZ(${ringRotateRight}deg)` }}>
          <svg width="650" height="650" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="48" fill="none" stroke="#ffffff" strokeWidth="1.0" strokeDasharray="2 4" opacity="0.7" />
            <circle cx="50" cy="50" r="45" fill="none" stroke="#B8860B" strokeWidth="0.8" strokeDasharray="1.5 3" opacity="0.5" />
          </svg>
        </div>

        <div style={{ position: 'absolute', left: '30%', top: '20%', transform: `rotateX(60deg) rotateZ(${ringRotateCenter}deg) translateZ(-400px)` }}>
          <svg width="800" height="800" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="48" fill="none" stroke="#B8860B" strokeWidth="0.5" strokeDasharray="2 6" opacity="0.4" />
          </svg>
        </div>
      </AbsoluteFill>

      {/* --- 🎥 MASTER CAMERA ZOOM WRAPPER --- */}
      <AbsoluteFill style={{ transform: `scale(${masterZoom})`, justifyContent: 'center', alignItems: 'center' }}>
        
        {/* 🌠 FLOWING DUST PARTICLES (⚡ EXTENDED TO 180 FRAMES) */}
        {dustParticles.map((particle) => {
          const xOffset = interpolate(frame, [0, 180], [0, particle.driftX]);
          const yOffset = interpolate(frame, [0, 180], [0, particle.driftY]);
          // Add a twinkling effect by modulating opacity with a sine wave
          const twinkle = particle.baseOpacity * (0.6 + 0.4 * Math.sin((frame + particle.id * 10) / 15));

          return (
            <div
              key={particle.id}
              style={{
                position: 'absolute',
                left: `${particle.startX}%`,
                top: `${particle.startY}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                backgroundColor: '#ffffff',
                borderRadius: '50%',
                opacity: twinkle,
                transform: `translate(${xOffset}px, ${yOffset}px)`,
                boxShadow: `0 0 ${particle.size * 3}px rgba(255, 255, 255, 0.8)` // Glowing halo
              }}
            />
          );
        })}

        {/* 💳 FLOATING IMAGES */}
        {/* ⚡ FIX 2: Increased scale heavily from 0.9 to 1.4 for Card */}
        <div style={{ 
          position: 'absolute', left: '15%', top: '25%', transform: `translateY(${cardFloat}px) rotate(-15deg) scale(1.4)`, opacity: 0.9, 
          filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.9)) brightness(1.4) contrast(1.1)' 
        }}>
          {cardImage && <img src={cardImage} style={{ width: '250px', objectFit: 'contain' }} alt="card" />}
        </div>
        
        {/* ⚡ FIX 2: Increased scale heavily from 1.0 to 1.5 for Coin */}
        <div style={{ 
          position: 'absolute', right: '10%', bottom: '25%', transform: `translateY(${coinFloat}px) rotate(25deg) scale(1.5)`, opacity: 0.8, 
          filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.9)) brightness(1.4) contrast(1.1)' 
        }}>
          {coinImage && <img src={coinImage} style={{ width: '200px', objectFit: 'contain' }} alt="coin" />}
        </div>

        {/* 🔠 PHASE 1 */}
        <LayeredWealthText topText={visibleTopText1} mainText={mainText1} scale={mainText1Scale} opacity={mainText1Opacity} />

        {/* 🔠 PHASE 2 */}
        <LayeredWealthText topText={visibleTopText2} mainText={mainText2} scale={mainText2Scale} opacity={mainText2Opacity} />

        {/* 💵 TRANSITION */}
        {frame > 55 && frame < 95 && (
          <div style={{ 
            position: 'absolute', zIndex: 50, transform: `translateY(${noteY}px) scale(${noteScale}) rotateX(${noteFlip}deg) rotateZ(15deg)`,
            filter: 'drop-shadow(0 50px 50px rgba(0,0,0,0.95)) brightness(0.7)'
          }}>
            {noteImage && <img src={noteImage} style={{ width: '350px', objectFit: 'contain', opacity: 0.95 }} alt="wipe" />}
          </div>
        )}
      </AbsoluteFill>

      {/* 🌑 CINEMATIC VIGNETTE */}
      <AbsoluteFill style={{
        background: 'radial-gradient(circle, rgba(0,0,0,0) 30%, rgba(0,0,0,0.85) 100%)',
        zIndex: 100,
        pointerEvents: 'none'
      }} />

    </AbsoluteFill>
  );
};

// --- 🎭 SCENE: PUPPET MASTER (FULLY RIGGED FINGERS) ---
export const PuppetMasterTemplate: React.FC<any> = ({ 
  chartData = [], customFontSize = 135, color = "#00d4ff", brainColor = "#00d4ff",  
  handSpeed = 1, stringTension = 1, handSize = 600, handX = -138, handY = -182, handRotation = 6, fontFamily = "Montserrat",
  sceneBgColor = "#050505", // ⚡ NEW: Receive the background color
  
  // ⚡ HARDCODED JOINT ASSEMBLY (Locked in place)
  palmX = -19, palmY = 36, palmSize = 57,
  f1X = 14, f1Y = 41, f1Size = 30, f1RotOffset = 33, f1Twitch = 0.20,
  f2X = 14, f2Y = 45, f2Size = 30, f2RotOffset = 33, f2Twitch = 0.25,
  f3X = 8, f3Y = 47, f3Size = 30, f3RotOffset = 33, f3Twitch = 0.20,
  f4X = 33, f4Y = -50, f4Size = 25, f4RotOffset = 0, f4Twitch = 0.14,
  
  // 🧶 HARDCODED STRING ATTACHMENT POINTS (Locked in place)
  s1X = 310, s1Y = 250,
  s2X = 303, s2Y = 254,
  s3X = 198, s3Y = 238,
  s4X = 0,   s4Y = 119,
  
  // 👁️ LAYER VISIBILITY & BACKGROUND MODE
  activeLayers = { hand: true, brain: true, text: true }, // Default fallback
  backgroundMode = 'black',
}) => {
  const frame = useCurrentFrame();

  const entrance = spring({ frame, fps: 30, config: { stiffness: 50, damping: 14 } });
  const masterY = interpolate(entrance, [0, 1], [-800, 0]);

  // 🖼️ FIXED FOR RENDER: Wrapped in staticFile
  const palmImage = staticFile("renders/hand/palm.png"); 
  const finger1Image = staticFile("renders/hand/finger1.png"); // Index
  const finger2Image = staticFile("renders/hand/finger2.png"); // Middle
  const finger3Image = staticFile("renders/hand/finger3.png"); // Ring
  const finger4Image = staticFile("renders/hand/finger4.png"); // Pinky

  // 🎯 CONTINUOUS ANIMATION DRIVERS
  const motionSpeed = handSpeed * 0.015; 
  const tensionJitter = Math.sin(frame * 0.8) * (stringTension * 0.003);

  // 1️⃣ THE WRIST PIVOT POINT (Frozen: Removed the up/down bobbing)
  const pivotX = 80 + handX;
  const pivotY = 150 + handY; 

  // 2️⃣ GLOBAL HAND ROTATION (Frozen: Palm stays still, only tension jitter remains)
  const baseRotation = (handRotation || 0) * (Math.PI / 180);
  const totalAngle = baseRotation + tensionJitter;

  // 3️⃣ INDEPENDENT FINGER TWITCHING (Controlled by UI Twitch sliders)
  const finger1Rot = Math.sin(frame * motionSpeed * 5) * f1Twitch;       
  const finger2Rot = Math.sin(frame * motionSpeed * 5 + 1.5) * f2Twitch; 
  const finger3Rot = Math.sin(frame * motionSpeed * 5 + 3.0) * f3Twitch;  
  const finger4Rot = Math.sin(frame * motionSpeed * 5 + 4.5) * f4Twitch;

  // 4️⃣ FLAWLESS FINGERTIP TRACKING MATH
  // Convert UI rotation offsets to radians for the finger images
  const f1Rad = (f1RotOffset || 0) * (Math.PI / 180);
  const f2Rad = (f2RotOffset || 0) * (Math.PI / 180);
  const f3Rad = (f3RotOffset || 0) * (Math.PI / 180);
  const f4Rad = (f4RotOffset || 0) * (Math.PI / 180);

  // Calculate the physical length of each finger in pixels based on the UI Size sliders.
  // The hand container width is (handSize * 2).
  const f1Len = (handSize * 2) * ((f1Size || 30) / 100);
  const f2Len = (handSize * 2) * ((f2Size || 33) / 100);
  const f3Len = (handSize * 2) * ((f3Size || 30) / 100);
  const f4Len = (handSize * 2) * ((f4Size || 25) / 100);

  // 🎨 Set the dynamic background color
  const finalBgColor = backgroundMode === 'green' ? '#00FF00' : 
                       backgroundMode === 'transparent' ? 'transparent' : 
                       sceneBgColor; // ⚡ FIXED: Uses UI state instead of hardcoded black

  // Calculate the exact resting angle of each finger (Global hand rotation + Individual finger UI rotation)
  const f1BaseAng = baseRotation + (f1Rad || 0);
  const f2BaseAng = baseRotation + (f2Rad || 0);
  const f3BaseAng = baseRotation + (f3Rad || 0);
  const f4BaseAng = baseRotation + (f4Rad || 0);

  // Apply exact trigonometry delta. 
  // This takes the manual slider position (s1X, s1Y) and adds the exact X/Y movement caused by the finger twitch.
  const f1x = s1X + f1Len * (Math.cos(f1BaseAng + finger1Rot) - Math.cos(f1BaseAng));
  const f1y = s1Y + f1Len * (Math.sin(f1BaseAng + finger1Rot) - Math.sin(f1BaseAng));

  const f2x = s2X + f2Len * (Math.cos(f2BaseAng + finger2Rot) - Math.cos(f2BaseAng));
  const f2y = s2Y + f2Len * (Math.sin(f2BaseAng + finger2Rot) - Math.sin(f2BaseAng));

  const f3x = s3X + f3Len * (Math.cos(f3BaseAng + finger3Rot) - Math.cos(f3BaseAng));
  const f3y = s3Y + f3Len * (Math.sin(f3BaseAng + finger3Rot) - Math.sin(f3BaseAng));

  const f4x = s4X + f4Len * (Math.cos(f4BaseAng + finger4Rot) - Math.cos(f4BaseAng));
  const f4y = s4Y + f4Len * (Math.sin(f4BaseAng + finger4Rot) - Math.sin(f4BaseAng));

  return (
    <AbsoluteFill style={{ backgroundColor: finalBgColor, overflow: 'hidden', fontFamily: fontFamily }}>
      
      {/* --- 🎭 THE PUPPET MASTER (GRAPHIC) --- */}
      <div style={{ 
        position: 'absolute', top: '0px', left: '50%', 
        transform: `translateX(-50%) translateY(${masterY}px)`,
        zIndex: 10, width: '400px', 
        height: '1000px' // ⚡ Increased height so the brain doesn't clip
      }}>
        
        {/* 🧶 STRINGS & BRAIN (Rendered BEHIND the hand) */}
        <svg width="100%" height="100%" viewBox="0 0 400 1000" style={{ overflow: 'visible', position: 'absolute', top: 0, left: 0, zIndex: 10 }}>
          
          {/* 🧠 THE BRAIN - Only render if brain layer is enabled */}
          {activeLayers.brain && (
            <>
              <g stroke="rgba(255, 255, 255, 0.6)" strokeWidth="2.5" style={{ filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.8))' }}>
                <line x1={f1x} y1={f1y} x2="260" y2="720" /> {/* Index String - Reversed X to untangle */}
                <line x1={f2x} y1={f2y} x2="220" y2="710" /> {/* Middle String - Reversed X to untangle */}
                <line x1={f3x} y1={f3y} x2="180" y2="710" /> {/* Ring String - Reversed X to untangle */}
                <line x1={f4x} y1={f4y} x2="140" y2="720" /> {/* Pinky String - Reversed X to untangle */}
              </g>

              {/* 🧠 THE STATIONARY BRAIN (Moved Down to 700) */}
              <g 
                transform={`translate(100, 700) scale(${8 + Math.sin(frame/20)*0.2})`} 
                style={{ filter: `drop-shadow(0px 0px 4px ${brainColor}) drop-shadow(0px 0px 15px ${brainColor})` }}
                stroke={brainColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"
              >
                <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/>
                <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/>
                <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/>
                <path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/>
                <path d="M6.002 6.5A3 3 0 0 1 5.603 5.125"/>
                <path d="M11.8 12a1 1 0 0 0-1.6 0"/>
              </g>
            </>
          )}
        </svg>

        {/* 🖐️ THE RIGGED HAND CONTAINER - Only render if hand layer is enabled */}
        {activeLayers.hand && (
        <div style={{
          position: 'absolute', left: `${pivotX}px`, top: `${pivotY}px`,
          width: `${handSize * 2}px`, height: `${handSize}px`,
          zIndex: 30, pointerEvents: 'none',
          transform: `translate(0, -50%) rotate(${totalAngle}rad)`, 
          transformOrigin: '0% 50%', 
          filter: `drop-shadow(0 20px 20px rgba(0,0,0,0.8)) drop-shadow(0 0 15px ${color}55)` 
        }}>
          
          {/* THE PALM */}
          <img src={palmImage} style={{ position: 'absolute', top: `${palmY}%`, left: `${palmX}%`, width: `${palmSize}%`, zIndex: 20 }} alt="Palm" />

          {/* INDEX FINGER (Top) */}
          <img src={finger1Image} style={{ 
            position: 'absolute', top: `${f1Y}%`, left: `${f1X}%`, width: `${f1Size}%`, 
            transformOrigin: '0% 50%', transform: `rotate(${finger1Rot + f1Rad}rad)`, zIndex: 10 
          }} alt="Index" />

          {/* MIDDLE FINGER */}
          <img src={finger2Image} style={{ 
            position: 'absolute', top: `${f2Y}%`, left: `${f2X}%`, width: `${f2Size}%`, 
            transformOrigin: '0% 50%', transform: `rotate(${finger2Rot + f2Rad}rad)`, zIndex: 30 
          }} alt="Middle" />

          {/* RING FINGER */}
          <img src={finger3Image} style={{ 
            position: 'absolute', top: `${f3Y}%`, left: `${f3X}%`, width: `${f3Size}%`, 
            transformOrigin: '0% 50%', transform: `rotate(${finger3Rot + f3Rad}rad)`, zIndex: 40 
          }} alt="Ring" />

          {/* PINKY FINGER (Bottom) */}
          <img src={finger4Image} style={{ 
            position: 'absolute', top: `${f4Y}%`, left: `${f4X}%`, width: `${f4Size}%`, 
            transformOrigin: '0% 50%', transform: `rotate(${finger4Rot + f4Rad}rad)`, zIndex: 50 
          }} alt="Pinky" />

        </div>
        )}

      </div>

      {/* --- ✍️ THE KINETIC TEXT - Only render if text layer is enabled --- */}
      {activeLayers.text && (
      <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: '250px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center', width: 'max-content' }}>
          {chartData.map((item: any, index: number) => {
            const delay = index * 30; 
            const activeFrame = Math.max(0, frame - delay);
            const pop = spring({ frame: activeFrame, fps: 30, config: { stiffness: 90, damping: 16 } });
            const isHighlight = item.value === 1;
            const scale = isHighlight ? interpolate(pop, [0, 1], [2.5, 1]) : interpolate(pop, [0, 1], [0.5, 1]); 
            const tracking = isHighlight ? interpolate(activeFrame, [0, 30], [250, 0], { extrapolateRight: 'clamp' }) : 0;
            let swapBlur = 0;
            if (isHighlight) {
               if (activeFrame > 12 && activeFrame < 18) swapBlur = interpolate(activeFrame, [12, 15, 18], [0, 12, 0]);
               if (activeFrame > 27 && activeFrame < 33) swapBlur = interpolate(activeFrame, [27, 30, 33], [0, 12, 0]);
            }
            const baseMotionBlur = isHighlight ? interpolate(pop, [0, 1], [15, 0], { extrapolateRight: 'clamp' }) : 0;
            const totalBlur = baseMotionBlur + swapBlur;
            const slideY = interpolate(pop, [0, 1], [60, 0]); 
            const opacity = interpolate(activeFrame, [0, 5], [0, 1], { extrapolateRight: 'clamp' });
            
            let numText = "";
            let wordText = item.label;

            if (isHighlight && item.label.toLowerCase().includes("10 powerful")) {
              if (activeFrame < 15) { numText = "8"; wordText = "Powerful"; }
              else if (activeFrame >= 15 && activeFrame < 30) { numText = "9"; wordText = "Powerful"; }
              else { numText = "10"; wordText = "Powerful"; }
            } else if (isHighlight) {
              const parts = item.label.split(" ");
              if (parts.length > 1 && !isNaN(Number(parts[0]))) {
                  numText = parts[0];
                  wordText = parts.slice(1).join(" ");
              }
            }

            const dynamicBigSize = customFontSize;
            const dynamicSmallSize = Math.max(35, Math.round(customFontSize * 0.35));
            const isTopText = !isHighlight && index < 1;
            const isBottomText = !isHighlight && index >= 2;
            const staggerX = isTopText ? -70 : (isBottomText ? 70 : 0);

            return (
              <div key={index} style={{
                transform: `translate(${staggerX}px, ${slideY}px) scale(${scale})`,
                opacity: opacity, filter: totalBlur > 0 ? `blur(${totalBlur}px)` : undefined, 
                fontSize: isHighlight ? `${dynamicBigSize}px` : `${dynamicSmallSize}px`, 
                fontWeight: isHighlight ? 800 : 600, color: isHighlight ? color : 'white', lineHeight: 1, 
                textShadow: isHighlight ? `0 10px 20px rgba(0,0,0,0.8), 0 0 50px ${color}, 0 0 90px ${color}` : '0 5px 15px rgba(0,0,0,0.9)',
                zIndex: 10, display: 'flex', alignItems: 'center', alignSelf: 'center', textAlign: 'center',
              }}>
                {!isHighlight ? (
                  <span style={{ letterSpacing: '-1px' }}>{item.label}</span>
                ) : (
                  <>
                    {numText && (
                      <span style={{ display: 'inline-block', width: '1.4em', textAlign: 'left', letterSpacing: '-2px', marginRight: '15px', flexShrink: 0 }}>
                        {numText}
                      </span>
                    )}
                    <span style={{ display: 'flex', flexDirection: 'row' }}>
                      {wordText.split('').map((char: string, charIdx: number) => (
                        <span key={charIdx} style={{ 
                          display: 'block', 
                          transform: `translateX(${tracking * charIdx}px)`, 
                          marginRight: charIdx !== wordText.length - 1 ? '-3px' : '0px',
                          whiteSpace: char === ' ' ? 'pre' : 'normal' /* ⚡ PRESERVES SPACES! */
                        }}>
                          {char}
                        </span>
                      ))}
                    </span>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

// --- 🎧 SCENE: FOCUS ---
export const FocusTemplate: React.FC<any> = ({
  activeLayers = { focus: true, text: true },
  backgroundMode = 'black', 
  color = "#00ff44",       
  fontFamily = "Montserrat",
  backgroundImage          
}) => {
  const frame = useCurrentFrame();

  const entrance = spring({ frame, fps: 30, config: { stiffness: 80, damping: 12 } });
  const graphicY = interpolate(entrance, [0, 1], [150, 0]); 
  const graphicOpacity = interpolate(entrance, [0, 1], [0, 1]);

  const focusFill = interpolate(frame, [0, 30], [0, 100], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const lineOffset = frame * -2; 

  return (
    <AbsoluteFill style={{ background: 'linear-gradient(180deg, #090c24 0%, #000000 100%)', overflow: 'hidden', fontFamily: fontFamily }}>
      
      {/* --- 🎧 THE FOCUS GRAPHIC --- */}
      <div style={{ 
        position: 'absolute', 
        top: '50%',    // ⚡ FIX: Automatically finds the vertical middle of the screen
        left: '50%',   // ⚡ FIX: Automatically finds the horizontal middle
        // ⚡ FIX: calc(-50% + graphicY) keeps it perfectly centered while still allowing the slide-up animation!
        transform: `translate(-50%, calc(-50% + ${graphicY}px))`,
        opacity: graphicOpacity,
        zIndex: 10,
        display: 'flex', flexDirection: 'column', alignItems: 'center'
      }}>
        
        {/* 1. FOCUS BAR + TOGGLE CONTAINER */}
        <div style={{ display: 'flex', alignItems: 'center', position: 'relative', width: '280px', justifyContent: 'center' }}>
            
            {/* The Main Focus Bar */}
            <div style={{
              width: '100%', height: '46px', border: '2px solid rgba(255,255,255,0.8)', 
              borderRadius: '30px', padding: '4px', position: 'relative',
              display: 'flex', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.8)'
            }}>
              <div style={{ 
                width: `${focusFill}%`, height: '100%', backgroundColor: color, 
                borderRadius: '25px', boxShadow: `0 0 20px ${color}`
              }} />
              <span style={{ 
                position: 'absolute', width: '100%', textAlign: 'center', 
                color: focusFill > 50 ? '#000' : '#fff',
                fontWeight: 800, fontSize: '18px', letterSpacing: '3px', zIndex: 2,
                textTransform: 'uppercase'
              }}>
                Focus
              </span>
            </div>

            {/* THE TOGGLE SWITCH */}
            <div style={{
                position: 'absolute',
                right: '-90px', 
                width: '60px',
                height: '30px',
                border: '2px solid rgba(255,255,255,0.8)',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                padding: '4px',
                justifyContent: 'flex-end',
            }}>
                <div style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    backgroundColor: color,
                    boxShadow: `0 0 10px ${color}` 
                }} />
            </div>
        </div>

        {/* 2. THE ANIMATED DOTTED LINE */}
        <svg width="200" height="220" viewBox="0 0 200 220" style={{ marginTop: '-5px', zIndex: 1 }}>
          <path 
            d="M 100 10 C 100 120, 50 150, 50 220" 
            fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="3" 
            strokeDasharray="8 8" strokeDashoffset={lineOffset} 
          />
          <circle cx="50" cy="210" r="5" fill={color} style={{ filter: `drop-shadow(0 0 8px ${color})` }} />
        </svg>

        {/* 3. YOUR UPLOADED IMAGE */}
        <div style={{ marginTop: '-30px', position: 'relative' }}>
          {backgroundImage ? (
            <img 
              src={backgroundImage} 
              style={{ 
                width: '500px',  
                height: '500px', 
                objectFit: 'contain',
                filter: `drop-shadow(0 0 40px ${color}33)` 
              }} 
            />
          ) : (
             <div style={{ color: 'rgba(255,255,255,0.3)', padding: '50px', border: '2px dashed rgba(255,255,255,0.2)', borderRadius: '20px', textAlign: 'center', marginTop: '20px' }}>
                Image will appear here
                          </div>
                       )}
                     </div>
                   </div>
                 </AbsoluteFill>
               );
             };
             
             export const FloatingBadgeCard: React.FC<any> = ({ 
               iconUrl = "https://cdn-icons-png.flaticon.com/512/2454/2454282.png", // Default money icon
               mainText = "₹18,000", 
               subText = "Starting Salary", 
               color = "#00e676", 
               fontFamily = "Montserrat" 
             }) => {
               const frame = useCurrentFrame();
               const { fps } = useVideoConfig();
             
               // 1. The bouncy entrance
               const pop = spring({ frame: Math.max(0, frame - 5), fps, config: { stiffness: 120, damping: 14 } });
               
               // 2. The continuous floating animation
               const floatY = Math.sin(frame / 15) * 15;
             
               return (
                 <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', fontFamily }}>
                   <div style={{
                     display: 'flex',
                     alignItems: 'center',
                     gap: '30px',
                     padding: '30px 50px',
                     borderRadius: '30px',
                     // 💎 Glassmorphism Effect
                     background: 'rgba(20, 20, 25, 0.65)',
                     backdropFilter: 'blur(20px)',
                     WebkitBackdropFilter: 'blur(20px)',
                     border: '2px solid rgba(255,255,255,0.1)',
                     boxShadow: `0 20px 50px rgba(0,0,0,0.5), inset 0 0 20px rgba(255,255,255,0.05)`,
                     transform: `scale(${pop}) translateY(${floatY}px)`,
                   }}>
                     
                     {/* The Icon */}
                     <div style={{ 
                       width: '100px', height: '100px', 
                       display: 'flex', justifyContent: 'center', alignItems: 'center',
                       background: `radial-gradient(circle, ${color}55 0%, transparent 70%)`
                     }}>
                       <Img src={iconUrl} style={{ width: '80px', height: '80px', objectFit: 'contain', filter: `drop-shadow(0 0 15px ${color})` }} />
                     </div>
             
                     {/* The Text */}
                     <div style={{ display: 'flex', flexDirection: 'column' }}>
                       <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '30px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '-5px' }}>
                         {subText}
                       </span>
                       <span style={{ color: 'white', fontSize: '70px', fontWeight: 900, textShadow: `0 5px 15px rgba(0,0,0,0.5)` }}>
                         {mainText}
                       </span>
                     </div>
             
                   </div>
                 </AbsoluteFill>
               );
             };
             
             export const ChatBubbleSequence: React.FC<any> = ({ 
               senderMessage = "App chal hi nahi raha!", 
               replyMessage = "Screen share karo please", 
               color = "#007AFF", // iMessage Blue
               fontFamily = "Montserrat" 
             }) => {
               const frame = useCurrentFrame();
               const { fps } = useVideoConfig();
             
               // 1. Left Bubble Animation (Pops at frame 10)
               const pop1 = spring({ frame: Math.max(0, frame - 10), fps, config: { stiffness: 150, damping: 15 } });
               
               // 2. Right Bubble Animation (Replies 1.5 seconds later at frame 55)
               const pop2 = spring({ frame: Math.max(0, frame - 55), fps, config: { stiffness: 150, damping: 15 } });
             
               return (
                 <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', fontFamily, padding: '0 100px' }}>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', width: '100%', maxWidth: '800px' }}>
                     
                     {/* Grey Sender Bubble (Left) */}
                     <div style={{ 
                       alignSelf: 'flex-start',
                       background: '#333333',
                       padding: '25px 45px',
                       borderRadius: '40px 40px 40px 10px',
                       boxShadow: '0 15px 30px rgba(0,0,0,0.4)',
                       transform: `scale(${pop1})`,
                       transformOrigin: 'bottom left'
                     }}>
                       <span style={{ color: 'white', fontSize: '45px', fontWeight: 600 }}>{senderMessage}</span>
                     </div>
             
                     {/* Colored Reply Bubble (Right) */}
                     <div style={{ 
                       alignSelf: 'flex-end',
                       background: color,
                       padding: '25px 45px',
                       borderRadius: '40px 40px 10px 40px',
                       boxShadow: `0 15px 30px ${color}66`,
                       transform: `scale(${pop2})`,
                       transformOrigin: 'bottom right'
                     }}>
                       <span style={{ color: 'white', fontSize: '45px', fontWeight: 600 }}>{replyMessage}</span>
                     </div>
             
                   </div>
                 </AbsoluteFill>
               );
             };
             
             export const StaggeredKineticList: React.FC<any> = ({ 
               items = ["Customer Success", "AI Data Collector", "Event Helper"], 
               color = "#F59E0B", // Bright Yellow/Orange
               fontFamily = "Montserrat" 
             }) => {
               const frame = useCurrentFrame();
               const { fps } = useVideoConfig();
             
               return (
                 <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'flex-start', paddingLeft: '80px', fontFamily }}>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '35px' }}>
                     
                     {items.map((item: string, index: number) => {
                       // Stagger the entrance of each list item by half a second (15 frames)
                       const popFrame = Math.max(0, frame - 15 - (index * 15));
                       const numPop = spring({ frame: popFrame, fps, config: { stiffness: 120, damping: 12 } });
                       
                       // Text slides out from the left AFTER the number drops
                       const textSlide = spring({ frame: Math.max(0, popFrame - 5), fps, config: { stiffness: 90, damping: 14 } });
             
                       return (
                         <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '20px', overflow: 'hidden' }}>
                           
                           {/* The Bold Number Block */}
                           <div style={{ 
                             minWidth: '90px', height: '90px', 
                             background: color, 
                             borderRadius: '20px',
                             display: 'flex', justifyContent: 'center', alignItems: 'center',
                             boxShadow: `0 10px 20px ${color}66`,
                             transform: `scale(${numPop})`,
                             zIndex: 2
                           }}>
                             <span style={{ color: '#000', fontSize: '55px', fontWeight: 900 }}>{index + 1}</span>
                           </div>
             
                           {/* The Text Revealing */}
                           <div style={{ 
                             background: 'rgba(0,0,0,0.7)', 
                             backdropFilter: 'blur(10px)',
                             padding: '20px 40px', 
                             borderRadius: '15px',
                             border: '1px solid rgba(255,255,255,0.1)',
                             transform: `translateX(${(1 - textSlide) * -100}%)`,
                             opacity: textSlide,
                             zIndex: 1
                           }}>
                             <span style={{ color: 'white', fontSize: '40px', fontWeight: 700 }}>{item}</span>
                           </div>
             
                         </div>
                       );
                     })}
             
                   </div>
                 </AbsoluteFill>
               );
             };

             export const BrowserSearchReveal: React.FC<any> = ({
               headerText = "Best AI Tools 2024",
               color = "#4285F4",
               fontFamily = "Montserrat"
             }) => {
               const frame = useCurrentFrame();
               const { } = useVideoConfig();

               // 1. Entrance Spring
               const entrance = spring({ frame, fps: 30, config: { stiffness: 100, damping: 15 } });

               // 2. Typing effect for the search query
               const typingSpeed = 2;
               const charactersToReveal = Math.floor(frame / typingSpeed);
               const revealedText = headerText.substring(0, charactersToReveal);

               // 3. Search Bar width and position
               const barWidth = 800;
               const barY = interpolate(entrance, [0, 1], [100, 0]);

               return (
                 <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', fontFamily }}>
                   {/* Google Logo (Simplified) */}
                   <div style={{
                     marginBottom: '50px',
                     fontSize: '120px',
                     fontWeight: 'bold',
                     opacity: entrance,
                     transform: `translateY(${barY}px)`,
                     display: 'flex'
                   }}>
                     <span style={{ color: '#4285F4' }}>G</span>
                     <span style={{ color: '#EA4335' }}>o</span>
                     <span style={{ color: '#FBBC05' }}>o</span>
                     <span style={{ color: '#4285F4' }}>g</span>
                     <span style={{ color: '#34A853' }}>l</span>
                     <span style={{ color: '#EA4335' }}>e</span>
                   </div>

                   {/* Search Bar */}
                   <div style={{
                     width: `${barWidth}px`,
                     height: '70px',
                     borderRadius: '35px',
                     border: '1px solid #dfe1e5',
                     backgroundColor: '#fff',
                     boxShadow: '0 1px 6px rgba(32,33,36,.28)',
                     display: 'flex',
                     alignItems: 'center',
                     padding: '0 30px',
                     fontSize: '28px',
                     color: '#202124',
                     opacity: entrance,
                     transform: `translateY(${barY}px)`
                   }}>
                     <span style={{ marginRight: '15px', color: '#9aa0a6' }}>🔍</span>
                     {revealedText}
                     {/* Cursor */}
                     {frame % 30 < 15 && <div style={{ width: '2px', height: '30px', backgroundColor: color, marginLeft: '2px' }} />}
                   </div>
                 </AbsoluteFill>
               );
             };

             export const OrbitingNodesGrid: React.FC<any> = ({
               centerText = "DEPARTMENTS",
               nodes = [
                 { label: "Marketing", iconUrl: "https://cdn-icons-png.flaticon.com/512/1998/1998087.png" },
                 { label: "Sales", iconUrl: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png" },
                 { label: "HR", iconUrl: "https://cdn-icons-png.flaticon.com/512/1256/1256661.png" },
                 { label: "Tech", iconUrl: "https://cdn-icons-png.flaticon.com/512/1005/1005141.png" }
               ],
               color = "#8B5CF6", // Purple glow
               fontFamily = "Montserrat"
             }) => {
               const frame = useCurrentFrame();
               const { fps } = useVideoConfig();

               // 1. The Center Node pops in first
               const centerPop = spring({ frame: Math.max(0, frame - 5), fps, config: { stiffness: 100, damping: 14 } });

               // 2. Slow continuous rotation for the entire orbit group
               const orbitRotation = frame * 0.5;

               return (
                 <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', fontFamily }}>

                   {/* THE SATELLITE NODES */}
                   <div style={{ position: 'absolute', transform: `rotate(${orbitRotation}deg)` }}>
                     {nodes.map((node: any, i: number) => {
                       // Delay each satellite shooting out
                       const nodePop = spring({ frame: Math.max(0, frame - 15 - (i * 5)), fps, config: { stiffness: 80, damping: 12 } });

                       // Math to calculate a perfect circle!
                       const angle = (i / nodes.length) * (Math.PI * 2);
                       const radius = interpolate(nodePop, [0, 1], [0, 320]); // Shoots out to 320px away

                       const x = Math.cos(angle) * radius;
                       const y = Math.sin(angle) * radius;

                       return (
                         <div key={i} style={{
                           position: 'absolute',
                           left: x, top: y,
                           transform: `translate(-50%, -50%) rotate(${-orbitRotation}deg) scale(${nodePop})`, // Counter-rotate so text stays upright!
                           display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px'
                         }}>
                           <div style={{
                             width: '110px', height: '110px',
                             background: 'rgba(20,20,25,0.8)',
                             backdropFilter: 'blur(10px)',
                             borderRadius: '50%',
                             border: `2px solid ${color}88`,
                             boxShadow: `0 10px 30px rgba(0,0,0,0.5), 0 0 20px ${color}44`,
                             display: 'flex', justifyContent: 'center', alignItems: 'center'
                           }}>
                             <Img src={node.iconUrl} style={{ width: '50px', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
                           </div>
                           <span style={{ color: 'white', fontSize: '32px', fontWeight: 800, textShadow: '0 5px 10px rgba(0,0,0,0.8)' }}>
                             {node.label}
                           </span>
                         </div>
                       );
                     })}
                   </div>

                   {/* THE CENTER NODE (Rendered last so it sits on top) */}
                   <div style={{
                     width: '240px', height: '240px',
                     background: color,
                     borderRadius: '50%',
                     display: 'flex', justifyContent: 'center', alignItems: 'center',
                     boxShadow: `0 0 50px ${color}88, inset 0 0 30px rgba(255,255,255,0.3)`,
                     transform: `scale(${centerPop})`,
                     zIndex: 10
                   }}>
                     <span style={{ color: 'white', fontSize: '36px', fontWeight: 900, textAlign: 'center', lineHeight: 1.1, textShadow: '0 5px 15px rgba(0,0,0,0.4)' }}>
                       {centerText.split(' ').join('\n')}
                     </span>
                   </div>

                 </AbsoluteFill>
               );
             };

// --- 🧠 MINDSET FLOW TEMPLATE ---
export const MindsetFlowTemplate: React.FC<any> = ({
  activeLayers = { images: true, text: true },
  backgroundMode = 'black', 
  // Passed from your editor!
  image1, image2, image3, bookImage,
  
  // Stagger/Size sliders
  img1Size = 380, img2Size = 380, img3Size = 380,
  img1Y = 0, img2Y = 0, img3Y = 0,
  
  // The custom colors from your editor boxes
  tintColor = "#00d4ff", 
  color = "#000080", // ⚡ NEW: Catches the "Scene Background Color" picker
  
  fontFamily = "Montserrat" 
}) => {
  const frame = useCurrentFrame();

  // --- 🎬 ANIMATION TIMELINE ---
  const img1Pop = spring({ frame: Math.max(0, frame - 5), fps: 30, config: { stiffness: 100, damping: 14 } });
  const img2Pop = spring({ frame: Math.max(0, frame - 10), fps: 30, config: { stiffness: 100, damping: 14 } });
  const img3Pop = spring({ frame: Math.max(0, frame - 15), fps: 30, config: { stiffness: 100, damping: 14 } });

  const brainPop = spring({ frame: Math.max(0, frame - 30), fps: 30, config: { stiffness: 120, damping: 12 } });

  // 🎥 THE CAMERA PAN (The Page Slides Up)
  const scrollAnim = spring({ frame: Math.max(0, frame - 55), fps: 30, config: { stiffness: 40, damping: 16 } });
  const scrollY = interpolate(scrollAnim, [0, 1], [-440, 500]); 

  // The Book Reveal
  const bookPop = spring({ frame: Math.max(0, frame - 65), fps: 30, config: { stiffness: 80, damping: 14 } });
  const bookY = interpolate(bookPop, [0, 1], [200, 0]);
  const bookRotate = interpolate(bookPop, [0, 1], [-25, 0]);

  // Dashed line marching effect
  const lineOffset = frame * -3;

  return (
    // ⚡ FIX: Uses the selected `color` prop to create a smooth gradient fading down into black
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${color} 0%, #000000 100%)`, overflow: 'hidden', fontFamily: fontFamily }}>
      
      {/* 🚀 THE SCROLLING CANVAS */}
      <div style={{
        position: 'absolute', width: '1080px', height: '2000px', top: 0, left: 0,
        transform: `translateY(${scrollY}px)` 
      }}>
        
        {/* --- 🧶 THE DASHED CONNECTING LINES --- */}
        <svg width="1080" height="2000" style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}>
          <g fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="4" strokeDasharray="12 12" strokeDashoffset={lineOffset}>
            {/* Left to Brain */}
            <path d={`M 240 ${1350 + img1Y} C 240 1100, 500 1100, 540 980`} style={{ opacity: img1Pop }} />
            {/* Center to Brain */}
            <path d={`M 540 ${1350 + img2Y} L 540 980`} style={{ opacity: img2Pop }} />
            {/* Right to Brain */}
            <path d={`M 840 ${1350 + img3Y} C 840 1100, 580 1100, 540 980`} style={{ opacity: img3Pop }} />
          </g>
          
          {/* Line from Brain up to Book */}
          <path d="M 540 850 L 540 600" 
                fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="4" 
                strokeDasharray="12 12" strokeDashoffset={lineOffset} 
                style={{ opacity: brainPop }} 
          />
        </svg>

        {/* --- 🖼️ THE 3 IMAGE SLOTS (Floating Cutout Tinting) --- */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 2 }}>
          
          {/* Mapping the three images using identical logic for cutout tinting */}
          {[1, 2, 3].map((num) => {
            const imgKey = `image${num}`;
            const sizeKey = `img${num}Size`;
            const yKey = `img${num}Y`;
            const popKey = `img${num}Pop`;
            
            // Map keys back to values
            const imageValue = { image1, image2, image3 }[imgKey];
            const sizeValue = { img1Size, img2Size, img3Size }[sizeKey];
            const yValue = { img1Y, img2Y, img3Y }[yKey];
            const popValue = { img1Pop, img2Pop, img3Pop }[popKey];
            const xValue = [0, 240, 540, 840][num]; // X-positions kept from prev version

            return (
              <div key={imgKey} style={{ 
                position: 'absolute', 
                top: `${1350 + yValue}px`, 
                left: `calc(${xValue}px - ${sizeValue / 2}px)`, 
                width: `${sizeValue}px`, 
                height: `${sizeValue}px`, 
                transform: `scale(${popValue})` 
              }}>
                {imageValue && (
                  <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                    
                    {/* ⚡ BASE IMAGE (GRAYSCALE): Provides the original subject details (shadows/highlights) */}
                    <img 
                      src={imageValue} 
                      style={{ 
                        width: '100%', height: '100%', 
                        objectFit: 'contain', 
                        filter: 'grayscale(100%) brightness(0.9) contrast(1.1)' 
                      }} 
                    />
                    
                    {/* ⚡ 🍪 THE CUTOUT TINT OVERLAY: Uses CSS Masking */}
                    <div style={{
                      position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                      backgroundColor: tintColor, // Applies the color from your editor
                      
                      // ⚡ THE MAGIC: This sets the uploaded image AS THE MASK
                      // Only areas that are opaque in the image will show the tintColor!
                      maskImage: `url(${imageValue})`, 
                      WebkitMaskImage: `url(${imageValue})`, // Safari/Chrome support
                      
                      maskSize: 'contain', // Must match the img objectFit
                      WebkitMaskSize: 'contain',
                      maskRepeat: 'no-repeat', 
                      WebkitMaskRepeat: 'no-repeat',
                      maskPosition: 'center', // Must match img positioning
                      WebkitMaskPosition: 'center',

                      // 'mixBlendMode: color' applies the hue perfectly without crushing blacks/whites
                      mixBlendMode: 'color', 
                      zIndex: 1, // Sits on top of the grayscale image
                    }} />
                  </div>
                )}
              </div>
            );
          })}

        </div>

        {/* --- 🧠 THE CLEAN BRAIN ICON --- */}
        <div style={{ 
          position: 'absolute', top: '860px', left: '50%', transform: `translateX(-50%) scale(${brainPop})`, 
          zIndex: 3, backgroundColor: '#050505', padding: '20px', borderRadius: '50%'
        }}>
          <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/>
            <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/>
            <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/>
            <path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/>
            <path d="M6.002 6.5A3 3 0 0 1 5.603 5.125"/>
            <path d="M11.8 12a1 1 0 0 0-1.6 0"/>
          </svg>
        </div>

        {/* --- 📘 THE BOOK REVEAL --- */}
        <div style={{ 
          position: 'absolute', top: '150px', left: '50%', 
          transform: `translateX(-50%) translateY(${bookY}px) scale(${bookPop})`,
          opacity: bookPop, zIndex: 4, perspective: '1000px'
        }}>
          {bookImage && (
            <img 
              src={bookImage} 
              style={{ 
                width: '450px', height: 'auto', borderRadius: '15px',
                boxShadow: '-20px 30px 50px rgba(0,0,0,0.8)',
                transform: `rotateY(${bookRotate}deg) rotateX(10deg)` 
              }} 
            />
          )}
        </div>

      </div>
    </AbsoluteFill>
  );
};

// --- 🎞️ PANORAMIC REEL (Horizontal Slide) ---
export const PanoramicReelTemplate: React.FC<any> = ({ 
  chartData = [], 
  color = "#00d4ff", 
  fontFamily = "Montserrat",
  reelSpeed = 5 
}) => {
  const frame = useCurrentFrame();
  const { width, fps } = useVideoConfig();

  // 🛡️ Fallback data
  const items = chartData.length > 0 ? chartData : [
    { label: "VILLAGE", image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800" },
    { label: "CITY", image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800" },
    { label: "SITE", image: "https://images.unsplash.com/photo-1503387762-592dea58ef23?w=800" }
  ];

  // ⏱️ TIMING MATH
  // Speed slider now controls how many frames an image stays still.
  const framesPerSlide = Math.round(fps * (10 / (reelSpeed || 1))); 
  const index = Math.floor(frame / framesPerSlide);
  
  // 🎢 TRANSITION MATH (The last 10 frames of the duration)
  const transitionDuration = 10;
  const slideProgress = spring({
    frame: Math.max(0, (frame % framesPerSlide) - (framesPerSlide - transitionDuration)),
    fps,
    config: { stiffness: 100, damping: 20 }
  });

  // ⚡ ALIGNMENT FIX: offsetX is now strictly tied to the image width.
  // Each slide moves exactly 1 full 'width' unit.
  const offsetX = -((index + slideProgress) * width);

  return (
    <AbsoluteFill style={{ backgroundColor: '#000', overflow: 'hidden', fontFamily }}>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        height: '100%',
        width: 'max-content',
        transform: `translateX(${offsetX}px)`,
      }}>
        {items.map((item: any, i: number) => (
          <div key={i} style={{
            width: `${width}px`, // ⚡ Use the dynamic config width
            height: '100%',
            position: 'relative',
            flexShrink: 0,      // ⚡ Prevents browser from squeezing images
          }}>
            {item.image ? (
              <img src={item.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1f2937', color: '#6b7280', fontSize: '48px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                {item.label}
              </div>
            )}
            
            {/* ✍️ TEXT OVERLAY */}
            <div style={{
              position: 'absolute',
              bottom: '50px',
              left: '50px',
              color: 'white',
              fontSize: '60px',
              fontWeight: 900,
              textTransform: 'uppercase',
              textShadow: '0 4px 20px rgba(0,0,0,0.9)',
              borderLeft: `8px solid ${color}`,
              paddingLeft: '20px',
              // Fade out the text only during the slide
              opacity: i === index ? 1 - slideProgress : (i === index + 1 ? slideProgress : 0)
            }}>
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// --- 🎛️ 💠 COMPARISON PENTAGON TEMPLATE ---
export const ComparisonPentagonTemplate: React.FC<any> = ({ 
  headerText = "", 
  backgroundImage, 
  status = "neutral", 
  showPath = false,
  color = "#00d4ff", 
  fontFamily = "Montserrat" 
}) => {
  const frame = useCurrentFrame();
  const pop = spring({ frame, fps: 30, config: { stiffness: 100, damping: 15 } });
  
  // ⚡ Kinetic Entrance for the X/Checkmark
  const statusPop = spring({ frame: Math.max(0, frame - 10), fps: 30, config: { stiffness: 200, damping: 12 } });

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', fontFamily }}>
      <div style={{ position: 'relative', width: '600px', height: '600px', transform: `scale(${pop})` }}>
        {/* 💠 THE FRAME */}
        <svg viewBox="0 0 100 100" style={{ position: 'absolute', width: '100%', height: '100%', filter: `drop-shadow(0 0 20px ${status === 'correct' ? '#22c55e' : status === 'wrong' ? '#ef4444' : color})` }}>
          <polygon points="50,5 95,38 78,92 22,92 5,38" fill="#111" stroke={status === 'correct' ? '#22c55e' : status === 'wrong' ? '#ef4444' : color} strokeWidth="2" />
          <defs><clipPath id="pentagonClip"><polygon points="50,5 95,38 78,92 22,92 5,38" /></clipPath></defs>
        </svg>

        {/* 🖼️ THE IMAGE (Behind everything else) */}
        <div style={{ position: 'absolute', inset: '10px', clipPath: 'url(#pentagonClip)', WebkitClipPath: 'url(#pentagonClip)', zIndex: 1 }}>
          {backgroundImage ? <img src={backgroundImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', backgroundColor: '#222' }} />}
        </div>

        {/* ❌/✅ STATUS (Above everything else) */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 20, pointerEvents: 'none', transform: `scale(${statusPop})` }}>
          {status === "wrong" && <div style={{ fontSize: '380px', color: '#ef4444', fontWeight: 900, textShadow: '0 0 50px rgba(0,0,0,0.9)' }}>✕</div>}
          {status === "correct" && <div style={{ fontSize: '380px', color: '#22c55e', fontWeight: 900, textShadow: '0 0 50px rgba(0,0,0,0.9)' }}>✓</div>}
        </div>
      </div>
      <div style={{ marginTop: '40px', color: 'white', fontSize: '80px', fontWeight: 900, textTransform: 'uppercase' }}>{headerText}</div>
    </AbsoluteFill>
  );
};

// --- 🔄 PROCESS FLOW TEMPLATE (Circular Stage Transitions) ---
export const ProcessFlowTemplate: React.FC<any> = ({ 
  chartData = [], 
  color = "#00d4ff", 
  fontFamily = "Montserrat" 
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // 🛡️ Fallback for 3 stages
  const stages = chartData.length >= 3 ? chartData : [
    { label: "BRICKS", status: "neutral" },
    { label: "IRON", status: "wrong" },
    { label: "CEMENT", status: "correct" }
  ];

  // ⏱️ TIMING: 120 frames total. 40 frames per stage.
  const stageIndex = Math.min(2, Math.floor(frame / 40));
  const stageFrame = frame % 40;

  // 🎢 MOTION MATH: Circular Path Positions
  // P1: Left, P2: Top-Center, P3: Right
  const positions = [
    { x: width * 0.2, y: height * 0.3 },
    { x: width * 0.5, y: height * 0.15 },
    { x: width * 0.8, y: height * 0.3 }
  ];

  const pop = spring({ frame: stageFrame, fps: 30, config: { stiffness: 100 } });
  const pathDraw = interpolate(stageFrame, [10, 35], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', fontFamily }}>
      <svg width="100%" height="100%" style={{ position: 'absolute', overflow: 'visible' }}>
        {/* 🧶 Dotted Path 1 -> 2 */}
        {stageIndex >= 1 && (
          <path 
            d={`M ${positions[0].x} ${positions[0].y} Q ${width * 0.35} ${height * 0.1} ${positions[1].x} ${positions[1].y}`}
            fill="none" stroke="white" strokeWidth="4" strokeDasharray="10 10"
            strokeDashoffset={frame * -2} style={{ opacity: stageIndex === 1 ? pathDraw : 1 }}
          />
        )}
        {/* 🧶 Dotted Path 2 -> 3 */}
        {stageIndex >= 2 && (
          <path 
            d={`M ${positions[1].x} ${positions[1].y} Q ${width * 0.65} ${height * 0.1} ${positions[2].x} ${positions[2].y}`}
            fill="none" stroke="white" strokeWidth="4" strokeDasharray="10 10"
            strokeDashoffset={frame * -2} style={{ opacity: pathDraw }}
          />
        )}
      </svg>

      {/* 💠 RENDER CURRENT STAGE */}
      <div style={{ 
        position: 'absolute', 
        left: positions[stageIndex].x, 
        top: positions[stageIndex].y, 
        transform: `translate(-50%, -50%) scale(${pop})` 
      }}>
         {/* Stage Card with Status Icon */}
         <div style={{ width: '300px', height: '300px', border: `4px solid ${color}`, borderRadius: '20px', backgroundColor: '#111', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '40px', color: 'white', fontWeight: 900, position: 'relative' }}>
            {stages[stageIndex].label}
            {stages[stageIndex].status === "wrong" && <div style={{ position: 'absolute', color: '#ef4444', fontSize: '150px', fontWeight: 900, textShadow: '0 0 30px rgba(0,0,0,0.8)' }}>✕</div>}
            {stages[stageIndex].status === "correct" && <div style={{ position: 'absolute', color: '#22c55e', fontSize: '150px', fontWeight: 900, textShadow: '0 0 30px rgba(0,0,0,0.8)' }}>✓</div>}
         </div>
      </div>
    </AbsoluteFill>
  );
};

// --- ⬠ PENTAGON FLOW TEMPLATE (Pentagons in Circular Motion) ---
export const PentagonFlowTemplate: React.FC<any> = ({ 
  chartData = [], 
  color = "#00d4ff", 
  fontFamily = "Montserrat",
  framesPerStage = 150 // ⚡ Receives the slider value (Defaults to 150)
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  // 🛡️ Fallback Data
  const stages = chartData.length > 0 ? chartData : [
    { label: "EENT", status: "wrong" },
    { label: "LOHA", status: "wrong" },
    { label: "CEMENT", status: "correct" }
  ];

  const stageIndex = Math.min(stages.length - 1, Math.floor(frame / framesPerStage));
  const stageFrame = frame % framesPerStage;

  // 🗺️ WIDER WORLD COORDINATES: Pushed slightly further apart to give the camera breathing room
  const positions = [
    { x: 0, y: 0 },                                  // P0: Center
    { x: -width * 0.55, y: -height * 0.45 },         // P1: Top-Left
    { x: width * 0.45, y: -height * 0.85 },          // P2: Top-Right (Diagonal UP)
    { x: -width * 0.25, y: -height * 1.30 },         // P3: Keeps going UP if a 4th is added
  ];

  // 🎥 DYNAMIC TIMING (Scales automatically based on your speed slider)
  // Transition happens in the last 30% of whatever the duration is
  const transitionStart = Math.floor(framesPerStage * 0.7);
  // Status pops in at the 30% mark of the duration
  const statusDelay = Math.floor(framesPerStage * 0.3);
  const moveProgress = spring({
    frame: Math.max(0, stageFrame - transitionStart),
    fps,
    config: { stiffness: 70, damping: 18 } 
  });

  const currentP = positions[stageIndex] || positions[0];
  const nextP = positions[stageIndex + 1] || currentP;
  
  const cameraX = currentP.x + (nextP.x - currentP.x) * moveProgress;
  const cameraY = currentP.y + (nextP.y - currentP.y) * moveProgress;

  // ⚡ FIX: Reduced from 150 to 80 so it doesn't push the top of the pentagon off-screen
  const cameraOffsetY = 80; 

  return (
    <AbsoluteFill style={{ backgroundColor: '#000', overflow: 'hidden', fontFamily }}>
      
      {/* 🌌 PARALLAX BACKGROUND */}
      <AbsoluteFill style={{ transform: `translate(${-cameraX * 0.15}px, ${(-cameraY - cameraOffsetY) * 0.15}px)`, opacity: 0.4 }}>
        {[...Array(60)].map((_, i) => (
          <div key={i} style={{ position: 'absolute', left: `${(Math.abs(Math.sin(i * 55)) * 150) - 20}%`, top: `${(Math.abs(Math.cos(i * 77)) * 150) - 20}%`, width: '3px', height: '3px', backgroundColor: 'white', borderRadius: '50%', boxShadow: '0 0 10px white' }} />
        ))}
      </AbsoluteFill>

      {/* 🌍 THE WORLD CONTAINER */}
      <div style={{
        position: 'absolute',
        left: '50%', top: '50%', 
        width: 1, height: 1, overflow: 'visible',
        // ⚡ FIX: Apply the cameraOffsetY here to lift the entire scene up
        transform: `translate(${-cameraX}px, ${-cameraY - cameraOffsetY}px)`, 
      }}>

        {/* 🧶 DOTTED LINES & MASKS */}
        <svg style={{ position: 'absolute', overflow: 'visible' }}>
          <defs>
            {/* The mask is what makes the line "grow" exactly as the camera moves */}
            {stages.map((_: any, i: number) => {
              if (i >= stages.length - 1) return null;
              const p1 = positions[i];
              const p2 = positions[i+1];
              const len = Math.hypot(p2.x - p1.x, p2.y - p1.y);
              let progress = stageIndex > i ? 1 : (stageIndex === i ? moveProgress : 0);

              return (
                <mask id={`line-mask-${i}`} key={`mask-${i}`}>
                  <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="white" strokeWidth="30" strokeDasharray={len} strokeDashoffset={len * (1 - progress)} strokeLinecap="round" />
                </mask>
              );
            })}
          </defs>

          {/* The actual visible dotted lines */}
          {stages.map((_: any, i: number) => {
            if (i >= stages.length - 1) return null;
            const p1 = positions[i];
            const p2 = positions[i+1];
            return (
              <line 
                key={`line-${i}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} 
                // ⚡ FIX: Increased strokeWidth to 8, and dash sizes to "40 25" (40px line, 25px gap)
                stroke="white" strokeWidth="8" strokeDasharray="40 25" 
                strokeDashoffset={frame * -5} 
                mask={`url(#line-mask-${i})`} strokeLinecap="round" 
              />
            );
          })}
        </svg>

        {/* 💠 THE PENTAGONS */}
        {stages.map((item: any, i: number) => {
          
          // ⚡ OVERLAP FIX: Hide future items AND completely unmount past items
          if (stageIndex < i) return null; 
          if (stageIndex > i) return null; 

          // 1. ENTRANCE: Pops in at the start of its own stage
          const entrance = spring({ frame: stageFrame, fps: 30, config: { stiffness: 120, damping: 14 } });
          
          // 2. EXIT: Shrinks exactly as the camera starts moving to the next item
          const exitFrame = Math.max(0, stageFrame - transitionStart);
          const exit = spring({ frame: exitFrame, fps: 30, config: { stiffness: 80, damping: 15 } });

          // The final visual scale of the pentagon
          const scale = entrance - exit;
          
          const statusScale = spring({ frame: Math.max(0, stageFrame - statusDelay), fps: 30, config: { stiffness: 180, damping: 12 } });

          return (
            <div key={i} style={{ 
              position: 'absolute', 
              left: positions[i].x, top: positions[i].y, 
              // ⚡ Apply the shrinking scale logic here
              transform: `translate(-50%, -50%) scale(${scale})`,
            }}>
              
              {/* ⚡ FIX: Reduced size from 800px to 750px to give it breathing room inside the frame */}
              <div style={{ position: 'relative', width: '750px', height: '750px' }}>
                
                {/* SVG Border (Unchanged, remains z-index 0) */}
                <svg viewBox="0 0 100 100" style={{ position: 'absolute', width: '100%', height: '100%', filter: `drop-shadow(0 0 40px ${item.status === 'correct' ? '#22c55e' : item.status === 'wrong' ? '#ef4444' : color})` }}>
                  <polygon points="50,5 95,38 78,92 22,92 5,38" fill="#000" stroke={item.status === 'correct' ? '#22c55e' : item.status === 'wrong' ? '#ef4444' : color} strokeWidth="3" />
                </svg>

                {/* 🖼️ CLIPPED IMAGE CONTAINER (⚡ THE FIX) */}
                <div style={{ 
                  position: 'absolute', 
                  inset: '5px', // Tiny inset so the image doesn't perfectly hide the border stroke
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  overflow: 'hidden',
                  zIndex: 1, // Above the border fill but below status icons

                  // cookie-cutter math matching the SVG polygon points
                  WebkitClipPath: 'polygon(50% 5%, 95% 38%, 78% 92%, 22% 92%, 5% 38%)',
                  clipPath: 'polygon(50% 5%, 95% 38%, 78% 92%, 22% 92%, 5% 38%)'
                }}>
                  {item.image && (
                    <img 
                      src={item.image} 
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover' // ⚡ Switched to cover so it fills the masked area nicely
                      }} 
                    />
                  )}
                </div>

                {/* ❌/✅ STATUS ICONS (Needs to be above clipped image, remains z-index 10) */}
                <div style={{ 
                  position: 'absolute', inset: 0, 
                  display: 'flex', justifyContent: 'center', alignItems: 'center', 
                  zIndex: 10, pointerEvents: 'none', 
                  transform: `scale(${statusScale})` 
                }}>
                  {item.status === "wrong" && <div style={{ fontSize: '500px', color: '#ef4444', fontWeight: 900, textShadow: '0 0 80px #000' }}>✕</div>}
                  {item.status === "correct" && <div style={{ fontSize: '500px', color: '#22c55e', fontWeight: 900, textShadow: '0 0 80px #000' }}>✓</div>}
                </div>
              </div>

              <div style={{ position: 'absolute', bottom: '-150px', width: '100%', textAlign: 'center', color: 'white', fontSize: '150px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '5px' }}>
                {item.label || "LABEL"}
              </div>
            </div>
          );
        })}

      </div>
    </AbsoluteFill>
  );
};

// --- 🎬 SCENE: TRIPLE SHOWCASE (3D Gallery with Inner Motion) ---
export const TripleShowcaseTemplate: React.FC<any> = ({ 
  cards = {
    slot1: { type: 'image', src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800' },
    slot2: { type: 'image', src: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800' },
    slot3: { type: 'image', src: 'https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=800' }
  },
  backgroundMode = 'black',
  sceneBgColor = "#f8f9fa"
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Set the dynamic background color
  const finalBgColor = backgroundMode === 'green' ? '#00FF00' : 
                       backgroundMode === 'transparent' ? 'transparent' : 
                       sceneBgColor;

  // --- 1. GLOBAL CAMERA FLOAT ---
  const globalFloatY = Math.sin(frame / 30) * 15;
  const globalRotateY = Math.sin(frame / 45) * 4;
  const globalRotateX = Math.cos(frame / 40) * 2;

  // --- 2. ENTRANCE ANIMATION ---
  const entrance = spring({ frame: Math.max(0, frame - 5), fps, config: { stiffness: 80, damping: 14 } });
  const scaleIn = interpolate(entrance, [0, 1], [0.8, 1]);

  // --- 3. INNER MEDIA MOTION ---
  const innerZoom = interpolate(frame, [0, 300], [1, 1.1], { extrapolateRight: 'clamp' });

  // Reusable component for the individual cards
  const ShowcaseCard = ({ 
    media, 
    xOffset, 
    yOffset, 
    rotation, 
    zIndex, 
    delay = 0 
  }: { media: any, xOffset: number, yOffset: number, rotation: number, zIndex: number, delay?: number }) => {
    
    const cardPop = spring({ frame: Math.max(0, frame - delay), fps, config: { stiffness: 100, damping: 12 } });
    const cardFloatY = Math.sin((frame + delay * 5) / 20) * 8;

    return (
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '320px',
        height: '560px',
        transform: `translate(calc(-50% + ${xOffset}px), calc(-50% + ${yOffset + cardFloatY}px)) rotate(${rotation}deg) scale(${cardPop})`,
        borderRadius: '24px',
        overflow: 'hidden',
        backgroundColor: '#ffffff',
        boxShadow: '0 30px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)',
        zIndex: zIndex,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{
          width: '100%',
          height: '100%',
          transform: `scale(${innerZoom})`,
          transformOrigin: 'center center'
        }}>
          {media.type === 'video' ? (
            <Video src={media.src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
          ) : (
            <Img src={media.src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          )}
        </div>
      </div>
    );
  };

  return (
    <AbsoluteFill style={{ backgroundColor: finalBgColor, overflow: 'hidden' }}>
      <AbsoluteFill style={{
        perspective: '1200px',
        transform: `scale(${scaleIn}) translateY(${globalFloatY}px) rotateY(${globalRotateY}deg) rotateX(${globalRotateX}deg)`,
        transformStyle: 'preserve-3d'
      }}>
        {cards.slot1 && <ShowcaseCard media={cards.slot1} xOffset={-200} yOffset={-120} rotation={-6} zIndex={1} delay={0} />}
        {cards.slot2 && <ShowcaseCard media={cards.slot2} xOffset={200} yOffset={-140} rotation={4} zIndex={1} delay={10} />}
        {cards.slot3 && <ShowcaseCard media={cards.slot3} xOffset={0} yOffset={220} rotation={0} zIndex={10} delay={20} />}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
