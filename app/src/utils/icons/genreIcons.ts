import { Genre } from "@kuman/db/enums";
import { FaPersonMilitaryRifle } from "react-icons/fa6";
import {
  GiCyberEye,
  GiMagicPortal,
  GiMechaHead,
  GiMonsterGrasp,
  GiPumpkinMask,
} from "react-icons/gi";
import { IconType } from "react-icons/lib";
import { MdSportsMartialArts } from "react-icons/md";
import {
  PiBrainDuotone,
  PiCookingPotDuotone,
  PiDetectiveDuotone,
  PiGenderFemaleDuotone,
  PiGenderMaleDuotone,
  PiHeartDuotone,
  PiMagicWandDuotone,
  PiMaskHappyDuotone,
  PiMaskSadDuotone,
  PiMountainsDuotone,
  PiMusicNotesDuotone,
  PiPlanetDuotone,
  PiSoccerBallDuotone,
  PiSwordDuotone,
  PiTreeDuotone
} from "react-icons/pi";
import { RiPoliceBadgeLine } from "react-icons/ri";
import { TbRating18Plus } from "react-icons/tb";

export const genreIcons = {
  action: PiSwordDuotone,
  aventure: PiMountainsDuotone,
  comédie: PiMaskHappyDuotone,
  drame: PiMaskSadDuotone,
  fantastique: PiMagicWandDuotone,
  horreur: GiPumpkinMask,
  mystère: PiDetectiveDuotone,
  psychologique: PiBrainDuotone,
  romance: PiHeartDuotone,
  "science-fiction": PiPlanetDuotone,
  sport: PiSoccerBallDuotone,
  thriller: GiMonsterGrasp,
  "arts martiaux": MdSportsMartialArts,
  militaire: FaPersonMilitaryRifle,
  mecha: GiMechaHead,
  musique: PiMusicNotesDuotone,
  policier: RiPoliceBadgeLine,
  ecchi: TbRating18Plus,
  yaoi: PiGenderMaleDuotone,
  yuri: PiGenderFemaleDuotone,
  isekai: GiMagicPortal,
  "tranche de vie": PiTreeDuotone,
  cyberpunk: GiCyberEye,
  cuisine: PiCookingPotDuotone,
} as const satisfies Record<Genre, IconType>;
