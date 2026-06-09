import streamDeck, { SingletonAction } from "@elgato/streamdeck";
import type { WillAppearEvent, WillDisappearEvent, KeyDownEvent, DidReceiveSettingsEvent } from "@elgato/streamdeck";
import { DEFAULT_GLOBAL_SETTINGS, type GlobalSettings } from "../core/types.js";

/** Minimal action surface; satisfied by the SDK's KeyAction. */
export interface ActionLike {
  id: string;
  isKey(): boolean;
  setImage(image?: string): Promise<void>;
  setTitle(title: string): Promise<void>;
  showAlert(): Promise<void>;
}

export function svgDataUri(svg: string): string {
  return `data:image/svg+xml;base64,${Buffer.from(svg, "utf-8").toString("base64")}`;
}

/**
 * Base for the polling display keys. Settings are cached from the
 * `didReceiveGlobalSettings` payload; `refresh()` reads the cache and never calls
 * `getGlobalSettings()` (which would echo into the listener and spin a refresh storm).
 */
export abstract class BaseDisplayAction extends SingletonAction {
  /** Fetch data and return the key SVG for the given action instance. Throw to show an error. */
  protected abstract render(settings: GlobalSettings, actionId: string): Promise<string>;
  /** Short label shown in error/needs-config states. */
  protected abstract readonly label: string;
  /** True if this action has the config it needs (default: a host is set). */
  protected needs(settings: GlobalSettings): boolean { return Boolean(settings.host); }
  /**
   * Hook for per-key settings carried in the event payload (never read via getSettings(),
   * which echoes). Subclasses cache what they need, keyed by action id. Default: no-op.
   */
  protected onKeySettings(_actionId: string, _settings: unknown): void {}

  private timers = new Map<string, ReturnType<typeof setInterval>>();
  private settings: GlobalSettings = { ...DEFAULT_GLOBAL_SETTINGS };
  private pendingSelfWrites = 0;

  constructor() {
    super();
    streamDeck.settings.onDidReceiveGlobalSettings((ev) => {
      this.settings = { ...DEFAULT_GLOBAL_SETTINGS, ...(ev.settings as Partial<GlobalSettings>) };
      if (this.pendingSelfWrites > 0) { this.pendingSelfWrites--; return; }
      for (const action of this.actions) {
        const a = action as unknown as ActionLike;
        this.startTimer(a);
        void this.refresh(a);
      }
    });
  }

  override async onWillAppear(ev: WillAppearEvent): Promise<void> {
    const action = ev.action as unknown as ActionLike;
    this.onKeySettings(action.id, ev.payload?.settings);
    this.pendingSelfWrites++;
    const stored = await streamDeck.settings.getGlobalSettings<Partial<GlobalSettings>>();
    this.settings = { ...DEFAULT_GLOBAL_SETTINGS, ...stored };
    this.startTimer(action);
    await this.refresh(action);
  }

  override async onDidReceiveSettings(ev: DidReceiveSettingsEvent): Promise<void> {
    // A per-key setting changed in the Property Inspector — update the cache and repaint.
    const action = ev.action as unknown as ActionLike;
    this.onKeySettings(action.id, ev.payload?.settings);
    await this.refresh(action);
  }

  override onWillDisappear(ev: WillDisappearEvent): void {
    this.clearTimer(ev.action.id);
  }

  override async onKeyDown(ev: KeyDownEvent): Promise<void> {
    await this.refresh(ev.action as unknown as ActionLike);
  }

  private startTimer(action: ActionLike): void {
    this.clearTimer(action.id);
    const ms = Math.max(5, this.settings.refreshSeconds) * 1000;
    this.timers.set(action.id, setInterval(() => void this.refresh(action), ms));
  }

  private clearTimer(id: string): void {
    const t = this.timers.get(id);
    if (t) clearInterval(t);
    this.timers.delete(id);
  }

  private async refresh(action: ActionLike): Promise<void> {
    if (!action.isKey()) return;
    if (!this.needs(this.settings)) {
      streamDeck.logger.info(`${this.label}: not configured`);
      await action.setTitle(`${this.label}\nsetup`);
      return;
    }
    try {
      const svg = await this.render(this.settings, action.id);
      await action.setTitle("");
      await action.setImage(svgDataUri(svg));
      streamDeck.logger.info(`${this.label}: updated`);
    } catch (err) {
      streamDeck.logger.error(`${this.label} refresh failed`, err);
      await action.setTitle(`${this.label}\nerror`);
    }
  }
}
