<script setup>
import * as yup from 'yup';

const data = useSiteSettingsStore();
const settings = data.settings;
const mail = useMail();

const props = defineProps({
  promo: {
    type: Object,
    required: true
  }
});

const validationSchema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Must be a valid email')
    .matches(/^[^@]+@[^@]+\.[^@]+$/, 'Email must include domain extension')
});

const messageSent = ref(false);

const onSubmit = (values) => {
  mail.send({
    from: "no-reply@thecooks.net.nz",
    subject: `New newsletter subscription for ${settings.title}`,
    text: `Please add ${values.email} to our mailing list.`,
  })
    .then(() => {
      messageSent.value = true;
    });
};
</script>

<template>
  <client-only>
    <section id="subscribe"
      class="bg-surface-800 text-surface-50 border-surface-800 border-t py-3 text-center md:text-left">
      <div class="flex flex-wrap items-center justify-center">
        <div class="w-full px-2 mt-2">
          <div class="grid items-center gap-2 md:grid-cols-2">
            <div class="grid-flow-row mb-1 grid md:mb-5">
              <h3 class="text-semibold font-primary text-md md:text-2xl">
                Receive a {{ promo.discount }}% discount coupon
              </h3>
              <span class="text-semibold text-md sm:text-lg">When you subscribe to our newsletter</span>
            </div>
            <div class="@container w-full" v-if="!messageSent">
              <vForm :validation-schema="validationSchema" @submit="onSubmit" v-slot="{ isSubmitting }">
                <div class="grid gap-2 place-content-center">
                  <vField name="email" v-slot="{ field, errors }">
                    <div class="grid-flow-rows grid pr-5 place-self-center">
                      <InputText v-bind="field" type="email" :class="{ 'p-invalid': errors }"
                        placeholder="Please enter a valid email address" />
                      <vErrorMessage name="email" class="text-red-500" />
                    </div>
                  </vField>
                  <div>
                    <button
                      class="relative mx-auto px-4 flex items-center justify-center text-center align-bottom gap-2 text-sm py-1 shadow-sm rounded-md text-surface-100 dark:text-surface-900 bg-primary-500 dark:bg-primary-400 ring-1 ring-primary-500 dark:ring-primary-400 focus:outline-none focus:outline-offset-0 focus:ring-2 focus:ring-offset-current focus:ring-offset-2 hover:bg-primary-600 dark:hover:bg-primary-300 hover:ring-primary-600 dark:hover:ring-primary-300 focus:ring-primary-500 dark:focus:ring-primary-400 transition duration-200 ease-in-out cursor-pointer overflow-hidden select-none">
                      <div class="flex align-center gap-4">
                        <IconsFaDuotonePaperPlane />
                        <span class="w-[50%]">{{ isSubmitting ? "Sending..." : "Send" }}</span>
                      </div>
                    </button>
                  </div>
                </div>
              </vForm>
            </div>
            <div v-if="messageSent" class="bg-surface-50 grid h-full grid-flow-col items-center rounded-lg">
              <div class="text-center text-xl text-green-700">
                Welcome!! your coupon code is <span class="text-primary-950 semibold">{{ promo.coupon }}</span>.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </client-only>
</template>
