import React, { useState } from 'react';
import { X, Download, User, Mail, Phone, GraduationCap, Briefcase, Code, FileText, Sparkles, Palette, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Keep all your existing templates and templateStyles objects here
const templates = {
  minimal: {
    name: "Alex Johnson",
    email: "alex.johnson@email.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    summary: "Passionate software developer with 3+ years of experience in full-stack development",
    education: "Bachelor of Science in Computer Science\nStanford University, 2021\nGPA: 3.8/4.0",
    experience: "Senior Software Engineer\nTech Innovations Inc. | 2022 - Present\n• Led development of microservices architecture\n• Improved system performance by 40%\n\nJunior Developer\nStartup Labs | 2021 - 2022\n• Built responsive web applications\n• Collaborated with cross-functional teams",
    skills: "JavaScript, React, Node.js, Python, AWS, Docker, Git, MongoDB"
  },
  modern: {
    name: "Sarah Chen",
    email: "sarah.chen@gmail.com",
    phone: "+1 (555) 987-6543",
    location: "New York, NY",
    summary: "Creative UI/UX Designer and Frontend Developer with expertise in modern web technologies",
    education: "Master of Fine Arts in Digital Design\nParsons School of Design, 2020\n\nBachelor of Arts in Graphic Design\nRhode Island School of Design, 2018",
    experience: "Lead UI/UX Designer\nDesign Studio Pro | 2021 - Present\n• Designed user interfaces for 50+ web applications\n• Increased user engagement by 65%\n• Mentored junior designers\n\nFreelance Designer\nSelf-employed | 2020 - 2021\n• Worked with 25+ clients on branding projects\n• Delivered projects 20% ahead of schedule",
    skills: "Figma, Adobe Creative Suite, React, TypeScript, Tailwind CSS, Framer Motion, User Research"
  },
  professional: {
    name: "Michael Rodriguez",
    email: "m.rodriguez@business.com",
    phone: "+1 (555) 456-7890",
    location: "Chicago, IL",
    summary: "Results-driven Business Analyst with 5+ years of experience in data analysis and process optimization",
    education: "Master of Business Administration\nUniversity of Chicago Booth School, 2019\n\nBachelor of Science in Economics\nUniversity of Illinois, 2017",
    experience: "Senior Business Analyst\nFortune 500 Corp | 2020 - Present\n• Analyzed business processes and identified $2M in cost savings\n• Led cross-functional teams of 15+ members\n• Implemented data-driven solutions\n\nBusiness Analyst\nConsulting Firm LLC | 2019 - 2020\n• Conducted market research and competitive analysis\n• Presented findings to C-level executives",
    skills: "Excel, SQL, Tableau, Power BI, Python, Project Management, Data Analysis, Strategic Planning"
  },
  creative: {
    name: "Emma Thompson",
    email: "emma.creative@studio.com",
    phone: "+1 (555) 321-0987",
    location: "Los Angeles, CA",
    summary: "Innovative Creative Director with 7+ years of experience in brand development and digital marketing",
    education: "Bachelor of Fine Arts in Visual Communications\nArt Center College of Design, 2017\n\nCertificate in Digital Marketing\nGoogle Digital Academy, 2018",
    experience: "Creative Director\nBrand Agency | 2022 - Present\n• Oversee creative campaigns for Fortune 100 clients\n• Managed $5M+ advertising budgets\n• Increased brand awareness by 80%\n\nSenior Art Director\nMarketing Solutions | 2019 - 2022\n• Created award-winning campaigns\n• Led creative team of 12 designers",
    skills: "Creative Strategy, Brand Development, Adobe Creative Suite, Motion Graphics, Team Leadership"
  }
};

const templateStyles = {
  minimal: {
    primary: 'from-slate-600 to-slate-800',
    secondary: 'bg-slate-50',
    accent: 'text-slate-600',
    border: 'border-slate-200'
  },
  modern: {
    primary: 'from-blue-600 to-purple-600',
    secondary: 'bg-blue-50',
    accent: 'text-blue-600',
    border: 'border-blue-200'
  },
  professional: {
    primary: 'from-gray-700 to-gray-900',
    secondary: 'bg-gray-50',
    accent: 'text-gray-700',
    border: 'border-gray-300'
  },
  creative: {
    primary: 'from-pink-500 to-orange-500',
    secondary: 'bg-pink-50',
    accent: 'text-pink-600',
    border: 'border-pink-200'
  }
};

const ResumeBuilder = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    summary: "",
    education: "",
    experience: "",
    skills: ""
  });
  const [selectedTemplate, setSelectedTemplate] = useState("minimal");
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTemplateSelect = (templateKey) => {
    setSelectedTemplate(templateKey);
    setFormData({
        name: "",
        email: "",
        phone: "",
        location: "",
        summary: "",
        education: "",
        experience: "",
        skills: ""
        });
        setSelectedTemplate(templateKey);
  };

  const generatePDF = async () => {
    setIsGenerating(true);
    
    // Simulate PDF generation delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      // Create a more sophisticated PDF layout
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      
      const styles = templateStyles[selectedTemplate];
      
      // Header with name
      doc.setFontSize(24);
      doc.setFont(undefined, 'bold');
      doc.text(formData.name, 20, 25);
      
      // Contact info
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.text(`${formData.email} | ${formData.phone} | ${formData.location}`, 20, 35);
      
      // Line separator
      doc.setLineWidth(0.5);
      doc.line(20, 40, 190, 40);
      
      let yPosition = 50;
      
      // Summary
      if (formData.summary) {
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text('PROFESSIONAL SUMMARY', 20, yPosition);
        yPosition += 8;
        
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        const summaryLines = doc.splitTextToSize(formData.summary, 170);
        doc.text(summaryLines, 20, yPosition);
        yPosition += summaryLines.length * 4 + 8;
      }
      
      // Experience
      if (formData.experience) {
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text('EXPERIENCE', 20, yPosition);
        yPosition += 8;
        
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        const expLines = doc.splitTextToSize(formData.experience, 170);
        doc.text(expLines, 20, yPosition);
        yPosition += expLines.length * 4 + 8;
      }
      
      // Education
      if (formData.education) {
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text('EDUCATION', 20, yPosition);
        yPosition += 8;
        
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        const eduLines = doc.splitTextToSize(formData.education, 170);
        doc.text(eduLines, 20, yPosition);
        yPosition += eduLines.length * 4 + 8;
      }
      
      // Skills
      if (formData.skills) {
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text('SKILLS', 20, yPosition);
        yPosition += 8;
        
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        const skillsLines = doc.splitTextToSize(formData.skills, 170);
        doc.text(skillsLines, 20, yPosition);
      }
      
      doc.save(`${formData.name.replace(/\s+/g, '_')}_Resume.pdf`);
      
      // Show success message and redirect
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
      
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className={`bg-gradient-to-r ${templateStyles[selectedTemplate].primary} text-white p-6 relative`}>
            <button
              onClick={() => navigate('/')}
              className="absolute top-4 left-4 p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center justify-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <FileText size={24} />
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-bold">Resume Builder</h2>
                <p className="text-white/80">Create your professional resume in minutes</p>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span className={currentStep >= 1 ? 'text-white' : 'text-white/60'}>Template</span>
                <span className={currentStep >= 2 ? 'text-white' : 'text-white/60'}>Information</span>
                <span className={currentStep >= 3 ? 'text-white' : 'text-white/60'}>Preview & Download</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className="bg-white rounded-full h-2 transition-all duration-500"
                  style={{ width: `${(currentStep / 3) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(100vh-200px)]">
            {/* Keep all your existing step content here - Step 1, 2, and 3 */}
            {/* Step 1: Template Selection */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-fade-in">
                <div className="text-center">
                  <Palette className="mx-auto text-gray-400 mb-4" size={48} />
                  <h3 className="text-xl font-semibold mb-2">Choose Your Template</h3>
                  <p className="text-gray-600">Select a template that matches your style</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(templates).map(([key, template]) => (
                    <div
                      key={key}
                      onClick={() => handleTemplateSelect(key)}
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg ${
                        selectedTemplate === key 
                          ? `${templateStyles[key].border} bg-gradient-to-br ${templateStyles[key].secondary}` 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold capitalize text-lg">{key}</h4>
                        {selectedTemplate === key && (
                          <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${templateStyles[key].primary} flex items-center justify-center`}>
                            <div className="w-2 h-2 bg-white rounded-full" />
                          </div>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p className="font-medium">{template.name}</p>
                        <p>{template.email}</p>
                        <p className="truncate">{template.summary}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Information Input */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-fade-in">
                <div className="text-center">
                  <User className="mx-auto text-gray-400 mb-4" size={48} />
                  <h3 className="text-xl font-semibold mb-2">Your Information</h3>
                  <p className="text-gray-600">Fill in your details below</p>
                </div>

                <div className="grid gap-6">
                  {/* Personal Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="flex items-center text-sm font-medium text-gray-700">
                        <User size={16} className="mr-2" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder={templates[selectedTemplate]?.name || "Your name"}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="flex items-center text-sm font-medium text-gray-700">
                        <Mail size={16} className="mr-2" />
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="flex items-center text-sm font-medium text-gray-700">
                        <Phone size={16} className="mr-2" />
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="flex items-center text-sm font-medium text-gray-700">
                        <span className="w-4 h-4 mr-2">📍</span>
                        Location
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="City, State"
                      />
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <Sparkles size={16} className="mr-2" />
                      Professional Summary
                    </label>
                    <textarea
                      name="summary"
                      value={formData.summary}
                      onChange={handleChange}
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="Brief summary of your professional background and key achievements..."
                    />
                  </div>

                  {/* Experience */}
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <Briefcase size={16} className="mr-2" />
                      Experience
                    </label>
                    <textarea
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      rows={5}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="Job Title | Company | Dates&#10;• Achievement or responsibility&#10;• Another achievement..."
                    />
                  </div>

                  {/* Education */}
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <GraduationCap size={16} className="mr-2" />
                      Education
                    </label>
                    <textarea
                      name="education"
                      value={formData.education}
                      onChange={handleChange}
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="Degree | Institution | Year&#10;GPA: 3.8/4.0 (optional)"
                    />
                  </div>

                  {/* Skills */}
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <Code size={16} className="mr-2" />
                      Skills
                    </label>
                    <textarea
                      name="skills"
                      value={formData.skills}
                      onChange={handleChange}
                      rows={2}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="Skill 1, Skill 2, Skill 3, Programming Languages, Tools..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Preview & Download */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-fade-in">
                <div className="text-center">
                  <Download className="mx-auto text-gray-400 mb-4" size={48} />
                  <h3 className="text-xl font-semibold mb-2">Preview & Download</h3>
                  <p className="text-gray-600">Review your resume and download as PDF</p>
                </div>

                {/* Resume Preview */}
                <div className={`border-2 ${templateStyles[selectedTemplate].border} rounded-xl p-6 bg-gradient-to-br ${templateStyles[selectedTemplate].secondary}`}>
                  <div className="bg-white p-8 rounded-lg shadow-sm">
                    <div className={`text-center pb-4 border-b-2 ${templateStyles[selectedTemplate].border}`}>
                      <h1 className="text-3xl font-bold text-gray-900">{formData.name || 'Your Name'}</h1>
                      <p className="text-gray-600 mt-2">
                        {formData.email} • {formData.phone} • {formData.location}
                      </p>
                    </div>
                    
                    {formData.summary && (
                      <div className="mt-4">
                        <h2 className={`text-lg font-semibold ${templateStyles[selectedTemplate].accent} mb-2`}>Professional Summary</h2>
                        <p className="text-gray-700 text-sm">{formData.summary}</p>
                      </div>
                    )}
                    
                    {formData.experience && (
                      <div className="mt-4">
                        <h2 className={`text-lg font-semibold ${templateStyles[selectedTemplate].accent} mb-2`}>Experience</h2>
                        <div className="text-gray-700 text-sm whitespace-pre-line">{formData.experience}</div>
                      </div>
                    )}
                    
                    {formData.education && (
                      <div className="mt-4">
                        <h2 className={`text-lg font-semibold ${templateStyles[selectedTemplate].accent} mb-2`}>Education</h2>
                        <div className="text-gray-700 text-sm whitespace-pre-line">{formData.education}</div>
                      </div>
                    )}
                    
                    {formData.skills && (
                      <div className="mt-4">
                        <h2 className={`text-lg font-semibold ${templateStyles[selectedTemplate].accent} mb-2`}>Skills</h2>
                        <p className="text-gray-700 text-sm">{formData.skills}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t bg-gray-50 p-6">
            <div className="flex justify-between items-center">
              <div className="flex space-x-3">
                {currentStep > 1 && (
                  <button
                    onClick={prevStep}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    ← Previous
                  </button>
                )}
              </div>
              
              <div className="flex space-x-3">
                {currentStep < 3 && (
                  <button
                    onClick={nextStep}
                    className={`px-6 py-2 bg-gradient-to-r ${templateStyles[selectedTemplate].primary} text-white rounded-lg hover:shadow-lg transition-all duration-300`}
                  >
                    Next →
                  </button>
                )}
                
                {currentStep === 3 && (
                  <button
                    onClick={generatePDF}
                    disabled={isGenerating || !formData.name}
                    className={`px-6 py-2 bg-gradient-to-r ${templateStyles[selectedTemplate].primary} text-white rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2`}
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Download size={16} />
                        <span>Download PDF</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;