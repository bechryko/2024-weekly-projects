export type DataModification = AddBonusPointsModification | AddStudentWithBonusPointsModification;

export interface AddBonusPointsModification {
   type: 'addBonusPoints';
   studentName: string;
   oldBonusPoints: number;
   newBonusPoints: number;
   addedBonusPoints: number;
}

export interface AddStudentWithBonusPointsModification {
   type: 'addStudent';
   studentName: string;
   bonusPoints: number;
}
