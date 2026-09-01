const ExcelJS = require('exceljs');

async function main() {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile('products.xlsx');
  const sheet = workbook.getWorksheet('Products');

  const headerRow = sheet.getRow(1);
  let titleCol;
  headerRow.eachCell((cell, col) => {
    if (cell.value === 'Title') titleCol = col;
  });

  let english = 0, french = 0;
  const englishExamples = [];

  for (let i = 2; i <= sheet.rowCount; i++) {
    const row = sheet.getRow(i);
    const title = String(row.getCell(titleCol).value || '');
    const frenchWords = /\b(pour|avec|de |du |des |les |une |par |et |en |sur |dans |idéal|facile|grand)\b/i;
    if (frenchWords.test(title)) {
      french++;
    } else {
      english++;
      if (englishExamples.length < 5) englishExamples.push(title);
    }
  }

  console.log(`✅ Français: ${french}`);
  console.log(`❌ Anglais/autre: ${english}`);
  console.log('\nExemples non traduits:');
  englishExamples.forEach(t => console.log(' -', t));
}

main().catch(console.error);
