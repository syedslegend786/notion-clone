import { cn } from "@/lib/utils";
import Image from "next/image";
interface LogoProps {
  hideOnMobile?: boolean;
}
export function Logo({ hideOnMobile = true }: LogoProps) {
  return (
    <div
      className={cn("md:flex items-center gap-1 z-50", {
        hidden: hideOnMobile,
      })}
    >
      <Image
        width={30}
        height={30}
        alt=""
        src={"/logo.svg"}
        className="object-contain dark:hidden"
      />
      <Image
        width={30}
        height={30}
        alt=""
        src={"/logo-dark.svg"}
        className="object-contain hidden dark:block"
      />
      <p className="text-xs font-bold">Jotion</p>
    </div>
  );
}
