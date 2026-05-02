const BASE_URL = "http://localhost:5000/api";

export const registerUser = async (data) => {
  try {
    const res = await fetch(`${BASE_URL}/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return await res.text();
  } catch (err) {
    return "Network error: Unable to reach the server. Make sure the backend is running.";
  }
};

export const sendUserOTP = async (data) => {
  try {
    const res = await fetch(`${BASE_URL}/users/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch (err) {
    return { message: "Network error: Unable to reach the server." };
  }
};

export const verifyUserOTP = async (data) => {
  try {
    const res = await fetch(`${BASE_URL}/users/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return await res.text();
  } catch (err) {
    return "Network error: Unable to reach the server.";
  }
};

export const loginUser = async (data) => {
  try {
    const res = await fetch(`${BASE_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    return json;
  } catch (err) {
    return { message: "Login failed. Please try again." };
  }
};

export const getUsers = async () => {
  const res = await fetch(`${BASE_URL}/users`);
  return res.json();
};

export const resetPassword = async (data) => {
  try {
    const res = await fetch(`${BASE_URL}/users/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return await res.text();
  } catch (err) {
    return "Network error: Unable to reach the server.";
  }
};


export const adminUpdateUser = async (id, data) => {
  try {
    const res = await fetch(`${BASE_URL}/dashboard/admin/beneficiaries/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return await res.text();
  } catch (err) {
    return "Network error: Unable to reach the server.";
  }
};

// ===== SHOPKEEPER API =====
export const registerShopkeeper = async (data) => {
  try {
    const res = await fetch(`${BASE_URL}/shopkeeper/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return await res.text();
  } catch (err) {
    return "Network error: Unable to reach the server.";
  }
};

export const sendShopkeeperOTP = async (data) => {
  try {
    const res = await fetch(`${BASE_URL}/shopkeeper/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch (err) {
    return { message: "Network error: Unable to reach the server." };
  }
};

export const verifyShopkeeperOTP = async (data) => {
  try {
    const res = await fetch(`${BASE_URL}/shopkeeper/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return await res.text();
  } catch (err) {
    return "Network error: Unable to reach the server.";
  }
};

export const loginShopkeeper = async (data) => {
  try {
    const res = await fetch(`${BASE_URL}/shopkeeper/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    return json;
  } catch (err) {
    return { message: "Login failed. Please try again." };
  }
};

export const getAvailableShops = async () => {
  try {
    const res = await fetch(`${BASE_URL}/shopkeeper/shops`);
    return res.json();
  } catch (err) {
    return [];
  }
};

// ===== COMPLAINT API =====
export const submitComplaint = async (data) => {
  const res = await fetch(`${BASE_URL}/complaints`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.text();
};

export const getComplaints = async () => {
  const res = await fetch(`${BASE_URL}/complaints`);
  return res.json();
};

export const getMyComplaints = async (userId) => {
  const res = await fetch(`${BASE_URL}/complaints/user/${userId}`);
  return res.json();
};

export const updateComplaintStatus = async (id, status) => {
  const res = await fetch(`${BASE_URL}/complaints/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status })
  });
  return res.text();
};

// ===== ADMIN VERIFICATION API =====
export const verifyUser = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/users/verify/${id}`, { method: "PUT" });
    return await res.text();
  } catch (err) {
    return "Network error: Unable to reach the server.";
  }
};

export const unverifyUser = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/users/unverify/${id}`, { method: "PUT" });
    return await res.text();
  } catch (err) {
    return "Network error: Unable to reach the server.";
  }
};