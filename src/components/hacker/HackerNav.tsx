import { useSounds } from "@/hooks/use-sounds";

interface HackerNavProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

const navLinks = [
  { id: "home", label: "Home" },
  { id: "projects", label: "Work" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

const secondaryLinks = [
  { id: "tools", label: "Tools" },
  { id: "cheatsheets", label: "Cheats" },
  { id: "stats", label: "Stats" },
];

export default function HackerNav({ activeSection, onNavigate }: HackerNavProps) {
  const { play } = useSounds();
  const allLinks = [...navLinks, ...secondaryLinks];

  return (
    <nav className="fixed top-0 left-0 right-0 z-30 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Brand */}
        <button
          onClick={() => { play("click"); onNavigate("home"); }}
          className="flex items-center gap-1 text-sm font-mono text-foreground hover:text-primary transition-colors"
        >
          <span className="text-primary">⚡</span>
          <span>Jimnah<span className="text-accent">.</span></span>
        </button>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => { play("click"); onNavigate(link.id); }}
              onMouseEnter={() => play("hover")}
              className="relative px-3 py-2 text-[10px] font-mono uppercase tracking-wider transition-colors group"
            >
              <span className={`${activeSection === link.id ? "text-primary" : "text-muted-foreground/70 hover:text-foreground"} transition-colors`}>
                {link.label}
              </span>
              {/* Hover line — surgical scaleX(0→1) from center like a loading bar */}
              <span className={`absolute bottom-1 left-0 right-0 h-px bg-primary origin-center transition-transform duration-300 ${
                activeSection === link.id ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-60"
              }`} />
            </button>
          ))}

          {/* Separator */}
          <div className="w-px h-4 bg-border/50 mx-1" />

          {/* Secondary links */}
          {secondaryLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => { play("click"); onNavigate(link.id); }}
              onMouseEnter={() => play("hover")}
              className="relative px-2 py-2 text-[9px] font-mono transition-colors group"
            >
              <span className={`${activeSection === link.id ? "text-primary" : "text-muted-foreground/50 hover:text-muted-foreground"} transition-colors`}>
                ~/{link.id}
              </span>
              <span className={`absolute bottom-1 left-0 right-0 h-px bg-primary/50 origin-center transition-transform duration-300 ${
                activeSection === link.id ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-40"
              }`} />
            </button>
          ))}
        </div>

        {/* Availability indicator */}
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-[0_0_6px_rgba(0,212,255,0.5)]" />
          <span className="text-[7px] font-mono text-accent/60 hidden md:inline uppercase tracking-widest">Live</span>
        </div>
      </div>
    </nav>
  );
}
