"use client"

import React, { useState, useEffect } from "react";
import AdminLogin, { checkAdminAuth } from "../../../components/admin/AdminLogin";
import AdminLayout from "../../../components/admin/AdminLayout";
import ProductManager from "../../../components/admin/content/ProductManager";
import TestimonialManager from "../../../components/admin/content/TestimonialManager";
import ProjectPostManager from "../../../components/admin/content/ProjectPostManager";
import ColorCatalogManager from "../../../components/admin/content/ColorCatalogManager";
import ContactManager from "../../../components/admin/content/ContactManager";
import HomePageManager from "../../../components/admin/content/HomePageManager";
import AboutPageManager from "../../../components/admin/content/AboutPageManager";
import AppSettingsManager from "../../../components/admin/content/AppSettingsManager";

const adminSections = {
  "home-page": { title: "Halaman Utama", component: HomePageManager },
  "about-page": { title: "Tentang Kami", component: AboutPageManager },
  "products": { title: "Portofolio", component: ProductManager },
  "project-posts": { title: "Client & Proyek", component: ProjectPostManager },
  "testimonials": { title: "Testimoni", component: TestimonialManager },
  "color-catalogs": { title: "Katalog Warna", component: ColorCatalogManager },
  "contact": { title: "Informasi Kontak", component: ContactManager },
  "app-settings": { title: "Pengaturan Aplikasi", component: AppSettingsManager },
};

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("home-page");

  useEffect(() => {
    const isAuth = checkAdminAuth();
    setIsAuthenticated(isAuth);
    setIsLoading(false);
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  const ActiveComponent = adminSections[activeSection as keyof typeof adminSections].component;

  return (
    <AdminLayout
      sections={adminSections}
      activeSection={activeSection}
      setActiveSection={setActiveSection}
    >
      <ActiveComponent />
    </AdminLayout>
  );
}
