import { EventActions } from "../../../components/EventActions";
import Link from "next/link";
import { MapPin, Calendar, Clock, ArrowLeft, Sparkles } from "lucide-react";
import { getEvent } from "../../../lib/db";
import { extractId } from "../../../lib/slug";
import { ImageWithFallback } from "../../../components/ImageWithFallback";
import { notFound } from "next/navigation";
import { HP2Frame } from "../../../components/hp2/Frame";
import { Reveal } from "../../../components/hp2/Reveal";

export const dynamic = "force-dynamic";

export default async function EventDetailsPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const event = await getEvent(extractId(params.slug));

  if (!event) notFound();

  const eventDate = new Date(event.eventDate);
  const dateLong = eventDate.toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <HP2Frame activePath="/events">
      {/* Cover hero — clean editorial layout */}
      <header className="hp2-cover hp2-cover--detail">
        <div className="hp2-container">
          <Link href="/events" className="hp2-back-link">
            <ArrowLeft size={14} /> Back to Events
          </Link>

          <div className="hp2-cover__layout">
            {event.imageUrl && (
              <Reveal>
                <div className="hp2-cover__poster">
                  <ImageWithFallback
                    src={event.imageUrl}
                    alt={event.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </Reveal>
            )}
            <Reveal delay={80}>
              <div className="hp2-cover__inner">
                <p className="hp2-cover__kicker">{event.category || "Live experience"}</p>
                <h1 className="hp2-cover__title">{event.title}</h1>

                <div className="hp2-cover__meta">
                  <span className="hp2-meta-pill">
                    <Calendar size={14} /> {dateLong}
                  </span>
                  {event.startTime && (
                    <span className="hp2-meta-pill">
                      <Clock size={14} /> {event.startTime}{event.endTime ? " – " + event.endTime : ""}
                    </span>
                  )}
                  {event.location && (
                    <span className="hp2-meta-pill">
                      <MapPin size={14} /> {event.location}
                    </span>
                  )}
                </div>

                <div className="hp2-cover__cta">
                  <EventActions
                    eventId={event.id}
                    eventTitle={event.title}
                    ticketLink={event.ticketLink}
                    initialIsInterested={event.isInterested}
                    initialInterestCount={event.interestCount}
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </header>

      <section style={{ padding: "44px 0 96px" }}>
        <div className="hp2-container">
          <div className="hp2-detail-main">
            <Reveal>
              <div className="hp2-panel">
                <h2 className="hp2-panel__title">About the event</h2>
                <p className="hp2-panel__body" style={{ whiteSpace: "pre-wrap" }}>
                  {event.description || "Details coming soon."}
                </p>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <div className="hp2-panel">
                <h2 className="hp2-panel__title">
                  <Sparkles size={16} style={{ display: "inline", marginRight: 8, color: "#C4B5FD" }} />
                  What to expect
                </h2>
                <ul className="hp2-feature-list">
                  <li>Live performance from accomplished Sri Lankan artists.</li>
                  <li>Curated cultural programme with traditional and contemporary pieces.</li>
                  <li>Doors open 30 minutes before the scheduled start time.</li>
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Page-local detail styles (additive — work alongside DesignStyles) */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .hp2-cover--detail { padding: 0; min-height: 0; position: relative; isolation: isolate; overflow: hidden; }
            .hp2-cover--detail .hp2-container { position: relative; padding-top: 80px; padding-bottom: 80px; z-index: 2; }
            @media (max-width: 720px) {
              .hp2-cover--detail .hp2-container { padding-top: 56px; padding-bottom: 56px; }
            }

            /* Subtle ambient violet glow — just enough atmosphere, no busy blur */
            .hp2-cover--detail::before {
              content: ''; position: absolute; z-index: 0; pointer-events: none; border-radius: 50%;
              top: -30vh; left: -10vw; width: 70vw; height: 70vh;
              background: radial-gradient(circle, hsla(258, 75%, 30%, 0.42) 0%, hsla(258, 60%, 20%, 0.20) 35%, transparent 70%);
              filter: blur(90px);
              animation: detail-drift-a 28s ease-in-out infinite alternate;
              will-change: transform;
            }
            .hp2-cover--detail::after {
              content: ''; position: absolute; z-index: 0; pointer-events: none; border-radius: 50%;
              bottom: -35vh; right: -15vw; width: 60vw; height: 60vh;
              background: radial-gradient(circle, hsla(290, 55%, 26%, 0.32) 0%, hsla(290, 50%, 18%, 0.14) 40%, transparent 70%);
              filter: blur(90px);
              animation: detail-drift-b 36s ease-in-out infinite alternate;
              will-change: transform;
            }
            @keyframes detail-drift-a {
              0%   { transform: translate3d(0,0,0)      scale(1);    }
              50%  { transform: translate3d(8%,6%,0)    scale(1.10); }
              100% { transform: translate3d(-4%,10%,0)  scale(1.04); }
            }
            @keyframes detail-drift-b {
              0%   { transform: translate3d(0,0,0)      scale(1);    }
              50%  { transform: translate3d(-10%,-8%,0) scale(1.14); }
              100% { transform: translate3d(6%,-4%,0)   scale(1.06); }
            }
            @media (prefers-reduced-motion: reduce) {
              .hp2-cover--detail::before, .hp2-cover--detail::after { animation: none; }
            }

            /* Editorial 2-col: poster left, content right — baseline-aligned */
            .hp2-cover__layout {
              display: grid;
              grid-template-columns: minmax(0, auto) minmax(0, 1fr);
              gap: clamp(32px, 5vw, 72px);
              align-items: center;
              margin-top: 28px;
            }
            @media (max-width: 860px) {
              .hp2-cover__layout { grid-template-columns: 1fr; gap: 32px; }
            }
            .hp2-cover__inner { min-width: 0; max-width: 640px; }
            .hp2-cover__poster {
              position: relative;
              width: clamp(300px, 38vw, 480px);
              aspect-ratio: 1 / 1;
              border-radius: 24px;
              overflow: hidden;
              box-shadow:
                0 40px 100px rgba(0,0,0,0.55),
                0 0 0 1px rgba(196,181,253,0.10) inset,
                0 0 80px rgba(167,139,250,0.18);
              transition: transform .5s cubic-bezier(0.22, 1, 0.36, 1);
            }
            .hp2-cover__poster:hover { transform: translateY(-4px) scale(1.015); }
            @media (max-width: 860px) {
              .hp2-cover__poster { width: 100%; max-width: 420px; margin: 0 auto; }
            }

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

            /* Tighter editorial rhythm for the title block */
            .hp2-cover--detail .hp2-cover__kicker {
              display: inline-flex; align-items: center;
              font-size: 11px; letter-spacing: 0.24em; text-transform: uppercase;
              color: #C4B5FD; margin: 0 0 18px; font-weight: 600;
              padding: 6px 12px; border-radius: 999px;
              background: rgba(167,139,250,0.10);
              border: 1px solid rgba(167,139,250,0.22);
              backdrop-filter: blur(8px);
            }
            .hp2-cover--detail .hp2-cover__title {
              font-family: var(--font-outfit);
              font-size: clamp(36px, 5vw, 60px);
              line-height: 1.04; letter-spacing: -0.035em; font-weight: 600;
              color: #F5F3FA; margin: 0 0 22px; max-width: 16ch;
            }

            .hp2-cover__tags { display: flex; flex-wrap: wrap; gap: 8px; margin: 0 0 24px; }
            .hp2-tag {
              display: inline-flex; align-items: center; gap: 5px;
              font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; font-weight: 600;
              padding: 6px 12px; border-radius: 6px;
              background: rgba(21,18,29,0.65); color: #F5F3FA;
              border: 1px solid rgba(196,181,253,0.14);
              backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
            }
            .hp2-tag--accent { background: #A78BFA; color: #0a0a0b; border-color: #A78BFA; }

            .hp2-cover__meta { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 4px; }
            .hp2-meta-pill {
              display: inline-flex; align-items: center; gap: 8px;
              font-size: 13px; color: #F5F3FA; font-weight: 500;
              padding: 9px 14px; border-radius: 999px;
              background: rgba(21,18,29,0.55); border: 1px solid rgba(196,181,253,0.10);
              backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
            }
            .hp2-meta-pill svg { color: #C4B5FD; }

            /* Inline CTA cluster directly under date/venue */
            .hp2-cover__cta { margin-top: 28px; max-width: 420px; }

            .hp2-detail-main { display: flex; flex-direction: column; gap: 24px; min-width: 0; max-width: 820px; }

            .hp2-panel {
              padding: 28px;
              border-radius: 20px;
              background: #15121D;
              border: 1px solid rgba(196,181,253,0.10);
            }
            .hp2-panel--sticky { position: sticky; top: 100px; }
            .hp2-panel__title {
              font-family: var(--font-outfit);
              font-size: 22px; font-weight: 500; letter-spacing: -0.015em;
              color: #F5F3FA; margin: 0 0 14px;
            }
            .hp2-panel__body {
              color: #C4B0DA; font-size: 15px; line-height: 1.7;
              margin: 0;
            }

            .hp2-feature-list { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 10px; }
            .hp2-feature-list li {
              padding: 12px 14px 12px 38px; position: relative;
              color: #C4B0DA; font-size: 14px; line-height: 1.55;
              background: #1E1A2B; border: 1px solid rgba(196,181,253,0.08);
              border-radius: 12px;
            }
            .hp2-feature-list li::before {
              content: ""; position: absolute; left: 14px; top: 18px;
              width: 8px; height: 8px; border-radius: 50%;
              background: linear-gradient(135deg, #A78BFA, #C4B5FD);
              box-shadow: 0 0 12px rgba(167,139,250,0.5);
            }

            .hp2-keyvals { display: flex; flex-direction: column; gap: 0; margin: 0; }
            .hp2-keyvals > div {
              display: flex; justify-content: space-between; gap: 12px;
              padding: 12px 0; border-bottom: 1px solid rgba(196,181,253,0.08);
            }
            .hp2-keyvals > div:last-child { border-bottom: none; }
            .hp2-keyvals dt {
              font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase;
              color: #9B95B5; font-weight: 500;
            }
            .hp2-keyvals dd {
              margin: 0; font-size: 14px; color: #F5F3FA; font-weight: 500;
              text-align: right; max-width: 60%;
            }
          `,
        }}
      />
    </HP2Frame>
  );
}
