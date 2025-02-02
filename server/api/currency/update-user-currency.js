export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  // Set the new currency in user-info cookie
  setCookie(
    event,
    "user-info",
    JSON.stringify({
      currency: body.currency,
      language: body.language || "en",
    }),
    {
      path: "/",
      httpOnly: true,
    }
  );

  return { success: true };
});
