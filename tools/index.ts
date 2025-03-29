/**
 * Turn a string value into normalized slug value
 */
export function createSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[\s&.,'()]/g, '-') // Replace spaces, special chars with hyphen
    .replace(/-+/g, '-') // Replace multiple hyphens with a single one
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ''); // Remove diacritical marks
}
