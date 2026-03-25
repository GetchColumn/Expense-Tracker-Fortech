import { validationResult } from 'express-validator';

export function validateRequestSchema(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).send({ error: errors.array() });
  }

  next();
}