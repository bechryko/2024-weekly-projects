package sort;

/**
 * Gnome Sort algorithm implementation.
 * @see <a href="https://en.wikipedia.org/wiki/Gnome_sort">Gnome Sort (Wikipedia)</a>
 */
public class GnomeSort implements Sort {
    @Override
    public String getName() {
        return "Gnome Sort";
    }

    @Override
    public int[] sort(int[] arr) {
        int[] sorted = arr.clone();
        int i = 0;
        while (i < sorted.length) {
            if (i == 0 || sorted[i] >= sorted[i - 1]) {
                i++;
            } else {
                int tmp = sorted[i - 1];
                sorted[i - 1] = sorted[i];
                sorted[i] = tmp;
                i--;
            }
        }
        return sorted;
    }
}
