package sort;

/**
 * Cocktail Shaker Sort algorithm implementation.
 * @see <a href="https://en.wikipedia.org/wiki/Cocktail_shaker_sort">Cocktail Shaker Sort (Wikipedia)</a>
 */
public class CocktailShakerSort implements Sort {
    @Override
    public String getName() {
        return "Cocktail Shaker Sort";
    }

    @Override
    public int[] sort(int[] arr) {
        int[] sorted = arr.clone();
        int left = 0;
        int right = sorted.length - 1;
        while (left <= right) {
            for (int i = left; i < right; i++) {
                if (sorted[i] > sorted[i + 1]) {
                    int tmp = sorted[i];
                    sorted[i] = sorted[i + 1];
                    sorted[i + 1] = tmp;
                }
            }
            right--;
            for (int i = right; i > left; i--) {
                if (sorted[i] < sorted[i - 1]) {
                    int tmp = sorted[i];
                    sorted[i] = sorted[i - 1];
                    sorted[i - 1] = tmp;
                }
            }
            left++;
        }
        return sorted;
    }
}
