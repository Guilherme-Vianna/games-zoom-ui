export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight">
            Games <span className="text-primary">Zoom</span>
          </h1>
          <p className="mt-1 text-sm text-muted">Sua wishlist da Steam, compartilhada.</p>
        </div>
        {children}
      </div>
    </div>
  );
}
