import Link from 'next/link';
import { Toaster } from '~/components/ui/sonner';

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 text-black">
      <nav className="flex w-full justify-center py-4">
        <ul className="flex gap-6 rounded-lg bg-white/100 px-6 py-2 font-semibold text-lg shadow">
          <li>
            <Link href="/results/afficheur" className="hover:underline">
              Afficheur
            </Link>
          </li>
          <li>
            <Link href="/results/viewer" className="hover:underline">
              Viewer
            </Link>
          </li>
          <li>
            <Link href="/admin" className="hover:underline">
              Admin
            </Link>
          </li>
        </ul>
      </nav>
      <Toaster richColors />
    </main>
  );
}
