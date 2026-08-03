import Link from "next/link";
import { posts } from "../../../../../packages/db/src/data";
import { categories } from "../../functions/categories";

export default function CategoriesPage() {
  const categoryList = categories(posts);

  return (
    <main>
      <h1>Categories</h1>

      <ul>
        {categoryList.map((category) => (
          <li key={category.name}>
            <Link
              href={`/categories/${encodeURIComponent(category.name)}`}
            >
              {category.name} ({category.count})
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}