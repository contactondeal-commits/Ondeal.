var fs = require('fs');
var f = fs.readFileSync('src/lib/shopify/storefront.ts', 'utf8');
var old = 'const text = descriptionHtml.replace(/<[^>]+>/g, "\\n").replace(/&nbsp;/g, " ");';
var neu = 'const text = descriptionHtml.replace(/<br\\s*\\/?>/gi,"\\n").replace(/<\\/p>/gi,"\\n").replace(/<\\/li>/gi,"\\n").replace(/<[^>]+>/g,"").replace(/&nbsp;/g," ").replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">");';
f = f.replace(old, neu);
fs.writeFileSync('src/lib/shopify/storefront.ts', f, 'utf8');
console.log('OK');
