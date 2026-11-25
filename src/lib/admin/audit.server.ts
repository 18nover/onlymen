import type { Sql } from "../db";

export async function writeAdminAudit(
  db: Sql,
  actorId: string,
  action: string,
  resourceType: string,
  resourceId: string | null = null,
): Promise<void> {
  if (!actorId) throw new Error("Admin audit entries require an actor.");
  await db`insert into om_admin_audit (actor_id, action, resource_type, resource_id)
    values (${actorId}, ${action.slice(0, 100)}, ${resourceType.slice(0, 60)}, ${resourceId?.slice(0, 200) ?? null})`;
}
