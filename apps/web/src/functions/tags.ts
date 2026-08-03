export async function tags(
  posts: { tags: string; active: boolean }[],
): Promise<{ name: string; count: number }[]> {
  const result: { name: string; count: number }[] = [];

  posts
    .filter((post) => post.active)
    .forEach((post) => {
      post.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)
        .forEach((tag) => {
          const existingTag = result.find(
            (item) => item.name === tag,
          );

          if (existingTag) {
            existingTag.count++;
          } else {
            result.push({
              name: tag,
              count: 1,
            });
          }
        });
    });

  return result.sort((a, b) =>
    a.name.localeCompare(b.name),
  );
}