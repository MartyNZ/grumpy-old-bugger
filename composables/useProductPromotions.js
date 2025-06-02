export const useProductPromotions = (product) => {
  const getMatchingPromotions = () => {
    if (!product?.promotedBy?.length) {
      return [];
    }

    const matchingPromotions = [];

    product.promotedBy.forEach((promotion) => {
      if (promotion.scope === "products") {
        matchingPromotions.push(promotion);
      } else if (
        promotion.scope === "collections" &&
        promotion.collections?.length
      ) {
        const productMatchesCollection = promotion.collections.some(
          (collection) => {
            return checkProductMatchesCollection(
              product,
              collection,
              promotion
            );
          }
        );

        if (productMatchesCollection) {
          matchingPromotions.push(promotion);
        }
      }
    });

    return matchingPromotions;
  };

  const checkProductMatchesCollection = (product, collection, promotion) => {
    // If we have collection rules, check against them
    if (collection.rules?.length) {
      return checkAgainstCollectionRules(product, collection);
    }

    // Enhanced matching: check both tags and title
    const collectionTitle = collection.title?.toLowerCase();

    // Check tags (existing logic)
    let tagMatch = false;
    if (product.store?.tags) {
      const productTags = product.store.tags
        .split(",")
        .map((tag) => tag.trim().toLowerCase());
      tagMatch = productTags.includes(collectionTitle);
    }

    // Also check product title for brand matching
    let titleMatch = false;
    if (product.store?.title) {
      const productTitle = product.store.title.toLowerCase();
      // Remove special characters for better matching
      const cleanProductTitle = productTitle.replace(/[®™©]/g, "");
      titleMatch = cleanProductTitle.includes(collectionTitle);
    }

    // Return true if either tags or title match
    return tagMatch || titleMatch;
  };

  const checkAgainstCollectionRules = (product, collection) => {
    if (!collection.rules?.length) return false;

    const disjunctive = collection.disjunctive || false;
    const ruleResults = collection.rules.map((rule) => {
      return checkSingleRule(product, rule);
    });

    return disjunctive
      ? ruleResults.some((result) => result)
      : ruleResults.every((result) => result);
  };

  const checkSingleRule = (product, rule) => {
    const value =
      rule.relation === "tags" ? rule.selectedTag : rule.selectedValue;
    if (!value || value.trim() === "") return false;

    switch (rule.relation) {
      case "tags":
        return checkTagRule(product, rule, value);
      case "title":
        return checkTitleRule(product, rule, value);
      case "featured":
        return checkFeaturedRule(product, rule, value);
      default:
        return false;
    }
  };

  const checkTagRule = (product, rule, value) => {
    if (!product.store?.tags) return false;

    const productTags = product.store.tags
      .split(",")
      .map((tag) => tag.trim().toLowerCase());
    const searchValue = value.toLowerCase();

    switch (rule.condition) {
      case "match":
        return productTags.some((tag) => tag.includes(searchValue));
      case "==":
        return productTags.includes(searchValue);
      case "startsWith":
        return productTags.some((tag) => tag.startsWith(searchValue));
      default:
        return false;
    }
  };

  const checkTitleRule = (product, rule, value) => {
    if (!product.store?.title) return false;

    const productTitle = product.store.title.toLowerCase();
    const searchValue = value.toLowerCase();

    switch (rule.condition) {
      case "match":
        return productTitle.includes(searchValue);
      case "==":
        return productTitle === searchValue;
      case "startsWith":
        return productTitle.startsWith(searchValue);
      default:
        return false;
    }
  };

  const checkFeaturedRule = (product, rule, value) => {
    const isFeatured = product.featured === true;
    const expectedFeatured = value === "true";
    return isFeatured === expectedFeatured;
  };

  const allPromotions = computed(() => {
    return getMatchingPromotions();
  });

  const productPromotions = computed(() => {
    return allPromotions.value.filter((promo) => promo.scope === "products");
  });

  const collectionPromotions = computed(() => {
    return allPromotions.value.filter((promo) => promo.scope === "collections");
  });

  return {
    productPromotions,
    collectionPromotions,
    allPromotions,
  };
};
