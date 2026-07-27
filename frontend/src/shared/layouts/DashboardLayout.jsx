import { useLayout } from "../contexts/LayoutContext";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const DashboardLayout = ({ children }) => {
  const { mobileSidebar, closeMobileSidebar } = useLayout();

  return (
    <div className="h-screen flex overflow-hidden bg-slate-100 dark:bg-[#07111F]">
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />

        <main className="flex-1 overflow-y-auto bg-slate-100 dark:bg-[#020617] relative">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-52 -right-52 w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[140px]" />
            <div className="absolute bottom-0 -left-52 w-[450px] h-[450px] rounded-full bg-indigo-500/10 blur-[140px]" />
          </div>

          <div className="relative z-10 max-w-[1700px] mx-auto px-8 py-8">
            {children}
          </div>
        </main>
      </div>

      {mobileSidebar && (
        <div
          className="fixed inset-0 z-50 md:hidden"
          onClick={closeMobileSidebar}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="absolute left-0 top-0 h-full w-72 bg-slate-950 border-r border-slate-800 shadow-2xl">
            <Sidebar />
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;