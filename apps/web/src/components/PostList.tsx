"use client";

import PostImage from "./PostImage";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Post = {
  id: number;
  title: string;
  urlId: string;
  description: string;
  imageUrl?: string;
  category: string;
  tags: string;
  date: string;
};

type PostListProps = {
  posts: Post[];
};

const STORAGE_KEY = "hiddenPosts";

export default function PostList({ posts }: PostListProps) {
  const router = useRouter();
  const [hiddenPosts, setHiddenPosts] = useState<number[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored) {
      try {
        setHiddenPosts(JSON.parse(stored));
      } catch {
        setHiddenPosts([]);
      }
    }

    setMounted(true);
  }, []);

  const hidePost = (id: number) => {
    const updated = [...hiddenPosts, id];
    setHiddenPosts(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const unhideAll = () => {
    setHiddenPosts([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  if (!mounted) {
    return null;
  }

  const visiblePosts = posts.filter(
    (post) => !hiddenPosts.includes(post.id),
  );

  return (
    <>
      <button type="button" onClick={unhideAll}>
        Unhide all posts
      </button>

      {visiblePosts.length === 0 ? (
        <p>No visible posts.</p>
      ) : (
        <ul>
          {visiblePosts.map((post) => (
            <li key={post.id}>
              <article>
                <PostImage
                  imageUrl={post.imageUrl}
                  alt={post.title}
                  width={300}
                  height={200}
                />

                <h2>
                  <Link
  href={`/posts/${post.urlId}`}
  onMouseEnter={() =>
    router.prefetch(`/posts/${post.urlId}`)
  }
>
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
                    <strong>Date posted:</strong> {post.date}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => hidePost(post.id)}
                >
                  Hide post
                </button>
              </article>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}


