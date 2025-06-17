import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import devtoolsJson from 'vite-plugin-devtools-json';
import commonjs from 'vite-plugin-commonjs';

export default defineConfig({
  plugins: [
    commonjs(),
    reactRouter(),
    tsconfigPaths(),
    devtoolsJson(),
  ]
});
