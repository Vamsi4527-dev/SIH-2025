import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Waves, Fish, Microscope, Map, AlertTriangle, Database, BarChart3, Globe } from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: Fish,
      title: "Fisheries Management",
      description: "Monitor fish populations, track catch data, and optimize fishing zones for sustainable resource management.",
      link: "/fisheries",
      color: "bg-fish-high text-white"
    },
    {
      icon: Microscope,
      title: "Scientific Research",
      description: "Collaborate on marine research, publish findings, and access comprehensive oceanographic data.",
      link: "/scientists",
      color: "bg-primary text-primary-foreground"
    },
    {
      icon: Map,
      title: "Ocean Monitoring",
      description: "Real-time ocean conditions, temperature mapping, and disaster alert systems.",
      link: "/ocean-map",
      color: "bg-accent text-accent-foreground"
    },
    {
      icon: AlertTriangle,
      title: "SOS Emergency System",
      description: "Emergency response coordination for fishermen and marine vessels in distress.",
      link: "/sos",
      color: "bg-alert-danger text-white"
    }
  ];

  const stats = [
    { label: "Marine Species Catalogued", value: "2,847", icon: Fish },
    { label: "Research Publications", value: "156", icon: Microscope },
    { label: "Ocean Data Points", value: "1.2M+", icon: Database },
    { label: "Fishermen Protected", value: "12,500", icon: AlertTriangle },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-surface via-background to-ocean-light">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-6 text-sm px-4 py-2">
              Ministry of Earth Sciences, Government of India
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Centre for Marine Living Resources & Ecology
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Advancing ocean science through integrated data platforms for
              sustainable marine resource management, ecosystem research, and
              blue economy development across Indian waters.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8">
                <Link to="/fisheries">
                  <Fish className="w-5 h-5 mr-2" />
                  Explore Fisheries Data
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="text-lg px-8"
              >
                <Link to="/scientists">
                  <Microscope className="w-5 h-5 mr-2" />
                  Research Platform
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Floating ocean elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-20 h-20 bg-ocean-light/30 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-20 w-32 h-32 bg-primary/20 rounded-full animate-pulse delay-700"></div>
          <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-accent/30 rounded-full animate-pulse delay-1000"></div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Integrated Marine Data Platform
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools for marine research, fisheries management, and
              emergency response coordination
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <CardHeader className="text-center pb-4">
                  <div
                    className={`w-16 h-16 mx-auto rounded-xl ${feature.color} flex items-center justify-center mb-4`}
                  >
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center mb-6 text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>
                  <Button asChild className="w-full group-hover:bg-primary/90">
                    <Link to={feature.link}>Access Platform</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 px-4 bg-card/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Impact & Achievements
            </h2>
            <p className="text-lg text-muted-foreground">
              Driving marine conservation and sustainable development across
              India's coastal regions
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <stat.icon className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <div className="text-3xl font-bold text-foreground mb-2">
                    {stat.value}
                  </div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Our Mission
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  NEERVA serves as India's premier platform for research and
                  management of marine living resources. Operating under the
                  Ministry of Earth Sciences, it supports the nation's Blue
                  Economy initiatives through cutting-edge technology and data
                  integration. Our integrated system brings together
                  oceanographic data, biodiversity assessments, and advanced AI
                  technologies to enable sustainable fisheries management and
                  marine conservation. By facilitating collaborative research
                  and real-time monitoring, NEERVA empowers scientists,
                  policymakers, and coastal communities to make informed
                  decisions that promote long-term ocean sustainability.
                </p>
                <p>
                  Our integrated platform combines oceanographic data,
                  biodiversity assessments, and cutting-edge AI technologies to
                  enable sustainable fisheries management and marine
                  conservation efforts.
                </p>
                <p>
                  Through collaborative research and real-time monitoring
                  systems, we empower scientists, policymakers, and fishing
                  communities to make informed decisions for ocean
                  sustainability.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 mt-8">
                <Badge variant="secondary" className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Ocean Mapping
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Data Analytics
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-2">
                  <Fish className="w-4 h-4" />
                  Fisheries Research
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-2">
                  <Waves className="w-4 h-4" />
                  Climate Studies
                </Badge>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <Waves className="w-24 h-24 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground">
                    Interactive Ocean Platform
                  </h3>
                  <p className="text-muted-foreground mt-2">
                    Explore marine ecosystems with our data visualization tools
                  </p>
                </div>
              </div>

              {/* Floating cards */}
              <Card className="absolute -top-4 -right-4 p-4 bg-card/90 backdrop-blur-sm border shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-fish-high rounded-full flex items-center justify-center">
                    <Fish className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">Live Tracking</div>
                    <div className="text-xs text-muted-foreground">
                      Real-time data
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="absolute -bottom-4 -left-4 p-4 bg-card/90 backdrop-blur-sm border shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">SOS System</div>
                    <div className="text-xs text-muted-foreground">
                      Emergency alerts
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-primary to-primary-glow">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">
            Join India's Marine Research Network
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Access comprehensive marine data, collaborate with leading
            scientists, and contribute to sustainable ocean management
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="text-lg px-8"
            >
              <Link to="/scientists">
                <Microscope className="w-5 h-5 mr-2" />
                Start Research
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-lg px-8 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              <Link to="/ocean-map">
                <Map className="w-5 h-5 mr-2" />
                Explore Ocean Data
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-ocean-deep text-primary-foreground py-12 px-4">
        <div className="container mx-auto">
          <div className="grid gap-8 md:grid-cols-3 text-center md:text-left">
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                <Waves className="w-8 h-8" />
                <span className="font-bold text-xl">NEERVA</span>
              </div>
              <p className="text-primary-foreground/80 leading-relaxed">
                Advancing marine science for sustainable ocean management and
                blue economy development.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2 text-primary-foreground/80">
                <div>
                  <Link
                    to="/fisheries"
                    className="hover:text-primary-foreground transition-colors"
                  >
                    Fisheries Dashboard
                  </Link>
                </div>
                <div>
                  <Link
                    to="/scientists"
                    className="hover:text-primary-foreground transition-colors"
                  >
                    Research Platform
                  </Link>
                </div>
                <div>
                  <Link
                    to="/ocean-map"
                    className="hover:text-primary-foreground transition-colors"
                  >
                    Ocean Monitoring
                  </Link>
                </div>
                <div>
                  <Link
                    to="/sos"
                    className="hover:text-primary-foreground transition-colors"
                  >
                    Emergency Services
                  </Link>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Contact Information</h3>
              <div className="space-y-2 text-primary-foreground/80">
                <p>Ministry of Earth Sciences</p>
                <p>Government of India</p>
                <p>Kochi, Kerala</p>
                <p>info@neerva.gov.in</p>
              </div>
            </div>
          </div>

          <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-primary-foreground/60">
            <p>
              &copy; 2024 Centre for Marine Living Resources and Ecology. All
              rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;