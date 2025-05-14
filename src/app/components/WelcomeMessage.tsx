import React from 'react';
import { ThemeImage } from './ThemeImage';
import { gsap } from 'gsap';

interface WelcomeMessageProps {
  showWelcomeMessage: boolean;
  welcomeMessageRef: React.RefObject<HTMLDivElement | null>;
}

const welcomeMessageStyles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: '10px',
  },
  image: {
    maxWidth: '40%',
    maxHeight: '40%',
    '@media (maxWidth: 768px)': {
      maxWidth: '120%',
      maxHeight: '120%',
    },
  },
};

export const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ showWelcomeMessage, welcomeMessageRef }) => {
  React.useEffect(() => {
    if (showWelcomeMessage) {
      gsap.fromTo(welcomeMessageRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
      );
    }
  }, [showWelcomeMessage, welcomeMessageRef]);

  return (
    <div ref={welcomeMessageRef} style={welcomeMessageStyles.container as React.CSSProperties}>
      {showWelcomeMessage && (
        <ThemeImage
          srcLight="/jiyuu-kanji-light.png"
          srcDark="/jiyuu-kanji-dark.png"
          alt="Jiyuu Logo"
          style={welcomeMessageStyles.image}
        />
      )}
      {showWelcomeMessage && (
        <ThemeImage
          srcLight="/jiyuu-light.png"
          srcDark="/jiyuu-dark.png"
          alt="Jiyuu Logo"
          style={welcomeMessageStyles.image}
        />
      )}
    </div>
  );
};
