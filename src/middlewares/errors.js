export function notFound(req, res) {
  res.status(404).json({ error: `Route introuvable : ${req.method} ${req.originalUrl}` });
}

export function errorHandler(err, req, res, next) {
  if (err.type === "entity.parse.failed")
    return res.status(400).json({ error: "JSON invalide" });

  const status = err.status ?? 500;

  if (status === 500) console.log(err);

  res.status(status).json({
    error: status === 500 ? "Erreur du serveur" : err.message,
  });
}
