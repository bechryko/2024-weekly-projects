import java.io.FileNotFoundException;

import sort.BubbleSort;
import sort.GnomeSort;
import test.Tester;

public class Main {
    public static void main(String[] args) {
        try {
            Tester.runFullTest(new BubbleSort(), false);
            Tester.runFullTest(new GnomeSort(), false);
            Tester.printAllTestResults();
        } catch (FileNotFoundException fnfe) {
            fnfe.printStackTrace();
        }
    }
}