import Link from "next/link";
import { ArrowRight, Search, ShieldCheck, MessageSquare, MapPin, KeyRound, Sparkles, AlertCircle, FileCheck, CheckCircle2 } from "lucide-react";
import { Spotlight } from "@/components/aceternity/Spotlight";
import { BentoGrid, BentoGridItem } from "@/components/aceternity/BentoGrid";
import { ShimmerButton } from "@/components/aceternity/ShimmerButton";
import InteractiveWorkflowDemo from "@/components/aceternity/InteractiveWorkflowDemo";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 flex flex-col items-center justify-center text-center px-4 overflow-hidden min-h-[88vh]">
        {/* Spotlight Radiant Glow */}
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="#6366f1" />
        
        {/* Dot pattern background with radial fade */}
        <div className="absolute inset-0 z-0 bg-dot-pattern opacity-60 pointer-events-none" />
        <div className="absolute inset-0 z-0 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,transparent_20%,black_100%)] pointer-events-none" />

        {/* Ambient color blobs */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-400/15 rounded-full blur-3xl -z-10 mix-blend-multiply animate-blob pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-purple-400/15 rounded-full blur-3xl -z-10 mix-blend-multiply animate-blob animation-delay-2000 pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10 flex flex-col items-center">
          {/* Top Pill */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 mb-8 text-xs md:text-sm font-semibold text-indigo-700 bg-white/80 backdrop-blur-md border border-indigo-100 rounded-full shadow-sm hover:shadow transition-shadow">
            <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
            <span>CampusFind 2.0 • Secure College Lost & Found</span>
          </div>
          
          {/* Headline with Gradient */}
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-black text-gray-900 tracking-tight mb-6 leading-[1.08]">
            Lost something? <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
              Recover it safely.
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            The private campus platform connecting finders and owners. No phone number leaks. Stays visible until verified physical handover with 6-digit OTP.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <Link href="/items/lost/new" className="w-full sm:w-auto">
              <ShimmerButton className="w-full sm:w-auto text-sm font-semibold px-8 py-3.5 rounded-full shadow-xl shadow-blue-500/10">
                <span>Report Lost Item</span>
                <ArrowRight className="ml-2 w-4 h-4 inline-block" />
              </ShimmerButton>
            </Link>

            <Link href="/items" className="w-full sm:w-auto">
              <button className="cursor-pointer w-full sm:w-auto px-7 py-3 rounded-full text-sm font-semibold text-gray-800 bg-white/90 hover:bg-white border border-gray-200 shadow-sm hover:shadow transition-all duration-200 flex items-center justify-center hover:scale-105 active:scale-95">
                <Search className="mr-2 w-4 h-4 text-gray-500" />
                Browse Campus Board
              </button>
            </Link>
          </div>

          {/* Quick Stats Strip */}
          <div className="mt-16 pt-8 border-t border-gray-200/60 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center w-full max-w-4xl">
            <div>
              <p className="text-2xl md:text-3xl font-extrabold text-gray-900">100%</p>
              <p className="text-xs text-gray-500 font-medium mt-0.5">Privacy First</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-extrabold text-blue-600">6-Digit</p>
              <p className="text-xs text-gray-500 font-medium mt-0.5">Handover OTP</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-extrabold text-indigo-600">Instant</p>
              <p className="text-xs text-gray-500 font-medium mt-0.5">Anonymous Chat</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-extrabold text-purple-600">Active</p>
              <p className="text-xs text-gray-500 font-medium mt-0.5">Until Resolved</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Workflow Simulation */}
      <section className="py-12 px-4 relative z-10">
        <InteractiveWorkflowDemo />
      </section>

      {/* Aceternity Bento Grid Section */}
      <section className="py-24 px-4 max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
            Engineered for Campus Life
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 mt-3 tracking-tight">
            Security That Actually Works
          </h2>
          <p className="text-gray-600 text-base md:text-lg mt-3">
            Traditional WhatsApp groups leak your number and lead to stolen claims. CampusFind guarantees rightful ownership before handover.
          </p>
        </div>

        <BentoGrid>
          <BentoGridItem
            title="Zero Phone Number Exposure"
            description="All conversations occur within the encrypted in-app chat. Finders and claimants communicate without exchanging private numbers."
            icon={<div className="p-2.5 rounded-xl bg-blue-100 text-blue-600"><MessageSquare className="w-5 h-5" /></div>}
            badge="Privacy"
            className="md:col-span-2"
          />

          <BentoGridItem
            title="6-Digit Handover OTP"
            description="When meeting on campus, the claimant shows a temporary 6-digit code. The finder inputs it into the app to complete the return."
            icon={<div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-600"><KeyRound className="w-5 h-5" /></div>}
            badge="Anti-Theft"
            className="md:col-span-1"
          />

          <BentoGridItem
            title="Item Stays Visible Until Handover"
            description="Listings don't vanish the second a claim is initiated. Items remain marked 'Claim in Progress' until OTP verification completes."
            icon={<div className="p-2.5 rounded-xl bg-amber-100 text-amber-700"><CheckCircle2 className="w-5 h-5" /></div>}
            badge="Continuity"
            className="md:col-span-1"
          />

          <BentoGridItem
            title="Proof of Ownership Upload"
            description="Claimants can securely upload purchase invoices, serial numbers, or pictures of distinguishing features before meeting."
            icon={<div className="p-2.5 rounded-xl bg-purple-100 text-purple-600"><FileCheck className="w-5 h-5" /></div>}
            badge="Verification"
            className="md:col-span-1"
          />

          <BentoGridItem
            title="Community Report & Moderation"
            description="Spam, inappropriate postings, and fake listings are instantly flagged by students and moderated through our admin dashboard."
            icon={<div className="p-2.5 rounded-xl bg-rose-100 text-rose-600"><AlertCircle className="w-5 h-5" /></div>}
            badge="Safety"
            className="md:col-span-1"
          />
        </BentoGrid>
      </section>

      {/* Aceternity Radiant CTA Section */}
      <section className="py-20 px-4 relative">
        <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 text-white p-8 md:p-14 relative overflow-hidden border border-gray-800 shadow-2xl">
          <div className="absolute -top-32 -right-32 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 text-center max-w-2xl mx-auto">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
              Get Started in Seconds
            </span>
            <h2 className="text-3xl md:text-5xl font-black mt-4 mb-4 tracking-tight">
              Ready to recover your item?
            </h2>
            <p className="text-gray-300 text-base md:text-lg mb-8 leading-relaxed">
              Join students across your campus who have recovered keys, IDs, wallets, and laptops safely.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/items/found/new" className="w-full sm:w-auto">
                <button className="cursor-pointer w-full sm:w-auto px-8 py-3.5 rounded-full text-sm font-bold bg-white text-gray-900 hover:bg-gray-100 transition-all hover:scale-105 active:scale-95 shadow-lg">
                  Report Found Item
                </button>
              </Link>
              <Link href="/items" className="w-full sm:w-auto">
                <button className="cursor-pointer w-full sm:w-auto px-8 py-3.5 rounded-full text-sm font-bold bg-transparent text-white border border-gray-700 hover:bg-white/10 transition-all hover:scale-105 active:scale-95">
                  Explore Active Items
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-200/80 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center flex flex-col items-center">
          <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">
            CampusFind
          </div>
          <p className="text-gray-500 text-sm mb-6">Designed with care for college campuses everywhere.</p>
          <div className="flex flex-wrap justify-center gap-6 text-sm font-medium text-gray-600">
            <Link href="/items" className="hover:text-gray-900 transition-colors">Browse Items</Link>
            <Link href="/items/lost/new" className="hover:text-gray-900 transition-colors">Report Lost</Link>
            <Link href="/items/found/new" className="hover:text-gray-900 transition-colors">Report Found</Link>
            <Link href="/dashboard" className="hover:text-gray-900 transition-colors">My Dashboard</Link>
          </div>
          <div className="mt-8 text-gray-400 text-xs">
            © {new Date().getFullYear()} CampusFind. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
