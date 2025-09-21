import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, Phone, MapPin, Clock, Radio, Users, Anchor } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SOSAlerts = () => {
  const { toast } = useToast();
  const [newSOSOpen, setNewSOSOpen] = useState(false);
  const [selectedSOS, setSelectedSOS] = useState<string | null>(null);

  const sosAlerts = [
    {
      id: "SOS001",
      fishermanName: "Ravi Kumar",
      boatName: "Sea Explorer",
      location: "19.2°N, 72.8°E",
      distance: "12 nautical miles",
      time: "15 minutes ago",
      emergency: "Engine Failure",
      priority: "High",
      status: "Active",
      contact: "+91 98765 43210",
      crewSize: 4,
      description: "Engine has completely failed. Boat is drifting. Need immediate assistance."
    },
    {
      id: "SOS002", 
      fishermanName: "Suresh Nair",
      boatName: "Ocean Pride",
      location: "18.5°N, 70.2°E",
      distance: "25 nautical miles",
      time: "1 hour ago",
      emergency: "Medical Emergency",
      priority: "Critical",
      status: "Coast Guard Dispatched",
      contact: "+91 98765 43211",
      crewSize: 3,
      description: "Crew member injured during fishing operations. Requires medical evacuation."
    },
    {
      id: "SOS003",
      fishermanName: "Ajay Patel",
      boatName: "Marine Star",
      location: "16.8°N, 73.1°E",
      distance: "18 nautical miles",
      time: "2 hours ago",
      emergency: "Navigation System Down",
      priority: "Medium",
      status: "Resolved",
      contact: "+91 98765 43212",
      crewSize: 2,
      description: "GPS and communication equipment malfunctioned during storm."
    },
  ];

  const handleNewSOS = () => {
    toast({
      title: "SOS Alert Sent Successfully",
      description: "Coast Guard and rescue teams have been notified. Help is on the way.",
    });
    setNewSOSOpen(false);
  };

  const handleDispatchRescue = (sosId: string) => {
    toast({
      title: "Rescue Team Dispatched",
      description: `Coast Guard vessel en route to SOS location ${sosId}`,
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical": return "destructive";
      case "High": return "default";
      case "Medium": return "secondary";
      default: return "outline";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "destructive";
      case "Coast Guard Dispatched": return "default";
      case "Resolved": return "secondary";
      default: return "outline";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-surface to-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">SOS Alert System</h1>
            <p className="text-xl text-muted-foreground">Emergency response coordination for fishermen and marine vessels</p>
          </div>
          
          <Dialog open={newSOSOpen} onOpenChange={setNewSOSOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2 bg-alert-danger hover:bg-alert-danger/90">
                <AlertTriangle className="w-4 h-4" />
                Send SOS Alert
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-alert-danger">
                  <AlertTriangle className="w-5 h-5" />
                  Emergency SOS Alert
                </DialogTitle>
                <DialogDescription>
                  Fill in emergency details. This will immediately alert Coast Guard and rescue services.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="fisherman">Fisherman Name</Label>
                  <Input id="fisherman" placeholder="Enter your name" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="boat">Boat Name/Number</Label>
                  <Input id="boat" placeholder="Enter boat identification" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="contact">Emergency Contact</Label>
                  <Input id="contact" placeholder="+91 XXXXX XXXXX" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input id="latitude" placeholder="19.0760°N" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input id="longitude" placeholder="72.8777°E" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="crew">Crew Size</Label>
                  <Input id="crew" type="number" placeholder="Number of people on board" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="emergency">Emergency Description</Label>
                  <Textarea
                    id="emergency"
                    placeholder="Describe the emergency situation in detail"
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setNewSOSOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleNewSOS} className="bg-alert-danger hover:bg-alert-danger/90">
                  Send SOS Alert
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-alert-danger" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-alert-danger">
                {sosAlerts.filter(sos => sos.status === "Active").length}
              </div>
              <p className="text-xs text-muted-foreground">Requiring immediate attention</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Radio className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {sosAlerts.filter(sos => sos.status === "Coast Guard Dispatched").length}
              </div>
              <p className="text-xs text-muted-foreground">Rescue teams en route</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Rescued</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">147</div>
              <p className="text-xs text-muted-foreground">Fishermen saved this year</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Response Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18 min</div>
              <p className="text-xs text-muted-foreground">Average emergency response</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                SOS Location Map
              </CardTitle>
              <CardDescription>Real-time positions of emergency alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative bg-gradient-to-b from-ocean-light to-ocean-deep rounded-lg h-96 overflow-hidden">
                {/* Mock Indian Ocean map */}
                <div className="absolute inset-0 opacity-20">
                  <svg viewBox="0 0 400 300" className="w-full h-full">
                    <path
                      d="M80,50 Q120,60 140,80 L160,120 Q180,140 200,160 L220,200 Q200,220 180,240 L120,250 Q100,230 90,200 L80,160 Q70,100 80,50Z"
                      fill="currentColor"
                      className="text-muted-foreground"
                    />
                  </svg>
                </div>
                
                {/* SOS Alert locations */}
                {sosAlerts.map((sos, index) => (
                  <div
                    key={sos.id}
                    className={`absolute w-8 h-8 cursor-pointer transition-all duration-300 ${
                      selectedSOS === sos.id ? "scale-125" : "hover:scale-110"
                    }`}
                    style={{
                      left: `${20 + index * 25}%`,
                      top: `${30 + index * 15}%`,
                    }}
                    onClick={() => setSelectedSOS(selectedSOS === sos.id ? null : sos.id)}
                  >
                    <AlertTriangle 
                      className={`w-8 h-8 ${
                        sos.priority === "Critical" ? "text-alert-danger" :
                        sos.priority === "High" ? "text-alert-warning" : "text-alert-info"
                      } drop-shadow-lg animate-pulse`}
                    />
                  </div>
                ))}
                
                {/* Selected SOS details */}
                {selectedSOS && (
                  <div className="absolute bottom-4 left-4 right-4">
                    <Card className="bg-card/95 backdrop-blur-sm">
                      <CardContent className="p-3">
                        {(() => {
                          const sos = sosAlerts.find(s => s.id === selectedSOS);
                          if (!sos) return null;
                          return (
                            <div className="space-y-2">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-semibold">{sos.fishermanName}</h4>
                                  <p className="text-sm text-muted-foreground">{sos.boatName}</p>
                                </div>
                                <Badge variant={getPriorityColor(sos.priority) as any}>
                                  {sos.priority}
                                </Badge>
                              </div>
                              <p className="text-sm">{sos.emergency}</p>
                              <div className="flex justify-between items-center text-xs">
                                <span>{sos.distance} from coast</span>
                                <span>{sos.time}</span>
                              </div>
                            </div>
                          );
                        })()}
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Emergency Alerts</CardTitle>
              <CardDescription>Current SOS situations requiring attention</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {sosAlerts.map((sos) => (
                <div key={sos.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{sos.fishermanName}</h4>
                      <p className="text-sm text-muted-foreground">{sos.boatName}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <Badge variant={getPriorityColor(sos.priority) as any}>
                        {sos.priority}
                      </Badge>
                      <div>
                        <Badge variant={getStatusColor(sos.status) as any} className="text-xs">
                          {sos.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      <span>{sos.emergency}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{sos.location} ({sos.distance})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{sos.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{sos.crewSize} crew members</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>{sos.contact}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground italic">
                    "{sos.description}"
                  </p>
                  
                  {sos.status === "Active" && (
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => handleDispatchRescue(sos.id)}
                        className="flex-1"
                      >
                        <Anchor className="w-4 h-4 mr-2" />
                        Dispatch Rescue
                      </Button>
                      <Button size="sm" variant="outline">
                        <Phone className="w-4 h-4 mr-2" />
                        Call
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default SOSAlerts;