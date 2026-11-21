import { createFileRoute } from "@tanstack/react-router";
import { MyProfile } from "@/components/my-profile";

export const Route = createFileRoute("/me")({
  head: () => ({ meta: [{ title: "My profile — OnlyMen" }] }),
  component: MyProfile,
});
