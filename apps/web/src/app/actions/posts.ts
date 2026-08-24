"use server";

import { likePost, updatePost } from "@repo/db/queries";
import { revalidateTag } from "next/cache";

export async function likePostAction(postId: number) {
  if (!Number.isInteger(postId) || postId <= 0) {
    throw new Error("Invalid post ID");
  }

  const userIP = `user-${Date.now()}`;

  const post = await likePost(postId, userIP);

  const likes = post?.Likes.length ?? 0;

  revalidateTag("posts");

  return {
    likes,
  };
}

export async function updatePostAction(
  postId: number,
  title: string,
  description: string,
) {
  if (!Number.isInteger(postId) || postId <= 0) {
    throw new Error("Invalid post ID");
  }

  if (typeof title !== "string" || title.trim().length === 0) {
    throw new Error("Title is required");
  }

  if (
    typeof description !== "string" ||
    description.trim().length === 0
  ) {
    throw new Error("Description is required");
  }

  const post = await updatePost(postId, {
    title,
    description,
  });

  revalidateTag("posts");

  return {
    id: post.id,
    title: post.title,
    description: post.description,
  };
}