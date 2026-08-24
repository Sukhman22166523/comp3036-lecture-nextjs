import Link from "next/link";
import { unstable_cache } from "next/cache";
import { getPostsByTag } from "@repo/db/queries";
import PostList from "../../../components/PostList";

type TagPageProps = {
  params: Promise<{
    tag: string;
  }>;
};

const getCachedPostsByTag = unstable_cache(
  async (tag: string) => getPostsByTag(tag),
  ["posts-by-tag"],
  {
    revalidate: 3600,
    tags: ["posts"],
  },
);

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);

  const posts = await getCachedPostsByTag(decodedTag);

  const formattedPosts = posts.map((post) => ({
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
      <h1>Posts tagged: {decodedTag}</h1>

      <Link href="/">Back to all posts</Link>

      {formattedPosts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        <PostList posts={formattedPosts} />
      )}
    </main>
  );
}