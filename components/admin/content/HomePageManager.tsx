//import React from 'react';
import HeroSlideManager from './HeroSlideManager';
import StatsManager from './StatsManager';
import OurClientManager from './OurClientManager';
import ServiceManager from './ServiceManager';

export default function HomePageManager() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 md:px-6 space-y-6">
      <header className="flex flex-col gap-1 pb-2">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Halaman Utama</h1>
        <p className="text-sm md:text-base text-muted-foreground">Kelola konten halaman utama dengan tampilan panel yang rapi dan konsisten.</p>
      </header>

      <section className="">
        <HeroSlideManager />
      </section>

      <section className="">
        <StatsManager />
      </section>

      <section className="">
        <OurClientManager />
      </section>

      <section className="">
        <ServiceManager />
      </section>
    </div>
  );
}
