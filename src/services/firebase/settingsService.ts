import { doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

export const updateCategoryListService = async (isPaint, updatedList) => {
  await setDoc(doc(db, "settings", "studio_config"), { [isPaint ? 'paintCats' : 'photoCats']: updatedList }, { merge: true });
};

export const batchUpdateArtworkSubcategoryService = async (artworksToMove, newSubcategory) => {
  for (const art of artworksToMove) {
    await updateDoc(doc(db, "artworks", art.id), { subcategory: newSubcategory });
  }
};

export const updateStudioInfoService = async (bio, email) => {
  await setDoc(doc(db, "settings", "studio_config"), { bio, email }, { merge: true });
};

export const updatePhotoPricesService = async (updatedPrices) => {
  await setDoc(doc(db, "settings", "studio_config"), { photoPrices: updatedPrices }, { merge: true });
};

export const updateShippingConfigService = async (updatedConfig) => {
  await setDoc(doc(db, "settings", "studio_config"), { shippingConfig: updatedConfig }, { merge: true });
};
