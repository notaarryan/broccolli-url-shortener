import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

export default function ResultRegion({ shortUrl }) {
  //reduce motin
  const reduceMotion = useReducedMotion();


  const initialState = reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0, y: -10 };
  const animateState = reduceMotion ? { opacity: 1 } : { height: "auto", opacity: 1, y: 0 };
  const exitState = reduceMotion
    ? { opacity: 0, transition: { duration: 0.35, ease: "easeOut" } }
    : { height: 0, opacity: 0, transition: { duration: 0.35, ease: "easeOut" } };

  return (
    <AnimatePresence initial={false}>
      {/* only show result once we actually have a short url */}
      {shortUrl ? (
        <motion.div
          key="short-url-result"
          initial={initialState}
          animate={animateState}
          exit={exitState}
          transition={reduceMotion ? undefined : { duration: 0.35, ease: "easeOut" }}
          className="overflow-hidden"
        >
          <div className="mt-4 space-y-3 rounded-xl border border-white/15 bg-white/5 p-4">
            <div className="h-px w-full bg-white/15" />
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
              Short URL
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <input
                readOnly
                value={shortUrl}
                className="min-w-0 flex-1 rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white"
              />
              <button
                type="button"
                onClick={() => {
                  //copy
                  navigator.clipboard.writeText(shortUrl);
                }}
                className="rounded-md bg-emerald-200 px-3 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-100"
              >
                Copy
              </button>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
