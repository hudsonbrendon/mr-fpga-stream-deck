import streamDeck, { LogLevel } from "@elgato/streamdeck";
import { NowPlayingAction } from "./actions/now-playing-action.js";
import { SystemAction } from "./actions/system-action.js";
import { RetroAchievementsAction } from "./actions/retroachievements-action.js";

streamDeck.logger.setLevel(LogLevel.INFO);

streamDeck.actions.registerAction(new NowPlayingAction());
streamDeck.actions.registerAction(new SystemAction());
streamDeck.actions.registerAction(new RetroAchievementsAction());

streamDeck.connect();
