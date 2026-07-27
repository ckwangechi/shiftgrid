import { Search, BriefcaseBusiness } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BrowseHero = () => {
  const navigate = useNavigate();
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 p-10 text-white shadow-xl">

      <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
      <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl"></div>

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

        <div className="max-w-2xl">

          <h1 className="mt-2 text-5xl font-black leading-tight">
            Browse Available
            <span className="block text-cyan-300">
              Shifts Near You
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-blue-100 text-lg">
            Explore hundreds of verified shifts from trusted employers.
            Filter by location, skills, availability and claim work in
            just a few clicks.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">

            <button
              onClick={() => document.getElementById('browse-grid')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center gap-2 rounded-2xl bg-white px-6 py-3 font-semibold text-blue-700 transition hover:scale-105"
            >
              <Search size={18} />
              Find Shifts
            </button>

            <button
              onClick={() => navigate("/shifts")}
              className="flex items-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-6 py-3 backdrop-blur transition hover:bg-white/20"
            >
              <BriefcaseBusiness size={18} />
              My Applications
            </button>

          </div>

        </div>

        <div className="grid grid-cols-2 gap-5">

          <div className="rounded-3xl bg-white/10 p-6 backdrop-blur">
            <h2 className="text-4xl font-bold">—</h2>
            <p className="mt-2 text-blue-100">
              Open Shifts
            </p>
          </div>

          <div className="rounded-3xl bg-white/10 p-6 backdrop-blur">
            <h2 className="text-4xl font-bold">—</h2>
            <p className="mt-2 text-blue-100">
              Companies
            </p>
          </div>

        </div>

      </div>

    </section>
  );
};

export default BrowseHero;