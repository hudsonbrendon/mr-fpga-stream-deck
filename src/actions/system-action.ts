import { action } from "@elgato/streamdeck";
import { BaseDisplayAction } from "./base-display-action.js";
import { probeTelemetry } from "../mrfpga/ssh.js";
import { renderSystem } from "../core/render.js";
import type { GlobalSettings, SystemKeySettings, SystemMetric } from "../core/types.js";

@action({ UUID: "com.hudsonbrendon.mrfpga.system" })
export class SystemAction extends BaseDisplayAction {
  protected readonly label = "system";

  /** Per-key metric choice, cached from each instance's settings (keyed by action.id). */
  private metrics = new Map<string, SystemMetric>();

  protected override onKeySettings(actionId: string, settings: unknown): void {
    this.metrics.set(actionId, (settings as SystemKeySettings | undefined)?.metric ?? "all");
  }

  protected async render(s: GlobalSettings, actionId: string): Promise<string> {
    const t = await probeTelemetry(s.host!, s.sshPort, s.sshUser, s.sshPassword);
    return renderSystem(t, this.metrics.get(actionId) ?? "all");
  }
}
