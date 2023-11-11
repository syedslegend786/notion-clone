import Image from "next/image";

export function Heros() {
  return (
    <div className="flex flex-col items-center justify-center max-w-5xl mx-auto">
      <div className="flex items-center justify-between ">
        <div className="relative w-[300px] h-[300px]">
          <Image
            src={"/documents.png"}
            alt=""
            className="object-contain dark:hidden"
            fill
          />
          <Image
            src={"/documents-dark.png"}
            alt=""
            className="object-contain hidden dark:block"
            fill
          />
        </div>
        <div className="relative w-[300px] h-[300px] hidden md:block">
          <Image
            src={"/reading.png"}
            alt=""
            className="object-contain dark:hidden"
            fill
          />
          <Image
            src={"/reading-dark.png"}
            alt=""
            className="object-contain hidden dark:block"
            fill
          />
        </div>
      </div>
    </div>
  );
}
