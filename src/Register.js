import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [centreName, setCentreName] = useState("");
  const [address, setAddress] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [radiologistName, setRadiologistName] = useState("");
  const [licenseNo, setlicenseNo] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [logo, setLogo] = useState("");
  const [sign, setSign] = useState("");
  const [coupon, setCoupon] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [price, setPrice] = useState("");
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");

  axios.defaults.withCredentials = true;
  const navigate = useNavigate();

  const plans = [
  { name: "30days", label: "1 Month", price: 9999 },
  { name: "3months", label: "3 Months", price: 24999 },
  { name: "6months", label: "6 Months", price: 39999 },
  { name: "12months", label: "12 Months", price: 69999 },
];
  const getPlanDays = (plan) => {
  if (plan === "30days") return "30 Days";
  if (plan === "3months") return "90 Days";
  if (plan === "6months") return "180 Days";
  if (plan === "12months") return "365 Days";
  return "";
};

  const register = async (payment_id = null) => {
    if (!validateForm()) {
    setError("Please fill all form details correctly");
    return;
  }

  if (!selectedPlan) {
  setError("Please select a subscription plan");
  return;
}


  if (price > 0 && !payment_id) {
    setError("Please complete payment first");
    return;
  }

  setError(""); // clear if valid
    try {
      await axios.post(
        "http://localhost:5000/register",
        {
          username,
          password,
          centreName,
          address,
          contactNo,
          radiologistName,
          email,
          website,
          licenseNo,
          logo,
          sign,
          price,
          payment_id,
          plan: selectedPlan 
        },
        { withCredentials: true }
      );
      console.log("Sending register request...");

      window.location.href = "/";
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Registration failed");
    }
  };

  const applyCoupon = async () => {
  try {
    const res = await axios.post("http://localhost:5000/apply-coupon", {
      coupon
    });

    setPrice(res.data.price);
    setError("");
    setCouponApplied(true);
  } catch (err) {
    setError("Invalid coupon");
    setCouponApplied(false);
  }
};

const removeCoupon = () => {
  setCoupon("");
  const selected = plans.find(p => p.name === selectedPlan);
  setPrice(selected?.price || 0);
  setCouponApplied(false);
  setError("");
};

const validateForm = () => {
  let newErrors = {};

  // Username → only text + number
  if (!/^[a-zA-Z0-9]+$/.test(username)) {
    newErrors.username = "Only letters and numbers allowed";
  }

  // Password → text + number + special char (at least one)
  if (!/^[a-zA-Z0-9!@#$%^&*]+$/.test(password)) {
    newErrors.password = "Invalid password format";
  }

  // Centre Name (optional strict or keep simple)
  if (!centreName) {
    newErrors.centreName = "Required";
  }

  // Address → no special characters
  if (!/^[a-zA-Z0-9\s,.-]+$/.test(address)) {
    newErrors.address = "Invalid address";
  }

  // Mobile → only numbers (10 digits)
  if (!/^[0-9]{10}$/.test(contactNo)) {
    newErrors.contactNo = "Enter valid 10 digit number";
  }

  // Radiologist → only text
  if (!/^[a-zA-Z\s]+$/.test(radiologistName)) {
    newErrors.radiologistName = "Only letters allowed";
  }

  // License → text + number
  if (!/^[a-zA-Z0-9]+$/.test(licenseNo)) {
    newErrors.licenseNo = "Invalid license";
  }

  // Email → must include @
  if (!email.includes("@")) {
    newErrors.email = "Invalid email";
  }

  setErrors(newErrors);

  return Object.keys(newErrors).length === 0;
};

const handlePayment = async () => {
  // ❗ CHECK FIRST
  if (!validateForm()) {
    setError("Please fill all form details correctly");
    return;
  }
  if (!selectedPlan) {
  setError("Please select a subscription plan");
  return;
}

  setError(""); // clear if valid

  try {
    // 1️⃣ Create order
    const res = await axios.post("http://localhost:5000/create-order", {
      amount: price,
      coupon: coupon,
      plan: selectedPlan
    });

    const { order_id, key, amount } = res.data;

    const options = {
      key: key,
      amount: amount,
      currency: "INR",
      name: "NeuroScan AI",
      description: "Subscription Payment",
      order_id: order_id,

      handler: async function (response) {
        // 2️⃣ Verify payment
        const verifyRes = await axios.post(
          "http://localhost:5000/verify-payment",
          response
        );

        if (verifyRes.data.status === "success") {
          register(response.razorpay_payment_id); // ✅ pass token
        } else {
          alert("Payment verification failed");
        }
      },

      prefill: {
        name: username,
        email: email
      },

      theme: {
        color: "#3399cc"
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

  } catch (err) {
    console.error(err);
    alert("Payment failed");
  }
};

  return (
    <div className="min-h-screen bg-[#0b1220] text-white p-6">
      <div className="glass p-8 rounded-2xl glow-border w-full max-w-6xl mx-auto shadow-lg">
        <h2 className="glow-text mb-4 text-center">Register</h2>

        <div className="grid grid-cols-2 gap-4">
        <div>
        <label className="block mb-1 text-sm text-gray-300">Username</label>
        <input
          type="text"
          placeholder="Username"
          value={username}
          className={`w-full text-sm bg-black border rounded p-1 ${errors.username ? "border-red-500" : "border-cyan-700"}`}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        </div>

        <div>
        <label className="block mb-1 text-sm text-gray-300">Password</label>
        <input
          type="password"
          placeholder="Password"
          value={password}
          className={`w-full text-sm bg-black border rounded p-1 ${errors.password ? "border-red-500" : "border-cyan-700"}`}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
         </div>

         <div>
        <label className="block mb-1 text-sm text-gray-300">Centre Name</label>
        <input
          type="text"
          placeholder="Diagnosis Centre Name"
          value={centreName}
          className={`w-full text-sm bg-black border rounded p-1 ${errors.centreName ? "border-red-500" : "border-cyan-700"}`}
          onChange={(e) => setCentreName(e.target.value)}
          required
        />
        </div>

        <div>
        <label className="block mb-1 text-sm text-gray-300">Contact No</label>
          <input
          placeholder="Contact No"
          value={contactNo}
          className={`w-full text-sm bg-black border rounded p-1 ${errors.contactNo ? "border-red-500" : "border-cyan-700"}`}
          onChange={(e) => setContactNo(e.target.value)}
          required
        />
        </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
        <div>
        <label className="block mb-1 text-sm text-gray-300">Email</label>
        <input
          placeholder="Email"
          value={email}
          className={`w-full text-sm bg-black border rounded p-1 ${errors.email ? "border-red-500" : "border-cyan-700"}`}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        </div>
         
         <div>
         <label className="block mb-1 text-sm text-gray-300">Website</label>
         <input
          placeholder="Website"
          value={website}
          className={`w-full text-sm bg-black border rounded p-1 ${errors.website ? "border-red-500" : "border-cyan-700"}`}
          onChange={(e) => setWebsite(e.target.value)}
          required
         />
         </div>
        
        <div>
        <label className="block mb-1 text-sm text-gray-300">GSTIN</label>
        <input
          placeholder="GSTIN"
          value={licenseNo}
          className={`w-full text-sm bg-black border rounded p-1 ${errors.licenseNo ? "border-red-500" : "border-cyan-700"}`}
          onChange={(e) => setlicenseNo(e.target.value)}
          required
        />
        </div>
        
        <div>
        <label className="block mb-1 text-sm text-gray-300">Radiologist Name</label>
        <input
          type="text"
          placeholder="Radiologist Name"
          value={radiologistName}
          className={`w-full text-sm bg-black border rounded p-1 ${errors.radiologistName ? "border-red-500" : "border-cyan-700"}`}
          onChange={(e) => setRadiologistName(e.target.value)}
          required
        />
        </div>
        </div>
        <label className="block mb-1 text-sm text-gray-300">Address</label>
        <input
          placeholder="Address"
          value={address}
          className={`w-full text-sm bg-black border rounded p-1 ${errors.address ? "border-red-500" : "border-cyan-700"}`}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
         
      <div className="grid grid-cols-2 gap-4">

        {/* LOGO */}
        <div>
        <label className="block mb-1 text-sm text-gray-300">Logo</label>
        <input
         type="file"
         className="w-full text-sm bg-black border border-cyan-700 rounded p-1"
         onChange={(e) => setLogo(e.target.files[0])}
        />
        </div>

        {/* SIGNATURE */}
        <div>
        <label className="block mb-1 text-sm text-gray-300">Signature</label>
        <input
         type="file"
         className="w-full text-sm bg-black border border-cyan-700 rounded p-1"
         onChange={(e) => setSign(e.target.files[0])}
        />
        </div>

      </div>
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

        <div className="mt-4">
        <label className="font-semibold">Coupon Code</label>

        <div className="relative mt-1">
         <input
          type="text"
          value={coupon}
          onChange={(e) => {
          setCoupon(e.target.value);
          setError("");
          }}
          className="w-full p-2 mb-4 bg-black border border-cyan-700 rounded"
          placeholder="Enter coupon"
         />

    {/* RIGHT SIDE ACTION */}
    {!couponApplied ? (
      <span
        onClick={coupon ? applyCoupon : null}
        className={`absolute right-3 top-1/2 transform -translate-y-1/2 font-semibold ${
          coupon ? "text-blue-600 cursor-pointer" : "text-gray-400"
        }`}
      >
        Apply
      </span>
    ) : (
      <span
        onClick={removeCoupon}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 cursor-pointer font-bold"
      >
        ✖
      </span>
    )}
  </div>

  {/* ERROR MESSAGE */}
  {error && (
    <p className="text-red-500 text-sm text-right mt-1">
      {error}
    </p>
  )}

  {/* SUCCESS MESSAGE */}
  {couponApplied && !error && (
    <p className="text-green-500 text-sm mt-1">
      Coupon applied successfully ✔
    </p>
  )}
</div>
</div> 

<p className="mt-3 font-semibold">
  Subscription Price: ₹{price} {selectedPlan && `for ${getPlanDays(selectedPlan)}`}
</p>

{price === 0 ? (
  <button onClick={() => register()} className="bg-green-500 px-4 py-2 mt-3">
    Register
  </button>
) : (
  <button onClick={handlePayment} className="bg-purple-500 px-4 py-2 mt-3">
  Pay ₹{price} {selectedPlan && `(${getPlanDays(selectedPlan)})`}
</button>
)}

        <p className="text-sm mt-3 text-center">
           Already have an account?{" "}
           <span
           onClick={() => navigate("/login")}
           className="text-cyan-400 cursor-pointer">Login
           </span>
        </p>

      </div>
    </div>
  );
}

export default Register;