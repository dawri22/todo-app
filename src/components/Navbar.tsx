import Link from "next/link";
import { getServerSession } from "next-auth";

async function Navbar() {
  const session = await getServerSession();

  return (
    <nav className=" p-4 border-b border-blue-400 ">
      <div className="flex justify-between container mx-auto">
        {session ? (
          <Link
            className="font-bold text-xl flex items-center hover:text-white hover:bg-blue-500 rounded-full p-1"
            href="/dashboard"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 mr-2 "
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
            Inicio
          </Link>
        ) : (
          <Link
            className="font-bold text-xl flex items-center hover:text-white hover:bg-blue-500 rounded-full p-1"
            href="/login"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6 mr-2"
            >
              <path d="M5.625 3.75a2.625 2.625 0 100 5.25h12.75a2.625 2.625 0 000-5.25H5.625zM3.75 11.25a.75.75 0 000 1.5h16.5a.75.75 0 000-1.5H3.75zM3 15.75a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75zM3.75 18.75a.75.75 0 000 1.5h16.5a.75.75 0 000-1.5H3.75z" />
            </svg>
            TO DO APP
          </Link>
        )}

        <ul className="flex gap-x-2">
          {session ? (
            <li className=" px-3 py-1 ">
              <Link
                className="hover:text-white hover:bg-blue-500 rounded-full p-1"
                href="/dashboard/profile"
              >
                Perfil
              </Link>
            </li>
          ) : (
            <li className=" px-3 py-1 ">
              <Link
                className="hover:text-white hover:bg-blue-500 rounded-full p-1"
                href="/about"
              >
                Sobre
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
