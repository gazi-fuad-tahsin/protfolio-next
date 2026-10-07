/** JSON response with the headers every public portfolio endpoint shares. */
export function json(data: unknown, init: { status?: number } = {}) {
  return Response.json(data, {
    status: init.status ?? 200,
    headers: {
      "Cache-Control": "public, max-age=60, s-maxage=300",
      "Access-Control-Allow-Origin": "*",
      "X-Powered-By": "Tahsin's Portfolio API",
    },
  });
}
