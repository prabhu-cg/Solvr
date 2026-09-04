import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { ChevronDown } from 'lucide-react'
import { Container } from '@/components/marketing/container'
import { cn } from '@/lib/utils'

const FAQS = [
  {
    question: 'What is Solvr?',
    answer:
      'Solvr is a guided workspace that takes a product problem through a structured Product/UX design process — from Project Setup through Discover, Define, Ideate, Solution, Validate and Iterate.',
  },
  {
    question: 'Who is Solvr for?',
    answer:
      'Designers who want a structured way to run a project, and non-designers — product managers, founders, analysts — who need to think through a problem properly but don’t have a UX process of their own.',
  },
  {
    question: 'Do I need to know UX?',
    answer:
      'No. Solvr is built to guide people who don’t know the methodology, as well as speed things up for people who do.',
  },
  {
    question: 'What design process does Solvr use?',
    answer:
      'A seven-stage process: Project Setup, Discover, Define, Ideate, Solution, Validate and Iterate — moving from understanding the problem to a practical, structured solution, then testing it and improving it based on what you learn.',
  },
  {
    question: 'Is Solvr free?',
    answer:
      'Yes — you can start designing in Solvr for free today.',
  },
  {
    question: 'Does Solvr replace a designer?',
    answer:
      'No. Solvr is a design partner that structures your thinking and surfaces gaps — it doesn’t replace the judgement a designer or the wider team brings to a project.',
  },
  {
    question: 'Where is my project data stored?',
    answer:
      'In V1, your project data is stored locally in your browser. Solvr is built so a future cloud-connected version can be added without changing how your project works.',
  },
]

export function FAQSection() {
  return (
    <section id="faq" className="scroll-mt-16 border-t border-border bg-secondary py-20 sm:py-28">
      <Container className="max-w-3xl">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-wide text-primary-text">FAQ</p>
          <h2 className="mt-2 text-balance text-3xl font-extrabold sm:text-4xl">
            Frequently asked questions
          </h2>
        </div>

        <AccordionPrimitive.Root type="single" collapsible className="mt-10 flex flex-col gap-3">
          {FAQS.map((faq) => (
            <AccordionPrimitive.Item
              key={faq.question}
              value={faq.question}
              className="overflow-hidden rounded-lg border border-border bg-card"
            >
              <AccordionPrimitive.Header>
                <AccordionPrimitive.Trigger
                  className={cn(
                    'group flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-bold text-foreground focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring',
                  )}
                >
                  {faq.question}
                  <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
                </AccordionPrimitive.Trigger>
              </AccordionPrimitive.Header>
              <AccordionPrimitive.Content className="overflow-hidden px-5 text-sm leading-relaxed text-muted-foreground data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                <p className="pb-4">{faq.answer}</p>
              </AccordionPrimitive.Content>
            </AccordionPrimitive.Item>
          ))}
        </AccordionPrimitive.Root>
      </Container>
    </section>
  )
}
