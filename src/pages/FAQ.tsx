import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does billing work?",
    answer: "We offer monthly subscriptions that renew automatically. You can cancel anytime from your account page. Free plan requires no payment information."
  },
  {
    question: "What's your refund policy?",
    answer: "We offer a 7-day money-back guarantee on all paid plans. If you're not satisfied, contact us within 7 days for a full refund."
  },
  {
    question: "How does the squad matching work?",
    answer: "Our Basic Squad Finder shows all available players. Premium users get AI-powered chemistry matching based on playstyle, position, schedule, and region compatibility."
  },
  {
    question: "When is phone concierge available?",
    answer: "Phone concierge is available for Premium members Monday-Friday, 2pm-10pm EST. Book your slot through the dashboard or we'll reach out proactively for build consultations."
  },
  {
    question: "Is my data private?",
    answer: "Yes. We never share your personal information or gaming stats with third parties. Your profile is only visible to matched crew members unless you opt into public leaderboards."
  },
  {
    question: "Can I switch plans?",
    answer: "Absolutely! You can upgrade or downgrade at any time. Upgrades take effect immediately. Downgrades take effect at the end of your current billing period."
  },
  {
    question: "What platforms do you support?",
    answer: "We support PlayStation, Xbox, and PC. Make sure to specify your platform in your profile for accurate squad matching."
  },
  {
    question: "Do I need a mic?",
    answer: "While not required for Free tier, Pro and Premium members are expected to have a working mic for crew coordination and coaching sessions."
  },
  {
    question: "How does the AI Build Assistant work?",
    answer: "Tell us your playstyle and position, and our AI suggests optimal attribute splits, badge combinations, and takeovers based on current meta and your goals."
  },
  {
    question: "Can I cancel anytime?",
    answer: "Yes, you can cancel your subscription at any time with no penalties. You'll retain access through the end of your billing period."
  }
];

export default function FAQ() {
  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-deep-space via-cosmic-purple to-deep-space"></div>
      </div>
      
      <Header />
      
      <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-gray-300">
              Everything you need to know about NBA 2K Protocol
            </p>
          </div>

          <Accordion id="pcz-faq" type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, idx) => (
              <AccordionItem 
                key={idx} 
                value={`item-${idx}`}
                className="bg-cosmic-purple/20 border-electric-cyan/30 backdrop-blur-sm px-6 rounded-lg"
              >
                <AccordionTrigger className="text-left text-white hover:text-electric-cyan">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </main>

      <Footer />
    </div>
  );
}