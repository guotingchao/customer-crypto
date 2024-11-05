// import { config } from "@tamagui/config/v3";
import { createTamagui } from "tamagui";
import * as themes from "./theme-output";
import { tokens, config } from "@tamagui/config/v3";

export const tamaguiConfig = createTamagui({
  // ...config,
  ...config,
  themes,
  tokens,
});
export default tamaguiConfig;

export type Conf = typeof tamaguiConfig;

declare module "tamagui" {
  interface TamaguiCustomConfig extends Conf {}
}
