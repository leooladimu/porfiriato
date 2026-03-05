import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function generateOGImage() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1200, height: 630 });
  await page.goto(`file://${join(__dirname, '../public/og-image.html')}`, {
    waitUntil: 'networkidle0'
  });
  
  await page.screenshot({
    path: join(__dirname, '../public/og-image.png'),
    type: 'png'
  });
  
  console.log('✅ OG image generated successfully at public/og-image.png');
  await browser.close();
}

generateOGImage().catch(console.error);
