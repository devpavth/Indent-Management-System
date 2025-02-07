export interface RoleMapping {
  id: number;
  roleName: string;
  status: number;
}

export interface DesignationRoleMapping {
  empDesig: number;
  empDesignation: string;
  status: number;
  desigRoleMapping: RoleMapping[];
}
