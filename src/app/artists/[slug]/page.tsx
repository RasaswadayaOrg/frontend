import { ArtistActions } from "../../../components/ArtistActions";
import { ArtistFollowerCount } from "../../../components/ArtistFollowerCount";
import { ArtistPerformancesList } from "../../../components/ArtistPerformancesList";
import { ArtistFeed } from "../../../components/ArtistFeed";
import Link from "next/link";
import { MapPin, Music, ArrowLeft } from "lucide-react";
import { getArtistBySlug } from "../../../lib/db";
import { ImageWithFallback } from "../../../components/ImageWithFallback";
import { notFound } from "next/navigation";
import { HP2Frame } from "../../../components/hp2/Frame";
import { Reveal } from "../../../components/hp2/Reveal";

export default async function ArtistProfilePage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const artist = await getArtistBySlug(params.slug);

  if (!artist) {
    notFound();
  }

  return (
    <HP2Frame activePath="/artists">

      <section style={{ padding: "80px 0 80px" }}>
        <div className="hp2-container">

          {/* Back link */}
          <Reveal>
            <div style={{ padding: "28px 0 32px" }}>
              <Link href="/artists" className="hp2-link" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <ArrowLeft size={14} />
                Back to Artists
              </Link>
            </div>
          </Reveal>

          {/* Profile card */}
          <Reveal delay={60} zIndex={10}>
            <div style={{
              background: "#15121D",
              border: "1px solid rgba(196,181,253,0.10)",
              borderRadius: 24,
              padding: "32px 32px 36px",
              marginBottom: 48,
            }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>

                {/* Top: avatar + name/meta + actions */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 32, alignItems: "flex-start" }}>
                  {/* Avatar */}
                  <div style={{
                    position: "relative",
                    width: 200,
                    height: 200,
                    borderRadius: 20,
                    overflow: "hidden",
                    flexShrink: 0,
                    background: "#1E1A2B",
                    boxShadow: "0 0 0 1px rgba(196,181,253,0.12) inset",
                  }}>
                    <ImageWithFallback
                      src={artist.photoUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300"}
                      alt={artist.name}
                      fill
                      className="object-cover"
                      unoptimized={artist.photoUrl?.includes("wikimedia.org")}
                    />
                  </div>

                  {/* Name + meta */}
                  <div style={{ flex: 1, minWidth: 200, paddingTop: 6 }}>
                    <h2 style={{
                      fontFamily: "var(--font-outfit)",
                      fontSize: "clamp(26px, 3.5vw, 42px)",
                      fontWeight: 600,
                      letterSpacing: "-0.035em",
                      color: "#F5F3FA",
                      margin: "0 0 12px",
                    }}>{artist.name}</h2>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
                      {(artist.profession || artist.genre) && (
                        <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, color: "#9B95B5" }}>
                          <Music size={14} />
                          {artist.profession || artist.genre}
                        </span>
                      )}
                      {artist.location && (
                        <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, color: "#9B95B5" }}>
                          <MapPin size={14} />
                          {artist.location}
                        </span>
                      )}
                    </div>

                    {/* Stats row */}
                    <div style={{ display: "flex", gap: 28, marginTop: 18 }}>
                      <div>
                        <span style={{ display: "block", fontFamily: "var(--font-outfit)", fontSize: 20, fontWeight: 600, color: "#F5F3FA" }}>
                          <ArtistFollowerCount artistId={artist.id} initialCount={artist.followerCount ?? 0} />
                        </span>
                        <span style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#9B95B5" }}>Followers</span>
                      </div>
                      <div>
                        <span style={{ display: "block", fontFamily: "var(--font-outfit)", fontSize: 20, fontWeight: 600, color: "#F5F3FA" }}>{artist.performances?.length || 0}</span>
                        <span style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#9B95B5" }}>Events</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ flexShrink: 0 }}>
                    <ArtistActions
                      artistId={artist.id}
                      artistName={artist.name}
                      artistProfession={artist.profession || artist.genre}
                      initialIsFollowing={artist.isFollowing}
                      initialFollowerCount={artist.followerCount ?? 0}
                    />
                  </div>
                </div>

                {/* Bio */}
                {artist.bio && (
                  <p style={{
                    fontSize: 15,
                    lineHeight: 1.7,
                    color: "#9B95B5",
                    maxWidth: 720,
                    margin: 0,
                    paddingTop: 20,
                    borderTop: "1px solid rgba(196,181,253,0.10)",
                  }}>
                    {artist.bio}
                  </p>
                )}
              </div>
            </div>
          </Reveal>

          {/* Performances */}
          <Reveal delay={100}>
            <div style={{ marginBottom: 48 }}>
              <p className="hp2-section__kicker" style={{ marginBottom: 16 }}>Performances</p>
              <h3 style={{
                fontFamily: "var(--font-outfit)",
                fontSize: "clamp(20px, 2.5vw, 28px)",
                fontWeight: 500,
                letterSpacing: "-0.025em",
                color: "#F5F3FA",
                margin: "0 0 24px",
              }}>Upcoming Events</h3>
              <ArtistPerformancesList events={artist.performances?.map((p: any) => p.event) || []} />
            </div>
          </Reveal>

          {/* Feed */}
          <Reveal delay={120}>
            <ArtistFeed
              artistId={artist.id}
              artistName={artist.name}
              artistAvatar={artist.photoUrl}
            />
          </Reveal>

        </div>
      </section>

    </HP2Frame>
  );
}
