import{d as f,h as m,r as h,a as s,c as t,b as e,g as i,F as d,e as _,t as l,f as v,i as g,p as y,j as w,_ as b}from"./index-32d15492.js";const r=o=>(y("data-v-3858d9f2"),o=o(),w(),o),k={class:"w-full h-full flex"},C={class:"side-bar w-208px h-full flex flex-col"},F=r(()=>e("div",{class:"placeholder h-55px"},null,-1)),B={class:"text-2.5 text-#666"},I={class:"items list-none m-0 text-3.25"},S=["onClick"],D=r(()=>e("p",{class:"icon"},null,-1)),M={class:"content flex-1 h-full flex flex-col"},N={class:"top-bar flex items-center box-border px-20px h-55px bg-#F6F8F7"},V={class:"text-3.8 text-200"},j=f({__name:"index",setup(o){const p=m([{category:"个人收藏",items:[{name:"最近使用",icon:""},{name:"应用程序",icon:""},{name:"桌面",icon:""},{name:"下载",icon:""}]},{category:"iCloud",items:[{name:"iCloud云盘",icon:""},{name:"共享",icon:""}]},{category:"位置",items:[{name:"Data",icon:""}]}]),a=h("最近使用");return(z,E)=>(s(),t("div",k,[e("div",C,[F,e("div",{class:"px-16px overflow-auto h-fit flex-1",onMousedown:i(()=>null,["stop"])},[(s(!0),t(d,null,_(p,(c,u)=>(s(),t("div",{key:u,class:"not-first-of-type-pt-3 category"},[e("div",B,l(c.category),1),e("ul",I,[(s(!0),t(d,null,_(c.items,(n,x)=>(s(),t("li",{key:x,class:v({active:a.value===n.name}),onClick:()=>a.value=n.name},[D,g(" "+l(n.name),1)],10,S))),128))])]))),128))],32)]),e("div",M,[e("div",N,[e("div",V,l(a.value),1)]),e("div",{class:"flex-1 bg-white",onMousedown:i(()=>null,["stop"])},null,32)])]))}});const T=b(j,[["__scopeId","data-v-3858d9f2"]]);export{T as default};
