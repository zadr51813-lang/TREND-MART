// ===============================
// TREND MART LUXE
// Add/edit products in this array.
// Replace the emoji with image paths later if needed.
// ===============================
const products = [
  {
    id: 1,
    name: "Heart Pendant Necklace (tarnish proof)",
    category: "Jewellery",
    price: 449,
    oldPrice: 899,
    icon: "❤️",
    images: [
  "heart-model.jpg",
  "heart-premium.jpg",
  "heart-details.jpg"
],
    description: "Elegant heart pendant necklace crafted for a timeless and stylish look. Made for everyday wear with a beautiful polished finish. Lightweight, comfortable and perfect for gifting.",
    features: [
      "Anti-Tarnish",
      "Water Resistant",
      "Lightweight",
      "Daily Wear",
      "Perfect Gift"
    ]
  }
];

let cart = JSON.parse(localStorage.getItem("tml_cart") || "[]");
let activeFilter = "All";

const grid = document.getElementById("productGrid");
const empty = document.getElementById("emptyState");
const search = document.getElementById("searchInput");
const sort = document.getElementById("sortSelect");
const count = document.getElementById("cartCount");
const drawer = document.getElementById("cartDrawer");
const backdrop = document.getElementById("backdrop");
const toast = document.getElementById("toast");

function money(n){ return "₹" + n.toLocaleString("en-IN"); }

function renderProducts(){
  const q = search.value.trim().toLowerCase();

  let list = products.filter(p =>
    (activeFilter === "All" || p.category === activeFilter) &&
    (p.name.toLowerCase().includes(q) ||
     p.category.toLowerCase().includes(q))
  );

  if(sort.value === "low") list.sort((a,b)=>a.price-b.price);
  if(sort.value === "high") list.sort((a,b)=>b.price-a.price);

  grid.innerHTML = list.map(p => `
    <article class="product-card">

      <div class="product-image"
           style="display:flex;overflow-x:auto;scroll-snap-type:x mandatory;gap:0;background:#f8f4ee;">

        ${p.images.map(img => `
          <img src="${img}"
               alt="${p.name}"
               style="width:100%;min-width:100%;height:360px;object-fit:cover;flex:0 0 100%;scroll-snap-align:start;display:block;">
        `).join("")}

      </div>

      <div class="product-info">

        <span class="tag">${p.category}</span>

        <h3>${p.name}</h3>

        <p style="color:#666;line-height:1.6;margin:10px 0;">
          ${p.description}
        </p>

        <div style="margin:12px 0;">
          <span style="text-decoration:line-through;color:#999;font-size:16px;">
            ${money(p.oldPrice)}
          </span>

          <strong style="font-size:26px;margin-left:8px;">
            ${money(p.price)}
          </strong>

          <span style="background:#111;color:#fff;padding:5px 8px;border-radius:5px;margin-left:8px;font-size:12px;">
            50% OFF
          </span>
        </div>

        <div style="display:flex;flex-wrap:wrap;gap:7px;margin:12px 0;">
          ${p.features.map(f => `
            <span style="border:1px solid #ddd;border-radius:20px;padding:6px 10px;font-size:12px;">
              ✓ ${f}
            </span>
          `).join("")}
        </div>

        <button class="add"
                onclick="addToCart(${p.id})"
                style="width:100%;margin-top:10px;">
          Add to Cart
        </button>

      </div>
    </article>
  `).join("");

  empty.hidden = list.length !== 0;
}
}

function addToCart(id){
  const item = cart.find(x=>x.id===id);
  if(item) item.qty++;
  else cart.push({id,qty:1});
  saveCart();
  showToast("Added to cart ✓");
}

function saveCart(){
  localStorage.setItem("tml_cart",JSON.stringify(cart));
  renderCart();
}

function renderCart(){
  const items = cart.map(item => {
    const p = products.find(x=>x.id===item.id);
    return p ? {...p,qty:item.qty} : null;
  }).filter(Boolean);

  count.textContent = items.reduce((s,x)=>s+x.qty,0);
  document.getElementById("cartItems").innerHTML = items.length ? items.map(x=>`
    <div class="cart-item">
      <div class="mini">${x.icon}</div>
      <div><h4>${x.name}</h4><small>${money(x.price)} × ${x.qty}</small></div>
      <div class="qty">
        <button onclick="changeQty(${x.id},-1)">−</button>
        <button onclick="changeQty(${x.id},1)">+</button>
      </div>
    </div>
  `).join("") : '<p style="text-align:center;color:#888;padding:50px 0">Your cart is empty.</p>';

  const total = items.reduce((s,x)=>s+x.price*x.qty,0);
  document.getElementById("cartTotal").textContent = money(total);
}

function changeQty(id,delta){
  const item = cart.find(x=>x.id===id);
  if(!item) return;
  item.qty += delta;
  if(item.qty <= 0) cart = cart.filter(x=>x.id!==id);
  saveCart();
}

function openCart(){drawer.classList.add("open");backdrop.classList.add("show");drawer.setAttribute("aria-hidden","false")}
function closeCart(){drawer.classList.remove("open");backdrop.classList.remove("show");drawer.setAttribute("aria-hidden","true")}
function showToast(msg){toast.textContent=msg;toast.classList.add("show");setTimeout(()=>toast.classList.remove("show"),1800)}

document.getElementById("cartBtn").onclick=openCart;
document.getElementById("closeCart").onclick=closeCart;
backdrop.onclick=closeCart;
search.oninput=renderProducts;
sort.onchange=renderProducts;

document.querySelectorAll(".filter").forEach(btn=>{
  btn.onclick=()=>{
    document.querySelectorAll(".filter").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    activeFilter=btn.dataset.filter;
    renderProducts();
  };
});

document.querySelectorAll(".category-card").forEach(btn=>{
  btn.onclick=()=>{
    activeFilter=btn.dataset.category;
    document.querySelectorAll(".filter").forEach(b=>b.classList.toggle("active",b.dataset.filter===activeFilter));
    document.getElementById("shop").scrollIntoView({behavior:"smooth"});
    renderProducts();
  };
});

document.getElementById("menuBtn").onclick=()=>document.getElementById("navMenu").classList.toggle("open");
document.querySelectorAll("#navMenu a").forEach(a=>a.onclick=()=>document.getElementById("navMenu").classList.remove("open"));

document.getElementById("checkoutBtn").onclick=()=>{
  if(!cart.length){
    showToast("Cart is empty");
    return;
  }

  let message = "Hello Trend Mart Luxe!%0A%0AI want to place an order:%0A";

  cart.forEach(item=>{
    const p = products.find(x=>x.id===item.id);
    if(p){
      message += `%0A${p.name} x ${item.qty} — ₹${p.price * item.qty}`;
    }
  });

  const total = cart.reduce((sum,item)=>{
    const p = products.find(x=>x.id===item.id);
    return sum + (p ? p.price * item.qty : 0);
  },0);

  message += `%0A%0ATotal: ₹${total}`;
  message += "%0A%0AName:%0AAddress:%0APhone:";

  window.open("https://wa.me/918369511325?text="+message,"_blank");
};

document.getElementById("year").textContent=new Date().getFullYear();
renderProducts();
renderCart();
