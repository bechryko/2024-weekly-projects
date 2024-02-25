#ifndef TRANSLATION_H
#define TRANSLATION_H

typedef struct {
   char *key;
   char translations[2][100];
} Translation;

#define TRANSLATION_COUNT 12

Translation translationLibrary[TRANSLATION_COUNT];

#define NEW_LINE "\n"

void setLanguage(int language);

char *translate(char *key);

#endif
