package test;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Scanner;

import sort.Sort;

/**
 * Class for testing the sorting algorithms.
 */
public class Tester {
    private static final Map<TestDescription, List<Long>> testResults;
    private static final List<Sort> registeredSorters;

    private static final String unit = "µs";

    static {
        testResults = new HashMap<>();
        registeredSorters = new ArrayList<>();
    }

    private static void addTestResult(Sort sorter, TestSize size, TestDifficulty difficulty, long time) {
        getTestResults(sorter, size, difficulty).add(time);
        if(!registeredSorters.contains(sorter)) {
            registeredSorters.add(sorter);
        }
    }

    private static List<Long> getTestResults(Sort sorter, TestSize size, TestDifficulty difficulty) {
        return testResults.computeIfAbsent(new TestDescription(sorter, size, difficulty), k -> new ArrayList<>());
    }

    /**
     * Prints the individual results and their averages for all test sizes, difficulties and sorters which had at least a single test case run with.
     */
    public static void printAllTestResults() {
        for (Sort sorter : registeredSorters) {
            System.out.println("Average results for '" + sorter.getName() + "':");
            for (TestSize size : TestSize.values()) {
                for (TestDifficulty difficulty : TestDifficulty.values()) {
                    List<Long> results = getTestResults(sorter, size, difficulty);
                    if (!results.isEmpty()) {
                        long sum = 0;
                        for (long result : results) {
                            sum += result;
                        }
                        long average = sum / results.size();
                        System.out.println("    " + size.getName() + " " + difficulty.getName() + ": " + results.toString() + " avg: " + average + unit);
                    }
                }
            }
            System.out.println();
        }
    }

    /**
     * Runs a single test case.
     * @param sorter The sorter to test.
     * @param size The size of the test data.
     * @param difficulty The difficulty of the test data.
     * @param print Whether to print the results or not.
     * @throws FileNotFoundException If the test data file is not found.
     */
    public static void test(Sort sorter, TestSize size, TestDifficulty difficulty, boolean print) throws FileNotFoundException {
        if (print) {
            System.out.println("Testing " + sorter.getName() + " on " + size.getName() + " " + difficulty.getName() + " data:");
        }

        int[] arr = readArray(size, difficulty);

        long startTime = System.nanoTime();
        arr = sorter.sort(arr);
        long endTime = System.nanoTime();

        boolean correct = true;
        for (int i = 0; i < arr.length; i++) {
            if (arr[i] != i + 1) {
                System.out.println("Failed position: " + i);
                correct = false;
            }
        }
        if (correct) {
            long runTime = (endTime - startTime) / 1000;
            if(print) {
                System.out.println("Sorter succeeded! Time taken: " + runTime + unit);
            }
            addTestResult(sorter, size, difficulty, runTime);
        }
        if (print) {
            System.out.println();
        }
    }

    /**
     * Runs the test cases for all difficulties for a single sorter and test size.
     * @param sorter The sorter to test.
     * @param size The size of the test data.
     * @param print Whether to print the results or not.
     * @throws FileNotFoundException If a test data file is not found.
     */
    public static void testAllDifficulties(Sort sorter, TestSize size, boolean print) throws FileNotFoundException {
        for (TestDifficulty difficulty : TestDifficulty.values()) {
            test(sorter, size, difficulty, print);
        }
    }

    /**
     * Runs the test cases for all test sizes and difficulties for a selected sorter.
     * @param sorter The sorter to test.
     * @param print Whether to print the results or not.
     * @throws FileNotFoundException If a test data file is not found.
     */
    public static void runFullTest(Sort sorter, boolean print) throws FileNotFoundException {
        for (TestSize size : TestSize.values()) {
            testAllDifficulties(sorter, size, print);
        }
    }

    /**
     * Runs the test cases for all test sizes and difficulties for a selected sorter a selected amount of times.
     * Note that for some reason the later runs takes a lot less time than the first one. This might be because of the JVM caching the results, so the usage of this method is not recommended.
     * @param sorter The sorter to test.
     * @param times The amount of times to run the tests.
     * @param print Whether to print the results or not.
     * @throws FileNotFoundException If a test data file is not found.
     */
    public static void runFullTestTimes(Sort sorter, int times, boolean print) throws FileNotFoundException {
        for (int i = 0; i < times; i++) {
            runFullTest(sorter, print);
        }
    }

    private static int[] readArray(TestSize size, TestDifficulty difficulty) throws FileNotFoundException {
        String filename = size.getName() + "_" + difficulty.getName() + ".txt";
        File file = new File("src/test/samples/" + filename);
        Scanner scanner = new Scanner(file);
        int[] arr = new int[size.getSize()];
        for (int i = 0; i < size.getSize(); i++) {
            arr[i] = scanner.nextInt();
        }
        scanner.close();
        return arr;
    }

    private static class TestDescription {
        private final Sort sorter;
        private final TestSize size;
        private final TestDifficulty difficulty;

        public TestDescription(Sort sorter, TestSize size, TestDifficulty difficulty) {
            this.sorter = sorter;
            this.size = size;
            this.difficulty = difficulty;
        }

        @Override
        public int hashCode() {
            return sorter.getName().hashCode() + size.hashCode() + difficulty.hashCode();
        }

        @Override
        public boolean equals(Object obj) {
            return (obj instanceof TestDescription other) && sorter.getName().equals(other.sorter.getName()) && size.equals(other.size) && difficulty.equals(other.difficulty);
        }
    }
}
