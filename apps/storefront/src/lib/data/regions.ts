import { HttpTypes } from "@medusajs/types"

// Single-market (Mongolia, MNT). Medusa region machinery is neutralized.
const MN_REGION = {
  id: "reg_mn",
  name: "Mongolia",
  currency_code: "mnt",
  countries: [
    { iso_2: "mn", iso_3: "mng", display_name: "Mongolia", region_id: "reg_mn", num_code: "496" },
  ],
} as unknown as HttpTypes.StoreRegion

export const listRegions = async () => [MN_REGION]
export const retrieveRegion = async (_id: string) => MN_REGION
export const getRegion = async (_countryCode: string) => MN_REGION
