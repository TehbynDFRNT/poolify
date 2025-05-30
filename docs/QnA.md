Below is a **developer-ready field catalogue** for turning the Q & A schedule into a web form or API schema.
I have grouped the inputs by functional area, given each one an internal `key`, shown the **data type**, and tightened constraints / enum codes so your front-end and DB stay consistent. All labels and options come straight from the contract schedule .

---

### 1 Shared enum definitions (reuse everywhere)

| Code   | Allowed values (exact text)                                       |
| ------ | ----------------------------------------------------------------- |
| **R1** | `Yes` · `No` · `N/A`                                              |
| **R2** | `Owner` · `Contractor` · `Not Applicable`                         |
| **R3** | `By Machine` · `Manually`                                         |
| **R4** | `Included` · `Not Included`                                       |
| **R5** | `Fence` · `Hard Cover`                                            |
| **S1** | `Yes` · `No` · `Unknown` <br>(only for *service-line relocation*) |

> **DB tip:** store the code (`R1`, `R2` …) plus the chosen value, or use separate lookup tables—whichever fits your stack.

---

### 2 Contract basics

| key                        | UI label                            | type        | constraints      |
| -------------------------- | ----------------------------------- | ----------- | ---------------- |
| `isResidentOwner`          | Is the Owner the “Resident Owner”?  | enum **R1** | required         |
| `contractSubjectToFinance` | Is the Contract subject to finance? | enum **R1** | required         |
| `lenderName`               | Who is the Lender?                  | text        | max 100 chars    |
| `workPeriodDays`           | Work period in days                 | integer     | `>0`             |
| `anticipatedCommWeek`      | Anticipated commencement week       | date        | ISO `YYYY-MM-DD` |
| `inclementWeatherDays`     | Inclement weather allowance         | integer     | `≥0`             |
| `weekendDays`              | Weekend allowance                   | integer     | `≥0`             |

---

### 3 Access & site conditions

| key                   | UI label                                         | type        | constraints                       |
| --------------------- | ------------------------------------------------ | ----------- | --------------------------------- |
| `accessVideoProvided` | Animated video / sketch of access path provided? | enum **R1** | required                          |
| `minAccessWidthMm`    | Minimum access width (mm)                        | integer     | `>0`                              |
| `minAccessHeightMm`   | Minimum access height (mm)                       | integer     | `>0`                              |
| `craneRequired`       | Is a crane required?                             | enum **R1** | required                          |
| `minCraneClearanceMm` | Minimum crane clearance (mm)                     | integer     | required *if* `craneRequired=Yes` |
| `fencesInAccessPath`  | Are fences in / near the access path?            | enum **R1** | required                          |

---

### 4 Site preparation & excavation

| key                            | UI label                                              | type        | constraints |
| ------------------------------ | ----------------------------------------------------- | ----------- | ----------- |
| `treesOrWallsRemovalNeeded`    | Trees / landscaping / walls require removal?          | enum **R1** | required    |
| `overburdenRemovalResp`        | Removal of over-burden & site prep                    | enum **R2** | —           |
| `excavationRequiredBy`         | Excavation required for pool                          | enum **R2** | —           |
| `excavationMethod`             | Method of excavation                                  | enum **R3** | required    |
| `serviceLinesRelocationNeeded` | Do service lines (water, gas, sewer) need relocation? | enum **S1** | required    |
| `serviceLinesRelocatedBy`      | Party responsible for relocating service lines        | enum **R2** | —           |
| `excavatedMaterialLeftOnSite`  | Excavated material left on-site?                      | enum **R1** | required    |
| `excavatedMaterialRemoved`     | Excavated material removed from site?                 | enum **R1** | required    |
| `excavatedMaterialRemovedBy`   | Party responsible for removal of excavated material   | enum **R2** | —           |

---

### 5 Responsibilities ­– fencing, trees, etc.

| key                    | UI label                                                      | type        | constraints |
| ---------------------- | ------------------------------------------------------------- | ----------- | ----------- |
| `fenceRemovalBy`       | Party responsible for removing fences                         | enum **R2** | —           |
| `fenceReinstatementBy` | Party responsible for reinstating fences                      | enum **R2** | —           |
| `treeRemovalBy`        | Party responsible for removing trees / landscaping / walls    | enum **R2** | —           |
| `treeReinstatementBy`  | Party responsible for reinstating trees / landscaping / walls | enum **R2** | —           |

---

### 6 Safety & temporary works

| key                       | UI label                                | type        | constraints                               |
| ------------------------- | --------------------------------------- | ----------- | ----------------------------------------- |
| `tempPoolSafetyBarrier`   | Temporary pool safety barrier required? | enum **R1** | required                                  |
| `tempSafetyBarrierType`   | Type of temporary safety barrier        | enum **R5** | required *if* `tempPoolSafetyBarrier=Yes` |
| `powerConnectionProvided` | Power connection (temp‐works)           | enum **R1** | required                                  |
| `hardCoverRequired`       | Hard cover over pool shell required?    | enum **R1** | required                                  |
| `permPoolSafetyBarrier`   | Permanent pool safety barrier included? | enum **R1** | required                                  |
| `tempFenceProvided`       | Temporary fence supplied?               | enum **R1** | required                                  |

---

### 7 Extra-cost risk flags (Item 8 of the schedule)

| key                  | UI label                                 | **Question (text as shown in schedule)**                                                                            | type    |
| -------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------- |
| locatingBoundaries   | Boundary-pegs located / survey required? | extra costs incurred by the Contractor in **locating site boundaries and underground services** (Refer Clause 6.4)  | enum R1 |
| difficultAccess      | Difficult access                         | extra costs incurred by the Contractor in **accessing the Site** (Refer Clause 7.4)                                 | enum R1 |
| ownerInterference    | Owner interference / delays              | extra costs for **Owner interference** claimed by the Contractor (Refer Clause 7.6)                                 | enum R1 |
| primeCostVariance    | Prime-cost sum variance                  | the actual cost of **Prime Cost Items / Provisional Sums** being less or exceeding the estimates (Refer Clause 13)  | enum R1 |
| statutoryVariations  | Statutory variations                     | **variations** required by a statutory authority incl. private certifier (Refer Clause 14)                          | enum R1 |
| delayedProgress      | Delayed progress                         | where **commencement or progress** of the Works is delayed (Refer Clause 15)                                        | enum R1 |
| latentConditions     | Latent conditions                        | extra costs incurred to overcome **Latent Conditions** (Refer Clause 16)                                            | enum R1 |
| suspensionCosts      | Suspension costs                         | extra costs incurred as a result of a **suspension of the Works** (Refer Clause 17)                                 | enum R1 |
| excavatedFillCartage | Excavated fill cartage                   | extra costs incurred in **carting and dumping excavated fill** (Refer Clause 20.6)                                  | enum R1 |
| productSubstitution  | Product substitution                     | extra costs as a result of a **product substitution** (Refer Clause 22.9)                                           | enum R1 |
| specialConditions    | Special conditions                       | any **special conditions** that may result in cost increases (Refer Clause 39)                                      | enum R1 |
| thirdPartyComponents | Third-party components                   | The Contract Price **does not include** the cost of any **Third Party Components** (see Item 4 & Schedule 3).       | enum R1 |

---

### 8 Owner-supplied items

| key                  | UI label               | type | constraints   |   |
| -------------------- | ---------------------- | ---- | ------------- | - |
| `ownerSuppliedItem1` | Owner-supplied item #1 | text | max 150 chars |   |
| `ownerSuppliedItem2` | Owner-supplied item #2 | text | max 150 chars |   |

---

### 9 Site due-diligence notes

| key                         | UI label                                     | type     | constraints |   |
| --------------------------- | -------------------------------------------- | -------- | ----------- | - |
| `mattersAffectingSiteByd`   | BYD / canibuild findings & reference numbers | textarea | multi-line  |   |
| `mattersAffectingSiteOwner` | Other matters the owner is aware of          | textarea | multi-line  |   |

---

### 10 Special-work instructions

| key                  | UI label                      | type     | constraints |   |
| -------------------- | ----------------------------- | -------- | ----------- | - |
| `extraOrSpecialWork` | Extra or special work details | textarea | multi-line  |   |

---

### 11 Survey reference

| key          | UI label                         | type    | constraints |   |
| ------------ | -------------------------------- | ------- | ----------- | - |
| `datumPoint` | Datum point (mm above/below AHD) | integer | `≥ 0`       |   |

---

All tables now follow the same markdown style, and each field sits in a more precise functional bucket. Let me know if you’d like further tweaks (naming conventions, ordering, etc.).
