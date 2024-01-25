import java.io.FileNotFoundException;

import sort.BubbleSort;
import test.Tester;

public class Main {
    public static void main(String[] args) {
        try {
            Tester.runFullTest(new BubbleSort(), true);
        } catch (FileNotFoundException fnfe) {
            fnfe.printStackTrace();
        }
    }
}