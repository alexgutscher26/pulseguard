import { CheckCircle2, Globe, Database, Shield, Server, Activity, Loader2 } from "lucide-react";

export default function Features() {
  return (
    <section className="py-24 bg-background relative overflow-hidden" id="features">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center mb-16 flex flex-col items-center">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            See <span className="text-primary">PulseGuard</span> in action
          </h2>
          <p className="text-muted-foreground text-lg">
            Watch how global surveillance prevents downtime experiences
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Live Status Demo */}
          <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 flex flex-col group hover:border-white/10 transition-colors">
            {/* Visual Area */}
            <div className="bg-[#111] border border-white/5 rounded-xl h-[220px] w-full mb-6 relative overflow-hidden p-4">
              {/* Lightning Bolt Top Right */}
              <div className="absolute top-4 right-4 size-12 rounded-full border border-white/10 flex items-center justify-center">
                <Activity className="size-6 text-primary group-hover:scale-110 transition-transform" />
              </div>

              {/* Chat-like rows to match placeholder style */}
              <div className="w-[60%] h-12 bg-white/5 rounded-xl mb-3 flex items-center px-4">
                <div className="w-1/2 h-2 rounded-full bg-white/20"></div>
              </div>

              <div className="w-[45%] h-12 bg-white/5 rounded-xl mb-3 flex items-center px-4">
                <div className="w-[40%] h-2 rounded-full bg-white/20"></div>
              </div>

              {/* Bright Green Box */}
              <div className="absolute top-1/2 left-[30%] w-[60%] h-14 bg-primary/20 border border-primary rounded-xl flex flex-col justify-center px-4 gap-2">
                <div className="w-[60%] h-2 rounded-full bg-primary/80"></div>
                <div className="w-[40%] h-2 rounded-full bg-primary/50"></div>
              </div>

              <div className="w-[30%] h-10 bg-white/5 rounded-xl mt-8 flex items-center px-4">
                <div className="w-full h-2 rounded-full bg-white/20"></div>
              </div>
            </div>

            <h3 className="text-lg font-bold text-foreground mb-2">Live Status Demo</h3>
            <p className="text-sm text-muted-foreground/80 leading-relaxed">
              See PulseGuard handle real infrastructure inquiries instantly
            </p>
          </div>

          {/* Card 2: Incident Resolution */}
          <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 flex flex-col group hover:border-white/10 transition-colors">
            {/* Visual Area */}
            <div className="h-[220px] w-full mb-6 relative flex flex-col items-center justify-center p-2">
              {/* Stacked Cards */}
              <div className="relative w-full h-[120px] flex items-center justify-center mt-4">
                {/* Left Card */}
                <div className="absolute left-[5%] top-4 w-[110px] h-[75px] bg-[#1a1a1a] border border-white/10 rounded-xl flex flex-col p-3 shadow-xl transform -rotate-6 transition-transform group-hover:rotate-0">
                  <div className="w-full h-1.5 bg-white/20 rounded-full mb-2"></div>
                  <div className="w-2/3 h-1.5 bg-white/20 rounded-full"></div>
                  <CheckCircle2 className="size-4 text-primary absolute bottom-3 right-3" />
                </div>

                {/* Center Card */}
                <div className="absolute z-10 w-[120px] h-[85px] bg-[#1a1a1a] border border-white/20 rounded-xl flex flex-col p-3 shadow-2xl transform -translate-y-2 transition-transform group-hover:-translate-y-4">
                  <div className="w-full h-1.5 bg-white/20 rounded-full mb-2"></div>
                  <div className="w-2/3 h-1.5 bg-white/20 rounded-full mb-2"></div>
                  <div className="w-1/2 h-1.5 bg-white/20 rounded-full"></div>
                  <CheckCircle2 className="size-5 text-primary absolute bottom-3 right-3 shadow-[0_0_15px_rgba(57,255,20,0.5)] rounded-full bg-black" />
                </div>

                {/* Right Card */}
                <div className="absolute right-[5%] top-6 w-[110px] h-[75px] bg-[#1a1a1a] border border-white/10 rounded-xl flex flex-col p-3 shadow-xl transform rotate-6 transition-transform group-hover:rotate-0">
                  <div className="w-full h-1.5 bg-white/20 rounded-full mb-2"></div>
                  <div className="w-[80%] h-1.5 bg-white/20 rounded-full"></div>
                  <Loader2 className="size-4 text-primary/70 animate-spin absolute bottom-3 right-3" />
                </div>
              </div>

              {/* Progress Bars */}
              <div className="w-full flex gap-4 mt-auto mb-2 px-8">
                <div className="flex-1 flex items-center gap-2">
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-primary/80 w-[87%]"></div>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground">87%</span>
                </div>
                <div className="flex-1 flex items-center gap-2">
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-primary/60 w-[92%]"></div>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground">92%</span>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-bold text-foreground mb-2">Incident Resolution</h3>
            <p className="text-sm text-muted-foreground/80 leading-relaxed">
              Watch alerts resolve complex automated support tickets
            </p>
          </div>

          {/* Card 3: Multi-Region Support */}
          <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 flex flex-col group hover:border-white/10 transition-colors">
            {/* Visual Area */}
            <div className="h-[220px] w-full mb-6 relative flex items-center justify-center">
              {/* Dotted lines grid background */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 220">
                <circle
                  cx="150"
                  cy="110"
                  r="70"
                  fill="none"
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <circle
                  cx="150"
                  cy="110"
                  r="40"
                  fill="none"
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                {/* Lines radiating */}
                <line
                  x1="150"
                  y1="110"
                  x2="60"
                  y2="40"
                  stroke="rgba(57,255,20,0.3)"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  className="group-hover:stroke-[rgba(57,255,20,0.6)] transition-all"
                />
                <line
                  x1="150"
                  y1="110"
                  x2="240"
                  y2="40"
                  stroke="rgba(57,255,20,0.3)"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  className="group-hover:stroke-[rgba(57,255,20,0.6)] transition-all"
                />
                <line
                  x1="150"
                  y1="110"
                  x2="60"
                  y2="180"
                  stroke="rgba(57,255,20,0.3)"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  className="group-hover:stroke-[rgba(57,255,20,0.6)] transition-all"
                />
                <line
                  x1="150"
                  y1="110"
                  x2="240"
                  y2="180"
                  stroke="rgba(57,255,20,0.3)"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  className="group-hover:stroke-[rgba(57,255,20,0.6)] transition-all"
                />
                <line
                  x1="150"
                  y1="110"
                  x2="150"
                  y2="30"
                  stroke="rgba(57,255,20,0.3)"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  className="group-hover:stroke-[rgba(57,255,20,0.6)] transition-all"
                />
              </svg>

              {/* Center Glowing Hub */}
              <div className="absolute z-10 size-16 bg-primary/10 border border-primary/50 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(57,255,20,0.3)] group-hover:shadow-[0_0_40px_rgba(57,255,20,0.5)] transition-shadow">
                <div className="size-3 bg-primary rounded-full"></div>
              </div>

              {/* Surrounding Nodes */}
              <div className="absolute top-[20px] left-[45px] size-10 bg-[#111] border border-white/10 rounded-full flex items-center justify-center text-muted-foreground group-hover:border-white/30 transition-colors">
                <Globe className="size-4" />
              </div>
              <div className="absolute top-[20px] right-[45px] size-10 bg-[#111] border border-white/10 rounded-full flex items-center justify-center text-muted-foreground group-hover:border-white/30 transition-colors">
                <Shield className="size-4" />
              </div>
              <div className="absolute bottom-[20px] left-[45px] size-10 bg-[#111] border border-white/10 rounded-full flex items-center justify-center text-muted-foreground group-hover:border-white/30 transition-colors">
                <Database className="size-4" />
              </div>
              <div className="absolute bottom-[20px] right-[45px] size-10 bg-[#111] border border-white/10 rounded-full flex items-center justify-center text-muted-foreground group-hover:border-white/30 transition-colors">
                <Server className="size-4" />
              </div>
              <div className="absolute top-[10px] left-[130px] size-10 bg-[#111] border border-white/10 rounded-full flex items-center justify-center text-muted-foreground group-hover:border-white/30 transition-colors">
                <Activity className="size-4" />
              </div>
            </div>

            <h3 className="text-lg font-bold text-foreground mb-2">Multi-Region Support</h3>
            <p className="text-sm text-muted-foreground/80 leading-relaxed">
              Seamless infrastructure surveillance across all zones
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
