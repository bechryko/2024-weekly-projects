package test;

/**
 * Enum for the test's difficulty.
 * Easy is an almost ordered dataset, only the 10% of the elements are moved somewhere else in the array.
 * Normal is a randomly generated dataset.
 * Reverse is a reverse ordered dataset.
 */
public enum TestDifficulty {
    EASY("ordered"),
    NORMAL("random"),
    REVERSE("reverse");

    private final String name;

    private TestDifficulty(String name) {
        this.name = name;
    }

    /**
     * @return The name of the difficulty.
     */
    public String getName() {
        return name;
    }
}
