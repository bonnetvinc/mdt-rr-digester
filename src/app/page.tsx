import Link from "next/link";

export default async function Home() {

  return (
  <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 text-black">
      <nav className="flex w-full justify-center py-4">
        <ul className="flex gap-6 rounded-lg bg-white/100 px-6 py-2 text-lg font-semibold shadow">
          <li>
            <Link href="/individual" className="hover:underline">
              Individuel
            </Link>
          </li>
          <li>
            <Link href="/teams" className="hover:underline">
              Teams
            </Link>
          </li>
          <li>
            <Link href="/admin" className="hover:underline">
              Admin
            </Link>
          </li>
        </ul>
      </nav>
    </main>
  );
}
