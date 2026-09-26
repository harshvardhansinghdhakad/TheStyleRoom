"use client";
import { Search, ShoppingBag, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/lib/cart';
type Category = 'home' | 'new' | 'dresses' | 'tops' | 'about' | 'journal';
type Props = { activeCategory: Category; onCategoryChange: (cat: Category) => void; searchQuery: string; onSearchChange: (q: string) => void };
export default function Header({ activeCategory, onCategoryChange, searchQuery, onSearchChange }: Props) {
 const { totalItems, openCart } = useCart(); const [open,setOpen]=useState(false); const nav=[['Women','dresses'],['Collections','tops'],['About','about'],['Journal','journal']] as const;
 return <>
  <header className="mobile-header md:hidden"><button onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button><button className="mobile-logo" onClick={()=>onCategoryChange('home')}>VYRA</button><button className="relative" onClick={openCart}><ShoppingBag/><span>{totalItems}</span></button></header>
  {open && <div className="mobile-menu md:hidden">{nav.map(([label,cat])=><button key={label} onClick={()=>{onCategoryChange(cat as Category);setOpen(false)}}>{label}</button>)}</div>}
  <div className="desktop-search"><div className="search-inner"><Search size={17}/><input value={searchQuery} onChange={e=>onSearchChange(e.target.value)} placeholder="Search your style..."/></div></div>
 </>;
}
