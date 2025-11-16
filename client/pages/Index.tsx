import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Index() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to dashboard on load
    navigate("/");
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
      <div className="text-center">
        <div className="animate-pulse">
          <h1 className="text-2xl font-semibold text-foreground">
            Loading BusTrack...
          </h1>
          <p className="mt-4 text-muted-foreground">
            Redirecting to dashboard...
          </p>
        </div>
      </div>
    </div>
  );
}
