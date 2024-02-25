#include "conditions.h"

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "translation.h"

int stringLength(char string[]);
int isSpecialCharacter(char c);

char specialCharacters[];

void printConditionTranslation(char *conditionKey) {
   char *fullConditionKey = (char*) malloc(1 + stringLength("CONDITION.") + stringLength(conditionKey));
   strcpy(fullConditionKey, "CONDITION.");
   strcat(fullConditionKey, conditionKey);
   printf(translate(fullConditionKey));
   printf(" ");
   free(fullConditionKey);
}

int level1Condition(char password[]) {
   printConditionTranslation("MIN_8_CHAR");
   return stringLength(password) >= 8;
}

int level2Condition(char password[]) {
   printConditionTranslation("MIN_1_NUMBER");
   for(int i = 0; password[i]; i++) {
      if(password[i] >= '0' && password[i] <= '9') {
         return 1;
      }
   }
   return 0;
}

int level3Condition(char password[]) {
   printConditionTranslation("MAX_8_CHAR");
   return stringLength(password) <= 8;
}

int level4Condition(char password[]) {
   printConditionTranslation("MIN_3_UPPERCASE");
   int upperCaseCount = 0;
   for(int i = 0; password[i]; i++) {
      if(password[i] >= 'A' && password[i] <= 'Z') {
         upperCaseCount++;
      }
   }
   return upperCaseCount >= 3;
}

int level5Condition(char password[]) {
   printConditionTranslation("MIN_3_SPECIAL_CHAR");
   int specialCharacterCount = 0;
   for(int i = 0; password[i]; i++) {
      if(isSpecialCharacter(password[i])) {
         specialCharacterCount++;
      }
   }
   return specialCharacterCount >= 3;
}

void level5ConditionHint() {
   printConditionTranslation("HINT.MIN_3_SPECIAL_CHAR");
   for(int i = 0; specialCharacters[i]; i++) {
      printf(" %c", specialCharacters[i]);
   }
   printf("\n");
}

Condition conditions[] = {
   {
      level1Condition,
      NULL,
      0
   },
   {
      level2Condition,
      NULL,
      0
   },
   {
      level3Condition,
      NULL,
      0
   },
   {
      level4Condition,
      NULL,
      0
   },
   {
      level5Condition,
      level5ConditionHint,
      3
   }
};

// Helper function implementations:

int stringLength(char string[]) {
   int length = -1;
   while(string[++length]);
   return length;
}

char specialCharacters[] = ";>`~{";
int isSpecialCharacter(char c) {
   for(int i = 0; specialCharacters[i]; i++) {
      if(c == specialCharacters[i]) {
         return 1;
      }
   }
   return 0;
}
