import Image from "next/image";

export const Icons = {
  logo: ({ ...rest }) => (
    <Image src="/Logo.webp" alt="Logo" width={70} height={50} {...rest} />
  ),
};
