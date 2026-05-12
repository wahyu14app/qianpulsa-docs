import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'fs';
import path from 'path';

function generateRawIndexPlugin() {
  return {
    name: 'generate-raw-index',
    writeBundle() {
      const getFiles = (dir: string, fileList: string[] = []) => {
        if (!fs.existsSync(dir)) return fileList;
        const files = fs.readdirSync(dir);
        for (const file of files) {
          const name = path.join(dir, file);
          if (fs.statSync(name).isDirectory()) {
            getFiles(name, fileList);
          } else if (name.endsWith('.md')) {
            fileList.push(name);
          }
        }
        return fileList;
      };

      const docsDir = path.resolve('docs');
      const files = getFiles(docsDir).map(file => {
        return path.relative(path.resolve('.'), file).replace(/\\/g, '/');
      });

      const rootDocs = getFiles(path.resolve('.')).filter(f => path.dirname(f) === path.resolve('.') && f.endsWith('.md')).map(f => {
        return path.relative(path.resolve('.'), f).replace(/\\/g, '/');
      });
      
      const allFiles = [...rootDocs, ...files];

      let htmlContent = '<!DOCTYPE html>\n<html>\n<head>\n<title>QianPulsa Raw Files Index</title>\n</head>\n<body style="font-family: monospace;">\n';
      htmlContent += '<h1>QianPulsa Documentation Folder Tree</h1>\n<ul>\n';
      allFiles.forEach(file => {
        htmlContent += `<li><a href="https://raw.githubusercontent.com/wahyu14app/qianpulsa-docs/main/${file}">/${file}</a></li>\n`;
      });
      htmlContent += '</ul>\n</body>\n</html>';

      const outputDir = path.resolve('dist/raw');
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      fs.writeFileSync(path.join(outputDir, 'index.html'), htmlContent);
      fs.writeFileSync(path.join(outputDir, 'data.json'), JSON.stringify(allFiles, null, 2));
    }
  };
}

export default defineConfig({
  base: './',
  plugins: [
    react(),
    tailwindcss(),
    generateRawIndexPlugin(),
  ],
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
});
