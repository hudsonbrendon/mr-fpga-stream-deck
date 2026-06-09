import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const out = "com.hudsonbrendon.mister.sdPlugin/imgs";
mkdirSync(join(out, "plugin"), { recursive: true });
mkdirSync(join(out, "actions"), { recursive: true });

/** [svg source, output path (no ext), base px] */
const jobs = [
  ["assets/plugin-icon.svg", "plugin/icon", 28],
  ["assets/category-icon.svg", "plugin/category", 28],
  ["assets/nowplaying.svg", "actions/nowplaying", 20],
  ["assets/system.svg", "actions/system", 20],
  ["assets/ra.svg", "actions/ra", 20],
  ["assets/control.svg", "actions/control", 20],
  ["assets/nowplaying.svg", "actions/nowplaying-key", 72],
  ["assets/system.svg", "actions/system-key", 72],
  ["assets/ra.svg", "actions/ra-key", 72],
  ["assets/control.svg", "actions/control-key", 72],
];

for (const [src, dest, size] of jobs) {
  await sharp(src).resize(size, size).png().toFile(join(out, `${dest}.png`));
  await sharp(src).resize(size * 2, size * 2).png().toFile(join(out, `${dest}@2x.png`));
  console.log(`rendered ${dest} (${size}px, ${size * 2}px@2x)`);
}
