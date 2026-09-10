import { auth } from "@/lib/auth";
import { getMyWishlists } from "@/lib/wishlists";
import { SidebarContent } from "@/components/layout/sidebar-content";
import { MobileHeader } from "@/components/layout/mobile-header";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  let lists: { id: string; name: string; itemCount: number; isOwner?: boolean }[] = [];
  try {
    lists = (await getMyWishlists()).map((w) => ({
      id: w.id,
      name: w.name,
      itemCount: w.itemCount,
      isOwner: w.isOwner,
    }));
  } catch {
    lists = [];
  }

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[260px_1fr]">
      <MobileHeader lists={lists} userName={session?.user?.name} />

      <aside className="sticky top-0 hidden h-dvh border-r border-border bg-surface lg:block">
        <SidebarContent lists={lists} userName={session?.user?.name} />
      </aside>

      <main className="min-w-0">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">{children}</div>
      </main>
    </div>
  );
}
