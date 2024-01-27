package sort;

/**
 * Quick Sort algorithm implementation using Hoare's partition scheme.
 * @see <a href="https://en.wikipedia.org/wiki/Quicksort#Hoare_partition_scheme">Quick Sort (Wikipedia)</a>
 */
public class QuickSortHoare implements Sort {
    @Override
    public String getName() {
        return "Quick Sort (Hoare' partition scheme)";
    }

    @Override
    public int[] sort(int[] arr) {
        int[] sorted = arr.clone();
        quickSort(sorted, 0, sorted.length - 1);
        return sorted;
    }

    private void quickSort(int[] arr, int low, int high) {
        if(low < high) {
            int pivot = partition(arr, low, high);
            quickSort(arr, low, pivot);
            quickSort(arr, pivot + 1, high);
        }
    }

    private int partition(int[] arr, int low, int high) {
        int pivot = arr[low];
        int i = low - 1;
        int j = high + 1;

        while(true) {
            do {
                i++;
            } while(arr[i] < pivot);

            do {
                j--;
            } while(arr[j] > pivot);

            if(i >= j) {
                return j;
            }

            int tmp = arr[i];
            arr[i] = arr[j];
            arr[j] = tmp;
        }
    }
}
