import Link from "next/link";
import { unstable_cache } from "next/cache";
import { getAvailableTags, getPosts } from "@repo/db/queries";
import PostList from "../components/PostList";
import styles from "./page.module.css";

const getCachedPosts = unstable_cache(
  async () => getPosts(),
  ["posts"],
  {
    revalidate: 3600,
    tags: ["posts"],
  },
);

const getCachedTags = unstable_cache(
  async () => getAvailableTags(),
  ["available-tags"],
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
    tags: post.tags,
    date: new Date(post.date).toLocaleDateString("en-AU"),
  }));

  return (
    <main className={styles.main}>
      <h1>Blog Posts</h1>

      <section>
        <h2>Available Tags</h2>

        <ul>
          {tags.map((tag) => (
            <li key={tag}>
              <Link href={`/tags/${encodeURIComponent(tag)}`}>
                {tag}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <PostList posts={formattedPosts} />
    </main>
  );
}