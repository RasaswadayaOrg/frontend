"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { Search } from "lucide-react";
import { toArtistSlug } from "../../lib/slugs";
import { buildSlug } from "../../lib/slug";

type SuggestResult = {
  artists:   { id: string; name?: string; profession?: string; genre?: string; photoUrl?: string }[];
  events:    { id: string; title: string; category?: string; imageUrl?: string; location?: string }[];
  academies: { id: string; name?: string; type?: string; imageUrl?: string; location?: string }[];
  products:  { id: string; name: string; category?: string; imageUrl?: string; price?: number }[];
};

// Which categories to display in the dropdown.
type SearchType = "events" | "artists" | "academies" | "products" | "all";

export function LiveSearchBar({
  action,
  name = "search",
  defaultValue = "",
  placeholder = "Search…",
  type = "all",
  hiddenFields = {},
}: {
  action: string;
  name?: string;
  defaultValue?: string;
  placeholder?: string;
  type?: SearchType;
  hiddenFields?: Record<string, string>;
}) {
  const router = useRouter();
  const [query, setQuery]     = useState(defaultValue);
  const [results, setResults] = useState<SuggestResult | null>(null);
  const [loading, setLoading] = useState(false);
  const wrapRef     = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced fetch
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const q = query.trim();
    if (q.length < 2) { setResults(null); setLoading(false); return; }
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch("/api/search-suggest?q=" + encodeURIComponent(q));
        setResults(await res.json());
      } catch { setResults(null); }
      finally { setLoading(false); }
    }, 280);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query]);

  // Click-outside to close
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setResults(null);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const showDrop = query.trim().length >= 2 && (loading || results !== null);
  const close = () => setResults(null);

  const show = (cat: SearchType) => type === "all" || type === cat;

  const artists   = results?.artists   || [];
  const events    = results?.events    || [];
  const academies = results?.academies || [];
  const products  = results?.products  || [];
  const hasAny = artists.length + events.length + academies.length + products.length > 0;

  return (
    <div className="hp2-livesearch" ref={wrapRef}>
      <form
        action={action}
        method="get"
        className="hp2-search"
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          close();
          const q = query.trim();
          if (!q) return;
          const params = new URLSearchParams({ [name]: q, ...hiddenFields });
          router.push(action + "?" + params.toString());
        }}
      >
        <span className="hp2-search__icon"><Search size={16} strokeWidth={1.5} /></span>
        <input
          type="search"
          name={name}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="hp2-input"
          aria-label={placeholder}
          autoComplete="off"
        />
        {Object.entries(hiddenFields).map(([k, v]) => (
          <input key={k} type="hidden" name={k} value={v} />
        ))}
      </form>

      {showDrop && (
        <div className="hp2-livesearch__drop">
          {loading && (
            <div className="hp2-livesearch__loading">
              <span className="hp2-livesearch__dot" />
              <span className="hp2-livesearch__dot" />
              <span className="hp2-livesearch__dot" />
            </div>
          )}

          {!loading && results && !hasAny && (
            <p className="hp2-livesearch__empty">No results for &ldquo;{query}&rdquo;</p>
          )}

          {!loading && show("artists") && artists.length > 0 && (
            <>
              <p className="hp2-livesearch__cat">Artists</p>
              {artists.map((a) => (
                <Link key={a.id} href={"/artists/" + toArtistSlug(a.name || "", a.id)} className="hp2-livesearch__item" onClick={close}>
                  {a.photoUrl
                    ? <img src={a.photoUrl} alt="" className="hp2-livesearch__thumb" />
                    : <span className="hp2-livesearch__thumb" />}
                  <span>
                    <span className="hp2-livesearch__name">{a.name}</span>
                    {a.profession && <span className="hp2-livesearch__sub">{a.profession}</span>}
                  </span>
                </Link>
              ))}
            </>
          )}

          {!loading && show("events") && events.length > 0 && (
            <>
              <p className="hp2-livesearch__cat">Events</p>
              {events.map((e) => (
                <Link key={e.id} href={"/events/" + buildSlug(e.id, e.title)} className="hp2-livesearch__item" onClick={close}>
                  {e.imageUrl
                    ? <img src={e.imageUrl} alt="" className="hp2-livesearch__thumb" />
                    : <span className="hp2-livesearch__thumb" />}
                  <span>
                    <span className="hp2-livesearch__name">{e.title}</span>
                    {e.location && <span className="hp2-livesearch__sub">{e.location}</span>}
                  </span>
                </Link>
              ))}
            </>
          )}

          {!loading && show("academies") && academies.length > 0 && (
            <>
              <p className="hp2-livesearch__cat">Academies</p>
              {academies.map((a) => (
                <Link key={a.id} href={"/academies/" + buildSlug(a.id, a.name)} className="hp2-livesearch__item" onClick={close}>
                  {a.imageUrl
                    ? <img src={a.imageUrl} alt="" className="hp2-livesearch__thumb" />
                    : <span className="hp2-livesearch__thumb" />}
                  <span>
                    <span className="hp2-livesearch__name">{a.name}</span>
                    {a.location && <span className="hp2-livesearch__sub">{a.location}</span>}
                  </span>
                </Link>
              ))}
            </>
          )}

          {!loading && show("products") && products.length > 0 && (
            <>
              <p className="hp2-livesearch__cat">Marketplace</p>
              {products.map((p) => (
                <Link key={p.id} href={"/marketplace/" + p.id} className="hp2-livesearch__item" onClick={close}>
                  {p.imageUrl
                    ? <img src={p.imageUrl} alt="" className="hp2-livesearch__thumb" />
                    : <span className="hp2-livesearch__thumb" />}
                  <span>
                    <span className="hp2-livesearch__name">{p.name}</span>
                    {p.price != null && <span className="hp2-livesearch__sub">Rs {p.price.toLocaleString()}</span>}
                  </span>
                </Link>
              ))}
            </>
          )}

          {!loading && hasAny && (
            <div className="hp2-livesearch__footer">
              <Link
                href={"/search?q=" + encodeURIComponent(query)}
                className="hp2-livesearch__all"
                onClick={close}
              >
                See all results
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
