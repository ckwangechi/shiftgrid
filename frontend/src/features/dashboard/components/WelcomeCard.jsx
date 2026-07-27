import { useNavigate } from "react-router-dom";
import { ArrowRight, Plus } from "lucide-react";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  if (hour < 21) return "Good Evening";
  return "Good Night";
};

const WelcomeCard = ({ userName }) => {
  const navigate = useNavigate();
  const greeting = getGreeting();
  const displayName = userName || "there";

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white p-8 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 shadow-xl ring-1 ring-white/10">
      <div className="absolute right-0 top-0 h-full w-1/2 opacity-10 bg-[radial-gradient(circle_at_center,white,transparent_70%)]" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
        <div>
          <p className="uppercase tracking-[0.3em] text-blue-200 text-sm">
            SHIFTGRID
          </p>

          <h1 className="text-4xl font-black mt-3 leading-tight">
            {greeting}, {displayName}
          </h1>

          <p className="mt-4 max-w-xl text-blue-100">
            Monitor your assigned shifts, discover nearby volunteer
            opportunities and stay prepared for every event.
          </p>

          <div className="flex gap-4 mt-8">
            <button
              onClick={() => navigate("/browse-shifts")}
              className="bg-white text-blue-700 px-6 py-3 rounded-2xl font-semibold hover:scale-105 transition"
            >
              Browse Shifts
            </button>

            <button
              onClick={() => navigate("/shifts")}
              className="border border-white/30 px-6 py-3 rounded-2xl backdrop-blur hover:bg-white/10 transition"
            >
              View Schedule
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div className="rounded-2xl bg-white/10 backdrop-blur p-5">
            <Plus size={32} />
            <h3 className="mt-4 text-3xl font-bold">0</h3>
            <p className="text-blue-100">Upcoming Shifts</p>
          </div>

          <div className="rounded-2xl bg-white/10 backdrop-blur p-5">
            <ArrowRight size={32} />
            <h3 className="mt-4 text-3xl font-bold">—</h3>
            <p className="text-blue-100">Attendance</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WelcomeCard;