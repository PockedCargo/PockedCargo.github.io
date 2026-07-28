import { useState, useCallback } from "react";

interface ProfileCardProps {
  name: string;
  tagline: string;
  location: string;
}

export default function ProfileCard({ name, tagline, location }: ProfileCardProps) {
  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);
  const initials = name.split(" ").map((n) => n[0]).join("");

  const handleClick = useCallback(() => {
    setClicked(true);
    setTimeout(() => setClicked(false), 3000);
  }, []);

  return (
    <div className="border border-border rounded-lg bg-card p-5 md:p-6 relative overflow-hidden group">
      {/* Subtle grid background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: "linear-gradient(rgba(0,255,65,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,65,0.3) 1px, transparent 1px)",
        backgroundSize: "16px 16px",
      }} />

      <div className="flex flex-col md:flex-row items-center md:items-start gap-5 relative z-10">
        {/* Interactive avatar */}
        <div
          className="relative shrink-0 cursor-pointer"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={handleClick}
        >
          {/* Rotating ring on hover */}
          <div className={`absolute -inset-1 rounded-full border border-transparent transition-all duration-700 ${
            hovered ? "border-primary/30" : ""
          }`}>
            {hovered && (
              <div className="absolute inset-0 rounded-full"
                style={{ animation: "spin 3s linear infinite", background: "conic-gradient(from 0deg, transparent, rgba(0,255,65,0.3), transparent, rgba(0,255,65,0.3), transparent)" }}
              />
            )}
          </div>

          {/* Avatar */}
          <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full border-2 transition-all duration-500 overflow-hidden relative ${
            hovered ? "border-primary/70 shadow-[0_0_20px_rgba(0,255,65,0.15)]" : "border-border"
          }`}>
            {/* Avatar background */}
            <div className="w-full h-full bg-gradient-to-br from-primary/15 via-accent/5 to-primary/5 flex items-center justify-center">
              <span className={`text-2xl font-mono font-bold transition-all duration-300 ${
                hovered ? "text-primary/90 scale-110" : "text-primary/60"
              }`}>{initials}</span>
            </div>

            {/* Scanning line */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none"
              style={{ animation: hovered ? "scanLine 1.5s ease-in-out infinite" : "none" }}
            >
              <div className="absolute left-0 right-0 h-0.5 bg-primary/40 blur-sm"
                style={{ animation: "scanMove 1.5s ease-in-out infinite" }} />
            </div>
          </div>

          {/* Status dot */}
          <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-background transition-all duration-500 ${
            hovered ? "bg-primary shadow-[0_0_8px_rgba(0,255,65,0.6)]" : "bg-primary/70"
          }`}>
            <div className={`absolute inset-0 rounded-full ${hovered ? "animate-ping" : ""} bg-primary/40`} />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 text-center md:text-left">
          <p className="text-[10px] text-muted-foreground font-mono mb-1 transition-all">
            user@portfolio:~${" "}
            {clicked ? (
              <span className="text-primary">cat /etc/passwd | grep jimnah</span>
            ) : (
              <span className="text-accent">whoami</span>
            )}
          </p>

          <div className="transition-all duration-300" style={{ opacity: clicked ? 0.6 : 1 }}>
            <h1 className="text-xl md:text-2xl font-bold text-primary font-mono tracking-tight mb-1">
              {name}
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground font-mono leading-relaxed">
              {tagline}
            </p>
            <p className="text-[10px] font-mono text-muted-foreground mt-2">
              <span className="text-muted-foreground/60">📍</span> {location}
              <span className="mx-2 text-border">|</span>
              <span className="text-primary/60">uid=1000(jimnah)</span>
              <span className="mx-2 text-border">|</span>
              <span className="text-accent/60">groups=27(sudo)</span>
            </p>
          </div>

          {/* Terminal response on click */}
          <div className={`overflow-hidden transition-all duration-500 ${
            clicked ? "max-h-20 opacity-100 mt-3" : "max-h-0 opacity-0"
          }`}>
            <div className="border border-primary/20 rounded p-2 bg-primary/5">
              <pre className="text-[9px] font-mono text-primary/70 leading-5">
                jimnah:x:1000:1000:Jimnah Kabiria,,,:/home/jimnah:/bin/bash{'\n'}
                {hovered ? "→ interactive session active" : "→ last login: just now"}
              </pre>
            </div>
          </div>

          {/* Interactive hint */}
          <p className="text-[8px] font-mono text-muted-foreground/30 mt-3 transition-opacity">
            {hovered ? "click for terminal output • hover me" : "hover the avatar for effect"}
          </p>
        </div>
      </div>

      <style>{`
        @keyframes scanMove {
          0%, 100% { top: 0%; }
          50% { top: 95%; }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
