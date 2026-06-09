import { action } from "@elgato/streamdeck";
import { BaseDisplayAction } from "./base-display-action.js";
import { probeTelemetry } from "../mister/ssh.js";
import { renderSystem } from "../core/render.js";
import type { GlobalSettings } from "../core/types.js";

@action({ UUID: "com.hudsonbrendon.mrfpga.system" })
export class SystemAction extends BaseDisplayAction {
  protected readonly label = "system";
  protected async render(s: GlobalSettings): Promise<string> {
    const t = await probeTelemetry(s.host!, s.sshPort, s.sshUser, s.sshPassword);
    return renderSystem(t);
  }
}
