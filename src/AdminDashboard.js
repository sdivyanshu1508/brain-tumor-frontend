import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
const [users, setUsers] = useState([]);
const [selectedUser, setSelectedUser] = useState(null);
const [predictions, setPredictions] = useState([]);


  // ✅ Fetch users
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/admin/users", {
        withCredentials: true,
      });
      setUsers(res.data);
    } catch (err) {
      alert("Not authorized");
    }
  };

  useEffect(() => {
  axios.get("http://localhost:5000/admin/users", {
    withCredentials: true
  }).then(res => setUsers(res.data));
}, []);

  // ✅ Fetch predictions
  const fetchPredictions = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/admin/predictions",
        { withCredentials: true }
      );
      setPredictions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const viewDetails = async (userId) => {
  try {
    const res = await axios.get(
      `http://localhost:5000/admin/user_predictions/${userId}`,
      { withCredentials: true }
    );

    setPredictions(res.data);
    setSelectedUser(userId);
  } catch (err) {
    alert("Failed to fetch predictions");
  }
};

  // ✅ Delete user
  const deleteUser = async (id) => {
  if (!window.confirm("Delete this user?")) return;

  await axios.delete(`http://localhost:5000/admin/delete_user/${id}`, {
    withCredentials: true
  });

  setUsers(users.filter(u => u.id !== id));
};

  const deletePrediction = async (id) => {
  try {
    await axios.delete(`http://localhost:5000/admin/delete_prediction/${id}`, {
      withCredentials: true
    });

    alert("Deleted successfully");
    window.location.reload();
  } catch (err) {
    alert("Delete failed");
  }
};

  useEffect(() => {
    fetchUsers();
    fetchPredictions();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Dashboard</h1>

      {/* USERS */}
    <table className="w-full border">
  <thead>
    <tr className="bg-cyan-800">
      <th>User ID</th>
      <th>Centre Name</th>
      <th>Role</th>
      <th>Actions</th>
    </tr>
  </thead>

  <tbody>
    {users.map((u) => (
      <tr key={u.id} className="text-center border-t">
        <td>{u.id}</td>
        <td>{u.centre_name}</td>
        <td>{u.role}</td>
        <button
          onClick={() => viewDetails(u.id)}
          className="bg-blue-500 px-3 py-1 rounded">
          View Details
        </button>
      <td className="space-x-2 text-right">
        <button
          onClick={() => deleteUser(u.id)}
          className="bg-red-500 px-3 py-1 rounded">
          Delete
        </button>
      </td>
      </tr>
    ))}
  </tbody>
</table>

      {/* PREDICTIONS */}
      {selectedUser && (
  <div className="mt-6">
    <h3 className="text-xl mb-3">
      Predictions of User ID: {selectedUser}
    </h3>

    <table className="w-full border">
      <thead>
        <tr className="bg-purple-700">
          <th>ID</th>
          <th>Patient</th>
          <th>Result</th>
          <th>Confidence</th>
          <th className="text-right">Actions</th>
        </tr>
      </thead>

      <tbody>
        {predictions.map((p) => (
          <tr key={p.id} className="text-center border-t">
            <td>{p.id}</td>
            <td>{p.patient_name}</td>
            <td>{p.result}</td>
            <td>{p.confidence}</td>
            <td className="text-right">
            <button
              onClick={() => deletePrediction(p.id)}
              className="bg-red-500 px-3 py-1 rounded">
           Delete
            </button>
           </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}
    </div>
  );
};

export default AdminDashboard;