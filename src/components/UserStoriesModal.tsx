import React, { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, BookOpen, Volume2, Hammer, Palette, Eye } from "lucide-react";

interface UserStoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface StorySlide {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  content: string;
  badge: string;
  colorScheme: string; // Tailwind bg-gradient
}

export default function UserStoriesModal({ isOpen, onClose }: UserStoriesModalProps) {
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);

  const slides: StorySlide[] = [
    {
      id: "slide-1",
      badge: "JOURNAL",
      title: "Harvesting the Palette",
      subtitle: "Chapter I: Mineral Pigments",
      icon: <Palette className="w-6 h-6 text-amber-600 animate-bounce" />,
      content: "All fine art paintings shown are hand-ground in the studio using raw ochre pigments harvested directly from soil beds in Tuscany, combined with crushed slate powder, oxidized copper paste, and genuine 24k gold leaf flakes.",
      colorScheme: "from-amber-500/10 via-amber-800/20 to-stone-900"
    },
    {
      id: "slide-2",
      badge: "CARPENTRY",
      title: "Built to Outlast Century",
      subtitle: "Chapter II: Signature Box Frames",
      icon: <Hammer className="w-6 h-6 text-orange-500" />,
      content: "Each floating shadowbox frame in Black, White, or toasted Oak is hand-joined by third-generation local carpenters. We preserve raw botanical knots and grain ridges, mounting each heavy-weight cotton canvas with an elegant floating spacer.",
      colorScheme: "from-orange-500/10 via-amber-900/20 to-stone-900"
    },
    {
      id: "slide-3",
      badge: "CHRONICLES",
      title: "The Silver Gelatin Standard",
      subtitle: "Chapter III: Baryta Photographic Emulsions",
      icon: <Eye className="w-6 h-6 text-blue-500" />,
      content: "Our photography works are pressed directly onto 310gsm baryta fibrous papers and sealed under state-of-the-art anti-static glass. This ensures deep obsidian black saturations and silver luster highlights that stay immaculate for generations.",
      colorScheme: "from-blue-500/10 via-indigo-900/20 to-slate-900"
    }
  ];

  // Self-advancing timer bar simulation (like real Instagram story panels!)
  useEffect(() => {
    if (!isOpen) return;
    
    // Reset slide progress whenever slide switches
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          // Switch to next slide
          setActiveIdx((curr) => {
            if (curr < slides.length - 1) {
              return curr + 1;
            } else {
              // Loop back or close? Let's loops back.
              return 0;
            }
          });
          return 0;
        }
        return prev + 1.2; // advance rate
      });
    }, 60);

    return () => clearInterval(interval);
  }, [isOpen, activeIdx]);

  if (!isOpen) return null;

  const current = slides[activeIdx];

  const handleNext = () => {
    if (activeIdx < slides.length - 1) {
      setActiveIdx(activeIdx + 1);
    } else {
      setActiveIdx(0);
    }
  };

  const handlePrev = () => {
    if (activeIdx > 0) {
      setActiveIdx(activeIdx - 1);
    } else {
      setActiveIdx(slides.length - 1);
    }
  };

  return (
    <div className="absolute inset-0 bg-[#0F172A] z-50 flex flex-col justify-between overflow-hidden font-sans select-none text-white transition-all duration-300">
      
      {/* Absolute top progress bars indicator */}
      <div className="absolute top-4 left-4 right-4 flex gap-1 z-20">
        {slides.map((s, idx) => (
          <div key={s.id} className="h-1 bg-white/20 flex-1 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-75"
              style={{
                width: idx < activeIdx ? "100%" : idx === activeIdx ? `${progress}%` : "0%"
              }}
            />
          </div>
        ))}
      </div>

      {/* Narrative Header */}
      <div className="p-4 pt-10 flex items-center justify-between bg-gradient-to-b from-[#0F172A]/80 to-transparent z-10">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#A78BFA]" />
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#C084FC]">
            STUDIO CHRONICLES
          </span>
        </div>
        <button
          id="close-stories-modal"
          onClick={onClose}
          className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Slide Carousel stage */}
      <div 
        className={`flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-b ${current.colorScheme} relative`}
      >
        {/* Clickable tap zones to skip left and right side */}
        <div className="absolute inset-y-0 left-0 w-1/4" onClick={handlePrev} />
        <div className="absolute inset-y-0 right-0 w-1/4" onClick={handleNext} />

        <div className="w-full max-w-[280px] text-center space-y-6 z-10 pointer-events-none animate-in fade-in zoom-in-95 duration-300">
          
          {/* Badge */}
          <span className="px-3 py-1 bg-white/10 backdrop-blur rounded-full text-[10px] tracking-widest font-mono text-[#D8B4FE]">
            {current.badge}
          </span>

          {/* Icon */}
          <div className="w-16 h-16 mx-auto bg-slate-900/90 border border-white/10 rounded-full flex items-center justify-center shadow-lg">
            {current.icon}
          </div>

          {/* Copy block */}
          <div className="space-y-2">
            <p className="text-xs uppercase font-mono tracking-widest text-slate-400">
              {current.subtitle}
            </p>
            <h2 className="text-xl font-bold font-sans tracking-tight text-white leading-snug">
              {current.title}
            </h2>
          </div>

          <p className="text-stone-300 text-xs leading-relaxed font-sans font-light">
            {current.content}
          </p>
        </div>
      </div>

      {/* Bottom control handles and indicators */}
      <div className="p-4 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between z-10">
        <button onClick={handlePrev} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-[10px] font-mono text-stone-400">
          Slide {activeIdx + 1} of {slides.length}
        </span>
        <button onClick={handleNext} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

    </div>
  );
}
