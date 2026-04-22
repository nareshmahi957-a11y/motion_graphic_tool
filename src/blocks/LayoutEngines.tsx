import React from 'react';

export type LayoutType = 
  | 'AbsoluteWorld' 
  | 'SplitScreen' 
  | 'GridSystem' 
  | 'PictureInPicture' 
  | 'CarouselFlex' 
  | 'RadialHub' 
  | 'StackOverlay' 
  | 'LowerThird' 
  | 'SidePanel' 
  | 'Waterfall';

export const LayoutEngine: React.FC<{
  type: LayoutType;
  children: React.ReactNode[];
  splitRatio?: number; // 1-99 (Used for SplitScreen & SidePanel)
  gap?: number;        // Spacing between elements
  radius?: number;     // Radius for RadialHub
}> = ({ 
  type, children, splitRatio = 50, gap = 20, radius = 300 
}) => {
  
  // Ensure children is always an array for mapping
  const items = React.Children.toArray(children);

  switch (type) {
    
    // 1. ABSOLUTE WORLD: Freeform canvas. (Assumes children have their own X/Y transforms applied via MotionPrimitives)
    case 'AbsoluteWorld':
      return (
        <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
          {items}
        </div>
      );

    // 2. SPLIT SCREEN: Top / Bottom split for Reels.
    case 'SplitScreen':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
          <div style={{ height: `${splitRatio}%`, width: '100%', position: 'relative', overflow: 'hidden' }}>
            {items[0]}
          </div>
          {/* Divider Line */}
          <div style={{ width: '100%', height: '4px', backgroundColor: '#ffffff', zIndex: 50 }} />
          <div style={{ height: `${100 - splitRatio}%`, width: '100%', position: 'relative', overflow: 'hidden' }}>
            {items[1]}
          </div>
        </div>
      );

    // 3. GRID SYSTEM: Auto-arranges 2, 3, 4, or more items into a perfect grid.
    case 'GridSystem':
      const cols = items.length > 4 ? 3 : 2;
      return (
        <div style={{ 
          display: 'grid', width: '100%', height: '100%', padding: gap, gap: gap,
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridAutoRows: '1fr'
        }}>
          {items.map((child, i) => (
            <div key={i} style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', borderRadius: '20px' }}>
              {child}
            </div>
          ))}
        </div>
      );

    // 4. PICTURE IN PICTURE: Item 1 is fullscreen, Item 2 is a small box in the corner.
    case 'PictureInPicture':
      return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <div style={{ position: 'absolute', inset: 0 }}>{items[0]}</div>
          {items[1] && (
            <div style={{ 
              position: 'absolute', bottom: '40px', right: '40px', 
              width: '30%', aspectRatio: '9/16', borderRadius: '24px', overflow: 'hidden',
              border: '4px solid white', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', zIndex: 10
            }}>
              {items[1]}
            </div>
          )}
        </div>
      );

    // 5. CAROUSEL FLEX: Horizontal row, centered.
    case 'CarouselFlex':
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: gap, width: '100%', height: '100%', padding: gap }}>
          {items.map((child, i) => (
            <div key={i} style={{ flex: 1, position: 'relative', height: '60%' }}>
              {child}
            </div>
          ))}
        </div>
      );

    // 6. RADIAL HUB: Centers Item 1, pushes everything else into a perfect circle around it.
    case 'RadialHub':
      return (
        <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Center Item */}
          <div style={{ position: 'absolute', zIndex: 10, width: '40%', height: '40%' }}>{items[0]}</div>
          {/* Orbiting Items */}
          {items.slice(1).map((child, i) => {
            const angle = (i / (items.length - 1)) * Math.PI * 2;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            return (
              <div key={i} style={{ 
                position: 'absolute', transform: `translate(${x}px, ${y}px)`, 
                width: '25%', height: '25%' 
              }}>
                {child}
              </div>
            );
          })}
        </div>
      );

    // 7. STACK OVERLAY: Everything layered perfectly on top of each other.
    case 'StackOverlay':
      return (
        <div style={{ display: 'grid', placeItems: 'center', width: '100%', height: '100%' }}>
          {items.map((child, i) => (
            <div key={i} style={{ gridArea: '1 / 1', width: '100%', height: '100%' }}>{child}</div>
          ))}
        </div>
      );

    // 8. LOWER THIRD: Anchors content strictly to the bottom 15% of the screen.
    case 'LowerThird':
      return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          {items[0]}
          <div style={{ position: 'absolute', bottom: gap, left: gap, right: gap, zIndex: 20 }}>
            {items.slice(1)}
          </div>
        </div>
      );

    // 9. SIDE PANEL: Horizontal split (e.g., 70% left, 30% right).
    case 'SidePanel':
      return (
        <div style={{ display: 'flex', width: '100%', height: '100%' }}>
          <div style={{ width: `${splitRatio}%`, height: '100%', position: 'relative' }}>{items[0]}</div>
          <div style={{ width: `${100 - splitRatio}%`, height: '100%', position: 'relative', padding: gap, backgroundColor: 'rgba(0,0,0,0.5)' }}>
            {items[1]}
          </div>
        </div>
      );

    // 10. WATERFALL: Vertical descending list.
    case 'Waterfall':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: gap, width: '100%', height: '100%', padding: gap, justifyContent: 'center' }}>
          {items.map((child, i) => (
            <div key={i} style={{ width: '100%', position: 'relative' }}>{child}</div>
          ))}
        </div>
      );

    default:
      return <>{children}</>;
  }
};
