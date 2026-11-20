import { createFileRoute } from "@tanstack/react-router";
import { OnlyMenHome } from "@/components/onlymen-home";

export const Route = createFileRoute("/")({ component: OnlyMenHome });
