// pages/index.js
import Head from "next/head";
import { getPageContent, getListings, getFaqs } from "../lib/airtable";

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

// 👇 THIS is the default export and MUST be a React component
export default function Home({ pageContent, listings, faqs }) {
  return (
    <>
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
                <span className="text-xs sm:text-sm font-medium text-gray-600">
                  {pageContent.heroPreHeadline}
                </span>
              </div>
            )}

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
              <span className="block">{pageContent.heroHeadline}</span>
            </h1>

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
            </div>

            <div className="grid gap-6 lg:gap-8 md:grid-cols-2">
              {listings.map((item) => (
                <article
                  key={item.id}
                  className="software-card bg-white border border-gray-200 rounded-2xl shadow-sm p-5 sm:p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4 gap-3">
                      <div className="flex items-center gap-3">
                        {item.logoUrl && (
                          <img
                            src={item.logoUrl}
                            alt={item.name}
                            width={56}
                            height={56}
                            className="rounded-md object-contain"
                          />
                        )}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {item.name}
                          </h3>
                          {item.categoryTags?.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {item.categoryTags.map((tag) => (
                                <span
                                  key={tag}
                                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      {item.badgeText && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          {item.badgeText}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-3">
                      {item.ratingScore != null && (
                        <span>
                          ⭐ {item.ratingScore}
                          {item.ratingCount != null && (
                            <span className="text-gray-400">
                              {" "}
                              ({item.ratingCount} reviews)
                            </span>
                          )}
                        </span>
                      )}
                      {item.pricingLabel && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {item.pricingLabel}
                        </span>
                      )}
                    </div>

                    {item.description && (
                      <p className="text-sm sm:text-base text-gray-600 mb-4">
                        {item.description}
                      </p>
                    )}

                    {item.features.length > 0 && (
                      <ul className="mt-3 space-y-1 text-sm text-gray-600">
                        {item.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="mt-1 text-green-500">●</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      {item.pros.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-green-700 mb-1">
                            Pros
                          </h4>
                          <ul className="space-y-1 text-sm text-gray-700">
                            {item.pros.map((p, idx) => (
                              <li key={idx} className="flex gap-2">
                                <span className="mt-0.5 text-green-500">
                                  ✓
                                </span>
                                <span>{p}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {item.cons.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-red-700 mb-1">
                            Cons
                          </h4>
                          <ul className="space-y-1 text-sm text-gray-700">
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
                  </div>

                  <div className="mt-5">
                    <a
                      href={item.ctaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex justify-center items-center w-full sm:w-auto px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      Visit Website
                    </a>
                  </div>
                </article>
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
