import { motion } from "framer-motion";

const statsData = {
  skills: [
    { name: "Digital Forensics", level: 80 },
    { name: "Incident Response", level: 75 },
    { name: "Penetration Testing", level: 70 },
    { name: "Threat Intelligence", level: 65 },
    { name: "Python Scripting", level: 75 },
    { name: "Network Security", level: 70 },
    { name: "OSINT", level: 60 },
    { name: "Log Analysis", level: 80 },
  ],
  badges: [
    { label: "SHERLOCKS", value: "5+" },
    { label: "MACHINES", value: "10+" },
    { label: "ENGAGEMENTS", value: "15+" },
    { label: "CASE FILES", value: "8" },
    { label: "DEPLOYMENTS", value: "3" },
    { label: "CERTIFICATIONS", value: "2" },
  ],
  platforms: [
    { name: "HackTheBox", status: "Active", level: "Pro Hacker" },
    { name: "TryHackMe", status: "Active", level: "Top 5%" },
    { name: "LetsDefend", status: "Active", level: "Blue Team" },
    { name: "PicoCTF", status: "Completed", level: "Top 10%" },
  ],
};

export default function StatsSection() {
  return (
    <div>
      <div className="text-xs text-muted-foreground font-mono mb-4">$ cat ./stats/ — metrics & progress</div>

      <div className="space-y-6">
        {/* Badges row */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {statsData.badges.map((badge, i) => (
            <motion.div
              key={badge.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="border border-border rounded-lg bg-card p-3 text-center"
            >
              <div className="text-lg font-mono font-bold text-primary">{badge.value}</div>
              <div className="text-[9px] font-mono text-muted-foreground mt-1">{badge.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Skills bars */}
        <div className="border border-border rounded-lg bg-card p-3">
          <p className="text-[10px] font-mono text-primary/60 mb-3">$ cat skills.progress</p>
          <div className="space-y-2">
            {statsData.skills.map((skill) => (
              <div key={skill.name}>
                <div className="flex justify-between text-[9px] font-mono mb-0.5">
                  <span className="text-muted-foreground">{skill.name}</span>
                  <span className="text-muted-foreground/60">{skill.level}%</span>
                </div>
                <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.level}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="h-full bg-gradient-to-r from-primary/60 to-primary rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Platforms */}
        <div className="border border-border rounded-lg bg-card p-3">
          <p className="text-[10px] font-mono text-primary/60 mb-2">$ cat platforms.active</p>
          <div className="space-y-2">
            {statsData.platforms.map((p) => (
              <div key={p.name} className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-foreground">{p.name}</span>
                <div className="flex items-center gap-2">
                  <span className={`${p.status === "Active" ? "text-primary" : "text-muted-foreground"}`}>
                    [{p.status}]
                  </span>
                  <span className="text-muted-foreground/60">{p.level}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
