import { StoreProfileEditor } from "@/components/seller-dashboard/StoreProfileEditor";

export default function SellerStorePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
          My Store
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Manage your store profile. Buyers see this info on your storefront.
        </p>
      </div>
      <StoreProfileEditor />
    </div>
  );
}
