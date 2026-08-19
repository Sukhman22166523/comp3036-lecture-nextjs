import Link from "next/link";
import { posts } from "../../../../../../packages/db/src/data";
import PostList from "../../../components/PostList";

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

  const categoryPosts = posts
    .filter(
      (post) =>
        post.active &&
        post.category.toLowerCase() === decodedCategory.toLowerCase(),
    )
    .map((post) => ({
      id: post.id,
      title: post.title,
      urlId: post.urlId,
      description: post.description,
      imageUrl: post.imageUrl,
      category: post.category,
      tags: post.tags,
      date: post.date.toLocaleDateString("en-AU"),
    }));

  return (
    <main>
      <h1>{decodedCategory} Posts</h1>

      <Link href="/categories">Back to categories</Link>

      {categoryPosts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        <PostList posts={categoryPosts} />
      )}
    </main>
  );
}
