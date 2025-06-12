import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Package, Check, X } from "lucide-react";
import { ContractInclusions, IEValues, ECValues, IE_OPTIONS, EC_OPTIONS } from "@/types/contract-qa";
import { useContractInclusions } from "@/components/contract/hooks/useContractInclusions";
import { useSearchParams } from "react-router-dom";

interface InclusionsSectionProps {
  data?: ContractInclusions; // Make optional since we'll manage state internally
  onChange?: (data: ContractInclusions) => void; // Make optional
  readonly?: boolean;
  onSave?: () => void;
}

export const InclusionsSection: React.FC<InclusionsSectionProps> = ({
  data: parentData,
  onChange: parentOnChange,
  readonly = false,
  onSave,
}) => {
  const [searchParams] = useSearchParams();
  const customerId = searchParams.get('customerId');
  const [hasExistingRecord, setHasExistingRecord] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Manage form state internally
  const [formData, setFormData] = useState<ContractInclusions>({
    a: "", b: "", c: "", d: "", e: "", f: "", g: "", h: "", i: "", j: "",
    k: "", l: "", m: "", n: "", o: "", p: "", q: "", r: "", s: "", t: "",
    u: "", v: "", w: "", x: "", y: "", z: "", aa: "", bb: "", cc: "", dd: "",
    ee: "", ff: "", gg: "", hh: "", jj: "", kk: "", ll: "", mm: "", nn: "",
    oo: "", pp: "", qq: "", rr: "", ss: "", tt: "", uu: "",
  });
  
  const { saveContractInclusions, loadContractInclusions, isSubmitting } = useContractInclusions();

  // Load inclusions data on initial mount only
  useEffect(() => {
    if (!customerId || isInitialized) return;

    const loadData = async () => {
      try {
        console.log('🔍 Loading inclusions data for customer:', customerId);
        const existingData = await loadContractInclusions(customerId);
        
        if (existingData) {
          console.log('✅ Found existing inclusions data:', existingData);
          setHasExistingRecord(true);
          // Map database fields to form fields
          const mappedData: ContractInclusions = {
            a: existingData.s7_inc_or_ex_a || "",
            b: existingData.s7_inc_or_ex_b || "",
            c: existingData.s7_inc_or_ex_c || "",
            d: existingData.s7_inc_or_ex_d || "",
            e: existingData.s7_inc_or_ex_e || "",
            f: existingData.s7_inc_or_ex_f || "",
            g: existingData.s7_inc_or_ex_g || "",
            h: existingData.s7_inc_or_ex_h || "",
            i: existingData.s7_inc_or_ex_i || "",
            j: existingData.s7_inc_or_ex_j || "",
            k: existingData.s7_inc_or_ex_k || "",
            l: existingData.s7_inc_or_ex_l || "",
            m: existingData.s7_inc_or_ex_m || "",
            n: existingData.s7_inc_or_ex_n || "",
            o: existingData.s7_inc_or_ex_o || "",
            p: existingData.s7_inc_or_ex_p || "",
            q: existingData.s7_inc_or_ex_q || "",
            r: existingData.s7_inc_or_ex_r || "",
            s: existingData.s7_inc_or_ex_s || "",
            t: existingData.s7_inc_or_ex_t || "",
            u: existingData.s7_inc_or_ex_u || "",
            v: existingData.s7_inc_or_ex_v || "",
            w: existingData.s7_inc_or_ex_w || "",
            x: existingData.s7_inc_or_ex_x || "",
            y: existingData.s7_inc_or_ex_y || "",
            z: existingData.s7_inc_or_ex_z || "",
            aa: existingData.s7_inc_or_ex_aa_plugin || "",
            bb: existingData.s7_inc_or_ex_bb || "",
            cc: existingData.s7_inc_or_ex_cc || "",
            dd: existingData.s7_inc_or_ex_dd || "",
            ee: existingData.s7_inc_or_ex_ee || "",
            ff: existingData.s7_inc_or_ex_ff || "",
            gg: existingData.s7_inc_or_ex_gg || "",
            hh: existingData.s7_inc_or_ex_hh || "",
            jj: existingData.s7_inc_or_ex_jj || "",
            kk: existingData.s7_inc_or_ex_kk || "",
            ll: existingData.s7_inc_or_ex_ll || "",
            mm: existingData.s7_inc_or_ex_mm || "",
            nn: existingData.s7_inc_or_ex_nn || "",
            oo: existingData.s7_inc_or_ex_oo || "",
            pp: existingData.s7_inc_or_ex_pp || "",
            qq: existingData.s7_inc_or_ex_qq || "",
            rr: existingData.s7_inc_or_ex_rr || "",
            ss: existingData.s7_inc_or_ex_ss || "",
            tt: existingData.s7_inc_or_ex_tt || "",
            uu: existingData.s7_inc_or_ex_uu || "",
          };
          setFormData(mappedData);
        } else {
          console.log('📝 No existing inclusions data found - component will mount with empty form');
          setHasExistingRecord(false);
        }
      } catch (error) {
        console.warn('⚠️ Error loading inclusions data (component will mount with empty form):', error);
        setHasExistingRecord(false);
        // Don't throw error - just continue with empty form
      } finally {
        setIsInitialized(true);
      }
    };

    loadData();
  }, [customerId, isInitialized]);

  // Reset initialization state on unmount
  useEffect(() => {
    return () => {
      setIsInitialized(false);
    };
  }, []);

  const handleFieldChange = (field: keyof ContractInclusions, value: any) => {
    // Update internal state
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!customerId) {
      console.error('No customer ID available');
      return;
    }

    try {
      // Map form fields to database fields using internal formData state
      console.log('📝 Form data before mapping:', formData);
      const inclusionsData = {
        s7_inc_or_ex_a: formData.a,
        s7_inc_or_ex_b: formData.b,
        s7_inc_or_ex_c: formData.c,
        s7_inc_or_ex_d: formData.d,
        s7_inc_or_ex_e: formData.e,
        s7_inc_or_ex_f: formData.f,
        s7_inc_or_ex_g: formData.g,
        s7_inc_or_ex_h: formData.h,
        s7_inc_or_ex_i: formData.i,
        s7_inc_or_ex_j: formData.j,
        s7_inc_or_ex_k: formData.k,
        s7_inc_or_ex_l: formData.l,
        s7_inc_or_ex_m: formData.m,
        s7_inc_or_ex_n: formData.n,
        s7_inc_or_ex_o: formData.o,
        s7_inc_or_ex_p: formData.p,
        s7_inc_or_ex_q: formData.q,
        s7_inc_or_ex_r: formData.r,
        s7_inc_or_ex_s: formData.s,
        s7_inc_or_ex_t: formData.t,
        s7_inc_or_ex_u: formData.u,
        s7_inc_or_ex_v: formData.v,
        s7_inc_or_ex_w: formData.w,
        s7_inc_or_ex_x: formData.x,
        s7_inc_or_ex_y: formData.y,
        s7_inc_or_ex_z: formData.z,
        // s7_inc_or_ex_zz is not used in the UI
        s7_inc_or_ex_aa_plugin: formData.aa,
        s7_inc_or_ex_bb: formData.bb,
        s7_inc_or_ex_cc: formData.cc,
        s7_inc_or_ex_dd: formData.dd,
        s7_inc_or_ex_ee: formData.ee,
        s7_inc_or_ex_ff: formData.ff,
        s7_inc_or_ex_gg: formData.gg,
        s7_inc_or_ex_hh: formData.hh,
        s7_inc_or_ex_jj: formData.jj,
        s7_inc_or_ex_kk: formData.kk,
        s7_inc_or_ex_ll: formData.ll,
        s7_inc_or_ex_mm: formData.mm,
        s7_inc_or_ex_nn: formData.nn,
        s7_inc_or_ex_oo: formData.oo,
        s7_inc_or_ex_pp: formData.pp,
        s7_inc_or_ex_qq: formData.qq,
        s7_inc_or_ex_rr: formData.rr,
        s7_inc_or_ex_ss: formData.ss,
        s7_inc_or_ex_tt: formData.tt,
        s7_inc_or_ex_uu: formData.uu,
      };

      const result = await saveContractInclusions(customerId, inclusionsData);
      if (result && !hasExistingRecord) {
        setHasExistingRecord(true);
      }
      
      // Update parent with saved data if onChange is provided
      if (parentOnChange) {
        parentOnChange(formData);
      }
      
      // Call the original onSave callback if provided
      if (onSave) {
        onSave();
      }
    } catch (error) {
      console.error('Error saving inclusions data:', error);
    }
  };

  // Form validation - require ALL 41 fields to be answered
  const isFormValid = () => {
    const requiredFields = [
      formData.a, formData.b, formData.c, formData.d, formData.e, formData.f, formData.g, formData.h, formData.i, formData.j,
      formData.k, formData.l, formData.m, formData.n, formData.o, formData.p, formData.q, formData.r, formData.s, formData.t,
      formData.u, formData.v, formData.w, formData.x, formData.y, formData.z, formData.aa, formData.bb, formData.cc, formData.dd,
      formData.ee, formData.ff, formData.gg, formData.hh, formData.jj, formData.kk, formData.ll, formData.mm, formData.nn,
      formData.oo, formData.pp, formData.qq, formData.rr, formData.ss, formData.tt, formData.uu
    ];
    return requiredFields.every(field => field && field.trim() !== "");
  };

  // Helper function to get the status icon
  const getStatusIcon = (value: string) => {
    if (value === "Included") {
      return <Check className="h-5 w-5 text-green-600" />;
    } else if (value === "Not Included") {
      return <X className="h-5 w-5 text-red-600" />;
    } else if (value && value !== "Not Included") {
      // For EC types that have specific values like "10amp - Plug In"
      return <Check className="h-5 w-5 text-green-600" />;
    }
    return null;
  };

  // Inclusion items with their exact UI labels from docs/inclusions.md
  const inclusionItems = [
    { key: "a", label: "Locating underground services such as power, communication lines, sewer, stormwater, etc. (before, during and after construction) on the Site or any adjoining properties", type: "IE" },
    { key: "b", label: "Rerouting, relocating, reinstating, altering and/or repairing of existing underground power or services (before, during and after construction) on the Site", type: "IE" },
    { key: "c", label: "Rerouting, relocating, reinstating, altering and/or repairing of existing sewer and stormwater (before, during and after construction) on the Site", type: "IE" },
    { key: "d", label: "Seeking neighbours / council's consent for access", type: "IE" },
    { key: "e", label: "Removal of fences and/or any obstructions to machinery access unless specifically stated otherwise in this Contract", type: "IE" },
    { key: "f", label: "Removal of trees or other obstructions", type: "IE" },
    { key: "g", label: "Survey of the Site to confirm property boundaries, existing structures, house and pool location", type: "IE" },
    { key: "h", label: "Approval / provision / connection of or connection to a suitable sewer (often the relevant council wants connection to sewer)", type: "IE" },
    { key: "i", label: "Backwash / pump-out (for cartridge filters) water pipe in excess of 6 metres from filter", type: "IE" },
    { key: "j", label: "Geotechnical (soil test) and other engineering inspections and reports", type: "IE" },
    { key: "k", label: "Manual excavation", type: "IE" },
    { key: "l", label: "Mechanical excavation (not including removal from Site)", type: "IE" },
    { key: "m", label: "Fees for cartage of excavated material (See Provisional Allowance)", type: "IE" },
    { key: "n", label: "Fees for tipping of excavated material", type: "IE" },
    { key: "o", label: "Levelling or spreading excavated material on the Site or at a dumpsite", type: "IE" },
    { key: "p", label: "Excavation and/or disposal of additional overburden", type: "IE" },
    { key: "q", label: "Any work necessary to stabilise the Site conditions encountered in excavating and/or necessary to allow construction to proceed or recommence. This includes or covers events and consequences such as excavation collapsing due to unstable soil and/or the consequences of weather conditions such as rain and storms, and the use of pumps/spear pumps for de-watering if required.", type: "IE" },
    { key: "r", label: "Shoring of retaining walls or other stabilisation to ensure stability of overburden and/or pool excavation to protect adjacent structures and for safety of personnel", type: "IE" },
    { key: "s", label: "Surface protection", type: "IE" },
    { key: "t", label: "Concrete cutting of existing paving or structures – maximum depth 100 mm", type: "IE" },
    { key: "u", label: "Completing a pre-cut of the Site to level, including the disposal of pre-cut material", type: "IE" },
    { key: "v", label: "Excavation of rock, shale or other obstruction including removal from Site", type: "IE" },
    { key: "w", label: "Transportation of excavated earth from the Site to a dumpsite", type: "IE" },
    { key: "x", label: "Overcoming uncompacted fill and/or water table", type: "IE" },
    { key: "y", label: "Pumping to remove ground water", type: "IE" },
    { key: "z", label: "Electrical: Earth bond (from structural shell) supplied and installed by licensed electrician", type: "IE" },
    { key: "aa", label: "Electrical: Connection to mains (for heat pumps) supplied and installed by licensed electrician (payment by the Owner to the supplier directly – see Clauses 18.19 to 18.24)", type: "EC" },
    { key: "bb", label: "Electrical: Supply or connection to filtration, including earth bond, by licensed electrician (payment by the Owner to the supplier directly – see Clauses 12, 18.19 to 18.24)", type: "IE" },
    { key: "cc", label: "Temporary Pool Safety Barrier hire (liaising with third party only – payment by the Owner to the supplier directly – see Clauses 12, 18.1 to 18.9)", type: "IE" },
    { key: "dd", label: "Permanent pool safety barrier (liaising with third party only – payment by the Owner to the supplier directly – see Clauses 12, 18.10 to 18.18)", type: "IE" },
    { key: "ee", label: "Piering of structural beam around the pool (if required)", type: "IE" },
    { key: "ff", label: "Piering of extended paving (only required in some filled areas)", type: "IE" },
    { key: "gg", label: "Piering or other special structural requirements below existing structures or construction near a deep council sewer or storm-water pipe", type: "IE" },
    { key: "hh", label: "Concrete pump", type: "IE" },
    { key: "jj", label: "Replacement of fences and/or any obstructions to machinery access unless specifically stated within the Contract", type: "IE" },
    { key: "kk", label: "Removal of rubbish and wastage from pool install day", type: "IE" },
    { key: "ll", label: "Skip bin hire (only required for special circumstances)", type: "IE" },
    { key: "mm", label: "Full reinstatement of land, gardens, lawns, pathways, driveways and removal of spoil other than general cleaning and tidying (refer Schedule 4)", type: "IE" },
    { key: "nn", label: "Enclosures / sound-proofing of equipment", type: "IE" },
    { key: "oo", label: "Additional paperwork to alter position of filtration equipment from the position as noted in the pre-installation agreement", type: "IE" },
    { key: "pp", label: "Heating for the pool excluding connection to relevant services (such as gas, oil or electricity)", type: "IE" },
    { key: "qq", label: "The cost of overcoming any Latent Condition", type: "IE" },
    { key: "rr", label: "Water for filling pool", type: "IE" },
    { key: "ss", label: "Arranging fire-ant testing", type: "IE" },
    { key: "tt", label: "Cost of any testing, inspections or work required if fire-ants detected", type: "IE" },
    { key: "uu", label: "QBCC Home Warranty Insurance (cost is included in Contract Price)", type: "IE" },
  ] as const;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-4">
          <Package className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">Included & Excluded Items (Schedule 3)</h3>
        </div>
        
        <p className="text-sm text-gray-600 mb-6">
          Define what is included or excluded in the contract price. These specifications prevent disputes by clearly outlining the contractor's obligations and any additional costs that may apply.
        </p>
        
        <div className="grid gap-4">
          {inclusionItems.map(({ key, label, type }) => {
            const currentValue = formData[key as keyof ContractInclusions] as string;
            return (
              <div key={key} className="grid gap-2 p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <Label htmlFor={key} className="text-sm leading-relaxed">
                    <span className="font-medium text-gray-500 mr-2">({key.toUpperCase()})</span>
                    {label}
                  </Label>
                  {currentValue && !readonly && (
                    <button
                      type="button"
                      onClick={() => handleFieldChange(key as keyof ContractInclusions, "")}
                      className="text-xs text-destructive hover:text-destructive/80 underline inline-flex items-center gap-1 flex-shrink-0"
                    >
                      <X className="h-3 w-3" />
                      Remove Value
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <Select
                    value={currentValue}
                    onValueChange={(value) => handleFieldChange(key as keyof ContractInclusions, value)}
                    disabled={readonly}
                  >
                    <SelectTrigger className={readonly ? "bg-gray-50 cursor-not-allowed max-w-xs" : "max-w-xs"}>
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {(type === "IE" ? IE_OPTIONS : EC_OPTIONS).map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex-shrink-0">
                    {getStatusIcon(currentValue)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {!readonly && (
          <div className="flex justify-end pt-4 border-t mt-6">
            <Button 
              onClick={handleSave}
              disabled={isSubmitting || !isFormValid()}
              className="min-w-[140px]"
            >
              {isSubmitting ? 
                (hasExistingRecord ? "Updating..." : "Saving...") : 
                (hasExistingRecord ? "Update Inclusions" : "Save Inclusions")
              }
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};