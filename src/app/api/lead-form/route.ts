import { NextRequest, NextResponse } from "next/server";
import { withLogger } from "@/utils/logs/withLogger";
import { saveRiwaaLeadToStrapi } from "@/lib/strapi/lead-form";

export const POST = withLogger("/api/lead-form", async (req: NextRequest, routeLogger) => {
  try {
    const body = await req.json();

    const { name, email, countryCode, phone, note } = body;

    routeLogger.info({ event: "lead_submission_started", email, countryCode, }, "RIWAA - Processing lead submission...");

    if (!name || !email || !phone) {
      routeLogger.warn({ event: "lead_validation_failed", email, }, "Missing required lead fields.");
      return NextResponse.json({ success: false, message: "Name, email and phone are required.", }, { status: 400 });
    }

    const lead = {
      name,
      email,
      country_code: countryCode,
      phone,
      enquiry_details: note,
    };

    routeLogger.info({ event: "lead_received", lead: { name, email, phone: lead.phone }, }, "RIWAA - New lead captured.");

    const res = await saveRiwaaLeadToStrapi(lead);

    routeLogger.info({ event: "lead_saved", leadId: res.documentId, email }, "RIWAA - Lead saved to Strapi.");

    return NextResponse.json({ success: true, message: "Lead submitted successfully." }, { status: 200 });
  } catch (error) {
    routeLogger.error({ err: error, }, "Lead submission failed.");
    return NextResponse.json({ success: false, message: "Something went wrong.", }, { status: 500, });
  }
});
