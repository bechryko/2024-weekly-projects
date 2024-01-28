package sort;

/**
 * Shell Sort algorithm implementation.
 * It uses Ciura's gap sequence, because it seemed to be a little bit faster than the halving method.
 * @see <a href="https://en.wikipedia.org/wiki/Shellsort">Shell Sort (Wikipedia)</a>
 */
public class ShellSort implements Sort {
    @Override
    public String getName() {
        return "Shell Sort";
    }

    @Override
    public int[] sort(int[] arr) {
        int[] sorted = arr.clone();

        int[] gaps = { 701, 301, 132, 57, 23, 10, 4, 1 };

        for (int gap : gaps) {
            for (int i = gap; i < arr.length; i++) {
                int temp = sorted[i];
                int j;
                for (j = i; j >= gap && sorted[j - gap] > temp; j -= gap) {
                    sorted[j] = sorted[j - gap];
                }
                sorted[j] = temp;
            }
        }
        return sorted;
    }
}
