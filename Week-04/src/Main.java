import java.io.FileNotFoundException;

import sort.*;
import test.Tester;

public class Main {
    public static void main(String[] args) {
        try {
            Tester.runFullTest(new BubbleSort(), false);
            Tester.runFullTest(new CocktailShakerSort(), false);
            Tester.printAllTestResults();
        } catch (FileNotFoundException fnfe) {
            fnfe.printStackTrace();
        }
    }
}