import { BarraFija } from "@/components/BarraFija";
import { CarolinaPreguntas } from "@/components/CarolinaPreguntas";
import { Cierre, Footer } from "@/components/Cierre";
import { ComoFunciona } from "@/components/ComoFunciona";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { JsonLd } from "@/components/JsonLd";
import { Resenas } from "@/components/Resenas";
import { Servicios } from "@/components/Servicios";

export default function Inicio() {
  return (
    <>
      <JsonLd />
      <Header />
      <main>
        <Hero />
        <Servicios />
        <ComoFunciona />
        <Resenas />
        <CarolinaPreguntas />
        <Cierre />
      </main>
      <Footer />
      <BarraFija />
    </>
  );
}
