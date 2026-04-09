import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function Report() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const reportRef = useRef();
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    axios.get(`http://localhost:5000/report/${id}`, {
      withCredentials: true
    }).then(res => setData(res.data));
  }, [id]);

  useEffect(() => {
  if (reportRef.current) {
    const height = reportRef.current.scrollHeight;
    const pageHeight = 1122;

    const pages = Math.ceil(height / pageHeight);
    setTotalPages(pages);
  }
}, [data]);

if (!data) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-6">

      <div id="report" ref={reportRef} className="bg-white text-black w-[700px] p-6 shadow-lg relative">

        {/* HEADER */}
<div className="bg-white text-black p-6 rounded-lg ">

  {/* TOP ROW: Logo + Centre Details */}
  <div className="flex items-center gap-4">

    {/* LOGO */}
    {data.logo && (
      <img
        src={`http://localhost:5000/uploads/${data.logo}`}
        alt="logo"
        className="w-20 h-20 rounded-full object-cover border border-gray-300"
      />
    )}

    {/* CENTRE DETAILS */}
    <div>
      <h2 className="text-xl font-bold">
        {data.centreName}
      </h2>
      <p className="text-sm">
        {data.address}
      </p>
    </div>

  </div>

  {/* CONTACT + license */}
  <div className="flex justify-between text-sm mt-3">
    <p>Contact: {data.contactNo}</p>
    <p>GSTIN No: {data.licenseNo}</p>
  </div>
  <div className="flex justify-between text-sm mt-3">
    <p>Email: {data.email}</p>
    <p>Website: {data.website}</p>
  </div>
       <hr className="my-1" />
</div>

        <hr className="my-1" />
        {/* PATIENT DETAILS */}
        <div className="bg-white text-black p-4 rounded shadow-md">

  <div className="grid grid-cols-3 items-center">

    {/* LEFT SECTION */}
    <div>
      <h2 className="font-bold text-lg">{data.patient_name}</h2>
      <p className="text-sm"><strong>Age:</strong>{data.age} Years</p>
      <p className="text-sm"><strong>Sex:</strong> {data.sex}</p>
      <p className="text-sm"><strong>PID:</strong> {data.patient_id}</p>
      <p className="text-sm"><strong>Mobile:</strong> {data.mobile}</p>
    </div>

    {/* MIDDLE SECTION */}
    <div className="border-1 border-r px-4">
      <p className="text-sm">
        <strong>Ref. By:</strong> {data.ref_by}
      </p>
    </div>

    {/* RIGHT SECTION */}
    <div className="text-sm pl-4">
      <p><strong>Registered on:</strong> {data.date}</p>
      <p><strong>Collected on:</strong> {data.date}</p>
      <p><strong>Status:</strong> Final</p>
    </div>

  </div>

</div>
<hr className="my-1" />
        {/* IMAGE */}
        <div className="mt-4 flex justify-center gap-6">

  <div className="text-center">
    <p className="text-cyan-400 mb-1">Original MRI</p>
    <img
      src={`http://localhost:5000/uploads/${data.image}`}
      alt="MRI"
      className="w-[300px] border rounded"
    />
  </div>

  <div className="text-center">
    <p className="text-red-400 mb-1">Segmented Tumor</p>
    {data.tumor_area > 0 ? (
  <div className="text-center">
    <img
      src={`http://localhost:5000/uploads/${data.segmented_image}`}
      alt="Segmented"
      className="w-[300px] border rounded"
    />
  </div>
) : (
  <div className="text-center">
    <p className="text-sm text-gray-500">No Tumor Detected</p>
  </div>
)}
  </div>

</div>

        {/* RESULT */}
        <div className="mt-4 text-sm">
          <p><b>Diagnosis:</b> {data.result}</p>
          <p><b>Confidence:</b> {Math.round(data.confidence * 100)}%</p>
          <p>
  <b>Tumor Area:</b>{" "}
  {data.tumor_area > 0 ? `${data.tumor_area} px²` : "Not detected"}
</p>
        </div>

        {/* FOOTER */}
        <div className="mt-6 text-xs text-gray-500">
          <p>⚠ This is an AI-generated report. Consult a doctor.</p>
        </div>

        <div className="flex justify-end mt-10">
  <div className="text-center">
    
    {data.signature && (
      <img
        src={`http://localhost:5000/uploads/${data.signature}`}
        alt="signature"
        className="h-16 mx-auto"
      />
    )}

    <p className="text-sm mt-1">
      {data.radiologistName}
    </p>
    <p className="text-xs">
      Radiologist
    </p>
  </div>
</div>

        {/* DOWNLOAD BUTTON */}
        <button
          onClick={() => window.print()}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Download PDF
        </button>

      <div
  style={{
    position: "absolute",
    bottom: "10px",
    right: "20px",
    fontSize: "12px"
  }}
>
  Page 1 of {totalPages}
</div>

      </div>

    </div>
  );
}

export default Report;