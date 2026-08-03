import React, { useState, useEffect, useRef } from 'react';
import { Download, FileText, X, CheckCircle2, ShieldCheck, Trash2, Upload, Plus, AlertCircle, Sparkles } from 'lucide-react';
import { ResumeVariant } from '../types';

interface ResumeVaultModalProps {
  onClose: () => void;
  onDownloadResume: (fileName: string) => void;
  onResumesUpdated?: () => void;
}

export const ResumeVaultModal: React.FC<ResumeVaultModalProps> = ({
  onClose,
  onDownloadResume,
  onResumesUpdated
}) => {
  const [resumes, setResumes] = useState<ResumeVariant[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<ResumeVariant | null>(null);
  const [loading, setLoading] = useState(true);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Upload Form State
  const [roleType, setRoleType] = useState('Principal Software Engineer');
  const [fileName, setFileName] = useState('');
  const [extractedText, setExtractedText] = useState('');
  const [keywords, setKeywords] = useState('Java, Spring Boot, Microservices, System Architecture, High Availability');
  const [isUploading, setIsUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/resumes');
      const data = await res.json();
      if (data.success && data.data) {
        setResumes(data.data);
        if (data.data.length > 0) {
          setSelectedVariant(data.data[0]);
        } else {
          setSelectedVariant(null);
          setShowUploadForm(true);
        }
      }
    } catch (err) {
      console.error('Failed to load resumes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  // Inline Delete State (No window.confirm to avoid iFrame blocking)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [showConfirmDeleteAll, setShowConfirmDeleteAll] = useState(false);

  const handleDeleteSingleConfirm = async (id: string) => {
    try {
      const res = await fetch(`/api/resumes/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setStatusMessage('Résumé successfully deleted from vault.');
        const updated = resumes.filter(r => r.id !== id);
        setResumes(updated);
        setDeleteTargetId(null);
        if (selectedVariant?.id === id) {
          setSelectedVariant(updated.length > 0 ? updated[0] : null);
        }
        if (updated.length === 0) {
          setShowUploadForm(true);
        }
        onResumesUpdated?.();
      }
    } catch (err: any) {
      setStatusMessage(`Delete failed: ${err.message}`);
    }
  };

  const handleDeleteAllConfirm = async () => {
    try {
      const res = await fetch('/api/resumes', { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setResumes([]);
        setSelectedVariant(null);
        setShowConfirmDeleteAll(false);
        setShowUploadForm(true);
        setStatusMessage('All sample résumés deleted. Please upload your fresh résumé below.');
        onResumesUpdated?.();
      }
    } catch (err: any) {
      setStatusMessage(`Delete all failed: ${err.message}`);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string || '';
      setExtractedText(content || `Extracted text from ${file.name}\nSize: ${(file.size / 1024).toFixed(1)} KB\nUploaded at: ${new Date().toLocaleString()}`);
    };
    reader.readAsText(file);
  };

  const handleSaveUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName) {
      setStatusMessage('Please select or enter a file name for your résumé.');
      return;
    }

    setIsUploading(true);
    try {
      const kwList = keywords.split(',').map(k => k.trim()).filter(Boolean);
      const res = await fetch('/api/resumes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roleType,
          displayName: `${roleType} Résumé`,
          fileName: fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`,
          extractedText: extractedText || `MAHESH V\n${roleType}\nKey Skills: ${keywords}\nUploaded: ${new Date().toISOString()}`,
          keywords: kwList,
          targetRoles: [roleType]
        })
      });

      const data = await res.json();
      if (data.success) {
        setStatusMessage(`Successfully added "${data.data.fileName}" to your vault!`);
        setShowUploadForm(false);
        setFileName('');
        setExtractedText('');
        await fetchResumes();
        onResumesUpdated?.();
      } else {
        setStatusMessage(`Upload error: ${data.error}`);
      }
    } catch (err: any) {
      setStatusMessage(`Upload failed: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#111113] border border-zinc-800 rounded-2xl max-w-4xl w-full p-6 text-zinc-100 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-zinc-800 pb-3.5">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-950/60 text-indigo-400 rounded-xl border border-indigo-800/60">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif italic text-zinc-100 flex items-center space-x-2">
                <span>Mahesh V — PDF Résumé Vault</span>
                <span className="text-xs font-mono font-normal bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-full border border-zinc-700">
                  {resumes.length} Active {resumes.length === 1 ? 'Variant' : 'Variants'}
                </span>
              </h2>
              <p className="text-xs text-zinc-400">Manage, delete, or upload fresh role-tailored PDF résumés for automated outreach</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {resumes.length > 0 && (
              <button
                onClick={() => setShowConfirmDeleteAll(true)}
                className="inline-flex items-center space-x-1 px-3 py-1.5 bg-rose-950/50 hover:bg-rose-900 text-rose-300 border border-rose-800 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                title="Delete all existing sample résumés to start fresh with your real uploaded files"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete All Résumés</span>
              </button>
            )}

            <button
              onClick={() => setShowUploadForm(!showUploadForm)}
              className="inline-flex items-center space-x-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow transition-all cursor-pointer"
            >
              <Upload className="h-3.5 w-3.5" />
              <span>{showUploadForm ? 'View Vault List' : 'Upload Fresh Résumé'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-colors border border-zinc-800 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Inline Delete All Confirmation Banner */}
        {showConfirmDeleteAll && (
          <div className="bg-rose-950/80 border border-rose-800 text-rose-200 p-3 rounded-xl mt-3 flex items-center justify-between text-xs font-mono animate-fadeIn">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
              <span>Confirm DELETE ALL {resumes.length} résumés from your vault?</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleDeleteAllConfirm}
                className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded text-xs cursor-pointer shadow"
              >
                Yes, Delete All
              </button>
              <button
                onClick={() => setShowConfirmDeleteAll(false)}
                className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-xs cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Status Message Notification */}
        {statusMessage && (
          <div className="bg-emerald-950/60 border border-emerald-800 text-emerald-300 px-4 py-2 text-xs font-mono rounded-lg mt-3 flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
              <span>{statusMessage}</span>
            </span>
            <button onClick={() => setStatusMessage('')} className="text-emerald-400 hover:text-white">✕</button>
          </div>
        )}

        {/* Modal Body */}
        <div className="py-4 overflow-y-auto text-xs flex-1">
          
          {showUploadForm ? (
            /* Upload New Resume Form */
            <form onSubmit={handleSaveUpload} className="bg-[#0A0A0B] border border-zinc-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center space-x-2 text-indigo-400 font-bold">
                  <Upload className="h-4 w-4" />
                  <span className="text-sm">Upload & Register Fresh PDF Résumé</span>
                </div>
                <span className="text-[11px] text-zinc-500 font-mono">Accepts PDF, DOCX, TXT</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 text-[11px] mb-1 font-semibold">Target Role Category</label>
                  <select
                    value={roleType}
                    onChange={(e) => setRoleType(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Principal Software Engineer">Principal Software Engineer</option>
                    <option value="Director of Engineering">Director of Engineering</option>
                    <option value="Senior Engineering Manager">Senior Engineering Manager</option>
                    <option value="Enterprise Solution Architect">Enterprise Solution Architect</option>
                    <option value="VP / Head of Technology">VP / Head of Technology</option>
                    <option value="Lead Java / Microservices Architect">Lead Java / Microservices Architect</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 text-[11px] mb-1 font-semibold">Select PDF File or Enter File Name</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept=".pdf,.doc,.docx,.txt"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-semibold border border-zinc-700 shrink-0 cursor-pointer"
                    >
                      Browse File...
                    </button>
                    <input
                      type="text"
                      placeholder="e.g. Mahesh_V_Principal_Engineer_2026.pdf"
                      value={fileName}
                      onChange={(e) => setFileName(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-indigo-500 font-mono text-xs"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 text-[11px] mb-1 font-semibold">Key Alignment Keywords (Comma Separated)</label>
                <input
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-indigo-500 font-mono text-xs"
                  placeholder="Java, Spring Boot, Apache Kafka, AWS Architecture, Distributed Systems"
                />
              </div>

              <div>
                <label className="block text-zinc-400 text-[11px] mb-1 font-semibold">Extracted Text Content (For ATS Matching Evaluation)</label>
                <textarea
                  rows={6}
                  value={extractedText}
                  onChange={(e) => setExtractedText(e.target.value)}
                  placeholder="Paste or review extracted text from your résumé here..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-zinc-300 font-mono text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 border-t border-zinc-800 pt-3">
                <button
                  type="button"
                  onClick={() => setShowUploadForm(false)}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 rounded-lg font-semibold text-xs border border-zinc-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-xs shadow-md transition-all cursor-pointer flex items-center space-x-1.5"
                >
                  <Sparkles className="h-4 w-4 text-amber-300" />
                  <span>{isUploading ? 'Uploading...' : 'Save & Add to Vault'}</span>
                </button>
              </div>
            </form>
          ) : (
            /* Vault List View */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Left Column: Résumé Variants Selector */}
              <div className="space-y-2 md:col-span-1 border-r border-zinc-800 pr-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono font-semibold">Vault Inventory</span>
                  <button
                    onClick={() => setShowUploadForm(true)}
                    className="text-[10px] text-indigo-400 hover:text-indigo-300 font-mono flex items-center space-x-0.5 cursor-pointer"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Add New</span>
                  </button>
                </div>

                {loading ? (
                  <p className="text-zinc-500 font-mono text-xs py-4 text-center">Loading vault contents...</p>
                ) : resumes.length === 0 ? (
                  <div className="bg-[#0A0A0B] border border-zinc-800 rounded-xl p-4 text-center space-y-2">
                    <AlertCircle className="h-6 w-6 text-amber-400 mx-auto" />
                    <p className="text-xs text-zinc-300 font-medium">Vault is Empty</p>
                    <p className="text-[11px] text-zinc-500">All sample résumés deleted. Upload your real résumé file!</p>
                    <button
                      onClick={() => setShowUploadForm(true)}
                      className="mt-2 w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold shadow cursor-pointer"
                    >
                      Upload Fresh Résumé
                    </button>
                  </div>
                ) : (
                  resumes.map((res) => {
                    const isSelected = selectedVariant?.id === res.id;
                    return (
                      <div
                        key={res.id}
                        onClick={() => setSelectedVariant(res)}
                        className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer relative group ${
                          isSelected
                            ? 'bg-zinc-800/80 border-zinc-700 text-zinc-100 shadow-sm'
                            : 'bg-[#0A0A0B] border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                        }`}
                      >
                        <div className="font-semibold text-xs flex items-center justify-between pr-6">
                          <span>{res.roleType}</span>
                          {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
                        </div>
                        <div className="text-[10px] text-zinc-500 mt-1 font-mono truncate max-w-[180px]">{res.fileName}</div>

                        {deleteTargetId === res.id ? (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="mt-2 pt-2 border-t border-zinc-700/60 flex items-center justify-between text-[10px]"
                          >
                            <span className="text-rose-400 font-semibold font-mono">Delete file?</span>
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => handleDeleteSingleConfirm(res.id)}
                                className="px-2 py-0.5 bg-rose-600 hover:bg-rose-500 text-white rounded font-bold cursor-pointer"
                              >
                                Yes
                              </button>
                              <button
                                onClick={() => setDeleteTargetId(null)}
                                className="px-2 py-0.5 bg-zinc-800 text-zinc-300 rounded cursor-pointer"
                              >
                                No
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteTargetId(res.id);
                            }}
                            className="absolute top-2.5 right-2.5 p-1 text-zinc-600 hover:text-rose-400 hover:bg-rose-950/60 rounded border border-transparent hover:border-rose-800 transition-colors cursor-pointer"
                            title="Delete this résumé variant"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Right Column: Variant Details & Extracted Preview */}
              <div className="md:col-span-2 space-y-3 pl-1">
                {selectedVariant ? (
                  <>
                    <div className="flex items-center justify-between bg-[#0A0A0B] border border-zinc-800 rounded-xl p-3">
                      <div>
                        <h3 className="font-semibold text-zinc-100 text-sm">{selectedVariant.displayName}</h3>
                        <p className="text-[11px] text-zinc-500 font-mono mt-0.5">{selectedVariant.fileName}</p>
                      </div>

                      <button
                        onClick={() => onDownloadResume(selectedVariant.fileName)}
                        className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-zinc-100 hover:bg-white text-zinc-950 rounded-lg text-xs font-bold transition-colors shadow cursor-pointer"
                      >
                        <Download className="h-3.5 w-3.5 text-zinc-950" />
                        <span>Download PDF</span>
                      </button>
                    </div>

                    {/* Key Alignment Keywords */}
                    <div className="bg-[#0A0A0B] border border-zinc-800 rounded-xl p-3 space-y-1.5">
                      <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono font-semibold">Target Alignment Keywords</span>
                      <div className="flex flex-wrap gap-1">
                        {selectedVariant.keywords?.map((kw, i) => (
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
                  </>
                ) : (
                  <div className="bg-[#0A0A0B] border border-zinc-800 rounded-xl p-8 text-center text-zinc-500 font-mono text-xs">
                    Select a résumé from the left inventory or click "Upload Fresh Résumé" to add your files.
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="border-t border-zinc-800 pt-3 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-zinc-100 hover:bg-white text-zinc-950 rounded-lg font-bold text-xs transition-colors cursor-pointer"
          >
            Close Vault
          </button>
        </div>

      </div>
    </div>
  );
};

