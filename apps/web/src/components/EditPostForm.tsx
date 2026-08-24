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
  const [description, setDescription] =
    useState(initialDescription);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setMessage("");

    startTransition(async () => {
      try {
        await updatePostAction(
          postId,
          title,
          description,
        );

        setMessage("Post updated successfully.");
      } catch (error) {
        setMessage(
          error instanceof Error
            ? error.message
            : "Update failed.",
        );
      }
    });
  };

  return (
    <section>
      <h2>Edit Post</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
          />
        </div>

        <div>
          <label htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
          />
        </div>

        <button type="submit" disabled={isPending}>
          {isPending ? "Updating..." : "Update Post"}
        </button>
      </form>

      {message && <p>{message}</p>}
    </section>
  );
}