import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [predictionData, setPredictionData] = useState(null);
  const [groqReport, setGroqReport] = useState(null); // New state to hold Groq's textual data
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setPredictionData(null);
      setGroqReport(null);
    } else {
      alert("Please upload a valid image file matrix.");
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    processFile(file);
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => { setIsDragging(false); };
  const handleDrop = (e) => { e.preventDefault(); setIsDragging(false); processFile(e.dataTransfer.files[0]); };

  // Core Orchestrator Function
  const handleUploadAndPredict = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);
    setIsLoading(true);

    try {
      // Step 1: Query your custom CNN model on Render for trusted classification
      const cnnResponse = await axios.post(
        'https://potato-disease-prediction-using-cnn-deep.onrender.com/predict', 
        formData, 
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      
      const detectedClass = cnnResponse.data.class;
      setPredictionData(cnnResponse.data);

      // Step 2: Cascade that strict string result into Groq API for prescriptions
      // REPLACE 'gsk_xxxx...' WITH YOUR ACTUAL GROQ API KEY GENERATED FROM THE CONSOLE
      const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY; 
      
      const groqResponse = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: "llama-3.3-70b-versatile", // Using a lightning-fast, highly accurate model endpoint
          messages: [
            {
              role: "system",
              content: "You are an expert agricultural plant pathologist specializing in crop protection diagnostics."
            },
            {
              role: "user",
              content: `Our computer vision model has detected ${detectedClass} on a potato crop leaf matrix with high statistical confidence. Write a concise prescriptive diagnostic layout. Include: 1) What causes this condition, 2) Two immediate organic or cultural steps to halt spread, and 3) The most common chemical or industrial remedy used by professional farmers. Keep the tone scientific yet actionable.`
            }
          ],
          temperature: 0.3
        },
        {
          headers: {
            'Authorization': `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Save Groq's textual message payload directly to display state
      setGroqReport(groqResponse.data.choices[0].message.content);

    } catch (error) {
      console.error("Pipeline failure:", error);
      alert("An error occurred during the hybrid analytical scan process.");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (className) => {
    if (!className) return { bg: '#e0e0e0', text: '#424242', border: '#b0bec5' };
    const name = className.toLowerCase();
    if (name.includes('healthy')) return { bg: '#e8f5e9', text: '#2e7d32', border: '#a5d6a7' };
    if (name.includes('early')) return { bg: '#fff3e0', text: '#ef6c00', border: '#ffcc80' };
    return { bg: '#ffebee', text: '#c62828', border: '#ffcdd2' };
  };

  const statusStyle = getStatusColor(predictionData?.class);

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, width: '100vw', minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      boxSizing: 'border-box', overflowX: 'hidden', backgroundColor: '#0a192f',
      backgroundImage: 'linear-gradient(rgba(10, 25, 47, 0.55), rgba(10, 25, 47, 0.65)), url("/agri-poster.jpg")',
      backgroundSize: '100% 100%', backgroundPosition: 'center center', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed'
    }}>
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.98)', width: '100%', maxWidth: '560px',
        borderRadius: '24px', boxShadow: '0 30px 60px rgba(0, 0, 0, 0.5)', padding: '40px',
        textAlign: 'center', boxSizing: 'border-box', backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.2)', position: 'relative', zIndex: 2
      }}>
        {/* Title */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'inline-block', backgroundColor: '#e8f5e9', padding: '10px 16px', borderRadius: '50px', marginBottom: '14px' }}>
            <span style={{ color: '#2e7d32', fontWeight: 'bold', fontSize: '11px', letterSpacing: '1px' }}>
              HYBRID COMPUTER VISION & LLM ORCHESTRATOR
            </span>
          </div>
          <h1 style={{ margin: '0 0 8px 0', color: '#0a192f', fontSize: '28px', fontWeight: '800' }}>
            Crop Health Analytics
          </h1>
          <p style={{ margin: '0', color: '#546e7a', fontSize: '15px' }}>
            Upload plant leaf matrices to process integrated neuro-symbolic diagnostics.
          </p>
        </div>

        {/* File Input Zone */}
        <div 
          onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
          style={{
            border: isDragging ? '2px dashed #2e7d32' : '2px dashed #b0bec5',
            backgroundColor: isDragging ? '#f1f8e9' : '#f8f9fa',
            borderRadius: '16px', padding: '40px 20px', cursor: 'pointer', marginBottom: '24px'
          }}
        >
          {!previewUrl ? (
            <div>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🍃</div>
              <p style={{ margin: '0 0 4px 0', fontWeight: '600', color: '#0a192f' }}>Drag & drop plant leaf sample</p>
              <label style={{ backgroundColor: '#2e7d32', color: 'white', padding: '12px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', display: 'inline-block', cursor: 'pointer', marginTop: '12px' }}>
                Browse Files
                <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
              </label>
            </div>
          ) : (
            <div style={{ position: 'relative' }}>
              <img src={previewUrl} alt="Target leaf" style={{ maxWidth: '100%', maxHeight: '260px', borderRadius: '12px', display: 'block', margin: '0 auto' }} />
              <button onClick={(e) => { e.stopPropagation(); setPreviewUrl(null); setSelectedFile(null); setPredictionData(null); setGroqReport(null); }} style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: 'rgba(10, 25, 47, 0.85)', color: '#fff', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer' }}>✕</button>
            </div>
          )}
        </div>

        {/* Action Button */}
        {selectedFile && !predictionData && (
          <button onClick={handleUploadAndPredict} disabled={isLoading} style={{ backgroundColor: isLoading ? '#90a4ae' : '#1a237e', color: 'white', padding: '16px 28px', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '16px', fontWeight: '700', width: '100%' }}>
            {isLoading ? 'Processing Hybrid Layers...' : 'Compute Full Diagnostic Analysis'}
          </button>
        )}

        {/* Loader */}
        {isLoading && (
          <div style={{ margin: '20px 0', color: '#1a237e', fontWeight: '600' }}>
            <div style={{ border: '4px solid #f3f3f3', borderTop: '4px solid #1a237e', borderRadius: '50%', width: '32px', height: '32px', animation: 'spin 1s linear infinite', margin: '0 auto 12px auto' }}></div>
            Executing Cross-Model Tensor Evaluation...
          </div>
        )}

        {/* CNN Classification Block */}
        {predictionData && (
          <div style={{ marginTop: '16px', padding: '20px', backgroundColor: statusStyle.bg, borderRadius: '16px', border: `1px solid ${statusStyle.border}`, textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: '#546e7a', fontSize: '14px', fontWeight: '600' }}>CNN Classification State</span>
              <span style={{ backgroundColor: '#ffffff', color: statusStyle.text, padding: '4px 14px', borderRadius: '50px', fontWeight: 'bold', fontSize: '13px', border: `1px solid ${statusStyle.border}` }}>
                {predictionData.class}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
              <span style={{ color: '#546e7a', fontSize: '14px', fontWeight: '600' }}>Neural Confidence Matrix</span>
              <span style={{ color: '#0a192f', fontWeight: '800' }}>{(predictionData.confidence * 100).toFixed(2)}%</span>
            </div>
          </div>
        )}

        {/* NEW: Groq Actionable Treatment Plan Block */}
        {groqReport && (
          <div style={{ marginTop: '16px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '16px', border: '1px solid #cfd8dc', textAlign: 'left' }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#1a237e', fontSize: '14px', fontWeight: '700', letterSpacing: '0.5px' }}>
              LLM ACTIONABLE INTERVENTION PROTOCOLS:
            </h4>
            <p style={{ margin: '0', color: '#37474f', fontSize: '14px', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
              {groqReport}
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default App;