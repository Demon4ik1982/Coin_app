export function getPage(array, pageNumber, rowsToShow) {
  const totalItems = array.length;
  const totalPages = Math.ceil(totalItems / rowsToShow);

  if (pageNumber < 1 || pageNumber > totalPages) {
      return [];
  }

  const end = totalItems - (pageNumber - 1) * rowsToShow;
  const start = Math.max(0, end - rowsToShow);

  return array.slice(start, end);
}
