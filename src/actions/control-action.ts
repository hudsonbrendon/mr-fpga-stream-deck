import streamDeck, { SingletonAction, action } from "@elgato/streamdeck";
import type { WillAppearEvent, KeyDownEvent, DidReceiveSettingsEvent } from "@elgato/streamdeck";
import { MrFpgaRest } from "../mister/rest.js";
import { renderControl } from "../core/render.js";
import { DEFAULT_GLOBAL_SETTINGS, type ControlKind, type ControlSettings, type GlobalSettings } from "../core/types.js";
import { svgDataUri, type ActionLike } from "./base-display-action.js";

@action({ UUID: "com.hudsonbrendon.mrfpga.control" })
export class ControlAction extends SingletonAction {
  private kinds = new Map<string, ControlKind>();
  private paths = new Map<string, string | undefined>();

  private async global(): Promise<GlobalSettings> {
    const stored = await streamDeck.settings.getGlobalSettings<Partial<GlobalSettings>>();
    return { ...DEFAULT_GLOBAL_SETTINGS, ...stored };
  }

  private remember(id: string, s: ControlSettings | undefined): ControlKind {
    const kind = s?.kind ?? "menu";
    this.kinds.set(id, kind);
    this.paths.set(id, s?.launchPath);
    return kind;
  }

  override async onWillAppear(ev: WillAppearEvent): Promise<void> {
    const settings = ev.payload.settings as ControlSettings | undefined;
    const kind = this.remember(ev.action.id, settings);
    await (ev.action as unknown as ActionLike).setImage(svgDataUri(renderControl(kind)));
  }

  override async onDidReceiveSettings(ev: DidReceiveSettingsEvent): Promise<void> {
    const settings = ev.payload.settings as ControlSettings | undefined;
    const kind = this.remember(ev.action.id, settings);
    await (ev.action as unknown as ActionLike).setImage(svgDataUri(renderControl(kind)));
  }

  override async onKeyDown(ev: KeyDownEvent): Promise<void> {
    const a = ev.action as unknown as ActionLike;
    const settings = ev.payload.settings as ControlSettings | undefined;
    const kind = this.kinds.get(ev.action.id) ?? this.remember(ev.action.id, settings);
    const globalSettings = await this.global();
    if (!globalSettings.host) { await a.showAlert(); return; }
    try {
      await new MrFpgaRest(globalSettings.host, globalSettings.port).runControl(kind, this.paths.get(ev.action.id));
      await ev.action.showOk();
    } catch (err) {
      streamDeck.logger.error(`control ${kind} failed`, err);
      await a.showAlert();
    }
  }
}
