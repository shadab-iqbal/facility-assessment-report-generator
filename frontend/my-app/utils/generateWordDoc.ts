import { Document, Packer, Paragraph, TextRun, ExternalHyperlink } from "docx";
import { saveAs } from "file-saver";
import { FacilityData, ManualInputs } from "../types/facility";

function row(label: string, value: string | null | undefined): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({ text: `${label}: `, bold: true }),
      new TextRun({ text: value ? String(value) : "" }),
    ],
    spacing: { after: 120 },
  });
}

function gap(): Paragraph {
  return new Paragraph({ spacing: { after: 200 } });
}

export async function generateWordDoc(apiData: FacilityData, inputs: ManualInputs, ccn: string) {
  const finalName = inputs.nameOverride || apiData.name_of_facility || "";
  const dynamicLink = `https://www.medicare.gov/care-compare/details/nursing-home/${ccn}`;

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Header
          new Paragraph({
            children: [
              new TextRun({
                text: "INFINITE Managed by MEDELITE.",
                bold: true,
                size: 28,
              }),
            ],
          }),
          new Paragraph({
            children: [new TextRun({ text: "FACILITY ASSESSMENT SNAPSHOT", size: 24 })],
          }),
          new Paragraph({
            children: [new TextRun({ text: apiData.state_code, size: 24 })],
            spacing: { after: 400 },
          }),

          // Facility info
          row("Name of Facility", finalName),
          row("Location", apiData.location),
          row("EMR", inputs.emr),
          row("Census Capacity", apiData.census_capacity),
          row("Current Census", inputs.currentCensus),
          row("Type of Patient", inputs.patientType),
          row("Previous Coverage from Medelite", inputs.prevCoverage),
          row("Previous Provider Performance from Medelite", inputs.prevPerformance),
          row("Medical Coverage", inputs.medicalCoverage),

          gap(),

          // Star ratings
          row("Overall Star Rating", apiData.star_ratings.overall),
          row("Health Inspection", apiData.star_ratings.health_inspection),
          row("Staffing", apiData.star_ratings.staffing),
          row("Quality of Resident Care", apiData.star_ratings.quality_care),

          gap(),

          // Claims metrics

          row("Short Term Hospitalization", apiData.claims_metrics.short_term_hospitalization),
          row(
            "STR National Avg. for Hospitalization",
            apiData.claims_metrics.str_national_avg_hospitalization,
          ),
          row(
            "STR State Avg. for Hospitalization",
            apiData.claims_metrics.str_state_avg_hospitalization,
          ),
          row("STR ED Visit", apiData.claims_metrics.str_ed_visit),
          row("STR ED Visits National Avg.", apiData.claims_metrics.str_ed_visits_national_avg),
          row("STR ED Visits State Avg.", apiData.claims_metrics.str_ed_visits_state_avg),
          row("LT Hospitalization", apiData.claims_metrics.lt_hospitalization),
          row(
            "LT National Avg. for Hospitalization",
            apiData.claims_metrics.lt_national_avg_hospitalization,
          ),
          row(
            "LT State Avg. for Hospitalization",
            apiData.claims_metrics.lt_state_avg_hospitalization,
          ),
          row("LT ED Visit", apiData.claims_metrics.lt_ed_visit),
          row("LT ED Visits National Avg.", apiData.claims_metrics.lt_ed_visits_national_avg),
          row("LT ED Visits State Avg.", apiData.claims_metrics.lt_ed_visits_state_avg),

          gap(),
          new Paragraph({ spacing: { after: 200 } }),

          // Hyperlink
          new Paragraph({
            children: [
              new ExternalHyperlink({
                children: [
                  new TextRun({
                    text: "View Official Medicare Profile",
                    style: "Hyperlink",
                    color: "0000FF",
                    underline: {},
                  }),
                ],
                link: dynamicLink,
              }),
            ],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${finalName}_Assessment.docx`);
}
