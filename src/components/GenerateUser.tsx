"use client";
import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Toaster, toast } from "sonner";
import axios from "axios";
import { signIn } from "next-auth/react";

function GenerateUser() {
  const [emailTemp, setEmailTemp] = useState("");
  const [passwordTemp, setPasswordTemp] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");

  const [open, setOpen] = useState(false);

  const cancelButtonRef = useRef(null);

  //generar usuario aleatorio
  const handlerApi = async () => {
    const res = await fetch("https://randomuser.me/api/");
    const data = await res.json();
    setName(data.results[0].name.first);
    setLastName(data.results[0].name.last);
    setEmailTemp(data.results[0].email);
    setPasswordTemp(data.results[0].login.password);
    setOpen(true);
  };

  const saveTempUser = async () => {
    const response = await axios.post("/api/auth/temp", {
      email: emailTemp,
      password: passwordTemp,
      name: name,
      lastname: lastName,
    });
    console.log(response.data.email);
    toast.success("Usuario temporal creado correctamente");

    if (response) {
      try {
        const res = await signIn("credentials", {
          email: response.data.email,
          password: passwordTemp,
          callbackUrl: "/dashboard",
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div>
      <button
        className="flex w-full justify-center rounded-md bg-gray-300 mt-2 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        onClick={handlerApi}
      >
        Iniciar como invitado
      </button>
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          initialFocus={cancelButtonRef}
          onClose={setOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <Dialog.Title
                          as="h3"
                          className="text-base font-semibold leading-6 text-gray-900"
                        >
                          Usuario Temporal
                        </Dialog.Title>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500 mb-2">
                            Este usuario es temporal, se genero aleatoriamente,
                            si desea puede usarlo o generar otro, el usuario se
                            eliminara al cerrar la pagina o al pasar 30 minutos.
                          </p>
                          <h3>
                            <strong>Nombre:</strong> {name} {""} {lastName}{" "}
                          </h3>
                          <p>
                            <strong>Correo:</strong> {emailTemp}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 sm:ml-3 sm:w-auto"
                      onClick={handlerApi}
                    >
                      Generar Otro
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset  hover:bg-blue-600 sm:mt-0 sm:w-auto"
                      onClick={saveTempUser}
                    >
                      Usar
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}

export default GenerateUser;
