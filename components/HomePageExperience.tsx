'use client';

import { useEffect, useState } from 'react';

import EditorialGallery from '@/components/EditorialGallery';
import HeroSection from '@/components/HeroSection';
import LoadingIntro from '@/components/LoadingIntro';
import ManifestoSection from '@/components/ManifestoSection';

export default function HomePageExperience() {
  const [isLoadingLeaving, setIsLoadingLeaving] = useState(false);
  const [isLoadingComplete, setIsLoadingComplete] = useState(false);
  const [isHeroExiting, setIsHeroExiting] = useState(false);
  const [isHeroComplete, setIsHeroComplete] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isHeroComplete ? '' : 'hidden';

    return () => {
      document.body.style.overflow = '';
    };
  }, [isHeroComplete]);

  const handleHeroEnded = () => {
    setIsHeroExiting(true);
  };

  const handleHeroExitComplete = () => {
    setIsHeroComplete(true);
  };

  return (
    <main className="relative min-h-screen bg-[#efeee9] text-[#171717]">
      {!isHeroComplete ? (
        <HeroSection
          isReady={isLoadingLeaving || isLoadingComplete}
          isExiting={isHeroExiting}
          onEnded={handleHeroEnded}
          onExitComplete={handleHeroExitComplete}
        />
      ) : null}

      {!isLoadingComplete ? (
        <LoadingIntro
          isExiting={isLoadingLeaving}
          onEnded={() => setIsLoadingLeaving(true)}
          onExitComplete={() => setIsLoadingComplete(true)}
        />
      ) : null}

      {isLoadingComplete ? (
        <EditorialGallery isActive={isHeroExiting || isHeroComplete} />
      ) : null}

      {isHeroComplete ? <ManifestoSection /> : null}
    </main>
  );
}
