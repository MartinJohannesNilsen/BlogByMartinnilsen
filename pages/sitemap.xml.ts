import { StoredPost } from "../types";

function getFormatedLastmodDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function generateSiteMap(posts: StoredPost[]) {
  // Get largest value where you check each
  const date = new Date(
    Math.max(...posts.map((post) => post.updatedAt || post.createdAt), 0)
  );
  const lastUpdated = getFormatedLastmodDate(date);

  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <!--We manually set the two URLs we know already-->
     <url>
       <loc>${process.env.NEXT_PUBLIC_WEBSITE_URL}</loc>
       <lastmod>${lastUpdated}</lastmod>
     </url>
     <url>
       <loc>${`${process.env.NEXT_PUBLIC_WEBSITE_URL}/tags`}</loc>
       <lastmod>${lastUpdated}</lastmod>
     </url>
     ${posts
       .map((post) => {
         return `
       <url>
           <loc>${`${process.env.NEXT_PUBLIC_WEBSITE_URL}/posts/${post.id}`}</loc>
           <lastmod>${getFormatedLastmodDate(
             new Date(post.updatedAt || post.createdAt)
           )}</lastmod>
       </url>
     `;
       })
       .join("")}
   </urlset>
 `;
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }) {
  // We make an API call to gather the URLs for our site
  const request = await fetch(
    process.env.NEXT_PUBLIC_SERVER_URL + "/overview",
    {
      method: "GET",
      headers: {
        apikey: process.env.NEXT_PUBLIC_API_AUTHORIZATION_TOKEN,
      },
    }
  );
  const posts = await request.json();

  // We generate the XML sitemap with the posts data
  const sitemap = generateSiteMap(posts);

  res.setHeader("Content-Type", "text/xml");
  // we send the XML to the browser
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default SiteMap;
