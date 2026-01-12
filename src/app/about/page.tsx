import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowLeft, Heart, Globe, Users, Sparkles } from "lucide-react";

export const metadata = {
  title: "About Us | Rasaswadaya",
  description: "Learn about our mission to preserve and promote Sri Lankan arts and culture.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Back Link */}
      <div className="pt-4">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-brand-600 dark:text-zinc-400 dark:hover:text-brand-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>

      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] w-full flex items-center justify-center overflow-hidden rounded-3xl mt-4">
        <Image
          src="https://images.unsplash.com/photo-1590076842067-17eb04ec607a?q=80&w=2000&auto=format&fit=crop"
          alt="Sri Lankan Culture"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        <div className="relative z-10 text-center max-w-4xl px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-serif tracking-wide">
            Preserving Heritage, <br />
            Empowering Artists
          </h1>
          <p className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto leading-relaxed">
            Rasaswadaya is Sri Lanka's premier digital platform dedicated to celebrating our rich cultural legacy and connecting local talent with the global stage.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="grid md:grid-cols-2 gap-12 items-center px-4">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            Our Mission
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
            Bridging Tradition with the Digital Future
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed">
            We believe that art is the soul of a nation. In an increasingly digital world, traditional arts risk being left behind. Rasaswadaya serves as a bridge, bringing centuries-old traditions into the modern era without losing their essence.
          </p>
          <div className="grid grid-cols-2 gap-6 pt-4">
            <div className="bg-slate-50 dark:bg-zinc-800/50 p-4 rounded-xl">
              <Globe className="w-8 h-8 text-brand-600 mb-3" />
              <h3 className="font-semibold text-slate-900 dark:text-white">Global Reach</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Connecting local artisans to international audiences.</p>
            </div>
            <div className="bg-slate-50 dark:bg-zinc-800/50 p-4 rounded-xl">
              <Users className="w-8 h-8 text-brand-600 mb-3" />
              <h3 className="font-semibold text-slate-900 dark:text-white">Community</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Fostering a supportive ecosystem for creators.</p>
            </div>
          </div>
        </div>
        <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-xl">
          <Image
            src="https://images.unsplash.com/photo-1544967082-d9d25d867d66?q=80&w=1000&auto=format&fit=crop"
            alt="Traditional Dancer"
            fill
            className="object-cover hover:scale-105 transition-transform duration-700"
          />
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-brand-600 dark:bg-brand-900 rounded-3xl p-12 text-center text-white">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-2">
            <h3 className="text-4xl font-bold">500+</h3>
            <p className="text-brand-100">Artists Registered</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-4xl font-bold">1.2k</h3>
            <p className="text-brand-100">Events Hosted</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-4xl font-bold">50k+</h3>
            <p className="text-brand-100">Monthly Visitors</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-4xl font-bold">200+</h3>
            <p className="text-brand-100">Artisan Stores</p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="px-4">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-12">Our Core Values</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Authenticity",
              description: "We verify every artist and product to ensure genuine Sri Lankan craftsmanship.",
              icon: <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4"><Sparkles className="w-6 h-6" /></div>
            },
            {
              title: "Inclusivity",
              description: "Providing equal opportunities for artists from all corners of the island.",
              icon: <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-4"><Heart className="w-6 h-6" /></div>
            },
            {
              title: "Innovation",
              description: "Leveraging technology to create new revenue streams for traditional artists.",
              icon: <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-4"><Globe className="w-6 h-6" /></div>
            }
          ].map((value, index) => (
            <div key={index} className="bg-white dark:bg-zinc-900/50 p-8 rounded-2xl border border-slate-100 dark:border-zinc-800 hover:shadow-lg transition-shadow">
              {value.icon}
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{value.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-900 dark:bg-black rounded-3xl p-12 md:p-20 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Join the Movement</h2>
          <p className="text-slate-300 text-lg">
            Whether you are an artist looking to share your work or an enthusiast seeking authentic experiences, there is a place for you here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              href="/signup"
              className="px-8 py-3 bg-brand-600 text-white font-semibold rounded-full hover:bg-brand-500 transition-colors flex items-center justify-center gap-2"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/marketplace"
              className="px-8 py-3 bg-white/10 text-white font-semibold rounded-full hover:bg-white/20 transition-colors backdrop-blur-sm"
            >
              Browse Marketplace
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
