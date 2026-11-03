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
  console.log('Building 100% standalone single-file index.html from scratch...');
  
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
  if (!fs.existsSync(generatedPath)) {
    throw new Error('Vite singlefile failed to generate index.html');
  }

  let htmlContent = fs.readFileSync(generatedPath, 'utf-8');

  // Verify that it starts with <!doctype html> or <!DOCTYPE html>
  if (!htmlContent.trim().toLowerCase().startsWith('<!doctype html>')) {
    htmlContent = '<!DOCTYPE html>\n' + htmlContent;
  }

  // Set required title
  htmlContent = htmlContent.replace(/<title>[\s\S]*?<\/title>/i, '<title>Pakistan Utility Companies Directory</title>');

  // Change <script type="module" crossorigin> to classic <script>
  // This allows the file to run offline when double-clicked (file://) without CORS restriction
  htmlContent = htmlContent.replace(/<script\s+type=["']module["']\s+crossorigin>/gi, '<script>');

  // Safely inline pakistan_grid_network.webp as base64 using split.join (NO REGEX REPLACE BUG)
  const imgPath = path.resolve(rootDir, 'src/assets/images/pakistan_grid_network.webp');
  if (fs.existsSync(imgPath)) {
    const imgBase64 = fs.readFileSync(imgPath).toString('base64');
    const dataUri = `data:image/webp;base64,${imgBase64}`;
    
    // Find all references to the image
    const matches = [...htmlContent.matchAll(/["'][^"']*pakistan_grid_network[^"']*\.webp["']/g)];
    for (const m of matches) {
      htmlContent = htmlContent.split(m[0]).join(`"${dataUri}"`);
    }
    htmlContent = htmlContent.split('/src/assets/images/pakistan_grid_network.webp').join(dataUri);
  }

  // Ensure strict <!DOCTYPE html> header
  if (!htmlContent.trim().startsWith('<!DOCTYPE html>')) {
    htmlContent = htmlContent.replace(/^<!doctype html>/i, '<!DOCTYPE html>');
  }

  // Final check: MUST start with <!DOCTYPE html>
  if (!htmlContent.trim().startsWith('<!DOCTYPE html>')) {
    throw new Error('FATAL: Generated HTML does not start with <!DOCTYPE html>');
  }

  // Save to target locations
  const publicDir = path.resolve(rootDir, 'public');
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
  
  const publicIndexPath = path.resolve(publicDir, 'index.html');
  const publicStandalonePath = path.resolve(publicDir, 'standalone_bill_index.html');

  fs.writeFileSync(publicIndexPath, htmlContent, 'utf-8');
  fs.writeFileSync(publicStandalonePath, htmlContent, 'utf-8');
  fs.writeFileSync(generatedPath, htmlContent, 'utf-8');

  const sizeKb = (fs.statSync(publicIndexPath).size / 1024).toFixed(1);
  console.log(`SUCCESS: 100% Valid HTML5 standalone index.html created (${sizeKb} KB)`);
  console.log(`Starts with: ${htmlContent.slice(0, 50).replace(/\n/g, ' ')}...`);
  console.log(`- Saved to ${publicIndexPath}`);
  console.log(`- Saved to ${publicStandalonePath}`);
}

buildStandalone().catch(err => {
  console.error('Build error:', err);
  process.exit(1);
});
