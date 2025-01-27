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

const userInfo = useCookie('user-info');
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
  updateCartCurrency(newCurrency, cartState.items, props.product.store.pricedFrom.price);
  userInfo.value = { ...userInfo.value, currency: newCurrency };
});

const updateSelectedOptionAndVariant = (newOptionValueId) => {
  // console.log("Option Value ID received:", newOptionValueId);

  const relevantOption = activeOptions.find(opt =>
    opt.values.some(val => val.id === newOptionValueId)
  );
  // console.log("Found matching option:", JSON.stringify(relevantOption, null, 2));

  const selectedValue = getSelectedOptionValue(relevantOption, [newOptionValueId]);
  // console.log("Selected value:", selectedValue);

  if (selectedValue) {
    const currentOptionsIds = [...selectedOptionsValuesIds.value];
    const optionIndex = activeOptions.findIndex(opt =>
      opt.values.some(val => val.id === newOptionValueId)
    );

    if (optionIndex !== -1) {
      currentOptionsIds[optionIndex] = newOptionValueId;
      const newVariant = props.product.store.variants.find(
        variant => variant.options === currentOptionsIds.join(", ")
      );

      if (newVariant) {
        selectedOptionsValuesIds.value = currentOptionsIds;
        selectedVariant.value = newVariant;
      }
    }
  }
};

const availableCurrencies = data.availableCurrencies;

const currencySelect = ref();
currencySelect.value = Object.values(availableCurrencies)

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


// console.log("Active Options:", JSON.stringify(activeOptions, null, 2))
// console.log("Default Variant:", JSON.stringify(selectedVariant.value, null, 2))
// console.log("Initial Options Values:", JSON.stringify(selectedOptionsValuesIds.value, null, 2))


const validationUrl = ref("");
validationUrl.value = `${config.public.publicUrl}/api/printify/validate-sanity-product?id=${props.product._id}&vId=${selectedVariant.value.id}`; watch(selectedVariant, () => {
  validationUrl.value = `${config.public.publicUrl}/api/printify/validate-sanity-product?id=${props.product._id}&vId=${selectedVariant.value.id}`;
  console.log("Validation URL: ", validationUrl.value);
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

import { useConfirm } from "primevue/useconfirm";
const confirm = useConfirm();

const handleCurrencyChange = (event) => {
  // Store the attempted new currency
  const newCurrency = event.value

  // Immediately revert to current currency
  selectedCurrency.value = userInfo.value.currency

  // Now show confirmation
  confirm.require({
    message: 'Changing currency requires emptying your cart first. Would you like to proceed?',
    header: 'Currency Warning',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      // Only update currency after user confirms
      selectedCurrency.value = newCurrency
      const cartState = snipcart.value?.store.getState().cart
      updateCartCurrency(newCurrency, cartState.items, props.product.store.pricedFrom.price)
      userInfo.value = { ...userInfo.value, currency: newCurrency }
    },
    reject: () => {
      // Already reverted, nothing more needed
    }
  })
}
const sizeCharts = defineAsyncComponent(
  () => import("~/components/product/sizeCharts.vue"),
);
const showSizeCharts = useDialog();
const openSizeChart = () => {
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

const formattedPrices = computed(() => {
  const priceObject = Object.values(availableCurrencies).reduce((acc, currency) => {
    const convertedPrice = (selectedVariant.value.price / 100 * currency.rate).toFixed(2);
    acc[currency.code.toLowerCase()] = Number(convertedPrice);
    return acc;
  }, {});

  return JSON.stringify(priceObject);
});
// console.log("HTML friendly Price Object: ", JSON.stringify(formattedPrices.value, null, 2))

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
            :featureImage="product.featureImage" @update:currentImage="currentImage = $event" />
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
            <NuxtLink @click="openSizeChart()"
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
                  <Dropdown v-model="selectedCurrency" :options="currencySelect" optionLabel="code"
                    @change="handleCurrencyChange($event)" />
                </div>
              </div>
              <button type="button"
                class="snipcart-add-item flex gap-2 rounded bg-surface-500 px-10 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-surface-50 shadow-surface-200 transition duration-150 ease-in-out hover:bg-surface-800 focus:bg-surface-800 focus:outline-none focus:ring-0 active:bg-surface-400 text-nowrap"
                :data-item-url="validationUrl" :data-item-id="product._id" :data-item-image="currentImage.src"
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
                Add to cart
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
      <TabView>
        <TabPanel v-for="item in product.details.productFeatures" :header="item.title" :key="item._key">
          <WebcnxnzPortableText :blocks="item.body" />
        </TabPanel>
      </TabView>
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
