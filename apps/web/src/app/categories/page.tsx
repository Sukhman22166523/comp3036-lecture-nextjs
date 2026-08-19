import Link from "next/link";
import { posts } from "../../../../../packages/db/src/data";

export default function CategoriesPage() {
  const activePosts = posts.filter((post) => post.active);

  const categories = [...new Set(activePosts.map((post) => post.category))];

  return (
    <main>
      <h1>Categories</h1>

      <ul>
        {categories.map((category) => {
          const count = activePosts.filter(
            (post) => post.category === category,
          ).length;

          return (
            <li key={category}>
              <Link href={`/categories/${encodeURIComponent(category)}`}>
                {category} ({count})
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}