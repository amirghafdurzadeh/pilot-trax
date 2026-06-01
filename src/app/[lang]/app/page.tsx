import { authentication } from "@/actions/auth";
import { SellingChart } from "@/components/admin/charts/selling-chart";
import { UserChart } from "@/components/admin/charts/user-chart";
import { AppContent } from "@/components/core/app-content";
import { AppHeader } from "@/components/core/app-header";
import { getDictionary } from "@/lib/dictionaries";
import { getUserRole } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function Page(props: PageProps<"/[lang]/app">) {
  const lang = (await props.params).lang;

  const session = await authentication(lang);
  const role = await getUserRole(session.id);

  if (role !== "admin" && role !== "system_user") {
    redirect(`/${lang}/app/quizzes`);
  }

  const dict = await getDictionary(lang);
  return (
    <>
      <AppHeader lang={lang} dict={dict.app} />
      <AppContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UserChart
            lang={lang}
            title={dict.app.dashboard.user_chart_title}
            description={dict.app.dashboard.user_chart_description}
            chartLabel={dict.app.dashboard.user_chart_label}
          />
          <SellingChart
            lang={lang}
            title={dict.app.dashboard.selling_chart_title}
            description={dict.app.dashboard.selling_chart_description}
            chartLabel={dict.app.dashboard.selling_chart_label}
          />
        </div>
      </AppContent>
    </>
  );
}
