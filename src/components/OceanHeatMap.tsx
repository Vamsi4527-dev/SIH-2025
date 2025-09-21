import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Thermometer, Fish, AlertTriangle } from "lucide-react";

interface HeatMapProps {
  title: string;
  type: "fish" | "temperature" | "disaster";
  showAlerts?: boolean;
}

const OceanHeatMap = ({ title, type, showAlerts = false }: HeatMapProps) => {
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  // Mock data for different zones
  const zones = [
    { id: "zone1", name: "Arabian Sea North", temp: 26.2, fishDensity: "High", lat: 20.5, lng: 69.2, alert: null },
    { id: "zone2", name: "Arabian Sea Central", temp: 31.5, fishDensity: "Medium", lat: 18.0, lng: 70.1, alert: "Cyclone Warning" },
    { id: "zone3", name: "Bay of Bengal", temp: 29.8, fishDensity: "High", lat: 16.5, lng: 82.3, alert: null },
    { id: "zone4", name: "Indian Ocean South", temp: 27.1, fishDensity: "Low", lat: 8.2, lng: 76.8, alert: "High Waves" },
    { id: "zone5", name: "Lakshadweep Sea", temp: 32.1, fishDensity: "Medium", lat: 12.3, lng: 71.7, alert: null },
    { id: "zone6", name: "Gulf of Mannar", temp: 28.5, fishDensity: "High", lat: 9.1, lng: 79.2, alert: null },
    { id: "zone7", name: "Andaman Sea", temp: 30.2, fishDensity: "Medium", lat: 11.5, lng: 92.8, alert: null },
  ];

  const getZoneColor = (zone: any) => {
    if (type === "fish") {
      return zone.fishDensity === "High" ? "bg-fish-high" : 
             zone.fishDensity === "Medium" ? "bg-fish-medium" : "bg-fish-low";
    }
    if (type === "temperature") {
      if (zone.temp > 31) return "bg-red-500";
      if (zone.temp > 29) return "bg-orange-500"; 
      if (zone.temp > 28) return "bg-yellow-500";
      if (zone.temp > 27) return "bg-green-500";
      if (zone.temp > 26) return "bg-cyan-400";
      return "bg-blue-500";
    }
    return zone.alert ? "bg-alert-danger" : "bg-ocean-light";
  };

  const getTemperatureGradient = (temp: number) => {
    if (temp > 31) return "from-red-600 via-red-500 to-red-400";
    if (temp > 29) return "from-orange-600 via-orange-500 to-orange-400"; 
    if (temp > 28) return "from-yellow-600 via-yellow-500 to-yellow-400";
    if (temp > 27) return "from-green-600 via-green-500 to-green-400";
    if (temp > 26) return "from-cyan-600 via-cyan-500 to-cyan-400";
    return "from-blue-600 via-blue-500 to-blue-400";
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {type === "fish" && <Fish className="w-5 h-5" />}
          {type === "temperature" && <Thermometer className="w-5 h-5" />}
          {type === "disaster" && <AlertTriangle className="w-5 h-5" />}
          {title}
        </CardTitle>
        <CardDescription>
          Interactive heat map showing {type === "fish" ? "fish population density" : type === "temperature" ? "sea surface temperature" : "disaster alerts"} across Indian waters
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative bg-gradient-to-b from-purple-600 via-blue-600 to-cyan-400 rounded-lg h-80 overflow-hidden">
          {/* Temperature heat map background layers */}
          {type === "temperature" && (
            <>
              {/* Gradient overlays for realistic temperature visualization */}
              <div className="absolute inset-0">
                {/* Northern regions - cooler */}
                <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-purple-600 via-blue-500 to-transparent opacity-70"></div>
                {/* Central warm zones */}
                <div className="absolute top-16 left-8 w-32 h-24 bg-gradient-radial from-red-500 via-orange-400 to-transparent opacity-60 rounded-full blur-sm"></div>
                <div className="absolute top-20 right-12 w-28 h-20 bg-gradient-radial from-yellow-500 via-orange-500 to-transparent opacity-50 rounded-full blur-sm"></div>
                {/* Southern cooler regions */}
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-cyan-500 via-blue-400 to-transparent opacity-60"></div>
                {/* Warm current paths */}
                <div className="absolute top-12 left-1/3 w-48 h-32 bg-gradient-to-r from-transparent via-orange-400 to-yellow-500 opacity-40 transform rotate-12 blur-md"></div>
              </div>
            </>
          )}
          
          {/* Mock map background with Indian coastline outline */}
          <div className="absolute inset-0 opacity-30">
            <svg viewBox="0 0 400 300" className="w-full h-full">
              {/* Simplified Indian coastline */}
              <path
                d="M80,50 Q120,60 140,80 L160,120 Q180,140 200,160 L220,200 Q200,220 180,240 L120,250 Q100,230 90,200 L80,160 Q70,100 80,50Z"
                fill="currentColor"
                className="text-white drop-shadow-lg"
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="1"
              />
            </svg>
          </div>
          
          {/* Heat map zones */}
          {zones.map((zone) => (
            <div
              key={zone.id}
              className={`absolute cursor-pointer transition-all duration-300 ${
                selectedZone === zone.id ? "scale-125 ring-4 ring-white/50" : "hover:scale-110"
              }`}
              style={{
                left: `${((zone.lng - 68) / (85 - 68)) * 100}%`,
                top: `${((25 - zone.lat) / (25 - 8)) * 100}%`,
              }}
              onClick={() => setSelectedZone(selectedZone === zone.id ? null : zone.id)}
            >
              {type === "temperature" ? (
                <div className={`w-16 h-16 rounded-full bg-gradient-radial ${getTemperatureGradient(zone.temp)} opacity-80 blur-sm animate-pulse`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-4 h-4 bg-white rounded-full shadow-lg"></div>
                  </div>
                </div>
              ) : (
                <div className={`w-12 h-12 rounded-full ${getZoneColor(zone)}`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-white drop-shadow-lg" />
                  </div>
                </div>
              )}
              {zone.alert && showAlerts && (
                <AlertTriangle className="w-4 h-4 text-alert-danger absolute -top-1 -right-1" />
              )}
            </div>
          ))}
          
          {/* Selected zone info */}
          {selectedZone && (
            <div className="absolute bottom-4 left-4 right-4">
              <Card className="bg-card/95 backdrop-blur-sm border-white/20">
                <CardContent className="p-3">
                  {(() => {
                    const zone = zones.find(z => z.id === selectedZone);
                    if (!zone) return null;
                    return (
                      <div className="space-y-2">
                        <h4 className="font-semibold text-white">{zone.name}</h4>
                        <div className="flex flex-wrap gap-2 text-sm">
                          <Badge variant="info" className="bg-white/20 text-white border-white/30">
                            Temp: {zone.temp}°C
                          </Badge>
                          <Badge variant={zone.fishDensity === "High" ? "success" : zone.fishDensity === "Medium" ? "warning" : "outline"}>
                            Fish: {zone.fishDensity}
                          </Badge>
                          {zone.alert && (
                            <Badge variant="destructive" className="text-white">
                              {zone.alert}
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Real-time
            </Button>
            <Button variant="ghost" size="sm">
              Historical
            </Button>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {type === "temperature" && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>26°C</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
                  <span>27°C</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>28°C</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span>29°C</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span>30°C</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>31°C+</span>
                </div>
              </div>
            )}
            {type === "fish" && (
              <>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-fish-high rounded-full"></div>
                  <span>High</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-fish-medium rounded-full"></div>
                  <span>Medium</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-fish-low rounded-full"></div>
                  <span>Low</span>
                </div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OceanHeatMap;