"use client"

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import AdminLoading from './AdminLoading';

// Dynamic imports untuk komponen admin yang berat
const AdminLayout = dynamic(() => import('./AdminLayout'), {
  loading: () => <AdminLoading />,
  ssr: false
});

const HomePageManager = dynamic(() => import('./content/HomePageManager'), {
  loading: () => <AdminLoading />,
  ssr: false
});

const AboutPageManager = dynamic(() => import('./content/AboutPageManager'), {
  loading: () => <AdminLoading />,
  ssr: false
});

const ContactManager = dynamic(() => import('./content/ContactManager'), {
  loading: () => <AdminLoading />,
  ssr: false
});

const ProjectPostManager = dynamic(() => import('./content/ProjectPostManager'), {
  loading: () => <AdminLoading />,
  ssr: false
});

const ProductManager = dynamic(() => import('./content/ProductManager'), {
  loading: () => <AdminLoading />,
  ssr: false
});

const ColorCatalogManager = dynamic(() => import('./content/ColorCatalogManager'), {
  loading: () => <AdminLoading />,
  ssr: false
});

const AppSettingsManager = dynamic(() => import('./content/AppSettingsManager'), {
  loading: () => <AdminLoading />,
  ssr: false
});

const TestimonialManager = dynamic(() => import('./content/TestimonialManager'), {
  loading: () => <AdminLoading />,
  ssr: false
});

interface AdminWrapperProps {
  children: React.ReactNode;
  sections: Record<string, { title: string; component: React.ComponentType }>;
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export default function AdminWrapper({ 
  children, 
  sections, 
  activeSection, 
  setActiveSection 
}: AdminWrapperProps) {
  return (
    <Suspense fallback={<AdminLoading />}>
      <AdminLayout 
        sections={sections}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      >
        {children}
      </AdminLayout>
    </Suspense>
  );
}

// Export komponen untuk digunakan di halaman admin
export {
  HomePageManager,
  AboutPageManager,
  ContactManager,
  ProjectPostManager,
  ProductManager,
  ColorCatalogManager,
  AppSettingsManager,
  TestimonialManager
};
