import { useState } from "react";
import axios from "axios";
import API from "./api";
import { useEffect } from "react";
import { useRef } from "react";
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis,
  LineChart, Line
} from "recharts";
axios.defaults.withCredentials = true;

function Dashboard() {
  const [showAccount, setShowAccount] = useState(false);
  const [accountData, setAccountData] = useState({
  centreName: "",
  address: "",
  contactNo: "",
  radiologistName: "",
  email: "",
  website: "",
  licenseNo: "",
  logo: null,
  signature: null
  });

  const [predictionId, setPredictionId] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [showSave, setShowSave] = useState(false);
  const COLORS = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6"];
  const [imageName, setImageName] = useState("");
  const [segmentedImage, setSegmentedImage] = useState("");
  const [tumorArea, setTumorArea] = useState(0);
  const [coupon, setCoupon] = useState("");
  const [price, setPrice] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [patientData, setPatientData] = useState({
  name: "",
  sex: "",
  age: "",
  mobile: "",
  refBy: ""
});

const [subscription, setSubscription] = useState({
  plan: "",
  remaining_days: 0
});

const plans = [
  { name: "30days", label: "1 Month", price: 9999 },
  { name: "3months", label: "3 Months", price: 24999 },
  { name: "6months", label: "6 Months", price: 39999 },
  { name: "12months", label: "12 Months", price: 69999 },
];

const getPlanLabel = (plan) => {
  if (plan === "30days") return "1 Month";
  if (plan === "3months") return "3 Months";
  if (plan === "6months") return "6 Months";
  if (plan === "12months") return "12 Months";
  return "No Plan";
};

  const fileInputRef = useRef(null);

  const [search, setSearch] = useState("");
  const filteredHistory = history.filter((item) =>
  item.patient_name?.toLowerCase().includes(search.toLowerCase())
);
   useEffect(() => {
  axios.get(`${API}/history`, {
  withCredentials: true
})
    .then(res => {
      setHistory(res.data);       //  LOAD HISTORY
    })
    .catch((err) => {
  if (err.response && err.response.status === 401) {
    window.location.href = "/";
  } else {
    console.error(err);
  }
});
}, []);

useEffect(() => {
  prepareChart(history);   // ALWAYS FULL DATA
}, [history]);

  const prepareChart = (data) => {
    let counts = { glioma: 0, meningioma: 0, notumor: 0, pituitary: 0 };

    data.forEach((d) => {
      const key = d.result?.toLowerCase();
      if (counts[key] !== undefined) counts[key]++;
    });

    setChartData([
      { name: "Glioma", value: counts.glioma },
      { name: "Meningioma", value: counts.meningioma },
      { name: "No Tumor", value: counts.notumor },
      { name: "Pituitary", value: counts.pituitary }
    ]);

    setTrendData(
      data.map((d, i) => ({
        name: `#${i + 1}`,
        confidence: Math.round(d.confidence * 100)
      }))
    );
  };

  const upload = async () => {
  setLoading(true);  // start animation

  // simulate delay (or replace with API call)
  setTimeout(() => {
    setLoading(false); // stop animation
  }, 3000);

  if (!file) {
    alert("Please select an image first");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  const res = await axios.post(
    `${API}/predict`,
    formData,
    { withCredentials: true }
  );
  
  console.log(res.data);
  setPredictionId(res.data.id);
  setImageName(res.data.image);
  setSegmentedImage(res.data.segmented_image);
  setTumorArea(res.data.tumor_area);
  setResult(res.data.result);
  setConfidence(Math.round(res.data.confidence * 100));

  // keep image
  setPreview(URL.createObjectURL(file));

  // update chart temporarily
  const tempData = [
    ...history,
    {
      result: res.data.result,
      confidence: res.data.confidence
    }
  ];
  prepareChart(tempData);

  // ✅ SHOW SAVE BUTTON
  setShowSave(true);
};

  const updateAccount = async () => {
  try {
    const formData = new FormData();

    // TEXT FIELDS
    formData.append("centreName", accountData.centreName);
    formData.append("address", accountData.address);
    formData.append("contactNo", accountData.contactNo);
    formData.append("radiologistName", accountData.radiologistName);
    formData.append("email", accountData.email);
    formData.append("website", accountData.website);
    formData.append("licenseNo", accountData.licenseNo);

    // PASSWORD
    if (newPassword) {
      formData.append("password", newPassword);
    }

    // FILES
    if (accountData.logo) {
      formData.append("logo", accountData.logo);
    }

    if (accountData.signature) {
      formData.append("signature", accountData.signature);
    }

    await axios.post(
      `${API}/update-account`,
      formData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );

    setShowAccount(false);
  } catch (err) {
    console.error(err);
  }
};

  const logout = async () => {
  await axios.post(`${API}/logout`, {}, { withCredentials: true });
  window.location.href = "/";
};

const saveResult = async () => {
  await axios.post(
    `${API}/save`,
    {
       id: predictionId,
      result,
      confidence: confidence / 100,
      patient_name: patientData.name,
      sex: patientData.sex,
      age: patientData.age,
      mobile: patientData.mobile,
      ref_by: patientData.refBy,
      image: imageName,
      segmented_image: segmentedImage,
      tumor_area: tumorArea
    },
    { withCredentials: true }
  );
    setShowForm(false);

  const res = await axios.get(
    `${API}/history`,
    { withCredentials: true }
  );

  setHistory(res.data);

  // reset UI
  setShowSave(false);
  setFile(null);
  setPreview(null);
  setSegmentedImage("");
  setTumorArea(null);
  setResult(null);
  setConfidence(null);

  if (fileInputRef.current) {
  fileInputRef.current.value = "";
}

};

const fetchAccount = async () => {
  try {
    const res = await axios.get(`${API}/account`, {
      withCredentials: true
    });
    setAccountData(res.data);
  } catch (err) {
    console.error("Account Error:", err);
  }
};

const fetchSubscription = async () => {
  try {
    const res = await axios.get(`${API}/subscription-status`, {
      withCredentials: true
    });
    setSubscription(res.data);
  } catch (err) {
    console.error("Subscription Error:", err);
  }
};

const handleSubscribe = async () => {
  if (!selectedPlan) {
    alert("Please select a plan");
    return;
  }

  try {
    // ✅ FREE PLAN
    if (price === 0) {
      await axios.post(
        `${API}/subscribe`,
        {
          plan: selectedPlan,
          coupon: coupon,
          payment_id: null
        },
        { withCredentials: true }
      );

      fetchSubscription();
      alert("Plan activated successfully!");
      return;
    }

    // ✅ PAID PLAN → CREATE ORDER
    const res = await axios.post(
      `${API}/create-order`,
      {
        amount: price,
        coupon: coupon,
        plan: selectedPlan
      }
    );

    const { order_id, key, amount } = res.data;

    const options = {
      key: key,
      amount: amount,
      currency: "INR",
      name: "NeuroScan AI",
      description: "Subscription Payment",
      order_id: order_id,

      handler: async function (response) {
        // ✅ VERIFY PAYMENT
        const verifyRes = await axios.post(
          `${API}/verify-payment`,
          response
        );

        if (verifyRes.data.status === "success") {
          // ✅ ACTIVATE PLAN AFTER PAYMENT
          await axios.post(
            `${API}/subscribe`,
            {
              plan: selectedPlan,
              coupon: coupon,
              payment_id: response.razorpay_payment_id
            },
            { withCredentials: true }
          );

          fetchSubscription();
          alert("Payment successful & plan activated!");
        } else {
          alert("Payment verification failed");
        }
      },

      prefill: {
        name: accountData.centreName,
        email: accountData.email
      },

      theme: {
        color: "#06b6d4"
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

  } catch (err) {
    console.error(err);
    alert("Payment failed");
  }
};

const applyCoupon = async () => {
  try {
    const res = await axios.post(`${API}/apply-coupon`, { coupon });
    setPrice(res.data.price);
    setCouponApplied(true);
  } catch {
    alert("Invalid coupon");
  }
};

const removeCoupon = () => {
  setCoupon("");
  setCouponApplied(false);
  setPrice(0);
};

  return (
    <div className="min-h-screen bg-[#0b1220] text-white p-4">

      {/* TOP BAR */}
     <div className="flex justify-between items-center border-b border-cyan-800 pb-2 mb-4">

  {/* LEFT SIDE */}
  <h1 className="text-xl font-bold glow-text tracking-widest">
    NEUROSCAN AI
  </h1>

  {/* RIGHT SIDE (GROUPED BUTTONS) */}
  <div className="flex gap-3">
    <button
      onClick={() => {
        fetchAccount();
        setShowAccount(true);
        fetchSubscription();
      }}
      className="bg-cyan-600 px-3 py-1 rounded hover:bg-cyan-700 transition"
    >
      Account
    </button>

    <button
      onClick={logout}
      className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition"
    >
      Logout
    </button>
  </div>

</div>

      <div className="grid grid-cols-4 gap-4">

        {/* LEFT PANEL */}
        <div className="col-span-3 glass glow-border p-4 rounded-xl">

          <h3 className="text-cyan-300 mb-2">ANALYSIS VIEWER</h3>

          <div className="bg-black p-4 rounded flex justify-center gap-6 h-[320px] items-center">

  {preview ? (
    <div className="text-center">
      <p className="text-cyan-400 mb-1">Original MRI</p>
      <img
        src={preview}
        alt="preview"
        className="h-[250px] object-contain border border-cyan-500 rounded hover:scale-105 transition duration-300"
      />
    </div>
  ) : (
    <p className="text-gray-500">Upload MRI Image</p>
  )}

  {segmentedImage && (
    <div className="text-center">
      <p className="text-red-400 mb-1">Segmented Tumor</p>
      <img
        src={`${API}/uploads/${segmentedImage}`}
        alt="Segmented"
        className="h-[250px] object-contain border border-cyan-500 rounded hover:scale-105 transition duration-300"
      />
    </div>
  )}

</div>

          <div className="mt-3 flex gap-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => {
  const newFile = e.target.files[0];

  setFile(newFile);
  setPreview(URL.createObjectURL(newFile));

  // 🔴 RESET OLD DATA
  setSegmentedImage("");
  setResult("");
  setConfidence(0);
  setTumorArea(0);
  setShowSave(false);
}}
            />
            <button onClick={upload} className="glow-button px-4 py-2 rounded">
              Analyze
            </button>
             {/* Save Button */}

            {showSave && (
  <button
    onClick={() => setShowForm(true)}
    className="bg-green-500 px-4 py-2 rounded"
  >
    Save
  </button>
)}

            {/* 🔍 SEARCH BAR HERE */}
            <input
            type="text"
            placeholder="Search (Name)"
            value={search}   // ✅ add this
            className="w-full p-2 mb-3 bg-black border border-cyan-700 rounded"
            onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="mt-4 max-h-80 overflow-y-auto text-sm border-t border-cyan-800 pt-2">
  {filteredHistory.map((item, i) => (
  <div key={i} className="border-b border-gray-700 py-2 flex justify-between">
    
    <div>
      <p className="text-cyan-400">{item.patient_name}</p>
      <p className="text-xs text-gray-400">
        {item.result} - {Math.round(item.confidence * 100)}%
      </p>
    </div>

    <button
  onClick={() => window.open(`http://localhost:3000/report/${item.id}`, "_blank")}
  className="bg-blue-500 px-2 py-1 rounded text-xs"
>
  View Report
</button>

  </div>
))}
</div>

        </div>

        {/* RIGHT PANEL */}
        <div className="glass glow-border p-4 rounded-xl">

          <h3 className="glow-text mb-3">AI DIAGNOSTICS</h3>

          <p className="mb-2">
            Prediction: <span className="text-cyan-400">{result}</span>
          </p>

          <p className="mb-4">
            Confidence: {confidence}%
          </p>

          <p className="mb-2">
            Tumor Area:{" "}
            <span className="text-red-400">
            {tumorArea ? `${tumorArea} px²` : "Not detected"}
            </span>
          </p>

          {/* PIE */}
          <PieChart width={250} height={200}>
            <Pie data={chartData} dataKey="value" outerRadius={70}>
              {chartData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>

          {/* BAR */}
          <BarChart width={300} height={200} data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 45 }}>
            <XAxis dataKey="name" stroke="#ccc" interval={0} angle={-40} textAnchor="end" />
            <YAxis stroke="#ccc" />
            <Tooltip />
            <Bar dataKey="value" fill="#06b6d4" />
          </BarChart>

          {/* LINE */}
          <LineChart width={250} height={150} data={trendData} style={{ marginTop: "20px" }}>
            <XAxis dataKey="name" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip />
            <Line type="monotone" dataKey="confidence" stroke="#22d3ee" />
          </LineChart>
           
        </div>
      </div>
  {showForm && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80">
      <div className="glass p-6 rounded-2xl glow-border w-full max-w-2xl mx-auto shadow-lg">

      <h2 className="text-lg mb-4 text-center">Patient Details</h2>

      <input placeholder="Name"
        className="w-full p-2 mb-2 bg-black border border-cyan-700 rounded"
        onChange={(e) => setPatientData({...patientData, name: e.target.value})}
      />

      <select
       className="w-full p-2 mb-2 bg-black border border-cyan-700 rounded"
       value={patientData.sex}
       onChange={(e) =>
       setPatientData({ ...patientData, sex: e.target.value })
       }
      >
      <option value="" disabled>Select Sex</option>
      <option value="Male">Male</option>
      <option value="Female">Female</option>
      <option value="Others">Others</option>
      </select>

      <input placeholder="Age"
        className="w-full p-2 mb-2 bg-black border border-cyan-700 rounded"
        onChange={(e) => setPatientData({...patientData, age: e.target.value})}
      />

      <input placeholder="Mobile No."
        className="w-full p-2 mb-2 bg-black border border-cyan-700 rounded"
        onChange={(e) => setPatientData({...patientData, mobile: e.target.value})}
      />

      <input placeholder="Ref By"
        className="w-full p-2 mb-3 bg-black border border-cyan-700 rounded"
        onChange={(e) => setPatientData({...patientData, refBy: e.target.value})}
      />

      <div className="flex justify-between">
        <button
          onClick={() => setShowForm(false)}
          className="px-4 py-2 bg-gray-600 rounded"
        >
          Cancel
        </button>

        <button
          onClick={saveResult}
          className="px-4 py-2 bg-cyan-600 rounded"
        >
          Submit
        </button>
      </div>
      </div>
    </div>
)}

{showAccount && (
  <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center items-center">

    <div className="bg-[#0b1220] text-white w-[95%] h-[90vh] rounded-2xl glow-border p-6 overflow-y-auto relative">

      {/* CLOSE BUTTON */}
      <button
        onClick={() => setShowAccount(false)}
        className="absolute top-4 right-4 bg-red-500 px-3 py-1 rounded"
      >
        ✕
      </button>

      <h2 className="text-xl mb-6 text-center">Account Details</h2>

      <div className="grid grid-cols-2 gap-6">

  {/* Row 1 */}
  <div>
    <label>Centre Name</label>
    <input
      value={accountData.centreName}
      onChange={(e) => setAccountData({...accountData, centreName: e.target.value})}
      className="w-full p-2 bg-black border border-cyan-700 rounded"
    />
  </div>

  <div>
    <label>Address</label>
    <input
      value={accountData.address}
      onChange={(e) => setAccountData({...accountData, address: e.target.value})}
      className="w-full p-2 bg-black border border-cyan-700 rounded"
    />
  </div>

  {/* Row 2 */}
  <div>
    <label>Contact No</label>
    <input
      value={accountData.contactNo}
      onChange={(e) => setAccountData({...accountData, contactNo: e.target.value})}
      className="w-full p-2 bg-black border border-cyan-700 rounded"
    />
  </div>

  <div>
    <label>Radiologist Name</label>
    <input
      value={accountData.radiologistName}
      onChange={(e) => setAccountData({...accountData, radiologistName: e.target.value})}
      className="w-full p-2 bg-black border border-cyan-700 rounded"
    />
  </div>

  {/* Row 3 */}
  <div>
    <label>Email</label>
    <input
      value={accountData.email}
      onChange={(e) => setAccountData({...accountData, email: e.target.value})}
      className="w-full p-2 bg-black border border-cyan-700 rounded"
    />
  </div>

  <div>
    <label>Website</label>
    <input
      value={accountData.website}
      onChange={(e) => setAccountData({...accountData, website: e.target.value})}
      className="w-full p-2 bg-black border border-cyan-700 rounded"
    />
  </div>

  {/* Row 4 (License alone left) */}
  <div>
    <label>License No</label>
    <input
      value={accountData.licenseNo}
      onChange={(e) => setAccountData({...accountData, licenseNo: e.target.value})}
      className="w-full p-2 bg-black border border-cyan-700 rounded"
    />
  </div>

  <div></div> {/* empty right side */}

  {/* Row 5 (Logo & Signature) */}
  <div>
   <label className="block mb-1 text-sm text-cyan-300">Logo</label>
  <input
    type="file"
    className="text-sm"
    onChange={(e) => setAccountData({...accountData, logo: e.target.files[0]})}
  />
</div>

<div>
   <label className="block mb-1 text-sm text-cyan-300">Signature</label>
  <input
    type="file"
    className="text-sm"
    onChange={(e) => setAccountData({...accountData, signature: e.target.files[0]})}
  />
</div>

</div>

      <hr className="my-4"/>
      <label className="block mb-1">Select Plan</label>
      <input
        type="password"
        placeholder="New Password"
        onChange={(e) => setNewPassword(e.target.value)}
        className="w-full p-2 mb-3 bg-black border border-cyan-700 rounded"
      />

      <p>Plan: {getPlanLabel(subscription.plan)}</p>
      <p>Remaining: {subscription.remaining_days} days</p>
      <p></p>
  <div className="grid grid-cols-2 gap-4">
  <div className="mt-4">
  <label className="block mb-1">Select Plan</label>

  <select
    className="w-full text-sm bg-black border border-cyan-700 rounded p-1"
    value={selectedPlan}
    onChange={(e) => {
      const selected = plans.find(p => p.name === e.target.value);

      setSelectedPlan(selected.name);
      setPrice(selected.price);
      setCouponApplied(false);
      setCoupon("");
    }}
  >
    <option value="">-- Choose Plan --</option>

    {plans.map((plan) => (
      <option key={plan.name} value={plan.name}>
        {plan.label} - ₹{plan.price}
      </option>
    ))}
  </select>
</div>

  <div className="relative mt-2">
  <label className="block mb-1">Coupon Code</label>
  <input
    value={coupon}
    onChange={(e) => setCoupon(e.target.value)}
    className="w-full p-2 bg-black border border-cyan-700 rounded"
    placeholder="Enter Coupon"
  />

  {!couponApplied ? (
    <span
      onClick={applyCoupon}
      className="absolute right-3 top-2 text-blue-400 cursor-pointer"
    >
      Apply
    </span>
  ) : (
    <span
      onClick={removeCoupon}
      className="absolute right-3 top-2 text-red-500 cursor-pointer"
    >
      ✖
    </span>
  )}
</div>
</div>

      <button
  onClick={handleSubscribe}
  className="w-full mt-3 bg-green-500 p-2 rounded"
>
  {price === 0
    ? `Activate Plan (${getPlanLabel(selectedPlan)})`
    : `Pay ₹${price} (${getPlanLabel(selectedPlan)})`}
</button>

      <div className="flex justify-end mt-6">
        <button
          onClick={updateAccount}
          className="bg-cyan-600 px-6 py-2 rounded"
        >
          Save Changes
        </button>
      </div>

    </div>
  </div>
)}

  {loading && (
  <div className="scan-container">
    <div className="brain-scan">
      <div className="scan-line"></div>
    </div>
    <p className="scan-text">Analyzing MRI Scan...</p>
  </div>
)}

    </div>
     
    

  );
}

export default Dashboard;