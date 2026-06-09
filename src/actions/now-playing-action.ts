import { action } from "@elgato/streamdeck";
import { BaseDisplayAction } from "./base-display-action.js";
import { MisterRest } from "../mister/rest.js";
import { renderNowPlaying } from "../core/render.js";
import type { GlobalSettings } from "../core/types.js";

@action({ UUID: "com.hudsonbrendon.mrfpga.nowplaying" })
export class NowPlayingAction extends BaseDisplayAction {
  protected readonly label = "mrfpga";
  protected async render(s: GlobalSettings): Promise<string> {
    const rest = new MisterRest(s.host!, s.port);
    return renderNowPlaying(await rest.getStatus());
  }
}
