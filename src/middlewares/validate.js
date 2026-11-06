export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body ?? {});

  if (!result.success) {
    const details = result.error.issues.map((i) => ({
      field: i.path.join("."),
      message: i.message,
    }));

    return res.status(400).json({
      error: "Données invalides",
      details,
    });
  }

  req.body = result.data;
  next();
};
