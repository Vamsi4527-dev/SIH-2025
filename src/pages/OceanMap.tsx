import { useState } from "react";
import Navigation from "@/components/Navigation";
import OceanHeatMap from "@/components/OceanHeatMap";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  Waves,
  Wind,
  Thermometer,
  MapPin,
  Clock,
  Phone,
} from "lucide-react";

const OceanMap = () => {
  const [selectedAlert, setSelectedAlert] = useState<string | null>(null);

  const disasters = [
    {
      id: "1",
      type: "Cyclone",
      severity: "High",
      location: "Bay of Bengal",
      coordinates: "16.5°N, 82.3°E",
      time: "2 hours ago",
      description: "Tropical cyclone forming with wind speeds up to 120 km/h",
      affectedVessels: 45,
    },
    {
      id: "2",
      type: "High Waves",
      severity: "Medium",
      location: "Arabian Sea",
      coordinates: "18.0°N, 70.1°E",
      time: "4 hours ago",
      description:
        "Wave heights reaching 4-6 meters, hazardous for small vessels",
      affectedVessels: 23,
    },
    {
      id: "3",
      type: "Temperature Anomaly",
      severity: "Low",
      location: "Lakshadweep Sea",
      coordinates: "12.3°N, 71.7°E",
      time: "6 hours ago",
      description:
        "Unusual temperature rise detected, monitoring marine life impact",
      affectedVessels: 8,
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "High":
        return "destructive";
      case "Medium":
        return "default";
      case "Low":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "Cyclone":
        return Wind;
      case "High Waves":
        return Waves;
      case "Temperature Anomaly":
        return Thermometer;
      default:
        return AlertTriangle;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-surface to-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">
            Ocean Monitoring System
          </h1>
          <p className="text-xl text-black">
            Real-time ocean conditions and disaster alert management
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full lg:w-auto grid-cols-3">
            <TabsTrigger value="overview" className="text-black">
              Overview
            </TabsTrigger>
            <TabsTrigger value="temperature" className="text-black">
              Temperature Map
            </TabsTrigger>
            <TabsTrigger value="disasters" className="text-black">
              Disaster Alerts
            </TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <OceanHeatMap
                  title="AI-Powered Ocean Condition Forecasting"
                  type="disaster"
                  showAlerts={true}
                />
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-black">
                    <AlertTriangle className="w-5 h-5 text-alert-warning" />
                    Active Alerts
                  </CardTitle>
                  <CardDescription className="text-black">
                    Current ocean hazards and warnings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {disasters.slice(0, 3).map((disaster) => {
                    const IconComponent = getIcon(disaster.type);
                    return (
                      <div
                        key={disaster.id}
                        className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50"
                        onClick={() => setSelectedAlert(disaster.id)}
                      >
                        <IconComponent className="w-5 h-5 mt-0.5 text-black" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold text-sm text-black">
                              {disaster.type}
                            </h4>
                            <Badge
                              variant={
                                getSeverityColor(disaster.severity) as any
                              }
                            >
                              {disaster.severity}
                            </Badge>
                          </div>
                          <p className="text-sm text-black">
                            {disaster.location}
                          </p>
                          <div className="flex items-center gap-1 text-xs text-black mt-1">
                            <Clock className="w-3 h-3" />
                            {disaster.time}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Temperature */}
          <TabsContent value="temperature">
            <div className="grid gap-6">
              <Card>
                <OceanHeatMap
                  title="Smart Sea Surface Temperature Forecasting"
                  type="temperature"
                />
              </Card>

              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base text-black">
                      Temperature Range
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-black">
                      26°C - 31°C
                    </div>
                    <p className="text-sm text-black">
                      Current sea surface range
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base text-black">
                      Average Temperature
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-black">28.7°C</div>
                    <p className="text-sm text-black">
                      +0.8°C from seasonal average
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base text-black">
                      Anomaly Zones
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-alert-warning">
                      3
                    </div>
                    <p className="text-sm text-black">
                      Areas requiring monitoring
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Disasters */}
          <TabsContent value="disasters">
            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <OceanHeatMap
                  title="Automated Disaster Alert Zone Classification Using AI"
                  type="disaster"
                  showAlerts={true}
                />
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-black">Alert Details</CardTitle>
                  <CardDescription className="text-black">
                    Comprehensive disaster information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {disasters.map((disaster) => {
                    const IconComponent = getIcon(disaster.type);
                    return (
                      <div
                        key={disaster.id}
                        className={`p-4 border rounded-lg ${
                          selectedAlert === disaster.id
                            ? "border-primary bg-primary/5"
                            : ""
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <IconComponent className="w-5 h-5 mt-0.5 text-black" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-black">
                                {disaster.type}
                              </h4>
                              <Badge
                                variant={
                                  getSeverityColor(disaster.severity) as any
                                }
                              >
                                {disaster.severity}
                              </Badge>
                            </div>
                            <p className="text-sm mb-2 text-black">
                              {disaster.description}
                            </p>
                            <div className="space-y-1 text-xs text-black">
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {disaster.coordinates}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {disaster.time}
                              </div>
                              <div className="flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {disaster.affectedVessels} vessels affected
                              </div>
                            </div>
                            <Button
                              size="sm"
                              className="mt-3"
                              variant="outline"
                            >
                              Send Alert to Vessels
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default OceanMap;
