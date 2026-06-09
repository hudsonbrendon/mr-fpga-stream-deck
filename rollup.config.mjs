import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

const sdPlugin = "com.hudsonbrendon.mister.sdPlugin";

export default {
  input: "src/plugin.ts",
  output: {
    file: `${sdPlugin}/bin/plugin.js`,
    sourcemap: true,
    sourcemapPathTransform: (rel) => (rel.startsWith("../") ? rel.slice(3) : rel),
  },
  plugins: [
    typescript({ tsconfig: "./tsconfig.json" }),
    nodeResolve({ browser: false, exportConditions: ["node"], preferBuiltins: true }),
    commonjs(),
  ],
  external: ["ssh2", "node:fs", "node:os", "node:path", "node:crypto", "node:net", "node:stream", "node:util", "node:events", "node:buffer", "node:zlib", "node:child_process"],
};
