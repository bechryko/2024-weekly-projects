#include "translation.h"

#include <string.h>

Translation translationLibrary[TRANSLATION_COUNT] = {
   {
      "VICTORY",
      {
         "Gratulalok, nyertel! A jelszavad: %s\nValtoztasd is meg erre az osszes jelszavad!",
         "Congratulations, you won! Your password: %s\nNow change all your passwords to this one!"
      }
   },
   {
      "ERROR.MISSING_CONDITIONS",
      {
         "Hianyzo feltetelek!",
         "Missing conditions!"
      }
   },
   {
      "PASSWORD_INPUT",
      {
         "Ird be a jelszavad!",
         "Enter your password!"
      }
   },
   {
      "KEYWORD.HINT",
      {
         "SEGITSEG",
         "HINT"
      }
   },
   {
      "FAIL",
      {
         "NOPE",
         "FAIL"
      }
   },
   {
      "SUCCESS",
      {
         "YEP",
         "PASS"
      }
   },
   {
      "CONDITION.MIN_8_CHAR",
      {
         "A jelszonak legalabb 8 karakterbol kell allnia!",
         "The password must be at least 8 characters long!"
      }
   },
   {
      "CONDITION.MIN_1_NUMBER",
      {
         "A jelszonak legalabb 1 szamot kell tartalmaznia!",
         "The password must contain at least 1 number!"
      }
   },
   {
      "CONDITION.MAX_8_CHAR",
      {
         "A jelszonak legfeljebb 8 karakterbol kell allnia!",
         "The password must be at most 8 characters long!"
      }
   },
   {
      "CONDITION.MIN_3_UPPERCASE",
      {
         "A jelszonak legalabb 3 nagybetut kell tartalmaznia!",
         "The password must contain at least 3 uppercase letters!"
      }
   },
   {
      "CONDITION.MIN_3_SPECIAL_CHAR",
      {
         "A jelszonak legalabb 3 specialis karaktert kell tartalmaznia!",
         "The password must contain at least 3 special characters!"
      }
   },
   {
      "CONDITION.HINT.MIN_3_SPECIAL_CHAR",
      {
         "A felhasznalhato specialis karakterek:",
         "The usable special characters:"
      }
   }
};

int selectedLanguage = -1;

void setLanguage(int language) {
   selectedLanguage = language;
}

char *translate(char *key) {
   if(selectedLanguage == -1) {
      return key;
   }

   for(int i = 0; i < TRANSLATION_COUNT; i++) {
      if(strcmp(translationLibrary[i].key, key) == 0) {
         return translationLibrary[i].translations[selectedLanguage];
      }
   }
   return key;
}
