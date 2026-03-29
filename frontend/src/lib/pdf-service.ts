import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface TaxReportData {
  name: string;
  annualIncome: number;
  totalDeductions: number;
  oldTax: number;
  newTax: number;
  betterRegime: "Old" | "New";
  savings: number;
  claimedDeductions: { label: string; amount: number }[];
  aiInsight: string;
}

export const generateTaxReport = (data: TaxReportData) => {
  const doc = new jsPDF();
  const fmt = (n: number) => `Rs. ${Math.round(n).toLocaleString("en-IN")}`;

  // Header
  doc.setFillColor(31, 41, 55); // Dark gray
  doc.rect(0, 0, 210, 40, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.text("AI Money Mentor", 15, 20);
  doc.setFontSize(12);
  doc.text("Personalized Tax Optimization Report", 15, 30);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 150, 30);

  // User Info
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.text(`Report for: ${data.name}`, 15, 55);
  doc.text(`Annual Income: ${fmt(data.annualIncome)}`, 15, 65);

  // Summary Box
  doc.setDrawColor(200, 200, 200);
  doc.rect(15, 75, 180, 45);
  doc.setFontSize(12);
  doc.text("Executive Summary", 20, 85);
  doc.setFontSize(10);
  doc.text(`Recommended Regime: ${data.betterRegime} Regime`, 25, 95);
  doc.text(`Total Potential Savings: ${fmt(data.savings)}`, 25, 105);
  doc.text(`Deductions Claimed: ${fmt(data.totalDeductions)}`, 25, 115);

  // Regime Comparison Table
  autoTable(doc, {
    startY: 130,
    head: [["Regime", "Calculated Tax", "Status"]],
    body: [
      ["Old Regime", fmt(data.oldTax), data.betterRegime === "Old" ? "Recommended" : ""],
      ["New Regime", fmt(data.newTax), data.betterRegime === "New" ? "Recommended" : ""],
    ],
    theme: "striped",
    headStyles: { fillColor: [31, 41, 55] },
  });

  // Claimed Deductions Table
  if (data.claimedDeductions.length > 0) {
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 15,
      head: [["Section / Item", "Amount Claimed"]],
      body: data.claimedDeductions.map((d) => [d.label, fmt(d.amount)]),
      theme: "plain",
      headStyles: { fillColor: [75, 85, 99] },
    });
  }

  // AI Insight
  const finalY = (doc as any).lastAutoTable.finalY + 20;
  doc.setFontSize(12);
  doc.text("AI Advisor Insights", 15, finalY);
  doc.setFontSize(10);
  const splitInsight = doc.splitTextToSize(data.aiInsight, 180);
  doc.text(splitInsight, 15, finalY + 10);

  // Footer
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      "AI Money Mentor - This is an automated report based on user-provided data. Please consult a certified CA for official filing.",
      105,
      290,
      { align: "center" }
    );
  }

  doc.save(`Tax_Report_${data.name.replace(/\s+/g, "_")}.pdf`);
};
