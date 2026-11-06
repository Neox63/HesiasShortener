export function renderPage(links) {
  const rows = links
    .map(
      (link) => `
      <tr>
        <td><a href="/${link.code}">/${link.code}</a></td>
        <td>${link.url}</td>
        <td>${link.clicks}</td>
      </tr>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><title>Hesias Shortener</title></head>
<body>
  <h1>Hesias Shortener</h1>
  
  
  
  <form method="post" action="/links">
    <input name="url" placeholder="https://......">
    <button type="submit">Raccourcir le lien</button>
  </form>
  
  
  
  
  <table>
    <tr><th>Lien court</th><th>Adresse</th><th>Clics</th></tr>
    ${rows}
  </table>
</body>
</html>`;
}
