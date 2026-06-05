import Link from "next/link";
import StructuredData from "./StructuredData";

interface Crumb {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  crumbs: Crumb[];
}

export default function Breadcrumbs({ crumbs }: BreadcrumbsProps) {
  const allCrumbs = [{ label: "Home", href: "/" }, ...crumbs];

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: allCrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.label,
      item: `https://companionai.coach${crumb.href}`,
    })),
  };

  return (
    <>
      <StructuredData data={schema} />
      <nav
        aria-label="Breadcrumb"
        className="max-w-7xl mx-auto px-6 pt-4 pb-0"
      >
        <ol className="flex flex-wrap items-center gap-1.5 font-inter text-xs text-muted">
          {allCrumbs.map((crumb, i) => (
            <li key={crumb.href} className="flex items-center gap-1.5">
              {i < allCrumbs.length - 1 ? (
                <>
                  <Link
                    href={crumb.href}
                    className="hover:text-plum-dark transition-colors"
                  >
                    {crumb.label}
                  </Link>
                  <span aria-hidden="true" style={{ color: "#B9A7E6" }}>
                    /
                  </span>
                </>
              ) : (
                <span className="text-plum-dark font-medium" aria-current="page">
                  {crumb.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
