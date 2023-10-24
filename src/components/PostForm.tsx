"use client";
import { useState, useRef, useEffect } from "react";
import { usePosts } from "@/context/PostContext";

function PostForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { createPost, selectedPost, setSelectedPost, updatePost } = usePosts();
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectedPost) {
      setTitle(selectedPost.title);
      setContent(selectedPost.content || "");
      titleRef.current?.focus();
    }
  }, [selectedPost]);

  return (
    <div>
      <div className="text-center font-bold text-2xl m-5 text-gray-800 bg-white">
        Nuevo Post
      </div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (selectedPost) {
            await updatePost(selectedPost.id, { title, content });
            setSelectedPost(null);
          } else {
            await createPost({ title, content });
          }

          setTitle("");
          setContent("");
          titleRef.current?.focus();
        }}
      >
        <div className="mx-auto flex flex-col text-gray-800 border border-gray-300 p-4 shadow-lg max-w-2xl rounded-sm">
          <input
            name="title"
            autoFocus
            className=" w-full bg-gray-100 border border-gray-300 p-2 mb-4 outline-none rounded-sm"
            spellCheck={false}
            placeholder="Titulo"
            type="text"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            ref={titleRef}
          />
          <textarea
            name="content"
            className="w-full bg-gray-100 p-3 h-60 border border-gray-300 outline-none rounded-sm"
            spellCheck={false}
            placeholder="Describe todo lo quieras..."
            onChange={(e) => setContent(e.target.value)}
            value={content}
          ></textarea>
          <div className="flex justify-end">
            <button
              type="submit"
              className=" border border-indigo-500 p-1 px-4 font-semibold cursor-pointer text-gray-200 ml-2 bg-blue-500 rounded-sm m-2 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!title || !content}
            >
              {selectedPost ? "Actualizar" : "Publicar"}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 inline-block align-middle ml-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.5 7.5h-.75A2.25 2.25 0 004.5 9.75v7.5a2.25 2.25 0 002.25 2.25h7.5a2.25 2.25 0 002.25-2.25v-7.5a2.25 2.25 0 00-2.25-2.25h-.75m0-3l-3-3m0 0l-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 012.25 2.25v7.5a2.25 2.25 0 01-2.25 2.25h-7.5a2.25 2.25 0 01-2.25-2.25v-.75"
                />
              </svg>
            </button>
            {selectedPost && (
              <button
                type="button"
                className=" border border-slate-400 p-1 px-4 font-semibold cursor-pointer text-black ml-2 bg-slate-500 rounded-sm m-2 hover:bg-slate-700"
                onClick={() => {
                  setSelectedPost(null);
                  setTitle("");
                  setContent("");
                }}
              >
                Cancelar
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 inline-block align-middle ml-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

export default PostForm;
