import Link from "next/link";
import Image from "next/image";
import { site } from "@/config/site-config";
import { poppins } from "@/components/shared/fonts";
// Importa la imagen de la bandera española
import spainFlag from "/public/flags/spain_small.svg";

const Logo = () => {
  return <Link href="/" className="flex-start">
      <div className={`${poppins.className} flex flex-row items-center space-x-2`}>
        <Image src="/logo.svg" width={32} height={32} alt="logo" priority />
        
        {/* Bandera española */}
        <Image src={spainFlag} width={32} height={32} alt="Bandera de España" />
        
        <span className="text-lg">{site.name}</span>
      </div>
    </Link>;
};
export default Logo;