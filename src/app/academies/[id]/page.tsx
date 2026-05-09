import { AcademyActions } from "../../../components/AcademyActions";
import { ImageWithFallback } from "../../../components/ImageWithFallback";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Phone, Mail, Globe, ArrowLeft, Star, GraduationCap } from "lucide-react";
import { getAcademy } from "../../../lib/db";
import { extractId } from "../../../lib/slug";
import { HP2Frame } from "../../../components/hp2/Frame";
import { Reveal } from "../../../components/hp2/Reveal";

export const dynamic = "force-dynamic";

export async function generateMetadata(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const academy = await getAcademy(extractId(params.id));
  if (!academy) return { title: "Academy Not Found" };
  return {
    title: `${academy.name} | Rasas Academies`,
    description: academy.description,
  };
}

export default async function AcademyDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const academy = await getAcademy(extractId(params.id));
  if (!academy) return notFound();

  return (
    <HP2Frame activePath="/academies">
      {/* Cover hero with academy image */}
      <header className="hp2-cover hp2-cover--detail">
        <div className="hp2-cover__media hp2-cover__media--green" aria-hidden />
        <div className="hp2-cover__bgimg" aria-hidden>
          <ImageWithFallback
            src={academy.imageUrl || "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=1600"}
            alt=""
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="hp2-container">
          <Reveal>
            <Link href="/academies" className="hp2-back-link">
              <ArrowLeft size={14} /> Back to Academies
            </Link>

            <div className="hp2-cover__inner">
              <div className="hp2-cover__tags">
                <span className="hp2-tag hp2-tag--accent">{academy.type || "Academy"}</span>
                {academy.location && (
                  <span className="hp2-tag">
                    <MapPin size={11} /> {academy.location.split(",")[0]}
                  </span>
                )}
              </div>
              <p className="hp2-cover__kicker">Where tradition is taught</p>
              <h1 className="hp2-cover__title">{academy.name}</h1>

              <div className="hp2-cover__meta">
                {academy.location && (
                  <span className="hp2-meta-pill">
                    <MapPin size={14} /> {academy.location}
                  </span>
                )}
                {academy.rating != null && (
                  <span className="hp2-meta-pill">
                    <Star size={14} style={{ color: "#FFD86B", fill: "#FFD86B" }} /> {academy.rating}
                    {academy.reviewCount != null && <span style={{ color: "#9B95B5", marginLeft: 4 }}>({academy.reviewCount} reviews)</span>}
                  </span>
                )}
                {academy.courses && academy.courses.length > 0 && (
                  <span className="hp2-meta-pill">
                    <GraduationCap size={14} /> {academy.courses.length} {academy.courses.length === 1 ? "Course" : "Courses"}
                  </span>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </header>

      <section style={{ padding: "44px 0 96px" }}>
        <div className="hp2-container">
          <div className="hp2-detail-grid">
            <div className="hp2-detail-main">
              {academy.description && (
                <Reveal>
                  <div className="hp2-panel">
                    <h2 className="hp2-panel__title">About the academy</h2>
                    <p className="hp2-panel__body">{academy.description}</p>
                  </div>
                </Reveal>
              )}

              {academy.courses && academy.courses.length > 0 && (
                <Reveal delay={80}>
                  <div className="hp2-panel">
                    <h2 className="hp2-panel__title">Courses offered</h2>
                    <div className="hp2-course-grid">
                      {academy.courses.map((course: any, idx: number) => (
                        <div key={idx} className="hp2-course">
                          <div className="hp2-course__badge">
                            {(course.name || "C").charAt(0)}
                          </div>
                          <span className="hp2-course__name">{course.name || "Unnamed course"}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Reveal>
              )}
            </div>

            <aside className="hp2-detail-aside">
              <Reveal delay={120}>
                <div className="hp2-panel hp2-panel--sticky">
                  <p className="hp2-section__kicker" style={{ margin: "0 0 16px" }}>Contact Information</p>

                  <div className="hp2-contact-list">
                    {academy.phone && (
                      <a href={`tel:${academy.phone}`} className="hp2-contact">
                        <span className="hp2-contact__icon"><Phone size={16} /></span>
                        <span>
                          <span className="hp2-contact__label">Phone</span>
                          <span className="hp2-contact__value">{academy.phone}</span>
                        </span>
                      </a>
                    )}
                    {academy.website && (
                      <a href={academy.website.startsWith("http") ? academy.website : `https://${academy.website}`} target="_blank" rel="noopener noreferrer" className="hp2-contact">
                        <span className="hp2-contact__icon"><Globe size={16} /></span>
                        <span>
                          <span className="hp2-contact__label">Website</span>
                          <span className="hp2-contact__value">{academy.website}</span>
                        </span>
                      </a>
                    )}
                    {academy.email && (
                      <a href={`mailto:${academy.email}`} className="hp2-contact">
                        <span className="hp2-contact__icon"><Mail size={16} /></span>
                        <span>
                          <span className="hp2-contact__label">Email</span>
                          <span className="hp2-contact__value">{academy.email}</span>
                        </span>
                      </a>
                    )}
                  </div>

                  <div style={{ marginTop: 22 }}>
                    <AcademyActions />
                  </div>
                </div>
              </Reveal>
            </aside>
          </div>
        </div>
      </section>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .hp2-cover--detail { padding: 0; min-height: 0; }
            .hp2-cover--detail .hp2-container { position: relative; padding-top: 96px; padding-bottom: 56px; z-index: 2; }
            .hp2-cover__bgimg { position: absolute; inset: 0; overflow: hidden; }
            .hp2-cover__bgimg::after {
              content: ""; position: absolute; inset: 0;
              background:
                linear-gradient(180deg, rgba(7,6,10,0.50) 0%, rgba(7,6,10,0.86) 70%, #07060A 100%),
                radial-gradient(ellipse at 30% 20%, rgba(132,225,196,0.16), transparent 60%);
            }
            .hp2-cover__bgimg img { filter: saturate(1.05); }

            .hp2-back-link {
              display: inline-flex; align-items: center; gap: 8px;
              color: #9B95B5; font-size: 13px; text-decoration: none;
              padding: 8px 14px; border: 1px solid rgba(196,181,253,0.16);
              border-radius: 999px; background: rgba(21,18,29,0.55);
              backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
              transition: color .2s ease, border-color .2s ease;
              margin-bottom: 28px;
            }
            .hp2-back-link:hover { color: #F5F3FA; border-color: rgba(196,181,253,0.30); }

            .hp2-cover__tags { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }
            .hp2-tag {
              display: inline-flex; align-items: center; gap: 5px;
              font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; font-weight: 600;
              padding: 6px 12px; border-radius: 6px;
              background: rgba(21,18,29,0.65); color: #F5F3FA;
              border: 1px solid rgba(196,181,253,0.14);
              backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
            }
            .hp2-tag--accent { background: #A78BFA; color: #0a0a0b; border-color: #A78BFA; }

            .hp2-cover__meta { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 24px; }
            .hp2-meta-pill {
              display: inline-flex; align-items: center; gap: 8px;
              font-size: 13px; color: #F5F3FA; font-weight: 500;
              padding: 9px 14px; border-radius: 999px;
              background: rgba(21,18,29,0.55); border: 1px solid rgba(196,181,253,0.10);
              backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
            }
            .hp2-meta-pill svg { color: #C4B5FD; }

            .hp2-detail-grid { display: grid; grid-template-columns: 1fr; gap: 32px; }
            @media (min-width: 1000px) {
              .hp2-detail-grid { grid-template-columns: minmax(0,1fr) 360px; gap: 36px; }
            }
            .hp2-detail-main { display: flex; flex-direction: column; gap: 24px; min-width: 0; }
            .hp2-detail-aside { min-width: 0; }

            .hp2-panel {
              padding: 28px;
              border-radius: 20px;
              background: #15121D;
              border: 1px solid rgba(196,181,253,0.10);
            }
            .hp2-panel--sticky { position: sticky; top: 100px; }
            .hp2-panel--accent {
              background: linear-gradient(180deg, rgba(167,139,250,0.10) 0%, rgba(167,139,250,0.04) 100%);
              border-color: rgba(167,139,250,0.22);
            }
            .hp2-panel__title {
              font-family: var(--font-outfit);
              font-size: 22px; font-weight: 500; letter-spacing: -0.015em;
              color: #F5F3FA; margin: 0 0 14px;
            }
            .hp2-panel__body { color: #C4B0DA; font-size: 15px; line-height: 1.7; margin: 0; }

            .hp2-course-grid {
              display: grid; gap: 12px;
              grid-template-columns: 1fr;
            }
            @media (min-width: 600px) {
              .hp2-course-grid { grid-template-columns: 1fr 1fr; }
            }
            .hp2-course {
              display: flex; align-items: center; gap: 14px;
              padding: 14px 16px; border-radius: 14px;
              background: #1E1A2B; border: 1px solid rgba(196,181,253,0.08);
              transition: border-color .2s ease, background .2s ease;
            }
            .hp2-course:hover { border-color: rgba(167,139,250,0.30); background: #221d31; }
            .hp2-course__badge {
              width: 38px; height: 38px; border-radius: 10px;
              display: flex; align-items: center; justify-content: center;
              background: linear-gradient(135deg, #A78BFA 0%, #C4B5FD 100%);
              color: #0a0a0b; font-family: var(--font-outfit); font-size: 16px; font-weight: 600;
              flex-shrink: 0;
            }
            .hp2-course__name { font-size: 14px; font-weight: 500; color: #F5F3FA; }

            .hp2-feature-list { margin: 0; padding: 0; list-style: none; display: grid; gap: 10px; grid-template-columns: 1fr; }
            @media (min-width: 600px) { .hp2-feature-list { grid-template-columns: 1fr 1fr; } }
            .hp2-feature-list li {
              padding: 12px 14px 12px 38px; position: relative;
              color: #C4B0DA; font-size: 14px; line-height: 1.55;
              background: #1E1A2B; border: 1px solid rgba(196,181,253,0.08);
              border-radius: 12px;
            }
            .hp2-feature-list li::before {
              content: "✓"; position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
              width: 20px; height: 20px; border-radius: 50%;
              background: linear-gradient(135deg, #34d399, #10b981);
              color: #06281c; font-size: 11px; font-weight: 700;
              display: flex; align-items: center; justify-content: center;
            }

            .hp2-contact-list { display: flex; flex-direction: column; gap: 4px; }
            .hp2-contact {
              display: flex; align-items: center; gap: 14px;
              padding: 12px 14px; border-radius: 12px;
              text-decoration: none; transition: background .2s ease;
            }
            .hp2-contact:hover { background: #1E1A2B; }
            .hp2-contact__icon {
              width: 38px; height: 38px; border-radius: 50%;
              display: flex; align-items: center; justify-content: center;
              background: #1E1A2B; color: #C4B5FD;
              border: 1px solid rgba(196,181,253,0.12);
              flex-shrink: 0;
            }
            .hp2-contact__label {
              display: block; font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase;
              color: #9B95B5; font-weight: 600; margin-bottom: 2px;
            }
            .hp2-contact__value { display: block; font-size: 14px; color: #F5F3FA; font-weight: 500; word-break: break-word; }
          `,
        }}
      />
    </HP2Frame>
  );
}
