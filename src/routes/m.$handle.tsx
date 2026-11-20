import { createFileRoute, notFound } from "@tanstack/react-router";
import { OnlyMenProfile, ProfileNotFound } from "@/components/onlymen-profile";
import { findModel } from "@/lib/models";

export const Route = createFileRoute("/m/$handle")({
  loader: ({ params }) => {
    const m = findModel(params.handle);
    if (!m) throw notFound();
    return { handle: m.handle };
  },
  head: ({ params }) => {
    const m = findModel(params.handle);
    return { meta: [{ title: m ? `${m.name}, ${m.age} · ${m.city} — OnlyMen` : "Profile not found — OnlyMen" }] };
  },
  component: function ProfileRoute() {
    const { handle } = Route.useLoaderData();
    return <OnlyMenProfile handle={handle} />;
  },
  notFoundComponent: ProfileNotFound,
});
