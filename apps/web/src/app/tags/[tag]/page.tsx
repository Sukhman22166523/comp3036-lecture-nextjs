import Link from "next/link";
import { unstable_cache } from "next/cache";
import { getPostsByTag } from "@repo/db/queries";
import PostList from "../../../components/PostList";

type TagPageProps = {
  params: Promise<{
    tag: string;
  }>;
};

const getCachedTagPosts = unstable_cache(
  async (tag: string) => getPostsByTag(tag),
  ["prisma-tag-posts"],
  {
    revalidate: 3600,
    tags: ["posts"],
  },
);

export default async function TagPage({
  params,
}: TagPageProps) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);

  const posts = await getCachedTagPosts(decodedTag);

  const tagPosts = posts.map((post) => ({
    id: post.id,
    title: post.title,
    urlId: post.urlId,
    description: post.description,
    imageUrl: post.imageUrl,
    category: post.category,
    tags: post.tags.map((item) => item.name).join(", "),
    date: new Date(post.date).toLocaleDateString("en-AU"),
  }));

  return (
    <main>
      <h1>Posts tagged: {decodedTag}</h1>

      <Link href="/">Back to posts</Link>

      {tagPosts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        <PostList posts={tagPosts} />
      )}
    </main>
  );
}