import { getProduct } from "@/lib/db";
import { notFound } from "next/navigation";
import { ImageWithFallback } from "@/components/ImageWithFallback";

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  if (!product) return notFound();

  // Show all images (gallery)
  const images: string[] = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : product.imageUrl ? [product.imageUrl] : [];

  return (
    <main className="product-detail">
      <h1>{product.name}</h1>
      <div className="product-detail__images" style={{ display: 'flex', gap: 16 }}>
        {images.map((img, i) => (
          <ImageWithFallback key={i} src={img} alt={product.name + ' image ' + (i + 1)} width={400} height={400} />
        ))}
      </div>
      <div className="product-detail__info">
        <p>{product.description}</p>
        <p>Price: {product.price}</p>
        {/* Add more product fields as needed */}
      </div>
    </main>
  );
}
