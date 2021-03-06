export interface File {
  name: string;
  archiveName?: string;
  extractSymbol?: string;
}

export enum SectionType {
  Bss,
  Data,
  Text,
  Other
}

export interface Section {
  type: SectionType;
  in: {
    section: string;
    size: number;
  };
  out: {
    offset: number;
    section: string;
    size: number;
  };
}
export interface LinkRecord {
  fileName: string;
  sections: Section[];
}

export interface LocateRecord {
  chip: string;
  group: string;
  section: string;
  size: number;
  spaceAddr: number;
  chipAddr: number;
  alignment: number;
}
export interface Memory {
  name: string;
  code: number;
  data: number;
  reserved: number;
  free: number;
  total: number;
}

export interface Resources {
  memory: Memory[];
}

export interface LinkerMap {
  processedFiles: File[];
  linkResult: LinkRecord[];
  locateResult: LocateRecord[];
  usedResources: Resources;
}
