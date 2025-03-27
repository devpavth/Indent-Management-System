export interface Program {
  departProId: number;
  proName: string;
  proStatus: number;
  programId: number;
}

export interface Department {
  departId: number;
  deptName: string;
  deptStatus: number;
  departProgram: Program[];
}
