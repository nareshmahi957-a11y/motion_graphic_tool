import { useCurrentFrame, useVideoConfig, spring, Img } from 'remotion';

// 1. We tell TypeScript exactly what data to expect
interface AnimatedGraphicProps {
  imageUrl: string;
  text: string;
}

// 2. We apply that interface to our component props
export const AnimatedGraphic = ({ imageUrl, text }: AnimatedGraphicProps) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // This creates that smooth, bouncy "pop" effect
  const scale = spring({
    frame,
    fps,
    config: {
      damping: 12, // Lower number = more bouncy
      mass: 0.5,
    },
  });

  return (
    <div style={{
      position: 'absolute',
      top: '20%', 
      left: 0,
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      transform: `scale(${scale})`, // Applies the bounce!
      zIndex: 100,
    }}>
      {/* Glassmorphism Card */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        padding: '40px',
        borderRadius: '40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
      }}>
        <Img src={imageUrl} style={{ width: '180px', height: '180px', marginBottom: '20px' }} />
        <h1 style={{ 
          color: '#00e676',
          fontSize: '70px', 
          fontFamily: 'Inter, sans-serif',
          textTransform: 'uppercase',
          margin: 0
        }}>
          {text}
        </h1>
      </div>
    </div>
  );
};
