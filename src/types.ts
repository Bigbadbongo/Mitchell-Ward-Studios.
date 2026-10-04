export type ArtCategory = "Paintings" | "Photography";

export type ArtStyle = "Mini" | "Studio" | "Statement" | "Nature/Landscapes" | "Urban/Culture" | "AI";

export type VisualType = "geometric" | "cosmic" | "fluid" | "botanical" | "minimalist";

export type FrameType = "Black" | "White" | "Oak" | "None";

export interface SubGallery {
  id: string;
  name: string;
}

export interface MainCollection {
  id: string;
  name: string;
  subGalleries: SubGallery[];
}

export interface Artwork {
  id: string;
  title: string;
  artist: string;
  description: string;
  medium: string;
  size: string;
  price: number;
  category: ArtCategory;
  mainCollection?: string;
  subcategory?: string;
  style: ArtStyle;
  primaryColor: string;
  secondaryColor: string;
  tertiaryColor: string;
  visualType: VisualType;
  imageSeed: string; // fallback Picsum photo seed
  customImage?: string; // Base64 data URL or external URL for user-uploaded artworks
  src?: string;
  thumbnailSrc?: string;
  isSold?: boolean;
  isVaulted?: boolean;
}

export interface BasketItem {
  id: string; // unique item instance ID
  artwork: Artwork;
  frame: FrameType;
  price: number;
}
