import java.io.FileNotFoundException;

import sort.QuickSortHoare;
import sort.QuickSortLumoto;
import test.Tester;

public class Main {
    public static void main(String[] args) {
        try {
            Tester.runFullTest(new QuickSortLumoto(), false);
            Tester.runFullTest(new QuickSortHoare(), false);
            Tester.printAllTestResults();
        } catch (FileNotFoundException fnfe) {
            fnfe.printStackTrace();
        }
    }
}