package sort;

/**
 * Quick Sort algorithm implementation using Lumoto's partition scheme.
 * @see <a href="https://en.wikipedia.org/wiki/Quicksort#Lomuto_partition_scheme">Quick Sort (Wikipedia)</a>
 */
public class QuickSortLumoto implements Sort {
    @Override
    public String getName() {
        return "Quick Sort (Lumoto's partition scheme)";
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
            quickSort(arr, low, pivot - 1);
            quickSort(arr, pivot + 1, high);
        }
    }

    private int partition(int[] arr, int low, int high) {
        int pivot = arr[high];
        int i = low - 1;

        for(int j = low; j < high; j++) {
            if(arr[j] < pivot) {
                i++;
                int tmp = arr[i];
                arr[i] = arr[j];
                arr[j] = tmp;
            }
        }

        int tmp = arr[i + 1];
        arr[i + 1] = arr[high];
        arr[high] = tmp;
        return i + 1;
    }
}
