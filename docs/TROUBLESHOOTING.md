# Troubleshooting

| Symptom | Cause / fix |
|---------|-------------|
| Key shows `mister\nsetup` | No MiSTer host set. Add the IP in the Property Inspector. |
| Now Playing shows `OFFLINE` | MiSTer unreachable on `:8182`. Check the IP, that it's powered on, and that the mrext Remote service is running. |
| System key shows `system\nerror` | SSH failed. Check user/password/port (stock `root`/`1`/`22`) and that SSH is enabled on the MiSTer. |
| RetroAchievements shows `retro\nsetup` or `error` | Missing/invalid RA username or Web API key (get the key at retroachievements.org/settings). |
| Control key does nothing / flashes ✗ | No host set, or the action failed — see `logs/*.log`. Launch needs a valid `Launch path`. |
| Key stuck on default image | The plugin process didn't reload — remove/re-add the key, or `npx streamdeck restart com.hudsonbrendon.mister`. |
