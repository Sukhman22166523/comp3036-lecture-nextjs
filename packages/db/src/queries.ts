import { client } from "./client.js";

export async function getPosts() {
  return client.db.post.findMany({
    where: {
      active: true,
    },
    include: {
      Likes: true,
    },
   orderBy: {
  id: "asc",
},
  });
}

export async function getPostByUrlId(urlId: string) {
  return client.db.post.findFirst({
    where: {
      urlId,
      active: true,
    },
    include: {
      Likes: true,
    },
  });
}

export async function getPostsByCategory(category: string) {
  return client.db.post.findMany({
    where: {
      active: true,
      category: category,
    },
    include: {
      Likes: true,
    },
    orderBy: {
      id: "asc",
    },
  });
}
export async function getAvailableTags() {
  const posts = await client.db.post.findMany({
    where: {
      active: true,
    },
    select: {
      tags: true,
    },
  });

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
  const posts = await client.db.post.findMany({
    where: {
      active: true,
    },
    include: {
      Likes: true,
    },
    orderBy: {
      date: "desc",
    },
  });

  return posts.filter((post) =>
    post.tags
      .split(",")
      .map((item) => item.trim().toLowerCase())
      .includes(tag.toLowerCase()),
  );
}
export async function likePost(postId: number, userIP: string) {
  if (!Number.isInteger(postId) || postId <= 0) {
    throw new Error("Invalid post ID");
  }

  if (!userIP || typeof userIP !== "string") {
    throw new Error("Invalid user IP");
  }

  await client.db.like.upsert({
    where: {
      postId_userIP: {
        postId,
        userIP,
      },
    },
    update: {},
    create: {
      postId,
      userIP,
    },
  });

  return client.db.post.findUnique({
    where: {
      id: postId,
    },
    include: {
      Likes: true,
    },
  });
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

  return client.db.post.update({
    where: {
      id: postId,
    },
    data: {
      title: data.title.trim(),
      description: data.description.trim(),
    },
  });
}
