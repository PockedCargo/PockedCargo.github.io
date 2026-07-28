import { useEffect, useRef } from "react";

const codeSnippets = [
  "nmap -sV -p- -A 10.0.0.1/24",
  "sudo tcpdump -i eth0 -n port 80",
  "chmod 755 /usr/local/bin/exploit",
  "ssh -i key.pem root@192.168.1.100",
  "hydra -l admin -P rockyou.txt ssh://10.0.0.1",
  "john --format=raw-sha256 --wordlist=/usr/share/wordlists/rockyou.txt hash.txt",
  "gobuster dir -u http://target.com -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt",
  "msfvenom -p linux/x64/shell_reverse_tcp LHOST=10.0.0.5 LPORT=4444 -f elf > payload.elf",
  "sqlmap -u 'http://target.com/page?id=1' --dbs",
  "wireshark -i wlan0 -k -f 'tcp port 443'",
  "iptables -A INPUT -s 10.0.0.0/24 -j DROP",
  "openssl s_client -connect target.com:443",
  "nc -lvnp 4444",
  "curl -X POST -d 'user=admin&pass=admin' http://target.com/login",
  "ping -c 4 8.8.8.8",
  "dig +short axfr @ns1.target.com target.com",
  "python3 -c 'import pty; pty.spawn(\"/bin/bash\")'",
  "sudo systemctl start apache2",
  "ls -la /etc/passwd /etc/shadow",
  "cat /var/log/auth.log | grep 'Failed password'",
  "traceroute -T -p 80 target.com",
  "aircrack-ng -w /usr/share/wordlists/rockyou.txt capture-01.cap",
  "binwalk -Me firmware.bin",
  "strings payload.exe | grep -i 'http\\|https'",
  "hashcat -m 0 -a 0 hash.txt /usr/share/wordlists/rockyou.txt",
];

interface CodeRainProps {
  activityLevel?: number;
}

export default function CodeRain({ activityLevel = 0 }: CodeRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const linesRef = useRef<{ x: number; y: number; text: string; speed: number; opacity: number }[]>([]);
  const mousePosRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Spawn initial lines
      const count = Math.floor(canvas.width / 8);
      linesRef.current = Array.from({ length: count }, (_, i) => ({
        x: i * 8,
        y: Math.random() * canvas.height,
        text: codeSnippets[Math.floor(Math.random() * codeSnippets.length)],
        speed: 0.3 + Math.random() * 0.5,
        opacity: 0.05 + Math.random() * 0.1,
      }));
    };
    resize();
    window.addEventListener("resize", resize);

    const handleMouse = (e: MouseEvent | TouchEvent) => {
      const pos = e instanceof MouseEvent ? { x: e.clientX, y: e.clientY } : { x: e.touches[0].clientX, y: e.touches[0].clientY };
      mousePosRef.current = pos;
    };
    window.addEventListener("mousemove", handleMouse);
    window.addEventListener("touchmove", handleMouse);
    window.addEventListener("mouseleave", () => { mousePosRef.current = { x: -1000, y: -1000 }; });

    let animFrame: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const line of linesRef.current) {
        line.y += line.speed;
        if (line.y > canvas.height) {
          line.y = -20;
          line.text = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
        }

        // Mouse proximity brightening
        const dx = mousePosRef.current.x - line.x;
        const dy = mousePosRef.current.y - line.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const mouseInfluence = Math.max(0, 1 - dist / 200) * 0.8;

        const alpha = Math.min(line.opacity + mouseInfluence + activityLevel * 0.1, 0.9);
        ctx.fillStyle = `rgba(0, 255, 65, ${alpha})`;
        ctx.font = "10px 'JetBrains Mono', 'Fira Code', monospace";
        ctx.fillText(line.text, line.x, line.y);
      }

      animFrame = requestAnimationFrame(animate);
    };
    animFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("touchmove", handleMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  );
}
