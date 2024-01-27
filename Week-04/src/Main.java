import java.io.FileNotFoundException;

import sort.MergeSort;
import sort.QuickSortHoare;
import sort.QuickSortLumoto;
import test.Tester;

public class Main {
    public static void main(String[] args) {
        try {
            Tester.runFullTest(new QuickSortHoare(), false);
            Tester.runFullTest(new MergeSort(), false);
            Tester.printAllTestResults();
        } catch (FileNotFoundException fnfe) {
            fnfe.printStackTrace();
        }
    }
}