const h = "<h1>SPÉCIFICATIONS</h1><h1>PGY Caractéristiques : Semi-fermé</h1><h1>Numéro de modèle : QTHXP169LM412</h1>";
const t = h.replace(/<h[1-6][^>]*>/gi,"\n").replace(/<\/h[1-6]>/gi,"\n").replace(/<[^>]+>/g,"");
const lines = t.split("\n").map(l=>l.trim()).filter(l=>l.length>3);
console.log(JSON.stringify(lines));
