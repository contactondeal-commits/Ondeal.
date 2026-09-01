const ExcelJS = require('exceljs');
const OPENAI_KEY = 'pk_V7wcLz_0139a8ffdddd299e4967acf18c752864b7';

async function translate(text) {
  if (!text || text.trim() === '') return '';
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENAI_KEY}` },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'Si le texte est déjà en français, retourne-le tel quel. Sinon traduis-le en français naturel et commercial. Pour le HTML, traduis uniquement le texte visible. Réponds uniquement avec le résultat, sans commentaire.' },
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
  await workbook.xlsx.readFile('products_new.xlsx');
  const sheet = workbook.getWorksheet('Products');

  const headerRow = sheet.getRow(1);
  let titleCol, bodyCol;
  headerRow.eachCell((cell, col) => {
    if (cell.value === 'Title') titleCol = col;
    if (cell.value === 'Body HTML') bodyCol = col;
  });

  for (let i = 2; i <= sheet.rowCount; i++) {
    const row = sheet.getRow(i);
    const title = String(row.getCell(titleCol).value || '');
    const body = String(row.getCell(bodyCol).value || '');

    row.getCell(titleCol).value = await translate(title);
    if (body) row.getCell(bodyCol).value = await translate(body);
    row.commit();

    if ((i - 1) % 10 === 0) console.log(`✓ ${i - 1} / ${sheet.rowCount - 1} produits...`);
    await new Promise(r => setTimeout(r, 500));
  }

  await workbook.xlsx.writeFile('products_final2.xlsx');
  console.log('✅ Terminé ! Fichier: products_final2.xlsx');
}

main().catch(console.error);
