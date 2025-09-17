"use client"

import React, { useState, useEffect, Suspense } from "react";
import dynamic from 'next/dynamic';
import AdminLogin, { checkAdminAuth } from "../../../components/admin/AdminLogin";
import AdminLoading from "../../../components/admin/AdminLoading";

// Dynamic imports untuk optimasi SSR
const AdminLayout = dynamic(() => import("../../../components/admin/AdminLayout"), {
  loading: () => <AdminLoading />,
  ssr: false
});

const HomePageManager = dynamic(() => import("../../../components/admin/content/HomePageManager"), {
  loading: () => <AdminLoading />,
  ssr: false
});

const AboutPageManager = dynamic(() => import("../../../components/admin/content/AboutPageManager"), {
  loading: () => <AdminLoading />,
  ssr: false
});

const ProductManager = dynamic(() => import("../../../components/admin/content/ProductManager"), {
  loading: () => <AdminLoading />,
  ssr: false
});

const ProjectPostManager = dynamic(() => import("../../../components/admin/content/ProjectPostManager"), {
  loading: () => <AdminLoading />,
  ssr: false
});

const TestimonialManager = dynamic(() => import("../../../components/admin/content/TestimonialManager"), {
  loading: () => <AdminLoading />,
  ssr: false
});

const ColorCatalogManager = dynamic(() => import("../../../components/admin/content/ColorCatalogManager"), {
  loading: () => <AdminLoading />,
  ssr: false
});

const ContactManager = dynamic(() => import("../../../components/admin/content/ContactManager"), {
  loading: () => <AdminLoading />,
  ssr: false
});

const AppSettingsManager = dynamic(() => import("../../../components/admin/content/AppSettingsManager"), {
  loading: () => <AdminLoading />,
  ssr: false
});

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
    return <AdminLoading />;
  }

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  const ActiveComponent = adminSections[activeSection as keyof typeof adminSections].component;

  return (
    <Suspense fallback={<AdminLoading />}>
      <AdminLayout
        sections={adminSections}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      >
        <ActiveComponent />
      </AdminLayout>
    </Suspense>
  );
}
