const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

const OPENAI_KEY = 'pk_V7wcLz_0139a8ffdddd299e4967acf18c752864b7';
const INPUT_FILE = 'products.xlsx'; // renomme ton fichier téléchargé si besoin

async function translate(text) {
  if (!text || text.trim() === '') return '';
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'Tu es un traducteur expert. Traduis en français naturel et commercial. Pour le HTML, traduis uniquement le texte visible, garde les balises intactes. Réponds uniquement avec la traduction, sans commentaire.' },
        { role: 'user', content: text }
      ],
      max_tokens: 1000
    })
  });
  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() || text;
}

async function main() {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(INPUT_FILE);
  const sheet = workbook.getWorksheet('Products');
  
  // Trouver les colonnes
  const headerRow = sheet.getRow(1);
  let titleCol, bodyCol;
  headerRow.eachCell((cell, col) => {
    if (cell.value === 'Title') titleCol = col;
    if (cell.value === 'Body HTML') bodyCol = col;
  });
  
  console.log(`Colonnes: Title=${titleCol}, Body HTML=${bodyCol}`);
  console.log(`Total lignes: ${sheet.rowCount}`);
  
  let count = 0;
  for (let i = 2; i <= sheet.rowCount; i++) {
    const row = sheet.getRow(i);
    const title = row.getCell(titleCol).value;
    const body = row.getCell(bodyCol).value;
    
    if (title) {
      const translatedTitle = await translate(String(title));
      row.getCell(titleCol).value = translatedTitle;
    }
    if (body) {
      const translatedBody = await translate(String(body));
      row.getCell(bodyCol).value = translatedBody;
    }
    
    row.commit();
    count++;
    if (count % 10 === 0) console.log(`✓ ${count} produits traduits...`);
    
    // Pause pour éviter rate limit
    await new Promise(r => setTimeout(r, 500));
  }
  
  await workbook.xlsx.writeFile('products_fr.xlsx');
  console.log('✅ Terminé ! Fichier: products_fr.xlsx');
}

main().catch(console.error);
