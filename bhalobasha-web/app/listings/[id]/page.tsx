import { ListingDetail } from "./_components/listing-detail";

export { generateMetadata } from "./metadata";

export default function ListingDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return <ListingDetail id={params.id} />;
}
