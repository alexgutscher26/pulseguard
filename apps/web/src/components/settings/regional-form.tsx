"use client";

export function RegionalForm() {
  return (
    <section className="bg-black/40 border border-primary/20 relative overflow-hidden backdrop-blur-sm group hover:border-primary/40 transition-all">
       {/* Corner Decor */}
       <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-primary/30 group-hover:border-primary/60 transition-colors"></div>

      <div className="p-6 border-b border-primary/20 bg-primary/5">
        <h3 className="text-lg font-bold text-foreground font-mono uppercase tracking-tight">Regional Settings</h3>
        <p className="text-xs text-primary/60 font-mono">Synchronize time and date formats</p>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-primary/70 uppercase tracking-widest font-mono">Timezone</label>
          <select className="bg-black/50 border border-primary/20 focus:border-primary/60 text-primary text-sm rounded-sm p-2.5 font-mono focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all appearance-none">
            <option>(GMT-08:00) Pacific Time</option>
            <option>(GMT+00:00) UTC</option>
            <option>(GMT+01:00) Central European Time</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-primary/70 uppercase tracking-widest font-mono">Date Format</label>
          <select className="bg-black/50 border border-primary/20 focus:border-primary/60 text-primary text-sm rounded-sm p-2.5 font-mono focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all appearance-none">
            <option>DD/MM/YYYY</option>
            <option>MM/DD/YYYY</option>
            <option>YYYY-MM-DD</option>
          </select>
        </div>
      </div>
    </section>
  );
}
