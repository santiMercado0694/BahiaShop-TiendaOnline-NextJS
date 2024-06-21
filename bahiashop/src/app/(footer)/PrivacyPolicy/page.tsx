"use client";

import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import MaxWidthWrapper from "@/components/layouts/MaxWidthWrapper";

const PrivacyPolicy: React.FC = () => {
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
            className="text-3xl font-bold text-center mb-4"
          >
            Política de Privacidad
          </Typography>
          <div className="mt-6"></div>

          {/* Última actualización */}
          <Typography className="mb-4">
            <strong>Última actualización:</strong> 30 de mayo de 2024
          </Typography>
          <div className="mt-6"></div>

          {/* Descripción */}
          <Typography className="mb-4">
            Esta Política de Privacidad describe nuestras políticas y
            procedimientos sobre la recopilación, uso y divulgación de su
            información cuando utiliza el Servicio y le informa sobre sus
            derechos de privacidad y cómo la ley lo protege.
          </Typography>

          {/* Uso de datos personales */}
          <Typography className="mb-4">
            Utilizamos sus datos personales para proporcionar y mejorar el
            Servicio. Al utilizar el Servicio, usted acepta la recopilación y el
            uso de información de acuerdo con esta Política de Privacidad.
          </Typography>
          <div className="mt-6"></div>

          {/* Interpretación y Definiciones */}
          <div className="mb-8">
            <Typography variant="h3" className="text-2xl font-bold mb-4">
              Interpretación y Definiciones
            </Typography>
            <div className="mt-6"></div>

            {/* Definiciones */}
            <div>
              <Typography variant="h4" className="text-xl font-bold mb-2">
                Definiciones
              </Typography>
              <ul className="list-disc ml-6 mb-4">
                <li>
                  <strong>Cuenta:</strong> significa una cuenta única creada
                  para que usted acceda a nuestro Servicio o partes de nuestro
                  Servicio.
                </li>
                <li>
                  <strong>Afiliado:</strong> significa una entidad que controla,
                  es controlada por o está bajo control común con una parte,
                  donde &quot;control&quot; significa propiedad del 50% o más de
                  las acciones, interés patrimonial u otros valores con derecho
                  a voto para la elección de directores u otra autoridad de
                  gestión.
                </li>
                <li>
                  <strong>Empresa:</strong> se refiere a Bahia Shop.
                </li>
                <li>
                  <strong>Cookies:</strong> son archivos pequeños que se colocan
                  en su computadora, dispositivo móvil u otro dispositivo por un
                  sitio web, que contienen los detalles de su historial de
                  navegación en ese sitio web entre sus muchos usos.
                </li>
                <li>
                  <strong>País:</strong> se refiere a: Argentina
                </li>
              </ul>
            </div>
          </div>

          {/* Recopilación y Uso de Información Personal */}
          <div>
            <Typography variant="h3" className="text-2xl font-bold mb-4">
              Recopilación y Uso de su Información Personal
            </Typography>
            <div className="mt-6"></div>

            {/* Tipos de Datos Recopilados */}
            <div className="mb-4">
              <Typography variant="h4" className="text-xl font-bold mb-2">
                Tipos de Datos Recopilados
              </Typography>
              <Typography className="mb-2">
                Mientras utiliza Nuestro Servicio, es posible que le pidamos que
                nos proporcione cierta información personalmente identificable
                que se pueda utilizar para contactarlo o identificarlo. La
                información personalmente identificable puede incluir, entre
                otros, los siguientes datos:
              </Typography>
              <ul className="list-disc ml-6">
                <li>Dirección de correo electrónico</li>
                <li>Nombre y apellido</li>
                <li>Datos de uso</li>
              </ul>
            </div>

            {/* Datos de Uso */}
            <div>
              <Typography variant="h3" className="text-xl font-bold mb-2">
                Datos de Uso
              </Typography>
              <Typography className="mb-2">
                Los datos de uso se recopilan automáticamente al utilizar el
                Servicio.
              </Typography>
              <Typography>
                Los datos de uso pueden incluir información como la dirección IP
                de su dispositivo, el tipo de navegador, la versión del
                navegador, las páginas de nuestro Servicio que visita, la hora y
                la fecha de su visita, el tiempo que pasa en esas páginas,
                identificadores únicos de dispositivos y otros datos de
                diagnóstico.
              </Typography>
            </div>
          </div>
        </div>
      )}
    </MaxWidthWrapper>
  );
};

export default PrivacyPolicy;
