import Link from "next/link";
import { ArrowRight, Search, ShieldCheck, MessageSquare, MapPin } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Aceternity-style Hero Section with Grid Background */}
      <section className="relative pt-32 pb-40 flex flex-col items-center justify-center text-center px-4 overflow-hidden min-h-[90vh]">
        {/* Grid Background */}
        <div className="absolute inset-0 z-0 bg-white dark:bg-white bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        {/* Radial fade for the grid */}
        <div className="absolute inset-0 z-0 bg-white [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,transparent_10%,black_100%)]"></div>

        {/* Floating blurred blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl -z-10 mix-blend-multiply animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl -z-10 mix-blend-multiply animate-blob animation-delay-2000"></div>

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="inline-flex items-center justify-center px-4 py-1.5 mb-8 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-100 rounded-full shadow-sm">
            <span className="flex w-2 h-2 rounded-full bg-blue-600 mr-2 animate-pulse"></span>
            The #1 College Lost & Found Platform
          </div>
          
          <h1 className="text-6xl md:text-8xl font-extrabold text-gray-900 tracking-tight mb-8 leading-[1.1]">
            Lost something? <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Find it. Verify it. Get it back.
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            The safe, secure, and private way to connect finders with the rightful owners of lost items across your college campus.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/items/lost/new" className="px-8 py-4 bg-gray-900 text-white rounded-full font-semibold flex items-center hover:bg-gray-800 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-gray-900/20 w-full sm:w-auto justify-center">
              Report Lost Item <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link href="/items" className="px-8 py-4 bg-white text-gray-900 border-2 border-gray-200 rounded-full font-semibold flex items-center hover:border-gray-300 hover:bg-gray-50 transition-all hover:scale-105 active:scale-95 w-full sm:w-auto justify-center">
              Find an Item <Search className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* How it works - Aceternity Card Style */}
      <section className="py-32 bg-gray-50 border-y relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">A seamless process to get your items back safely.</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Report", desc: "Post what you lost or found with basic details." },
              { step: "02", title: "Match", desc: "Our system suggests potential matches for items." },
              { step: "03", title: "Verify", desc: "Chat securely and provide ownership proof." },
              { step: "04", title: "Return", desc: "Meet and safely verify handover using a one-time OTP." }
            ].map((item, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 text-center hover:-translate-y-2 transition-transform duration-300 relative group">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl -z-10"></div>
                <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 text-xl font-bold shadow-lg shadow-blue-200 rotate-3 group-hover:rotate-6 transition-transform">
                  {item.step}
                </div>
                <h3 className="font-bold text-xl mb-3 text-gray-900">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features with modern bento grid style */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Platform Features</h2>
            <p className="text-xl text-gray-600">Everything you need to return items securely.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Secure Verification</h3>
              <p className="text-gray-600 leading-relaxed">Keep identifying details private until you are sure. Use our unique OTP system for physical handover to ensure the item goes to the right person.</p>
            </div>
            
            <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Private Chat</h3>
              <p className="text-gray-600 leading-relaxed">Communicate directly with the finder or owner without exposing your personal phone number or email address.</p>
            </div>
            
            <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-6">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Campus Specific</h3>
              <p className="text-gray-600 leading-relaxed">Designed purely for college campuses. Filter by specific buildings, libraries, or dorms to find items exactly where they were lost.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to action */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600 -z-20"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff20_1px,transparent_1px),linear-gradient(to_bottom,#ffffff20_1px,transparent_1px)] bg-[size:24px_24px] -z-10"></div>
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">Help return someone's lost item today.</h2>
          <p className="text-xl text-blue-100 mb-10">Join thousands of students making their campus a better place.</p>
          <div className="flex justify-center gap-4">
            <Link href="/sign-up" className="px-8 py-4 bg-white text-blue-600 rounded-full font-bold hover:bg-gray-50 transition-all hover:scale-105">
              Create an Account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 text-center flex flex-col items-center">
          <div className="text-2xl font-bold text-blue-600 mb-4">CampusFind</div>
          <p className="text-gray-500 mb-6">Built for campus communities.</p>
          <div className="flex justify-center space-x-6">
            <Link href="/items" className="text-gray-600 hover:text-gray-900 font-medium">Browse Items</Link>
            <Link href="/items/found/new" className="text-gray-600 hover:text-gray-900 font-medium">Report Found</Link>
            <Link href="/sign-up" className="text-gray-600 hover:text-gray-900 font-medium">Join Platform</Link>
          </div>
          <div className="mt-8 text-gray-400 text-sm">
            © {new Date().getFullYear()} CampusFind. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
