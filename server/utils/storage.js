const storage = useStorage();

export const setRates = async (newRates) => {
  console.log("Storing rates:", newRates);
  await storage.setItem("rates", {
    rates: newRates,
    timestamp: Date.now(),
  });
  console.log("Storage complete");
};
export const getRates = async () => {
  return await storage.getItem("rates");
};
