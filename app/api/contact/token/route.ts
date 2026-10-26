import { issueFormToken } from "@/lib/form-token";

// Never cache: the token encodes "when the form was rendered", and a cached
// copy would make every visitor look like they loaded the page long ago.
export const dynamic = "force-dynamic";

export async function GET() {
  const secret = process.env.FORM_TOKEN_SECRET;

  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      console.error("[contact] FORM_TOKEN_SECRET is not set.");
      return Response.json({ error: "Service unavailable." }, { status: 503 });
    }
    // Dev only: the POST handler skips verification when no secret is set.
    return Response.json({ token: "dev-unsigned" });
  }

  return Response.json(
    { token: issueFormToken(secret) },
    { headers: { "Cache-Control": "no-store" } },
  );
}
