import { useCurrentFrame, useVideoConfig, spring, AbsoluteFill } from "remotion";

export const ViralCaptions = ({ captions }: { captions: any[] }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (!captions || captions.length === 0) return null;

  // AssemblyAI gives us time in milliseconds. We convert our current frame to milliseconds.
  const currentTimeMs = (frame / fps) * 1000;

  // Find the exact word being spoken right now
  const activeWord = captions.find(
    (w) => currentTimeMs >= w.start && currentTimeMs <= w.end
  );

  if (!activeWord) return null;

  // Convert the word's start time back into frames so we can trigger a bounce!
  const wordStartFrame = (activeWord.start / 1000) * fps;
  
  // Create a violent, snappy pop for every single word
  const pop = spring({
    frame: frame - wordStartFrame,
    fps,
    config: { damping: 12, stiffness: 200 }
  });

  return (
    <AbsoluteFill style={{ 
      justifyContent: 'center', 
      alignItems: 'center', 
      top: '25%', // Places it in the upper-middle of the screen
      pointerEvents: 'none', 
      zIndex: 100 
    }}>
       <div style={{
         fontSize: '110px',
         fontWeight: 900,
         fontFamily: 'Montserrat, sans-serif',
         color: '#FFD700', // Viral Yellow
         textTransform: 'uppercase',
         
         // 🟢 THE FIX: Massive stroke, but drawn BEHIND the yellow fill!
         WebkitTextStroke: '18px black', 
         paintOrder: 'stroke fill', 
         
         textShadow: '0px 10px 30px rgba(0,0,0,0.9), 0px 0px 20px rgba(0,0,0,0.8)',
         textAlign: 'center',
         transform: `scale(${pop}) rotate(${(1-pop) * -10}deg)`,
       }}>
         {activeWord.text}
       </div>
    </AbsoluteFill>
  );
};
