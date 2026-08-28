import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostByUrlId, getPosts } from "@repo/db/queries";
import LikeButton from "../../../components/LikeButton";
import EditPostForm from "../../../components/EditPostForm";

type PostDetailsPageProps = {
  params: Promise<{
    urlId: string;
  }>;
};

export default async function PostDetailsPage({
  params,
}: PostDetailsPageProps) {
  const { urlId } = await params;

  const post = await getPostByUrlId(urlId);

  if (!post) {
    notFound();
  }

  return (
    <main>
      <Link href={`/categories/${encodeURIComponent(post.category)}`}>
        Back to {post.category} posts
      </Link>

      <article>
        <h1 className="post-title">{post.title}</h1>

        <Image
          src={post.imageUrl || "/placeholder.webp"}
          alt={post.title}
          width={900}
          height={500}
        />

        <div>
          <p>{post.content}</p>
        </div>

        <LikeButton
          postId={post.id}
          initialLikes={post.Likes.length}
        />

        <EditPostForm
          postId={post.id}
          initialTitle={post.title}
          initialDescription={post.description}
        />
      </article>
    </main>
  );
}

export async function generateStaticParams() {
  const posts = await getPosts();

  return posts.map((post) => ({
    urlId: post.urlId,
  }));
}