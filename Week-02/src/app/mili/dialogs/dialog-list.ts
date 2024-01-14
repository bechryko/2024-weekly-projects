import { GameData } from "../../game/game-data";

export type DialogKey = '' | 'GREETING_NORMAL' | 'GAME_2048' | 'GAME_EXCUSE' | 'GAME_EXCUSE_SORRY' | 'PLAY1' | 'PLAY2' | 'PLAY3' | 'PLAY_END' | 'PLAY_LATER1' | 'PLAY_LATER2' | 'NO_PLAY' | 'RETURN' | 'RAGE_AGE1' | 'RAGE_AGE2' | 'RAGE_AGE3' | 'RAGE_AGE4' | 'THREATEN' | 'THREATEN_CHEER' | 'RAGE_WATCH1' | 'RAGE_WATCH2' | 'RAGE_WATCH3' | 'RAGE_WATCH4' | 'RAGE_WATCH5'; // TODO: remove ''

export interface DialogChoice {
   text?: string;
   nextDialogKey?: DialogKey;
}

export interface Dialog {
   text: string;
   choices?: DialogChoice[];
   entry?: (gameData: GameData) => boolean;
}

export const dialogList: Record<DialogKey, Dialog> = {
   GREETING_NORMAL: {
      text: "Szia! Én Milike vagyok! Nagyon rég láttam már bárkit is errefelé... Te hogy kerülsz ide? Ó! Mit játszol?",
      choices: [
         {
            text: "2048-at. Ismered?",
            nextDialogKey: 'GAME_2048'
         },
         {
            text: "Nem játszok, tanulok.",
            nextDialogKey: 'GAME_EXCUSE'
         }, {
            text: "Nem játszok, dolgozok.",
            nextDialogKey: 'GAME_EXCUSE'
         }
      ],
      entry: ({ movesMade }) => {
         return movesMade > 5 && Math.random() < .25;
      }
   },
   GAME_2048: {
      text: "2048? Egy szám a neve a játéknak? Na mindegy, nem a neve a fontos. Kipróbálhatom?",
      choices: [
         {
            text: "Persze!",
            nextDialogKey: 'PLAY1'
         },
         {
            text: "Később nem jó? Most nagyon benne vagyok a játékban!",
            nextDialogKey: 'PLAY_LATER1'
         },
         {
            text: "Nem.",
            nextDialogKey: 'NO_PLAY'
         }
      ]
   },
   GAME_EXCUSE: {
      text: "DEHOGYNEM JÁTSZOL! LÁTOM HOGY JÁTSZOL! NEKEM NEM HAZUDHATSZ! TÖBBSZÖR VERTEK MÁR ÁT MINT AHÁNY LÉLEK ÉLT EBBEN A SZÁNALMAS KIS UNIVERZUMBAN, ÍGY MEGFOGADTAM, HOGY TÖBBÉ NEM DŐLÖK BE ILYEN TRÜKKÖKNEK!",
      choices: [
         {
            nextDialogKey: 'GAME_EXCUSE_SORRY'
         }
      ]
   },
   GAME_EXCUSE_SORRY: {
      text: "Juj, bocsika! Kicsit túlreagáltam, felejtsd el amit az előbb hallottál. De mi ez a játék, amit játszol? Kipróbálhatom?",
      choices: []
   },
   PLAY1: {
      text: "Juj de izgi! Nézzük, hogy működik!",
      choices: [
         {
            nextDialogKey: 'PLAY2'
         }
      ]
   },
   PLAY2: {
      text: "Hát ez nagyon mókás!",
      choices: [
         {
            nextDialogKey: 'PLAY3'
         }
      ]
   },
   PLAY3: {
      text: "Hihihi!",
      choices: [
         {
            nextDialogKey: 'PLAY_END'
         }
      ]
   },
   PLAY_END: {
      text: "Jaj, azt hiszem valamit elrontottam..."
   },
   PLAY_LATER1: {
      text: "MÉGIS HOGY KÉPZELED HOGY ÉN CSAK ITT ÜLÖK ÉS VÁROM HOGY VÉGRE BEFEJEZD AZT A...",
      choices: [
         {
            nextDialogKey: 'PLAY_LATER2'
         }
      ]
   },
   PLAY_LATER2: {
      text: "Jujci, úgy értettem, hogy nem akarok várniiiii! Légysziiiiii, hadd játsszak mooooooost!",
      choices: [
         {
            text: "Jó, legyen...",
            nextDialogKey: 'PLAY1'
         },
         {
            text: "Nem.",
            nextDialogKey: 'NO_PLAY'
         }
      ]
   },
   NO_PLAY: {
      text: "Jaj, de undok vagy! Akkor megyek, keresek valakit, akivel lehet játszani!"
   },
   RETURN: {
      text: "Ajjjjjjj, itt brutál uncsi mindeeeen! Nem játszhatnék mégis? Naaaa, légysziiiii, ígérem, jól fogunk szórakozni!",
      choices: [
         {
            text: "Egy próbát talán megér...",
            nextDialogKey: 'PLAY1'
         },
         {
            text: "Ez a játék felnőtteknek való, nem neked.",
            nextDialogKey: 'RAGE_AGE1'
         },
         {
            text: "Szerintem jobb, ha csak nézed, ahogy játszok. Már nagyon belejöttem!",
            nextDialogKey: 'RAGE_WATCH1'
         }
      ],
      entry: () => Math.random() < .05
   },
   RAGE_AGE1: {
      text: "AZT HISZED, NEM VAGYOK FELNŐTT? AZT HISZED, NEM LÁTTAM SOKKAL, DE SOKKAL TÖBBET, MINT TE, ÉS AZ EGÉSZ RÜHES EMBERI FAJ EGYÜTT? AZT HISZED, NEM LÁTTAM A BILLEDENKUSZ BIRODALOM BUKÁSÁT?",
      choices: [
         {
            nextDialogKey: 'RAGE_AGE2'
         }
      ]
   },
   RAGE_AGE2: {
      text: "AZT HISZED, NEM ÉLTEM MEG TÖBB POKLOT ÉS SZENVEDÉST, MINT BÁRMI ÉLŐ AZ UNIVERZUMOK RENDSZERÉBEN?",
      choices: [
         {
            nextDialogKey: 'RAGE_AGE3'
         }
      ]
   },
   RAGE_AGE3: {
      text: "Szerintem te vagy itt az, aki nem elég felnőtt ahhoz, hogy tudja, mi az igazi szenvedés.",
      choices: [
         {
            nextDialogKey: 'RAGE_AGE4'
         }
      ]
   },
   RAGE_AGE4: {
      text: "De én most megmutatom neked.",
      choices: [
         {
            nextDialogKey: 'THREATEN'
         }
      ]
   },
   THREATEN: {
      text: "Szenvedni fogsz!",
      choices: [
         {
            nextDialogKey: 'THREATEN_CHEER'
         }
      ]
   },
   THREATEN_CHEER: {
      text: "(Juuuuuuuuj, de rég óta vártam már, hogy ilyen hangsúllyal kimondhassam ezt!)"
   },
   RAGE_WATCH1: {
      text: "Te... azt akarod, hogy én... csak nézzem...?",
      choices: [
         {
            nextDialogKey: 'RAGE_WATCH2'
         }
      ]
   },
   RAGE_WATCH2: {
      text: "AZT AKAROD, HOGY ÉN CSAK NÉZZEM, AHOGY EGY KIS KÉTKEZŰ FÖLDI FÉREG JÁTSZIK EGY SZÁMOKKAL TELI TÁBLÁVAL?",
      choices: [
         {
            nextDialogKey: 'RAGE_WATCH3'
         }
      ]
   },
   RAGE_WATCH3: {
      text: "ÉS HOGY TE MÁR ANNYIRA BELEJÖTTÉL? SZÓVAL AZT MERÉSZELED HINNI, HOGY JOBB LEHETSZ BÁRMILYEN JÁTÉKBAN, MINT ÉN?",
      choices: [
         {
            text: "Nem, csak azt akartam mondani, hogy...",
            nextDialogKey: 'RAGE_WATCH4'
         },
         {
            text: "Igen.",
            nextDialogKey: 'RAGE_WATCH4'
         }
      ]
   },
   RAGE_WATCH4: {
      text: "ÉN, AKI HÁROMSZOROS VILÁGBAJNOK VAGYOK AZ OLYAN SENKIK ÉLETÉNEK MEGKÍMÉLÉSÉBEN, MINT TE???",
      choices: [
         {
            nextDialogKey: 'RAGE_WATCH5'
         }
      ]
   },
   RAGE_WATCH5: {
      text: "Semmi baj. Látom, te nem vagy érdemes arra, hogy megkíméljelek.",
      choices: [
         {
            nextDialogKey: 'THREATEN'
         }
      ]
   },
   ['']: {
      text: ""
   }
};

dialogList['GAME_EXCUSE_SORRY'].choices = [...dialogList['GAME_2048'].choices!];
