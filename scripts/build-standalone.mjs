import { build } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

async function buildStandalone() {
  console.log('Building standalone single-file index.html for htdocs/bill/...');
  await build({
    root: rootDir,
    configFile: false,
    base: './',
    resolve: {
      alias: {
        '@': rootDir,
      },
    },
    plugins: [
      react(),
      tailwindcss(),
      viteSingleFile({ removeViteModuleLoader: true })
    ],
    build: {
      target: 'es2020',
      minify: 'esbuild',
      cssMinify: 'esbuild',
      outDir: path.resolve(rootDir, 'dist/standalone'),
      emptyOutDir: true,
      rollupOptions: {
        output: {
          inlineDynamicImports: true,
          manualChunks: undefined,
        }
      }
    }
  });

  const generatedPath = path.resolve(rootDir, 'dist/standalone/index.html');
  if (fs.existsSync(generatedPath)) {
    let htmlContent = fs.readFileSync(generatedPath, 'utf-8');

    // Inline pakistan_grid_network.webp as base64 data URI
    const imgPath = path.resolve(rootDir, 'src/assets/images/pakistan_grid_network.webp');
    if (fs.existsSync(imgPath)) {
      const imgBase64 = fs.readFileSync(imgPath).toString('base64');
      const dataUri = `data:image/webp;base64,${imgBase64}`;
      htmlContent = htmlContent.replaceAll('/src/assets/images/pakistan_grid_network.webp', dataUri);
      htmlContent = htmlContent.replace(/["'][^"']*pakistan_grid_network[^"']*\.webp["']/g, `"${dataUri}"`);
    }

    // Save standalone file
    const publicDir = path.resolve(rootDir, 'public');
    if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
    
    const publicPath = path.resolve(publicDir, 'standalone_bill_index.html');
    fs.writeFileSync(publicPath, htmlContent, 'utf-8');
    fs.writeFileSync(generatedPath, htmlContent, 'utf-8');

    const sizeKb = (fs.statSync(publicPath).size / 1024).toFixed(1);
    console.log(`SUCCESS: 100% Self-Contained standalone index.html created (${sizeKb} KB) at: ${publicPath}`);
  }
}

buildStandalone().catch(err => {
  console.error('Build error:', err);
  process.exit(1);
});
