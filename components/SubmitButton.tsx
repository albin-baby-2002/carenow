import { Divide } from "lucide-react";
import { Button } from "./ui/button";
import Image from "next/image";

interface TSubmitButtonProps {
  Loading: boolean;
  className?: string;
  children: React.ReactNode;
}

const SubmitButton: React.FC<TSubmitButtonProps> = ({
  Loading,
  className,
  children,
}) => {
  return (
    <Button
      disabled={Loading}
      type="submit"
      className={className ?? "shad-primary-btn w-full"}
    >
      {Loading ? (
        <div className="flex items-center gap-4">
          <Image
            src={"/assets/icons/loader.svg"}
            alt="loader"
            width={24}
            height={24}
            className="animate-spin"
          />
          ...loading
        </div>
      ) : (
        children
      )}
    </Button>
  );
};

export default SubmitButton;
