export function history(
  posts: { date: Date; active: boolean }[],
): { month: number; year: number; count: number }[] {
  const result: {
    month: number;
    year: number;
    count: number;
  }[] = [];

  posts
    .filter((post) => post.active)
    .forEach((post) => {
      const month = post.date.getMonth() + 1;
      const year = post.date.getFullYear();

      const existingDate = result.find(
        (item) =>
          item.month === month &&
          item.year === year,
      );

      if (existingDate) {
        existingDate.count++;
      } else {
        result.push({
          month,
          year,
          count: 1,
        });
      }
    });

  return result.sort((a, b) => {
    if (a.year !== b.year) {
      return b.year - a.year;
    }

    return b.month - a.month;
  });
}