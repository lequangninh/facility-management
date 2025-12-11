// lib/airtable.js
const { AIRTABLE_TOKEN, AIRTABLE_BASE_ID } = process.env;
const API_BASE = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}`;

if (!AIRTABLE_TOKEN || !AIRTABLE_BASE_ID) {
  throw new Error(
    "Missing AIRTABLE_TOKEN or AIRTABLE_BASE_ID in environment variables"
  );
}

async function airtableFetch(tableName, params = {}) {
  // Build URL safely
  const url = new URL(
    `${API_BASE}/${encodeURIComponent(tableName)}`
  );

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    url.searchParams.append(key, String(value));
  });

  // Log the URL once (helps debugging)
  console.log("Airtable request:", url.toString());

  let res;
  try {
    res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${AIRTABLE_TOKEN}`
      }
    });
  } catch (err) {
    console.error("Airtable fetch failed:", err);
    throw err; // rethrow so Next.js shows the error
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `Airtable error for table "${tableName}": ${res.status} ${res.statusText}\n${text}`
    );
  }

  const json = await res.json();
  return json.records;
}

// Utility: split newline text into array
function splitLines(text) {
  if (!text) return [];
  return String(text)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

/**
 * Table A: Page_Content
 */
export async function getPageContent(pageId = "Homepage_Main") {
  const records = await airtableFetch("Page_Content", {
    maxRecords: 1,
    // filter by Page_ID, optional but nice if you later add more pages
    filterByFormula: `{Page_ID} = "${pageId}"`
  });

  const fields = records[0]?.fields ?? {};

  return {
    pageId: fields.Page_ID || pageId,
    heroPreHeadline: fields.Hero_Pre_Headline || "",
    heroHeadline: fields.Hero_Headline || "",
    heroDescription: fields.Hero_Description || "",
    heroButtonText: fields.Hero_Button_Text || "",
    heroButtonLink: fields.Hero_Button_Link || "#software-comparison",
    logoUrl: fields.Logo_Website_URL || "",
    seoTitle: fields.SEO_Title || fields.Hero_Headline || "",
    seoDescription: fields.SEO_Description || "",
    customSchemaJson: fields.Custom_Schema_JSON || ""
  };
}

/**
 * Table B: Listings
 * Filter Status="Live", sort by Ranking_Position asc
 */
export async function getListings() {
  const filterByFormula = `{Status} = "Live"`;

  // Airtable sort syntax: sort[0][field]=... & sort[0][direction]=asc
  const records = await airtableFetch("Listings", {
    filterByFormula,
    "sort[0][field]": "Ranking_Position",
    "sort[0][direction]": "asc"
  });

  return records.map((rec) => {
    const f = rec.fields;
    return {
      id: rec.id,
      name: f.Name || "",
      status: f.Status || "",
      rankingPosition: f.Ranking_Position || 9999,
      badgeText: f.Badge_Text || "",
      logoUrl: f.Logo_CDN_URL || "",
      categoryTags: f.Category_Tags || [],
      ratingScore: f.Rating_Score ?? null,
      ratingCount: f.Rating_Count ?? null,
      pricingLabel: f.Pricing_Label || "",
      description: f.Description || "",
      features: splitLines(f.Features_List),
      pros: splitLines(f.Pros_List),
      cons: splitLines(f.Cons_List),
      ctaUrl: f.CTA_Url || "#"
    };
  });
}

/**
 * Table C: FAQs
 */
export async function getFaqs() {
  const records = await airtableFetch("FAQs", {
    "sort[0][field]": "Ranking_Position",
    "sort[0][direction]": "asc"
  });

  return records.map((rec) => {
    const f = rec.fields;
    return {
      id: rec.id,
      question: f.Question || "",
      // Answer is rich text HTML – we keep as raw HTML string
      answerHtml: f.Answer || "",
      rankingPosition: f.Ranking_Position || 9999
    };
  });
}
