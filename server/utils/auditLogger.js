import AuditLog from "../models/AuditLog.js";

export async function logAudit({
  action,
  actorId,
  actorName,
  target = {},
  changes = {},
  req = null,
}) {
  const log = new AuditLog({
    action,
    actorId,
    actorName,
    target,
    changes,
    ip: req?.ip || null,
    device: req?.headers?.["user-agent"] || null,
  });

  await log.save();
}
