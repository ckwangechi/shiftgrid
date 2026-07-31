import { X, MapPin, CalendarDays, Clock3, Briefcase, AlertTriangle } from "lucide-react";

const CancelShiftModal = ({ open, shift, onClose, onConfirm }) => {
  if (!open || !shift) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <AlertTriangle className="text-red-600" size={22} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Cancel Shift Claim?
              </h2>
            </div>
            <p className="mt-1 text-slate-500 dark:text-slate-400">
              This will release your claim. The shift will become available for others.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="text-slate-500" />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {shift.title}
            </h3>
            <p className="text-blue-600 font-medium mt-1">
              {shift.event}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <InfoCard icon={<MapPin />} title="Location" value={shift.location} />
            <InfoCard icon={<CalendarDays />} title="Date" value={shift.displayDate} />
            <InfoCard icon={<Clock3 />} title="Time" value={shift.time} />
            <InfoCard icon={<Briefcase />} title="Skill" value={shift.skill} />
          </div>

          <div className="rounded-2xl border border-orange-200 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-800 p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-orange-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-orange-700 dark:text-orange-400">
                  You currently have this shift claimed
                </h4>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  Cancelling will make this shift visible again on the browse page for other volunteers.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 px-8 py-6 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold transition hover:bg-slate-100"
          >
            Keep My Shift
          </button>
          <button
            onClick={() => onConfirm(shift)}
            className="px-8 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-semibold transition flex items-center gap-2"
          >
            Yes, Cancel Claim
          </button>
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ icon, title, value }) => (
  <div className="rounded-2xl bg-slate-100 dark:bg-slate-800 p-4 flex gap-3">
    <div className="text-blue-600 mt-1">{icon}</div>
    <div>
      <p className="text-xs uppercase text-slate-500 dark:text-slate-400">
        {title}
      </p>
      <p className="font-semibold text-slate-900 dark:text-white mt-1">
        {value || "—"}
      </p>
    </div>
  </div>
);

export default CancelShiftModal;
