import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface Permissions {
  action: string;
  id: Generated<string>;
  resource: string | null;
}

export interface Roles {
  id: Generated<string>;
  name: string;
}

export interface RolesPermissions {
  permissionId: string;
  roleId: string;
}

export interface Sessions {
  expiresAt: Timestamp;
  id: string;
  userId: string;
}

export interface Users {
  createdAt: Generated<Timestamp>;
  email: string;
  emailVerifiedAt: Timestamp | null;
  hashedPassword: string;
  id: Generated<string>;
  resetPassword: string | null;
  updatedAt: Generated<Timestamp>;
}

export interface UsersRoles {
  roleId: string;
  userId: string;
}

export interface DB {
  permissions: Permissions;
  roles: Roles;
  rolesPermissions: RolesPermissions;
  sessions: Sessions;
  users: Users;
  usersRoles: UsersRoles;
}
