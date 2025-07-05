"use client";
import { HelpCircle } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../../../../components/CommonUI/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../../../../components/DashboardUI/accordion";

export default function HackathonFAQs({ sectionRef }) {
  // Static or dynamic FAQs
  const faqs = [
    {
      question: "Who can participate?",
      answer:
        "Anyone with a passion for building and learning can join! Students, professionals, or beginners – all are welcome.",
    },
    {
      question: "Do I need a team to register?",
      answer:
        "No, solo registrations are allowed. You can also form or join teams after registering.",
    },
    {
      question: "Is there a registration fee?",
      answer:
        "Nope! The hackathon is completely free to join.",
    },
    {
      question: "What should I build?",
      answer:
        "You can solve any of the provided problem statements or bring your own innovative idea that fits the theme.",
    },
    {
      question: "Will there be prizes?",
      answer:
        "Yes! Top teams will receive exciting prizes, perks, and exclusive opportunities.",
    },
  ];

  return (
    <section ref={sectionRef} className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-800 border-b pb-4">FAQs</h2>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-500" />
            Frequently Asked Questions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`faq-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </section>
  );
}
