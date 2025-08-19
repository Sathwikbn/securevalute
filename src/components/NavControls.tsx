import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NavControls = () => {
  const navigate = useNavigate();
  return (
    <div className="fixed top-4 left-4 z-50 flex gap-2">
      <Button size="icon" variant="outline" aria-label="Back" onClick={() => navigate(-1)}>
        <ChevronLeft className="w-4 h-4" />
      </Button>
      <Button size="icon" variant="outline" aria-label="Forward" onClick={() => navigate(1)}>
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default NavControls;

