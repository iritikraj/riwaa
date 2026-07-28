const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1338';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

export type RiwaaLeadPayload = {
  name: string;
  email: string;
  country_code: string;
  phone: string;
  enquiry_details?: string;
};

export async function saveRiwaaLeadToStrapi(payload: RiwaaLeadPayload) {
  const response = await fetch(`${STRAPI_URL}/api/lead-forms`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${STRAPI_TOKEN}`,
    },
    body: JSON.stringify({
      data: payload,
    }),
  });

  if (!response.ok) {
    const errorDetails = await response.text();

    throw new Error(
      `Strapi Lead Error: ${response.status} - ${errorDetails}`
    );
  }

  const result = await response.json();

  return result.data;
}
