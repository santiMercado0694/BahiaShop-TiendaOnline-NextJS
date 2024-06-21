import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white rounded-lg shadow m-4">
      <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
        <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
          © {new Date().getFullYear()}{" "}
          <a href="/" className="hover:underline">
            BahiaShop™
          </a>
          . Todos los derechos reservados.
        </span>
        <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
          <li>
            <a href="/AboutUs" className="hover:underline me-4 md:me-6">
              Sobre Nosotros
            </a>
          </li>
          <li>
            <a href="/PrivacyPolicy" className="hover:underline me-4 md:me-6">
              Politica de Privacidad
            </a>
          </li>
          <li>
            <a href="/Contact" className="hover:underline">
              Contacto
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
};
