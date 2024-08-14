import generateSlug from "~/utilities/generateSlug";

export function createTagsLookup(productTags) {
  // Initialize tagsLookup as an empty object
  const tagsLookup = {};

  // Iterate through each item in productTags
  productTags.forEach((item) => {
    // Split the tags string into an array
    const tags = item.tags.split(", ");

    // Iterate through each tag in the array
    tags.forEach((tag) => {
      // If the tag is not an empty string
      if (tag !== "") {
        // Slugify the tag by converting it to lowercase, removing single quotes, and replacing whitespace with hyphens
        const slug = generateSlug(tag);

        // If the slug does not exist in tagsLookup, add it with the original tag as the value
        if (!tagsLookup[slug]) {
          tagsLookup[slug] = tag;
        }
      }
    });
  });

  return tagsLookup;
}

export default createTagsLookup;
