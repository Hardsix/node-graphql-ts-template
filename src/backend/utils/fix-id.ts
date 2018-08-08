export function fixId(input) {
  input.id = input.id && parseInt(input.id, 10);
}
