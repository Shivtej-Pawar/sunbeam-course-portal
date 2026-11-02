import "./CourseCardSkeleton.css";

/**
 * Placeholder that mirrors the layout of a course card on the Home page.
 * It reuses the same Bootstrap column classes and `course-card` class as the
 * real card, so the page does not jump when the real courses arrive.
 */
export default function CourseCardSkeleton() {
  return (
    <div className="col-12 col-md-6 col-lg-4" aria-hidden="true">
      <div className="card course-card skeleton-card h-100">
        <div className="card-body d-flex flex-column">
          {/* title */}
          <span className="skeleton skeleton-title" />

          {/* description (3 lines) */}
          <div className="skeleton-desc flex-grow-1 mb-3">
            <span className="skeleton skeleton-line" style={{ width: "100%" }} />
            <span className="skeleton skeleton-line" style={{ width: "92%" }} />
            <span className="skeleton skeleton-line" style={{ width: "62%" }} />
          </div>

          {/* fees / start / end */}
          <span className="skeleton skeleton-meta" style={{ width: "28%" }} />
          <span className="skeleton skeleton-meta" style={{ width: "58%" }} />
          <span
            className="skeleton skeleton-meta skeleton-meta-last"
            style={{ width: "54%" }}
          />

          {/* register + view videos */}
          <ActionButtonsSkeleton />

          {/* "Courses are public..." note */}
          <span className="skeleton skeleton-note mt-3" />
        </div>
      </div>
    </div>
  );
}

/**
 * Two button-shaped placeholders. Also used on its own while a logged-in
 * student's registration status is still being checked, so the button does
 * not flip from "Register" to "Enrolled" after the card is already visible.
 */
export function ActionButtonsSkeleton() {
  return (
    <div className="d-flex gap-2 mt-2" aria-hidden="true">
      <span className="skeleton skeleton-btn flex-fill" />
      <span className="skeleton skeleton-btn flex-fill" />
    </div>
  );
}