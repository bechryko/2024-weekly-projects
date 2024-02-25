#include <stdio.h>

#include "conditions.h"
#include "translation.h"

#ifndef MAX_LEVEL_COUNT
#define MAX_LEVEL_COUNT 0
#endif

void win(char password[]) {
   printf(NEW_LINE);
   printf(translate("VICTORY"), password);
   printf(NEW_LINE);
}

int main() {
   setLanguage(0);

   if(MAX_LEVEL_COUNT < 1) {
      fprintf(stderr, translate("ERROR.MISSING_CONDITIONS"));
      fprintf(stderr, NEW_LINE);
      return 1;
   }

   extern Condition conditions[MAX_LEVEL_COUNT];
   char password[128];
   int level = 1, levelAttempt = 0;

   while(1) {
      printf(translate("PASSWORD_INPUT"));
      printf(NEW_LINE);
      scanf("%127s", password);

      int allConditionsPassed = 1;
      for(int i = 1; i <= level; i++) {
         int conditionResult = conditions[i - 1].function(password);
         allConditionsPassed &= conditionResult;
         if(conditionResult) {
            printf(translate("SUCCESS"));
         } else {
            printf(translate("FAIL"));
         }
         printf(NEW_LINE);
      }

      if(allConditionsPassed) {
         do {
            if(level == MAX_LEVEL_COUNT) {
               goto win;
            }
         } while(conditions[level++].function(password) && (printf(translate("SUCCESS")), printf(NEW_LINE), 1));
         printf(translate("FAIL"));
         printf(NEW_LINE);

         levelAttempt = 0;
      } else {
         levelAttempt++;

         if(conditions[level - 1].hint && levelAttempt >= conditions[level - 1].hintAttemptThreshhold) {
            printf(NEW_LINE);
            printf(translate("KEYWORD.HINT"));
            printf(": ");
            conditions[level - 1].hint();
         }
      }
      printf(NEW_LINE);
   }

win:
   win(password);

   return 0;
}
