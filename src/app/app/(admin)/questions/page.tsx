import { AppContent } from "@/components/core/app-content";
import { AppHeader } from "@/components/core/app-header";
import { AppSearch } from "@/components/core/app-search";

export default function Page() {
  return (
    <>
      <AppHeader>
        <AppSearch />
      </AppHeader>
      <AppContent></AppContent>
    </>
  );
}
