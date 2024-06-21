"use client";

import React, { useState, useEffect } from "react";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Typography from "@mui/material/Typography";
import MaxWidthWrapper from "@/components/layouts/MaxWidthWrapper";

const AboutUsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <MaxWidthWrapper>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <Loader
            type="Puff"
            color="#00BFFF"
            height={100}
            width={100}
            timeout={1000}
          />
        </div>
      ) : (
        <div className="container mx-auto py-8">
          {/* Título principal */}
          <Typography
            variant="h2"
            className="text-3xl font-bold text-center mb-6"
          >
            Sobre Nosotros
          </Typography>

          <div className="mb-8"></div>
          {/* Descripción */}
          <Typography className="text-lg mb-8">
            En Bahia Shop, nos apasiona proporcionar la mejor tecnología a
            nuestros clientes. Nuestra misión es brindar productos de calidad,
            un servicio excepcional y una experiencia de compra inigualable.
          </Typography>
          <div className="mb-8"></div>
          {/* Historia */}
          <div className="mb-8">
            <Typography variant="h3" className="text-2xl font-bold mb-4">
              Nuestra Historia
            </Typography>
            <Typography className="text-lg mb-4">
              Desde nuestros humildes comienzos como una tienda local en Bahía
              Blanca, hemos crecido hasta convertirnos en una empresa líder en
              el mercado de tecnología a nivel nacional. Fundada en 2005, Bahia
              Shop se ha dedicado a ofrecer lo último en dispositivos
              electrónicos, accesorios y más.
            </Typography>
            <Typography className="text-lg">
              Nos enorgullece haber construido relaciones sólidas con nuestros
              clientes y proveedores a lo largo de los años, lo que nos permite
              seguir ofreciendo productos de calidad y un servicio excepcional.
            </Typography>
          </div>

          {/* Equipo */}
          <div className="mb-8">
            <Typography variant="h3" className="text-2xl font-bold mb-4">
              Nuestro Equipo
            </Typography>
            <Typography className="text-lg mb-4">
              En Bahia Shop, contamos con un equipo dedicado y apasionado de
              profesionales que comparten un interés común por la tecnología y
              el servicio al cliente. Nuestro equipo está comprometido en
              proporcionar la mejor experiencia de compra y satisfacción del
              cliente en cada interacción.
            </Typography>
            <Typography className="text-lg">
              Trabajamos arduamente para mantenernos actualizados con las
              últimas tendencias tecnológicas y ofrecer productos que cumplan
              con las expectativas y necesidades de nuestros clientes.
            </Typography>
          </div>

          {/* Valores */}
          <div>
            <Typography variant="h3" className="text-2xl font-bold mb-4">
              Nuestros Valores
            </Typography>
            <ul className="list-disc ml-6">
              <li className="text-lg mb-2">
                Calidad: Nos comprometemos a ofrecer productos de alta calidad
                que cumplan con los estándares más exigentes.
              </li>
              <li className="text-lg mb-2">
                Servicio al Cliente: Priorizamos la satisfacción del cliente y
                nos esforzamos por brindar un servicio excepcional en cada
                interacción.
              </li>
              <li className="text-lg mb-2">
                Innovación: Buscamos constantemente nuevas oportunidades y
                soluciones innovadoras para mejorar la experiencia de nuestros
                clientes.
              </li>
              <li className="text-lg">
                Responsabilidad: Operamos de manera ética y responsable,
                contribuyendo positivamente a la comunidad y el medio ambiente.
              </li>
            </ul>
          </div>
        </div>
      )}
    </MaxWidthWrapper>
  );
};

export default AboutUsPage;
