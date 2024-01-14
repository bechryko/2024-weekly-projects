export type GameStageKey =  'MILIS_PLAY' | 'MILIS_RAGE';

export interface GameStage {
   key?: GameStageKey;
   turn: number;
}
