export function validateComplianceRequest(body) {
  const errors = [];
  const requiredStr = ['sourceCountry', 'destinationCountry'];
  requiredStr.forEach(k => {
    if (!body[k] || typeof body[k] !== 'string') errors.push(`Invalid ${k}`);
  });
  if (!Array.isArray(body.products) || body.products.length === 0) {
    errors.push('products must be a non-empty array');
  } else {
    body.products.forEach((p, i) => {
      if (!p || typeof p.name !== 'string' || p.name.trim() === '') errors.push(`products[${i}].name invalid`);
      if (p.hsCode && typeof p.hsCode !== 'string') errors.push(`products[${i}].hsCode must be string`);
      if (typeof p.weightKg !== 'number' || !(p.weightKg >= 0)) errors.push(`products[${i}].weightKg invalid`);
      if (typeof p.volumeM3 !== 'number' || !(p.volumeM3 >= 0)) errors.push(`products[${i}].volumeM3 invalid`);
    });
  }
  return errors;
}


