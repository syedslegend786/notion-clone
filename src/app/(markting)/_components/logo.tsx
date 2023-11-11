import Image from "next/image";

export function Logo() {
  return (
    <div className="md:flex items-center gap-1 z-50 hidden ">
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
