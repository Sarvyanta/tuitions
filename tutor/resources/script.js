
document.addEventListener("DOMContentLoaded",()=>{
  const menu=document.querySelector(".menu"), links=document.querySelector(".links");
  if(menu&&links) menu.addEventListener("click",()=>links.classList.toggle("show"));
  document.querySelectorAll("[data-year]").forEach(e=>e.textContent=new Date().getFullYear());
});
