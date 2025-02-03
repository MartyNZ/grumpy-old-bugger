<script setup>
import { qryContactPage } from '~/queries/siteSettings'
const { data: page } = await useSanityQuery(qryContactPage)
import * as yup from "yup";
const data = useSiteSettingsStore();
const settings = data.settings;

const formSchema = toTypedSchema(
  yup.object(
    {
      name: yup.string().required('Please enter your full name.'),
      email: yup.string().email().required('Please provide a valid email address.')
        .matches(/^[^@]+@[^@]+\.[^@]+$/, 'Email must include domain extension'),
      message: yup.string().optional()
    },
  ),
);

const { errors, values, meta, defineField, handleSubmit, isSubmitting, resetForm } = useForm({
  validationSchema: formSchema,
  initialValues: {
    name: '',
    email: '',
    message: '',
  },
});

const [name, nameProps] = defineField("name", { props: state => ({ error: state.errors[0] }) });
const [email, emailProps] = defineField("email", { props: state => ({ error: state.errors[0] }) });
const [message, messageProps] = defineField("message", { props: state => ({ error: state.errors[0] }) });


const messageSent = ref(false)
const onSubmit = handleSubmit(values => {
  // alert(JSON.stringify(values, null, 2));
  const mail = useMail();
  mail
    .send({
      from: email.value,
      subject: `New contact from ${settings.title}`,
      text: message.value,
    })
    .then(() => {
      messageSent.value = true;
      resetForm();
      // console.log("Email sent!");
    })
    .catch((error) => {
      console.error(error);
    });

});

const debug = ref(false);

useSeoMeta({
  title: () => settings.title,
  ogTitle: () => settings.title,
  description: () => settings.description,
  ogDescription: () => settings.description,
  ogImage: () => settings.image,
  twitterTitle: () => settings.title,
  twitterDescription: () => settings.description,
  twitterImage: () => settings.image,
  twitterCard: "summary_large_image",
});

defineOgImageComponent(
  'default',
  {
    title: settings.title,
    description: settings.description,
    image: settings.image,
    siteName: settings.title,
    icon: settings.logoUrl,
  });

definePageMeta({
  layout: "false",
});
</script>
<template>
  <NuxtLayout name="internal">
    <template #main>
      <section class="mb-16">
        <div class="flex justify-center">
          <div class="text-center md:max-w-xl lg:max-w-3xl">
            <h2 class="mb-12 px-6 text-3xl font-bold">{{ page.title }}</h2>
            <SanityContent :blocks="page.content" />
          </div>
        </div>

        <div class="flex flex-wrap">
          <div class="mb-12 w-full shrink-0 grow-0 basis-auto md:px-3 lg:mb-0 lg:w-7/12 lg:px-6">
            <vForm @submit="onSubmit()">
              <div class="mb-3 flex flex-col">
                <label for="name">Name </label>
                <InputText v-model="name" v-bind="nameProps" type="text" id="name" />
                <div v-if="errors.name" class="text-red-500 text-sm italic">{{ errors.name }}</div>
              </div>
              <div class="mb-3 flex flex-col">
                <label for="email">Email address </label>
                <InputText v-model="email" v-bind="emailProps" type="email" id="email" />
                <div v-if="errors.email" class="text-red-500 text-sm italic">{{ errors.email }}</div>
              </div>
              <div class="mb-3 flex flex-col">
                <label for="message">Message</label>
                <Textarea v-model="message" v-bind="messageProps" id="message" rows="3"></Textarea>
              </div>
              <div v-if="!messageSent" class="w-full py-2">
                <button :disabled="!meta.touched || isSubmitting"
                  class="relative w-full flex items-center justify-center text-center align-bottom gap-2 text-sm py-2 shadow-sm rounded-md text-surface-100 dark:text-surface-900 bg-primary-500 dark:bg-primary-400 ring-1 ring-primary-500 dark:ring-primary-400 focus:outline-none focus:outline-offset-0 focus:ring-2 focus:ring-offset-current focus:ring-offset-2 hover:bg-primary-600 dark:hover:bg-primary-300 hover:ring-primary-600 dark:hover:ring-primary-300 focus:ring-primary-500 dark:focus:ring-primary-400 transition duration-200 ease-in-out cursor-pointer overflow-hidden select-none">
                  <div class="flex align-center gap-4">
                    <IconsFaDuotonePaperPlane />
                    <span class="w-[50%]">{{ isSubmitting ? "Sending..." : "Send" }}</span>
                  </div>
                </button>
              </div>
              <div v-if="messageSent"
                class="bg-surface-50 mb-6 grid h-full w-full grid-flow-col items-center rounded-lg">
                <div class="text-center text-xl text-green-500">
                  Thank you, your message has been sent.<br />We will respond as soon as possible.
                </div>
              </div>
            </vForm>
            <div v-if="debug">Values:
              <pre>{{ values }}</pre>
            </div>
            <div v-if="debug">Errors:
              <pre>{{ errors }}</pre>
            </div>
          </div>
          <div id="contact-social" class="mb-12 ml-12 w-full md:px-3 lg:mb-0 lg:w-4/12 lg:px-6">
            <div class="mb-6 mt-6 lg:mb-0">
              <client-only>
                <div v-for="connection in settings.primaryLocation.socialConnections" :key="connection._key">
                  <NuxtLink :to="connection.userUrl" target="_blank" class="mb-3 flex items-center gap-5 text-2xl">
                    <i :class="`fab fa-${connection._type}`" />
                    <span>{{ connection.title }}</span>
                  </NuxtLink>
                </div>
              </client-only>
            </div>
          </div>
        </div>
      </section>
      <section class="mb-16">
        <app-page-sections :page="page" />
      </section>
    </template>
    <template #sidebar>
      <div class="@md:grid-cols-2 sticky top-[95px] mx-3 grid grid-cols-1 gap-4">
        <div><product-featured /></div>
        <div><article-latest /></div>
      </div>
    </template>
  </NuxtLayout>
</template>
