export default function FadeEffect({
    color = '#FDECE1',
    position = 'absolute',
    width = '300px',
    height = '300px',
    top,
    bottom,
    left,
    right,
    opacity = 0.6,
    blur = '60px',
    zIndex = 1,
    className = '',
  }) {
    const positionStyles = {
      position,
      width,
      height,
      top,
      bottom,
      left,
      right,
      zIndex,
    };
  
    return (
      <div
        className={`pointer-events-none ${className}`}
        style={{
          ...positionStyles,
          background: `radial-gradient(circle, ${color} 0%, transparent 80%)`,
          filter: `blur(${blur})`,
          opacity,
        }}
      />
    );
  }
  