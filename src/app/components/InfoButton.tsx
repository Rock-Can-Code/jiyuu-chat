import React, { useRef } from 'react';
import { BadgeInfo, Github, Globe, ExternalLink } from 'lucide-react';
import { gsap } from 'gsap';
import { useTranslations } from 'next-intl';

interface InfoButtonProps {
  isInfoVisible: boolean;
  toggleInfo: () => void;
}

export const InfoButton: React.FC<InfoButtonProps> = ({ isInfoVisible, toggleInfo }) => {
  const t = useTranslations('AboutPage');
  const infoRef = useRef(null);
  const githubIconRef = useRef<SVGSVGElement | null>(null);
  const rccIconRef = useRef<SVGSVGElement | null>(null);
  const githubLinkRef = useRef<HTMLAnchorElement | null>(null);
  const rccLinkRef = useRef<HTMLAnchorElement | null>(null);
  const infoTextRef = useRef(null);

  React.useEffect(() => {
    if (isInfoVisible) {
      gsap.to(infoRef.current, {
        x: 0,
        duration: 0.5,
        ease: "power2.out"
      });
      gsap.fromTo(infoTextRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", delay: 0.2 }
      );
    } else {
      gsap.to(infoRef.current, {
        x: -300,
        duration: 0.5,
        ease: "power2.in"
      });
    }
  }, [isInfoVisible]);

  React.useEffect(() => {
    const githubIcon = githubIconRef.current;
    const rccIcon = rccIconRef.current;
    const githubLink = githubLinkRef.current;
    const rccLink = rccLinkRef.current;

    if (!githubIcon || !rccIcon || !githubLink || !rccLink) {
      console.warn("One or more elements are null. Skipping event listener setup.");
      return;
    }

    gsap.set([githubLink, rccLink], { autoAlpha: 0 });

    const showLink = (icon: SVGSVGElement, link: gsap.TweenTarget) => {
      gsap.to(link, { autoAlpha: 1, x: 10, duration: 0.3 });
    };

    const hideLink = (link: gsap.TweenTarget) => {
      gsap.to(link, { autoAlpha: 0, x: 0, duration: 0.3 });
    };

    githubIcon.addEventListener('mouseenter', () => showLink(githubIcon, githubLink));
    githubIcon.addEventListener('mouseleave', () => hideLink(githubLink));
    rccIcon.addEventListener('mouseenter', () => showLink(rccIcon, rccLink));
    rccIcon.addEventListener('mouseleave', () => hideLink(rccLink));

    return () => {
      githubIcon.removeEventListener('mouseenter', () => showLink(githubIcon, githubLink));
      githubIcon.removeEventListener('mouseleave', () => hideLink(githubLink));
      rccIcon.removeEventListener('mouseenter', () => showLink(rccIcon, rccLink));
      rccIcon.removeEventListener('mouseleave', () => hideLink(rccLink));
    };
  }, []);

  return (
    <>
      <button
        onClick={toggleInfo}
        className="absolute top-4 left-4 bg-[var(--color-button-background-in)] text-[var(--color-text)] p-2 rounded-full shadow-lg z-50"
      >
        <BadgeInfo className="w-5 h-5 cursor-pointer" />
      </button>

      <div
        ref={infoRef}
        className="fixed top-0 left-0 w-64 bg-[var(--color-button-background-in)] text-[var(--color-text)] p-4 shadow-lg rounded-lg z-50 translate-x-[-300px]"
      >
        <button
          onClick={toggleInfo}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">{t('about')}</h2>
        <p ref={infoTextRef} className="mb-2">
          {t('description')}
        </p>
        <div className="flex items-center">
          <a
            href="https://github.com/Rock-Can-Code/jiyuu-chat"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github ref={githubIconRef} className="w-6 h-6 mr-2 cursor-pointer" />
          </a>
          <a
            ref={githubLinkRef}
            href="https://github.com/Rock-Can-Code/jiyuu-chat"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500"
          >
            {t("github")}
          </a>
        </div>
        <div className="flex items-center mt-2">
          <a
            href="https://rockcancode.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Globe ref={rccIconRef} className="w-6 h-6 mr-2 cursor-pointer" />
          </a>
          <a
            ref={rccLinkRef}
            href="https://rockcancode.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500"
          >
            {t("rock")}
          </a>
        </div>
        <a
          href="https://webgpureport.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center mt-2 text-gray-500 hover:text-gray-700"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          {t("check")}
        </a>
      </div>
    </>
  );
};
