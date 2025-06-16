// Enum definitions from QnA.md
export type R1Values = "Yes" | "No" | "N/A";
export type R2Values = "Owner" | "Contractor" | "Not Applicable";
export type R3Values = "By Machine" | "Manually";
export type R4Values = "Included" | "Not Included";
export type R5Values = "Fence" | "Hard Cover";
export type S1Values = "Yes" | "No" | "Unknown";
export type ExcavatorSizeValues = "3T Excavator" | "5T Excavator";

// Inclusions enums from docs/inclusions.md
export type IEValues = "Included" | "Not Included";
export type ECValues = "Not Included" | "10amp - Plug In" | "15amp - Plug In" | "20amp - Plug In" | "25amp - Hardwired" | "32amp - Hardwired" | "40amp - Hardwired";

// Contract Basics Section
export interface ContractBasics {
  contractSubjectToFinance: R1Values | "";
  lenderName: string;
  interestRate: number | "";
  workPeriodDays: number | "";
  anticipatedCommWeek: string; // ISO date string
  inclementWeatherDays: number | "";
  weekendDays: number | "";
  thirdPartyComponents: R1Values | "";
  // Additional date fields
  accessFencingEquipmentDate: string; // ISO date string
  specificationsDate: string; // ISO date string
  sitePlanDate: string; // ISO date string
  permissionToEnterDate: string; // ISO date string
  otherDate: string; // ISO date string
}

// Access & Site Conditions Section
export interface AccessSiteConditions {
  accessVideoProvided: R1Values | "";
  minAccessWidthMm: number | "";
  minAccessHeightMm: number | "";
  craneRequired: R1Values | "";
  minCraneClearanceMm: number | "";
}

// Site Preparation & Excavation Section
export interface SitePreparationExcavation {
  overburdenRemovalResp: R2Values | "";
  excavationRequiredBy: R2Values | "";
  excavationMethod: R3Values | "";
  excavatorComboSize: ExcavatorSizeValues | "";
  serviceLinesRelocationNeeded: S1Values | "";
  serviceLinesRelocatedBy: R2Values | "";
  excavatedMaterialLeftOnSite: R1Values | "";
  excavatedMaterialRemoved: R1Values | "";
  excavatedMaterialRemovedBy: R2Values | "";
}

// Responsibilities Section
export interface Responsibilities {
  fencesInAccessPath: R1Values | "";
  fenceRemovalBy: R2Values | "";
  fenceReinstatementBy: R2Values | "";
  treesOrWallsRemovalNeeded: R1Values | "";
  treeRemovalBy: R2Values | "";
  treeReinstatementBy: R2Values | "";
}

// Safety & Temporary Works Section
export interface SafetyTemporaryWorks {
  tempPoolSafetyBarrier: R1Values | "";
  tempSafetyBarrierType: R5Values | "";
  tempSafetyBarrierHirePeriodWeeks: number | "";
  powerConnectionProvided: R1Values | "";
  hardCoverRequired: R1Values | "";
  permPoolSafetyBarrier: R1Values | "";
  tempFenceProvided: R1Values | "";
}

// Extra-Cost Risk Flags Section
export interface ExtraCostRiskFlags {
  locatingBoundaries: R1Values | "";
  difficultAccess: R1Values | "";
  ownerInterference: R1Values | "";
  primeCostVariance: R1Values | "";
  statutoryVariations: R1Values | "";
  delayedProgress: R1Values | "";
  latentConditions: R1Values | "";
  suspensionCosts: R1Values | "";
  excavatedFillCartage: R1Values | "";
  productSubstitution: R1Values | "";
  specialConditions: R1Values | "";
  thirdPartyComponents: R1Values | "";
}

// Owner-Supplied Items Section
export interface OwnerSuppliedItems {
  ownerSuppliedItem1: string;
  ownerSuppliedItem2: string;
}

// Site Due-Diligence Notes Section
export interface SiteDueDiligenceNotes {
  mattersAffectingSiteByd: string;
  mattersAffectingSiteOwner: string;
}

// Special-Work Instructions Section
export interface SpecialWorkInstructions {
  specialConsiderations: string;
  extraOrSpecialWork: string;
  specialAccess: string;
  specialAccessNotes: string;
}

// Survey Reference Section
export interface SurveyReference {
  datumPoint: number | "";
}

// Inclusions & Exclusions Section (Schedule 3)
export interface ContractInclusions {
  a: IEValues | ""; // Locating underground services
  b: IEValues | ""; // Rerouting underground power/services
  c: IEValues | ""; // Rerouting sewer/stormwater
  d: IEValues | ""; // Seeking neighbours/council consent
  e: IEValues | ""; // Removal of fences/obstructions
  f: IEValues | ""; // Removal of trees
  g: IEValues | ""; // Survey of site
  h: IEValues | ""; // Sewer approval/connection
  i: IEValues | ""; // Backwash/pump-out water pipe >6m
  j: IEValues | ""; // Geotechnical/engineering reports
  k: IEValues | ""; // Manual excavation
  l: IEValues | ""; // Mechanical excavation
  m: IEValues | ""; // Cartage fees for excavated material
  n: IEValues | ""; // Tipping fees for excavated material
  o: IEValues | ""; // Levelling/spreading excavated material
  p: IEValues | ""; // Additional overburden excavation/disposal
  q: IEValues | ""; // Compaction of fill >300mm
  r: IEValues | ""; // Extension for in-fill step
  s: IEValues | ""; // Additional concrete for oversize shell
  t: IEValues | ""; // Additional steel for oversize shell
  u: IEValues | ""; // Pre-cut site to level
  v: IEValues | ""; // Rock/shale excavation
  w: IEValues | ""; // Transportation of excavated earth
  x: IEValues | ""; // Overcoming uncompacted fill/water table
  y: IEValues | ""; // Pumping ground water
  z: IEValues | ""; // Electrical earth bond
  aa: ECValues | ""; // Electrical connection to mains (heat pumps)
  bb: IEValues | ""; // Electrical supply/connection to filtration
  cc: IEValues | ""; // Temporary pool safety barrier hire
  dd: IEValues | ""; // Permanent pool safety barrier
  ee: IEValues | ""; // Piering of structural beam around pool
  ff: IEValues | ""; // Piering of extended paving
  gg: IEValues | ""; // Piering/special structural requirements
  hh: IEValues | ""; // Concrete pump
  jj: IEValues | ""; // Replacement of fences/obstructions
  kk: IEValues | ""; // Removal of rubbish/wastage
  ll: IEValues | ""; // Skip bin hire
  mm: IEValues | ""; // Full reinstatement of land/gardens
  nn: IEValues | ""; // Enclosures/sound-proofing of equipment
  oo: IEValues | ""; // Additional paperwork for filtration repositioning
  pp: IEValues | ""; // Pool heating
  qq: IEValues | ""; // Cost of overcoming latent conditions
  rr: IEValues | ""; // Water for filling pool
  ss: IEValues | ""; // Fire-ant testing arrangement
  tt: IEValues | ""; // Fire-ant testing/work costs
  uu: IEValues | ""; // QBCC Home Warranty Insurance
}

// Complete Contract Q&A Form Data
export interface ContractQAFormData {
  contractBasics: ContractBasics;
  accessSiteConditions: AccessSiteConditions;
  sitePreparationExcavation: SitePreparationExcavation;
  responsibilities: Responsibilities;
  safetyTemporaryWorks: SafetyTemporaryWorks;
  extraCostRiskFlags: ExtraCostRiskFlags;
  ownerSuppliedItems: OwnerSuppliedItems;
  siteDueDiligenceNotes: SiteDueDiligenceNotes;
  specialWorkInstructions: SpecialWorkInstructions;
  surveyReference: SurveyReference;
  inclusions: ContractInclusions;
}

// Enum options for select components
export const R1_OPTIONS: R1Values[] = ["Yes", "No", "N/A"];
export const R2_OPTIONS: R2Values[] = ["Owner", "Contractor", "Not Applicable"];
export const R3_OPTIONS: R3Values[] = ["By Machine", "Manually"];
export const R4_OPTIONS: R4Values[] = ["Included", "Not Included"];
export const R5_OPTIONS: R5Values[] = ["Fence", "Hard Cover"];
export const S1_OPTIONS: S1Values[] = ["Yes", "No", "Unknown"];
export const IE_OPTIONS: IEValues[] = ["Included", "Not Included"];
export const EC_OPTIONS: ECValues[] = ["Not Included", "10amp - Plug In", "15amp - Plug In", "20amp - Plug In", "25amp - Hardwired", "32amp - Hardwired", "40amp - Hardwired"];
export const EXCAVATOR_SIZE_OPTIONS: ExcavatorSizeValues[] = ["3T Excavator", "5T Excavator"];

// Default values for extra cost risk flags (all default to empty for independent state management)
export const DEFAULT_EXTRA_COST_RISK_FLAGS: ExtraCostRiskFlags = {
  locatingBoundaries: "",
  difficultAccess: "",
  ownerInterference: "",
  primeCostVariance: "",
  statutoryVariations: "",
  delayedProgress: "",
  latentConditions: "",
  suspensionCosts: "",
  excavatedFillCartage: "",
  productSubstitution: "",
  specialConditions: "",
  thirdPartyComponents: "",
};

// Default values for inclusions (all default to empty for independent state management)
export const DEFAULT_CONTRACT_INCLUSIONS: ContractInclusions = {
  a: "",
  b: "",
  c: "",
  d: "",
  e: "",
  f: "",
  g: "",
  h: "",
  i: "",
  j: "",
  k: "",
  l: "",
  m: "",
  n: "",
  o: "",
  p: "",
  q: "",
  r: "",
  s: "",
  t: "",
  u: "",
  v: "",
  w: "",
  x: "",
  y: "",
  z: "",
  aa: "",
  bb: "",
  cc: "",
  dd: "",
  ee: "",
  ff: "",
  gg: "",
  hh: "",
  jj: "",
  kk: "",
  ll: "",
  mm: "",
  nn: "",
  oo: "",
  pp: "",
  qq: "",
  rr: "",
  ss: "",
  tt: "",
  uu: "",
};