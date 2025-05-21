import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import * as path from 'path';

export default defineConfig({
  plugins: [reactRouter(), tsconfigPaths()],
  resolve: {
    // @NOTE: For the shared package
    preserveSymlinks: true,
    alias:{
      // @NOTE: This should work for both local when symlinked and when published, since it's the same file either way.
      // '@rhyeen/cozy-ttrpg-shared' : path.resolve(__dirname, './node_modules/@rhyeen/cozy-ttrpg-shared/dist/index.js'),
    },
  },
});
