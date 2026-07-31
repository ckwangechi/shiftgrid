import {X,MapPin,CalendarDays,Clock3,Briefcase,Share2,Bookmark} from "lucide-react";

const ShiftDetailsDrawer=({shift,isOpen,onClose,onClaim})=>{

if(!isOpen||!shift)return null;

return(
<div className="fixed inset-0 z-[100] flex items-center justify-center p-4">

<div onClick={onClose} className="absolute inset-0 bg-black/50 backdrop-blur-xl"/>


<div className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl bg-white dark:bg-slate-950 shadow-2xl flex flex-col animate-scaleIn">


<header className="flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-slate-800">

<button onClick={onClose} className="text-slate-600 dark:text-slate-300 hover:text-blue-500">
← Back
</button>


<div className="flex gap-2">

<button className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white">
<Bookmark size={18}/>
</button>


<button className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white">
<Share2 size={18}/>
</button>


<button onClick={onClose} className="p-3 rounded-xl bg-red-100 dark:bg-red-900/40 text-red-600">
<X size={18}/>
</button>

</div>

</header>



<div className="overflow-y-auto p-6 space-y-6">


<div>

<h1 className="text-3xl font-bold text-slate-900 dark:text-white">
{shift.title}
</h1>

<p className="mt-2 text-blue-600 dark:text-blue-400 font-semibold">
{shift.event}
</p>

</div>



<div className="grid md:grid-cols-2 gap-4">


<Card icon={<MapPin/>} title="Location" value={shift.location}/>

<Card icon={<CalendarDays/>} title="Date" value={shift.date}/>

<Card icon={<Clock3/>} title="Time" value={shift.time}/>

<Card icon={<Briefcase/>} title="Skill" value={shift.skill}/>


</div>



<section className="rounded-3xl border border-slate-200 dark:border-slate-800 p-5">

<h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
About Shift
</h2>

<p className="text-slate-600 dark:text-slate-300">
{shift.description || "Join this event team and complete assigned responsibilities professionally."}
</p>

</section>




<section className="rounded-3xl border border-slate-200 dark:border-slate-800 p-5">

<h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
Requirements
</h2>


<div className="flex flex-wrap gap-3">

{["National ID","Smartphone","Punctuality","Team Work"].map(item=>(

<span key={item} className="px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm">

✓ {item}

</span>

))}

</div>

</section>




<section className="rounded-3xl bg-slate-100 dark:bg-slate-900 p-5">

<h2 className="text-xl font-bold text-slate-900 dark:text-white">
Employer
</h2>

<p className="mt-2 text-slate-600 dark:text-slate-300">
Verified Employer ⭐ 4.9 Rating
</p>

</section>



</div>




<footer className="p-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">


<button
  onClick={onClaim}
  disabled={shift.claimed}
  className={
    shift.claimed
      ? "w-full py-4 rounded-2xl bg-slate-400 text-white font-bold text-lg cursor-not-allowed transition"
      : "w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg transition"
  }
>

  {shift.claimed ? "Claimed" : "Claim Shift"}

</button>


</footer>


</div>


</div>
)

}



const Card=({icon,title,value})=>(

<div className="rounded-2xl bg-slate-100 dark:bg-slate-900 p-5">

<div className="text-blue-600 mb-3">
{icon}
</div>

<p className="text-sm text-slate-500 dark:text-slate-400">
{title}
</p>

<p className="font-semibold text-slate-900 dark:text-white mt-1">
{value}
</p>

</div>

)



export default ShiftDetailsDrawer;