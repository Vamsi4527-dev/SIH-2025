import Navigation from "@/components/Navigation";
import OceanHeatMap from "@/components/OceanHeatMap";
import DataChart from "@/components/DataChart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Fish, TrendingUp, MapPin, Calendar } from "lucide-react";

const FisheriesDashboard = () => {
  // Mock data for charts
  const fishSpeciesData = [
    { name: "Tuna", value: 35 },
    { name: "Sardine", value: 25 },
    { name: "Mackerel", value: 20 },
    { name: "Pomfret", value: 12 },
    { name: "Others", value: 8 },
  ];

  const monthlyFishingData = [
    { name: "Jan", value: 2400 },
    { name: "Feb", value: 1398 },
    { name: "Mar", value: 9800 },
    { name: "Apr", value: 3908 },
    { name: "May", value: 4800 },
    { name: "Jun", value: 3800 },
  ];

  const fishingZones = [
    { zone: "Zone A1", status: "Optimal", fishCount: "High", coordinates: "19°N, 72°E" },
    { zone: "Zone B2", status: "Good", fishCount: "Medium", coordinates: "15°N, 74°E" },
    { zone: "Zone C3", status: "Poor", fishCount: "Low", coordinates: "12°N, 75°E" },
    { zone: "Zone D4", status: "Optimal", fishCount: "High", coordinates: "21°N, 70°E" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-surface to-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Fisheries Dashboard</h1>
          <p className="text-xl text-muted-foreground">Real-time marine fishing data and analytics for sustainable resource management</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3 mb-8">
          <Card className="lg:col-span-2">
            <OceanHeatMap title="AI Predicted Fish Population Heat Map" type="fish" />
          </Card>
          
          <div className="space-y-6">
            <DataChart 
              type="pie"
              title="Fish Species Distribution"
              description="Current catch composition by species"
              data={fishSpeciesData}
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Catch</CardTitle>
              <Fish className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,450 tons</div>
              <p className="text-xs text-muted-foreground">+12.5% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Vessels</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,247</div>
              <p className="text-xs text-muted-foreground">+8.2% from last week</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Density Zones</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7</div>
              <p className="text-xs text-muted-foreground">2 new zones identified</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Seasonal Peak</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">March</div>
              <p className="text-xs text-muted-foreground">Expected in 2 weeks</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <DataChart 
            type="bar"
            title="Monthly Fishing Volume"
            description="Catch volume trends over the past 6 months"
            data={monthlyFishingData}
          />
          
          <Card>
            <CardHeader>
              <CardTitle>Fishing Zone Status</CardTitle>
              <CardDescription>Current status of major fishing zones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {fishingZones.map((zone, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">{zone.zone}</h4>
                      <p className="text-sm text-muted-foreground">{zone.coordinates}</p>
                    </div>
                  <div className="flex gap-2">
                    <Badge variant={zone.status === "Optimal" ? "success" : zone.status === "Good" ? "info" : "outline"}>
                      {zone.status}
                    </Badge>
                    <Badge variant={zone.fishCount === "High" ? "success" : zone.fishCount === "Medium" ? "warning" : "outline"}>
                      {zone.fishCount} Fish
                    </Badge>
                  </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default FisheriesDashboard;