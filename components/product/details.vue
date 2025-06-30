<script setup>
import { currenciesData } from "~/assets/data/currencies.json";
const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
  defaultVariant: {
    type: Object,
    required: true,
  },
  loading: {
    type: Boolean,
  }
});

const userInfo = useCookie('user-info');

// // Check if user-info exists and has currency data
// // If not, create it with default values
// onBeforeMount(() => {
//   if (!userInfo.value || !userInfo.value.currency) {
//     // Set default currency (for example, USD)
//     const defaultCurrency = {
//       value: 1,
//       ...currenciesData.USD,
//     };

//     userInfo.value = {
//       currency: defaultCurrency,
//     };
//   }
// });


const optionIdsArrays = props.product.store.variants.map((variant) =>
  variant.options.split(", "),
);

const flatOptionIdsArray = optionIdsArrays.flat();
const uniqueOptionIds = [...new Set(flatOptionIdsArray)];

const activeOptions = props.product.store.options.map((option) => {
  return {
    ...option,
    values: option.values.filter((value) => uniqueOptionIds.includes(value.id)),
  };
});

const { snipcart, initializeSnipcart, updateCartCurrency } = useSnipcartCurrency()
const { calculatePrices } = usePriceCalculations()
const { getSelectedOptionValue } = useProductOptions(activeOptions)

const data = useCurrenciesStore();

// Price calculations using the new composable
const quantity = ref(1);

// Currency handling
const selectedCurrency = ref();
selectedCurrency.value = userInfo.value.currency;

const prices = computed(() => {
  if (selectedVariant.value) {
    return calculatePrices(
      selectedVariant.value,
      selectedCurrency.value,
      quantity.value,
      selectedPromo.value
    )
  }
  return { itemPrice: 0, totalPrice: 0, discountedPrice: 0 }
})


onMounted(() => {
  initializeSnipcart(selectedCurrency.value)
})

watch(selectedCurrency, (newCurrency) => {
  const cartState = snipcart.value?.store.getState().cart;
  // Pass cartState directly instead of cartState.items
  updateCartCurrency(newCurrency, cartState, props.product.store.pricedFrom.price);
  userInfo.value = { ...userInfo.value, currency: newCurrency };
});

const updateSelectedOptionAndVariant = (newOptionValueId) => {
  // Find which option type this value belongs to
  const relevantOption = activeOptions.find(opt =>
    opt.values.some(val => val.id === newOptionValueId)
  );

  if (!relevantOption) return;

  // Create a map of option types to their selected values
  const optionTypeToValueMap = {};

  // Initialize with current selections
  activeOptions.forEach(option => {
    // Find the current selected value for this option type
    const currentValue = option.values.find(val =>
      selectedOptionsValuesIds.value.includes(val.id)
    );

    if (currentValue) {
      optionTypeToValueMap[option.type] = currentValue.id;
    }
  });

  // Update with the new selection
  optionTypeToValueMap[relevantOption.type] = newOptionValueId;

  // Find a variant that matches all our selected options
  const newVariant = props.product.store.variants.find(variant => {
    const variantOptionIds = variant.options.split(", ");

    // Check if this variant has all our selected options
    return Object.entries(optionTypeToValueMap).every(([optionType, valueId]) => {
      // Find if this option value is in the variant
      return variantOptionIds.includes(valueId);
    });
  });

  if (newVariant) {
    // Update the selectedOptionsValuesIds to match the exact order in the variant
    selectedOptionsValuesIds.value = newVariant.options.split(", ");
    selectedVariant.value = newVariant;
  }
};

const availableCurrencies = data.availableCurrencies;
const currencySelect = ref();
currencySelect.value = Object.values(availableCurrencies)

// Add to watch handler
watch(() => data.availableCurrencies, (newCurrencies) => {
  // console.log("Currency data in component:", newCurrencies)
  if (Object.keys(newCurrencies).length > 0) {
    // console.log("Selected currency:", newCurrencies[userInfo.value.currency.code])
    selectedCurrency.value = newCurrencies[userInfo.value.currency.code];
    currencySelect.value = Object.values(newCurrencies);
  }
}, { immediate: true });
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

const selectedPromo = ref()
selectedPromo.value = productPromos[0] || collectionPromos[0];

const activePromotions = computed(() => ({
  product: productPromos,
  collection: collectionPromos,
  selected: selectedPromo.value
}))

const config = useRuntimeConfig();

const selectedVariant = ref({});
selectedVariant.value = props.defaultVariant;

const selectedOptionsValuesIds = ref([]);
selectedOptionsValuesIds.value = selectedVariant.value.options.split(", ");


const validationUrl = ref("");
validationUrl.value = `${config.public.publicUrl.replace(/\/$/, '')}/api/printify/validate-sanity-product?id=${props.product._id}&vId=${selectedVariant.value.id}`;
watch(selectedVariant, () => {
  validationUrl.value = `${config.public.publicUrl.replace(/\/$/, '')}/api/printify/validate-sanity-product?id=${props.product._id}&vId=${selectedVariant.value.id}`;
  // console.log("Validation URL: ", validationUrl.value);
});
const selectedOptionsValues = ref([]);
selectedOptionsValues.value = activeOptions.map((option) => {
  return {
    ...option,
    values: option.values.filter((value) =>
      selectedOptionsValuesIds.value.includes(value.id),
    ),
  };
});

const selectedValues = ref([]);
const selectedVariantOptions = ref();
selectedOptionsValues.value.map((option) => {
  option.values.map((value) => {
    selectedValues.value.push(value.title);
  });
  selectedVariantOptions.value = selectedValues.value.join(" / ");
});

watch(selectedOptionsValues, (newValues, oldValues) => {
  selectedValues.value = [];
  newValues.map((value) => {
    value.values.map((optionValue) => {
      selectedValues.value.push(optionValue.title);
    });
  });
  selectedVariantOptions.value = selectedValues.value.join(" / ");
});

watch(selectedVariant, (newVariant, oldVariant) => {
  const newVariantOptionIds = newVariant.options.split(", ");

  selectedOptionsValues.value = newVariantOptionIds.map((optionId) => {
    const option = activeOptions.find((option) =>
      option.values.some((value) => value.id === optionId),
    );

    if (option) {
      const newOptionValue = option.values.find(
        (value) => value.id === optionId,
      );
      return {
        ...option,
        values: [newOptionValue],
      };
    }

    return console.error("This variant is currently out of stock");
  });
});

const findSelectedOptionValue = (option) => {
  const optionValuesIds = option.values.map((value) => value.id);

  const matchingValue = optionValuesIds.filter((valueId) =>
    selectedOptionsValuesIds.value.includes(valueId),
  );

  if (matchingValue.length > 0) {
    return matchingValue[0];
  }
};

const variantImages = ref([]);
const currentImage = ref();
watchEffect(() => {
  const imagesForActiveVariant = selectedVariant.value.variantImages;
  variantImages.value = imagesForActiveVariant;
  currentImage.value = variantImages.value[0];
});

const formattedPrices = computed(() => {
  const priceObject = Object.values(availableCurrencies).reduce((acc, currency) => {
    const convertedPrice = (selectedVariant.value.price / 100 * currency.rate).toFixed(2);
    acc[currency.code.toLowerCase()] = Number(convertedPrice);
    return acc;
  }, {});

  return JSON.stringify(priceObject);
});
// console.log("HTML friendly Price Object: ", JSON.stringify(formattedPrices.value, null, 2))

// Calculate which option values are actually available
const availableOptionValues = computed(() => {
  const availableIds = new Set();

  props.product.store.variants.forEach(variant => {
    if (variant.isAvailable && variant.isEnabled) {
      const optionIds = variant.options.toString().split(',').map(id => id.trim());
      optionIds.forEach(id => availableIds.add(id));
    }
  });

  return availableIds;
});

// Check if a specific option combination would result in an available variant
const isOptionCombinationAvailable = (newOptionValueId) => {
  // Create a temporary selection with the new option
  const tempSelection = [...selectedOptionsValuesIds.value];

  // Find which option type this value belongs to
  const relevantOption = activeOptions.find(opt =>
    opt.values.some(val => val.id === newOptionValueId)
  );

  if (!relevantOption) return false;

  // Replace the current selection for this option type
  const optionTypeToValueMap = {};

  // Initialize with current selections
  activeOptions.forEach(option => {
    const currentValue = option.values.find(val =>
      selectedOptionsValuesIds.value.includes(val.id)
    );
    if (currentValue) {
      optionTypeToValueMap[option.type] = currentValue.id;
    }
  });

  // Update with the new selection
  optionTypeToValueMap[relevantOption.type] = newOptionValueId;

  // Check if any variant matches this combination
  return props.product.store.variants.some(variant => {
    if (!variant.isAvailable || !variant.isEnabled) return false;

    const variantOptionIds = variant.options.split(", ");

    // Check if this variant has all our selected options
    return Object.entries(optionTypeToValueMap).every(([optionType, valueId]) => {
      return variantOptionIds.includes(valueId);
    });
  });
};

// Add computed property to check if current selection is available
const isCurrentVariantAvailable = computed(() => {
  return selectedVariant.value?.isAvailable && selectedVariant.value?.isEnabled;
});
</script>

<template>
  <section id="product-details" class="mb-5">
    <div id="product-header">
      <h1 class="text-xl">
        {{ product.store.title }}
      </h1>
    </div>
    <div id="product-layout relative" class="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-2">
      <div id="product-images">
        <client-only>
          <product-slideshow :variantImages="variantImages" :currentImage="currentImage"
            :featureImage="product.featureImage" @update:currentImage="currentImage = $event" :loading="loading" />
        </client-only>
      </div>
      <div id="product-selection-panel" class="mt-auto">
        <div id="product-options">
          <div id="promotions" class="mb-2">
            <template v-if="productPromos.length > 0">
              <div v-for="productPromo in productPromos"
                class="p-3 wax-w-fit text-center align-middle rounded-full z-10 top-2 right-2 bg-red-700 text-white shadow-lg">
                {{ productPromo.title }}
              </div>
            </template>
            <template v-if="collectionPromos.length > 0">
              <div v-for="collectionPromo in collectionPromos"
                class="p-3 wax-w-fit text-center align-middle rounded-full z-10 top-2 right-2 bg-red-700 text-white shadow-lg">
                {{ collectionPromo.title }}
              </div>
            </template>
          </div>

          <h3>Select an Option</h3>
          <div v-if="selectedVariant && (!selectedVariant.isAvailable || !selectedVariant.isEnabled)"
            class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            <div class="flex items-center">
              <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clip-rule="evenodd"></path>
              </svg>
              <span class="font-medium">This variant is currently unavailable</span>
            </div>
            <p class="text-sm mt-1">Please select a different combination of options.</p>
          </div>
          <template v-for="option in activeOptions" :key="option._key">
            <product-options-size v-if="option.type == 'size'" :option="option"
              :selectedOptionValue="findSelectedOptionValue(option)" :available-option-values="availableOptionValues"
              :is-option-combination-available="isOptionCombinationAvailable"
              @update:selectedOptionValueId="updateSelectedOptionAndVariant" />
            <product-options-color v-if="option.type == 'color'" :option="option"
              :selectedOptionValue="findSelectedOptionValue(option)" :available-option-values="availableOptionValues"
              :is-option-combination-available="isOptionCombinationAvailable"
              @update:selectedOptionValueId="updateSelectedOptionAndVariant" />
            <product-options-depth v-if="option.type == 'depth'" :option="option"
              :selectedOptionValue="findSelectedOptionValue(option)" :available-option-values="availableOptionValues"
              :is-option-combination-available="isOptionCombinationAvailable"
              @update:selectedOptionValueId="updateSelectedOptionAndVariant" />
            <product-options-weight v-if="option.type == 'weight'" :option="option"
              :selectedOptionValue="findSelectedOptionValue(option)" :available-option-values="availableOptionValues"
              :is-option-combination-available="isOptionCombinationAvailable"
              @update:selectedOptionValueId="updateSelectedOptionAndVariant" />
          </template>
        </div>
        <div class="w-full my-2" v-if="product.details?.productSizes">
          <product-size-charts :productSizes="product.details.productSizes" />
        </div>
        <div id="product-purchase-summary" class="flex flex-col">
          <div class="rounded-md border-black bg-surface-700 p-3 text-surface-200 shadow-md @container lg:p-5">
            <div class="text-sm italic">You have selected:</div>
            <div class="">
              <span class="text-lg text-surface-100">
                {{ product.store.title }}</span>
              <template v-for="option in selectedOptionsValues" :key="option._key">
                <div class="relative flex flex-row items-center rounded outline-surface-500">
                  <span class="capitalize">{{ option.type }}</span> :
                  {{ option.values[0].title }}
                </div>
              </template>
              <div class="relative flex flex-row items-center rounded outline-surface-100">
                <span>Quantity:</span>
                <input type="number"
                  class="block min-h-[auto] w-20 rounded border-0 bg-transparent outline-surface-100 px-2 leading-[1.6] transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-surface-100 dark:text-surface-200 dark:placeholder:text-surface-200 dark:peer-focus:text-surface-100"
                  v-model="quantity" name="quantity" id="quantity" />
              </div>
            </div>
            <div class="flex flex-col items-center justify-between gap-1 py-3">
              <div class="flex flex-row items-center gap-1">
                <div class="text-xl font-semibold">
                  <span v-if="selectedPromo" class="mr-4">
                    {{ selectedCurrency.symbol_native }}
                    {{
                      prices.discountedPrice
                    }}</span>
                  <span :class="selectedPromo ? 'line-through' : ''" class="mr-3">
                    {{ selectedCurrency.symbol_native }}
                    {{
                      prices.totalPrice
                    }}</span>
                  <Select v-tooltip.top="'Changing the currency will remove all items from your cart!'"
                    v-model="selectedCurrency" :options="currencySelect" optionLabel="code" />
                </div>
              </div>
              <button type="button" :disabled="!isCurrentVariantAvailable" :class="[
                'snipcart-add-item flex gap-2 rounded px-10 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal shadow-surface-200 transition duration-150 ease-in-out text-nowrap',
                isCurrentVariantAvailable
                  ? 'bg-surface-500 text-surface-50 hover:bg-surface-800 focus:bg-surface-800 focus:outline-none focus:ring-0 active:bg-surface-400'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              ]" :data-item-url="validationUrl" :data-item-id="product._id" :data-item-image="currentImage.src"
                :data-item-price="formattedPrices" :data-item-name="product.store.title"
                data-item-custom1-name="Variant_SKU"
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
                {{ isCurrentVariantAvailable ? 'Add to cart' : 'Unavailable' }}
              </button>
            </div>
          </div>
          <div class="text-center text-sm italic">
            Please note that prices may vary based on your location and the current exchange rate.
          </div>
        </div>
      </div>
    </div>
    <div id="product-details-features" v-if="product.details">
      <Tabs :value="product.details.productFeatures[0].title">
        <TabList>
          <Tab v-for="item in product.details.productFeatures" :key="item.title" :value="item.title">{{ item.title }}
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel v-for="item in product.details.productFeatures" :key="item.body" :value="item.title">
            <WebcnxnzPortableText :blocks="item.body" />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
    <div id="product-details-store-description" v-else="product.store.description">
      <div v-html="product.store.description"></div>
    </div>
  </section>
</template>
<!-- <template>
  <pre>Quantity: {{ quantity }}</pre>
  <pre v-if="selectedCurrency">Exchange Rate: {{ selectedCurrency.rate }}</pre>
  <pre v-if="prices.itemPrice">Item Price: {{ prices.itemPrice }}</pre>
  <pre v-if="prices.totalPrice">Total Price: {{ prices.totalPrice }}</pre>
  <pre v-if="prices.discountedPrice">Discounted Price: {{ prices.discountedPrice }}</pre>
  <pre v-if="snipcart">Snipcart ready: {{ snipcart }}</pre>
</template> -->
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
