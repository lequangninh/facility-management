// pages/index.js
import Head from "next/head";
import Script from "next/script";
import { getPageContent, getListings, getFaqs } from "../lib/airtable";
import { Calendar } from "lucide-react";
import { Clock } from "lucide-react";
import { Users } from "lucide-react";
import { ChartColumn } from "lucide-react";
import { Download } from "lucide-react";
import { useState } from "react";

export async function getStaticProps() {
  const [pageContent, listings, faqs] = await Promise.all([
    getPageContent("Homepage_Main"),
    getListings(),
    getFaqs()
  ]);

  return {
    props: {
      pageContent,
      listings,
      faqs
    },
    revalidate: 300 // ISR (optional)
  };
}

function ListingCard({ item }) {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "features", label: "Features" },
    { id: "proscons", label: "Pros & Cons" },
    { id: "pricing", label: "Pricing" }
  ];

  return (
    <article className="bg-white border border-gray-200 rounded-[26px] shadow-sm p-6 sm:p-8">
      {/* TOP: INFO + VIDEO */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] items-start">
        {/* LEFT SIDE: logo, name, ratings */}
        <div>
          {/* Header row */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex gap-3 sm:gap-4">
              {item.logoUrl && (
                <div className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gray-50 flex items-center justify-center overflow-hidden">
                  <img
                    src={item.logoUrl}
                    alt={item.name}
                    width={64}
                    height={64}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">
                    {item.name}
                  </h3>
                  {item.badgeText && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                      ⭐ {item.badgeText}
                    </span>
                  )}
                </div>
                {item.vendorName && (
                  <p className="text-sm text-gray-500 mt-0.5">
                    By {item.vendorName}
                  </p>
                )}
                {item.categoryTags?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {item.categoryTags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Price pill */}
            <div className="flex flex-col items-end gap-2">
              {item.pricingLabel && (
                <div className="inline-flex items-center rounded-full bg-gray-50 px-5 py-2 border border-gray-200 shadow-sm">
                  <div className="text-left">
                    <div className="text-[10px] uppercase tracking-wide text-gray-500">
                      Starting from
                    </div>
                    <div className="text-base sm:text-lg font-semibold text-gray-900">
                      {item.pricingLabel}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Per-source ratings */}
          {item.ratingSources?.length > 0 && (
            <div className="mt-5 space-y-2">
              {item.ratingSources.map((src, idx) => (
                <div
                  key={`${src.name}-${idx}`}
                  className="flex items-center justify-between rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm shadow-sm"
                >
                  <span className="text-gray-700">{src.name}</span>
                  {src.score != null ? (
                    <span className="flex items-center gap-2 text-gray-700">
                      <span className="text-yellow-400 text-base leading-none">
                        ★★★★☆
                      </span>
                      <span className="font-medium">
                        {src.score.toFixed ? src.score.toFixed(1) : src.score}
                      </span>
                      {src.count != null && (
                        <span className="text-gray-400">
                          ({src.count.toLocaleString
                            ? src.count.toLocaleString()
                            : src.count}
                          )
                        </span>
                      )}
                    </span>
                  ) : (
                    <span className="text-gray-400">No rating</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT SIDE: video */}
        <div className="w-full">
          {item.videoUrl ? (
            <div className="aspect-video rounded-[24px] overflow-hidden shadow-sm bg-black">
              <iframe
                src={item.videoUrl}
                title={`${item.name} video`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          ) : (
            <div className="aspect-video rounded-[24px] bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 text-sm">
              No video available
            </div>
          )}
        </div>
      </div>

      {/* TABS + CONTENT – FULL WIDTH */}
      <div className="mt-7 border-b border-gray-200">
        <nav className="flex flex-wrap gap-6 text-sm font-medium text-gray-500">
          {tabs.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 -mb-px border-b-2 transition-colors flex items-center gap-1 ${
                  active
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-4 space-y-3 text-sm sm:text-base text-gray-700 leading-relaxed">
        {activeTab === "overview" && (
          <>
            {item.description && (
              <p>
                <span className="font-semibold">{item.name}</span>{" "}
                {item.description}
              </p>
            )}
            {item.availableFor?.length > 0 && (
              <p className="mt-2">
                <span className="font-semibold">Available for: </span>
                {item.availableFor.join(", ")}
              </p>
            )}
          </>
        )}

        {activeTab === "features" && item.features.length > 0 && (
          <ul className="list-disc pl-5 space-y-1">
            {item.features.map((feature, idx) => (
              <li key={idx}>{feature}</li>
            ))}
          </ul>
        )}

        {activeTab === "proscons" && (
          <div className="grid gap-4 md:grid-cols-2">
            {item.pros.length > 0 && (
              <div>
                <h4 className="font-semibold text-green-700 mb-1">Pros</h4>
                <ul className="space-y-1">
                  {item.pros.map((p, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span className="mt-0.5 text-green-500">✓</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {item.cons.length > 0 && (
              <div>
                <h4 className="font-semibold text-red-700 mb-1">Cons</h4>
                <ul className="space-y-1">
                  {item.cons.map((c, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span className="mt-0.5 text-red-500">✕</span>
                      <span>{c}</span>
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
              <p className="font-semibold text-gray-900">
                {item.pricingLabel}
              </p>
            )}
            {item.ctaUrl && (
              <p className="mt-2 text-gray-600">
                Contact vendor for detailed pricing and plans.
              </p>
            )}
          </div>
        )}
      </div>

      {/* CTA – FULL WIDTH (unchanged) */}
      <div className="mt-7 rounded-[24px] border border-gray-200 bg-gray-50 px-5 py-4 sm:px-6 sm:py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="max-w-2xl">
          <h4 className="font-semibold text-gray-900">
            {item.ctaSectionTitle}
          </h4>
          <p className="text-sm text-gray-600 mt-1 leading-relaxed">
            {item.ctaSectionText}
          </p>
        </div>
        {item.ctaUrl && (
          <a
            href={item.ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 whitespace-nowrap"
          >
            {item.ctaButtonText}
          </a>
        )}
      </div>
    </article>
  );
}


// 👇 THIS is the default export and MUST be a React component
export default function Home({ pageContent, listings, faqs }) {
  return (
    <>
        {/* Tailwind via CDN */}
      <Script
        src="https://cdn.tailwindcss.com"
        strategy="beforeInteractive"
      />

      {/* SEO + JSON-LD */}
      <Head>
        <title>{pageContent.seoTitle}</title>
        {pageContent.seoDescription && (
          <meta name="description" content={pageContent.seoDescription} />
        )}
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
        {pageContent.customSchemaJson && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: pageContent.customSchemaJson
            }}
          />
        )}
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

            {/*<!-- Meta Info -->*/}
            <div
              className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 mb-6 sm:mb-8">
              <div className="flex items-center gap-1 sm:gap-2">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Updated July 2025</span>
              </div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="flex items-center gap-1 sm:gap-2">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>5 min read</span>
              </div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
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

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-6 sm:mt-8 px-4">
              {pageContent.heroButtonText && (
                <a
                  href={pageContent.heroButtonLink || "#software-comparison"}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-medium transition-colors shadow-lg hover:shadow-xl text-sm sm:text-base"
                >
                  {pageContent.heroButtonText}
                </a>
              )}
            <button
              className="bg-white hover:bg-gray-50 text-gray-900 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-medium border border-gray-300 transition-colors shadow-sm hover:shadow-md text-sm sm:text-base">
              <Download className="w-4 h-4 sm:w-5 sm:h-5 inline mr-2"/>
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
                    <p id="software-comparison-description" class="text-base sm:text-lg text-gray-600 mt-4 px-2">
                    Detailed comparison of leading facility management software platforms with features, pricing, and user
                    ratings.
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
                        dangerouslySetInnerHTML={{
                          __html: faq.answerHtml
                        }}
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-sm text-gray-500 flex justify-between">
          <span>
            © {new Date().getFullYear()} Facility Management Software Guide
          </span>
          <span>Powered by Airtable CMS</span>
        </div>
      </footer>
    </>
  );
}