// Typing indicator with bouncing dots
const TypingIndicator: React.FC<{ color: string }> = ({ color }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{
      display: 'flex', gap: '5px', padding: '12px 18px', 
      backgroundColor: '#262d31', borderRadius: '20px 20px 20px 0', width: 'fit-content'
    }}>
      {[0, 1, 2].map((i) => {
        const bounce = Math.sin((frame / 3) - i) * 5; // 🎯 Creates the wave effect
        return (
          <div key={i} style={{
            width: '8px', height: '8px', backgroundColor: 'white', 
            borderRadius: '50%', transform: `translateY(${bounce}px)`, opacity: 0.6
          }} />
        );
      })}
    </div>
  );
};
import React from 'react';
import { spring, useVideoConfig, useCurrentFrame, AbsoluteFill } from 'remotion';

export const ChatTemplate: React.FC<any> = ({ chartData, color }) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end', padding: '100px 40px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '100%' }}>
        {chartData.map((msg: { label: string; value: number }, i: number) => {
          // 🎯 Stagger messages so they appear every 1.5 seconds (45 frames)
          const messageStartFrame = i * 45;
          const isTyping = frame > messageStartFrame - 15 && frame < messageStartFrame;
          const hasAppeared = frame >= messageStartFrame;
          const isMe = msg.value === 1;
          // Animate entrance only after message appears
          const entrance = hasAppeared ? spring({
            frame: frame - messageStartFrame,
            fps,
            config: { damping: 12 },
          }) : 0;

          return (
            <React.Fragment key={i}>
              {/* 🎯 Show dots only for the "Them" side before message appears */}
              {isTyping && msg.value === 0 && (
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <TypingIndicator color={color} />
                </div>
              )}
              {hasAppeared && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: isMe ? 'flex-end' : 'flex-start',
                    opacity: entrance,
                    transform: `translateY(${(1 - entrance) * 20}px) scale(${entrance})`,
                    transformOrigin: isMe ? 'right bottom' : 'left bottom',
                  }}
                >
                  <div style={{
                    maxWidth: '80%',
                    padding: '15px 20px',
                    borderRadius: isMe ? '20px 20px 0 20px' : '20px 20px 20px 0',
                    backgroundColor: isMe ? color : '#262d31',
                    color: 'white',
                    fontSize: '24px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                    position: 'relative'
                  }}>
                    {msg.label}
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
