import java.io.FileNotFoundException;

import sort.QuickSortLumoto;
import sort.TreeSort;
import test.Tester;

public class Main {
    public static void main(String[] args) {
        try {
            Tester.runFullTest(new QuickSortLumoto(), false);
            Tester.runFullTest(new TreeSort(), false);
            Tester.printAllTestResults();
        } catch (FileNotFoundException fnfe) {
            fnfe.printStackTrace();
        }
    }
}