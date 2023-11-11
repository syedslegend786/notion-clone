import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ModeToggle } from "../mode-toggle";
import { useModals } from "@/hooks/use-modals";

export function SettingsModal() {
  const { modalType, onClose } = useModals();
  const isOpen = modalType === "SettingsModal";
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="border-b-neutral-500">
            My Settings
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold">Appearance</h3>
              <p>Customize how Jotion looks on your device</p>
            </div>
            <ModeToggle />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
