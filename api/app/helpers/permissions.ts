export const hasPermission = (
  userObj: any,
  resourceQuery: string,
  actionQuery: string
): boolean => {
  const userPermissions = userObj.roles.flatMap((role: { role: any[] }) =>
    role.role.flatMap((roleData) =>
      roleData.permissions.flatMap((perm: { permission: any }) => perm.permission)
    )
  )
  return userPermissions.some(
    (p: { action: any; resource: any }) =>
      (p.action === actionQuery && p.resource === resourceQuery) ||
      (p.action === '*' && p.resource === resourceQuery)
  )
}
