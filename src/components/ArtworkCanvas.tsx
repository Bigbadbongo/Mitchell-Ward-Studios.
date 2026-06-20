import React from "react";
import { Artwork } from "../types";

interface ArtworkCanvasProps {
  artwork: Artwork;
  showTexture?: boolean;
}

// Map high-quality fine art photography assets matching our items
const PHOTOGRAPHY_IMAGE_MAP: Record<string, string> = {
  "yosemite-mists": "https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=900&q=80", // Yosemite Valley pine & mists
  "iceland-obsidian": "https://images.unsplash.com/photo-1504893524553-ac55fce698be?auto=format&fit=crop&w=900&q=80", // Black sand dunes of Iceland
  "death-valley-dune": "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=900&q=80", // Death Valley golden ridges
  "shibuya-lights": "https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&w=900&q=80", // Intense neon Shibuya Tokyo streets
  "lisbon-tiles": "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=900&q=80", // Patterned Portuguese architectural tile
  "montmartre-bistro": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=80", // Classic atmospheric rainy Paris street
};

export default function ArtworkCanvas({ artwork, showTexture = true }: ArtworkCanvasProps) {
  const isPhoto = artwork.category === "Photography";
  
  // Resolve photography source url or construct a premium fallback
  const getPhotoUrl = () => {
    if (PHOTOGRAPHY_IMAGE_MAP[artwork.imageSeed]) {
      return PHOTOGRAPHY_IMAGE_MAP[artwork.imageSeed];
    }
    // Fallback seed using Picsum with high quality
    return `https://picsum.photos/seed/${artwork.imageSeed || artwork.id}/800/800`;
  };

  // Render the generative paintings drawing path based on its visualType style
  const renderGenerativeArt = () => {
    const { primaryColor, secondaryColor, tertiaryColor, visualType } = artwork;

    switch (visualType) {
      case "geometric":
        return (
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Background Base */}
            <rect width="100%" height="100%" fill={tertiaryColor || "#FAF9F6"} />
            
            {/* Soft Warm Vignette */}
            <radialGradient id="geom-radial" cx="50%" cy="50%" r="70%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.1" />
            </radialGradient>
            <rect width="100%" height="100%" fill="url(#geom-radial)" style={{ mixBlendMode: "multiply" }} />

            {/* Geometry Blocks */}
            <circle cx="50%" cy="50%" r="35" fill={primaryColor} opacity="0.85" />
            <path d="M 15,85 L 85,85 L 50,20 Z" fill={secondaryColor} opacity="0.6" style={{ mixBlendMode: "multiply" }} />
            
            {/* Accent lines representing modern mid-century structure */}
            <rect x="25" y="48" width="50" height="4" fill={primaryColor} transform="rotate(-15 50 50)" />
            <line x1="10" y1="50" x2="90" y2="50" stroke={tertiaryColor} strokeWidth="1" strokeDasharray="2,2" />
            <line x1="50" y1="10" x2="50" y2="90" stroke="#1F2937" strokeWidth="0.5" opacity="0.4" />
            
            {/* Tiny accent offset dot */}
            <circle cx="70%" cy="30%" r="6" fill={secondaryColor} />
            <circle cx="70%" cy="30%" r="3" fill="#ffffff" />
          </svg>
        );

      case "cosmic":
        return (
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Stellar Background */}
            <rect width="100%" height="100%" fill={primaryColor || "#09090E"} />
            
            {/* Luminous Nebula Radial Glares */}
            <defs>
              <radialGradient id="nebula-a" cx="35%" cy="40%" r="55%">
                <stop offset="0%" stopColor={secondaryColor} stopOpacity="0.8" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="nebula-b" cx="70%" cy="65%" r="45%">
                <stop offset="0%" stopColor={tertiaryColor} stopOpacity="0.75" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#nebula-a)" style={{ mixBlendMode: "screen" }} />
            <rect width="100%" height="100%" fill="url(#nebula-b)" style={{ mixBlendMode: "color-dodge" }} />

            {/* Star fields/sparkles */}
            <circle cx="20" cy="15" r="0.8" fill="#fff" opacity="0.9" />
            <circle cx="85" cy="40" r="1.2" fill="#fff" opacity="0.8" />
            <circle cx="45" cy="80" r="0.6" fill="#fff" opacity="0.5" />
            <circle cx="60" cy="25" r="0.5" fill="#fff" opacity="0.7" />
            <circle cx="15" cy="65" r="1" fill="#fff" opacity="0.6" />
            
            {/* Infinite swirl */}
            <path d="M 25,25 Q 40,50 55,45 T 75,75" stroke="#FFFFFF" strokeWidth="0.5" fill="none" opacity="0.25" strokeLinecap="round" />
            <circle cx="55" cy="45" r="2.5" fill="#ffffff" opacity="0.4" className="animate-pulse" />
          </svg>
        );

      case "fluid":
        return (
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Soft backdrop */}
            <rect width="100%" height="100%" fill={secondaryColor || "#FFFDF9"} />
            
            {/* Flowing liquid marble paths */}
            <path d="M-10,40 C 20,25 40,70 70,50 C 90,30 110,45 110,110 L-10,110 Z" fill={primaryColor} opacity="0.8" />
            <path d="M-10,60 C 30,50 45,90 75,70 C 95,55 110,65 110,110 L-10,110 Z" fill={tertiaryColor} opacity="0.65" style={{ mixBlendMode: "multiply" }} />
            
            {/* Highlights and floating organic specks */}
            <path d="M 12,30 C 25,20 40,40 55,15" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.4" />
            <circle cx="30" cy="75" r="4" fill={secondaryColor} opacity="0.7" />
            <circle cx="85" cy="85" r="2.5" fill="#ffffff" opacity="0.6" />
          </svg>
        );

      case "botanical":
        return (
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Earthen Matte base */}
            <rect width="100%" height="100%" fill={secondaryColor || "#FAF7F2"} />
            
            {/* Organic rounded clay shapes */}
            <circle cx="50" cy="72" r="22" fill={primaryColor} opacity="0.15" />
            <path d="M 10,95 Q 40,65 80,95 Z" fill={primaryColor} opacity="0.2" />

            {/* Fine hand-drawn charcoal branches */}
            <path d="M 50,95 Q 48,60 35,32 T 20,15" stroke="#1C1917" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.75" />
            <path d="M 46,65 Q 60,45 78,35" stroke="#1C1917" strokeWidth="0.8" strokeLinecap="round" fill="none" opacity="0.65" />
            
            {/* Sprouting Sage and Golden Buds */}
            <ellipse cx="20" cy="15" rx="3" ry="5" fill={primaryColor} transform="rotate(-30 20 15)" opacity="0.9" />
            <ellipse cx="35" cy="32" rx="2.5" ry="4" fill={primaryColor} transform="rotate(15 35 32)" opacity="0.9" />
            <ellipse cx="78" cy="35" rx="3.5" ry="2" fill={tertiaryColor} transform="rotate(-15 78 35)" opacity="0.9" />
            <circle cx="58" cy="48" r="3" fill={tertiaryColor} opacity="0.95" />
            <circle cx="43" cy="78" r="2" fill="#1C1917" opacity="0.5" />
          </svg>
        );

      case "minimalist":
      default:
        return (
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Clean warm paper */}
            <rect width="100%" height="100%" fill={tertiaryColor || "#FAF9F6"} />
            
            {/* Focal asymmetric segment */}
            <rect x="0" y="55" width="100" height="45" fill={primaryColor} opacity="0.1" />
            
            {/* Bold singular textured disk */}
            <circle cx="50%" cy="45%" r="18" fill={primaryColor} />
            
            {/* Offsetting graphic stripe */}
            <line x1="20" y1="20" x2="80" y2="80" stroke={secondaryColor} strokeWidth="1.6" strokeLinecap="round" />
            <line x1="50" y1="20" x2="50" y2="35" stroke="#1F2937" strokeWidth="0.5" opacity="0.6" />
            
            {/* Elegant raw typography coordinate label */}
            <text x="5" y="93" fontSize="2.8" fontFamily="monospace" fill="#78716C" letterSpacing="0.2">
              43°46'N, 11°15'E
            </text>
          </svg>
        );
    }
  };

  return (
    <div className="w-full h-full relative overflow-hidden bg-white flex items-center justify-center select-none">
      {/* 1. Underlying Abstract Painting Render or Photography Image */}
      {artwork.customImage ? (
        <img
          src={artwork.customImage}
          alt={artwork.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-all duration-700 ease-out"
        />
      ) : isPhoto ? (
        <img
          src={getPhotoUrl()}
          alt={artwork.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-all duration-700 ease-out"
        />
      ) : (
        renderGenerativeArt()
      )}

      {/* 2. Premium Fine-Art Texture Overlays */}
      {showTexture && (
        <>
          {/* Subtle Canvas Linen/Paper Weave Overlay */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-22 mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath d='M1 3h1v1H1V3zm2-2h1v1H3V1z' fill='%23000000' fill-opacity='.15' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            }}
          />
          {/* Studio Gesso Glaze effect */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-black/5 via-transparent to-white/10 mix-blend-multiply" />
        </>
      )}
    </div>
  );
}
