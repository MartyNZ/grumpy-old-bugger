<script setup>
const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
  defaultVariant: {
    type: Object,
    required: true,
  },
});
// console.log("Product: ", JSON.stringify(props.product, null, 2))

const collectionPromotions = props.product.promotedBy.filter((promo) => {
  return promo.scope === 'collections';
});

const collectionPromos = props.product.store.tags.split(",").reduce((acc, tag) => {
  const matchingPromos = collectionPromotions.filter((promo) => {
    return promo.collections.some((collection) => {
      return collection.title.toLowerCase() === tag.trim().toLowerCase();
    });
  });
  return acc.concat(matchingPromos);
}, []);

const productPromos = props.product.promotedBy.filter((promo) => {
  return promo.scope === 'products';
});
// if (productPromos.length > 0) {
//   console.log(JSON.stringify(props.product.store.title, null, 2), ": ", JSON.stringify(productPromos, null, 2))
// }

const selectedPromo = ref()
selectedPromo.value = productPromos[0] || collectionPromos[0];

// console.log("Selected Promotion: ", JSON.stringify(selectedPromo.value, null, 2));

const config = useRuntimeConfig();
// console.log("Published URL: ", JSON.stringify(config.public.publicUrl))

const selectedVariant = ref({});
selectedVariant.value = props.defaultVariant;
// console.log("Selected Variant: ", JSON.stringify(selectedVariant.value.id));

const selectedOptionsValuesIds = ref([]);
selectedOptionsValuesIds.value = selectedVariant.value.options.split(", ");
// console.log(
//   "Selected Options Values ID's: ",
//   JSON.stringify(selectedOptionsValuesIds.value),
// );

const validationUrl = ref("");
validationUrl.value = `${config.public.publicUrl}/api/printify/validate-sanity-product?id=${props.product._id}&vId=${selectedVariant.value.id}`;
// console.log("Validation URL on load: ", validationUrl.value);

watch(selectedVariant, () => {
  validationUrl.value = `${config.public.publicUrl}/api/printify/validate-sanity-product?id=${props.product._id}&vId=${selectedVariant.value.id}`;
  console.log("Validation URL: ", validationUrl.value);
});

const optionIdsArrays = props.product.store.variants.map((variant) =>
  variant.options.split(", "),
);

const flatOptionIdsArray = optionIdsArrays.flat();
const uniqueOptionIds = [...new Set(flatOptionIdsArray)];
// console.log("Unique Option Ids: ", uniqueOptionIds);
// Map over the options and filter the values array for each option
const activeOptions = props.product.store.options.map((option) => {
  return {
    ...option,
    values: option.values.filter((value) => uniqueOptionIds.includes(value.id)),
  };
});
// console.log("Active Options: ", activeOptions);

const selectedOptionsValues = ref([]);
selectedOptionsValues.value = activeOptions.map((option) => {
  return {
    ...option,
    values: option.values.filter((value) =>
      selectedOptionsValuesIds.value.includes(value.id),
    ),
  };
});
// console.log("Selected options: ", JSON.stringify(selectedOptionsValues.value));

const selectedValues = ref([]);
const selectedVariantOptions = ref();
selectedOptionsValues.value.map((option) => {
  option.values.map((value) => {
    selectedValues.value.push(value.title);
  });
  selectedVariantOptions.value = selectedValues.value.join(" / ");
});
// console.log(
//   "Selected Variant options: ",
//   JSON.stringify(selectedVariantOptions.value),
// );

watch(selectedOptionsValues, (newValues, oldValues) => {
  selectedValues.value = [];
  newValues.map((value) => {
    value.values.map((optionValue) => {
      selectedValues.value.push(optionValue.title);
    });
  });
  selectedVariantOptions.value = selectedValues.value.join(" / ");
  // console.log(
  //   "Selected Variant options: ",
  //   JSON.stringify(selectedVariantOptions.value),
  // );
});
// const variantStrings = props.product.store.variants.map((variant, index) => {
//   if (index === 0) {
//     return props.defaultVariant.title;
//   } else if (variant.id !== props.defaultVariant.id) {
//     const priceDifference = (variant.price - props.defaultVariant.price) / 100;
//     return `${variant.title}[+${priceDifference}]`;
//   }
// });

// const variantSelector = variantStrings.join("|");
// console.log("Variant Selector: ", variantSelector);

watch(selectedVariant, (newVariant, oldVariant) => {
  // console.log("Old Variant option Ids: ", JSON.stringify(oldVariant.options));
  // console.log("New Variant option Ids: ", JSON.stringify(newVariant.options));
  // Assuming newVariant.options is a string of option IDs separated by ", "
  const newVariantOptionIds = newVariant.options.split(", ");

  // Update the selectedOptionsValues array in place
  selectedOptionsValues.value = newVariantOptionIds.map((optionId) => {
    // Find the option that contains a value with an id === optionId
    const option = activeOptions.find((option) =>
      option.values.some((value) => value.id === optionId),
    );

    // If a matching option is found, create a new object with the same structure as the original option
    // but with the values array containing only the selected option value
    if (option) {
      const newOptionValue = option.values.find(
        (value) => value.id === optionId,
      );
      // console.log("New Option Value: ", JSON.stringify(newOptionValue));
      return {
        ...option,
        values: [newOptionValue], // Only include the selected option value in the values array
      };
    }

    // If no matching option is found, handle as needed
    // For example, you might want to return null or an empty object
    return console.error("This variant is currently out of stock");
  });
});

// Take the new selected option value and create the updateSelectedObjectAndVariant
const updateSelectedOptionAndVariant = (newOptionValueId) => {
  // console.log("New Selected Option ID: ", newOptionValueId);

  // Find the option that contains a value with an id === newOptionValueId
  const option = activeOptions.find((option) =>
    option.values.some((value) => value.id === newOptionValueId),
  );
  // console.log("Option with value to be updated: ", JSON.stringify(option));

  // Find the index of the value id currently in selectedOptionsValuesIds that is also an id on a value in option

  if (option) {
    // Find the index of the currently selected option's value in the selectedOptionsValuesIds array
    const optionValueIndex = selectedOptionsValuesIds.value.findIndex(
      (optionValueId) =>
        option.values.some((value) => value.id === optionValueId),
    );
    // console.log("optionValueIndex: ", optionValueIndex);

    if (optionValueIndex !== -1) {
      try {
        // Replace the currently selected option's value with the new one
        selectedOptionsValuesIds.value[optionValueIndex] = newOptionValueId;
        // console.log(
        //   "Updated Options Values ID's: ",
        //   JSON.stringify(selectedOptionsValuesIds.value),
        // );
      } catch (error) {
        console.error("Error updating selectedOptionsValues:", error);
      }
      // Update selectedOptionsValuesIds based on updated values
      selectedOptionsValuesIds.value = selectedOptionsValuesIds.value
        .map((optionValueId) => {
          // Find the option that contains a value with an id === optionValueId
          const option = activeOptions.find((option) =>
            option.values.some((value) => value.id === optionValueId),
          );

          // If a matching option is found, return the id of the first matching value
          if (option) {
            const matchingValue = option.values.find(
              (value) => value.id === optionValueId,
            );
            return matchingValue ? matchingValue.id : null;
          }

          // If no matching option is found, return null or handle as needed
          return;
        })
        .filter((id) => id !== null); // Filter out any null values

      // console.log(
      //   "New Selected Options Values Ids: ",
      //   JSON.stringify(selectedOptionsValuesIds.value),
      // );

      // and update selectedVariants based on the new selectedOptionsValuesIds
      const matchingVariant = props.product.store.variants.find((variant) => {
        // Assuming variant.options is a string of option IDs separated by ", "
        const variantOptionIds = variant.options.split(", ");
        // Check if all selectedOptionsValuesIds are included in the variant's options
        return selectedOptionsValuesIds.value.every((selectedOptionId) =>
          variantOptionIds.includes(selectedOptionId),
        );
      });

      if (matchingVariant) {
        // Update selectedVariant with the matching variant
        selectedVariant.value = matchingVariant;
        // console.log(
        //   "New Selected Variant: ",
        //   JSON.stringify(selectedVariant.value),
        // );
      } else {
        console.error("No matching variant found for the selected options.");
        return;
      }
    } else {
      // If the option is not found in the selectedOptionsValuesIds array, log it
      console.error("No matching option found.");
      return;
    }
  } else {
    console.error("No matching option found for the selected value.");
    return;
  }
};

const findSelectedOptionValue = (option) => {
  // console.log("Options for: ", JSON.stringify(option.type));

  // create an array of strings from the id of each value in the option.values array
  const optionValuesIds = option.values.map((value) => value.id);

  // console.log("optionValuesIds: ", JSON.stringify(optionValuesIds));
  // Find the values in optionValuesIds that are also in selectedOptionsValuesIds.value
  const matchingValue = optionValuesIds.filter((valueId) =>
    selectedOptionsValuesIds.value.includes(valueId),
  );

  // If there are matching values, return the first one (or handle as needed)
  if (matchingValue.length > 0) {
    return matchingValue[0]; // or handle as needed
  }
};

const variantImages = ref([]);
const currentImage = ref();
watchEffect(() => {
  const imagesForActiveVariant = selectedVariant.value.variantImages;
  variantImages.value = imagesForActiveVariant;
  currentImage.value = variantImages.value[0];
});

const quantity = ref(1);
const itemPrice = computed(() => selectedVariant.value.price / 100);
const totalPrice = computed(() => itemPrice.value * quantity.value);
const discountedPrice = computed(() => totalPrice.value * ((100 - selectedPromo.value.discount) / 100));
// console.log("selected Promo discount: ", JSON.stringify(selectedPromo.value.discount, null, 2));
// console.log("Discounted Price: ", discountedPrice.value);}

// console.log(JSON.stringify(props.product, null, 2));

const sizeCharts = defineAsyncComponent(
  () => import("~/components/product/sizeCharts.vue"),
);
const showSizeCharts = useDialog();
const openDialog = () => {
  const dialogRef = showSizeCharts.open(sizeCharts, {
    data: {
      productSizes: props.product.details.productSizes,
    },
    props: {
      header: "Size Charts",
      style: {
        width: "85vw",
      },
      breakpoints: {
        "960px": "50vw",
        "640px": "75vw",
      },
      modal: true,
    },
  });
};
</script>

<template>
  <section id="product-details" class="mb-5">
    <div id="product-header">
      <h1 class="text-xl">
        {{ product.store.title }}
      </h1>
    </div>
    <div id="product-layout relative" class="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-2">
      <template v-if="productPromos.length > 0">
        <div v-for="productPromo in productPromos"
          class="absolute  p-3 wax-w-fit text-center align-middle rounded-full z-10 top-2 right-2 bg-red-700 text-white shadow-lg">
          {{ productPromo.title }}
        </div>
      </template>
      <template v-if="collectionPromos.length > 0">
        <div v-for="collectionPromo in collectionPromos"
          class="absolute  p-3 wax-w-fit text-center align-middle rounded-full z-10 top-2 right-2 bg-red-700 text-white shadow-lg">
          {{ collectionPromo.title }}
        </div>
      </template>
      <div id="product-images">
        <client-only>
          <product-slideshow :variantImages="variantImages" :currentImage="currentImage"
            :featureImage="product.featureImage" @update:currentImage="currentImage = $event" />
        </client-only>
      </div>
      <div id="product-selection-panel" class="mt-auto">
        <div id="product-options">
          <h3>Select an Option</h3>
          <template v-for="option in activeOptions" :key="option._key">
            <product-options-size v-if="option.type == 'size'" :option="option"
              :selectedOptionValue="findSelectedOptionValue(option)"
              @update:selectedOptionValueId="updateSelectedOptionAndVariant" />
            <product-options-color v-if="option.type == 'color'" :option="option"
              :selectedOptionValue="findSelectedOptionValue(option)"
              @update:selectedOptionValueId="updateSelectedOptionAndVariant" />
            <product-options-depth v-if="option.type == 'depth'" :option="option"
              :selectedOptionValue="findSelectedOptionValue(option)"
              @update:selectedOptionValueId="updateSelectedOptionAndVariant" />
            <product-options-weight v-if="option.type == 'weight'" :option="option"
              :selectedOptionValue="findSelectedOptionValue(option)"
              @update:selectedOptionValueId="updateSelectedOptionAndVariant" />
          </template>
        </div>
        <template v-if="product.details && product.details.productSizes">
          <div id="product-size-chart" class="align-center flex justify-center pb-4">
            <NuxtLink @click="openDialog()"
              class="relative cursor-pointer after:absolute after:-bottom-[5px] after:left-0 after:h-[3px] after:w-[0%] after:rounded-xl after:bg-primary-700 after:duration-300 after:content-[''] hover:after:w-[100%] dark:after:bg-primary-500">
              Size Charts</NuxtLink>
          </div>
        </template>
        <div id="product-purchase-summary" class="flex flex-col">
          <div class="rounded-md border-black bg-surface-700 p-3 text-surface-200 shadow-md @container lg:p-5">
            <div class="text-sm italic">You have selected:</div>
            <div class="">
              <span class="text-lg text-surface-100">
                {{ product.store.title }}</span>
              <template v-for="option in selectedOptionsValues" :key="option._key">
                <p>
                  <span class="capitalize">{{ option.type }}</span> :
                  {{ option.values[0].title }}
                </p>
              </template>
            </div>
            <div class="flex flex-col items-center justify-between gap-1 px-1 pb-4 pt-1">
              <div class="flex flex-row items-center gap-1">
                <div class="relative flex flex-row items-center rounded outline-surface-500">
                  <span class="text-lg">Qty:</span>
                  <input type="number"
                    class="block min-h-[auto] w-20 rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-surface-500 transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-surface-100 dark:text-surface-200 dark:placeholder:text-surface-200 dark:peer-focus:text-surface-100"
                    v-model="quantity" name="quantity" id="quantity" />
                </div>
                <div class="text-xl font-semibold">
                  <span v-if="selectedPromo" class="mr-2">${{ discountedPrice.toFixed(2) }}</span>
                  <span :class="selectedPromo ? 'line-through' : ''">${{ totalPrice.toFixed(2) }}</span>
                </div>
              </div>
              <button type="button"
                class="snipcart-add-item flex gap-2 rounded bg-surface-500 px-10 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-surface-50 shadow-surface-200 transition duration-150 ease-in-out hover:bg-surface-800 focus:bg-surface-800 focus:outline-none focus:ring-0 active:bg-surface-400 text-nowrap"
                :data-item-url="validationUrl" :data-item-id="product._id" :data-item-image="currentImage.src"
                :data-item-price="itemPrice" :data-item-name="product.store.title" data-item-custom1-name="Variant_SKU"
                :data-item-categories="selectedPromo ? selectedPromo.slug : 'no-promo'" data-item-custom1-type="hidden"
                :data-item-custom1-value="selectedVariant.sku" data-item-custom2-name="Blueprint_id"
                data-item-custom2-type="hidden" :data-item-custom2-value="product.store.blueprintId"
                data-item-custom3-name="Print_Provider_id" data-item-custom3-type="hidden"
                :data-item-custom3-value="product.store.printProviderId" data-item-custom4-name="variant_id"
                data-item-custom4-type="hidden" :data-item-custom4-value="selectedVariant.id"
                data-item-custom5-name="Product details" data-item-custom5-type="readonly"
                :data-item-custom5-value="selectedVariantOptions" :data-item-quantity="quantity">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-4 w-4">
                  <path
                    d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
                </svg>
                Add to cart
              </button>
            </div>
          </div>
          <div class="text-center text-sm italic">
            <!-- <pre>{{ product.store }}</pre> -->
            ** Note: all prices are in USD.
          </div>
        </div>
      </div>
    </div>
    <div id="product-details-features" v-if="product.details">
      <!-- <pre>{{ product.details }}</pre> -->
      <TabView>
        <TabPanel v-for="item in product.details.productFeatures" :header="item.title" :key="item._key">
          <WebcnxnzPortableText :blocks="item.body" />
        </TabPanel>
      </TabView>
    </div>
    <!-- <div id="product-details-moreInfo" v-else-if="product.moreInfo">
      <TabView>
        <TabPanel
          v-for="item in product.moreInfo"
          :header="item.title"
          :key="item._key"
        >
          <div v-html="item.description"></div>
        </TabPanel>
      </TabView>
    </div> -->
    <div id="product-details-store-description" v-else="product.store.description">
      <div v-html="product.store.description"></div>
    </div>
  </section>
</template>

<style>
.selected-option {
  outline-color: var(--surface-600);
  outline-width: 3px;
  outline-style: solid;
  outline-offset: 1px;
}

.dark .selected-option {
  outline-color: var(--surface-300);
}
</style>
