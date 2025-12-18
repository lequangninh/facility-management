// pages/index.js
import Head from "next/head";
import Script from "next/script";
import { useState } from "react";
import { getPageContent, getListings, getFaqs } from "../lib/airtable";
import {
  Calendar,
  Clock,
  Users,
  ChartColumn,
  Download,
  Smartphone,
  Info,
  Settings,
  Scale,
  DollarSign,
  CheckCircle,
  XCircle,
  Check,
  Rocket,
  Star
} from "lucide-react";

export async function getStaticProps() {
  const [pageContent, listings, faqs] = await Promise.all([
    getPageContent("Homepage_Main"),
    getListings(),
    getFaqs(),
  ]);

  return {
    props: {
      pageContent,
      listings,
      faqs,
    },
    revalidate: 300, // ISR (optional)
  };
}
function RatingStars({ rating }) {
  if (rating == null) return null;

  const full = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  const empty = 5 - full - (hasHalf ? 1 : 0);

  const stars = [];

  for (let i = 0; i < full; i++) {
    stars.push(
      <Check  // using Check just as a filled icon; you can swap to Star if you prefer
        key={`full-${i}`}
        className="w-4 h-4 text-amber-400 fill-current"
      />
    );
  }

  if (hasHalf) {
    stars.push(
      <Check key="half" className="w-4 h-4 text-amber-400 fill-current" />
    );
  }

  for (let i = 0; i < empty; i++) {
    stars.push(
      <Check key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
    );
  }

  return <div className="flex">{stars}</div>;
}

function ListingCard({ item }) {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview", Icon: Info },
    { id: "features", label: "Features", Icon: Settings },
    { id: "proscons", label: "Pros & Cons", Icon: Scale },
    { id: "pricing", label: "Pricing", Icon: DollarSign },
  ];

  return (
    <article className="bg-white border border-gray-200 rounded-3xl shadow-sm hover:shadow-md transition-shadow p-4 sm:p-6 lg:p-8 overflow-hidden">
      {/* TOP: Logo + info + video */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 mb-6 sm:mb-8">
        {/* LEFT: logo, meta, pricing, per-source ratings */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          {/* Logo */}
          {item.logoUrl && (
            <div className="flex-shrink-0 mx-auto sm:mx-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 rounded-2xl border border-gray-200 p-3 sm:p-4">
                <img
                  src={item.logoUrl}
                  alt={item.name}
                  width={80}
                  height={80}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          )}

          {/* Name, badge, vendor, pricing, ratings */}
          <div className="flex-1 text-center sm:text-left">
            {/* Name + badge */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {item.name}
              </h3>

              {item.badgeText && (
                <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 px-2 py-1 rounded-xl text-xs sm:text-sm font-medium">
                  <Star className="w-3 h-3" />
                  {item.badgeText}
                </span>
              )}
            </div>

            {/* Vendor / categories */}
            {item.vendorName && (
              <p className="text-sm sm:text-base text-gray-600 mb-2">
                By <span className="font-medium">{item.vendorName}</span>
              </p>
            )}

            {item.categoryTags?.length > 0 && (
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-4">
                {item.categoryTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center bg-gray-100 text-gray-700 px-3 py-1 rounded-xl text-xs sm:text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Pricing pill – “Starting from 26 €/month” style */}
            {item.pricingLabel && (
              <div className="flex items-baseline justify-center sm:justify-start gap-2 mb-4 sm:mb-6">
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-xl text-xs sm:text-sm font-medium">
                  Starting from
                </span>
                <span className="text-xl sm:text-2xl font-bold text-gray-900">
                  {item.pricingLabel}
                </span>
              </div>
            )}

            {/* Per-source ratings – matches generator design */}
            {item.ratingSources?.length > 0 && (
              <div className="space-y-2 sm:space-y-3">
                {item.ratingSources.map((src, idx) => (
                  <div
                    key={`${src.name || "src"}-${idx}`}
                    className="flex justify-between items-center p-2 sm:p-3 bg-gray-50 rounded-2xl border border-gray-200"
                  >
                    {/* Left: platform name */}
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Smartphone className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                      <span className="text-xs sm:text-sm font-medium text-gray-700">
                        {src.name}
                      </span>
                    </div>

                    {/* Right: stars + numeric rating */}
                    {src.score != null ? (
                      <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-700">
                        {/* You can swap this <span> for <RatingStars rating={src.score} /> if you want icon stars */}
                        <span className="text-amber-400 text-base leading-none">
                          ★★★★☆
                        </span>
                        <span className="font-medium">
                          {src.score.toFixed ? src.score.toFixed(1) : src.score}
                        </span>
                        {src.count != null && (
                          <span className="text-gray-400">
                            (
                            {src.count.toLocaleString
                              ? src.count.toLocaleString()
                              : src.count}
                            )
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs sm:text-sm">
                        No rating
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: responsive video – same idea as generator, fixed for Android */}
        <div className="relative order-first lg:order-last w-full">
          {item.videoUrl ? (
            <div className="aspect-video bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 w-full max-w-full">
              <iframe
                src={item.videoUrl}
                title={`${item.name} video`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="block w-full h-full max-w-full"
              />
            </div>
          ) : (
            <div className="aspect-video w-full max-w-full rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 text-sm">
              No video available
            </div>
          )}
        </div>
      </div>

      {/* TABS (same React logic, styling inspired by your generator) */}
      <div className="mb-6 sm:mb-8">
        {/* Desktop: horizontal tabs with bottom border */}
        <div className="hidden sm:flex border-b border-gray-200 mb-4 sm:mb-6">
          {tabs.map(({ id, label, Icon }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                className={`tab-button px-6 py-3 text-sm font-medium flex items-center gap-2 border-b-2 rounded-t-2xl transition-colors ${
                  active
                    ? "text-blue-600 border-blue-600"
                    : "text-gray-600 border-transparent hover:text-gray-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            );
          })}
        </div>

        {/* Mobile: 2x2 grid of pill tabs */}
        <div className="block sm:hidden mb-4">
          <div className="grid grid-cols-2 gap-2">
            {tabs.map(({ id, label, Icon }) => {
              const active = activeTab === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveTab(id)}
                  className={`tab-button px-4 py-3 text-sm font-medium text-center rounded-2xl border transition-colors flex items-center justify-center gap-2 ${
                    active
                      ? "text-blue-600 bg-blue-50 border-blue-200"
                      : "text-gray-600 bg-gray-50 border-gray-200"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* TAB PANELS */}
        <div className="tab-content mt-2 space-y-3 text-sm sm:text-base text-gray-700 leading-relaxed">
          {activeTab === "overview" && (
            <>
              {item.description && (
                <p className="mb-4">
                  <strong className="text-gray-900">{item.name}</strong>{" "}
                  {item.description}
                </p>
              )}
              {item.availableFor?.length > 0 && (
                <p>
                  <strong className="text-gray-900">Available for: </strong>
                  {item.availableFor.join(", ")}
                </p>
              )}
            </>
          )}

          {activeTab === "features" && item.features?.length > 0 && (
            <ul className="space-y-2">
              {item.features.map((feature, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-3 text-gray-700"
                >
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          )}

          {activeTab === "proscons" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {item.pros?.length > 0 && (
                <div className="p-3 sm:p-4 bg-green-50 rounded-2xl border border-green-200">
                  <h4 className="text-base sm:text-lg font-semibold text-green-800 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    Advantages
                  </h4>
                  <ul className="space-y-2">
                    {item.pros.map((p, idx) => (
                      <li
                        key={idx}
                        className="text-sm sm:text-base text-green-700"
                      >
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {item.cons?.length > 0 && (
                <div className="p-3 sm:p-4 bg-red-50 rounded-2xl border border-red-200">
                  <h4 className="text-base sm:text-lg font-semibold text-red-800 mb-3 flex items-center gap-2">
                    <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    Disadvantages
                  </h4>
                  <ul className="space-y-2">
                    {item.cons.map((c, idx) => (
                      <li
                        key={idx}
                        className="text-sm sm:text-base text-red-700"
                      >
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeTab === "pricing" && (
            <div>
              {item.pricingLabel && (
                <p className="font-semibold text-gray-900 mb-2">
                  {item.pricingLabel}
                </p>
              )}
              {item.ctaUrl && (
                <p className="text-gray-600">
                  Contact the vendor for detailed pricing and plans.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* CTA – like generator design */}
      <div className="bg-gray-50 rounded-2xl p-4 sm:p-6 lg:p-8 border border-gray-200">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4 sm:gap-6">
          <div className="text-center lg:text-left max-w-2xl">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              {item.ctaSectionTitle ||
                "Ready to Transform Your Facility Management?"}
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              {item.ctaSectionText ||
                `Join thousands of companies already using ${item.name} to streamline their operations and boost efficiency.`}
            </p>
          </div>

          {item.ctaUrl && (
            <a
              href={item.ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-3 rounded-2xl font-medium transition-colors shadow-sm hover:shadow-md flex items-center justify-center gap-2 text-sm sm:text-base whitespace-nowrap"
            >
              <Rocket className="w-4 h-4" />
              {item.ctaButtonText || "Get Started"}
            </a>
          )}
        </div>
      </div>
    </article>
  );
}



export default function Home({ pageContent, listings, faqs }) {
  const pageUrl = "https://facility-management-software.com";
  const ogImage =
    "https://facility-management-software.com/assets/facility-management-og.jpg";
  const twitterImage =
    "https://facility-management-software.com/assets/facility-management-twitter.jpg";

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Tailwind via CDN */}
      <Script src="https://cdn.tailwindcss.com" strategy="beforeInteractive" />

      <Head>
        {/* Basic SEO */}
        <title>{pageContent.seoTitle}</title>
        <meta name="description" content={pageContent.seoDescription} />
        {/* Viewport for mobile responsiveness */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
        <meta
          name="keywords"
          content="facility management software, CAFM software, CMMS systems, ERP facility management, EAM software, IWMS platforms, building management software, maintenance management"
        />
        <meta name="author" content="Facility Management Software Guide" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />

        {/* Open Graph */}
        <meta property="og:title" content={pageContent.seoTitle} />
        <meta
          property="og:description"
          content={pageContent.seoDescription}
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:image" content={ogImage} />
        <meta
          property="og:site_name"
          content="Facility Management Software Guide"
        />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageContent.seoTitle} />
        <meta
          name="twitter:description"
          content={pageContent.seoDescription}
        />
        <meta name="twitter:image" content={twitterImage} />

        {/* Canonical */}
        <link rel="canonical" href={pageUrl} />

        {/* Favicons */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />

        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      {/* HEADER */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {pageContent.logoUrl && (
              <img
                src={pageContent.logoUrl}
                alt="Site logo"
                width={40}
                height={40}
                className="rounded-md object-contain"
              />
            )}
            <span className="font-semibold text-gray-900">
              Facility Management Software Guide
            </span>
          </div>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            {pageContent.heroPreHeadline && (
              <div className="inline-flex items-center gap-2 bg-white px-3 sm:px-4 py-2 rounded-2xl border border-gray-200 shadow-sm mb-6 sm:mb-8">
                <ChartColumn className="w-4 h-4 text-blue-600" />
                <span className="text-xs sm:text-sm font-medium text-gray-600">
                  {pageContent.heroPreHeadline}
                </span>
              </div>
            )}

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
              <span className="block">{pageContent.heroHeadline}</span>
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 mb-6 sm:mb-8">
              <div className="flex items-center gap-1 sm:gap-2">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Updated July 2025</span>
              </div>
              <div className="w-1 h-1 bg-gray-400 rounded-full" />
              <div className="flex items-center gap-1 sm:gap-2">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>5 min read</span>
              </div>
              <div className="w-1 h-1 bg-gray-400 rounded-full" />
              <div className="flex items-center gap-1 sm:gap-2">
                <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Expert Reviewed</span>
              </div>
            </div>

            {pageContent.heroDescription && (
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-xl mx-auto mb-8 sm:mb-10 leading-relaxed px-2">
                {pageContent.heroDescription}
              </p>
            )}

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-6 sm:mt-8 px-4">
              {pageContent.heroButtonText && (
                <a
                  href={pageContent.heroButtonLink || "#software-comparison"}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-medium transition-colors shadow-lg hover:shadow-xl text-sm sm:text-base"
                >
                  {pageContent.heroButtonText}
                </a>
              )}
              <button className="bg-white hover:bg-gray-50 text-gray-900 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-medium border border-gray-300 transition-colors shadow-sm hover:shadow-md text-sm sm:text-base inline-flex items-center justify-center gap-2">
                <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                Download Guide
              </button>
            </div>
          </div>
        </section>

        {/* SOFTWARE LISTINGS */}
        <section
          id="software-comparison"
          className="bg-white py-12 sm:py-16 lg:py-20"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
                Software Comparison
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed px-2">
                Compare the best facility management software solutions.
              </p>
              <p
                id="software-comparison-description"
                className="text-base sm:text-lg text-gray-600 mt-4 px-2"
              >
                Detailed comparison of leading facility management software
                platforms with features, pricing, and user ratings.
              </p>
            </div>

            <div className="space-y-8">
              {listings.map((item) => (
                <ListingCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        {faqs.length > 0 && (
          <section className="bg-gray-50 py-12 sm:py-16 lg:py-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {faqs.map((faq) => (
                  <details
                    key={faq.id}
                    className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4"
                  >
                    <summary className="cursor-pointer font-medium text-gray-900">
                      {faq.question}
                    </summary>
                    <div className="mt-3 text-sm sm:text-base text-gray-700">
                      <div
                        dangerouslySetInnerHTML={{ __html: faq.answerHtml }}
                      />
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 py-6 mt-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-sm text-gray-500 flex flex-col sm:flex-row gap-2 sm:gap-0 justify-between">
          <span>
            © {new Date().getFullYear()} Facility Management Software Guide
          </span>
          <span>Powered by Airtable CMS</span>
        </div>
      </footer>
    </div>
  );
}
