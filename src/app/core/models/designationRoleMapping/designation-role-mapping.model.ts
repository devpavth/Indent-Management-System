export interface RoleMapping {
  id: number;
  roleName: string;
  status: number;
}

export interface DesignationRoleMapping {
  empDesig: number;
  empDesignation: string;
  levelId: number;
  levelName: string;
  status: number;
  desigRoleMapping: RoleMapping[];
}

export interface LevelMapping {
  createdBy: number;
  createdOn: string;
  levelId: number;
  levelName: string;
  status: number;
  designationTables: DesignationRoleMapping[];
}
