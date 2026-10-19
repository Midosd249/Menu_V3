const OPEN_PUBLIC_MENU_PRODUCT_DETAILS = "menu-v3:open-product-details";

type ProductDetailsListener = (productId: string) => void;

let activeListeners = 0;
let pendingProductId: string | null = null;

export function requestPublicMenuProductDetails(productId: string): void {
  if (typeof window === "undefined" || !productId) return;
  if (activeListeners === 0) pendingProductId = productId;
  window.dispatchEvent(new CustomEvent(OPEN_PUBLIC_MENU_PRODUCT_DETAILS, { detail: { productId } }));
}

export function listenForPublicMenuProductDetails(listener: ProductDetailsListener): () => void {
  if (typeof window === "undefined") return () => undefined;

  const handleRequest = (event: Event) => {
    if (!(event instanceof CustomEvent)) return;
    const productId = event.detail?.productId;
    if (typeof productId === "string" && productId.length > 0) listener(productId);
  };

  window.addEventListener(OPEN_PUBLIC_MENU_PRODUCT_DETAILS, handleRequest);
  activeListeners += 1;
  if (pendingProductId) {
    const productId = pendingProductId;
    pendingProductId = null;
    listener(productId);
  }

  return () => {
    window.removeEventListener(OPEN_PUBLIC_MENU_PRODUCT_DETAILS, handleRequest);
    activeListeners = Math.max(0, activeListeners - 1);
  };
}
