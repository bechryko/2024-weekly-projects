package sort;

/**
 * Bubble sort algorithm implementation.
 * @see <a href="https://en.wikipedia.org/wiki/Bubble_sort">Bubble sort (Wikipedia)</a>
 */
public class BubbleSort implements Sort {
    @Override
    public String getName() {
        return "Bubble Sort";
    }

    @Override
    public int[] sort(int[] arr) {
        int[] sorted = arr.clone();
        boolean swapped = true;
        while(swapped) {
            swapped = false;
            for(int i = 0; i < sorted.length - 1; i++) {
                if(sorted[i] > sorted[i + 1]) {
                    swapped = true;
                    int temp = sorted[i + 1];
                    sorted[i + 1] = sorted[i];
                    sorted[i] = temp;
                }
            }
        }
        return sorted;
    }
}
