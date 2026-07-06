"use client";

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
  useThanas,
  useAreas,
} from "@/lib/hooks/use-locations";

interface ListingFiltersProps {
  filters: ListingFilters & {
    isFurnished?: boolean;
    utilitiesIncluded?: boolean;
  };
  onChange: (filters: ListingFiltersProps["filters"]) => void;
}

export function ListingFiltersPanel({ filters, onChange }: ListingFiltersProps) {
  const { data: divisions = [] } = useDivisions();
  const { data: districts = [] } = useDistricts(filters.divisionId);
  const { data: thanas = [] } = useThanas(filters.districtId);
  const { data: areas = [] } = useAreas(filters.thanaId);

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
              thanaId: undefined,
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
                thanaId: undefined,
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
          <Label>Thana</Label>
          <Select
            value={filters.thanaId?.toString() || ""}
            onValueChange={(v) =>
              update({
                thanaId: v ? Number(v) : undefined,
                areaId: undefined,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All thanas" />
            </SelectTrigger>
            <SelectContent>
              {thanas.map((t) => (
                <SelectItem key={t.id} value={t.id.toString()}>
                  {t.nameBn} / {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {filters.thanaId && (
        <div className="space-y-2">
          <Label>Area</Label>
          <Select
            value={filters.areaId?.toString() || ""}
            onValueChange={(v) =>
              update({ areaId: v ? Number(v) : undefined })
            }
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
            value={filters.minRent ?? ""}
            onChange={(e) =>
              update({
                minRent: e.target.value ? Number(e.target.value) : undefined,
              })
            }
          />
        </div>
        <div className="space-y-2">
          <Label>Max Rent (৳)</Label>
          <Input
            type="number"
            placeholder="50000"
            value={filters.maxRent ?? ""}
            onChange={(e) =>
              update({
                maxRent: e.target.value ? Number(e.target.value) : undefined,
              })
            }
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
