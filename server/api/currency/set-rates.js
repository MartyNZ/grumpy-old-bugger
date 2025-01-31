import { setRates } from "../../utils/storage";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  console.log("Received rates in API:", body);
  await setRates(body);
  console.log("Rates stored successfully");
  return { success: true };
});

console.log("🟢 SET-RATES.JS");
