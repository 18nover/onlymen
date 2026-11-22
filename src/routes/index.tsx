import { createFileRoute } from "@tanstack/react-router";
import { OnlyMenHome } from "@/components/onlymen-home";
import { directoryFn } from "@/lib/account/api";
import { DirectoryProvider } from "@/lib/use-directory";

export const Route = createFileRoute("/")({
  loader: () => directoryFn(),
  component: HomePage,
});

function HomePage() {
  const data = Route.useLoaderData();
  return (
    <DirectoryProvider payload={data}>
      <OnlyMenHome />
    </DirectoryProvider>
  );
}
