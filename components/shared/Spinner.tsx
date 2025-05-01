import { Loader2, RefreshCw } from "lucide-react";

const Spinner = () => {
  return (
    <Loader2
      className="h-5 w-5 text-black/70 animate-spin"
      style={{ strokeWidth: "2" }}
    />
  );
};

export const Loader = () => {
  return (
    <div className="flex items-center justify-center">
      <RefreshCw
        className="h-8 w-8 text-muted animate-spin"
        style={{ strokeWidth: "2" }}
      />
    </div>
  );
};

export default Spinner;
