const contactLinks = [
  {
    name: "GitHub",
    url: "https://github.com/pockedcargo",
    handle: "github.com/pockedcargo",
    endpoint: "EXTERNAL",
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/jimnah-kabiria-/",
    handle: "linkedin.com/in/jimnah-kabiria",
    endpoint: "EXTERNAL",
  },
  {
    name: "Email",
    url: "mailto:jimnahkabiria@gmail.com",
    handle: "jimnahkabiria@gmail.com",
    endpoint: "EXTERNAL",
  },
];

export default function ContactSection() {
  return (
    <div>
      <div className="text-xs text-muted-foreground font-mono mb-4">
        jimnah@connect:~$ ./contacts
      </div>

      <div className="space-y-2">
        {contactLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 border border-border rounded-lg bg-card hover:border-primary/30 transition-colors group"
          >
            <span className="text-primary text-[10px] font-mono">{link.name}</span>
            <span className="text-[10px] font-mono text-muted-foreground">{link.handle}</span>
            <span className="text-[8px] font-mono text-muted-foreground/30">[{link.endpoint}]</span>
            <span className="ml-auto text-[10px] font-mono text-muted-foreground group-hover:text-primary transition-colors">
              →
            </span>
          </a>
        ))}
        <div className="pt-2 text-[9px] font-mono text-primary/70 border-t border-border/30">
          [STATUS] Open for collaboration | PGP: available upon request
        </div>
      </div>
    </div>
  );
}
