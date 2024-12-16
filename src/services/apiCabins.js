import supabase, { supabaseUrl } from "./supabase";

export async function getCabins() {
  const { data, error } = await supabase.from("cabins").select("*");

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be loaded");
  }

  return data;
}

export async function createEditCabin(newCabin, id) {
  // Check if the image is already a valid URL (from Supabase)
  const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl);

  // If the image is already a URL, keep it; otherwise, generate a new image name
  const imageName = hasImagePath
    ? newCabin.image.split("/").pop() // Extract existing file name
    : `${Math.random()}-${newCabin.image.name}`.replaceAll("/", "");

  const imagePath = `${supabaseUrl}/storage/v1/object/public/avatars/${imageName}`;

  // 1. Create or Edit cabin
  let query = supabase.from("cabins");

  // A) Create
  if (!id) query = query.insert([{ ...newCabin, image: imagePath }]);

  // B) Edit
  if (id) {
    query = query
      .update({ ...newCabin, image: hasImagePath ? newCabin.image : imagePath })
      .eq("id", id);
  }

  const { data, error } = await query.select().single();

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be created/edited");
  }

  // 2. Upload the image (only if a new file was provided)
  if (hasImagePath) return data;

  if (!hasImagePath) {
    const { error: storageError } = await supabase.storage
      .from("avatars")
      .upload(imageName, newCabin.image);

    // 3. Delete the cabin IF there was an error uploading the image
    if (storageError) {
      if (!id) {
        // Only delete the cabin if it was a new creation
        await supabase.from("cabins").delete().eq("id", data.id);
      }
      console.error(storageError);
      throw new Error(
        "Cabins could not be uploaded and the cabin was not created"
      );
    }
  }

  return data;
}

export async function deleteCabin(id) {
  const { data, error } = await supabase.from("cabins").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be deleted");
  }

  return data;
}

export default getCabins;
