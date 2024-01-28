# Sorting Algorithms Comparison in Java

I decided to make a small project to compare the runtime of different sorting algorithms in Java. I wanted to make some rules to easily unify the tests and the algorithms:
- Their classes all have to implement the Sort interface, which have a sort method that takes an array of integers and returns the sorted array.
- The algorithms have to be pure, which means that they can't modify the original array, they have to return a new one.
- The algorithms have to be stable, which means that they have to preserve the order of the elements with the same value. (Though this doesn't make sense because of the test cases, I wanted to only use stable algorithms.)
- The algorithms have to sort correctly. (So that I don't have to waste time with some meme algorithms like Dictator Sort.)
- The algorithms never use swap method, so the overall runtime is better.

## Algorithms

- Bubble Sort
- Quicksort (Lomuto and Hoare partition schemes)
- Insertion Sort
- Tree Sort
- Gnome Sort
- Merge Sort
- Cocktail Shaker Sort (also known as Bidirectional Bubble Sort)
- Shellsort (using Ciura's gap sequence)

## Test cases

I made two classifications for the test cases: by size and by randomness. The three test sizes were 100, 1000 and 10 000 numbers (all from 1 to the upper limit). The three randomnesses was: almost sorted (only 10% of the numbers were taken out to another place in the sequence), randomly generated and reverse order. I had one test case for each, making 9 test cases in total.

## Test results

|      Tests (µs)      | small ordered | small random | small reverse | medium ordered | medium random | medium reverse | large ordered | large random | large reverse |
|:--------------------:|:-------------:|:------------:|:-------------:|:--------------:|:-------------:|:--------------:|:-------------:|:------------:|:-------------:|
|      Bubble Sort     |      217      |      326     |      366      |      2464      |      3216     |      1540      |     12 300    |    138 206   |     96 516    |
|  Quicksort (Lomuto)  |       85      |      40      |       31      |      1586      |     **69**    |      2791      |     55 364    |    **679**   |     45 174    |
|   Quicksort (Hoare)  |       51      |      44      |       71      |       937      |      120      |      1627      |     16 339    |      772     |     16 263    |
|    Insertion Sort    |       51      |      102     |      209      |      1606      |      1828     |      1467      |      1501     |    17 269    |     34 721    |
|       Tree Sort      |      652      |      44      |       59      |      1817      |      142      |      2635      |    107 636    |     1536     |    125 176    |
|      Gnome Sort      |       65      |      168     |      348      |      1876      |      1859     |      1427      |      5558     |    72 339    |    140 504    |
|      Merge Sort      |       83      |      80      |       70      |       390      |      153      |     **107**    |    **1354**   |     1877     |      1054     |
| Cocktail Shaker Sort |      117      |      160     |      208      |      2661      |      1611     |      1526      |     35 769    |    86 970    |     54 539    |
|     **Shellsort**    |     **27**    |    **32**    |     **23**    |     **268**    |      397      |       316      |      1484     |     1392     |    **351**    |

These values are rough averages of 3-4 runs for each test case.

The two most stable algorithms in terms of runtime were Merge Sort and Gnome Sort. The test case with the most runtime fluctuations was the large ordered case.

Interestingly the Shellsort's large random case was in most of the cases around 1300µs, but in a small amount of cases above 4800µs. There was no in-between, so I don't know the reason of the fluctuation, and I hope it didn't affect the results in other cases.

For a conclusion, I can say that from the inspected algorithms, the Shellsort is the fastest, but the Merge Sort and the Quicksort which uses the Hoare partition scheme are also good choices. The Bubble Sort is the slowest one, but it is the simplest in terms of implementation. I would recommend using its bidirectional variant, the Cocktail Shaker Sort instead, because its much better performance.
