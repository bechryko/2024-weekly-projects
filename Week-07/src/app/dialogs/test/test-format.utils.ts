
export interface StudentWithTestResult {
   name: string;
   neptun: string;
   result: number;
}

export class TestFormatUtils {
   public static formatRawInput(rawInput: string): StudentWithTestResult[] {
      const students: StudentWithTestResult[] = [];
      const lines = rawInput.split('\n').map(l => l.trim()).filter(l => l.length > 0);

      for (const line of lines) {
         const [ name, neptun, status, result ] = line.split('\t').map(p => p.trim().replaceAll(',', '.'));
         students.push({
            name,
            neptun,
            result: Number(result)
         });
      }
      return students;
   }
}
