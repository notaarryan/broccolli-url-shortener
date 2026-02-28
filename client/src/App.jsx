import { useEffect, useState } from "react";
import ActionButton from "./components/ActionButton.jsx";
import Grainient from "./components/Grainient.jsx";
import ResultRegion from "./components/ResultRegion.jsx";
import TextInput from "./components/TextInput.jsx";

const DEFAULT_TIMEOUT_MS = 10000;
const PRIMARY_ENDPOINT = import.meta.env.VITE_SHORTENER_API_URL ?? "/shorten";
const LEGACY_ENDPOINT = import.meta.env.VITE_SHORTENER_LEGACY_URL ?? "/url";

function isValidHttpUrl(value) {
  if (!value) {
    return false;
  }

  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function isValidSlug(value) {
  if (!value) {
    return true;
  }

  return /^[A-Za-z0-9-]{3,20}$/.test(value);
}

function toFriendlyError(statusCode, fallback = "Request failed.") {
  if (statusCode >= 500) {
    return "Service error, try again.";
  }

  if (statusCode >= 400) {
    return fallback;
  }

  return "Network issue. Check your connection and retry.";
}

function normalizeSuccessResponse(payload) {
  const shortUrl = payload?.short_url ?? payload?.shortenedUrl ?? payload?.shortUrl;

  if (!shortUrl || typeof shortUrl !== "string") {
    throw new Error("Unexpected response format from URL service.");
  }

  return {
    short_url: shortUrl,
    click_count: payload?.click_count ?? payload?.clicks,
    created_at: payload?.created_at,
    last_accessed: payload?.last_accessed,
  };
}

function useReducedMotionPreference() {
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) {
      return false;
    }

    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    if (!window.matchMedia) {
      return undefined;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onPreferenceChange = (event) => {
      setReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", onPreferenceChange);
    return () => mediaQuery.removeEventListener("change", onPreferenceChange);
  }, []);

  return reducedMotion;
}

async function postShortenRequest(url, slug) {
  const timeoutController = new AbortController();
  const timeoutId = window.setTimeout(() => timeoutController.abort(), DEFAULT_TIMEOUT_MS);

  const requestBody = {
    original_url: url,
  };

  if (slug) {
    requestBody.custom_slug = slug;
  }

  try {
    const response = await fetch(PRIMARY_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
      signal: timeoutController.signal,
    });

    if (!response.ok) {
      const errorPayload = await response.json().catch(() => ({}));
      const fallbackMessage =
        errorPayload?.message || errorPayload?.error || "Could not shorten this URL.";
      throw new Error(toFriendlyError(response.status, fallbackMessage));
    }

    const data = await response.json();
    return normalizeSuccessResponse(data);
  } catch (error) {
    if (error?.name === "AbortError") {
      throw new Error("Network issue. Request timed out, try again.");
    }

    if (!error?.message?.includes("Failed to fetch")) {
      throw error;
    }

    const legacyPayload = {
      originalUrl: url,
    };

    if (slug) {
      legacyPayload.customSlug = slug;
    }

    const legacyResponse = await fetch(LEGACY_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(legacyPayload),
      signal: timeoutController.signal,
    });

    if (!legacyResponse.ok) {
      const fallback = await legacyResponse.json().catch(() => ({}));
      const fallbackMessage = fallback?.message || fallback?.error || "Could not shorten this URL.";
      throw new Error(toFriendlyError(legacyResponse.status, fallbackMessage));
    }

    const legacyData = await legacyResponse.json();
    return normalizeSuccessResponse(legacyData);
  } finally {
    window.clearTimeout(timeoutId);
  }
}

export default function App() {
  const [url, setUrl] = useState("");
  const [slugEnabled, setSlugEnabled] = useState(false);
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState("idle");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [urlTouched, setUrlTouched] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);

  //tiny hook that keeps the background animation
  const prefersReducedMotion = useReducedMotionPreference();

  useEffect(() => {
    document.title = "Broccolli | Shorten cleanly.";
  }, []);

  const normalizedUrl = url.trim();
  const normalizedSlug = slug.trim();
  const hasValidUrl = isValidHttpUrl(normalizedUrl);
  const hasValidSlug = !slugEnabled || isValidSlug(normalizedSlug);

  const urlError = urlTouched && !hasValidUrl ? "Use a full http:// or https:// URL." : "";
  const slugError =
    slugEnabled && slugTouched && !hasValidSlug
      ? "Use 3-20 characters: letters, numbers, hyphen."
      : "";

  const disableSubmit = status === "loading" || !hasValidUrl || !hasValidSlug;

  const handleSubmit = async (event) => {
    event.preventDefault();

    setUrlTouched(true);
    setSlugTouched(slugEnabled);

    if (!hasValidUrl || !hasValidSlug) {
      setStatus("error");
      setError({
        message: "Please fix the highlighted fields before submitting.",
      });
      return;
    }

    setStatus("loading");
    setError(null);

    try {
      //call the api here
      const payload = await postShortenRequest(normalizedUrl, slugEnabled ? normalizedSlug : "");
      setResult(payload);
      setStatus("success");
    } catch (requestError) {
      setStatus("error");
      setError({
        message: requestError?.message || "Service error, try again.",
      });
    }
  };

  return (
    <>
<div className="grainient-bg fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
  <Grainient
    color1="#042022"
    color2="#265b4b"
    color3="#e0f2e2"
    timeSpeed={prefersReducedMotion ? 0 : 0.25}
    colorBalance={0}
    warpStrength={1}
    warpFrequency={5}
    warpSpeed={2}
    warpAmplitude={50}
    blendAngle={0}
    blendSoftness={0.05}
    rotationAmount={500}
    noiseScale={2}
    grainAmount={0.1}
    grainScale={2}
    grainAnimated={false}
    contrast={1.5}
    gamma={1}
    saturation={1}
    centerX={0}
    centerY={0}
    zoom={1.1}
  />
</div>

      <main className="app-shell" aria-label="URL shortener">
        <section className="glass-card" aria-labelledby="brand-heading">
          <header className="brand-header">
            <p className="brand-mark">Broccolli</p>
            <h1 id="brand-heading">Shorten cleanly.</h1>
            <p className="tagline" data-reduced-motion={prefersReducedMotion}>
              One screen. One link. Done.
            </p>
          </header>

          <form className="url-form" onSubmit={handleSubmit} noValidate>
            <TextInput
              id="url-input"
              label="Long URL"
              type="url"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              onBlur={() => setUrlTouched(true)}
              placeholder="https://example.com/project/demo"
              autoComplete="url"
              spellCheck={false}
              required
              error={urlError}
              assistiveText="Paste a full link with http:// or https://"
            />

            <div className="slug-toggle-row">
              <button
                type="button"
                className="toggle-button"
                aria-expanded={slugEnabled}
                aria-controls="slug-input"
                onClick={() => {
                  const next = !slugEnabled;
                  setSlugEnabled(next);
                  if (!next) {
                    setSlugTouched(false);
                  }
                }}
              >
                {slugEnabled ? "Hide custom slug" : "Add custom slug"}
              </button>
            </div>

            {/* i know toggles are usually checkboxes*/}
            {slugEnabled ? (
              <TextInput
                id="slug-input"
                label="Custom slug"
                type="text"
                value={slug}
                onChange={(event) => setSlug(event.target.value)}
                onBlur={() => setSlugTouched(true)}
                placeholder="my-clean-link"
                autoComplete="off"
                spellCheck={false}
                error={slugError}
                assistiveText="3-20 chars, letters, numbers, hyphen"
              />
            ) : null}

            <ActionButton type="submit" disabled={disableSubmit} loading={status === "loading"}>
              Shorten
            </ActionButton>

            {status === "error" ? (
              <div className="result-error" role="alert">
                <p className="error-title">Could not shorten URL</p>
                <p>{error?.message || "Service error, try again."}</p>
                <button type="button" onClick={() => setStatus("idle")} className="retry-button">
                  Try again
                </button>
              </div>
            ) : null}
          </form>

          {/* only send it through when success happened */}
          <ResultRegion shortUrl={status === "success" ? result?.short_url : ""} />
        </section>
      </main>

      <footer className="app-footer">
        <a href="/health" aria-label="Service status endpoint">
          Status
        </a>
        <a
          href="https://github.com/notaarryan/broccolli-url-shortener"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open source repository"
        >
          Repo
        </a>
      </footer>
    </>
  );
}
