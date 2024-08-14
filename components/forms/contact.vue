<script setup>
const data = useSiteSettingsStore();
const settings = data.settings;
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Textarea from "primevue/textarea";
import ProgressSpinner from "primevue/progressspinner";

const name = ref("");
const email = ref("");
const message = ref("");

const mail = useMail();
const isSubmitting = ref(false);
const messageSent = ref(false);

function send() {
  isSubmitting.value = true;
  mail
    .send({
      from: email.value,
      subject: `New contact from ${settings.title}`,
      text: message.value,
    })
    .then(() => {
      name.value = "";
      email.value = "";
      message.value = "";
      messageSent.value = true;
      isSubmitting.value = false;
      // console.log("Email sent!");
    })
    .catch((error) => {
      console.error(error);
    });
}
</script>
<template>
  <section id="contact-form-container">
    <form>
      <div class="mb-3 flex flex-col">
        <label for="name">Name </label>
        <InputText v-model="name" type="text" id="name" />
      </div>
      <div class="mb-3 flex flex-col">
        <label for="email">Email address </label>
        <InputText v-model="email" type="email" id="email" />
      </div>
      <div class="mb-3 flex flex-col">
        <label for="message">Message</label>
        <Textarea v-model="message" id="message" rows="3"></Textarea>
      </div>
      <div v-if="!messageSent" class="w-full py-2">
        <Button @click.prevent="send" plain class="w-full" label="Send" />
        <!-- iconClass="text-right" icon="fa-duotone fa-paper-plane" -->
      </div>
      <div v-if="messageSent" class="bg-surface-50 mb-6 grid h-full w-full grid-flow-col items-center rounded-lg">
        <div class="text-center text-xl text-green-500">
          Message sent! Check your inbox.
        </div>
      </div>
    </form>
  </section>
</template>
<style>
#contact-form-container {
  container-type: inline-size;
  width: 100%;

}

#contact-form-container form {
  max-width: 32em;
  margin-inline: auto;
}
</style>
