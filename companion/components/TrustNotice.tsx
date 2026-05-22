interface TrustNoticeProps {
  variant?: "full" | "compact";
}

export default function TrustNotice({ variant = "full" }: TrustNoticeProps) {
  if (variant === "compact") {
    return (
      <p className="font-inter text-xs text-muted text-center">
        Coaching & reflection support only — not therapy, medical advice or crisis support.
      </p>
    );
  }

  return (
    <aside
      className="max-w-7xl mx-auto px-6 py-6"
      aria-label="Service disclaimer"
    >
      <div className="rounded-2xl border border-mist bg-cloud px-6 py-5 flex gap-4 items-start">
        <span aria-hidden="true" className="text-xl flex-shrink-0 mt-0.5">
          🛡
        </span>
        <div className="flex flex-col gap-1">
          <p className="font-inter font-semibold text-plum-dark text-sm">
            Coaching &amp; reflection support — not therapy or crisis services
          </p>
          <p className="font-inter text-muted text-sm leading-relaxed">
            Companion by Danè is a coaching and personal growth service. It is not
            therapy, psychiatry, medical advice, crisis intervention or emergency
            mental-health support. If you are in immediate danger or need urgent
            support, please contact your local emergency services or a qualified
            mental-health professional.
          </p>
        </div>
      </div>
    </aside>
  );
}
