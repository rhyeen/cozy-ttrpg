import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import commonjs from 'vite-plugin-commonjs';
import * as path from 'path';

export default defineConfig({
  plugins: [
    commonjs(),
    reactRouter(),
    tsconfigPaths(),
  ],
  resolve: {
    alias:{
      '@rhyeen/cozy-ttrpg-shared': path.resolve(__dirname, './shared/src/index.ts'),
    },
  }
});
