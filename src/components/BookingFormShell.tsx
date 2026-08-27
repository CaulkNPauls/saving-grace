"use client";

import { useRef, useState, type FormEvent } from "react";
import { bookingSuccess } from "@/content/site";

const FORM_ID = "262337631264052";

export default function BookingFormShell() {
  const submittedRef = useRef(false);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (!event.currentTarget.reportValidity()) {
      event.preventDefault();
      return;
    }
    submittedRef.current = true;
    setSending(true);
  }

  if (submitted) {
    return (
      <div aria-live="polite" className="mx-auto max-w-xl border border-oxblood/40 bg-charcoal px-6 py-14 text-center sm:px-8 sm:py-16">
        <h2 className="font-display text-3xl uppercase tracking-wide text-bone">{bookingSuccess.heading}</h2>
        <p className="mt-4 font-serif text-lg text-parchment/90">{bookingSuccess.body}</p>
        <p className="mt-6 font-display text-sm uppercase tracking-widest text-oxblood-bright">{bookingSuccess.signoff}</p>
      </div>
    );
  }

  return (
    <>
      <iframe name="jotform-submit-frame" title="Booking submission response" className="hidden" onLoad={() => { if (submittedRef.current) setSubmitted(true); }} />
      <form action={`https://submit.jotform.com/submit/${FORM_ID}`} method="post" encType="multipart/form-data" target="jotform-submit-frame" onSubmit={handleSubmit} className="booking-form mx-auto grid w-full min-w-0 max-w-2xl gap-8 overflow-hidden p-4 sm:p-8">
        <input type="hidden" name="formID" value={FORM_ID} />
        <input type="hidden" name="simple_spc" value={`${FORM_ID}-${FORM_ID}`} />

        <fieldset className="grid min-w-0 gap-6">
          <legend className="mb-5 font-display text-xl uppercase tracking-wide text-bone">About You</legend>
          <div className="grid min-w-0 gap-6 sm:grid-cols-2">
            <Field label="First name" name="q2_q2_fullname0[first]" autoComplete="given-name" required />
            <Field label="Last name" name="q2_q2_fullname0[last]" autoComplete="family-name" required />
            <Field label="Email address" name="q3_q3_email1" type="email" autoComplete="email" required />
            <Field label="Phone number" name="q4_q4_phone2[full]" type="tel" autoComplete="tel" />
          </div>
        </fieldset>

        <fieldset className="grid min-w-0 gap-5 border-t border-bone/10 pt-8">
          <legend className="mb-1 font-display text-xl uppercase tracking-wide text-bone">Your Appointment</legend>
          <div className="flex flex-wrap gap-3">
            {["Tattoo Appointment", "Consultation", "Quote Request"].map((option) => (
              <label key={option} className="cursor-pointer">
                <input type="radio" name="q5_q5_radio3" value={option} required className="peer sr-only" />
                <span className="inline-flex border border-bone/25 px-4 py-2.5 font-sans text-sm uppercase tracking-wide text-bone/80 peer-checked:border-oxblood-bright peer-checked:bg-oxblood peer-checked:text-bone">{option}</span>
              </label>
            ))}
          </div>
          <TextArea label="Describe your tattoo idea and desired placement" name="q6_q6_textarea4" required />
          <Field label="Preferred dates and times" name="q7_q7_textbox5" required />
          <label className="flex min-w-0 flex-col gap-2">
            <span className="font-sans text-xs uppercase tracking-wide text-metal">Reference images (optional)</span>
            <input type="file" name="q8_q8_fileupload6[]" multiple accept="image/*" className="block w-full min-w-0 max-w-full overflow-hidden border border-bone/20 bg-charcoal px-3 py-3 text-xs text-bone/80 file:mr-2 file:max-w-full file:border-0 file:bg-oxblood file:px-3 file:py-2 file:text-xs file:uppercase file:text-bone sm:px-4 sm:text-sm sm:file:mr-4" />
            <span className="font-serif text-xs text-metal">Upload clear reference or placement photos directly from your device.</span>
          </label>
        </fieldset>

        <label className="flex items-start gap-3 border-t border-bone/10 pt-8">
          <input type="checkbox" required className="mt-1 h-4 w-4 accent-[#5a161b]" />
          <span className="font-serif text-sm text-parchment/90">I understand that submitting this request does not confirm an appointment. Grace will follow up with availability, pricing, and deposit details.</span>
        </label>
        <button disabled={sending} type="submit" className="justify-self-end border border-oxblood-bright bg-oxblood px-8 py-3 font-sans text-sm font-semibold uppercase tracking-wide text-bone transition-colors hover:bg-oxblood-bright disabled:cursor-wait disabled:opacity-60">{sending ? "Sending…" : "Send Request"}</button>
      </form>
    </>
  );
}

function Field({ label, name, type = "text", autoComplete, required = false }: { label: string; name: string; type?: string; autoComplete?: string; required?: boolean }) {
  return <label className="flex min-w-0 flex-col gap-2"><span className="font-sans text-xs uppercase tracking-wide text-metal">{label}{required && <span className="text-oxblood-bright"> *</span>}</span><input type={type} name={name} autoComplete={autoComplete} required={required} className="w-full min-w-0 max-w-full border border-bone/20 bg-charcoal px-4 py-3 font-sans text-bone" /></label>;
}

function TextArea({ label, name, required = false }: { label: string; name: string; required?: boolean }) {
  return <label className="flex min-w-0 flex-col gap-2"><span className="font-sans text-xs uppercase tracking-wide text-metal">{label}{required && <span className="text-oxblood-bright"> *</span>}</span><textarea name={name} required={required} rows={6} className="w-full min-w-0 max-w-full resize-y border border-bone/20 bg-charcoal px-4 py-3 font-sans text-bone" /></label>;
}
