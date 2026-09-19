// ===============================
// TREND MART LUXE
// Add/edit products in this array.
// Replace the emoji with image paths later if needed.
// ===============================
const products = [
  {id:1,name:"Luxe Pendant",category:"Jewellery",price:799,icon:"💎"},
  {id:2,name:"Elegant Gold Set",category:"Jewellery",price:1299,icon:"✨"},
  {id:3,name:"Classic Tote",category:"Accessories",price:999,icon:"👜"},
  {id:4,name:"Signature Watch",category:"Accessories",price:1499,icon:"⌚"},
  {id:5,name:"Premium Kurti",category:"Fashion",price:899,icon:"👗"},
  {id:6,name:"Luxe Scarf",category:"Fashion",price:499,icon:"🧣"},
  {id:7,name:"Home Glow Set",category:"Lifestyle",price:699,icon:"🕯️"},
  {id:8,name:"Gift Box",category:"Lifestyle",price:599,icon:"🎁"}
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
    (p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
  );
  if(sort.value === "low") list.sort((a,b)=>a.price-b.price);
  if(sort.value === "high") list.sort((a,b)=>b.price-a.price);

  grid.innerHTML = list.map(p => `
    <article class="product-card">
      <div class="product-image"><div class="placeholder">${p.icon}</div></div>
      <div class="product-info">
        <span class="tag">${p.category}</span>
        <h3>${p.name}</h3>
        <div class="price">${money(p.price)}</div>
        <button class="add" onclick="addToCart(${p.id})">Add to Cart</button>
      </div>
    </article>
  `).join("");
  empty.hidden = list.length !== 0;
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
  if(!cart.length){showToast("Cart is empty");return;}
  // Replace this alert with your WhatsApp/payment/order API later.
  showToast("Order flow ready — connect WhatsApp/payment next.");
};

document.getElementById("year").textContent=new Date().getFullYear();
renderProducts();
renderCart();
