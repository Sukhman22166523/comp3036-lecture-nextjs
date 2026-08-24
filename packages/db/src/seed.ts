import { client } from "./client.js";
import { posts } from "./data.js";

export async function seed() {
  console.log("Seeding MongoDB data...");

  const postsCollection = client.db.collection("posts");
  const likesCollection = client.db.collection("likes");

  // Clear existing data
  await likesCollection.deleteMany({});
  await postsCollection.deleteMany({});

  // Add posts
  for (const post of posts) {
    await postsCollection.insertOne({
      id: post.id,
      title: post.title,
      content: post.content,
      category: post.category,
      description: post.description,
      imageUrl: post.imageUrl,
      tags: post.tags
        .split(",")
        .map((tag) => tag.trim())
        .join(","),
      urlId: post.urlId,
      active: post.active,
      date: post.date,
      views: post.views,
    });

    // Add likes for this post
    for (let i = 0; i < post.likes; i++) {
      await likesCollection.insertOne({
        postId: post.id,
        userIP: `192.168.100.${i}`,
      });
    }
  }

  console.log("MongoDB seed finished");
}