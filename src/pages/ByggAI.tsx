import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ByggAI() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Bygg AI</h1>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Tillbaka
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Temporärt avstängd</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Den här sidan är tillfälligt avstängd så att resten av appen kan fungera som vanligt.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
