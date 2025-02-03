import { useState } from "react";

export default function ConjointApp() {
  const [file, setFile] = useState(null);
  const [downloadLink, setDownloadLink] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    // Upload file to S3 via API Gateway
    const uploadResponse = await fetch("https://your-api-gateway.amazonaws.com/upload", {
      method: "POST",
      body: formData,
    });

    const uploadData = await uploadResponse.json();
    if (uploadData.file_key) {
      // Trigger HB Analysis
      const analysisResponse = await fetch("https://your-api-gateway.amazonaws.com/run-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file_key: uploadData.file_key }),
      });

      const analysisData = await analysisResponse.json();
      setDownloadLink(analysisData.download_link);
    }
  };

  return (
    <div className="container">
      <h2>Upload Conjoint Data</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload & Run Analysis</button>

      {downloadLink && (
        <div>
          <h3>Download Results:</h3>
          <a href={downloadLink} target="_blank" rel="noopener noreferrer">
            Download CSV
          </a>
        </div>
      )}
    </div>
  );
}
