import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase";

export const moveArtworkLocationService = async (
  artworkId: string,
  newCollection: string,
  newSubcategory: string
) => {
  await updateDoc(doc(db, "artworks", artworkId), {
    mainCollection: newCollection,
    subcategory: newSubcategory
  });
};

export const toggleArtworkStatusService = async (
  id,
  type,
  currentIsSold,
  currentIsVaulted
) => {
  const artDocRef = doc(db, "artworks", id);
  if (type === 'sold') {
    await updateDoc(artDocRef, { isSold: !currentIsSold });
  } else if (type === 'vault') {
    await updateDoc(artDocRef, { isVaulted: !currentIsVaulted });
  }
};

export const deleteArtworkService = async (id) => {
  await deleteDoc(doc(db, "artworks", id));
};
