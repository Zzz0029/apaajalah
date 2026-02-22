"use client";

import { useEffect, useState } from "react";
import Preloader from "@/components/Preloader";
import SequenceScroll from "@/components/SequenceScroll";
import AboutSection from "@/components/AboutSection";
import InfiniteMarquee from "@/components/InfiniteMarquee";
import Projects from "@/components/Certifications";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import Lenis from "lenis";
import { AnimatePresence } from "motion/react";
import { DbSchema } from "@/lib/db";

export default function HomeClient({ dbData }: { dbData: DbSchema }) {
  const [isLoading, setIsLoading] = useState(true);

  // Initialize smooth scrolling with Lenis
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <main className="bg-black min-h-screen text-white w-full overflow-hidden">
      <AnimatePresence>
        {isLoading && <Preloader key="preloader" onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      {/* 
        Only render actual content once loading completes or animate them in.
        For scrollytelling we just hide scrollbar or unmount preloader 
      */}
      <div className={`transition-opacity duration-1000 ${isLoading ? "opacity-0 h-screen overflow-hidden" : "opacity-100"}`}>

        {/* Core Canvas Scrollytelling Section (500vh sticky) */}
        <SequenceScroll profile={dbData.profile} />

        {/* 
          Standard scroll sections 
        */}
        <div className="relative z-20 w-full bg-black flex flex-col pt-32 rounded-t-[3rem] border-t border-gray-900 shadow-[0_-20px_50px_rgba(0,0,0,1)]">
          <AboutSection profile={dbData.profile} />

          <InfiniteMarquee
            items={["PENETRATION TESTING", "BUG EXPLORATION", "VULNERABILITY RESEARCH", "SECURE DEVELOPMENT"]}
            direction="left"
            speed="normal"
          />

          <Projects
            certifications={[
              ...dbData.certifications.filter(c => c.pinned),
              ...dbData.certifications.filter(c => !c.pinned)
            ].slice(0, 3)}
            hallOfFame={[
              ...dbData.hallOfFame.filter(h => h.pinned),
              ...dbData.hallOfFame.filter(h => !h.pinned)
            ].slice(0, 2)}
          />

          <InfiniteMarquee
            items={["VULNERABILITY ASSESSMENT", "ZERO-DAY RESEARCH", "RED TEAMING", "THREAT MODELING"]}
            direction="right"
            speed="fast"
          />

          <ContactSection contact={dbData.contact} />

          <Footer profile={dbData.profile} contact={dbData.contact} />
        </div>

      </div>
    </main >
  );
}
