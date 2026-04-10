import Link from "next/link";
import Image from "next/image";
import { Instagram, Linkedin, Youtube, Phone } from "lucide-react";
import NewsletterStrip from "./NewsletterStrip";

const DiscordIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
  </svg>
);

const FacebookIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-zinc-50 border-t border-zinc-200 dark:bg-[#020202] dark:border-white/10 transition-colors duration-300">
      <div className="container mx-auto max-w-7xl px-6 py-16 lg:py-20">

        {/* Newsletter Strip */}
        <NewsletterStrip />

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">

          {/* Column 1: Brand & Socials */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-4 mb-5">
              <div className="relative h-9 w-10">
                <Image src="/images/Untitled-design-54.webp" alt="HITAM" fill className="object-contain" />
              </div>
              <div className="w-px h-5 bg-zinc-300 dark:bg-white/10" />
              <div className="relative h-9 w-10">
                <Image src="/images/Untitled-design-55.webp" alt="IUCEE-EWB" fill className="object-contain" />
              </div>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xs mb-6">
              IUCEE-EWB HITAM — a student engineering chapter building practical, sustainable solutions for real communities.
            </p>
            {/* Glass tab behind IUCEE letters */}
            <div className="inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-white/50 dark:bg-white/[0.08] border border-white/60 dark:border-white/15 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] ring-1 ring-inset ring-white/30 dark:ring-white/5 transition-all duration-300">
              {[
                { id: "facebook", letter: "I", color: "#1877F2", href: "https://www.facebook.com/share/1CgojJiDAy/", icon: <FacebookIcon size={16} /> },
                { id: "instagram", letter: "U", color: "#D641B9", href: "https://www.instagram.com/iucee.ewb.hitam?igsh=cTkwOXc1cWRweXg5", icon: <Instagram size={16} /> },
                { id: "youtube", letter: "C", color: "#D42121", href: "https://youtube.com/@ewbhitam2001?si=fREnsa3FaPEweRG3", icon: <Youtube size={16} /> },
                { id: "linkedin", letter: "E", color: "#087EB1", href: "https://www.linkedin.com/in/ewbhitam?utm_source=share_via&utm_content=profile&utm_medium=member_android", icon: <Linkedin size={16} /> },
                { id: "discord", letter: "E", color: "#7289da", href: "https://discord.gg/WtJeaRV3", icon: <DiscordIcon size={16} /> },
              ].map((social) => (
                <a key={social.id} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.id} className="group relative w-10 h-10 block" style={{ perspective: "1000px" }}>
                  <div
                    className="w-full h-full transition-transform duration-500 group-hover:[transform:rotateY(180deg)] rounded-full"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    {/* Front: Letter */}
                    <div
                      className="absolute inset-0 flex items-center justify-center rounded-full text-white text-lg font-bold cursor-pointer"
                      style={{ backfaceVisibility: "hidden", backgroundColor: social.color, fontFamily: "var(--font-nunito), sans-serif" }}
                    >
                      {social.letter}
                    </div>
                    {/* Back: Social Icon */}
                    <div
                      className="absolute inset-0 flex items-center justify-center rounded-full text-white cursor-pointer"
                      style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", backgroundColor: social.color }}
                    >
                      {social.icon}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Explore */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-5">Explore</h3>
            <ul className="space-y-3.5">
              {[
                { href: "/", label: "Home" },
                { href: "/about", label: "About Us" },
                { href: "/events", label: "Projects & History" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-zinc-500 hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400 transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-5">Resources</h3>
            <ul className="space-y-3.5">
              {[
                { href: "#", label: "Join the Team" },
                { href: "#", label: "Field Guidelines" },
                { href: "#", label: "Hardware Assets" },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-zinc-500 hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400 transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Us */}
          <div className="lg:col-span-3">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-5">Contact Us</h3>
            <ul className="space-y-5">

              {/* Current President */}
              <li>
                <p className="text-[10px] uppercase tracking-[0.15em] font-bold text-emerald-600 dark:text-emerald-400 mb-1">Current President</p>
                <p className="text-sm font-semibold text-zinc-900 dark:text-white leading-tight mb-1">Ameena Begum Mahek</p>
                <div className="flex flex-col gap-1">
                  <a href="tel:+919966864664" className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400 transition-colors">
                    <Phone size={11} />
                    +91 99668 64664
                  </a>
                  <a
                    href="https://www.linkedin.com/in/ameena-begum-mahek-01a148329/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-[#0A66C2] dark:text-zinc-400 dark:hover:text-[#0A66C2] transition-colors"
                  >
                    <Linkedin size={11} />
                    LinkedIn Profile
                  </a>
                </div>
              </li>

              {/* Current Vice-President */}
              <li>
                <p className="text-[10px] uppercase tracking-[0.15em] font-bold text-emerald-600 dark:text-emerald-400 mb-1">Current Vice-President</p>
                <p className="text-sm font-semibold text-zinc-900 dark:text-white leading-tight mb-1">Kanishka Chitturi</p>
                <div className="flex flex-col gap-1">
                  <a
                    href="https://www.linkedin.com/in/kanishka-chitturi-03482a351/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-[#0A66C2] dark:text-zinc-400 dark:hover:text-[#0A66C2] transition-colors"
                  >
                    <Linkedin size={11} />
                    LinkedIn Profile
                  </a>
                </div>
              </li>

              {/* Assistant Dean */}
              <li>
                <p className="text-[10px] uppercase tracking-[0.15em] font-bold text-emerald-600 dark:text-emerald-400 mb-1">Assistant Dean IIIC</p>
                <p className="text-sm font-semibold text-zinc-900 dark:text-white leading-tight mb-1">Dr Kasarla Satish Reddy</p>
                <a href="tel:+919700938400" className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400 transition-colors">
                  <Phone size={11} />
                  +91 97009 38400
                </a>
              </li>

              {/* Faculty Mentor */}
              <li>
                <p className="text-[10px] uppercase tracking-[0.15em] font-bold text-emerald-600 dark:text-emerald-400 mb-1">Faculty Mentor</p>
                <p className="text-sm font-semibold text-zinc-900 dark:text-white leading-tight mb-1">Santosh Naik</p>
                <div className="flex flex-col gap-1">
                  <a href="tel:+919980299366" className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400 transition-colors">
                    <Phone size={11} />
                    +91 99802 99366
                  </a>
                  <a
                    href="https://www.linkedin.com/in/santosh-naik-8b144160/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-[#0A66C2] dark:text-zinc-400 dark:hover:text-[#0A66C2] transition-colors"
                  >
                    <Linkedin size={11} />
                    LinkedIn Profile
                  </a>
                </div>
              </li>

            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-zinc-200 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            © {new Date().getFullYear()} IUCEE-EWB HITAM Chapter. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-xs text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-xs text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
