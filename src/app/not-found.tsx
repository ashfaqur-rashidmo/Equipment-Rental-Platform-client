import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-7xl font-extrabold text-primary/30">404</p>
      <h1 className="text-2xl font-bold text-base-content">Page not found</h1>
      <p className="max-w-md text-base-content/60">
        The page you are looking for doesn&apos;t exist or may have been
        moved. Let&apos;s get you back to something useful.
      </p>
      <div className="mt-2 flex gap-3">
        <Link href="/" className="btn btn-primary">
          Back to Home
        </Link>
        <Link href="/all-equipment" className="btn btn-ghost">
          Browse Equipment
        </Link>
      </div>
    </div>
  );
}
