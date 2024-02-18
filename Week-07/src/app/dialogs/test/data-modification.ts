export type DataModification = NewStudent | NewTestResult | ModifiedTestResult;

export interface NewStudent {
   type: 'newStudent';
   name: string;
   neptun: string;
   result: number;
}

export interface NewTestResult {
   type: 'newTestResult';
   name: string;
   neptun: string;
   oldNeptun?: string;
   result: number;
}

export interface ModifiedTestResult {
   type: 'modifiedTestResult';
   name: string;
   neptun: string;
   oldNeptun?: string;
   oldResult: number;
   newResult: number;
}
