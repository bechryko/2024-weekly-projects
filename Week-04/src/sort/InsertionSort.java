package sort;

/**
 * Insertion sort algorithm implementation.
 * @see <a href="https://en.wikipedia.org/wiki/Insertion_sort">Insertion sort (Wikipedia)</a>
 */
public class InsertionSort implements Sort {
    @Override
    public String getName() {
        return "Insertion Sort";
    }

    @Override
    public int[] sort(int[] arr) {
        int[] sorted = arr.clone();
        for (int i = 1; i < sorted.length; i++) {
            int j = i;
            while (j > 0 && sorted[j - 1] > sorted[j]) {
                int temp = sorted[j];
                sorted[j] = sorted[j - 1];
                sorted[j - 1] = temp;
                j--;
            }
        }
        return sorted;
    }
}
