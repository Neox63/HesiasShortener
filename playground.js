import "dotenv/config";
import { prisma } from "./src/db.js";

// 1. Récupérer tous les liens, triés par code de A à Z.
const q1 = await prisma.link.findMany({
  orderBy: {
    code: "asc",
  },
});
console.log("1.", q1);

// 2. Récupérer le lien gta6.
const q2 = null;
console.log("2.", q2);

// 3. Les liens dont l'URL contient github.
const q3 = null;
console.log("3.", q3);

// 4. Combien de clics en tout, tous liens confondus ?
const q4 = null;
console.log("4.", q4);

// 5. Combien de clics pour le lien hesias ?
const q5 = null;
console.log("5.", q5);

// 6. Combien de clics viennent du referer LinkedIn ?
const q6 = null;
console.log("6.", q6);

// 7. Combien de clics n'ont pas de referer ?
const q7 = null;
console.log("7.", q7);

// 8. Combien de clics, tous liens confondus, dans les dernières 24 heures ?
const q8 = null;
console.log("8.", q8);

// 9. Récupérer chaque lien avec son nombre de clics, sans charger les clics.
const q9 = null;
console.log("9.", q9);

// 10. Les 3 liens les plus cliqués.
const q10 = null;
console.log("10.", q10);

// 11. Les 5 derniers clics du lien hesias.
const q11 = null;
console.log("11.", q11);

// 12. Le nombre de clics par referer, tous liens confondus.
const q12 = null;
console.log("12.", q12);

// 13. Les liens jamais cliqués.
const q13 = null;
console.log("13.", q13);

// 14. La page 2 de la liste des liens, 3 par page, triés par code.
const q14 = null;
console.log("14.", q14);

// 15. Changer l'URL de nodejs à https://nodejs.org/fr.
const q15 = null;
console.log("15.", q15);

// 16. Supprimer les clics de plus de 30 jours.
const q16 = null;
console.log("16.", q16);
