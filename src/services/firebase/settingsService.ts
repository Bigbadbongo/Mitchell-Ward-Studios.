import { doc, setDoc, updateDoc, writeBatch } from "firebase/firestore";
import { db } from "../../firebase";
import { MainCollection } from "../../types";

export const saveTwoTierCollectionsService = async (
  category: "Paintings" | "Photography",
  collections: MainCollection[]
) => {
  const fieldKey = category === "Paintings" ? "paintingsCollections" : "photographyCollections";
  const legacyKey = category === "Paintings" ? "paintCats" : "photoCats";
  const flattenedSubs = Array.from(new Set(collections.flatMap(c => c.subGalleries.map(s => s.name))));

  await setDoc(
    doc(db, "settings", "studio_config"),
    {
      [fieldKey]: collections,
      [legacyKey]: flattenedSubs
    },
    { merge: true }
  );
};

export const batchUpdateArtworksService = async (
  artworksToUpdate: { id: string; changes: Record<string, any> }[]
) => {
  if (!artworksToUpdate || artworksToUpdate.length === 0) return;
  // Firestore batches have max 500 operations
  const chunkSize = 400;
  for (let i = 0; i < artworksToUpdate.length; i += chunkSize) {
    const chunk = artworksToUpdate.slice(i, i + chunkSize);
    const batch = writeBatch(db);
    for (const item of chunk) {
      batch.update(doc(db, "artworks", item.id), item.changes);
    }
    await batch.commit();
  }
};

export const updateCategoryListService = async (isPaint: boolean, updatedList: string[]) => {
  await setDoc(doc(db, "settings", "studio_config"), { [isPaint ? 'paintCats' : 'photoCats']: updatedList }, { merge: true });
};

export const batchUpdateArtworkSubcategoryService = async (artworksToMove: any[], newSubcategory: string) => {
  for (const art of artworksToMove) {
    await updateDoc(doc(db, "artworks", art.id), { subcategory: newSubcategory });
  }
};

export const updateStudioInfoService = async (bio, email, instagram = "", website = "") => {
  await setDoc(doc(db, "settings", "studio_config"), { bio, email, instagram, website }, { merge: true });
};

export const updatePhotoPricesService = async (updatedPrices) => {
  await setDoc(doc(db, "settings", "studio_config"), { photoPrices: updatedPrices }, { merge: true });
};

export const updateShippingConfigService = async (updatedConfig) => {
  await setDoc(doc(db, "settings", "studio_config"), { shippingConfig: updatedConfig }, { merge: true });
};
