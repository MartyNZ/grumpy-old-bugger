import { defineSitemapEventHandler } from '#imports'
import { generateSitemapUrls } from "~/server/utils/sitemap";

export default defineSitemapEventHandler(async (event) => {
  return generateSitemapUrls(event);
});
