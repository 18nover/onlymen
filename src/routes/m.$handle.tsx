import { createFileRoute, notFound } from "@tanstack/react-router";
import { OnlyMenProfile, ProfileNotFound } from "@/components/onlymen-profile";
import { MemberProfile } from "@/components/member-profile";
import { findModel } from "@/lib/models";
import { publicProfileFn } from "@/lib/account/api";

export const Route = createFileRoute("/m/$handle")({
  loader: async ({ params }) => {
    const m = findModel(params.handle);
    if (m) return { kind: "demo" as const, handle: m.handle, title: `${m.name}, ${m.age} · ${m.city} — OnlyMen` };
    const p = await publicProfileFn({ data: { username: params.handle } });
    if (!p) throw notFound();
    return { kind: "member" as const, handle: p.username, profile: p, title: `${p.displayName}${p.age != null ? `, ${p.age}` : ""} — OnlyMen` };
  },
  head: ({ loaderData }) => ({ meta: [{ title: loaderData?.title ?? "Profile not found — OnlyMen" }] }),
  component: function ProfileRoute() {
    const d = Route.useLoaderData();
    return d.kind === "demo" ? <OnlyMenProfile handle={d.handle} /> : <MemberProfile p={d.profile} />;
  },
  notFoundComponent: ProfileNotFound,
});
