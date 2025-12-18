// src/pages/Product.jsx
import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FiHeart, FiBarChart2 } from "react-icons/fi";
import axios from "axios";
import { toast } from "react-toastify";

import { useProducts } from "../context/ProductContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import { useCompare } from "../context/CompareContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

function Product() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { loading, getProductBySlug, getProductsByIds, getProductsByCategory } =
    useProducts();
  const { addItem } = useCart();
  const { items: wishlistItems, toggleItem } = useWishlist();
  const { items: compareItems, addItem: addCompare } = useCompare();
  const { user, isAuthenticated } = useAuth();

  const product = getProductBySlug(slug);

  // -----------------------------
  // STATE
  // -----------------------------
  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeVariantId, setActiveVariantId] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState("description");
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);

  // -----------------------------
  // When product loads/changes: reset image index & init variant
  // -----------------------------
  useEffect(() => {
    setActiveImage(0);

    if (product?.variants?.length > 0) {
      setActiveVariantId(product.variants[0].id);
    } else {
      setActiveVariantId(null);
    }
  }, [product]);

  // -----------------------------
  // RECENTLY VIEWED TRACKER
  // -----------------------------
  useEffect(() => {
    if (!product) return;
    try {
      const key = "skytech_recently_viewed";
      const stored = localStorage.getItem(key);
      const list = stored ? JSON.parse(stored) : [];
      const next = [product.id, ...list.filter((x) => x !== product.id)].slice(
        0,
        6
      );
      localStorage.setItem(key, JSON.stringify(next));
    } catch {}
  }, [product]);

  // -----------------------------
  // MEMOIZED ACTIVE VARIANT
  // -----------------------------
  const variant = useMemo(() => {
    if (!product?.variants) return null;
    return product.variants.find((v) => v.id === activeVariantId) ?? null;
  }, [product, activeVariantId]);

  // -----------------------------
  // RELATED & RECOMMENDED PRODUCTS
  // -----------------------------
  const related = useMemo(() => {
    if (!product) return [];
    const byCat = getProductsByCategory(product.categorySlug)
      .filter((p) => p.id !== product.id)
      .slice(0, 8);

    const byIds = getProductsByIds(product.relatedIds ?? []);

    const merged = [...byIds, ...byCat];
    const map = new Map();
    merged.forEach((p) => map.set(p.id, p));

    return Array.from(map.values()).slice(0, 8);
  }, [product, getProductsByCategory, getProductsByIds]);

  const recommended = useMemo(() => {
    if (!product) return [];
    const byIds = getProductsByIds(product.recommendedIds ?? []);
    if (byIds.length > 0) return byIds;

    // fallback: API may not provide brandSlug; compare by brand or brandSlug if available
    const approx = getProductsByCategory(product.categorySlug).filter((p) => {
      const sameBrand =
        (p.brandSlug && product.brandSlug && p.brandSlug === product.brandSlug) ||
        (p.brand && product.brand && p.brand === product.brand);
      const closePrice = Math.abs((p.price ?? 0) - (product.price ?? 0)) <= 200;
      return sameBrand || closePrice;
    });

    return approx.filter((p) => p.id !== product.id).slice(0, 8);
  }, [product, getProductsByIds, getProductsByCategory]);

  // -----------------------------
  // ADD TO CART HANDLERS
  // -----------------------------
  const handleAddToCart = () => {
    if (!product) return;
    const v = variant ?? product.variants?.[0];
    addItem({
      id: product.id,
      title: product.title,
      price: v?.price ?? product.price,
      image:
        // use variant image if you have one; otherwise use thumbnail
        product.thumbnail ?? "",
      quantity,
      variantId: v?.id ?? "default",
      variantLabel:
        [v?.color, v?.storage, v?.ram, v?.size].filter(Boolean).join(" / ") ||
        "Default",
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/checkout");
  };

  const isWished = wishlistItems.some((i) => i.id === product?.id);
  const isCompared = compareItems.some((i) => i.id === product?.id);

  // -----------------------------
  // RENDER
  // -----------------------------
  if (loading) {
    return (
      <div className="container py-16">
        <div className="rounded-3xl border border-neutral-200 bg-white p-8 text-center">
          <p className="text-lg font-semibold">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-16">
        <div className="rounded-3xl border border-neutral-200 bg-white p-8 text-center">
          <p className="text-lg font-semibold">Product not found</p>
          <Link
            to="/shop"
            className="mt-4 inline-flex rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white"
          >
            Back to shop
          </Link>
        </div>
      </div>
    );
  }

  // Helper: resolve active image file name (product.images is array of objects)
  const resolveImageName = (index) => {
    const imgs = product.images ?? [];
    if (!imgs || imgs.length === 0) return product.thumbnail ?? "";
    const obj = imgs[index] ?? imgs[0];
    // some backends might use `name` or `image` — prefer `name`, fallback to `image`
    return obj?.name ?? obj?.image ?? product.thumbnail ?? "";
  };

  const activeImageName = resolveImageName(activeImage);

  return (
    <>
      <Helmet>
        <title>{product.title} — SkyTech</title>
        <meta name="description" content={product.description} />
        <meta property="og:title" content={product.title} />
        <meta property="og:description" content={product.description} />
      </Helmet>

      <div className="container py-10">
        {/* ------------ PRODUCT GRID ------------ */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* ------------ IMAGES ------------ */}
          <div className="space-y-4">
            <div className="relative rounded-3xl border border-neutral-200 bg-white p-6">
              <img
                src={`${import.meta.env.VITE_BASE_MEDIA_URL}/products/${activeImageName}`}
                alt={product.title}
                className="mx-auto h-96 w-full object-contain"
                onClick={() => setLightboxOpen(true)}
              />
            </div>

            <div className="flex flex-wrap gap-3">
              {(product.images ?? []).length > 0 ? (
                (product.images ?? []).map((imgObj, idx) => {
                  const name = imgObj?.name ?? imgObj?.image ?? product.thumbnail;
                  return (
                    <button
                      key={imgObj.id ?? `${name}-${idx}`}
                      type="button"
                      onClick={() => setActiveImage(idx)}
                      className={`h-20 w-20 rounded-2xl border ${
                        idx === activeImage ? "border-primary" : "border-neutral-200"
                      } bg-white p-2`}
                    >
                      <img
                        src={`${import.meta.env.VITE_BASE_MEDIA_URL}/products/${name}`}
                        alt={product.title}
                        className="h-full w-full object-contain"
                      />
                    </button>
                  );
                })
              ) : (
                // fallback: single thumbnail as button
                <button
                  key={product.thumbnail ?? "thumb"}
                  type="button"
                  className="h-20 w-20 rounded-2xl border border-neutral-200 bg-white p-2"
                >
                  <img
                    src={`${import.meta.env.VITE_BASE_MEDIA_URL}/products/${product.thumbnail}`}
                    alt={product.title}
                    className="h-full w-full object-contain"
                  />
                </button>
              )}
            </div>
          </div>

          {/* ------------ INFO ------------ */}
          <div className="space-y-6">
            {/* Brand, Title, Price */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Link
                  to={`/shop?brand=${product.brandSlug ?? product.brand}`}
                  className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400"
                >
                  {product.brand}
                </Link>
                <span className="text-sm font-semibold text-yellow-500">
                  {product.rating} ★  ({product.reviewsCount})
                </span>
              </div>

              <h1 className="text-2xl font-bold text-neutral-900">
                {product.title}
              </h1>

              <div className="flex items-baseline gap-3">
                <p className="text-2xl font-semibold text-neutral-900">
                  ${(variant?.price ?? product.price).toFixed(2)}
                </p>

                {product.originalPrice && (
                  <span className="text-sm text-neutral-400 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}

                {product.discountPercent && (
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    -{product.discountPercent}%
                  </span>
                )}
              </div>

              <p className="text-sm text-neutral-600">{product.shippingEstimate}</p>
            </div>

            {/* ------------ VARIANTS ------------ */}
            {product.variants?.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm font-semibold text-neutral-700">Variants</p>

                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setActiveVariantId(v.id)}
                      className={`rounded-full border px-3 py-2 text-sm ${
                        activeVariantId === v.id
                          ? "border-neutral-900 bg-neutral-900 text-white"
                          : "border-neutral-200 bg-white text-neutral-700"
                      }`}
                    >
                      {[v.color, v.storage, v.ram, v.size].filter(Boolean).join(" / ")}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ------------ CART ACTIONS ------------ */}
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center rounded-full border border-neutral-200 bg-white p-1">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="h-9 w-9 rounded-full"
                >
                  -
                </button>

                <span className="w-12 text-center text-sm font-semibold">{quantity}</span>

                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(product.stock ?? 99, q + 1))}
                  className="h-9 w-9 rounded-full"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white"
              >
                Add to cart
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                className="rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white"
              >
                Buy now
              </button>

              <button
                type="button"
                aria-pressed={isWished}
                onClick={() =>
                  toggleItem({
                    id: product.id,
                    title: product.title,
                    thumbnail: product.thumbnail,
                    price: product.price,
                  })
                }
                className={`rounded-full border p-3 ${
                  isWished ? "border-primary text-primary" : "border-neutral-200 text-neutral-700"
                }`}
              >
                <FiHeart />
              </button>

              <button
                type="button"
                aria-pressed={isCompared}
                onClick={() =>
                  addCompare({
                    id: product.id,
                    title: product.title,
                    specs: product.shortSpecs, // consumer should handle array of objects
                  })
                }
                className={`rounded-full border p-3 ${
                  isCompared ? "border-secondary text-secondary" : "border-neutral-200 text-neutral-700"
                }`}
              >
                <FiBarChart2 />
              </button>
            </div>

            {/* ------------ SHORT SPECS ------------ */}
            <div className="flex flex-wrap gap-2 text-xs text-neutral-600">
              {product.shortSpecs?.map((spec) => (
                <span key={spec.id} className="rounded-full bg-neutral-100 px-3 py-1">
                  {spec.value}
                </span>
              ))}
            </div>

            {/* ------------ TABS ------------ */}
            <div className="rounded-3xl border border-neutral-200 bg-white">
              <div className="flex gap-2 border-b border-neutral-200 p-2">
                {["description", "specs", "reviews"].map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setTab(key)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold ${
                      tab === key ? "bg-neutral-900 text-white" : "bg-white text-neutral-700"
                    }`}
                  >
                    {key === "description" ? "Description" : key === "specs" ? "Specifications" : "Reviews"}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {tab === "description" && (
                  <div className="space-y-3">
                    <p className="text-sm text-neutral-700">{product.description}</p>

                    {product.highlights?.map((h) => (
                      <p key={h.id} className="text-sm text-neutral-600">
                        • {h.text}
                      </p>
                    ))}
                  </div>
                )}

                {tab === "specs" && (
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {[
                      ["SKU", product.sku],
                      ["Brand", product.brand],
                      ["Category", product.category],
                      ["Stock", product.stockStatus],
                      ["Warranty", product.warranty],
                    ].map(([k, v]) => (
                      <div
                        key={k}
                        className="flex items-center justify-between rounded-xl border border-neutral-100 bg-neutral-50 px-3 py-2"
                      >
                        <span className="text-neutral-500">{k}</span>
                        <span className="font-semibold text-neutral-900">{v}</span>
                      </div>
                    ))}
                  </div>
                )}

                {tab === "reviews" && (
                  <div className="space-y-4">
                    <p className="text-sm">
                      Rated {product.rating} <span className=" text-yellow-500">★ </span>  by {product.reviewsCount} customers
                    </p>

                    <form
                      className="space-y-3"
                      onSubmit={async (e) => {
                        e.preventDefault();
                        if (!isAuthenticated) {
                          toast.error("Please login to submit a review");
                          return;
                        }
                        if (!product?.id) return;
                        if (!reviewText.trim()) {
                          toast.error("Please write your review");
                          return;
                        }
                        try {
                          setSubmittingReview(true);
                          const payload = {
                            product_id: parseInt(product.id.replace(/^p-/, ""), 10),
                            user_id: Number(user?.id) || parseInt(user?.id, 10),
                            rating: Number(rating),
                            review: reviewText.trim(),
                          };
                          const { data } = await axios.post(
                            "http://localhost/elctro_Ecom_project/admin/api/testproductreview/save",
                            payload,
                            user?.token
                              ? { headers: { Authorization: `Bearer ${user.token}` } }
                              : undefined
                          );
                          console.log(data)
                          if (data?.success === "yes") {
                            toast.success("Review submitted");
                            setReviewText("");
                            setRating(5);
                          } else {
                            toast.error("Review not allowed");
                          }
                        } catch (err) {
                          toast.error(err.response?.data?.message || "Failed to submit review");
                        } finally {
                          setSubmittingReview(false);
                        }
                      }}
                    >
                      <select
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                        className="h-11 w-full rounded-xl border border-neutral-200 px-3 text-sm text-yellow-500"
                      >
                        <option value={5}>5 ★★★★★</option>
                        <option value={4}>4 ★★★★</option>
                        <option value={3}>3 ★★★</option>
                        <option value={2}>2 ★★</option>
                        <option value={1}>1 ★</option>
                      </select>

                      <textarea
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Write a review"
                        className="min-h-24 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
                      />

                      <button
                        type="submit"
                        disabled={submittingReview}
                        className="rounded-full bg-neutral-900 px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
                      >
                        {submittingReview ? "Submitting..." : "Submit review"}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ------------ RECOMMENDED ------------ */}
        {recommended.length > 0 && (
          <div className="mt-12 space-y-4">
            <h2 className="text-lg font-semibold">Recommended for you</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {recommended.map((p) => (
                <Link key={p.id} to={`/product/${p.slug}`} className="rounded-2xl border border-neutral-200 bg-white p-4">
                  <img src={`${import.meta.env.VITE_BASE_MEDIA_URL}/products/${p.thumbnail}`} alt={p.title} className="h-32 w-full object-cover" />
                  <p className="mt-2 text-sm font-semibold">{p.title}</p>
                  <p className="text-sm text-neutral-600">${(p.price ?? 0).toFixed(2)}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ------------ RELATED ------------ */}
        {related.length > 0 && (
          <div className="mt-12 space-y-4">
            <h2 className="text-lg font-semibold">Related products</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {related.map((p) => (
                <Link key={p.id} to={`/product/${p.slug}`} className="rounded-2xl border border-neutral-200 bg-white p-4">
                  <img src={`${import.meta.env.VITE_BASE_MEDIA_URL}/products/${p.thumbnail}`} alt={p.title} className="h-32 w-full object-cover" />
                  <p className="mt-2 text-sm font-semibold">{p.title}</p>
                  <p className="text-sm text-neutral-600">${(p.price ?? 0).toFixed(2)}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ------------ LIGHTBOX ------------ */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxOpen(false)}
          >
            <motion.img
              src={`${import.meta.env.VITE_BASE_MEDIA_URL}/products/${activeImageName}`}
              alt={product.title}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1.5 }}
              exit={{ scale: 0.9 }}
              className="absolute left-[40%] top-1/3 max-h-[90vh] w-auto -translate-x-1/2 -translate-y-1/2 object-cover"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Product;
