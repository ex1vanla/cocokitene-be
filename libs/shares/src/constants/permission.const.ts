export enum PermissionEnum {
  // admin'role:
  MANAGE_USER = 'manage_user',
  MANAGE_ROLES = 'manage_roles',
  MANAGE_SYSTEM_SETTINGS = 'manage_systen_settings',
  // super_admin'role is has admin rights and below rights:
  MANAGE_SYSTEM_RESOURCES = 'manage_system_resources',
  MANAGE_DATABASE = 'manage_database',
  ACCESS_AUDIT_LOGS = 'access_audit_logs',
}
