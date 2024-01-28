import java.io.FileNotFoundException;

import sort.*;
import test.Tester;

public class Main {
    public static void main(String[] args) {
        try {
            Tester.runFullTest(new BubbleSort(), false);
            Tester.runFullTest(new QuickSortLumoto(), false);
            Tester.runFullTest(new QuickSortHoare(), false);
            Tester.runFullTest(new InsertionSort(), false);
            Tester.runFullTest(new TreeSort(), false);
            Tester.runFullTest(new GnomeSort(), false);
            Tester.runFullTest(new MergeSort(), false);
            Tester.runFullTest(new CocktailShakerSort(), false);
            Tester.runFullTest(new ShellSort(), false);
            Tester.printAllTestResults();
        } catch (FileNotFoundException fnfe) {
            fnfe.printStackTrace();
        }
    }
}