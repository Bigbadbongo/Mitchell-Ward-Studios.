import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import imageCompression from "browser-image-compression";
import { db, storage } from "../../firebase";

export const uploadArtworkService = async ({
  selectedFile,
  selectedPrintFile,
  selectedSecondaryFile,
  uploadType,
  uploadWidth,
  uploadHeight,
  uploadUnit,
  uploadTitle,
  uploadDesc,
  uploadPrice,
  uploadCatName
}: any) => {
  let imageUrl = "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?auto=format&fit=crop&w=300&q=80";
  let thumbnailUrl = "";
  
  if (selectedFile) {
    const displayOptions = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true, fileType: "image/jpeg" };
    const compressedDisplay = await imageCompression(selectedFile, displayOptions);
    const displayRef = ref(storage, "studio/" + Date.now() + ".jpg");
    await uploadBytes(displayRef, compressedDisplay);
    imageUrl = await getDownloadURL(displayRef);

    const thumbOptions = { maxSizeMB: 0.1, maxWidthOrHeight: 600, useWebWorker: true, fileType: "image/jpeg" };
    const compressedThumb = await imageCompression(selectedFile, thumbOptions);
    const thumbRef = ref(storage, "studio/thumbnails/" + Date.now() + "_thumb.jpg");
    await uploadBytes(thumbRef, compressedThumb);
    thumbnailUrl = await getDownloadURL(thumbRef);
  }

  let highResUrl = "";
  if (uploadType === "Photography" && selectedPrintFile) {
    const extension = selectedPrintFile.name.split('.').pop() || "png";
    const fileRef = ref(storage, "print_originals/" + Date.now() + "_" + Math.random().toString(36).substring(7) + "." + extension);
    await uploadBytes(fileRef, selectedPrintFile);
    highResUrl = await getDownloadURL(fileRef);
  }

  let secondaryUrl = "";
  if (uploadType === "Paintings" && selectedSecondaryFile) {
    const extension = selectedSecondaryFile.name.split('.').pop() || "png";
    const fileRef = ref(storage, "studio_secondary/" + Date.now() + "_" + Math.random().toString(36).substring(7) + "." + extension);
    await uploadBytes(fileRef, selectedSecondaryFile);
    secondaryUrl = await getDownloadURL(fileRef);
  }

  const wVal = Number(uploadWidth) || 0;
  const hVal = Number(uploadHeight) || 0;
  const widthCm = uploadUnit === "m" ? wVal * 100 : wVal;
  const heightCm = uploadUnit === "m" ? hVal * 100 : hVal;
  
  const formattedSize = wVal > 0 && hVal > 0 
    ? `${uploadWidth}${uploadUnit} x ${uploadHeight}${uploadUnit}` 
    : (uploadType === "Photography" ? "Multiple Sizes" : "Unknown Size");

  await addDoc(collection(db, "artworks"), {
    title: uploadTitle || "Untitled Work", description: uploadDesc || "Fresh from the studio.",
    category: uploadType, subcategory: uploadCatName, src: imageUrl,
    thumbnailSrc: thumbnailUrl || imageUrl,
    highResSrc: highResUrl || null,
    secondarySrc: secondaryUrl || null,
    isSold: false, isVaulted: false,
    price: uploadType === "Paintings" ? Number(uploadPrice) || 0 : 0, 
    size: formattedSize,
    widthCm: widthCm || null,
    heightCm: heightCm || null,
    medium: uploadType === "Paintings" ? "Acrylic Canvas" : "Archival Print",
    timestamp: Date.now()
  });
};
