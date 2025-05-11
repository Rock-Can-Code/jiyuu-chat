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
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: '8.25rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    fontFamily: "'Yuji Mai'",
    '@media (maxWidth: 768px)': {
      fontSize: '4rem',
    },
  },
  image: {
    maxWidth: '40%',
    maxHeight: '40%',
    '@media (maxWidth: 768px)': {
      maxWidth: '70%',
      maxHeight: '70%',
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
        <div style={welcomeMessageStyles.textContainer as React.CSSProperties}>
          <span>自</span>
          <span>由</span>
        </div>
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
