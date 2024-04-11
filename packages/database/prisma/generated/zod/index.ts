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

export const CampaignScalarFieldEnumSchema = z.enum(['id','title','description','createdAt','updatedAt']);

export const CharacterScalarFieldEnumSchema = z.enum(['id','userId','campaignId','originId','raceId','subraceId','classId','itemIds','skillIds','name','pronouns','age','voice','alignment','appearance','backstory','personality','ideals','bonds','flaws','level','experience','charisma','constitution','dexterity','intelligence','strength','wisdom','imageUrl','createdAt','updatedAt']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const NullsOrderSchema = z.enum(['first','last']);
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
// CAMPAIGN SCHEMA
/////////////////////////////////////////

export const CampaignSchema = z.object({
  id: z.string().cuid(),
  title: z.string(),
  description: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Campaign = z.infer<typeof CampaignSchema>

/////////////////////////////////////////
// CHARACTER SCHEMA
/////////////////////////////////////////

export const CharacterSchema = z.object({
  id: z.string().cuid(),
  userId: z.string(),
  campaignId: z.string().nullable(),
  originId: z.string(),
  raceId: z.string(),
  subraceId: z.string(),
  classId: z.string(),
  itemIds: z.string().array(),
  skillIds: z.string().array(),
  name: z.string(),
  pronouns: z.string(),
  age: z.number().int(),
  voice: z.string(),
  alignment: z.string(),
  appearance: z.string(),
  backstory: z.string(),
  personality: z.string(),
  ideals: z.string(),
  bonds: z.string(),
  flaws: z.string(),
  level: z.number().int(),
  experience: z.number().int(),
  charisma: z.number().int(),
  constitution: z.number().int(),
  dexterity: z.number().int(),
  intelligence: z.number().int(),
  strength: z.number().int(),
  wisdom: z.number().int(),
  imageUrl: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Character = z.infer<typeof CharacterSchema>
