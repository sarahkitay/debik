"use client";

import { Hero } from "@/components/Hero";
import { ResonanceCards } from "@/components/ResonanceCards";
import { MeetDebi } from "@/components/MeetDebi";
import { Accordions } from "@/components/Accordions";
import { FinalCTA } from "@/components/FinalCTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ResonanceCards />
      <MeetDebi />
      <Accordions />
      <FinalCTA />
    </>
  );
}
