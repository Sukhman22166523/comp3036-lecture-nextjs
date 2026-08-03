import Link from "next/link";
import { notFound } from "next/navigation";
import { posts } from "../../../../../../packages/db/src/data";

type PostDetailsPageProps = {
  params: Promise<{
    urlId: string;
  }>;
};

export default async function PostDetailsPage({
  params,
}: PostDetailsPageProps) {
  const { urlId } = await params;

  const post = posts.find(
    (post) => post.active && post.urlId === urlId,
  );

  if (!post) {
    notFound();
  }

  return (
    <main>
      <Link
        href={`/categories/${encodeURIComponent(post.category)}`}
      >
        Back to {post.category} posts
      </Link>

      <article>
        <h1>{post.title}</h1>

        <div>
          <p>{post.content}</p>
        </div>
      </article>
    </main>
  );
}