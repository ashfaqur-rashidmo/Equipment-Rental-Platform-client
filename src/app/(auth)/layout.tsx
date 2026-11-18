/**
 * Minimal shell for auth pages. The navbar and footer render globally from
 * the root layout, so this wrapper only centers the auth card.
 */
export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-10">
      {children}
    </main>
  );
}
