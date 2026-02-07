
export interface Rule {
    id: string;
    worksheet: string;
    startCell: string;
    rowCount: number;
    direction: 'horizontal' | 'vertical';
    source?: string;
}

export interface ProgressState {
    percent: number;
    current: number;
    total: number;
    status: string;
}

export interface CsvParseResult {
    headers: string[];
    columns: Record<string, string[]>;
}

export type ParsedData = string[] | Record<string, string[]>;

export interface ProfileRule {
    sheetOffset: number; // 0 = Base Sheet, 1 = Next Sheet...
    startCell: string;
    rowCount: number;
    direction: 'horizontal' | 'vertical';
    source?: string;
}

export interface Profile {
    id: string;
    name: string;
    createdAt: number;
    headers: string[]; // Saved CSV headers
    rules: ProfileRule[];
}

export type ProfileLibrary = Profile[]; // A collection of profiles
