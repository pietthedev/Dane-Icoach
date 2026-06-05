/**
 * StructuredData — injects JSON-LD into the document <head> via Next.js Script.
 * Pass any valid Schema.org object as `data`.
 * Validates that the object has a @context and @type before rendering.
 */

interface StructuredDataProps {
  data: Record<string, unknown>;
}

export default function StructuredData({ data }: StructuredDataProps) {
  if (!data["@context"] || !data["@type"]) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
