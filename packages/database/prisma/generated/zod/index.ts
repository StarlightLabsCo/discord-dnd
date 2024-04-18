import { z } from 'zod';
import type { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const UserScalarFieldEnumSchema = z.enum(['id','username','discriminator','global_name','avatar','avatar_decoration','locale','createdAt','updatedAt']);

export const WorldScalarFieldEnumSchema = z.enum(['id','name','description','imageUrl','createdAt','updatedAt']);

export const CampaignScalarFieldEnumSchema = z.enum(['id','worldId','name','description','imageUrl','createdAt','updatedAt']);

export const ActScalarFieldEnumSchema = z.enum(['id','campaignId','name','description','imageUrl','createdAt','updatedAt']);

export const AdventureScalarFieldEnumSchema = z.enum(['id','actId','name','description','imageUrl','createdAt','updatedAt']);

export const BeatScalarFieldEnumSchema = z.enum(['id','adventureId','type','name','description','imageUrl','createdAt','updatedAt']);

export const LocationScalarFieldEnumSchema = z.enum(['id','worldId','name','description','imageUrl','parentLocationId','createdAt','updatedAt']);

export const RaceScalarFieldEnumSchema = z.enum(['id','worldId','name','description','imageUrl','strengthModifier','dexterityModifier','constitutionModifier','intelligenceModifier','wisdomModifier','charismaModifier','size','speed','createdAt','updatedAt']);

export const SubraceScalarFieldEnumSchema = z.enum(['id','parentRaceId','name','description','imageUrl','strengthModifier','dexterityModifier','constitutionModifier','intelligenceModifier','wisdomModifier','charismaModifier','size','speed','createdAt','updatedAt']);

export const RacialTraitScalarFieldEnumSchema = z.enum(['id','raceId','subraceId','name','description','imageUrl','createdAt','updatedAt']);

export const LanguageScalarFieldEnumSchema = z.enum(['id','worldId','name','description','imageUrl','createdAt','updatedAt']);

export const ClassScalarFieldEnumSchema = z.enum(['id','worldId','name','description','imageUrl','createdAt','updatedAt']);

export const ClassFeatureScalarFieldEnumSchema = z.enum(['id','classId','name','description','imageUrl','createdAt','updatedAt']);

export const BackgroundScalarFieldEnumSchema = z.enum(['id','worldId','name','description','imageUrl','personalityTraits','ideals','bonds','flaws','createdAt','updatedAt']);

export const ProficiencyScalarFieldEnumSchema = z.enum(['id','type','name','description','imageUrl','createdAt','updatedAt']);

export const FeatScalarFieldEnumSchema = z.enum(['id','worldId','prerequisites','name','description','imageUrl','createdAt','updatedAt']);

export const CharacterScalarFieldEnumSchema = z.enum(['id','campaignId','raceId','subraceId','backgroundId','name','description','imageUrl','pronouns','age','voice','alignment','appearance','backstory','personalityTraits','ideals','bonds','flaws','currentLocationId','level','experience','proficiencyBonus','strength','dexterity','constitution','intelligence','wisdom','charisma','hitDieCount','hitDieType','size','speed','maxLevel1SpellSlots','maxLevel2SpellSlots','maxLevel3SpellSlots','maxLevel4SpellSlots','maxLevel5SpellSlots','maxLevel6SpellSlots','maxLevel7SpellSlots','maxLevel8SpellSlots','maxLevel9SpellSlots','createdAt','updatedAt']);

export const ItemScalarFieldEnumSchema = z.enum(['id','worldId','name','description','imageUrl','weight','value','rarity','damageDice','damageType','damageBonus','properties','createdAt','updatedAt']);

export const SpellScalarFieldEnumSchema = z.enum(['id','worldId','name','description','imageUrl','level','school','castingTime','range','components','duration','ritual','createdAt','updatedAt']);

export const CampaignInstanceScalarFieldEnumSchema = z.enum(['id','campaignId','createdAt','updatedAt']);

export const CharacterInstanceScalarFieldEnumSchema = z.enum(['id','userId','characterId','campaignInstanceId','raceId','subraceId','backgroundId','name','description','imageUrl','pronouns','age','voice','alignment','appearance','backstory','personality','ideals','bonds','flaws','currentLocationId','level','experience','proficiencyBonus','strength','dexterity','constitution','intelligence','wisdom','charisma','hitDieCount','hitDieType','healthPoints','size','speed','availableLevel1SpellSlots','availableLevel2SpellSlots','availableLevel3SpellSlots','availableLevel4SpellSlots','availableLevel5SpellSlots','availableLevel6SpellSlots','availableLevel7SpellSlots','availableLevel8SpellSlots','availableLevel9SpellSlots','maxLevel1SpellSlots','maxLevel2SpellSlots','maxLevel3SpellSlots','maxLevel4SpellSlots','maxLevel5SpellSlots','maxLevel6SpellSlots','maxLevel7SpellSlots','maxLevel8SpellSlots','maxLevel9SpellSlots','createdAt','updatedAt']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const NullsOrderSchema = z.enum(['first','last']);

export const DiceSchema = z.enum(['D4','D6','D8','D10','D12','D20']);

export type DiceType = `${z.infer<typeof DiceSchema>}`

export const BeatTypeSchema = z.enum(['ENCOUNTER','ROLEPLAY','LOOT','QUEST','SHOP','REST']);

export type BeatTypeType = `${z.infer<typeof BeatTypeSchema>}`

export const ProficiencyTypeSchema = z.enum(['WEAPON','ARMOR','TOOL','SKILL']);

export type ProficiencyTypeType = `${z.infer<typeof ProficiencyTypeSchema>}`

export const CharacterSizeSchema = z.enum(['SMALL','MEDIUM']);

export type CharacterSizeType = `${z.infer<typeof CharacterSizeSchema>}`

export const CharacterAlignmentSchema = z.enum(['LAWFUL_GOOD','NEUTRAL_GOOD','CHAOTIC_GOOD','LAWFUL_NEUTRAL','TRUE_NEUTRAL','CHAOTIC_NEUTRAL','LAWFUL_EVIL','NEUTRAL_EVIL','CHAOTIC_EVIL']);

export type CharacterAlignmentType = `${z.infer<typeof CharacterAlignmentSchema>}`

export const ItemRaritySchema = z.enum(['COMMON','UNCOMMON','RARE','VERY_RARE','LEGENDARY']);

export type ItemRarityType = `${z.infer<typeof ItemRaritySchema>}`

export const DamageTypeSchema = z.enum(['BLUDGEONING','PIERCING','SLASHING','FIRE','COLD','LIGHTNING','THUNDER','FORCE','NECROTIC','RADIANT','POISON','PSYCHIC','ACID']);

export type DamageTypeType = `${z.infer<typeof DamageTypeSchema>}`

export const SpellSchoolSchema = z.enum(['ABJURATION','CONJURATION','DIVINATION','ENCHANTMENT','EVOCATION','ILLUSION','NECROMANCY','TRANSMUTATION']);

export type SpellSchoolType = `${z.infer<typeof SpellSchoolSchema>}`

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  id: z.string(),
  username: z.string(),
  discriminator: z.string(),
  global_name: z.string().nullable(),
  avatar: z.string().nullable(),
  avatar_decoration: z.string().nullable(),
  locale: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// WORLD SCHEMA
/////////////////////////////////////////

export const WorldSchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  description: z.string(),
  imageUrl: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type World = z.infer<typeof WorldSchema>

/////////////////////////////////////////
// CAMPAIGN SCHEMA
/////////////////////////////////////////

export const CampaignSchema = z.object({
  id: z.string().cuid(),
  worldId: z.string(),
  name: z.string(),
  description: z.string(),
  imageUrl: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Campaign = z.infer<typeof CampaignSchema>

/////////////////////////////////////////
// ACT SCHEMA
/////////////////////////////////////////

export const ActSchema = z.object({
  id: z.string().cuid(),
  campaignId: z.string(),
  name: z.string(),
  description: z.string(),
  imageUrl: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Act = z.infer<typeof ActSchema>

/////////////////////////////////////////
// ADVENTURE SCHEMA
/////////////////////////////////////////

export const AdventureSchema = z.object({
  id: z.string().cuid(),
  actId: z.string(),
  name: z.string(),
  description: z.string(),
  imageUrl: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Adventure = z.infer<typeof AdventureSchema>

/////////////////////////////////////////
// BEAT SCHEMA
/////////////////////////////////////////

export const BeatSchema = z.object({
  type: BeatTypeSchema,
  id: z.string().cuid(),
  adventureId: z.string(),
  name: z.string(),
  description: z.string(),
  imageUrl: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Beat = z.infer<typeof BeatSchema>

/////////////////////////////////////////
// LOCATION SCHEMA
/////////////////////////////////////////

export const LocationSchema = z.object({
  id: z.string().cuid(),
  worldId: z.string(),
  name: z.string(),
  description: z.string(),
  imageUrl: z.string(),
  parentLocationId: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Location = z.infer<typeof LocationSchema>

/////////////////////////////////////////
// RACE SCHEMA
/////////////////////////////////////////

export const RaceSchema = z.object({
  size: CharacterSizeSchema,
  id: z.string().cuid(),
  worldId: z.string(),
  name: z.string(),
  description: z.string(),
  imageUrl: z.string(),
  strengthModifier: z.number().int(),
  dexterityModifier: z.number().int(),
  constitutionModifier: z.number().int(),
  intelligenceModifier: z.number().int(),
  wisdomModifier: z.number().int(),
  charismaModifier: z.number().int(),
  speed: z.number().int(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Race = z.infer<typeof RaceSchema>

/////////////////////////////////////////
// SUBRACE SCHEMA
/////////////////////////////////////////

export const SubraceSchema = z.object({
  size: CharacterSizeSchema,
  id: z.string().cuid(),
  parentRaceId: z.string(),
  name: z.string(),
  description: z.string(),
  imageUrl: z.string(),
  strengthModifier: z.number().int(),
  dexterityModifier: z.number().int(),
  constitutionModifier: z.number().int(),
  intelligenceModifier: z.number().int(),
  wisdomModifier: z.number().int(),
  charismaModifier: z.number().int(),
  speed: z.number().int(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Subrace = z.infer<typeof SubraceSchema>

/////////////////////////////////////////
// RACIAL TRAIT SCHEMA
/////////////////////////////////////////

export const RacialTraitSchema = z.object({
  id: z.string().cuid(),
  raceId: z.string().nullable(),
  subraceId: z.string().nullable(),
  name: z.string(),
  description: z.string(),
  imageUrl: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type RacialTrait = z.infer<typeof RacialTraitSchema>

/////////////////////////////////////////
// LANGUAGE SCHEMA
/////////////////////////////////////////

export const LanguageSchema = z.object({
  id: z.string().cuid(),
  worldId: z.string(),
  name: z.string(),
  description: z.string(),
  imageUrl: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Language = z.infer<typeof LanguageSchema>

/////////////////////////////////////////
// CLASS SCHEMA
/////////////////////////////////////////

export const ClassSchema = z.object({
  id: z.string().cuid(),
  worldId: z.string(),
  name: z.string(),
  description: z.string(),
  imageUrl: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Class = z.infer<typeof ClassSchema>

/////////////////////////////////////////
// CLASS FEATURE SCHEMA
/////////////////////////////////////////

export const ClassFeatureSchema = z.object({
  id: z.string().cuid(),
  classId: z.string(),
  name: z.string(),
  description: z.string(),
  imageUrl: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type ClassFeature = z.infer<typeof ClassFeatureSchema>

/////////////////////////////////////////
// BACKGROUND SCHEMA
/////////////////////////////////////////

export const BackgroundSchema = z.object({
  id: z.string().cuid(),
  worldId: z.string(),
  name: z.string(),
  description: z.string(),
  imageUrl: z.string(),
  personalityTraits: z.string().array(),
  ideals: z.string().array(),
  bonds: z.string().array(),
  flaws: z.string().array(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Background = z.infer<typeof BackgroundSchema>

/////////////////////////////////////////
// PROFICIENCY SCHEMA
/////////////////////////////////////////

export const ProficiencySchema = z.object({
  type: ProficiencyTypeSchema,
  id: z.string().cuid(),
  name: z.string(),
  description: z.string(),
  imageUrl: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Proficiency = z.infer<typeof ProficiencySchema>

/////////////////////////////////////////
// FEAT SCHEMA
/////////////////////////////////////////

export const FeatSchema = z.object({
  id: z.string().cuid(),
  worldId: z.string(),
  prerequisites: z.string(),
  name: z.string(),
  description: z.string(),
  imageUrl: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Feat = z.infer<typeof FeatSchema>

/////////////////////////////////////////
// CHARACTER SCHEMA
/////////////////////////////////////////

export const CharacterSchema = z.object({
  alignment: CharacterAlignmentSchema,
  hitDieType: DiceSchema,
  size: CharacterSizeSchema,
  id: z.string().cuid(),
  campaignId: z.string(),
  raceId: z.string(),
  subraceId: z.string().nullable(),
  backgroundId: z.string(),
  name: z.string(),
  description: z.string(),
  imageUrl: z.string(),
  pronouns: z.string(),
  age: z.number().int(),
  voice: z.string(),
  appearance: z.string(),
  backstory: z.string(),
  personalityTraits: z.string().array(),
  ideals: z.string().array(),
  bonds: z.string().array(),
  flaws: z.string().array(),
  currentLocationId: z.string().nullable(),
  level: z.number().int(),
  experience: z.number().int(),
  proficiencyBonus: z.number().int(),
  strength: z.number().int(),
  dexterity: z.number().int(),
  constitution: z.number().int(),
  intelligence: z.number().int(),
  wisdom: z.number().int(),
  charisma: z.number().int(),
  hitDieCount: z.number().int(),
  speed: z.number().int(),
  maxLevel1SpellSlots: z.number().int(),
  maxLevel2SpellSlots: z.number().int(),
  maxLevel3SpellSlots: z.number().int(),
  maxLevel4SpellSlots: z.number().int(),
  maxLevel5SpellSlots: z.number().int(),
  maxLevel6SpellSlots: z.number().int(),
  maxLevel7SpellSlots: z.number().int(),
  maxLevel8SpellSlots: z.number().int(),
  maxLevel9SpellSlots: z.number().int(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Character = z.infer<typeof CharacterSchema>

/////////////////////////////////////////
// ITEM SCHEMA
/////////////////////////////////////////

export const ItemSchema = z.object({
  rarity: ItemRaritySchema,
  damageDice: DiceSchema.nullable(),
  damageType: DamageTypeSchema.nullable(),
  id: z.string().cuid(),
  worldId: z.string(),
  name: z.string(),
  description: z.string(),
  imageUrl: z.string(),
  weight: z.number().int(),
  value: z.number().int(),
  damageBonus: z.number().int().nullable(),
  properties: z.string().array(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Item = z.infer<typeof ItemSchema>

/////////////////////////////////////////
// SPELL SCHEMA
/////////////////////////////////////////

export const SpellSchema = z.object({
  school: SpellSchoolSchema,
  id: z.string().cuid(),
  worldId: z.string(),
  name: z.string(),
  description: z.string(),
  imageUrl: z.string(),
  level: z.number().int(),
  castingTime: z.string(),
  range: z.number().int(),
  components: z.string().array(),
  duration: z.string(),
  ritual: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Spell = z.infer<typeof SpellSchema>

/////////////////////////////////////////
// CAMPAIGN INSTANCE SCHEMA
/////////////////////////////////////////

export const CampaignInstanceSchema = z.object({
  id: z.string().cuid(),
  campaignId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type CampaignInstance = z.infer<typeof CampaignInstanceSchema>

/////////////////////////////////////////
// CHARACTER INSTANCE SCHEMA
/////////////////////////////////////////

export const CharacterInstanceSchema = z.object({
  hitDieType: DiceSchema,
  size: CharacterSizeSchema,
  id: z.string().cuid(),
  userId: z.string().nullable(),
  characterId: z.string().nullable(),
  campaignInstanceId: z.string(),
  raceId: z.string(),
  subraceId: z.string().nullable(),
  backgroundId: z.string(),
  name: z.string(),
  description: z.string(),
  imageUrl: z.string(),
  pronouns: z.string(),
  age: z.number().int(),
  voice: z.string(),
  alignment: z.string(),
  appearance: z.string(),
  backstory: z.string(),
  personality: z.string().array(),
  ideals: z.string().array(),
  bonds: z.string().array(),
  flaws: z.string().array(),
  currentLocationId: z.string().nullable(),
  level: z.number().int(),
  experience: z.number().int(),
  proficiencyBonus: z.number().int(),
  strength: z.number().int(),
  dexterity: z.number().int(),
  constitution: z.number().int(),
  intelligence: z.number().int(),
  wisdom: z.number().int(),
  charisma: z.number().int(),
  hitDieCount: z.number().int(),
  healthPoints: z.number().int(),
  speed: z.number().int(),
  availableLevel1SpellSlots: z.number().int(),
  availableLevel2SpellSlots: z.number().int(),
  availableLevel3SpellSlots: z.number().int(),
  availableLevel4SpellSlots: z.number().int(),
  availableLevel5SpellSlots: z.number().int(),
  availableLevel6SpellSlots: z.number().int(),
  availableLevel7SpellSlots: z.number().int(),
  availableLevel8SpellSlots: z.number().int(),
  availableLevel9SpellSlots: z.number().int(),
  maxLevel1SpellSlots: z.number().int(),
  maxLevel2SpellSlots: z.number().int(),
  maxLevel3SpellSlots: z.number().int(),
  maxLevel4SpellSlots: z.number().int(),
  maxLevel5SpellSlots: z.number().int(),
  maxLevel6SpellSlots: z.number().int(),
  maxLevel7SpellSlots: z.number().int(),
  maxLevel8SpellSlots: z.number().int(),
  maxLevel9SpellSlots: z.number().int(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type CharacterInstance = z.infer<typeof CharacterInstanceSchema>
