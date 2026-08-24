import { client } from "./client.js";
import { posts } from "./data.js";

export async function seed() {
  console.log("Seeding Prisma database...");

  // Clear existing data
  await client.db.like.deleteMany();
  await client.db.post.deleteMany();
  await client.db.tag.deleteMany();

  for (const post of posts) {
    const tagNames = post.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    await client.db.post.create({
      data: {
        id: post.id,
        urlId: post.urlId,
        title: post.title,
        content: post.content,
        description: post.description,
        imageUrl: post.imageUrl,
        date: post.date,
        category: post.category,
        views: post.views,
        active: post.active,

        tags: {
          connectOrCreate: tagNames.map((name) => ({
            where: { name },
            create: { name },
          })),
        },

        Likes: {
          create: Array.from({ length: post.likes }, (_, i) => ({
            userIP: `192.168.100.${i}`,
          })),
        },
      },
    });
  }

  console.log("Prisma seed finished");
}