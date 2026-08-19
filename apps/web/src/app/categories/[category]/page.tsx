import Image from "next/image";
import Link from "next/link";
import { posts } from "../../../../../../packages/db/src/data";

type CategoryPageProps = {
  params: Promise<{
    category: string;
  }>;
};

export default async function CategoryPage({
  params,
}: CategoryPageProps) {
  const { category } = await params;
  const decodedCategory = decodeURIComponent(category);

  const categoryPosts = posts.filter(
    (post) =>
      post.active &&
      post.category.toLowerCase() === decodedCategory.toLowerCase(),
  );

  return (
    <main>
      <h1>{decodedCategory} Posts</h1>

      <Link href="/categories">Back to categories</Link>

      {categoryPosts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        <ul>
          {categoryPosts.map((post) => (
            <li key={post.id}>
              <article>
                <Image
                  src={post.title === "No front end framework is the best" ? "/placeholder.webp" : post.imageUrl || "/placeholder.webp"}
                  alt={post.title}
                  width={300}
                  height={200}
                />

                <h2>
                  <Link href={`/posts/${post.urlId}`}>
                    {post.title}
                  </Link>
                </h2>

                <p>{post.description}</p>

                <div className="post-metadata">
                  <p>
                    <strong>Tags:</strong> {post.tags}
                  </p>

                  <p>
                    <strong>Category:</strong> {post.category}
                  </p>

                  <p>
                    <strong>Date posted:</strong>{" "}
                    {post.date.toLocaleDateString("en-AU")}
                  </p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}


