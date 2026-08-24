"use client";

import { useState, useTransition } from "react";
import { likePostAction } from "../app/actions/posts";

type LikeButtonProps = {
  postId: number;
  initialLikes: number;
};

export default function LikeButton({
  postId,
  initialLikes,
}: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [isPending, startTransition] = useTransition();

  const handleLike = () => {
    startTransition(async () => {
      const result = await likePostAction(postId);
      setLikes(result.likes);
    });
  };

  return (
    <div>
      <p>{likes} likes</p>

      <button
        type="button"
        onClick={handleLike}
        disabled={isPending}
      >
        {isPending ? "Liking..." : "Like"}
      </button>
    </div>
  );
}