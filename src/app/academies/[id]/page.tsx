import { AcademyActions } from "../../../components/AcademyActions";
import { ImageWithFallback } from "../../../components/ImageWithFallback";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Phone, Mail, Globe, ArrowLeft, CheckCircle2, Star, Calendar } from "lucide-react";
import { getAcademy } from "../../../lib/db";

export async function generateMetadata(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const academy = await getAcademy(params.id);
  if (!academy) return { title: "Academy Not Found" };
  
  return {
    title: `${academy.name} | Rasas Academies`,
    description: academy.description,
  };
}

export default async function AcademyDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const academy = await getAcademy(params.id);
  
  if (!academy) {
    return notFound();
  }

  // Mock some extra data since our DB mock is simple
  const features = ["Certified Instructors", "Performance Opportunities", "Traditional Curriculum", "Air Conditioned Studios"];
  const detailedDescription = academy.description + " This academy has been a cornerstone of Sri Lankan arts education, fostering generations of talent through rigorous training and cultural immersion. Students benefit from direct mentorship and opportunities to perform at national festivals.";

  return (
    <div className="min-h-screen pb-12">
      {/* Breadcrumb / Back */}
      <div className="container mx-auto px-4 py-6">
        <Link 
          href="/academies" 
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-brand-600 dark:text-zinc-400 dark:hover:text-brand-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Academies
        </Link>
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-4 mb-12">
        <div className="relative rounded-3xl overflow-hidden aspect-[21/9] shadow-2xl">
           <ImageWithFallback
            src={academy.imageUrl || "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=2000"}
            alt={academy.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 p-8 md:p-12 text-white">
            <span className="bg-brand-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block">
                {academy.type}
            </span>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 max-w-4xl">{academy.name}</h1>
            <div className="flex flex-wrap items-center gap-6 text-sm md:text-base text-slate-200">
                <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-brand-400" />
                    <span>{academy.location}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <span>4.9 (120 Reviews)</span>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Grid */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Col: Info */}
            <div className="lg:col-span-8 space-y-10">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">About the Academy</h2>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                        {detailedDescription}
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Courses Offered</h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                        {academy.courses && academy.courses.map((course: string, idx: number) => (
                            <div key={idx} className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:border-brand-500/50 transition-colors">
                                <div className="w-10 h-10 rounded-full bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center text-brand-600 dark:text-brand-400 font-bold text-lg">
                                    {course.charAt(0)}
                                </div>
                                <span className="font-semibold text-slate-900 dark:text-white">{course}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Academy Features</h2>
                    <ul className="grid sm:grid-cols-2 gap-3">
                        {features.map((feature, i) => (
                            <li key={i} className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                                <span>{feature}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Right Col: Contact & Action */}
            <div className="lg:col-span-4">
                <div className="sticky top-24 space-y-6">
                    {/* Contact Card */}
                    <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-black/50">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Contact Information</h3>
                        
                        <div className="space-y-4 mb-8">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                                    <Phone className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase text-slate-400 mb-1">Phone</p>
                                    <a href={`tel:${academy.phone}`} className="font-medium hover:text-brand-600 transition-colors">{academy.phone || "Not Available"}</a>
                                </div>
                            </div>
                            
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                                    <Globe className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase text-slate-400 mb-1">Website</p>
                                    <a href={`https://${academy.website}`} target="_blank" rel="noopener noreferrer" className="font-medium hover:text-brand-600 transition-colors">{academy.website || "Not Available"}</a>
                                </div>
                            </div>

                             <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                                    <Mail className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase text-slate-400 mb-1">Email</p>
                                    <a href={`mailto:${academy.email}`} className="font-medium hover:text-brand-600 transition-colors">{academy.email || "Not Available"}</a>
                                </div>
                            </div>
                        </div>

                        <AcademyActions />
                    </div>

                    {/* Upcoming Batches (Mock) */}
                     <div className="p-6 rounded-2xl bg-brand-50 dark:bg-brand-900/10 border border-brand-100 dark:border-brand-900/20">
                        <div className="flex items-center gap-3 mb-3">
                            <Calendar className="w-5 h-5 text-brand-600" />
                            <h4 className="font-bold text-brand-900 dark:text-brand-100">Next Intake</h4>
                        </div>
                        <p className="text-sm text-brand-800 dark:text-brand-200">
                            Applications closing on <span className="font-bold">Jan 31st</span> for the upcoming semester.
                        </p>
                     </div>

                </div>
            </div>

        </div>
      </section>
    </div>
  );
}
