import { Check } from "lucide-react";

function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "₹0",
      description: "For anyone getting started with SmartShare.",
      features: [
        "1 SmartShare profile",
        "Unlimited links",
        "Basic templates",
        "Personal QR code",
      ],
      button: "Get Started",
    },
    {
      name: "Pro",
      price: "₹199",
      description: "For creators, students and professionals.",
      features: [
        "Everything in Free",
        "Premium templates",
        "Advanced analytics",
        "Custom profile styling",
        "Priority features",
      ],
      button: "Start Pro",
      popular: true,
    },
    {
      name: "Business",
      price: "₹499",
      description: "For teams and growing personal brands.",
      features: [
        "Everything in Pro",
        "Multiple profiles",
        "Team management",
        "Advanced insights",
        "Business branding",
      ],
      button: "Choose Business",
    },
  ];

  return (
    <main className="inner-page">

      <section className="page-hero">

        <span className="page-badge">SIMPLE PRICING</span>

        <h1>
          Choose the plan that
          <span> works for you.</span>
        </h1>

        <p>
          Start for free and upgrade whenever you need
          more powerful SmartShare features.
        </p>

      </section>

      <section className="pricing-grid">

        {plans.map((plan, index) => (
          <div
            className={`pricing-card ${
              plan.popular ? "popular-plan" : ""
            }`}
            key={index}
          >

            {plan.popular && (
              <div className="popular-badge">
                MOST POPULAR
              </div>
            )}

            <h2>{plan.name}</h2>

            <p className="pricing-description">
              {plan.description}
            </p>

            <div className="price">
              <strong>{plan.price}</strong>

              {plan.name !== "Free" && (
                <span>/month</span>
              )}
            </div>

            <button className="pricing-button">
              {plan.button}
            </button>

            <div className="pricing-features">

              {plan.features.map((feature, featureIndex) => (
                <div
                  className="pricing-feature"
                  key={featureIndex}
                >
                  <Check size={17} />
                  <span>{feature}</span>
                </div>
              ))}

            </div>

          </div>
        ))}

      </section>

    </main>
  );
}

export default Pricing;