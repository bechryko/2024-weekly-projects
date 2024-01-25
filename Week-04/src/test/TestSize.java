package test;

/**
 * Enum for the test's size.
 * Small is 100 elements.
 * Medium is 1000 elements.
 * Large is 10000 elements.
 */
public enum TestSize {
    SMALL("small", 100),
    MEDIUM("medium", 1000),
    LARGE("large", 10000);

    private final String name;
    private final int size;

    private TestSize(String name, int size) {
        this.name = name;
        this.size = size;
    }

    /**
     * @return The name of the size.
     */
    public String getName() {
        return name;
    }

    /**
     * @return The size of the test data.
     */
    public int getSize() {
        return size;
    }
}
