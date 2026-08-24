import { client } from "./client.js";

export async function getPosts() {
  return client.db.post.findMany({
    where: {
      active: true,
    },
    include: {
      tags: true,
      Likes: true,
    },
    orderBy: {
      id: "asc",
    },
  });
}

export async function getPostByUrlId(urlId: string) {
  if (typeof urlId !== "string" || urlId.trim().length === 0) {
    throw new Error("Invalid URL ID");
  }

  return client.db.post.findFirst({
    where: {
      urlId,
      active: true,
    },
    include: {
      tags: true,
      Likes: true,
    },
  });
}

export async function getPostsByTag(tag: string) {
  if (typeof tag !== "string" || tag.trim().length === 0) {
    throw new Error("Invalid tag");
  }

  return client.db.post.findMany({
    where: {
      active: true,
      tags: {
        some: {
          name: tag.trim(),
        },
      },
    },
    include: {
      tags: true,
      Likes: true,
    },
    orderBy: {
      id: "asc",
    },
  });
}

export async function getAvailableTags() {
  const tags = await client.db.tag.findMany({
    select: {
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return tags.map((tag) => tag.name);
}

export async function getPostsByCategory(category: string) {
  if (
    typeof category !== "string" ||
    category.trim().length === 0
  ) {
    throw new Error("Invalid category");
  }

  return client.db.post.findMany({
    where: {
      active: true,
      category: category.trim(),
    },
    include: {
      tags: true,
      Likes: true,
    },
    orderBy: {
      id: "asc",
    },
  });
}

export async function likePost(postId: number, userIP: string) {
  if (!Number.isInteger(postId) || postId <= 0) {
    throw new Error("Invalid post ID");
  }

  if (typeof userIP !== "string" || userIP.trim().length === 0) {
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
      tags: true,
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
    include: {
      tags: true,
      Likes: true,
    },
  });
}