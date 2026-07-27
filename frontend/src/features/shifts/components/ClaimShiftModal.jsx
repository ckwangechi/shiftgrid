import {
  CalendarDays,
  Clock3,
  MapPin,
  Briefcase,
  Users,
  CheckCircle2,
  X,
} from "lucide-react";

const ClaimShiftModal = ({
  open,
  shift,
  onClose,
  onConfirm,
}) => {
  if (!open || !shift) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-5">

      <div className="w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">

        {/* Header */}

        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-200 dark:border-slate-800">

          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Confirm Shift Claim
            </h2>

            <p className="mt-1 text-slate-500 dark:text-slate-400">
              Review the details before claiming this shift.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="text-slate-500" />
          </button>

        </div>

        {/* Body */}

        <div className="p-8 space-y-6">

          <div>

            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {shift.title}
            </h3>

            <p className="text-blue-600 font-medium mt-1">
              {shift.event}
            </p>

          </div>

          <div className="grid md:grid-cols-2 gap-5">

            <div className="rounded-2xl bg-slate-100 dark:bg-slate-800 p-4 flex gap-3">

              <MapPin className="text-blue-600 mt-1" />

              <div>

                <p className="text-xs uppercase text-slate-500">
                  Location
                </p>

                <h4 className="font-semibold text-slate-900 dark:text-white">
                  {shift.location}
                </h4>

              </div>

            </div>

            <div className="rounded-2xl bg-slate-100 dark:bg-slate-800 p-4 flex gap-3">

              <CalendarDays className="text-blue-600 mt-1" />

              <div>

                <p className="text-xs uppercase text-slate-500">
                  Date
                </p>

                <h4 className="font-semibold text-slate-900 dark:text-white">
                  {shift.displayDate}
                </h4>

              </div>

            </div>

            <div className="rounded-2xl bg-slate-100 dark:bg-slate-800 p-4 flex gap-3">

              <Clock3 className="text-blue-600 mt-1" />

              <div>

                <p className="text-xs uppercase text-slate-500">
                  Time
                </p>

                <h4 className="font-semibold text-slate-900 dark:text-white">
                  {shift.time}
                </h4>

              </div>

            </div>

            <div className="rounded-2xl bg-slate-100 dark:bg-slate-800 p-4 flex gap-3">

              <Briefcase className="text-blue-600 mt-1" />

              <div>

                <p className="text-xs uppercase text-slate-500">
                  Skill
                </p>

                <h4 className="font-semibold text-slate-900 dark:text-white">
                  {shift.skill}
                </h4>

              </div>

            </div>

          </div>

          <div className="rounded-2xl border border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800 p-5">

            <div className="flex items-start gap-3">

              <CheckCircle2 className="text-green-600 mt-0.5" />

              <div>

                <h4 className="font-semibold text-green-700 dark:text-green-400">
                  Ready to claim
                </h4>

                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  After confirming, this application will be submitted to the employer for review. You'll receive a notification once it's accepted or declined.
                </p>

              </div>

            </div>

          </div>

          <div className="rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 p-5 flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-500">
                Available Slots
              </p>

              <h3 className="text-2xl font-bold text-blue-700">
                {shift.slots}
              </h3>

            </div>

            <Users className="text-blue-600" size={40} />

          </div>

        </div>

        {/* Footer */}

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-4 px-8 py-6 border-t border-slate-200 dark:border-slate-800">

          <button
            onClick={onClose}
            className="px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-semibold transition"
          >
            Cancel
          </button>

          <button
            onClick={() => onConfirm(shift)}
            className="px-8 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
          >
            Confirm Claim
          </button>

        </div>

      </div>

    </div>
  );
};

export default ClaimShiftModal;