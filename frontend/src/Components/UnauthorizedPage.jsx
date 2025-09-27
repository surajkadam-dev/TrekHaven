import { Lock, ArrowLeft, Home, LogIn } from "lucide-react";
import { motion } from "framer-motion";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 text-slate-800 dark:text-slate-100 flex items-center justify-center p-6">
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-xl"
        aria-labelledby="unauth-title"
        role="main"
      >
        <section className="relative overflow-hidden rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur shadow-2xl ring-1 ring-black/5 dark:ring-white/10">
          {/* top accent */}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-fuchsia-500 via-sky-500 to-emerald-500" />

          <div className="p-8 md:p-10">
            <div className="flex items-center gap-4">
              <div className="grid place-items-center h-14 w-14 rounded-2xl bg-slate-100 dark:bg-slate-800">
                <Lock className="h-7 w-7" aria-hidden="true" />
              </div>
              <div>
                <h1
                  id="unauth-title"
                  className="text-2xl md:text-3xl font-semibold tracking-tight"
                >
                  Unauthorized
                </h1>
                <p className="mt-1 text-sm md:text-base text-slate-600 dark:text-slate-300">
                  You don’t have permission to view this page.
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-slate-200/70 dark:border-slate-700/60 bg-white/60 dark:bg-slate-900/60 p-4">
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-slate-500 dark:text-slate-400">
                    HTTP Status
                  </dt>
                  <dd className="font-medium">403 Forbidden</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-slate-500 dark:text-slate-400">
                    Signed In
                  </dt>
                  <dd className="font-medium">Required</dd>
                </div>
              </dl>
            </div>

            <p className="mt-6 text-sm md:text-base text-slate-600 dark:text-slate-300">
              If you believe this is a mistake, try signing in with a different
              account or request access from your administrator.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="/"
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 dark:border-slate-700 px-4 py-2 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-500"
              >
                <Home className="h-4 w-4" aria-hidden="true" />
                Go Home
              </a>
              <a
                href="/login"
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-2 text-sm font-semibold shadow hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-500"
              >
                <LogIn className="h-4 w-4" aria-hidden="true" />
                Sign In
              </a>
              <button
                onClick={() =>
                  history.length > 1
                    ? history.back()
                    : (window.location.href = "/")
                }
                className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-500"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Go Back
              </button>
            </div>
          </div>

          {/* bottom subtle gradient glow */}
          <div
            aria-hidden
            className="pointer-events-none select-none absolute -bottom-24 -right-24 h-56 w-56 rounded-full blur-3xl opacity-40 bg-gradient-to-tr from-sky-400 to-fuchsia-400 dark:from-sky-500/30 dark:to-fuchsia-500/30"
          />
        </section>

        <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
          Tip: Protect this route on the client and server. On the client, gate
          with your auth state; on the server, verify the session/token.
        </p>
      </motion.main>
    </div>
  );
}
