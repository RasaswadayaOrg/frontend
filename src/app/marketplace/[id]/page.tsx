import { redirect } from "next/navigation";

// Products live at /products/[slug]. Any link that points to the old
// /marketplace/[id] pattern is redirected permanently.
export default async function MarketplaceProductRedirect(
  props: { params: Promise<{ id: string }> }
) {
  const { id } = await props.params;
  redirect(`/products/${id}`);
}
