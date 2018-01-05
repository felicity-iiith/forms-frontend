export function capitalize(str) {
  return str.replace("_", " ").replace(/(?:^|\s)\S/g, function(a) {
    return a.toUpperCase();
  });
}
