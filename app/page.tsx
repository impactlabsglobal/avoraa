"use client";

import { useMemo, useState } from "react";

const initialProducts = [
  {
    id: "sculpt-black",
    name: "Legging Sculpt",
    color: "Black / Signature fit",
    price: 39.99,
    image:
      "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=1100&q=88",
    alt: "Mujer usando leggings negros de cintura alta",
    tag: "Best seller",
  },
  {
    id: "flex-rose",
    name: "Legging Flex",
    color: "Rose / Soft compression",
    price: 42.99,
    image:
      "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=1100&q=88",
    alt: "Mujer con conjunto deportivo color rosa",
    tag: "New drop",
  },
  {
    id: "motion",
    name: "Licra Motion",
    color: "Onyx / Light performance",
    price: 34.99,
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1100&q=88",
    alt: "Mujer usando ropa deportiva durante entrenamiento",
    tag: "Everyday",
  },
  {
    id: "studio-sand",
    name: "Studio Legging",
    color: "Sand / Soft stretch",
    price: 44.99,
    image:
      "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=1100&q=88",
    alt: "Mujer entrenando con ropa deportiva clara",
    tag: "New color",
  },
  {
    id: "daily-olive",
    name: "Daily Rib",
    color: "Olive / Ribbed texture",
    price: 37.99,
    image:
      "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=1100&q=88",
    alt: "Mujer usando leggings deportivos en movimiento",
    tag: "Best seller",
  },
  {
    id: "flow-charcoal",
    name: "Flow Legging",
    color: "Charcoal / Everyday support",
    price: 41.99,
    image:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1100&q=88",
    alt: "Mujer realizando ejercicio con ropa deportiva",
    tag: "Easy fit",
  },
];

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

type Product = (typeof initialProducts)[number];

export default function Home() {
  const [products, setProducts] = useState(initialProducts);
  const [cart, setCart] = useState<{ id: string; size: string }[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [ownerOpen, setOwnerOpen] = useState(false);
  const [ownerTab, setOwnerTab] = useState<"products" | "promos">("products");
  const [promoCodes, setPromoCodes] = useState<{ code: string; discount: number }[]>([]);
  const [productForm, setProductForm] = useState({ name: "", price: "", color: "", image: "", tag: "New" });
  const [promoForm, setPromoForm] = useState({ code: "", discount: "10" });
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [toast, setToast] = useState("");
  const sizes = ["S", "M", "L", "XL"];

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + (products.find((product) => product.id === item.id)?.price ?? 0), 0),
    [cart],
  );
  const shipping = subtotal === 0 || subtotal >= 75 ? 0 : 7.5;

  function openProduct(product: Product) {
    setSelectedSize(null);
    setActiveProduct(product);
  }

  function addToCart(product: Product, size = selectedSize) {
    if (!size) {
      setToast("Elige una talla para continuar");
      window.setTimeout(() => setToast(""), 2600);
      return;
    }
    setCart((current) => [...current, { id: product.id, size }]);
    setActiveProduct(null);
    setCartOpen(true);
    setToast(`${product.name} agregado al carrito`);
    window.setTimeout(() => setToast(""), 2600);
  }

  function createProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = productForm.name.trim();
    const price = Number(productForm.price);
    if (!name || !price) return;
    setProducts((current) => [...current, {
      id: `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`,
      name,
      color: productForm.color.trim() || "New / Everyday fit",
      price,
      image: productForm.image.trim() || initialProducts[0].image,
      alt: `${name} de Avoraa Fit`,
      tag: productForm.tag.trim() || "New",
    }]);
    setProductForm({ name: "", price: "", color: "", image: "", tag: "New" });
    setToast("Producto agregado a la tienda");
    window.setTimeout(() => setToast(""), 2600);
  }

  function createPromo(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const code = promoForm.code.trim().toUpperCase();
    const discount = Number(promoForm.discount);
    if (!code || !discount) return;
    setPromoCodes((current) => [...current, { code, discount }]);
    setPromoForm({ code: "", discount: "10" });
    setToast(`Código ${code} creado`);
    window.setTimeout(() => setToast(""), 2600);
  }

  function checkout() {
    const lines = cart.map((item) => {
      const product = products.find((entry) => entry.id === item.id);
      return `• ${product?.name} — talla ${item.size} — ${money.format(product?.price ?? 0)}`;
    });
    const message = `Hola Avoraa, quiero ordenar:\n${lines.join("\n")}\n\nSubtotal: ${money.format(subtotal)}\nEnvío: ${shipping === 0 ? "Gratis" : money.format(shipping)}\nTotal: ${money.format(subtotal + shipping)}`;
    window.open(`https://wa.me/18095550000?text=${encodeURIComponent(message)}`, "_blank");
  }

  return (
    <main className="site-shell">
      <div className="content" id="top">
        <header className="topbar">
          <a className="brand" href="#top" aria-label="Avoraa inicio">avor<span>aa</span></a>
          <p>Free shipping on orders over $75</p>
          <div className="topbar-actions"><button className="owner-trigger" onClick={() => setOwnerOpen(true)}>Owner</button><button className="cart-trigger" onClick={() => setCartOpen(true)} aria-label="Abrir carrito">Bag <span>{String(cart.length).padStart(2, "0")}</span></button></div>
        </header>

        <section className="shop-header" id="producto">
          <div><p className="kicker">Avoraa leggings</p><h1>Shop your<br /><em>everyday fit.</em></h1></div>
          <p>Simple pieces. Easy support. Choose your legging, select your size, and add it to your bag.</p>
        </section>

        <section className="collection" id="collection">
          <div className="section-intro"><p className="kicker">01 / The collection</p><p>Small-batch pieces made for your big days.</p></div>
          <div className="product-grid">
            {products.map((product, index) => (
              <article className="product-card" key={product.id}>
                <button className="product-image" onClick={() => setActiveProduct(product)} aria-label={`Ver detalle de ${product.name}`}>
                  <img src={product.image} alt={product.alt} />
                  <span className="product-tag">{product.tag}</span>
                  <span className="quick-view">Choose options +</span>
                </button>
                <div className="product-meta"><div><p className="product-number">0{index + 1}</p><h2>{product.name}</h2><p>{product.color}</p></div><strong>{money.format(product.price)}</strong></div>
                <button className="add-link" onClick={() => openProduct(product)}>Choose size <span>+</span></button>
              </article>
            ))}
          </div>
        </section>

        <section className="about-strip" id="about">
          <div><p className="kicker">The Avoraa feeling</p><h2>Made to move<br /><em>with you.</em></h2></div>
          <div><p>Thoughtful fits, soft-touch fabrics, and the kind of confidence that stays with you from your first rep to your last errand.</p><a className="text-link" href="#contacto">Get to know us <span>↗</span></a></div>
        </section>

        <section className="contact-section" id="contacto">
          <div><p className="kicker">Say hello</p><h2>Questions?<br /><em>We&apos;re here.</em></h2></div>
          <div className="contact-details"><p>For sizing help, order questions, or just to say hi.</p><a href="mailto:hello@avoraa.fit">hello@avoraa.fit ↗</a><a href="https://instagram.com/avoraa.fit" target="_blank" rel="noreferrer">@avoraa.fit ↗</a></div>
        </section>

        <footer>
          <div className="footer-brand"><a className="brand" href="#top">avor<span>aa</span></a><p>Made for movement. Built for you.</p></div>
          <div className="footer-socials" aria-label="Redes sociales">
            <span className="footer-label">Follow Avoraa</span>
            <a href="https://instagram.com/avoraa.fit" target="_blank" rel="noreferrer">Instagram ↗</a>
            <a href="https://wa.me/18095550000" target="_blank" rel="noreferrer">WhatsApp ↗</a>
            <a href="https://tiktok.com/@avoraa.fit" target="_blank" rel="noreferrer">TikTok ↗</a>
          </div>
          <span>avoraa.fit</span>
        </footer>
      </div>

      {ownerOpen && <div className="owner-backdrop" onClick={() => setOwnerOpen(false)}><aside className="owner-panel" onClick={(event) => event.stopPropagation()}><div className="owner-heading"><div><p className="kicker">Avoraa admin</p><h2>Panel del dueño</h2></div><button className="close-button" onClick={() => setOwnerOpen(false)} aria-label="Cerrar panel">×</button></div><div className="owner-tabs"><button className={ownerTab === "products" ? "active" : ""} onClick={() => setOwnerTab("products")}>Productos</button><button className={ownerTab === "promos" ? "active" : ""} onClick={() => setOwnerTab("promos")}>Promociones</button></div>{ownerTab === "products" ? <><form className="owner-form" onSubmit={createProduct}><h3>Agregar producto</h3><label>Nombre<input required value={productForm.name} onChange={(event) => setProductForm({ ...productForm, name: event.target.value })} placeholder="Legging Sculpt" /></label><div className="owner-form-row"><label>Precio<input required type="number" min="0" step="0.01" value={productForm.price} onChange={(event) => setProductForm({ ...productForm, price: event.target.value })} placeholder="39.99" /></label><label>Etiqueta<input value={productForm.tag} onChange={(event) => setProductForm({ ...productForm, tag: event.target.value })} placeholder="New" /></label></div><label>Color / descripción corta<input value={productForm.color} onChange={(event) => setProductForm({ ...productForm, color: event.target.value })} placeholder="Black / Signature fit" /></label><label>URL de imagen<input type="url" value={productForm.image} onChange={(event) => setProductForm({ ...productForm, image: event.target.value })} placeholder="https://..." /></label><button className="modal-add" type="submit">Agregar a la tienda +</button></form><div className="owner-list"><p className="owner-list-title">{products.length} productos activos</p>{products.slice(-4).reverse().map((product) => <div className="owner-list-item" key={product.id}><span>{product.name}</span><strong>{money.format(product.price)}</strong></div>)}</div></> : <><form className="owner-form" onSubmit={createPromo}><h3>Crear código promocional</h3><label>Código<input required value={promoForm.code} onChange={(event) => setPromoForm({ ...promoForm, code: event.target.value })} placeholder="AVO10" /></label><label>Descuento %<input required type="number" min="1" max="100" value={promoForm.discount} onChange={(event) => setPromoForm({ ...promoForm, discount: event.target.value })} /></label><button className="modal-add" type="submit">Crear código +</button></form><div className="owner-list"><p className="owner-list-title">Códigos activos</p>{promoCodes.length === 0 ? <p className="owner-empty">Todavía no hay códigos creados.</p> : promoCodes.map((promo) => <div className="owner-list-item" key={promo.code}><span>{promo.code}</span><strong>{promo.discount}% OFF</strong></div>)}</div></>}</aside></div>}

      {activeProduct && <div className="modal-backdrop" onClick={() => setActiveProduct(null)}><div className="product-modal" onClick={(event) => event.stopPropagation()}><button className="close-button" onClick={() => setActiveProduct(null)} aria-label="Cerrar">×</button><img src={activeProduct.image} alt={activeProduct.alt} /><div className="modal-copy"><p className="kicker">{activeProduct.tag}</p><h2>{activeProduct.name}</h2><p className="modal-color">{activeProduct.color}</p><strong className="modal-price">{money.format(activeProduct.price)}</strong><p className="modal-description">Soft, supportive, and made to move. Your new go-to layer for training, travel, and everything between.</p><div className="size-picker"><p>Select your size <span>Required</span></p>{sizes.map((size) => <button className={selectedSize === size ? "selected" : ""} key={size} onClick={() => setSelectedSize(size)}>{size}</button>)}</div><button className={`modal-add ${selectedSize ? "" : "disabled"}`} disabled={!selectedSize} onClick={() => addToCart(activeProduct)}>{selectedSize ? `Add to bag — ${money.format(activeProduct.price)}` : "Select a size to add"}</button><p className="shipping-note">Free shipping on orders over $75</p></div></div></div>}

      {cartOpen && <div className="cart-drawer-backdrop" onClick={() => setCartOpen(false)}><aside className="cart-drawer" onClick={(event) => event.stopPropagation()}><div className="drawer-header"><div><p className="kicker">Your bag</p><h2>{cart.length} {cart.length === 1 ? "piece" : "pieces"}</h2></div><button className="close-button" onClick={() => setCartOpen(false)} aria-label="Cerrar carrito">×</button></div>{cart.length === 0 ? <div className="empty-cart"><p>Your bag is waiting.</p><a href="#collection" onClick={() => setCartOpen(false)}>Shop the collection →</a></div> : <><div className="cart-items">{cart.map((item, index) => { const product = products.find((entry) => entry.id === item.id)!; return <div className="cart-item" key={`${item.id}-${index}`}><img src={product.image} alt="" /><div><h3>{product.name}</h3><p>Size {item.size}</p><strong>{money.format(product.price)}</strong></div><button onClick={() => setCart((current) => current.filter((_, itemIndex) => itemIndex !== index))} aria-label={`Eliminar ${product.name}`}>×</button></div> })}</div><div className="cart-summary"><div><span>Subtotal</span><strong>{money.format(subtotal)}</strong></div><div><span>Shipping</span><strong>{shipping === 0 ? "Free" : money.format(shipping)}</strong></div><div className="total"><span>Total</span><strong>{money.format(subtotal + shipping)}</strong></div><p className="points-note">Earn {Math.round(subtotal)} Avoraa points on this order.</p><button className="modal-add" onClick={checkout}>Checkout via WhatsApp ↗</button><p className="shipping-note">Secure checkout coming soon. We&apos;ll confirm your order personally.</p></div></>}</aside></div>}
      {toast && <div className="toast">{toast}</div>}
    </main>
  );
}
