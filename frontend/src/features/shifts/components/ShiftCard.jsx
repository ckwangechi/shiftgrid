import {
  Calendar,
  Clock3,
  MapPin,
  Users,
  Award,
  ArrowRight,
} from "lucide-react";

const ShiftCard = ({ shift, onView, onClaim }) => {
  return (
    <div className="group rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">

      <div className="h-2 bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600" />

      <div className="p-6">

        <div className="flex justify-between">

          <div>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {shift.title}
            </h2>

            <p className="text-slate-500 dark:text-slate-400 mt-1">
              {shift.event}
            </p>

          </div>

          <span className="rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1 text-sm font-semibold">
            {shift.status}
          </span>

        </div>

        <div className="mt-6 space-y-3">

          <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
            <MapPin size={18}/>
            {shift.location}
          </div>

          <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
            <Calendar size={18}/>
            {shift.displayDate}
          </div>

          <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
            <Clock3 size={18}/>
            {shift.time}
          </div>

          <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
            <Award size={18}/>
            {shift.skill}
          </div>

        </div>

        <div className="mt-6 flex justify-between">

          <div>

            <p className="text-sm text-slate-400">
              Match
            </p>

            <h3 className="text-2xl font-bold text-blue-600">
              {shift.match}%
            </h3>

          </div>

          <div>

            <p className="text-sm text-slate-400">
              Slots
            </p>

            <div className="flex items-center gap-2">

              <Users size={18}/>

              <span className="font-semibold text-slate-900 dark:text-white">
                {shift.slots}
              </span>

            </div>

          </div>

        </div>

        <div className="mt-8 flex gap-3">

          <button
  onClick={onView}
  className="
    flex-1
    py-3
    rounded-xl
    border
    border-emerald-500/30
    bg-emerald-50
    dark:bg-emerald-900/20
    text-emerald-700
    dark:text-emerald-400
    font-semibold
    flex
    items-center
    justify-center
    gap-2
    transition-all
    duration-300
    hover:bg-emerald-600
    hover:text-white
    hover:border-emerald-600
    hover:shadow-lg
    hover:shadow-emerald-500/30
    active:scale-95
  "
>
  View Details
</button>


        </div>

      </div>

    </div>
  );
};

export default ShiftCard;