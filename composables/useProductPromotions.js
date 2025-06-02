export const useProductPromotions = (product) => {
  const getMatchingPromotions = () => {
    if (!product?.promotedBy?.length) {
      return [];
    }

    const matchingPromotions = [];

    product.promotedBy.forEach((promotion) => {
      if (promotion.scope === "products") {
        // Direct product promotions always match
        matchingPromotions.push(promotion);
      } else if (
        promotion.scope === "collections" &&
        promotion.collections?.length
      ) {
        // Check if this product matches any of the promotion's collection rules
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

    // Fallback: check if product tags match collection title (legacy behavior)
    if (product.store?.tags) {
      const productTags = product.store.tags
        .split(",")
        .map((tag) => tag.trim().toLowerCase());
      const collectionTitle = collection.title?.toLowerCase();
      return productTags.includes(collectionTitle);
    }

    return false;
  };

  const checkAgainstCollectionRules = (product, collection) => {
    if (!collection.rules?.length) return false;

    const disjunctive = collection.disjunctive || false;
    const ruleResults = collection.rules.map((rule) => {
      const result = checkSingleRule(product, rule);
      // Only log if we're in development and want to debug
      if (process.env.NODE_ENV === "development") {
        console.log(
          `Rule check: ${rule.relation} ${rule.condition} "${
            rule.selectedTag || rule.selectedValue
          }" = ${result}`
        );
      }
      return result;
    });

    const finalResult = disjunctive
      ? ruleResults.some((result) => result)
      : ruleResults.every((result) => result);

    if (process.env.NODE_ENV === "development") {
      console.log(
        `Collection "${collection.title}" match result: ${finalResult} (${
          disjunctive ? "OR" : "AND"
        } logic)`
      );
    }

    return finalResult;
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
