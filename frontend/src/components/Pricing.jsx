import React from 'react';
import { Check } from 'lucide-react';
import Card from './ui/Card';
import Button from './ui/Button';

const plans = [
  {
    name: "Free",
    price: "₹0",
    features: ["3 reports/month", "AI Summary", "Basic Risk Radar"],
    button: "Get Started",
    popular: false
  },
  {
    name: "Pro",
    price: "₹299",
    features: ["Unlimited reports", "Health Twin AI", "Long-term tracking", "PDF Exports"],
    button: "Go Pro",
    popular: true
  },
  {
    name: "Family",
    price: "₹699",
    features: ["Up to 5 members", "Caregiver dashboard", "Priority AI analysis"],
    button: "Start Family Plan",
    popular: false
  }
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-32 px-6 bg-slate-950/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold mb-4">Simple, transparent pricing</h2>
          <p className="text-slate-400">Choose the plan that fits your health journey</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <Card 
              key={i} 
              className={`relative ${plan.popular ? 'border-primary/50 shadow-[0_0_30px_rgba(14,165,233,0.15)]' : 'border-white/5'}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold py-1 px-3 rounded-full uppercase tracking-widest">
                  Most Popular
                </div>
              )}
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-slate-500">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-center gap-3 text-sm text-slate-300">
                    <Check size={16} className="text-primary" /> {feature}
                  </li>
                ))}
              </ul>
              <Button variant={plan.popular ? 'primary' : 'glass'} className="w-full">
                {plan.button}
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
