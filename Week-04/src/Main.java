import java.io.FileNotFoundException;

import sort.InsertionSort;
import sort.QuickSortLumoto;
import test.Tester;

public class Main {
    public static void main(String[] args) {
        try {
            Tester.runFullTest(new QuickSortLumoto(), false);
            Tester.runFullTest(new InsertionSort(), false);
            Tester.printAllTestResults();
        } catch (FileNotFoundException fnfe) {
            fnfe.printStackTrace();
        }
    }
}