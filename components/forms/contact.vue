<script setup>
import * as yup from "yup";

const data = useSiteSettingsStore();
const settings = data.settings;

const schema = yup.object({
  email: yup.string().email().required(),
  name: yup.string().required(),
  message: yup.string().required().min(10, 'Message must be at least 10 characters'),
});

const { handleSubmit, errors, defineField } = useForm({
  validationSchema: schema
})

const [name] = defineField('name')
const [email] = defineField('email')
const [message] = defineField('message')

const onSubmit = handleSubmit((values) => {
  send();
})

const mail = useMail();
const isSubmitting = ref(false);
const messageSent = ref(false);
const errorMessage = ref('');

const timeoutId = ref(null);

function send() {
  isSubmitting.value = true;
  errorMessage.value = ''; // Clear previous errors

  // Sanitize all inputs
  const sanitizedEmail = email.value.trim();
  const sanitizedName = name.value.replace(/[\r\n]/g, '').trim();
  const sanitizedMessage = message.value.trim();

  mail
    .send({
      from: sanitizedEmail,
      subject: `New contact from ${settings.title} - ${sanitizedName}`,
      text: sanitizedMessage,
    })
    .then(() => {
      name.value = "";
      email.value = "";
      message.value = "";
      messageSent.value = true;
      isSubmitting.value = false;

      // Clear existing timeout
      if (timeoutId.value) clearTimeout(timeoutId.value);

      // Auto-hide success message after 5 seconds

      timeoutId.value = setTimeout(() => {
        messageSent.value = false;
      }, 5000);
    })
    .catch((error) => {
      console.error(error);
      errorMessage.value = 'Failed to send message. Please try again.';
      isSubmitting.value = false;
    });
}

onUnmounted(() => {
  if (timeoutId.value) clearTimeout(timeoutId.value);
});
</script>
<template>
  <div>
    <form v-if="!messageSent" @submit="onSubmit">
      <div v-if="errorMessage" class="mb-3 p-3 bg-red-100 text-red-700 rounded">
        {{ errorMessage }}
      </div>
      <div class="mb-3 flex flex-col">
        <label for="name">Name </label>
        <InputText v-model="name" type="text" id="name" :class="{ 'p-invalid': errors.name }" />
        <small class="p-error">{{ errors.name }}</small>
      </div>
      <div class="mb-3 flex flex-col">
        <label for="email">Email address </label>
        <InputText v-model="email" type="email" id="email" :class="{ 'p-invalid': errors.email }" />
        <small class="p-error">{{ errors.email }}</small>
      </div>
      <div class="mb-3 flex flex-col">
        <label for="message">Message</label>
        <Textarea v-model="message" id="message" rows="3"></Textarea>
      </div>
      <div class="mx-auto w-[20em] py-2">
        <Button type="submit" class="submit-btn flex w-full items-center gap-4"
          :class="{ 'invalid': Object.keys(errors).length > 0 }" :disabled="isSubmitting">
          <span v-if="!isSubmitting">Send</span>
          <span v-else>Sending...</span>
          <span>
            <ProgressSpinner v-if="isSubmitting" style="width: 20px; height: 20px" />
            <IconsFaDuotonePaperPlane v-else />
          </span>
        </Button>
      </div>
    </form>

    <div v-if="messageSent" class="bg-surface-50 mb-6 grid h-full w-full grid-flow-col rounded-lg">
      <div class="text-center text-xl text-green-500">
        Message sent! Check your inbox.
      </div>
    </div>
  </div>
</template>
<!-- <style>
.submit-btn.invalid {
  animation: shake 0.5s;
  background-color: red;
  /* When the animation is finished, start again */
  animation-iteration-count: infinite;
}

@keyframes shake {
  0% {
    transform: translate(1px, 1px);
  }

  10% {
    transform: translate(-1px, -2px);
  }

  20% {
    transform: translate(-3px, 0px);
  }

  30% {
    transform: translate(3px, 2px);
  }

  40% {
    transform: translate(1px, -1px);
  }

  50% {
    transform: translate(-1px, 2px);
  }

  60% {
    transform: translate(-3px, 1px);
  }

  70% {
    transform: translate(3px, 1px);
  }

  80% {
    transform: translate(-1px, -1px);
  }

  90% {
    transform: translate(1px, 2px);
  }

  100% {
    transform: translate(1px, -2px);
  }
}

.submit-btn:hover {
  transform: scale(1.05);
}
</style> -->
