#ifndef TRANSLATION_H
#define TRANSLATION_H

#define LANGUAGE_COUNT 2

typedef struct {
   char *key;
   char translations[LANGUAGE_COUNT][100];
} Translation;

#define TRANSLATION_COUNT 12

Translation translationLibrary[TRANSLATION_COUNT];

#define NEW_LINE "\n"

void setLanguage(int language);

char *translate(char *key);

#endif
