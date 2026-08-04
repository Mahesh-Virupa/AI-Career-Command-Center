import React, { useState, useEffect, useRef } from 'react';
import { Download, FileText, X, CheckCircle2, Trash2, Upload, Plus, AlertCircle, Sparkles, HelpCircle, ChevronRight, ChevronLeft } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'vault' | 'upload' | 'guided'>('vault');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Simple Upload Form State
  const [roleType, setRoleType] = useState('Principal Software Engineer');
  const [fileName, setFileName] = useState('');
  const [extractedText, setExtractedText] = useState('');
  const [keywords, setKeywords] = useState('Java, Spring Boot, Microservices, System Architecture, High Availability');
  const [isUploading, setIsUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // Guided Questions State (Multi-step Wizard)
  const [guidedStep, setGuidedStep] = useState<number>(1);
  const [guidedAnswers, setGuidedAnswers] = useState({
    fullName: 'Mahesh V',
    targetTitle: 'Principal Software Engineer / Director of Engineering',
    experienceYears: '16+',
    contactPhone: '+91 98860 12345',
    contactEmail: 'mahesh.v.tech@gmail.com',
    primaryLocation: 'Bengaluru, India',
    coreSkills: 'Java 21, Spring Boot, Microservices, Distributed Systems, Kafka, AWS, Docker, Kubernetes',
    leadershipScale: 'Led 40+ Senior Engineers; Architected payment platforms handling 5M+ daily transactions',
    keyAchievements: 'Reduced API latency by 45%, migrated monolith to cloud microservices, zero downtime deployments',
    selectedFile: null as File | null
  });

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
          setActiveTab('guided');
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

  // Inline Delete State
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [showConfirmDeleteAll, setShowConfirmDeleteAll] = useState(false);

  const handleDeleteSingleConfirm = async (id: string) => {
    try {
      const res = await fetch(`/api/resumes/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setStatusMessage('Résumé successfully removed from vault.');
        const updated = resumes.filter(r => r.id !== id);
        setResumes(updated);
        setDeleteTargetId(null);
        if (selectedVariant?.id === id) {
          setSelectedVariant(updated.length > 0 ? updated[0] : null);
        }
        if (updated.length === 0) {
          setActiveTab('guided');
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
        setActiveTab('guided');
        setStatusMessage('All sample résumés deleted. Use the guided questions wizard below to build your custom resume profile.');
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
    setGuidedAnswers(prev => ({ ...prev, selectedFile: file }));
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
        setActiveTab('vault');
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

  const handleSaveGuidedResume = async () => {
    setIsUploading(true);
    try {
      const generatedFileName = `${guidedAnswers.fullName.replace(/\s+/g, '_')}_${guidedAnswers.targetTitle.split('/')[0].trim().replace(/\s+/g, '_')}_Resume.pdf`;
      const generatedText = `${guidedAnswers.fullName.toUpperCase()}
Target Position: ${guidedAnswers.targetTitle}
Total Experience: ${guidedAnswers.experienceYears} | Location: ${guidedAnswers.primaryLocation}
Phone: ${guidedAnswers.contactPhone} | Email: ${guidedAnswers.contactEmail}

CORE TECHNICAL COMPETENCIES:
${guidedAnswers.coreSkills}

LEADERSHIP & ARCHITECTURE SCALE:
${guidedAnswers.leadershipScale}

KEY PROJECT HIGHLIGHTS & IMPACT:
${guidedAnswers.keyAchievements}

Generated via Guided Resume Builder — Active for ATS Scouting Pipeline.`;

      const kwList = guidedAnswers.coreSkills.split(',').map(s => s.trim()).filter(Boolean);

      const res = await fetch('/api/resumes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roleType: guidedAnswers.targetTitle.split('/')[0].trim(),
          displayName: `${guidedAnswers.targetTitle.split('/')[0].trim()} Custom Profile`,
          fileName: generatedFileName,
          extractedText: generatedText,
          keywords: kwList,
          targetRoles: [guidedAnswers.targetTitle]
        })
      });

      const data = await res.json();
      if (data.success) {
        setStatusMessage(`Successfully registered your resume profile: "${data.data.fileName}"!`);
        setActiveTab('vault');
        setGuidedStep(1);
        await fetchResumes();
        onResumesUpdated?.();
      }
    } catch (err: any) {
      setStatusMessage(`Failed to save guided resume: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-4xl w-full p-6 text-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <span>Mahesh V — PDF Résumé Vault</span>
                <span className="text-xs font-mono font-semibold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full border border-slate-200">
                  {resumes.length} Active {resumes.length === 1 ? 'Variant' : 'Variants'}
                </span>
              </h2>
              <p className="text-xs text-slate-500">Upload, manage, or answer guided questions to build role-tailored PDF résumés</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {resumes.length > 0 && (
              <button
                onClick={() => setShowConfirmDeleteAll(true)}
                className="inline-flex items-center space-x-1 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                title="Delete all existing sample résumés to start fresh with your real uploaded files"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete All</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 rounded-lg transition-colors border border-slate-200 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-2 border-b border-slate-200 pt-3 pb-2 px-1">
          <button
            onClick={() => setActiveTab('vault')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'vault'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Vault Inventory ({resumes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('guided')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'guided'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <HelpCircle className="h-3.5 w-3.5 text-amber-500" />
            <span>Guided Resume Builder (Questionnaire)</span>
          </button>

          <button
            onClick={() => setActiveTab('upload')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Upload className="h-3.5 w-3.5" />
            <span>Upload File Directly</span>
          </button>
        </div>

        {/* Inline Delete All Confirmation Banner */}
        {showConfirmDeleteAll && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl mt-3 flex items-center justify-between text-xs font-mono animate-fadeIn">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
              <span>Confirm DELETE ALL {resumes.length} résumés from your vault?</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleDeleteAllConfirm}
                className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded text-xs cursor-pointer shadow-xs"
              >
                Yes, Delete All
              </button>
              <button
                onClick={() => setShowConfirmDeleteAll(false)}
                className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-xs cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Status Message Notification */}
        {statusMessage && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2 text-xs font-mono rounded-lg mt-3 flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>{statusMessage}</span>
            </span>
            <button onClick={() => setStatusMessage('')} className="text-emerald-700 hover:text-emerald-900 font-bold">✕</button>
          </div>
        )}

        {/* Modal Body */}
        <div className="py-4 overflow-y-auto text-xs flex-1">
          
          {/* TAB 1: GUIDED QUESTIONNAIRE (ASK QUESTIONS TO BUILD RESUME) */}
          {activeTab === 'guided' && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-5">
              
              {/* Wizard Progress */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                    <Sparkles className="h-4 w-4 text-indigo-600" />
                    <span>Step {guidedStep} of 4: {
                      guidedStep === 1 ? 'Personal & Role Details' :
                      guidedStep === 2 ? 'Core Technical Stack & Competencies' :
                      guidedStep === 3 ? 'Scale & Key Project Achievements' : 'File Upload & Review'
                    }</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">Answer these quick questions to tailor your profile for high ATS match scores</p>
                </div>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4].map(s => (
                    <div 
                      key={s} 
                      className={`h-2 w-6 rounded-full transition-all ${
                        s <= guidedStep ? 'bg-indigo-600' : 'bg-slate-200'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Step 1: Personal Details */}
              {guidedStep === 1 && (
                <div className="space-y-3 animate-fadeIn">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Full Name</label>
                      <input 
                        type="text" 
                        value={guidedAnswers.fullName}
                        onChange={(e) => setGuidedAnswers({...guidedAnswers, fullName: e.target.value})}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 text-xs font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Target Job Title</label>
                      <input 
                        type="text" 
                        value={guidedAnswers.targetTitle}
                        onChange={(e) => setGuidedAnswers({...guidedAnswers, targetTitle: e.target.value})}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 text-xs font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Years of Experience</label>
                      <input 
                        type="text" 
                        value={guidedAnswers.experienceYears}
                        onChange={(e) => setGuidedAnswers({...guidedAnswers, experienceYears: e.target.value})}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 text-xs font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Phone / WhatsApp</label>
                      <input 
                        type="text" 
                        value={guidedAnswers.contactPhone}
                        onChange={(e) => setGuidedAnswers({...guidedAnswers, contactPhone: e.target.value})}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 text-xs font-medium font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Preferred Email</label>
                      <input 
                        type="email" 
                        value={guidedAnswers.contactEmail}
                        onChange={(e) => setGuidedAnswers({...guidedAnswers, contactEmail: e.target.value})}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 text-xs font-medium font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Core Technical Stack */}
              {guidedStep === 2 && (
                <div className="space-y-3 animate-fadeIn">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">What are your top technical skills & framework strengths? (Comma separated)</label>
                    <textarea 
                      rows={3}
                      value={guidedAnswers.coreSkills}
                      onChange={(e) => setGuidedAnswers({...guidedAnswers, coreSkills: e.target.value})}
                      placeholder="e.g. Java 21, Spring Boot, Microservices, System Design, Apache Kafka, AWS, Docker..."
                      className="w-full bg-white border border-slate-300 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-indigo-500 text-xs font-mono"
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Scale & Achievements */}
              {guidedStep === 3 && (
                <div className="space-y-3 animate-fadeIn">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Leadership Scale & Team Size</label>
                    <input 
                      type="text" 
                      value={guidedAnswers.leadershipScale}
                      onChange={(e) => setGuidedAnswers({...guidedAnswers, leadershipScale: e.target.value})}
                      placeholder="e.g. Led 25+ engineers, managed $5M cloud budget..."
                      className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Key Project Impact & Architecture Highlights</label>
                    <textarea 
                      rows={3}
                      value={guidedAnswers.keyAchievements}
                      onChange={(e) => setGuidedAnswers({...guidedAnswers, keyAchievements: e.target.value})}
                      placeholder="e.g. Built high-scale payment gateway processing 10M TPS; reduced cloud costs by 35%..."
                      className="w-full bg-white border border-slate-300 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-indigo-500 text-xs font-medium"
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Resume File Upload & Save */}
              {guidedStep === 4 && (
                <div className="space-y-3 animate-fadeIn">
                  <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
                    <span className="block text-xs font-bold text-slate-800">Attach Official PDF Résumé File (Optional):</span>
                    <div className="flex items-center space-x-3">
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
                        className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold border border-slate-300 cursor-pointer flex items-center space-x-1.5"
                      >
                        <Upload className="h-3.5 w-3.5 text-slate-600" />
                        <span>Browse PDF Resume File...</span>
                      </button>
                      <span className="text-xs font-mono text-slate-600">
                        {guidedAnswers.selectedFile ? guidedAnswers.selectedFile.name : 'No file selected (System will generate PDF from profile text)'}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-1">
                    <span className="text-[10px] uppercase font-mono text-slate-400 font-bold">Profile Summary Preview:</span>
                    <p className="text-xs font-mono text-slate-800 font-semibold">{guidedAnswers.fullName} — {guidedAnswers.targetTitle}</p>
                    <p className="text-[11px] text-slate-500 font-mono">{guidedAnswers.experienceYears} Exp | {guidedAnswers.contactEmail}</p>
                  </div>
                </div>
              )}

              {/* Navigation Controls */}
              <div className="flex items-center justify-between border-t border-slate-200 pt-3">
                <button
                  onClick={() => setGuidedStep(s => Math.max(1, s - 1))}
                  disabled={guidedStep === 1}
                  className="px-3.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-semibold text-xs disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-1 cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </button>

                {guidedStep < 4 ? (
                  <button
                    onClick={() => setGuidedStep(s => Math.min(4, s + 1))}
                    className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs flex items-center space-x-1 cursor-pointer shadow-xs"
                  >
                    <span>Next Question</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSaveGuidedResume}
                    disabled={isUploading}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs shadow-md transition-all cursor-pointer flex items-center space-x-1.5"
                  >
                    <Sparkles className="h-4 w-4 text-amber-200" />
                    <span>{isUploading ? 'Registering...' : 'Save & Register Profile in Vault'}</span>
                  </button>
                )}
              </div>

            </div>
          )}

          {/* TAB 2: SIMPLE DIRECT UPLOAD FORM (ROLE-INDEPENDENT & AUTO-MAPPED) */}
          {activeTab === 'upload' && (
            <form onSubmit={handleSaveUpload} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center space-x-2 text-indigo-700 font-bold">
                  <Upload className="h-4 w-4" />
                  <span className="text-sm">Upload Résumés (Auto-Mapped to Roles)</span>
                </div>
                <span className="text-[11px] text-slate-500 font-mono">Accepts PDF, DOCX, TXT — Multi-file selection enabled</span>
              </div>

              <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-3 text-xs text-indigo-950 flex items-start space-x-2">
                <Sparkles className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Automatic Resume vs Role Mapping:</strong> Upload any resume files without picking a target role category. The system will parse candidate titles, core skills, and automatically evaluate & map each resume variant against all current and future scouted job roles.
                </div>
              </div>

              <div>
                <label className="block text-slate-700 text-[11px] mb-1 font-semibold font-sans">Select Résumé File(s) or Enter Name</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".pdf,.doc,.docx,.txt"
                    multiple
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shrink-0 cursor-pointer shadow-sm flex items-center space-x-1.5"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    <span>Choose Résumé Files...</span>
                  </button>
                  <input
                    type="text"
                    placeholder="e.g. Mahesh_V_Principal_Engineer.pdf"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-indigo-500 font-mono text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 text-[11px] mb-1 font-semibold">Auto-Detected / Target Role Alignment</label>
                  <input
                    type="text"
                    value={roleType}
                    onChange={(e) => setRoleType(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-indigo-500 font-medium text-xs"
                    placeholder="e.g. Auto-inferred: Principal Engineer / Director"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 text-[11px] mb-1 font-semibold">Key Alignment Keywords (Comma Separated)</label>
                  <input
                    type="text"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-indigo-500 font-mono text-xs"
                    placeholder="Java, Spring Boot, Apache Kafka, AWS Architecture, Distributed Systems"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 text-[11px] mb-1 font-semibold">Extracted Text Content (For ATS Matching Evaluation)</label>
                <textarea
                  rows={5}
                  value={extractedText}
                  onChange={(e) => setExtractedText(e.target.value)}
                  placeholder="Paste or review extracted text from your résumé here..."
                  className="w-full bg-white border border-slate-300 rounded-lg p-3 text-slate-800 font-mono text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 border-t border-slate-200 pt-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('vault')}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-semibold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs shadow-md transition-all cursor-pointer flex items-center space-x-1.5"
                >
                  <Sparkles className="h-4 w-4 text-amber-200" />
                  <span>{isUploading ? 'Uploading...' : 'Save & Auto-Map to Roles'}</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: VAULT LIST VIEW */}
          {activeTab === 'vault' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Left Column: Résumé Variants Selector */}
              <div className="space-y-2 md:col-span-1 border-r border-slate-200 pr-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono font-semibold">Vault Inventory</span>
                  <button
                    onClick={() => setActiveTab('guided')}
                    className="text-[10px] text-indigo-600 hover:text-indigo-800 font-mono flex items-center space-x-0.5 cursor-pointer font-bold"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Add New</span>
                  </button>
                </div>

                {loading ? (
                  <p className="text-slate-400 font-mono text-xs py-4 text-center">Loading vault contents...</p>
                ) : resumes.length === 0 ? (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center space-y-2">
                    <AlertCircle className="h-6 w-6 text-amber-500 mx-auto" />
                    <p className="text-xs text-slate-800 font-medium">Vault is Empty</p>
                    <p className="text-[11px] text-slate-500">All sample résumés deleted. Build or upload your real profile!</p>
                    <button
                      onClick={() => setActiveTab('guided')}
                      className="mt-2 w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer"
                    >
                      Start Guided Builder
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
                            ? 'bg-indigo-50/80 border-indigo-300 text-slate-900 shadow-xs'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300 hover:text-slate-900'
                        }`}
                      >
                        <div className="font-semibold text-xs flex items-center justify-between pr-6">
                          <span>{res.roleType}</span>
                          {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1 font-mono truncate max-w-[180px]">{res.fileName}</div>

                        {deleteTargetId === res.id ? (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between text-[10px]"
                          >
                            <span className="text-rose-700 font-semibold font-mono">Delete file?</span>
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => handleDeleteSingleConfirm(res.id)}
                                className="px-2 py-0.5 bg-rose-600 hover:bg-rose-700 text-white rounded font-bold cursor-pointer"
                              >
                                Yes
                              </button>
                              <button
                                onClick={() => setDeleteTargetId(null)}
                                className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded cursor-pointer"
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
                            className="absolute top-2.5 right-2.5 p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
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
                    <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl p-3">
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">{selectedVariant.displayName}</h3>
                        <p className="text-[11px] text-slate-500 font-mono mt-0.5">{selectedVariant.fileName}</p>
                      </div>

                      <button
                        onClick={() => onDownloadResume(selectedVariant.fileName)}
                        className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs cursor-pointer"
                      >
                        <Download className="h-3.5 w-3.5 text-white" />
                        <span>Download PDF</span>
                      </button>
                    </div>

                    {/* Key Alignment Keywords */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-1.5">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono font-semibold">Target Alignment Keywords</span>
                      <div className="flex flex-wrap gap-1">
                        {selectedVariant.keywords?.map((kw, i) => (
                          <span key={i} className="px-2 py-0.5 bg-white border border-slate-200 text-slate-700 rounded text-[10px] font-mono font-medium">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Extracted Text Content */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono font-semibold">Extracted PDF Text Content</span>
                      <pre className="whitespace-pre-wrap font-mono text-[11px] text-slate-800 leading-relaxed bg-white p-3 rounded-lg border border-slate-200 max-h-[220px] overflow-y-auto">
                        {selectedVariant.extractedText}
                      </pre>
                    </div>
                  </>
                ) : (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center text-slate-500 font-mono text-xs">
                    Select a résumé from the left inventory or click "Guided Resume Builder" to generate your custom profile.
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 pt-3 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-bold text-xs transition-colors cursor-pointer border border-slate-200"
          >
            Close Vault
          </button>
        </div>

      </div>
    </div>
  );
};
