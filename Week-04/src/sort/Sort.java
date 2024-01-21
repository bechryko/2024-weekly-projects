package sort;

/**
 * Interface for classes wrapping sorting algorithms.
 */
public interface Sort {
    /**
     * Gets the name of the sorting algorithm.
     * @return The name of the sorting algorithm.
     */
    String getName();

    /**
     * Sorts an array of integers.
     * @param arr Array to sort.
     * @return The sorted array.
     */
    int[] sort(int[] arr);
}
