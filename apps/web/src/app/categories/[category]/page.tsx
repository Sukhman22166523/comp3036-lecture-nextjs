import Link from "next/link";
import { unstable_cache } from "next/cache";
import { getPostsByCategory } from "@repo/db/queries";
import PostList from "../../../components/PostList";

type CategoryPageProps = {
  params: Promise<{
    category: string;
  }>;
};

const getCachedPostsByCategory = unstable_cache(
  async (category: string) => getPostsByCategory(category),
  ["posts-by-category"],
  {
    revalidate: 3600,
    tags: ["posts"],
  },
);

export default async function CategoryPage({
  params,
}: CategoryPageProps) {
  const { category } = await params;
  const decodedCategory = decodeURIComponent(category);

  const posts = await getCachedPostsByCategory(decodedCategory);

  const categoryPosts = posts.map((post) => ({
    id: post.id,
    title: post.title,
    urlId: post.urlId,
    description: post.description,
    imageUrl: post.imageUrl,
    category: post.category,
    tags: post.tags,
    date: new Date(post.date).toLocaleDateString("en-AU"),
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