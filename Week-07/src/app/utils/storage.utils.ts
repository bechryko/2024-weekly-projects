import { Group } from "../models/group";

export class StorageUtils {
   private static readonly LOCAL_STORAGE_KEY = 'lsm-groups';

   public static loadFromLocalStorage(): Group[] {
      const data = localStorage.getItem(this.LOCAL_STORAGE_KEY);
      if (data) {
         return JSON.parse(data);
      }
      return [];
   }

   public static saveToLocalStorage(data: Group[]): void {
      localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(data));
   }
}
