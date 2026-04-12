import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Scale, Calendar, MapPin, Building, Users, FileText } from "lucide-react";
import IndianLawLogo from "../components/IndianLawLogo.jsx";

const API = import.meta.env.VITE_BACKEND_URL || "";

export default function PublicCaseView() {
  const { shareToken } = useParams();
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API}/api/public/case/${shareToken}`)
      .then((res) => {
        if (!res.ok) throw new Error("Case not found");
        return res.json();
      })
      .then((data) => {
        setCaseData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [shareToken]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F0]">
        <div className="w-8 h-8 border-2 border-black border-t-transparent animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F0]" data-testid="public-case-error">
        <div className="text-center">
          <h1 className="font-outfit text-4xl font-black mb-2">404</h1>
          <p className="font-plex text-gray-600">Case not found or link has expired</p>
        </div>
      </div>
    );
  }

  const details = [
    { label: "Case Number", value: caseData.case_number, icon: FileText, mono: true },
    { label: "Petitioner", value: caseData.petitioner_name, icon: Users },
    { label: "Respondent", value: caseData.respondent_name, icon: Users },
    { label: "Court", value: caseData.court_name, icon: Building },
    { label: "Place of Court", value: caseData.court_place, icon: MapPin },
    { label: "Adjournment Date", value: caseData.adjournment_date, icon: Calendar, mono: true },
    { label: "Current Step", value: caseData.step, icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F0] py-12 px-4" data-testid="public-case-page">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-black flex items-center justify-center">
            <IndianLawLogo size={24} className="text-white" />
          </div>
          <span className="font-outfit text-sm font-bold tracking-tight">CASE MANAGEMENT SYSTEM</span>
        </div>

        {/* Document */}
        <div className="bg-white border border-gray-300 shadow-lg p-8 sm:p-12" data-testid="public-case-document">
          <div className="border-b border-black pb-6 mb-8">
            <p className="font-plex text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-2">
              Case Details
            </p>
            <h1 className="font-playfair text-3xl sm:text-4xl font-bold" data-testid="public-case-number">
              {caseData.case_number}
            </h1>
            <div className="mt-4">
              <span
                className={`${caseData.status === "Open" ? "bg-[#002FA7] text-white" : "bg-black text-white"} px-3 py-1 text-xs font-bold uppercase tracking-wider inline-block`}
                data-testid="public-case-status"
              >
                {caseData.status}
              </span>
            </div>
          </div>

          <div className="space-y-6">
            {details.map((d) => (
              <div key={d.label} className="flex items-start gap-4">
                <div className="w-8 h-8 bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <d.icon className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="font-plex text-xs font-bold uppercase tracking-[0.15em] text-gray-500">{d.label}</p>
                  <p className={`${d.mono ? "font-mono" : "font-playfair"} text-lg font-semibold mt-0.5`}>
                    {d.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 pt-6 border-t border-gray-200">
            <p className="font-plex text-xs text-gray-400 text-center">
              This is a read-only view shared by the managing attorney.
              <br />Case Management System
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
