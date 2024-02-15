import { Student } from "./student";

export interface Group {
   name: string;
   students: Student[];
}

export interface PartialGroup {
   name: string;
   students: Partial<Student>[];
}
