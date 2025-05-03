export function generateSlug(tag) {
  return tag
    .toLowerCase()
    .replace(/&/g, "-and-")
    .replace(/'/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default generateSlug;
