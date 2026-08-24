import { unstable_cache } from "next/cache";
import Link from "next/link";
import { getAvailableTags, getPosts } from "@repo/db/queries";
import PostList from "../components/PostList";
import styles from "./page.module.css";

const getCachedPosts = unstable_cache(
  async () => getPosts(),
  ["prisma-posts"],
  {
    revalidate: 3600,
    tags: ["posts"],
  },
);

const getCachedTags = unstable_cache(
  async () => getAvailableTags(),
  ["prisma-tags"],
  {
    revalidate: 3600,
    tags: ["posts"],
  },
);

export default async function Home() {
  const [posts, tags] = await Promise.all([
    getCachedPosts(),
    getCachedTags(),
  ]);

  const formattedPosts = posts.map((post) => ({
    id: post.id,
    title: post.title,
    urlId: post.urlId,
    description: post.description,
    imageUrl: post.imageUrl,
    category: post.category,
    tags: post.tags.map((tag) => tag.name).join(", "),
    date: new Date(post.date).toLocaleDateString("en-AU"),
  }));

  return (
    <main className={styles.main}>
      <h1>Blog Posts</h1>

      <section>
        <h2>Available Tags</h2>

        <div>
          {tags.map((tag) => (
            <Link
              key={tag}
              href={`/tags/${encodeURIComponent(tag)}`}
            >
              {tag}
            </Link>
          ))}
        </div>
      </section>

      <PostList posts={formattedPosts} />
    </main>
  );
}