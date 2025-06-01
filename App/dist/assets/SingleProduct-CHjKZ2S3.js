import{j as e,S as O,d as z,c as B,a as D,B as y}from"./index-DcckHycf.js";import{f as E,u as I,r as l}from"./vendor-MgaVaktg.js";import{d as t}from"./ui-BzfpwB1b.js";const A=({product:o})=>{if(!o)return null;const{name:c,description:r,price:p,images:s,category:u,_id:m,flavors:d=[]}=o,g=r?r.replace(/<[^>]*>?/gm,""):"",f={"@context":"https://schema.org","@type":"Product",name:c,description:g,image:s&&s.length>0?s.map(a=>`${window.location.origin}${a}`):[],sku:m,mpn:m,brand:{"@type":"Brand",name:"Power Supplement"},offers:{"@type":"Offer",url:window.location.href,price:p,priceCurrency:"USD",availability:"https://schema.org/InStock",seller:{"@type":"Organization",name:"Power Supplement"}}};d&&d.length>0&&(f.offers={"@type":"AggregateOffer",priceCurrency:"USD",lowPrice:p,highPrice:p,offerCount:d.length,offers:d.map(a=>({"@type":"Offer",name:`${c} - ${a.name}`,price:p,priceCurrency:"USD",availability:"https://schema.org/InStock",itemCondition:"https://schema.org/NewCondition"}))});const h=[c,(u==null?void 0:u.name)||"","sports supplement",...d.map(a=>a.name),"fitness","workout","nutrition"].filter(Boolean);return e.jsx(O,{title:c,description:g.substring(0,160)||`Buy ${c} - Premium quality sports supplement for optimal performance.`,canonicalUrl:`/product/${m}`,ogImage:s&&s.length>0?s[0]:"/PowerLogo.png",ogType:"product",keywords:h,structuredData:f})},ce=()=>{var j;const{id:o}=E(),c=I(),[r,p]=l.useState(null),[s,u]=l.useState(""),[m,d]=l.useState(1),[g,f]=l.useState(!0),[h,a]=l.useState(""),[b,v]=l.useState(!1),{addToCart:k}=z(),{user:C}=B();l.useEffect(()=>{(async()=>{try{const i=await D.get(`${y}/api/v1/products/${o}`);p(i.data),i.data.images&&i.data.images.length>0&&a(`${y}${i.data.images[0]}`),i.data.flavors&&i.data.flavors.length>0&&u(i.data.flavors[0]._id),f(!1)}catch(i){console.error("Error fetching product:",i),f(!1)}})()},[o]);const w=n=>{d(i=>Math.max(1,i+n))},P=async()=>{if(!C){c("/auth");return}if(r.stock!==0){v(!0);try{await k(r._id,m)}catch(n){console.error("Error adding to cart:",n)}finally{v(!1)}}};if(g)return e.jsx(F,{children:"Loading..."});if(!r)return e.jsx(Q,{children:"Product not found"});const x=n=>`${y}${n}`;return e.jsxs(T,{children:[e.jsx(A,{product:r}),e.jsxs(R,{children:[e.jsxs(_,{children:[e.jsx(L,{src:h,alt:r.name}),e.jsx(N,{children:(j=r.images)==null?void 0:j.map((n,i)=>e.jsx(U,{src:x(n),alt:`${r.name} view ${i+1}`,onClick:()=>a(x(n)),$active:h===x(n)},i))})]}),e.jsxs(M,{children:[e.jsx(q,{children:"Power Supplement"}),e.jsx(G,{children:r.name}),e.jsxs(H,{children:[e.jsxs(J,{children:["Rs. ",r.price," NPR"]}),e.jsxs(K,{children:["Rs. ",Math.trunc(r.price*.9)," NPR"]}),e.jsx(V,{children:"Sale"})]}),e.jsxs(W,{children:["Only Rs. ",(r.price*.9/2500).toFixed(2)," per serving"]}),r.flavors&&r.flavors.length>0&&e.jsxs(X,{children:[e.jsx(S,{children:"Flavor"}),e.jsx(Y,{children:r.flavors.map(n=>e.jsx(Z,{$selected:s===n._id,onClick:()=>u(n._id),children:n.name},n._id))})]}),e.jsxs(ee,{children:[e.jsx(S,{children:"Quantity"}),e.jsxs(te,{children:[e.jsx($,{onClick:()=>w(-1),children:"−"}),e.jsx(re,{children:m}),e.jsx($,{onClick:()=>w(1),children:"+"})]})]}),e.jsx(oe,{onClick:P,disabled:r.stock===0||b,$outOfStock:r.stock===0,children:b?"Adding...":r.stock===0?"Out of Stock":"Add to Cart"}),e.jsxs(ne,{children:[e.jsx("h3",{children:"Description"}),e.jsx("p",{children:r.description})]})]})]})]})},T=t.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
`,F=t.div`
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
`,Q=t.div`
  text-align: center;
  padding: 2rem;
  color: red;
`,R=t.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  padding: 2rem 0;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`,_=t.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`,L=t.img`
  width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`,N=t.div`
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding: 0.5rem 0;
`,U=t.img`
  width: 60px;
  height: 60px;
  border-radius: 4px;
  cursor: pointer;
  border: 2px solid ${o=>o.$active?"#007bff":"transparent"};
  transition: all 0.2s;
  
  &:hover {
    opacity: 0.8;
  }
`,M=t.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`,q=t.div`
  font-size: 0.9rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 1px;
`,G=t.h1`
  font-size: 2rem;
  margin: 0;
  color: #333;
`,H=t.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`,J=t.span`
  color: #999;
  text-decoration: line-through;
  font-size: 1.2rem;
`,K=t.span`
  color: #333;
  font-size: 1.5rem;
  font-weight: bold;
`,V=t.span`
  background-color: #ff4444;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.9rem;
`,W=t.div`
  color: #666;
  font-size: 0.9rem;
`,X=t.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`,S=t.label`
  font-weight: 600;
  color: #333;
`,Y=t.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`,Z=t.button`
  padding: 0.5rem 1rem;
  border: 2px solid ${o=>o.$selected?"#007bff":"#ddd"};
  background: ${o=>o.$selected?"#007bff":"white"};
  color: ${o=>o.$selected?"white":"#333"};
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #007bff;
  }
`,ee=t.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`,te=t.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`,$=t.button`
  width: 36px;
  height: 36px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #f5f5f5;
  }
`,re=t.span`
  min-width: 40px;
  text-align: center;
  font-size: 1.1rem;
`,oe=t.button`
  padding: 1rem;
  background-color: ${o=>o.$outOfStock?"#cccccc":"cornflowerblue"};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: ${o=>o.$outOfStock?"not-allowed":"pointer"};
  transition: background-color 0.2s;

  &:hover {
    background-color: ${o=>o.$outOfStock?"#cccccc":"#007bff"};
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`,ne=t.div`
  h3 {
    margin: 0 0 1rem;
    color: #333;
  }

  p {
    color: #666;
    line-height: 1.6;
  }
`;export{ce as default};
//# sourceMappingURL=SingleProduct-CHjKZ2S3.js.map
