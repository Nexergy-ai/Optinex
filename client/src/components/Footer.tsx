import { Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Branding */}
          <div className="text-center md:text-left">
            <p className="text-slate-300 font-semibold tracking-wide">
              OPTINEX AI — Operational Intelligence Infrastructure
            </p>
            <p className="text-slate-500 text-sm mt-2">
              Intelligent orchestration for operational excellence
            </p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            <a
              href="https://github.com/Optinex-ai/optinex-ai-web"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors"
            >
              <Github className="w-5 h-5" />
              <span className="text-sm">GitHub Repository</span>
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-8 border-t border-slate-800">
          <p className="text-slate-500 text-xs text-center">
            © 2024 OPTINEX AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
