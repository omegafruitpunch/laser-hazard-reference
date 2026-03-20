"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface FormField {
  id: string;
  label: string;
  type: "text" | "select" | "date" | "time" | "number" | "textarea" | "radio";
  required: boolean;
  helpText?: string;
  options?: string[];
  placeholder?: string;
}

interface FormStep {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
}

const formSteps: FormStep[] = [
  {
    id: "section1",
    title: "Section 1: General Information",
    description: "Basic event and proponent details",
    fields: [
      {
        id: "faa_service_center",
        label: "FAA Service Center",
        type: "select",
        required: true,
        helpText: "Select the service center responsible for the operation area",
        options: ["Eastern Service Center", "Central Service Center", "Western Service Center", "Alaska Service Center"],
      },
      {
        id: "proponent_name",
        label: "Proponent Name",
        type: "text",
        required: true,
        helpText: "The party primarily responsible for laser safety",
      },
      {
        id: "event_name",
        label: "Event/Facility Name",
        type: "text",
        required: true,
        helpText: "Event name for temporary shows or facility name for permanent installations",
      },
      {
        id: "date_prepared",
        label: "Date Prepared",
        type: "date",
        required: true,
        helpText: "Date the form is being prepared (not the operation date)",
      },
    ],
  },
  {
    id: "section2",
    title: "Section 2: Date(s) and Time(s)",
    description: "Operation schedule with time zone",
    fields: [
      {
        id: "operation_dates",
        label: "Operation Date(s)",
        type: "textarea",
        required: true,
        helpText: "Example: May 20, 2024, 7:00 p.m. to 12:00 a.m. (midnight), Central Time",
      },
      {
        id: "testing_dates",
        label: "Testing/Alignment Date(s)",
        type: "textarea",
        required: false,
        helpText: "If applicable, when testing and alignment will occur",
      },
    ],
  },
  {
    id: "section3",
    title: "Section 3-4: Operation Details",
    description: "Description and on-site contact information",
    fields: [
      {
        id: "operation_description",
        label: "Brief Description of Laser Operation",
        type: "textarea",
        required: true,
        helpText: "Provide general overview. Detailed laser configurations go on page 2.",
      },
      {
        id: "operator_name",
        label: "Laser Operator(s)",
        type: "text",
        required: true,
      },
      {
        id: "primary_phone",
        label: "Primary On-Site Phone",
        type: "text",
        required: true,
        helpText: "Must be a U.S. phone number with direct link to laser operator",
      },
      {
        id: "secondary_phone",
        label: "Secondary On-Site Phone",
        type: "text",
        required: false,
      },
    ],
  },
  {
    id: "section5",
    title: "Section 5: FDA/CDRH Information",
    description: "Variance details for demonstration lasers",
    fields: [
      {
        id: "variance_number",
        label: "FDA Variance Number",
        type: "text",
        required: false,
        helpText: "Required for laser light shows regulated by FDA/CDRH",
      },
      {
        id: "variance_expiration",
        label: "Variance Expiration Date",
        type: "date",
        required: false,
      },
      {
        id: "accession_number",
        label: "FDA Accession Number",
        type: "text",
        required: false,
        helpText: "Seven alphanumeric digits provided by FDA/CDRH",
      },
    ],
  },
  {
    id: "section6",
    title: "Section 6: Control Measures",
    description: "Safety measures to protect airspace",
    fields: [
      {
        id: "control_measures",
        label: "Description of Control Measures",
        type: "textarea",
        required: true,
        helpText: "Describe observers, termination surfaces, radar/imaging equipment, or physical beam path limits",
      },
      {
        id: "electronic_protection",
        label: "Using Electronic Protection System?",
        type: "radio",
        required: true,
        options: ["Yes - Using SAE AS6029 compliant system", "No - Using safety observers", "No - Using beam termination"],
      },
    ],
  },
];

export const NOTAMFilingSimulator: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [completed, setCompleted] = useState(false);
  const [showHelp, setShowHelp] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const currentSection = formSteps[currentStep];
  const progress = ((currentStep + 1) / formSteps.length) * 100;

  const handleFieldChange = (fieldId: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
    if (errors[fieldId]) {
      setErrors((prev) => ({ ...prev, [fieldId]: "" }));
    }
  };

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    currentSection.fields.forEach((field) => {
      if (field.required && !formData[field.id]) {
        newErrors[field.id] = "This field is required";
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (currentStep < formSteps.length - 1) {
        setCurrentStep((prev) => prev + 1);
      } else {
        setCompleted(true);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const renderField = (field: FormField) => {
    const error = errors[field.id];
    const value = formData[field.id] || "";

    return (
      <div key={field.id} className="mb-4">
        <label className="block text-sm font-medium text-foreground mb-1">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>

        {field.helpText && (
          <button
            onClick={() => setShowHelp(showHelp === field.id ? null : field.id)}
            className="text-xs text-blue-600 hover:text-blue-800 mb-1 flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {showHelp === field.id ? "Hide Help" : "Show Help"}
          </button>
        )}

        {showHelp === field.id && field.helpText && (
          <div className="bg-blue-50 p-3 rounded-lg mb-2 text-sm text-blue-800">
            {field.helpText}
          </div>
        )}

        {field.type === "select" && (
          <select
            className={cn(
              "w-full p-2 border rounded-lg",
              error ? "border-red-500" : "border-gray-300"
            )}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
          >
            <option value="">Select...</option>
            {field.options?.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        )}

        {field.type === "radio" && (
          <div className="space-y-2">
            {field.options?.map((opt) => (
              <label key={opt} className="flex items-center p-2 border rounded-lg cursor-pointer hover:bg-muted">
                <input
                  type="radio"
                  name={field.id}
                  value={opt}
                  checked={value === opt}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  className="mr-3"
                />
                <span className="text-sm">{opt}</span>
              </label>
            ))}
          </div>
        )}

        {field.type === "textarea" && (
          <textarea
            className={cn(
              "w-full p-2 border rounded-lg h-24",
              error ? "border-red-500" : "border-gray-300"
            )}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder={field.helpText}
          />
        )}

        {field.type !== "select" && field.type !== "radio" && field.type !== "textarea" && (
          <input
            type={field.type}
            className={cn(
              "w-full p-2 border rounded-lg",
              error ? "border-red-500" : "border-gray-300"
            )}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder={field.helpText}
          />
        )}

        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    );
  };

  if (completed) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Form 7140-1 Completed!</h2>
          <p className="text-muted-foreground mb-6">
            You have successfully completed the simulated FAA Form 7140-1.
          </p>

          <div className="bg-blue-50 rounded-lg p-6 text-left mb-6">
            <h3 className="font-semibold text-blue-900 mb-3">Next Steps in Real Process:</h3>
            <ol className="space-y-2 text-blue-800 text-sm">
              <li>1. Attach diagrams depicting planned laser paths</li>
              <li>2. Include Laser Configuration Worksheet for each configuration</li>
              <li>3. Submit to appropriate FAA Service Center at least 30 days before operation</li>
              <li>4. Wait for Letter of Determination (LOD) from FAA</li>
              <li>5. Do not proceed until receiving LOD with "no objection"</li>
            </ol>
          </div>

          <Button
            onClick={() => {
              setCurrentStep(0);
              setCompleted(false);
              setFormData({});
            }}
          >
            Start Over
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">FAA Form 7140-1 Simulator</h2>
        <p className="text-muted-foreground">Step-by-step walkthrough for NOTAM filing</p>
      </div>

      {/* Progress */}
      <div>
        <div className="flex justify-between text-sm mb-2">
          <span>
            Step {currentStep + 1} of {formSteps.length}
          </span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} />
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>{currentSection.title}</CardTitle>
          <CardDescription>{currentSection.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-4 rounded-lg">
            {currentSection.fields.map(renderField)}
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 0}>
              Previous
            </Button>
            <Button onClick={handleNext}>
              {currentStep === formSteps.length - 1 ? "Complete Form" : "Next"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="pt-4">
          <h4 className="font-semibold text-yellow-800 mb-2 flex items-center">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Key Reminders
          </h4>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• All fields marked with * are required</li>
            <li>• File at least 30 days before the planned operation</li>
            <li>• Use decimal notation (0.7277) not scientific notation</li>
            <li>• Contact your local FAA Service Center if you need assistance</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default NOTAMFilingSimulator;
