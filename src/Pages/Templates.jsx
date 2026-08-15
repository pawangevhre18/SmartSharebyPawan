import { Eye, Check } from "lucide-react";

function Templates() {
  const templates = [
    {
      name: "Minimal",
      description: "Clean and simple profile for everyone.",
      className: "template-minimal",
    },
    {
      name: "Creator",
      description: "Perfect for creators and social profiles.",
      className: "template-creator",
    },
    {
      name: "Professional",
      description: "A polished profile for developers and professionals.",
      className: "template-professional",
    },
  ];

  return (
    <main className="inner-page">

      <section className="page-hero">

        <span className="page-badge">PROFILE TEMPLATES</span>

        <h1>
          Choose a style that
          <span> feels like you.</span>
        </h1>

        <p>
          Start with a beautiful template and customize it
          to create your perfect SmartShare profile.
        </p>

      </section>

      <section className="templates-grid">

        {templates.map((template, index) => (
          <div className="template-card" key={index}>

            <div className={`template-preview ${template.className}`}>

              <div className="mini-profile">

                <div className="mini-avatar">
                  PG
                </div>

                <h3>Pawan Gurjar</h3>

                <p>Full Stack Developer</p>

                <div className="mini-links">
                  <span>Portfolio</span>
                  <span>LinkedIn</span>
                  <span>GitHub</span>
                </div>

              </div>

            </div>

            <div className="template-info">

              <div>
                <h3>{template.name}</h3>
                <p>{template.description}</p>
              </div>

              <button className="template-button">
                <Eye size={16} />
                Preview
              </button>

            </div>

          </div>
        ))}

      </section>

      <section className="template-cta">

        <div>
          <Check size={20} />
          <span>All templates are fully responsive</span>
        </div>

        <div>
          <Check size={20} />
          <span>Customize your profile anytime</span>
        </div>

      </section>

    </main>
  );
}

export default Templates;