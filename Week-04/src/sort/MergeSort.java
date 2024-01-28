package sort;

public class MergeSort implements Sort {
    @Override
    public String getName() {
        return "Merge Sort";
    }

    @Override
    public int[] sort(int[] arr) {
        int[] sorted = arr.clone();
        mergeSort(sorted, 0, sorted.length - 1);
        return sorted;
    }

    private void mergeSort(int[] arr, int l, int r) {
        if (l < r) {
            int m = (l + r)/2;
            mergeSort(arr, l, m);
            mergeSort(arr, m + 1, r);
            merge(arr, l , m, r);
        }
    }

    private void merge(int[] arr, int l, int m, int r) {
        int[] left = new int[m - l + 1];
        int[] right = new int[r - m];

        System.arraycopy(arr, l, left, 0, left.length);
        System.arraycopy(arr, m + 1, right, 0, right.length);

        int i = 0, j = 0, k = l;
        while (i < left.length && j < right.length) {
            if (left[i] <= right[j]) {
                arr[k++] = left[i++];
            } else {
                arr[k++] = right[j++];
            }
        }

        while (i < left.length) {
            arr[k++] = left[i++];
        }

        while (j < right.length) {
            arr[k++] = right[j++];
        }
    }
}
