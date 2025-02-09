export default defineCachedEventHandler(
  async (event) => {
    const storage = useStorage("currency");

    if (event.method === "POST") {
      const body = await readBody(event);
      await storage.setItem("selected", body);
      return body;
    }

    return await storage.getItem("selected");
  },
  {
    swr: true,
    maxAge: 60 * 60 * 24,
  }
);
