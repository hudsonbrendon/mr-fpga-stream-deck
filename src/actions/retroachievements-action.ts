import { action } from "@elgato/streamdeck";
import { BaseDisplayAction } from "./base-display-action.js";
import { fetchRaStats } from "../mister/ra.js";
import { renderRa } from "../core/render.js";
import type { GlobalSettings } from "../core/types.js";

@action({ UUID: "com.hudsonbrendon.mrfpga.retroachievements" })
export class RetroAchievementsAction extends BaseDisplayAction {
  protected readonly label = "retro";
  protected needs(s: GlobalSettings): boolean { return Boolean(s.raUsername && s.raApiKey); }
  protected async render(s: GlobalSettings, _actionId: string): Promise<string> {
    return renderRa(await fetchRaStats(s.raUsername!, s.raApiKey!));
  }
}
