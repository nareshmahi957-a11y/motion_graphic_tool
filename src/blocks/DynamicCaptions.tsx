import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

interface WordTimestamp {
  text: string;
  start: number;
  end: number;
}

export const DynamicCaptions: React.FC<{ captions: WordTimestamp[] }> = ({ captions }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // 1. Convert the current video frame into milliseconds
  const currentTimeMs = (frame / fps) * 1000;

  // 2. Group words into phrases (chunks of 3)
  const CHUNK_SIZE = 3;
  const chunks: WordTimestamp[][] = [];
  for (let i = 0; i < captions.length; i += CHUNK_SIZE) {
    chunks.push(captions.slice(i, i + CHUNK_SIZE));
  }

  // 3. Find which chunk (phrase) we are currently in
  const currentChunk = chunks.find((chunk) => {
    const start = chunk[0].start;
    const end = chunk[chunk.length - 1].end;
    return currentTimeMs >= start && currentTimeMs <= end;
  });

  // If nobody is speaking, render nothing
  if (!currentChunk) return null;

  // 4. Calculate the exact frame this chunk started so we can animate the bounce
  const chunkStartFrame = (currentChunk[0].start / 1000) * fps;
  
  // 5. The OpusClip "Pop" Physics
  const pop = spring({
    frame: frame - chunkStartFrame,
    fps,
    config: { stiffness: 250, damping: 14 } // Bouncy but tight
  });

  // Scale from 50% to 100% on the pop
  const scale = interpolate(pop, [0, 1], [0.5, 1]);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '25%',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px',
        padding: '0 40px',
        transform: `scale(${scale})`, // Apply the physics!
      }}
    >
      {currentChunk.map((word, idx) => {
        // 6. The Highlighter Math: Is this specific word being spoken RIGHT NOW?
        const isSpeaking = currentTimeMs >= word.start && currentTimeMs <= word.end;

        return (
          <h1
            key={idx}
            style={{
              fontSize: isSpeaking ? '110px' : '90px', // The active word scales up slightly
              fontWeight: '900',
              fontFamily: 'sans-serif',
              color: isSpeaking ? '#fbbf24' : '#ffffff', // Viral Yellow vs White
              textTransform: 'uppercase',
              WebkitTextStroke: '4px black',
              textShadow: isSpeaking 
                ? '0px 10px 30px rgba(251, 191, 36, 0.6), 0px 10px 20px rgba(0,0,0,0.8)' 
                : '0px 10px 20px rgba(0,0,0,0.8)',
              margin: 0,
              lineHeight: 1.1,
              transition: 'all 0.1s ease-out', // Smoothly animate between highlighting words
            }}
          >
            {word.text}
          </h1>
        );
      })}
    </div>
  );
};
