import Logo from "../Logo";

export default function Footer() {
  return (
    <footer className="py-8" style={{ background: "#2E1A47" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo variant="compact" onDark />

          <p
            className="font-inter text-center text-sm"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            © Companion by Danè. Human-led coaching, AI-supported.
          </p>

          <p
            className="font-inter text-sm text-center"
            style={{
              color: "rgba(255,255,255,0.42)",
              fontStyle: "italic",
            }}
          >
            Find your voice. Trust yourself. Discover your superpower.
          </p>
        </div>
      </div>
    </footer>
  );
}
