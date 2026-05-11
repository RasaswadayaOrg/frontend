import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Rasaswadaya — Sri Lanka's home for arts, events & culture";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const SITE = "https://rasaswadaya.vercel.app";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#07060A",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* ── Ambient gradient orbs ── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(ellipse 65% 55% at 4% 4%, rgba(203,99,249,0.62) 0%, transparent 58%)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(ellipse 55% 48% at 97% 4%, rgba(240,166,248,0.48) 0%, transparent 55%)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(ellipse 55% 60% at 4% 97%, rgba(124,58,237,0.52) 0%, transparent 56%)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(ellipse 48% 45% at 96% 96%, rgba(99,102,241,0.38) 0%, transparent 50%)",
            display: "flex",
          }}
        />

        {/* ── Centre luminance halo ── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(ellipse 72% 55% at 50% 44%, rgba(196,181,253,0.16) 0%, transparent 65%)",
            display: "flex",
          }}
        />

        {/* ── Shiny highlight streak (top-left to centre) ── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(125deg, rgba(255,255,255,0.055) 0%, transparent 38%, rgba(167,139,250,0.06) 72%, transparent 100%)",
            display: "flex",
          }}
        />

        {/* ── Thin glowing border frame ── */}
        <div
          style={{
            position: "absolute",
            inset: 18,
            borderRadius: 24,
            border: "1px solid rgba(196,181,253,0.14)",
            boxShadow:
              "inset 0 0 60px rgba(167,139,250,0.08), 0 0 40px rgba(167,139,250,0.06)",
            display: "flex",
          }}
        />

        {/* ── Main content ── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 28,
            position: "relative",
            zIndex: 2,
            width: "100%",
            padding: "0 80px",
          }}
        >
          {/* Logo */}
          <img
            src={`${SITE}/logo.svg`}
            alt="Rasaswadaya"
            width={660}
            height={371}
            style={{ objectFit: "contain" }}
          />

          {/* Divider */}
          <div
            style={{
              width: 320,
              height: 1,
              backgroundImage:
                "linear-gradient(90deg, transparent 0%, rgba(196,181,253,0.55) 30%, rgba(240,166,248,0.55) 70%, transparent 100%)",
              display: "flex",
            }}
          />

          {/* Tagline */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                fontSize: 20,
                fontWeight: 400,
                color: "rgba(196,181,253,0.88)",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
              }}
            >
              Sri Lanka's Home for Arts &amp; Culture
            </div>
            <div
              style={{
                fontSize: 14,
                color: "rgba(155,149,181,0.65)",
                letterSpacing: "0.08em",
              }}
            >
              rasaswadaya.vercel.app
            </div>
          </div>
        </div>

        {/* ── Bottom dark vignette ── */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 160,
            backgroundImage:
              "linear-gradient(0deg, rgba(7,6,10,0.55) 0%, transparent 100%)",
            display: "flex",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
