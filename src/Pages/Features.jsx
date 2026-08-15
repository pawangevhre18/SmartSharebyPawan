import {
  Link2,
  QrCode,
  BarChart3,
  Palette,
  Smartphone,
  ShieldCheck,
} from "lucide-react";

function Features() {
  const features = [
    {
      icon: <Link2 size={24} />,
      title: "One Smart Link",
      description:
        "Share your portfolio, social profiles, resume and important links from one simple URL.",
    },
    {
      icon: <QrCode size={24} />,
      title: "Instant QR Code",
      description:
        "Create a QR code for your SmartShare profile and let people open it instantly.",
    },
    {
      icon: <BarChart3 size={24} />,
      title: "Simple Analytics",
      description:
        "Understand how people interact with your profile through views, clicks and scans.",
    },
    {
      icon: <Palette size={24} />,
      title: "Beautiful Templates",
      description:
        "Choose a profile design that matches your personal style and brand.",
    },
    {
      icon: <Smartphone size={24} />,
      title: "Mobile Friendly",
      description:
        "Your SmartShare profile looks clean and works smoothly on every device.",
    },
    {
      icon: <ShieldCheck size={24} />,
      title: "Easy & Secure",
      description:
        "Keep your important information organized in one simple and secure profile.",
    },
  ];

  return (
    <main className="inner-page">

      <section className="page-hero">
        <span className="page-badge">SMART FEATURES</span>

        <h1>
          Everything you need to
          <span> share smarter.</span>
        </h1>

        <p>
          SmartShare gives you everything you need to create,
          customize and share your digital identity.
        </p>
      </section>

      <section className="feature-list">

        {features.map((feature, index) => (
          <div className="big-feature-card" key={index}>

            <div className="big-feature-icon">
              {feature.icon}
            </div>

            <h2>{feature.title}</h2>

            <p>{feature.description}</p>

          </div>
        ))}

      </section>

    </main>
  );
}

export default Features;