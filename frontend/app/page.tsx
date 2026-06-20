import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600 mb-6">
          Your AI Travel Agent
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mb-10">
          Generate a complete, personalized travel itinerary in seconds. Discover hotels, plan your budget, and get a custom packing list tailored to your destination.
        </p>
        <Link href="/register" className="px-8 py-4 bg-brand-600 text-white text-lg font-semibold rounded-full shadow-lg hover:shadow-brand-500/30 hover:-translate-y-1 transition-all">
          Start Planning Now
        </Link>
      </div>
    </main>
  );
}
