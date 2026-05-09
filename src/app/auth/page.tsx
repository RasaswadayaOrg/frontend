import { AuthFlow } from "@/components/AuthFlow";
import { HP2Frame } from "../../components/hp2/Frame";
import { DesignStyles } from "../../components/hp2/design";

export default async function AuthPage(props: {
  searchParams: Promise<{ tab?: string; view?: string }>;
}) {
  const searchParams = await props.searchParams;
  const requestedView = searchParams.tab || searchParams.view;
  const defaultView = requestedView === "signup" ? "signup" : "signin";

  return (
    <>
      <DesignStyles />
      <div className="hp2">
        <div className="hp2-auth-wrap">
          <div className="hp2-auth-card">
            <AuthFlow defaultView={defaultView} />
          </div>
        </div>
      </div>
    </>
  );
}
