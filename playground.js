import "dotenv/config";
import { prisma } from "./src/db.js";

// 1. Récupérer tous les liens, triés par code de A à Z.
const q1 = await prisma.link.findMany({
  orderBy: {
    code: "asc",
  },
});

// 2. Récupérer le lien gta6.
const q2 = await prisma.link.findUnique({ where: { code: "gta6" } });

// 3. Les liens dont l'URL contient github.
const q3 = await prisma.link.findMany({ where: { url: { contains: "github" } } });

// 4. Combien de clics en tout, tous liens confondus ?
const q4 = await prisma.click.count();

// 5. Combien de clics pour le lien hesias ?
const q5 = await prisma.click.count({ where: { link: { code: "hesias" } } });

// 6. Combien de clics viennent du referer LinkedIn ?
const q6 = await prisma.click.count({ where: { referer: { contains: "linkedin" } } });
console.log("6.", q6);

// 7. Combien de clics n'ont pas de referer ?
const q7 = await prisma.click.count({ where: { referer: null } });
console.log("7.", q7);

// 8. Combien de clics, tous liens confondus, dans les dernières 24 heures ?
const q8 = await prisma.click.count({
  where: {
    createdAt: {
      gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
  },
});
console.log("8.", q8);

// 9. Récupérer chaque lien avec son nombre de clics, sans charger les clics.
const q9 = await prisma.link.findMany({
  select: {
    code: true,
    _count: {
      select: {
        clicks: true,
      },
    },
  },
});
console.log("9.", q9);

// 10. Les 3 liens les plus cliqués.
const q10 = await prisma.link.findMany({
  orderBy: {
    clicks: {
      _count: "desc",
    },
  },
  take: 3,
});
console.log("10.", q10);

// 11. Les 5 derniers clics du lien hesias.
const q11 = await prisma.link.findMany({
  where: { code: "hesias" },
  orderBy: {
    createdAt: "desc",
  },
  take: 5,
});
console.log("11.", q11);

// 12. Le nombre de clics par referer, tous liens confondus.
const q12 = await prisma.click.groupBy({
  by: ["referer"],
  _count: true,
});
console.log("12.", q12);

// 13. Les liens jamais cliqués.
const q13 = await prisma.link.findMany({ where: { clicks: { none: {} } } });
console.log("13.", q13);

// 14. La page 2 de la liste des liens, 3 par page, triés par code.
const q14 = await prisma.findMany({ orderBy: { code: "asc" }, skip: 3, take: 3 });
console.log("14.", q14);

// 15. Changer l'URL de nodejs à https://nodejs.org/fr.
const q15 = await prisma.link.update({
  where: { code: "nodejs" },
  data: { url: "https://nodejs.org/fr" },
});
console.log("15.", q15);

// 16. Supprimer les clics de plus de 30 jours.
const q16 = await prisma.click.deleteMany({
  where: { createdAt: { lt: new Date(Date.now - 30 * 24 * 60 * 60 * 1000) } },
});
console.log("16.", q16);
