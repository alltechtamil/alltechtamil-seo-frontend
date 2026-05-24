
export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-on-background transition-colors duration-300">
      {/* Premium Header */}
      <header className="sticky top-0 z-50 w-full border-b border-outline-variant bg-surface/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-tr from-primary to-secondary text-white font-bold text-xl shadow-md shadow-primary/20">
              AT
            </div>
            <div>
              <span className="font-sans font-bold text-lg tracking-tight">AllTechTamil</span>
              <span className="ml-1.5 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">Blogger</span>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <span className="text-label-caps text-on-surface-variant hover:text-primary transition-colors cursor-pointer">Platform Setup</span>
            <span className="text-label-caps text-on-surface-variant hover:text-primary transition-colors cursor-pointer">Architecture</span>
            <span className="text-label-caps text-on-surface-variant hover:text-primary transition-colors cursor-pointer">Developer Panel</span>
          </nav>
        </div>
      </header>

      {/* Hero Welcome banner */}
      <section className="relative overflow-hidden py-16 md:py-24 border-b border-outline-variant bg-gradient-to-b from-surface-container-low to-background">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--color-primary-fixed),_transparent)]"></div>
        <div className="mx-auto max-w-[1280px] px-6 relative z-10 text-center md:text-left flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 flex flex-col gap-6">
            <div className="inline-flex self-center md:self-start items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-semibold text-primary">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Phase 1 Environment Initialized Successfully
            </div>
            <h1 className="text-display-lg-mobile md:text-display-lg text-on-background">
              The Next-Generation Editorial Platform
            </h1>
            <p className="max-w-2xl text-lg text-on-surface-variant leading-relaxed font-sans">
              Welcome to the customized frontend architecture for AllTechTamil. This workspace combines server-side dynamic compilation, Incremental Static Regeneration, and rich-text editing structures, styled strictly through corporate HSL tokens.
            </p>
          </div>
        </div>
      </section>

      {/* Main Validation Area */}
      <main className="flex-1 mx-auto w-full max-w-[1280px] px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Live Typography Renderer Validation */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 md:p-8 shadow-sm">
              <div className="mb-6 pb-4 border-b border-outline-variant flex items-center justify-between">
                <h3 className="text-headline-md text-on-background font-bold">
                  📝 Live Typography Sandbox
                </h3>
                <span className="text-xs bg-secondary/10 text-secondary font-semibold px-2.5 py-1 rounded-md">
                  blog-typography class
                </span>
              </div>
              
              {/* This container executes the exact styles written in typography.css */}
              <article className="blog-typography">
                <h1>Understanding Editorial System Variables</h1>
                <p>
                  This container is wrapped with the <code>.blog-typography</code> selector. Below are native HTML tags, rendered dynamically from standard database payloads, verifying that they match the premium typography rules without class injections.
                </p>
                
                <h2>1. Core Component Hierarchy</h2>
                <p>
                  A well-structured blog needs solid typographic hierarchy to maintain high reading retention. Here is an editor blockquote to emphasize key technical architectural rules:
                </p>
                
                <blockquote>
                  &quot;All image optimization resides inside the backend pipeline, outputting a single WebP asset scaled to a maximum of 1600px width. Responsive layouts are handled natively by the client-side Next.js framework.&quot;
                </blockquote>
                
                <h2>2. Code & Dynamic Highlighting</h2>
                <p>
                  For developer tutorials, syntax formatting is critical. The editor targets in-line code blocks and full-sized snippets:
                </p>
                
                <pre><code>{`// Interceptor refresh token lifecycle
adminClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await authStore.dispatch(refreshSessionThunk());
      return adminClient(error.config);
    }
    return Promise.reject(error);
  }
);`}</code></pre>

                <h2>3. Standard Markdown Taxonomies</h2>
                <ul>
                  <li>Fully integrated Redux Toolkit actions.</li>
                  <li>Automatic Edge-route security verification checks.</li>
                  <li>Responsive layout tables.</li>
                </ul>
              </article>
            </div>
          </div>

          {/* Right Column: HSL Diagnostics & Environment Metrics */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="rounded-xl border border-outline-variant bg-surface-container p-6 shadow-sm">
              <h3 className="text-headline-md text-on-background mb-4 font-bold">
                🛠️ HSL Token Diagnostics
              </h3>
              <p className="text-body-ui text-on-surface-variant mb-6">
                Below are the active design system HSL properties parsed dynamically from the Tailwind CSS v4 compiler.
              </p>
              
              <div className="flex flex-col gap-4">
                {/* Primary Card */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-surface-container-lowest border border-outline-variant hover:translate-x-1 transition-transform duration-200">
                  <div className="flex items-center gap-3">
                    <span className="h-6 w-6 rounded bg-primary"></span>
                    <span className="text-body-ui font-semibold">Primary Brand</span>
                  </div>
                  <span className="text-code-sm text-primary font-mono font-bold">#004ac6</span>
                </div>

                {/* Secondary Card */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-surface-container-lowest border border-outline-variant hover:translate-x-1 transition-transform duration-200">
                  <div className="flex items-center gap-3">
                    <span className="h-6 w-6 rounded bg-secondary"></span>
                    <span className="text-body-ui font-semibold">Secondary Brand</span>
                  </div>
                  <span className="text-code-sm text-secondary font-mono font-bold">#6b38d4</span>
                </div>

                {/* Tertiary Card */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-surface-container-lowest border border-outline-variant hover:translate-x-1 transition-transform duration-200">
                  <div className="flex items-center gap-3">
                    <span className="h-6 w-6 rounded bg-tertiary"></span>
                    <span className="text-body-ui font-semibold">Tertiary Brand</span>
                  </div>
                  <span className="text-code-sm text-tertiary font-mono font-bold">#943700</span>
                </div>

                {/* Error Card */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-surface-container-lowest border border-outline-variant hover:translate-x-1 transition-transform duration-200">
                  <div className="flex items-center gap-3">
                    <span className="h-6 w-6 rounded bg-error"></span>
                    <span className="text-body-ui font-semibold">Semantic Error</span>
                  </div>
                  <span className="text-code-sm text-error font-mono font-bold">#ba1a1a</span>
                </div>
              </div>
            </div>

            {/* Configured Actions Panel */}
            <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm flex flex-col gap-4">
              <h4 className="text-body-ui font-bold text-on-background uppercase tracking-wider">
                ⚙️ Quick Configurations
              </h4>
              <div className="flex flex-col gap-2.5">
                <a
                  href="/admin"
                  className="flex h-11 items-center justify-center rounded-lg bg-primary text-white font-semibold text-sm hover:bg-primary/90 active:scale-95 transition-all shadow-md shadow-primary/10"
                >
                  Enter Admin Dashboard
                </a>
                <a
                  href="https://nextjs.org/docs"
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-11 items-center justify-center rounded-lg border border-outline-variant text-on-surface hover:bg-surface-container transition-colors font-semibold text-sm"
                >
                  Next.js Documentation
                </a>
              </div>
            </div>
          </div>
          
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-8 border-t border-outline-variant bg-surface-container-low text-center text-xs text-on-surface-variant">
        <p>© {new Date().getFullYear()} AllTechTamil Blogger Platform. Styled elegantly via Tailwind CSS v4.</p>
      </footer>
    </div>
  );
}
