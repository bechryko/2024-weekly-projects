import { PartialGroup } from "../../models/group";

export class BonusPointFormatUtils {
   public static formatRawInput(rawInput: string): PartialGroup[] {
      const lines = rawInput.split('\n');
      const groups: PartialGroup[] = [];

      let currentGroupName: string[] = [];
      for (const line of lines) {
         const formattedLine = this.formatLine(line);
         if(formattedLine.startsWith("-")) {
            if(!groups.find(g => g.name === this.groupName(currentGroupName))) {
               groups.push({
                  name: this.groupName(currentGroupName),
                  students: []
               });
            }
            const [ studentName, bonusPoints ] = formattedLine.slice(1).trim().split(":").map(s => s.trim());
            groups.find(g => g.name === this.groupName(currentGroupName))!.students.push({
               name: studentName,
               bonusPoints: Number(bonusPoints)
            });
            continue;
         }
         if(formattedLine === "") {
            currentGroupName.pop();
            continue;
         }
         currentGroupName.push(formattedLine);
      }

      return groups;
   }

   private static formatLine(rawLine: string): string {
      return rawLine.trim().replace(/:$/, "");
   }

   private static groupName(groupNameBuilder: string[]): string {
      return groupNameBuilder.join(" ");
   }
}
