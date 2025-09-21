import { useState } from "react";
import Navigation from "@/components/Navigation";
import OceanHeatMap from "@/components/OceanHeatMap";
import DataChart from "@/components/DataChart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Microscope, FileText, Upload, Eye, Download, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ScientistsDashboard = () => {
  const { toast } = useToast();
  const [publishOpen, setPublishOpen] = useState(false);

  // Mock data for research publications
  const researchData = [
    { name: "Biodiversity Studies", value: 45 },
    { name: "Climate Impact", value: 30 },
    { name: "Fish Behavior", value: 15 },
    { name: "Ocean Chemistry", value: 10 },
  ];

  const temperatureData = [
    { name: "Jan", value: 26.5 },
    { name: "Feb", value: 27.2 },
    { name: "Mar", value: 28.8 },
    { name: "Apr", value: 29.5 },
    { name: "May", value: 30.1 },
    { name: "Jun", value: 29.8 },
  ];

  const publications = [
    {
      title: "Impact of Climate Change on Marine Biodiversity in the Arabian Sea",
      author: "Dr. Priya Sharma",
      date: "2024-01-15",
      status: "Published",
      citations: 23,
    },
    {
      title: "Otolith Morphology Analysis of Indian Ocean Fish Species",
      author: "Dr. Raj Kumar",
      date: "2024-02-03",
      status: "Under Review",
      citations: 0,
    },
    {
      title: "Environmental DNA Detection Methods for Marine Species",
      author: "Dr. Anita Menon",
      date: "2024-01-28",
      status: "Published",
      citations: 15,
    },
  ];

  const handlePublish = () => {
    toast({
      title: "Research Published Successfully",
      description: "Your research paper has been submitted to the NEERVA database.",
    });
    setPublishOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-surface to-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Scientists Dashboard</h1>
            <p className="text-xl text-muted-foreground">Research collaboration platform for marine scientists</p>
          </div>
          
          <Dialog open={publishOpen} onOpenChange={setPublishOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Publish Research
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Publish New Research</DialogTitle>
                <DialogDescription>
                  Submit your research paper to the NEERVA scientific database
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Research Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter research paper title"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="abstract">Abstract</Label>
                  <Textarea
                    id="abstract"
                    placeholder="Enter research abstract"
                    rows={4}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="keywords">Keywords</Label>
                  <Input
                    id="keywords"
                    placeholder="marine biology, climate change, biodiversity"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="file">Research Paper (PDF)</Label>
                  <Input
                    id="file"
                    type="file"
                    accept=".pdf"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setPublishOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handlePublish}>
                  Publish Research
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6 lg:grid-cols-3 mb-8">
          <Card className="lg:col-span-2">
            <OceanHeatMap title="Ocean Temperature Distribution" type="temperature" />
          </Card>
          
          <div className="space-y-6">
            <DataChart 
              type="pie"
              title="Research Categories"
              description="Distribution of ongoing research projects"
              data={researchData}
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <Microscope className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">47</div>
              <p className="text-xs text-muted-foreground">+3 new projects</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Publications</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">+12 this month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Collaborations</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">International partners</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Data Sets</CardTitle>
              <Download className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,847</div>
              <p className="text-xs text-muted-foreground">TB of research data</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <DataChart 
            type="bar"
            title="Average Sea Temperature"
            description="Monthly temperature trends in study areas"
            data={temperatureData}
          />
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Publications</CardTitle>
              <CardDescription>Latest research papers from NEERVA scientists</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {publications.map((pub, index) => (
                  <div key={index} className="flex items-start justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm leading-tight mb-2">{pub.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{pub.author}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {pub.date}
                        {pub.citations > 0 && (
                          <span>• {pub.citations} citations</span>
                        )}
                      </div>
                    </div>
                    <Badge variant={pub.status === "Published" ? "default" : "secondary"}>
                      {pub.status}
                    </Badge>
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

export default ScientistsDashboard;