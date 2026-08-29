import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PhoneInput } from "@/components/auth/phone-input";
import {
  useDivisions,
  useDistricts,
  useThanas,
  useAreas,
} from "@/lib/hooks/use-locations";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { z } from "zod";
import { useEffect, useState } from "react";
import { LocationPicker } from "./location-picker";

export const step2Schema = z.object({
  divisionId: z.number().min(1, "Select division"),
  districtId: z.number().min(1, "Select district"),
  thanaId: z.number().min(1, "Select thana"),
  areaId: z.number().min(1, "Select area"),
  address: z.string().min(10, "Enter full address"),
  totalRooms: z.number().min(1).optional(),
  totalBaths: z.number().min(1).optional(),
  floor: z.number().optional(),
  isFurnished: z.boolean(),
  utilitiesIncluded: z.boolean(),
  availableFrom: z.string().min(1, "Select available date"),
  contactPhone: z.string().regex(/^01[3-9]\d{8}$/, "Invalid phone number"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export type Step2Data = z.infer<typeof step2Schema>;

interface Step2Props {
  form: UseFormReturn<Step2Data>;
  onNext: () => void;
  onBack: () => void;
}

export function Step2LocationDetails({ form, onNext, onBack }: Step2Props) {
  const [mapCenter, setMapCenter] = useState({ lat: 23.7771, lng: 90.3994 });
  const [gpsChecked, setGpsChecked] = useState(false);

  const {
    register,
    watch,
    setValue,
    formState: { errors },
    handleSubmit,
  } = form;

  const divisionId = watch("divisionId");
  const districtId = watch("districtId");
  const thanaId = watch("thanaId");
  const areaId = watch("areaId");

  const { data: divisions = [] } = useDivisions();
  const { data: districts = [] } = useDistricts(divisionId);
  const { data: thanas = [] } = useThanas(districtId);
  const { data: areas = [] } = useAreas(thanaId);

  // Step 1 — try GPS first
  useEffect(() => {
    if (!navigator.geolocation) {
      setGpsChecked(true);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setMapCenter({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setGpsChecked(true);
      },
      () => {
        // Permission denied — fall through to thana/area coords
        setGpsChecked(true);
      },
    );
  }, []);

  // Step 2 — when thana selected, use its coordinates as fallback
  useEffect(() => {
    if (!gpsChecked || !thanaId) return;
    const selectedThana = thanas.find((t) => t.id === thanaId);
    if (selectedThana?.latitude && selectedThana?.longitude) {
      setMapCenter({
        lat: selectedThana.latitude,
        lng: selectedThana.longitude,
      });
    }
  }, [thanaId, thanas, gpsChecked]);
  console.log(
    thanas.find((t) => t.id === thanaId),
    "selectedThana",
  );

  // Step 3 — when area selected, use its coordinates (more precise)
  useEffect(() => {
    if (!gpsChecked || !areaId) return;
    const selectedArea = areas.find((a) => a.id === areaId);
    if (selectedArea?.latitude && selectedArea?.longitude) {
      setMapCenter({
        lat: selectedArea.latitude,
        lng: selectedArea.longitude,
      });
    }
  }, [areaId, areas, gpsChecked]);

  console.log(mapCenter, "mapCenter");

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-4">
      {/* Division */}
      <div className="space-y-2">
        <Label>Division</Label>
        <Select
          value={divisionId?.toString() || ""}
          onValueChange={(v) => {
            setValue("divisionId", Number(v));
            setValue("districtId", 0 as unknown as number);
            setValue("thanaId", 0 as unknown as number);
            setValue("areaId", 0 as unknown as number);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select division" />
          </SelectTrigger>
          <SelectContent>
            {divisions.map((d) => (
              <SelectItem key={d.id} value={d.id.toString()}>
                {d.nameBn} / {d.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.divisionId && (
          <p className="text-sm text-red-500">{errors.divisionId.message}</p>
        )}
      </div>

      {/* District */}
      {divisionId > 0 && (
        <div className="space-y-2">
          <Label>District</Label>
          <Select
            value={districtId?.toString() || ""}
            onValueChange={(v) => {
              setValue("districtId", Number(v));
              setValue("thanaId", 0 as unknown as number);
              setValue("areaId", 0 as unknown as number);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select district" />
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

      {/* Thana */}
      {districtId > 0 && (
        <div className="space-y-2">
          <Label>Thana</Label>
          <Select
            value={thanaId?.toString() || ""}
            onValueChange={(v) => {
              setValue("thanaId", Number(v));
              setValue("areaId", 0 as unknown as number);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select thana" />
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

      {/* Area */}
      {thanaId > 0 && (
        <div className="space-y-2">
          <Label>Area</Label>
          <Select
            value={watch("areaId")?.toString() || ""}
            onValueChange={(v) => setValue("areaId", Number(v))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select area" />
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

      {/* Map */}
      <div className="space-y-2">
        <Label>
          Pin Your Property Location{" "}
          <span className="text-xs text-muted">(optional)</span>
        </Label>
        <LocationPicker
          lat={watch("latitude")}
          lng={watch("longitude")}
          centerLat={mapCenter.lat}
          centerLng={mapCenter.lng}
          onChange={(lat, lng) => {
            setValue("latitude", lat, { shouldDirty: true });
            setValue("longitude", lng, { shouldDirty: true });
          }}
        />
      </div>

      {/* Address */}
      <div className="space-y-2">
        <Label>Full Address</Label>
        <Textarea {...register("address")} rows={2} />
        {errors.address && (
          <p className="text-sm text-red-500">{errors.address.message}</p>
        )}
      </div>

      {/* Rooms / Baths / Floor */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label>Rooms</Label>
          <Input
            type="number"
            {...register("totalRooms", { valueAsNumber: true })}
          />
        </div>
        <div className="space-y-2">
          <Label>Baths</Label>
          <Input
            type="number"
            {...register("totalBaths", { valueAsNumber: true })}
          />
        </div>
        <div className="space-y-2">
          <Label>Floor</Label>
          <Input
            type="number"
            {...register("floor", { valueAsNumber: true })}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Label>Furnished</Label>
        <Switch
          checked={watch("isFurnished")}
          onCheckedChange={(v) => setValue("isFurnished", v)}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label>Utilities Included</Label>
        <Switch
          checked={watch("utilitiesIncluded")}
          onCheckedChange={(v) => setValue("utilitiesIncluded", v)}
        />
      </div>

      <div className="space-y-2">
        <Label>Available From</Label>
        <Input type="date" {...register("availableFrom")} />
        {errors.availableFrom && (
          <p className="text-sm text-red-500">{errors.availableFrom.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Contact Phone</Label>
        <PhoneInput
          value={watch("contactPhone")}
          onChange={(v) => setValue("contactPhone", v)}
        />
        {errors.contactPhone && (
          <p className="text-sm text-red-500">{errors.contactPhone.message}</p>
        )}
      </div>

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onBack}>
          <ChevronLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <Button type="submit" className="flex-1">
          Next <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </form>
  );
}
