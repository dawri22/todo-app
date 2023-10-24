"use client";
import { createContext, useState, useContext } from "react";
import { useSession } from "next-auth/react";
import { CreatePost, UpdatePost } from "@/interfaces/Post";
import { Post } from "@prisma/client";

export const PostContext = createContext<{
  posts: Post[];
  loadPosts: () => Promise<void>;
  createPost: (post: CreatePost) => Promise<void>;
  deletePost: (id: number) => Promise<void>;
  selectedPost: Post | null;
  setSelectedPost: (post: Post | null) => void;
  updatePost: (id: number, post: UpdatePost) => Promise<void>;
}>({
  posts: [],
  loadPosts: async () => {},
  createPost: async (post: CreatePost) => {},
  deletePost: async (id: number) => {},
  selectedPost: null,
  setSelectedPost: (post: Post | null) => {},
  updatePost: async (id: number, post: UpdatePost) => {},
});

export const usePosts = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error("usePosts debe estar dentro del proveedor PostProvider");
  }
  return context;
};

export const PostProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();

  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const loadPosts = async () => {
    //@ts-ignore
    const res = await fetch(`/api/posts/${session?.user?.id}`);
    const data = await res.json();
    setPosts(data);
  };

  async function createPost(post: CreatePost) {
    //@ts-ignore
    const res = await fetch(`/api/posts/${session?.user?.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(post),
    });
    const newPost = await res.json();
    setPosts([...posts, newPost]);
  }

  async function deletePost(id: number) {
    const res = await fetch("http://localhost:3000/api/posts/" + id, {
      method: "DELETE",
    });
    const data = res.json();
    setPosts(posts.filter((post) => post.id !== id));
  }

  async function updatePost(id: number, post: UpdatePost) {
    const res = await fetch("/api/posts/" + id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(post),
    });
    const data = await res.json();
    setPosts(posts.map(post => post.id === id ? data : post));
  }

  return (
    <PostContext.Provider
      value={{
        posts,
        loadPosts,
        createPost,
        deletePost,
        selectedPost,
        setSelectedPost,
        updatePost,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};
