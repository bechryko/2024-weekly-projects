package sort;

import java.util.Arrays;

/**
 * Tree Sort algorithm implementation.
 * @see <a href="https://en.wikipedia.org/wiki/Tree_sort">Tree sort (Wikipedia)</a>
 */
public class TreeSort implements Sort {
    @Override
    public String getName() {
        return "Tree Sort";
    }

    private int arrayPosition;

    @Override
    public int[] sort(int[] arr) {
        arrayPosition = 0;
        int[] sorted = new int[arr.length];
        Node root = new Node();
        for (int i : arr) {
            root.insert(i);
        }
        root.traverse(sorted);
        return sorted;
    }

    private class Node {
        private int value;
        private boolean hasValue;
        private Node left;
        private Node right;

        public Node(int value) {
            this.value = value;
            hasValue = true;
        }

        public Node() {
            hasValue = false;
        }

        public void insert(int value) {
            if(!hasValue) {
                this.value = value;
                hasValue = true;
                return;
            }
            if (value < this.value) {
                if(left != null) {
                    left.insert(value);
                } else {
                    left = new Node(value);
                }
            } else {
                if(right != null) {
                    right.insert(value);
                } else {
                    right = new Node(value);
                }
            }
        }

        public void traverse(int[] arr) {
            if (left != null) {
                left.traverse(arr);
            }
            arr[arrayPosition++] = value;
            if (right != null) {
                right.traverse(arr);
            }
        }
    }
}
