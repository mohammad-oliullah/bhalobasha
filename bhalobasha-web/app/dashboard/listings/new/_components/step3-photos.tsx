import { Button } from "@/components/ui/button";
import { PhotoUploader } from "@/components/listings/photo-uploader";
import { ChevronLeft } from "lucide-react";

interface Step3Props {
  photos: { url: string; id: string }[];
  onChange: (photos: { url: string; id: string }[]) => void;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function Step3Photos({
  photos,
  onChange,
  onBack,
  onSubmit,
  isSubmitting,
}: Step3Props) {
  return (
    <div className="space-y-6">
      <PhotoUploader photos={photos} onChange={onChange} />
      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onBack}>
          <ChevronLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <Button
          className="flex-1"
          onClick={onSubmit}
          disabled={isSubmitting || photos.length === 0}
        >
          {isSubmitting ? "Posting..." : "Post Listing"}
        </Button>
      </div>
    </div>
  );
}
