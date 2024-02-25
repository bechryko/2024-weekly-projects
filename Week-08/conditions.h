#ifndef CONDITIONS_H
#define CONDITIONS_H

typedef int (*ConditionFunction)(char[]);
typedef void (*HintFunction)();

#define MAX_LEVEL_COUNT 5

typedef struct {
   ConditionFunction function;
   HintFunction hint;
   int hintAttemptThreshhold;
} Condition;

Condition conditions[MAX_LEVEL_COUNT];

#endif
