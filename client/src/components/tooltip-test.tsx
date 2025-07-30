import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

export function TooltipTest() {
  return (
    <div className="p-4">
      <h2>Tooltip Test</h2>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className="h-4 w-4 text-blue-500 cursor-help" />
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>This is a test tooltip!</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}