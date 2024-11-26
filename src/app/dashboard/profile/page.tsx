"use client";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { useState, useEffect } from "react";
import axios from "axios";

function ProfilePage() {

  const [isTemp, setIsTemp] = useState(false);
  const { data: session, status } = useSession();
  
  useEffect(() => {
    const verifyTemp = async () => {
      const isTemp = await axios.get(`/api/auth/temp/${(session?.user as any)?.id}`);
      setIsTemp(isTemp.data.isTemp);
    };
    if(session){
      verifyTemp();
    }
    
  }, [session]);

  //si el usuario es temporal y desea cerrar sesion se elimina de la base de datos
  const handlerDeleteUser = async () => {
    if (isTemp) {
      //@ts-ignore
      const response = await axios.delete(`/api/auth/temp/${session?.user?.id}`);
      if (response) {
        localStorage.removeItem("timeLeft");
        signOut();
      }
    } else {
      signOut();
    }
  };

  
  return (
    <div className="justify-center flex items-center">
    <div className="relative flex justify-center mt-6 flex-col text-gray-700 bg-white shadow-md w-96 rounded-xl bg-clip-border items-center">
      <div className="relative mx-4 mt-4 overflow-hidden text-gray-700 bg-white shadow-lg h-80 rounded-xl bg-clip-border">
        <img
          className="w-full h-full object-cover"
          src="/userimage.png"
          alt="profile-picture"
        />
      </div>
      <div className="p-6 text-center">
        <h4 className="block mb-2 font-sans text-2xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
          {session?.user?.name}
        </h4>
        <p className="block font-sans text-base antialiased font-medium leading-relaxed text-transparent bg-gradient-to-tr from-pink-600 to-pink-400 bg-clip-text">
          {session?.user?.email}
        </p>
        <button
          className="mt-2 bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded"
          onClick={() => {
            handlerDeleteUser()
          }}
        >
          Cerrar sesion
        </button>
      </div>
    </div>
    </div>
  );
}

export default ProfilePage;
