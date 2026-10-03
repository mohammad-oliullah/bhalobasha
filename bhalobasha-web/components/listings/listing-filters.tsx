"use client";

import { useEffect, useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  GenderPreference,
  ListingFilters,
  ListingType,
  TenantPolicy,
} from "@/types";
import {
  GENDER_LABELS,
  LISTING_TYPE_LABELS,
  TENANT_POLICY_LABELS,
} from "@/lib/utils/constants";
import {
  useDivisions,
  useDistricts,
  useUpazilas,
  useAreas,
} from "@/lib/hooks/use-locations";

interface ListingFiltersProps {
  filters: ListingFilters & {
    isFurnished?: boolean;
    utilitiesIncluded?: boolean;
  };
  onChange: (filters: ListingFiltersProps["filters"]) => void;
}

export function ListingFiltersPanel({
  filters,
  onChange,
}: ListingFiltersProps) {
  const [minRentInput, setMinRentInput] = useState(
    filters.minRent?.toString() ?? "",
  );
  const [maxRentInput, setMaxRentInput] = useState(
    filters.maxRent?.toString() ?? "",
  );
  const filtersRef = useRef(filters);
  const onChangeRef = useRef(onChange);
  const rentInputsRef = useRef({ min: minRentInput, max: maxRentInput });
  const appliedRentRef = useRef({
    min: filters.minRent,
    max: filters.maxRent,
  });
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  filtersRef.current = filters;
  onChangeRef.current = onChange;

  useEffect(() => {
    const minChanged = !Object.is(
      filters.minRent,
      appliedRentRef.current.min,
    );
    const maxChanged = !Object.is(
      filters.maxRent,
      appliedRentRef.current.max,
    );

    if (minChanged || maxChanged) {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
      appliedRentRef.current = {
        min: filters.minRent,
        max: filters.maxRent,
      };
      rentInputsRef.current = {
        min: filters.minRent?.toString() ?? "",
        max: filters.maxRent?.toString() ?? "",
      };
      setMinRentInput(rentInputsRef.current.min);
      setMaxRentInput(rentInputsRef.current.max);
    }
  }, [filters.minRent, filters.maxRent]);

  useEffect(
    () => () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    },
    [],
  );

  const updateRentInput = (field: "min" | "max", value: string) => {
    rentInputsRef.current[field] = value;
    if (field === "min") setMinRentInput(value);
    else setMaxRentInput(value);

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      const minRent = rentInputsRef.current.min
        ? Number(rentInputsRef.current.min)
        : undefined;
      const maxRent = rentInputsRef.current.max
        ? Number(rentInputsRef.current.max)
        : undefined;

      appliedRentRef.current = { min: minRent, max: maxRent };
      onChangeRef.current({
        ...filtersRef.current,
        minRent,
        maxRent,
      });
      debounceTimerRef.current = null;
    }, 400);
  };

  const { data: divisions = [] } = useDivisions();
  const { data: districts = [] } = useDistricts(filters.divisionId);
  const { data: upazilas = [] } = useUpazilas(filters.districtId);
  const { data: areas = [] } = useAreas(filters.upazilaId);

  const update = (patch: Partial<ListingFiltersProps["filters"]>) => {
    onChange({ ...filters, ...patch });
  };

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label>Division</Label>
        <Select
          value={filters.divisionId?.toString() || ""}
          onValueChange={(v) =>
            update({
              divisionId: v ? Number(v) : undefined,
              districtId: undefined,
              upazilaId: undefined,
              areaId: undefined,
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="All divisions" />
          </SelectTrigger>
          <SelectContent>
            {divisions.map((d) => (
              <SelectItem key={d.id} value={d.id.toString()}>
                {d.nameBn} / {d.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filters.divisionId && (
        <div className="space-y-2">
          <Label>District</Label>
          <Select
            value={filters.districtId?.toString() || ""}
            onValueChange={(v) =>
              update({
                districtId: v ? Number(v) : undefined,
                upazilaId: undefined,
                areaId: undefined,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All districts" />
            </SelectTrigger>
            <SelectContent>
              {districts.map((d) => (
                <SelectItem key={d.id} value={d.id.toString()}>
                  {d.nameBn} / {d.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {filters.districtId && (
        <div className="space-y-2">
          <Label>Upazila</Label>
          <Select
            value={filters.upazilaId?.toString() || ""}
            onValueChange={(v) =>
              update({
                upazilaId: v ? Number(v) : undefined,
                areaId: undefined,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All upazilas" />
            </SelectTrigger>
            <SelectContent>
              {upazilas.map((t) => (
                <SelectItem key={t.id} value={t.id.toString()}>
                  {t.nameBn} / {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {filters.upazilaId && (
        <div className="space-y-2">
          <Label>Area</Label>
          <Select
            value={filters.areaId?.toString() || ""}
            onValueChange={(v) => update({ areaId: v ? Number(v) : undefined })}
          >
            <SelectTrigger>
              <SelectValue placeholder="All areas" />
            </SelectTrigger>
            <SelectContent>
              {areas.map((a) => (
                <SelectItem key={a.id} value={a.id.toString()}>
                  {a.nameBn} / {a.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-2">
        <Label>Listing Type</Label>
        <Select
          value={filters.type || ""}
          onValueChange={(v) =>
            update({ type: v ? (v as ListingType) : undefined })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(ListingType).map((t) => (
              <SelectItem key={t} value={t}>
                {LISTING_TYPE_LABELS[t]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Tenant Policy</Label>
        <Select
          value={filters.tenantPolicy || ""}
          onValueChange={(v) =>
            update({
              tenantPolicy: v ? (v as TenantPolicy) : undefined,
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Any policy" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(TenantPolicy).map((p) => (
              <SelectItem key={p} value={p}>
                {TENANT_POLICY_LABELS[p]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Gender Preference</Label>
        <Select
          value={filters.genderPreference || ""}
          onValueChange={(v) =>
            update({
              genderPreference: v ? (v as GenderPreference) : undefined,
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Any gender" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(GenderPreference).map((g) => (
              <SelectItem key={g} value={g}>
                {GENDER_LABELS[g]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>Min Rent (৳)</Label>
          <Input
            type="number"
            placeholder="0"
            value={minRentInput}
            onChange={(e) => updateRentInput("min", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Max Rent (৳)</Label>
          <Input
            type="number"
            placeholder="50000"
            value={maxRentInput}
            onChange={(e) => updateRentInput("max", e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="furnished">Furnished</Label>
        <Switch
          id="furnished"
          checked={filters.isFurnished ?? false}
          onCheckedChange={(checked) =>
            update({ isFurnished: checked || undefined })
          }
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="utilities">Utilities Included</Label>
        <Switch
          id="utilities"
          checked={filters.utilitiesIncluded ?? false}
          onCheckedChange={(checked) =>
            update({ utilitiesIncluded: checked || undefined })
          }
        />
      </div>
    </div>
  );
}
