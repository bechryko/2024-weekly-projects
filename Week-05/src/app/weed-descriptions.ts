import { Evidence } from "./models/evidence";
import { WeedType } from "./models/weed-type";

export interface WeedDescription {
   evidences: Evidence[];
   description: string;
   special: string;
   spreadChancePerSec: number;
   spreadCooldownInSecs: number;
}

export const WeedDescriptions: Record<WeedType, WeedDescription> = {
   [WeedType.RUMBLER]: {
      evidences: [ Evidence.ABSORPTION, Evidence.GROWTH ],
      description: "The Rumbler is a fearsome weed that rumbles beneath your garden. It is known for its ability to spread quickly, and sometimes even make small earthquakes in your neighborhood.",
      special: "spreads much faster than other weeds",
      spreadChancePerSec: 0.1,
      spreadCooldownInSecs: 5
   },
   [WeedType.VORACIOUS_THORNS]: {
      evidences: [ Evidence.ABSORPTION, Evidence.DISENCHANTMENT ],
      description: "The Voracious Thorns have two very deadly property: it is voracious, and it has thorns. It may not only hurt you if you try to remove it from the ground by hand, but it can hurt any plant that it touches.",
      special: "has a chance to instantly kill a freshly planted plant in the field it is present on",
      spreadChancePerSec: 0.05,
      spreadCooldownInSecs: 5
   },
   [WeedType.MIOSN_EATER]: {
      evidences: [ Evidence.GROWTH, Evidence.DISENCHANTMENT ],
      description: "The Miosn Eater is not a purposefully malicious weed, it only wants to absorb miosn to grow even more. It spreads slowly but surely, tasting every inch of miosn it eats under your garden.",
      special: "absorbs some miosn from the fields it is present on; have to regain energy for longer after spreading",
      spreadChancePerSec: 0.045,
      spreadCooldownInSecs: 15
   },
   [WeedType.FLOODVINE]: {
      evidences: [ Evidence.ABSORPTION, Evidence.DISENCHANTMENT ],
      description: "The Floodvine is a very dangerous weed. It can flood your garden with the water it absorbed from it, drowning plants which are even not near it.",
      special: "occasionally can flood a field with the absorbed water",
      spreadChancePerSec: 0.055,
      spreadCooldownInSecs: 5
   },
};
