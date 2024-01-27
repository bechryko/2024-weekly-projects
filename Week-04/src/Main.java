import java.io.FileNotFoundException;

import sort.*;
import test.Tester;

public class Main {
    public static void main(String[] args) {
        try {
            Tester.runFullTest(new MergeSort(), false);
            Tester.runFullTest(new ShellSort(), false);
            Tester.printAllTestResults();
        } catch (FileNotFoundException fnfe) {
            fnfe.printStackTrace();
        }
    }
}