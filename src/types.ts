export type ArtCategory = "Paintings" | "Photography";

export type ArtStyle = "Mini" | "Studio" | "Statement" | "Nature/Landscapes" | "Urban/Culture" | "AI";

export type VisualType = "geometric" | "cosmic" | "fluid" | "botanical" | "minimalist";

export type FrameType = "Black" | "White" | "Oak" | "None";

export interface Artwork {
  id: string;
  title: string;
  artist: string;
  description: string;
  medium: string;
  size: string;
  price: number;
  category: ArtCategory;
  style: ArtStyle;
  primaryColor: string;
  secondaryColor: string;
  tertiaryColor: string;
  visualType: VisualType;
  imageSeed: string; // fallback Picsum photo seed
  customImage?: string; // Base64 data URL or external URL for user-uploaded artworks
}

export interface BasketItem {
  id: string; // unique item instance ID
  artwork: Artwork;
  frame: FrameType;
  price: number;
}
