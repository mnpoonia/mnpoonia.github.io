# Recommendation Flow

## Direct Recommendation

The main flow trusts the organism and stage selected by the farmer:

```text
Choose crop
  -> Choose a linked pest or disease
  -> Choose observed life stage or symptom stage
  -> Enter severity, date, and previous applications
  -> Review relevant formulation options and constraints
```

The response is framed as:

> Based on the crop, organism, and stage you selected.

It then applies formulation-use records, PPQS or label evidence, prior IRAC/FRAC exposure, crop conditions, dose, PHI, REI, interval, maximum applications, and source status.

## Optional Identification

```text
Unknown observation
  -> Image/symptom guide
  -> Choose possible organism and stage
  -> Continue to direct recommendation
```

The identification guide is an aid for users who need it. It is not a confirmation gate and it does not override a farmer's selected disease or pest.

## Disease And Fungicide Scenario

```text
Crop: Kinnow
Disease: Phytophthora foot rot / gummosis
Symptom stage: Early root-collar gumming
Severity: Medium
```

The system uses this as the working scenario and shows source-backed fungicide options. A likely or laboratory-confirmed pathogen can refine confidence and constraints, but it is not required before the farmer can view relevant options.
