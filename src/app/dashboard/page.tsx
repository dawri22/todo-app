"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSession, signOut } from "next-auth/react";
import { toast, Toaster } from "sonner";
import PostForm from "@/components/PostForm";
import { usePosts } from "@/context/PostContext";
import PostCard from "@/components/PostCard";

function DashboardPage() {
  const { data: session, status } = useSession();
  const [isTemp, setIsTemp] = useState(false);
  const [timeLeft, setTimeLeft] = useState(() => {
    // Obtener el tiempo restante de localStorage al iniciar
    const savedTime =
      typeof window !== "undefined" && localStorage.getItem("timeLeft");
    return savedTime ? Number(savedTime) : 30 * 60;
  });
  const { posts, loadPosts } = usePosts();

  useEffect(() => {
    const verifyTemp = async () => {
      //@ts-ignore
      const isTemp = await axios.get(`/api/auth/temp/${session?.user?.id}`);
      setIsTemp(isTemp.data.isTemp);
    };
    if (session) {
      verifyTemp();
      loadPosts();
    }
  }, [session]);

  useEffect(() => {
    if (isTemp) {
      const timerId = setInterval(() => {
        setTimeLeft((time) => {
          // Guardar el tiempo restante en localStorage cada segundo
          localStorage.setItem("timeLeft", String(time - 1));
          return time - 1;
        });
      }, 1000);

      return () => clearInterval(timerId); // Limpiar el intervalo cuando el componente se desmonte
    }
  }, [isTemp]);

  useEffect(() => {
    if (timeLeft === 5 * 60) {
      toast("Quedan solo 5 minutos");
    } else if (timeLeft <= 0) {
      // se acabo el tiempo eliminar usuario
      toast.error("Se ha acabado el tiempo");
      // Borrar el tiempo restante de localStorage cuando el tiempo se acabe
      localStorage.removeItem("timeLeft");
      const handlerDeleteUser = async () => {
        if (isTemp) {
          const response = await axios.delete(
            //@ts-ignore
            `/api/auth/temp/${session?.user?.id}`
          );
          if (response) {
            localStorage.removeItem("timeLeft");
            signOut();
          }
        } else {
          signOut();
        }
      };
      handlerDeleteUser();
    }
  }, [timeLeft, isTemp, session]);

  return (
    <div>
      {isTemp && (
        <div className="flex items-center justify-center bg-blue-400 text-black text-xl font-bold p-4 rounded-lg shadow-md">
          <Toaster richColors position="top-center" />
          <span>Tiempo restante: </span>
          <span className="ml-2">{Math.floor(timeLeft / 60)}:</span>
          <span className="ml-2">
            {timeLeft % 60 < 10 ? `0${timeLeft % 60}` : timeLeft % 60}
          </span>
        </div>
      )}
      <div className="flex items-center justify-center">
        <div>
          <PostForm />

          {posts.map((item) => {
            return <PostCard post={item} key={item.id} />;
          })}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
