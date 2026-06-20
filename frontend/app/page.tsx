"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";

import {
  FaPlaneDeparture,
  FaMapMarkedAlt,
  FaHotel,
  FaSuitcaseRolling,
  FaArrowRight,
} from "react-icons/fa";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-50 via-white to-indigo-100">
      {/* Background Effects */}
      <div className="absolute top-20 left-20 w-80 h-80 bg-blue-300/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-300/20 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-300/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>

      <Navbar />

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-[85vh] px-6 text-center">
        {/* Badge */}
        <div className="mb-6 px-5 py-2 rounded-full bg-white/80 backdrop-blur-md border border-slate-200 shadow-md">
          ✈️ AI Powered Travel Planning
        </div>

        {/* Main Heading */}
        <h1 className="max-w-6xl text-5xl md:text-7xl font-extrabold leading-tight">
          Your Personal
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600">
            AI Travel Agent
          </span>
        </h1>

        {/* Description */}
        <p className="mt-8 max-w-3xl text-lg md:text-xl text-slate-600 leading-relaxed">
          Plan unforgettable trips in seconds. Generate smart itineraries,
          discover hotels, calculate budgets, and get personalized packing
          lists powered by Artificial Intelligence.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-10">
          <Link
            href="/register"
            className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg font-semibold rounded-2xl shadow-xl hover:scale-105 transition-all duration-300"
          >
            Start Planning
            <FaArrowRight />
          </Link>

          <Link
            href="/login"
            className="px-8 py-4 bg-white border border-slate-200 rounded-2xl shadow-lg text-slate-700 font-semibold hover:bg-slate-50 transition-all"
          >
            Sign In
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 w-full max-w-4xl">
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-xl">
            <h3 className="text-3xl font-bold text-blue-600">10K+</h3>
            <p className="text-slate-500 mt-2">Trips Planned</p>
          </div>

          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-xl">
            <h3 className="text-3xl font-bold text-blue-600">150+</h3>
            <p className="text-slate-500 mt-2">Destinations</p>
          </div>

          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-xl">
            <h3 className="text-3xl font-bold text-blue-600">98%</h3>
            <p className="text-slate-500 mt-2">Happy Travelers</p>
          </div>
        </div>
      </section>
    </main>
  );
}