export class DateUtils {
   public static displayable(timestamp: number, isLong = false): string {
      const date = new Date(timestamp);
      const year = this.getAlignedNumber(date.getFullYear(), 4);
      const month = this.getAlignedNumber(date.getMonth() + 1);
      const day = this.getAlignedNumber(date.getDate());
      const hours = this.getAlignedNumber(date.getHours());
      const minutes = this.getAlignedNumber(date.getMinutes());
      const seconds = this.getAlignedNumber(date.getSeconds());
      return isLong ? `${year}-${month}-${day} ${hours}:${minutes}:${seconds}` : `${hours}:${minutes}:${seconds}`;
   }

   public static combineTimestamps(timestamps: number[], isLong?: boolean): string {
      return timestamps.map(timestamp => DateUtils.displayable(timestamp, isLong)).join(', ');
   }

   private static getAlignedNumber(number: number, digits = 2): string {
      return number.toString().padStart(digits, '0');
   }
}
