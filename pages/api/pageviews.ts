import { google } from "googleapis";

export default async (req, res) => {
  const startDate = req.query.startDate || "2020-01-01";
  const slug = req.query.slug;

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_CLIENT_EMAIL,
        client_id: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_CLIENT_ID,
        private_key: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_PRIVATE_KEY,
      },
      scopes: ["https://www.googleapis.com/auth/analytics.readonly"],
    });

    const analytics = google.analytics({
      auth,
      version: "v3",
    });

    const response = await analytics.data.ga.get({
      "end-date": "today",
      ids: `ga:${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_VIEW_ID}`,
      metrics: "ga:pageviews",
      dimensions: "ga:pagePath",
      filters: `ga:pagePath==${slug}`,
      "start-date": startDate,
    });

    const pageViews = response?.data?.totalsForAllResults["ga:pageviews"];

    return res.status(200).json({
      pageViews,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
