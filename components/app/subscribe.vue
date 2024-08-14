<script setup>
const data = useSiteSettingsStore();
const settings = data.settings;
const props = defineProps({
  promo: {
    type: Object,
    required: true
  }
})

const value = ref(null);
const isSubmitting = ref(false);

const mail = useMail();
const messageSent = ref(false);

function send() {
  isSubmitting.value = true;
  mail
    .send({
      from: "no-reply@thecooks.net.nz",
      subject: `New newsletter subscription for ${settings.title}`,
      text: `Please add ${value.value} to our mailing list.`,
    })
    .then(() => {
      messageSent.value = true;
      value.value = "";
      isSubmitting.value = false;
      console.log("Email sent!");
    })
    .catch((error) => {
      console.error(error);
    });
}
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
            <div v-if="!messageSent" class="grid gap-2 md:grid-flow-col content-center md:mb-5">
              <div class="grid-flow-rows grid pr-5 place-self-center">
                <InputText type="email" id="subscribeEmail" v-model="value"
                  placeholder="Please enter a valid email address." />
              </div>
              <div class="">
                <template>
                  <Button plain @click.prevent="send" label="Submit" icon="fa-duotone fa-paper-plane">
                  </Button>
                </template>
              </div>
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
