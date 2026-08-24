"use client";

import { useState, useTransition } from "react";
import { updatePostAction } from "../app/actions/posts";

type EditPostFormProps = {
  postId: number;
  initialTitle: string;
  initialDescription: string;
};

export default function EditPostForm({
  postId,
  initialTitle,
  initialDescription,
}: EditPostFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    startTransition(async () => {
      try {
        await updatePostAction(postId, title, description);
        setMessage("Post updated successfully");
      } catch {
        setMessage("Failed to update post");
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        marginTop: "30px",
        maxWidth: "700px",
        display: "flex",
        flexDirection: "column",
        gap: "15px",
      }}
    >
      <h2>Edit Post</h2>

      <label htmlFor="post-title">Title</label>

      <input
        id="post-title"
        type="text"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        required
        style={{
          width: "100%",
          padding: "12px",
          fontSize: "16px",
          border: "1px solid #888",
          borderRadius: "5px",
        }}
      />

      <label htmlFor="post-description">Description</label>

      <textarea
        id="post-description"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        required
        rows={6}
        style={{
          width: "100%",
          padding: "12px",
          fontSize: "16px",
          border: "1px solid #888",
          borderRadius: "5px",
          resize: "vertical",
        }}
      />

      <button
        type="submit"
        disabled={isPending}
        style={{
          padding: "12px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        {isPending ? "Updating..." : "Update Post"}
      </button>

      {message && <p>{message}</p>}
    </form>
  );
}