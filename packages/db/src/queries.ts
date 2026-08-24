import { client } from "./client.js";

type PostDocument = {
  id: number;
  urlId: string;
  title: string;
  content: string;
  description: string;
  imageUrl: string;
  date: Date;
  category: string;
  views: number;
  tags: string;
  active: boolean;
};

type LikeDocument = {
  postId: number;
  userIP: string;
};

async function addLikes(posts: PostDocument[]) {
  const likes = await client.db
    .collection<LikeDocument>("likes")
    .find({})
    .toArray();

  return posts.map((post) => ({
    ...post,
    Likes: likes.filter((like) => like.postId === post.id),
  }));
}

export async function getPosts() {
  const posts = await client.db
    .collection<PostDocument>("posts")
    .find({ active: true })
    .sort({ id: 1 })
    .toArray();

  return addLikes(posts);
}

export async function getPostByUrlId(urlId: string) {
  if (typeof urlId !== "string" || urlId.trim().length === 0) {
    throw new Error("Invalid URL ID");
  }

  const post = await client.db
    .collection<PostDocument>("posts")
    .findOne({
      urlId,
      active: true,
    });

  if (!post) {
    return null;
  }

  const likes = await client.db
    .collection<LikeDocument>("likes")
    .find({ postId: post.id })
    .toArray();

  return {
    ...post,
    Likes: likes,
  };
}

export async function getPostsByCategory(category: string) {
  if (
    typeof category !== "string" ||
    category.trim().length === 0
  ) {
    throw new Error("Invalid category");
  }

  const posts = await client.db
    .collection<PostDocument>("posts")
    .find({
      active: true,
      category,
    })
    .sort({ id: 1 })
    .toArray();

  return addLikes(posts);
}

export async function getAvailableTags() {
  const posts = await client.db
    .collection<PostDocument>("posts")
    .find(
      { active: true },
      {
        projection: {
          tags: 1,
        },
      },
    )
    .toArray();

  return [
    ...new Set(
      posts.flatMap((post) =>
        post.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      ),
    ),
  ].sort();
}

export async function getPostsByTag(tag: string) {
  if (typeof tag !== "string" || tag.trim().length === 0) {
    throw new Error("Invalid tag");
  }

  const posts = await client.db
    .collection<PostDocument>("posts")
    .find({ active: true })
    .sort({ date: -1 })
    .toArray();

  const filteredPosts = posts.filter((post) =>
    post.tags
      .split(",")
      .map((item) => item.trim().toLowerCase())
      .includes(tag.trim().toLowerCase()),
  );

  return addLikes(filteredPosts);
}

export async function likePost(
  postId: number,
  userIP: string,
) {
  if (!Number.isInteger(postId) || postId <= 0) {
    throw new Error("Invalid post ID");
  }

  if (
    typeof userIP !== "string" ||
    userIP.trim().length === 0
  ) {
    throw new Error("Invalid user IP");
  }

  await client.db
    .collection<LikeDocument>("likes")
    .updateOne(
      {
        postId,
        userIP,
      },
      {
        $setOnInsert: {
          postId,
          userIP,
        },
      },
      {
        upsert: true,
      },
    );

  const post = await client.db
    .collection<PostDocument>("posts")
    .findOne({ id: postId });

  if (!post) {
    return null;
  }

  const likes = await client.db
    .collection<LikeDocument>("likes")
    .find({ postId })
    .toArray();

  return {
    ...post,
    Likes: likes,
  };
}

export async function updatePost(
  postId: number,
  data: {
    title: string;
    description: string;
  },
) {
  if (!Number.isInteger(postId) || postId <= 0) {
    throw new Error("Invalid post ID");
  }

  if (
    typeof data.title !== "string" ||
    data.title.trim().length === 0
  ) {
    throw new Error("Invalid title");
  }

  if (
    typeof data.description !== "string" ||
    data.description.trim().length === 0
  ) {
    throw new Error("Invalid description");
  }

  await client.db
    .collection<PostDocument>("posts")
    .updateOne(
      { id: postId },
      {
        $set: {
          title: data.title.trim(),
          description: data.description.trim(),
        },
      },
    );

  return client.db
    .collection<PostDocument>("posts")
    .findOne({ id: postId });
}