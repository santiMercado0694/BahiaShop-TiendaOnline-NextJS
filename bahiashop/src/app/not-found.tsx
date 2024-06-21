import React from "react";
import MaxWidthWrapper from "@/components/layouts/MaxWidthWrapper";
import Image from "next/image";
import styles from "@/styles/styles.module.css";

export default function NotFound() {
  return (
    <MaxWidthWrapper
      className={`${styles.vh80} flex flex-col
        justify-center items-center
    `}
    >
      <Image
        src="/utils/404.webp"
        width={384}
        height={128}
        alt="404 not found"
      />

      <h1
        className="
        mt-8
        text-5xl font-bold
      "
      >
        404 - Not Found
      </h1>
    </MaxWidthWrapper>
  );
}
