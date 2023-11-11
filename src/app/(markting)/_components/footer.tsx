import { Button } from "@/components/ui/button";
import { Logo } from "./logo";

export function Footer() {
  return (
    <div className="bg-background p-6 flex items-center justify-between w-full">
      <Logo />
      <div className="flex items-center justify-between md:w-auto w-full">
        <Button variant={"ghost"}>Privacy Policy</Button>
        <Button variant={"ghost"}>Terms & Conditions</Button>
      </div>
    </div>
  );
}
