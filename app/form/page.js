"use client";
import { useState, useEffect, useCallback } from "react";
import { z } from "zod";
import Image from "next/image";
import Link from "next/link";
import { Button, Checkbox, Spinner } from "../components/ui";
import FormField from "../components/FormField";
import { useToast } from "../hooks/useToast";
const schema = z.object({
  name: z.string().nonempty("Name is required"),
  ownerName: z.string().optional(),
  email: z.string().email("Invalid email address"),
  number: z
    .string()
    .regex(/^(?:\+?61|0)\s?[2-478](?:[ -]?[0-9]){8}$/)
    .or(z.string().regex(/^(?:\+?91|0)?[6789]\d{9}$/))
    .refine((value) => value !== "", {
      message: "Phone number is required",
    }),
  ownerNumber: z.string().optional(),
  address: z.string().nonempty("Address is required"),
  date: z.string().nonempty("Date is required"),
  time: z.string().nonempty("Time is required"),
});

export default function FormPage() {
  const [formData, setFormData] = useState({
    name: "",
    ownerName: "",
    email: "",
    number: "",
    ownerNumber: "",
    address: "",
    date: "",
    time: "",
    services: [],
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const showToast = useToast();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prevData) => ({
        ...prevData,
        services: checked
          ? [...prevData.services, value]
          : prevData.services.filter((service) => service !== value),
      }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      schema.parse(formData);
      setErrors({});

      const response = await fetch("/api/submit-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        showToast("Booking request sent", "success");
        setFormData({
          name: "",
          ownerName: "",
          email: "",
          number: "",
          ownerNumber: "",
          address: "",
          date: "",
          time: "",
          services: [],
        });

        setTimeout(() => {
          showToast(
            `Requested for ${formData.date} at ${formData.time}`,
            "success"
          );
        }, 1000);
      } else {
        showToast("Error submitting form", "error");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationErrors = {};
        error.errors.forEach((err) => {
          validationErrors[err.path[0]] = err.message;
        });
        setErrors(validationErrors);
      } else {
        showToast("Error submitting form", "error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isClient) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper">
        <Spinner size="lg" label="Loading the booking form" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="shell flex h-16 items-center justify-between border-b border-rule md:h-20">
        <Link href="/" className="text-sm font-medium uppercase tracking-[0.24em]">
          Archi
        </Link>
        <Link href="/portfolio" className="link-underline text-sm">
          Portfolio
        </Link>
      </div>

      <div className="shell grid grid-cols-1 gap-12 py-12 md:grid-cols-12 md:py-20">
        <div className="md:col-span-5">
          <h1 className="display text-[clamp(2.5rem,7vw,5rem)]">Book a shoot</h1>
          <p className="measure mt-4 text-base text-ink-soft">
            Tell us about the property and the dates that suit, and we&apos;ll
            be in touch about availability and pricing.
          </p>

          <div className="relative mt-10 hidden h-[52vh] overflow-hidden bg-paper-2 md:block">
            <Image
              className="object-cover"
              fill
              sizes="(min-width: 768px) 42vw, 100vw"
              src="https://images.pexels.com/photos/1080696/pexels-photo-1080696.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Interior of a light-filled home"
            />
          </div>

          <p className="mt-8 text-sm text-ink-soft">
            Prefer email?{" "}
            <Link
              href="mailto:sales@archiphotography.com"
              className="link-underline text-ink"
            >
              sales@archiphotography.com
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="md:col-span-6 md:col-start-7" noValidate>
          <fieldset className="border-0 p-0">
            <legend className="mb-4 w-full border-b border-rule pb-2 text-sm text-ink-soft">
              Your details
            </legend>
            <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-2">
              <FormField
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                required
              />
              <FormField
                label="Owner's name (optional)"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleChange}
                error={errors.ownerName}
              />
              <FormField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                required
              />
              <FormField
                label="Phone number"
                name="number"
                type="tel"
                value={formData.number}
                onChange={handleChange}
                error={errors.number}
                required
              />
              <FormField
                label="Owner's phone (optional)"
                name="ownerNumber"
                type="tel"
                value={formData.ownerNumber}
                onChange={handleChange}
                error={errors.ownerNumber}
              />
            </div>
          </fieldset>

          <fieldset className="mt-8 border-0 p-0">
            <legend className="mb-4 w-full border-b border-rule pb-2 text-sm text-ink-soft">
              The shoot
            </legend>
            <FormField
              label="Property address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              error={errors.address}
              required
            />
            <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-2">
              <FormField
                label="Preferred date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                error={errors.date}
                required
              />
              <FormField
                label="Preferred time"
                name="time"
                type="time"
                value={formData.time}
                onChange={handleChange}
                error={errors.time}
                required
              />
            </div>
          </fieldset>

          <fieldset className="mt-8 border-0 p-0">
            <legend className="mb-4 w-full border-b border-rule pb-2 text-sm text-ink-soft">
              Services
            </legend>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                "Photography",
                "Floor Planning 2D Colored",
                "Floor Planning 2D Black & White",
                "Floor Plan 3D",
              ].map((service) => (
                <Checkbox
                  key={service}
                  name="services"
                  value={service}
                  onChange={handleChange}
                  isSelected={formData.services.includes(service)}
                >
                  {service}
                </Checkbox>
              ))}
            </div>
          </fieldset>

          <Button
            type="submit"
            color="primary"
            size="lg"
            className="mt-8 w-full"
            isLoading={isSubmitting}
          >
            {isSubmitting ? "Sending" : "Request this booking"}
          </Button>
          <p className="mt-3 text-xs text-ink-soft">
            This is a booking request, not a confirmed booking. No payment is
            taken here.
          </p>
        </form>
      </div>
    </div>
  );
}
