import React, { useState } from 'react';
import { Download, FileText, X, CheckCircle2, ShieldCheck, ExternalLink } from 'lucide-react';
import { RESUME_VARIANTS } from '../data/candidate';

interface ResumeVaultModalProps {
  onClose: () => void;
  onDownloadResume: (fileName: string) => void;
}

export const ResumeVaultModal: React.FC<ResumeVaultModalProps> = ({
  onClose,
  onDownloadResume
}) => {
  const [selectedVariant, setSelectedVariant] = useState(RESUME_VARIANTS[0]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#111113] border border-zinc-800 rounded-2xl max-w-3xl w-full p-6 text-zinc-100 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-zinc-800 pb-3.5">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-zinc-900 text-zinc-300 rounded-xl border border-zinc-800">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif italic text-zinc-100">Mahesh V — Role-Specific PDF Résumé Vault</h2>
              <p className="text-xs text-zinc-400">4 Tailored PDF Résumés with automatic ATS extraction & attachment</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-colors border border-zinc-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 overflow-y-auto text-xs flex-1">
          
          {/* Left Column: 4 Résumé Variants Selector */}
          <div className="space-y-2 md:col-span-1 border-r border-zinc-800 pr-3">
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono font-semibold">4 Tailored PDF Variants</span>
            {RESUME_VARIANTS.map((res) => {
              const isSelected = res.id === selectedVariant.id;
              return (
                <button
                  key={res.id}
                  onClick={() => setSelectedVariant(res)}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-zinc-800/80 border-zinc-700 text-zinc-100 shadow-sm'
                      : 'bg-[#0A0A0B] border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                  }`}
                >
                  <div className="font-semibold text-xs flex items-center justify-between">
                    <span>{res.roleType}</span>
                    {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-1 font-mono truncate">{res.fileName}</div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Variant Details & Extracted Preview */}
          <div className="md:col-span-2 space-y-3 pl-1">
            <div className="flex items-center justify-between bg-[#0A0A0B] border border-zinc-800 rounded-xl p-3">
              <div>
                <h3 className="font-semibold text-zinc-100 text-sm">{selectedVariant.displayName}</h3>
                <p className="text-[11px] text-zinc-500 font-mono mt-0.5">{selectedVariant.fileName}</p>
              </div>

              <button
                onClick={() => onDownloadResume(selectedVariant.fileName)}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-zinc-100 hover:bg-white text-zinc-950 rounded-lg text-xs font-bold transition-colors shadow"
              >
                <Download className="h-3.5 w-3.5 text-zinc-950" />
                <span>Download PDF</span>
              </button>
            </div>

            {/* Key Alignment Keywords */}
            <div className="bg-[#0A0A0B] border border-zinc-800 rounded-xl p-3 space-y-1.5">
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono font-semibold">Target Alignment Keywords</span>
              <div className="flex flex-wrap gap-1">
                {selectedVariant.keywords.map((kw, i) => (
                  <span key={i} className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded text-[10px] font-mono">
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Extracted Text Content */}
            <div className="bg-[#0A0A0B] border border-zinc-800 rounded-xl p-3.5 space-y-1.5">
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono font-semibold">Extracted PDF Text Content</span>
              <pre className="whitespace-pre-wrap font-mono text-[11px] text-zinc-300 leading-relaxed bg-zinc-900/80 p-3 rounded-lg border border-zinc-800 max-h-[220px] overflow-y-auto">
                {selectedVariant.extractedText}
              </pre>
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="border-t border-zinc-800 pt-3 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-zinc-100 hover:bg-white text-zinc-950 rounded-lg font-bold text-xs transition-colors"
          >
            Close Vault
          </button>
        </div>

      </div>
    </div>
  );
};
