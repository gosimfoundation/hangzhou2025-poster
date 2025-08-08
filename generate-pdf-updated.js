// PDF generation with forced CSS updates
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function generateUpdatedPDF() {
  let browser;
  
  try {
    console.log('🚀 Starting PDF generation with forced CSS updates...');
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox',
        '--force-device-scale-factor=1',
        '--disable-cache',
        '--disable-application-cache'
      ]
    });

    const page = await browser.newPage();
    
    // Capture console logs from the page
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    
    // Disable cache
    await page.setCacheEnabled(false);
    
    await page.setViewport({ 
      width: 480,
      height: 800,
      deviceScaleFactor: 1
    });
    
    console.log('🌐 Loading page...');
    await page.goto('http://localhost:4322', { 
      waitUntil: ['networkidle0', 'domcontentloaded'],
      timeout: 60000 
    });
    
    console.log('📜 Loading all content...');
    await page.evaluate(async () => {
      const distance = 200;
      const delay = 100;
      const height = document.body.scrollHeight;
      
      for (let i = 0; i <= height; i += distance) {
        window.scrollTo(0, i);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      window.scrollTo(0, 0);
    });
    
    await page.evaluate(() => {
      return Promise.all(
        Array.from(document.images)
          .filter(img => !img.complete)
          .map(img => new Promise(resolve => {
            img.onload = img.onerror = resolve;
          }))
      );
    });
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Apply styles one more time after everything loads
    await page.evaluate(() => {
      console.log('=== FINAL STYLE APPLICATION ===');
      const allEnglish = document.querySelectorAll('.english');
      console.log('Final check - found English elements:', allEnglish.length);
      allEnglish.forEach((el, i) => {
        el.style.setProperty('font-size', '0.5rem', 'important');
        if (i === 0) {
          console.log('Final English font-size:', window.getComputedStyle(el).fontSize);
        }
      });
    });

    console.log('🔧 Applying CSS updates for highlight boxes...');
    const finalHeight = await page.evaluate(() => {
      // Hide export buttons
      ['.pdf-button-wrapper', '.html-archive-wrapper', '.vector-pdf-wrapper']
        .forEach(sel => {
          const el = document.querySelector(sel);
          if (el) el.style.display = 'none';
        });

      // Force rounder boxes, reduce gap, make taller with same height, and remove border
      const highlightBoxes = document.querySelectorAll('.highlight-box');
      highlightBoxes.forEach(box => {
        box.style.borderRadius = '200px';
        box.style.gap = '0.3rem';
        box.style.padding = '1.8rem 1rem';
        box.style.minHeight = '120px';
        box.style.height = '120px';
        box.style.border = 'none';
      });
      
      // FORCE UPDATE HIGHLIGHT BOX TEXT SIZES - LARGER
      const highlightChinese = document.querySelectorAll('.highlights-section .chinese');
      console.log('Found Chinese elements:', highlightChinese.length);
      highlightChinese.forEach(el => {
        el.style.fontSize = '1.3rem';
        el.style.fontWeight = '600';
        el.style.setProperty('font-size', '1.3rem', 'important');
        el.style.whiteSpace = 'nowrap';
      });
      
      // Try multiple selectors for English text
      const highlightEnglish1 = document.querySelectorAll('.highlights-section .english');
      const highlightEnglish2 = document.querySelectorAll('.highlight-box .english');
      const highlightEnglish3 = document.querySelectorAll('.english');
      
      console.log('Found English elements (.highlights-section .english):', highlightEnglish1.length);
      console.log('Found English elements (.highlight-box .english):', highlightEnglish2.length);
      console.log('Found English elements (.english):', highlightEnglish3.length);
      
      // Check what the current styles are
      if (highlightEnglish1.length > 0) {
        const computed = window.getComputedStyle(highlightEnglish1[0]);
        console.log('Current English font-size before change:', computed.fontSize);
        console.log('Current English element HTML:', highlightEnglish1[0].outerHTML);
        console.log('Current English parent classes:', highlightEnglish1[0].parentElement.className);
      }
      
      // Apply to all possible English text elements
      [...highlightEnglish1, ...highlightEnglish2, ...highlightEnglish3].forEach((el, index) => {
        // Clear any existing inline styles first
        el.style.removeProperty('font-size');
        // Then set new value
        el.style.setProperty('font-size', '0.5rem', 'important');
        el.style.setProperty('line-height', '1.1', 'important');
        
        if (index === 0) {
          const afterComputed = window.getComputedStyle(el);
          console.log('English font-size after change:', afterComputed.fontSize);
        }
      });
      
      // Also update the numbers if needed
      const highlightNumbers = document.querySelectorAll('.highlights-section .number');
      highlightNumbers.forEach(el => {
        el.style.fontSize = '2.5rem';
      });

      // Fix speaker layout with LEFT alignment and alternating backgrounds
      const speakers = document.querySelectorAll('.speaker-poster');
      speakers.forEach((speaker, index) => {
        // Apply alternating backgrounds (non-transparent)
        if (speaker.classList.contains('bg-pink')) {
          speaker.style.backgroundColor = 'rgb(255, 230, 240)';
        } else if (speaker.classList.contains('bg-white')) {
          speaker.style.backgroundColor = 'rgb(255, 255, 255)';
        }
        speaker.style.borderRadius = '15px';
        
        const header = speaker.querySelector('.speaker-header');
        if (!header) return;
        
        header.style.display = 'flex';
        header.style.alignItems = 'flex-start';
        header.style.gap = '1rem';
        
        if (speaker.classList.contains('photo-right')) {
          header.style.flexDirection = 'row-reverse';
        } else {
          header.style.flexDirection = 'row';
        }
        
        const photo = speaker.querySelector('.speaker-photo');
        if (photo) {
          photo.style.flexShrink = '0';
          photo.style.width = '60px';
          photo.style.height = '60px';
          photo.style.borderRadius = '20px';
        }
        
        const placeholder = speaker.querySelector('.speaker-photo-placeholder');
        if (placeholder) {
          placeholder.style.flexShrink = '0';
          placeholder.style.width = '60px';
          placeholder.style.height = '60px';
          placeholder.style.borderRadius = '20px';
        }
        
        const info = speaker.querySelector('.speaker-info');
        if (info) {
          info.style.flex = '1';
          info.style.minWidth = '0';
          info.style.display = 'flex';
          info.style.flexDirection = 'column';
          info.style.textAlign = 'left';
          info.style.alignItems = 'flex-start';
        }
        
        const name = info?.querySelector('h2');
        if (name) {
          name.style.margin = '0 0 0.25rem 0';
          name.style.width = '100%';
          name.style.textAlign = 'left';
        }
        
        const role = speaker.querySelector('.speaker-role');
        if (role) {
          role.style.width = '100%';
          role.style.marginTop = '0.2rem';
          role.style.marginBottom = '0.3rem';
          role.style.textAlign = 'left';
        }
        
        const talkTitle = header?.querySelector('.talk-title');
        if (talkTitle) {
          talkTitle.style.width = '100%';
          talkTitle.style.marginTop = '0.5rem';
          talkTitle.style.textAlign = 'left';
        }
      });

      // Fix white strips
      const wrapper = document.querySelector('.page-wrapper');
      const body = document.body;
      const html = document.documentElement;
      
      [html, body].forEach(el => {
        el.style.width = '480px';
        el.style.minWidth = '480px';
        el.style.maxWidth = '480px';
        el.style.margin = '0';
        el.style.padding = '0';
        el.style.overflow = 'hidden';
      });

      if (wrapper) {
        wrapper.style.width = '480px';
        wrapper.style.minWidth = '480px';
        wrapper.style.maxWidth = '480px';
        wrapper.style.margin = '0 auto';
        wrapper.style.padding = '0';
      }

      return wrapper ? wrapper.scrollHeight : body.scrollHeight;
    });

    // Inject CSS to force highlight text sizes
    await page.addStyleTag({
      content: `
        /* Force rounder boxes, reduce gap, uniform height, and no border */
        .highlight-box {
          border-radius: 200px !important;
          gap: 0.3rem !important;
          padding: 1.8rem 1rem !important;
          min-height: 120px !important;
          height: 120px !important;
          border: none !important;
        }
        
        .highlight-box::after {
          display: none !important;
        }
        
        /* FORCE HIGHLIGHT TEXT SIZES - LARGER */
        .highlights-section .chinese {
          font-size: 1.3rem !important;
          font-weight: 600 !important;
          white-space: nowrap !important;
        }
        
        .highlights-section .english,
        .highlight-box .english,
        .english {
          font-size: 0.5rem !important;
          line-height: 1.1 !important;
        }
        
        .highlights-section .number {
          font-size: 2.5rem !important;
        }
        
        /* Speaker box alternating backgrounds */
        .speaker-poster {
          border-radius: 15px !important;
        }
        
        .speaker-poster.bg-white {
          background-color: rgb(255, 255, 255) !important;
        }
        
        .speaker-poster.bg-pink {
          background-color: rgb(255, 230, 240) !important;
        }
        
        /* Speaker alignment */
        .speaker-header {
          display: flex !important;
          align-items: flex-start !important;
          gap: 1rem !important;
        }
        
        .speaker-poster.photo-left .speaker-header {
          flex-direction: row !important;
        }
        
        .speaker-poster.photo-right .speaker-header {
          flex-direction: row-reverse !important;
        }
        
        .speaker-info {
          flex: 1 !important;
          min-width: 0 !important;
          display: flex !important;
          flex-direction: column !important;
          text-align: left !important;
          align-items: flex-start !important;
        }
        
        .speaker-info h2,
        .speaker-role,
        .talk-title {
          text-align: left !important;
          width: 100% !important;
        }
        
        .speaker-photo,
        .speaker-photo-placeholder {
          flex-shrink: 0 !important;
          width: 60px !important;
          height: 60px !important;
          border-radius: 20px !important;
        }
        
        html, body {
          width: 480px !important;
          min-width: 480px !important;
          max-width: 480px !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        
        .page-wrapper {
          width: 480px !important;
          min-width: 480px !important;
          max-width: 480px !important;
          margin: 0 auto !important;
          padding: 0 !important;
        }
      `
    });

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const outputPath = path.join(__dirname, `GOSIM-Updated-${timestamp}.pdf`);
    
    console.log(`📏 Dimensions: 480px x ${finalHeight}px`);
    console.log('📝 Generating PDF with updated styles...');
    
    await page.pdf({
      path: outputPath,
      printBackground: true,
      scale: 1,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      width: '480px',
      height: `${finalHeight}px`,
      preferCSSPageSize: false,
      displayHeaderFooter: false,
      pageRanges: '1'
    });

    console.log(`✅ PDF generated with updated highlight text sizes!`);
    console.log(`📍 Location: ${outputPath}`);
    
    const stats = fs.statSync(outputPath);
    const fileSizeInKB = (stats.size / 1024).toFixed(2);
    console.log(`📊 File size: ${fileSizeInKB} KB`);
    
    return outputPath;
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
      console.log('🔒 Browser closed');
    }
  }
}

console.log('=' .repeat(70));
console.log('GOSIM PDF Generator - Updated Version with Forced CSS');
console.log('=' .repeat(70));
console.log('🔧 This version forces:');
console.log('• Highlight Chinese text: 1.3rem (larger, more readable)');
console.log('• Highlight English text: 0.5rem (8px - very small)');
console.log('• Highlight numbers: 2.5rem');
console.log('• Left-aligned speaker text');
console.log('=' .repeat(70));

generateUpdatedPDF()
  .then(path => {
    console.log('=' .repeat(70));
    console.log('✨ PDF generated with forced CSS updates!');
  })
  .catch(error => {
    console.error('Failed:', error);
    process.exit(1);
  });