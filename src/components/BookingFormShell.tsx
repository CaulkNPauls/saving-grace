"use client";

import { useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode } from "react";
import { bookingSuccess } from "@/content/site";

type ServiceOption = "tattoo" | "hair" | "nails" | "consultation";

const services: { value: ServiceOption; label: string }[] = [
  { value: "tattoo", label: "Tattoo" },
  { value: "hair", label: "Hair" },
  { value: "nails", label: "Nails" },
  { value: "consultation", label: "Consultation" },
];

const STEP_LABELS = ["Service", "About You", "Details", "Send"];
const LAST_STEP = STEP_LABELS.length - 1;

export default function BookingFormShell() {
  const [service, setService] = useState<ServiceOption>("tattoo");
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const stepRefs = useRef<Array<HTMLDivElement | null>>([]);

  // Steps stay mounted (so answers survive Back/Next), only hidden via
  // CSS — but hidden fields are still "invalid form controls" per the
  // HTML spec (display:none doesn't bar them from constraint
  // validation), and an unfocusable invalid control makes
  // form.reportValidity() silently fail with no visible feedback. So
  // validate only the controls inside the currently visible step.
  function validateStep(index: number) {
    const panel = stepRefs.current[index];
    const controls = panel
      ? Array.from(
          panel.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
            "input, textarea, select"
          )
        )
      : [];

    return controls.every((control) => control.reportValidity());
  }

  function goNext() {
    if (!validateStep(step)) return;
    setStep((current) => Math.min(current + 1, LAST_STEP));
  }

  function goBack() {
    setStep((current) => Math.max(current - 1, 0));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    // Phase 1/2 UI shell only — nothing is sent, stored, or emailed.
    event.preventDefault();
    if (step !== LAST_STEP) return;
    if (!validateStep(step)) return;
    setSubmitted(true);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLFormElement>) {
    if (event.key !== "Enter") return;
    const target = event.target as HTMLElement;
    if (target.tagName === "TEXTAREA") return;
    if (step < LAST_STEP) {
      event.preventDefault();
      goNext();
    }
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-xl border border-oxblood/40 bg-charcoal px-6 py-14 text-center sm:px-8 sm:py-16">
        <h2 className="font-display text-2xl uppercase tracking-wide text-bone sm:text-3xl">
          {bookingSuccess.heading}
        </h2>
        <p className="mt-4 font-serif text-lg text-parchment/90">{bookingSuccess.body}</p>
        <p className="mt-6 font-display text-sm uppercase tracking-widest text-oxblood-bright">
          {bookingSuccess.signoff}
        </p>
        <p className="mt-10 text-xs uppercase tracking-wide text-metal">
          Development preview only — no request was actually sent.
        </p>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      onKeyDown={handleKeyDown}
      className="booking-form mx-auto flex max-w-2xl flex-col gap-8 p-5 sm:p-8"
      noValidate
    >
      <div>
        <div className="flex items-center justify-between font-sans text-xs uppercase tracking-widest text-metal">
          <span>
            Step {step + 1} of {STEP_LABELS.length}
          </span>
          <span>{STEP_LABELS[step]}</span>
        </div>
        <div className="mt-3 h-px w-full bg-bone/15">
          <div
            className="h-px bg-oxblood-bright transition-all duration-300"
            style={{ width: `${((step + 1) / STEP_LABELS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Step 0 — Service */}
      <div
        ref={(el) => {
          stepRefs.current[0] = el;
        }}
        className={step === 0 ? "flex flex-col gap-6" : "hidden"}
      >
        <fieldset>
          <legend className="mb-3 font-sans text-xs uppercase tracking-[0.3em] text-metal">
            What are you booking?
          </legend>
          <div className="flex flex-wrap gap-3">
            {services.map((option) => (
              <label key={option.value} className="cursor-pointer">
                <input
                  type="radio"
                  name="service"
                  value={option.value}
                  checked={service === option.value}
                  onChange={() => setService(option.value)}
                  className="peer sr-only"
                />
                <span className="inline-flex items-center border border-bone/25 px-4 py-2.5 font-sans text-sm uppercase tracking-wide text-bone/80 transition-colors peer-checked:border-oxblood-bright peer-checked:bg-oxblood peer-checked:text-bone">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      {/* Step 1 — About you */}
      <div
        ref={(el) => {
          stepRefs.current[1] = el;
        }}
        className={step === 1 ? "grid gap-6 sm:grid-cols-2" : "hidden"}
      >
        <Field label="Name" name="name" required />
        <Field label="Email" name="email" type="email" required />
        <Field label="Phone" name="phone" type="tel" />
        <Field label="Pronouns (optional)" name="pronouns" />
      </div>

      {/* Step 2 — Details (service-specific) */}
      <div
        ref={(el) => {
          stepRefs.current[2] = el;
        }}
        className={step === 2 ? "grid gap-6" : "hidden"}
      >
        {service === "tattoo" && (
          <>
            <TextArea label="Tattoo idea" name="idea" required />
            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="Placement" name="placement" required />
              <Field label="Approximate size" name="size" />
              <Select
                label="Black & grey or color"
                name="colorStyle"
                options={["Black & grey", "Color", "Not sure yet"]}
              />
              <Select
                label="Custom or flash"
                name="designType"
                options={["Custom design", "Flash"]}
              />
              <Field label="Budget (optional)" name="budget" />
              <Field label="Preferred dates" name="preferredDates" />
            </div>
            <Select
              label="Schedule flexibility"
              name="flexibility"
              options={["Flexible", "Somewhat flexible", "Specific date needed"]}
            />
            <FileField label="Reference images" name="referenceImages" />
            <FileField
              label="Existing tattoo / placement photo (optional)"
              name="placementPhoto"
            />
            <TextArea label="Additional information" name="additionalInfo" />
          </>
        )}

        {service === "hair" && (
          <>
            <Select
              label="Service type"
              name="hairService"
              options={["Cut", "Color", "Style", "Cut + color"]}
            />
            <TextArea label="Current hair" name="currentHair" />
            <TextArea label="Desired result" name="desiredResult" required />
            <FileField label="Current hair photo" name="currentHairPhoto" />
            <FileField label="Inspiration photos" name="inspirationPhotos" />
            <TextArea label="Hair history" name="hairHistory" />
            <Field label="Preferred date" name="preferredDate" />
          </>
        )}

        {service === "nails" && (
          <>
            <Select
              label="Service type"
              name="nailService"
              options={["Full set", "Fill", "Manicure", "Nail art"]}
            />
            <TextArea label="Desired result" name="desiredResult" required />
            <FileField label="Inspiration photos" name="inspirationPhotos" />
            <Field label="Preferred date" name="preferredDate" />
          </>
        )}

        {service === "consultation" && (
          <>
            <TextArea
              label="What would you like to discuss?"
              name="consultationTopic"
              required
            />
            <Field label="Preferred date" name="preferredDate" />
          </>
        )}
      </div>

      {/* Step 3 — Policies & send */}
      <div
        ref={(el) => {
          stepRefs.current[3] = el;
        }}
        className={step === 3 ? "flex flex-col gap-6" : "hidden"}
      >
        {service === "tattoo" ? (
          <div className="flex flex-col gap-3">
            <Checkbox
              name="depositPolicy"
              label="I understand a $50 non-refundable deposit is required to hold my appointment, and that it applies toward my final price."
              required
            />
            <Checkbox
              name="designPolicy"
              label="I understand Grace draws her designs herself and artwork is normally not sent before the appointment. Reasonable changes can be discussed at the start of the session."
              required
            />
            <Checkbox
              name="aiPolicy"
              label="I understand Grace does not use or tattoo AI-generated designs."
              required
            />
          </div>
        ) : (
          <p className="font-serif text-base text-parchment/85">
            Grace will follow up personally once your request is reviewed.
          </p>
        )}
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-bone/10 pt-6">
        {step > 0 ? (
          <button
            type="button"
            onClick={goBack}
            className="inline-flex items-center justify-center border border-bone/25 px-5 py-3 font-sans text-sm uppercase tracking-wide text-bone/80 transition-colors hover:border-bone/50 hover:text-bone"
          >
            Back
          </button>
        ) : (
          <span />
        )}

        {step < LAST_STEP ? (
          <button
            type="button"
            onClick={goNext}
            className="inline-flex items-center justify-center border border-oxblood-bright bg-oxblood px-8 py-3 font-sans text-sm font-semibold uppercase tracking-wide text-bone transition-colors hover:bg-oxblood-bright"
          >
            Next
          </button>
        ) : (
          <button
            type="submit"
            className="inline-flex items-center justify-center border border-oxblood-bright bg-oxblood px-8 py-3 font-sans text-sm font-semibold uppercase tracking-wide text-bone transition-colors hover:bg-oxblood-bright"
          >
            Send Request
          </button>
        )}
      </div>

      <p className="text-center text-xs uppercase tracking-wide text-metal">
        Development preview — this form does not send data yet.
      </p>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="font-sans text-xs uppercase tracking-wide text-metal">
        {label}
        {required && <span className="text-oxblood-bright"> *</span>}
      </span>
      <input
        type={type}
        name={name}
        required={required}
        className="border border-bone/20 bg-charcoal px-4 py-3 font-sans text-bone placeholder:text-metal/60"
      />
    </label>
  );
}

function TextArea({
  label,
  name,
  required = false,
}: {
  label: string;
  name: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="font-sans text-xs uppercase tracking-wide text-metal">
        {label}
        {required && <span className="text-oxblood-bright"> *</span>}
      </span>
      <textarea
        name={name}
        required={required}
        rows={4}
        className="border border-bone/20 bg-charcoal px-4 py-3 font-sans text-bone placeholder:text-metal/60"
      />
    </label>
  );
}

function Select({ label, name, options }: { label: string; name: string; options: string[] }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="font-sans text-xs uppercase tracking-wide text-metal">{label}</span>
      <select name={name} className="border border-bone/20 bg-charcoal px-4 py-3 font-sans text-bone">
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function FileField({ label, name }: { label: string; name: string }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="font-sans text-xs uppercase tracking-wide text-metal">{label}</span>
      <input
        type="file"
        name={name}
        multiple
        accept="image/*"
        className="border border-bone/20 bg-charcoal px-4 py-3 font-sans text-sm text-bone/80 file:mr-4 file:border-0 file:bg-oxblood file:px-3 file:py-1.5 file:font-sans file:text-xs file:uppercase file:tracking-wide file:text-bone"
      />
    </label>
  );
}

function Checkbox({
  label,
  name,
  required = false,
}: {
  label: string;
  name: string;
  required?: boolean;
}): ReactNode {
  return (
    <label className="flex items-start gap-3">
      <input
        type="checkbox"
        name={name}
        required={required}
        className="mt-1 h-4 w-4 shrink-0 border border-bone/30 bg-charcoal accent-[#5a161b]"
      />
      <span className="font-serif text-sm text-parchment/90">{label}</span>
    </label>
  );
}
