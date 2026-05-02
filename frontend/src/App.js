import { useState, useEffect } from "react";
import { registerUser, loginUser, resetPassword, registerShopkeeper, loginShopkeeper, getAvailableShops, sendUserOTP, sendShopkeeperOTP, verifyUserOTP, verifyShopkeeperOTP } from "./api";
import { AdminDashboard, ShopkeeperDashboard, UserDashboard } from "./Dashboards";

function App() {
  const [form, setForm] = useState({
    aadhaar: "",
    ration_card_number: "",
    shopkeeper_id: "",
    password: "",
    mobile_number: "",
    area: "",
    shop_id: "",
    otp: ""
  });

  // modes: 'auth', 'register', 'forgot', 'admin-register', 'shopkeeper-login', 'shopkeeper-register'
  const [mode, setMode] = useState("auth");
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [availableShops, setAvailableShops] = useState([]);

  // Load available shops when entering shopkeeper register mode or user register mode
  useEffect(() => {
    if (mode === 'shopkeeper-register' || mode === 'register') {
      getAvailableShops().then(setAvailableShops);
    }
  }, [mode]);

  const uniqueLocations = [...new Set(availableShops.map(shop => shop.location).filter(Boolean))];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRequestOTP = async () => {
    if (!form.aadhaar || !form.ration_card_number) {
      return alert("Aadhaar and Ration Card Number are required to request OTP.");
    }
    setLoading(true);
    const res = await sendUserOTP({ aadhaar: form.aadhaar, ration_card_number: form.ration_card_number });
    setLoading(false);
    if (res.message.includes("successfully")) {
      setOtpSent(true);
      alert(res.message);
      if (res.dev_otp) console.log("DEV OTP:", res.dev_otp);
    } else {
      alert(res.message || "Failed to send OTP.");
    }
  };

  const handleShopkeeperRequestOTP = async () => {
    if (!form.aadhaar || !form.shopkeeper_id) {
      return alert("Aadhaar and Shopkeeper ID are required to request OTP.");
    }
    setLoading(true);
    const res = await sendShopkeeperOTP({ aadhaar: form.aadhaar, shopkeeper_id: form.shopkeeper_id });
    setLoading(false);
    if (res.message.includes("successfully")) {
      setOtpSent(true);
      alert(res.message);
      if (res.dev_otp) console.log("DEV OTP:", res.dev_otp);
    } else {
      alert(res.message || "Failed to send OTP.");
    }
  };

  const handleVerifyOTP = async () => {
    if (!form.otp || form.otp.length !== 6) {
      return alert("Please enter a valid 6-digit OTP.");
    }
    setLoading(true);
    const res = await verifyUserOTP({ aadhaar: form.aadhaar, otp: form.otp });
    setLoading(false);
    
    if (res.includes("Successfully")) {
      setOtpVerified(true);
      alert(res);
    } else {
      alert(res);
    }
  };

  const handleShopkeeperVerifyOTP = async () => {
    if (!form.otp || form.otp.length !== 6) {
      return alert("Please enter a valid 6-digit OTP.");
    }
    setLoading(true);
    const res = await verifyShopkeeperOTP({ aadhaar: form.aadhaar, otp: form.otp });
    setLoading(false);
    
    if (res.includes("Successfully")) {
      setOtpVerified(true);
      alert(res);
    } else {
      alert(res);
    }
  };

  const handleRegister = async () => {
    if (!form.otp || !form.aadhaar || !form.ration_card_number || !form.password) {
      return alert("All fields are required (Aadhaar, Ration Card, OTP, Password).");
    }
    setLoading(true);
    const res = await registerUser(form);
    setLoading(false);
    alert(res);
    if (res.includes("Successfully")) {
      setMode("auth");
      setOtpSent(false);
      setOtpVerified(false);
    }
  };

  const handleLogin = async () => {
    if (!form.aadhaar || !form.password) return alert("Please enter Aadhaar and password");
    setLoading(true);
    const res = await loginUser({ aadhaar: form.aadhaar, password: form.password });
    setLoading(false);
    if (res.token && res.user) {
      setCurrentUser(res.user);
    } else {
      alert(res.message || "Login failed");
    }
  };

  const handleShopkeeperLogin = async () => {
    if (!form.aadhaar || !form.password) return alert("Please enter Aadhaar and password");
    setLoading(true);
    const res = await loginShopkeeper({ aadhaar: form.aadhaar, password: form.password });
    setLoading(false);
    if (res.token && res.user) {
      setCurrentUser(res.user);
    } else {
      alert(res.message || "Login failed. Make sure you are registered as a shopkeeper.");
    }
  };

  const handleAssistedLogin = async () => {
    if (!form.aadhaar || !form.password) return alert("Please enter Aadhaar and password");
    setLoading(true);
    const res = await loginShopkeeper({ aadhaar: form.aadhaar, password: form.password });
    setLoading(false);
    if (res.token && res.user) {
      setCurrentUser({ ...res.user, isAssistedMode: true });
    } else {
      alert(res.message || "Login failed.");
    }
  };

  const handleShopkeeperRegister = async () => {
    if (!form.otp || !form.shopkeeper_id || !form.aadhaar || !form.password) {
      return alert("OTP, Shopkeeper ID, Aadhaar and Password are required.");
    }
    setLoading(true);
    const res = await registerShopkeeper({
      shopkeeper_id: form.shopkeeper_id,
      aadhaar: form.aadhaar,
      password: form.password,
      shop_id: form.shop_id || null,
      otp: form.otp
    });

    if (res.includes("Successfully")) {
      const loginRes = await loginShopkeeper({ aadhaar: form.aadhaar, password: form.password });
      setLoading(false);
      if (loginRes.token && loginRes.user) {
        setCurrentUser(loginRes.user);
      } else {
        alert("Registration successful! Please login with your credentials.");
        setMode("shopkeeper-login");
        setOtpSent(false);
        setOtpVerified(false);
      }
    } else {
      setLoading(false);
      alert(res);
    }
  };

  const handleResetPassword = async () => {
    if (form.password.length < 6) return alert("Password must be at least 6 characters.");
    setLoading(true);
    const res = await resetPassword({ aadhaar: form.aadhaar, newPassword: form.password });
    setLoading(false);
    alert(res);
    if (res.includes("successfully")) setMode("auth");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setOtpVerified(false);
    setOtpSent(false);
  };

  // ---- RENDER DASHBOARDS ----
  if (currentUser) {
    if (currentUser.role === 'admin') return <AdminDashboard user={currentUser} onLogout={handleLogout} />;
    if (currentUser.role === 'shopkeeper') return <ShopkeeperDashboard user={currentUser} onLogout={handleLogout} shopId={currentUser.shop_id || 1} isAssistedMode={currentUser.isAssistedMode} />;
    if (currentUser.role === 'user') return <UserDashboard user={currentUser} onLogout={handleLogout} />;
  }

  // ---- RENDER LOGIN / REGISTER PAGE ----
  return (
    <div className="login-page">
      {/* Floating background shapes */}
      <div className="bg-shapes">
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>
        <div className="bg-shape shape-3"></div>
      </div>

      <div className="glass-card" style={mode === 'register' || mode === 'shopkeeper-register' ? { minWidth: '520px' } : {}}>
        <div className="brand-logo">🏪</div>
        <h1>Ration System</h1>
        <p className="brand-subtitle">Smart Ration Distribution Portal</p>

        {/* ===== LOGIN ===== */}
        {mode === "auth" && (
          <>
            <h3 className="form-title">Login to your account</h3>

            <div className="input-group">
              <span className="input-icon">🆔</span>
              <input name="aadhaar" className="input-field" placeholder="Aadhaar ID" onChange={handleChange} autoComplete="off" />
            </div>
            <div className="input-group">
              <span className="input-icon">🔒</span>
              <input name="password" type="password" className="input-field" placeholder="Password" onChange={handleChange} autoComplete="new-password" />
            </div>

            <div className="button-group">
              <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleLogin} disabled={loading}>
                {loading ? <span className="btn-spinner"></span> : 'Login'}
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '18px' }}>
              <p className="link-text" onClick={() => { setMode("register"); setOtpSent(false); setOtpVerified(false); }}>
                👤 User Register
              </p>
              <p className="link-text" onClick={() => setMode("forgot")}>
                🔑 Forgot Password?
              </p>
            </div>

            <div className="divider">
              <span>Shopkeeper Access</span>
            </div>
            <button
              className="btn btn-shopkeeper"
              style={{ width: '100%', fontSize: '13px', padding: '12px', marginBottom: '10px' }}
              onClick={() => setMode("shopkeeper-login")}
            >
              🏪 Shopkeeper Login
            </button>

            <button
              className="btn btn-shopkeeper-primary"
              style={{ width: '100%', fontSize: '13px', padding: '12px', marginBottom: '10px', background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)', boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)' }}
              onClick={() => setMode("assisted-login")}
            >
              🤝 Assisted Mode 
            </button>

          </>
        )}

        {/* ===== SHOPKEEPER LOGIN ===== */}
        {mode === "shopkeeper-login" && (
          <>
            <h3 className="form-title">🏪 Shopkeeper Login</h3>
            <p className="form-hint">Enter your credentials to access the Shopkeeper Dashboard</p>

            <div className="input-group">
              <span className="input-icon">🆔</span>
              <input name="aadhaar" className="input-field" placeholder="Aadhaar ID" onChange={handleChange} autoComplete="off" />
            </div>
            <div className="input-group">
              <span className="input-icon">🔒</span>
              <input name="password" type="password" className="input-field" placeholder="Password" onChange={handleChange} autoComplete="new-password" />
            </div>

            <div className="button-group">
              <button className="btn btn-shopkeeper-primary" style={{ width: '100%' }} onClick={handleShopkeeperLogin} disabled={loading}>
                {loading ? <span className="btn-spinner"></span> : '🏪 Login as Shopkeeper'}
              </button>
            </div>

            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <p className="link-text" onClick={() => setMode("shopkeeper-register")} style={{ color: '#10b981' }}>
                📝 New Shopkeeper? Register Here
              </p>
            </div>

            <p className="back-link" onClick={() => setMode("auth")}>
              ← Back to Main Login
            </p>
          </>
        )}

        {/* ===== ASSISTED LOGIN ===== */}
        {mode === "assisted-login" && (
          <>
            <h3 className="form-title">🤝 Assisted Mode (Kiosk)</h3>
            <p className="form-hint">Shopkeepers: Log in to operate the system on behalf of the beneficiaries.</p>

            <div className="input-group">
              <span className="input-icon">🆔</span>
              <input name="aadhaar" className="input-field" placeholder="Shopkeeper Aadhaar ID" onChange={handleChange} autoComplete="off" />
            </div>
            <div className="input-group">
              <span className="input-icon">🔒</span>
              <input name="password" type="password" className="input-field" placeholder="Password" onChange={handleChange} autoComplete="new-password" />
            </div>

            <div className="button-group">
              <button className="btn btn-shopkeeper-primary" style={{ width: '100%', background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)' }} onClick={handleAssistedLogin} disabled={loading}>
                {loading ? <span className="btn-spinner"></span> : '🤝 Enter Assisted Mode'}
              </button>
            </div>

            <p className="back-link" onClick={() => setMode("auth")}>
              ← Back to Main Login
            </p>
          </>
        )}

        {/* ===== SHOPKEEPER REGISTER ===== */}
        {mode === "shopkeeper-register" && (
          <>
            <h3 className="form-title">🏪 Shopkeeper Registration</h3>
            <p className="form-hint">Register as a shopkeeper and get assigned to a ration shop</p>

            <div className="input-group">
              <span className="input-icon">🔑</span>
              <input name="shopkeeper_id" className="input-field" placeholder="Authorized Shopkeeper ID" onChange={handleChange} autoComplete="off" disabled={otpSent} />
            </div>
            <div className="input-group">
              <span className="input-icon">🆔</span>
              <input name="aadhaar" className="input-field" placeholder="Aadhaar Number (12 digits)" onChange={handleChange} maxLength="12" autoComplete="off" disabled={otpSent} />
            </div>

            {!otpSent ? (
              <button className="btn btn-shopkeeper-primary" style={{ width: '100%', marginBottom: '15px' }} onClick={handleShopkeeperRequestOTP} disabled={loading}>
                {loading ? <span className="btn-spinner"></span> : 'Send OTP to Registered Mobile'}
              </button>
            ) : (
              <>
                <div className="input-group" style={{ border: otpVerified ? '2px solid #10b981' : '2px solid #fbbf24' }}>
                  <span className="input-icon">📩</span>
                  <input name="otp" className="input-field" placeholder="Enter 6-digit OTP" onChange={handleChange} maxLength="6" autoComplete="off" disabled={otpVerified} />
                </div>
                
                {!otpVerified ? (
                  <div className="button-group">
                    <button className="btn btn-shopkeeper-primary" style={{ width: '100%' }} onClick={handleShopkeeperVerifyOTP} disabled={loading}>
                      {loading ? <span className="btn-spinner"></span> : 'Verify OTP'}
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="input-group">
                      <span className="input-icon">🔒</span>
                      <input name="password" type="password" className="input-field" placeholder="Create Password" onChange={handleChange} autoComplete="new-password" />
                    </div>
                    <div className="button-group">
                      <button className="btn btn-shopkeeper-primary" style={{ width: '100%' }} onClick={handleShopkeeperRegister} disabled={loading}>
                        {loading ? <span className="btn-spinner"></span> : '🏪 Register & Save Details'}
                      </button>
                    </div>
                  </>
                )}
                
                <p className="link-text" style={{ textAlign: 'center', marginTop: '10px' }} onClick={() => { setOtpSent(false); setOtpVerified(false); }}>
                  Wrong details? Edit credentials
                </p>
              </>
            )}

            <div className="input-group">
              <span className="input-icon">📍</span>
              <select name="area" className="input-field" onChange={handleChange} style={{ paddingLeft: '40px' }}>
                <option value="">Select Area / Location (Optional)</option>
                {uniqueLocations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
            <div className="input-group">
              <span className="input-icon">🏪</span>
              <select name="shop_id" className="input-field" onChange={handleChange} style={{ paddingLeft: '40px' }}>
                <option value="">Select a Shop (Optional)</option>
                {availableShops
                  .filter(shop => !form.area || (shop.location && shop.location.toLowerCase() === form.area.toLowerCase().trim()))
                  .map(shop => (
                  <option key={shop.id} value={shop.id}>
                    {shop.name} — {shop.location || 'No location'}
                  </option>
                ))}
              </select>
            </div>

            <div className="button-group">
              <button className="btn btn-shopkeeper-primary" style={{ width: '100%' }} onClick={handleShopkeeperRegister} disabled={loading || !otpVerified}>
                {loading ? <span className="btn-spinner"></span> : '🏪 Register & Enter Dashboard'}
              </button>
            </div>

            <p className="back-link" onClick={() => setMode("shopkeeper-login")}>
              ← Back to Shopkeeper Login
            </p>
          </>
        )}

        {/* ===== USER REGISTER ===== */}
        {mode === "register" && (
          <>
            <h3 className="form-title">User Registration</h3>

            <div className="input-group">
              <span className="input-icon">🆔</span>
              <input name="aadhaar" className="input-field" placeholder="Aadhaar Number" onChange={handleChange} maxLength="12" autoComplete="off" disabled={otpSent} />
            </div>
            <div className="input-group">
              <span className="input-icon">🪪</span>
              <input name="ration_card_number" className="input-field" placeholder="Ration Card Number" onChange={handleChange} autoComplete="off" disabled={otpSent} />
            </div>

            {!otpSent ? (
              <button className="btn btn-primary" style={{ width: '100%', marginBottom: '15px' }} onClick={handleRequestOTP} disabled={loading}>
                {loading ? <span className="btn-spinner"></span> : 'Verify & Send OTP'}
              </button>
            ) : (
              <>
                <div className="input-group" style={{ border: otpVerified ? '2px solid #10b981' : '2px solid #3b82f6' }}>
                  <span className="input-icon">📩</span>
                  <input name="otp" className="input-field" placeholder="Enter 6-digit OTP" onChange={handleChange} maxLength="6" autoComplete="off" disabled={otpVerified} />
                </div>

                {!otpVerified ? (
                  <div className="button-group">
                    <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleVerifyOTP} disabled={loading}>
                      {loading ? <span className="btn-spinner"></span> : 'Verify OTP'}
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="input-group">
                      <span className="input-icon">🔒</span>
                      <input name="password" type="password" className="input-field" placeholder="Create Password" onChange={handleChange} autoComplete="new-password" />
                    </div>

                    <div className="button-group">
                      <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleRegister} disabled={loading}>
                        {loading ? <span className="btn-spinner"></span> : 'Register My Details'}
                      </button>
                    </div>
                  </>
                )}
                
                <p className="link-text" style={{ textAlign: 'center', marginTop: '10px' }} onClick={() => { setOtpSent(false); setOtpVerified(false); }}>
                  Edit Aadhaar / Ration Card
                </p>
              </>
            )}

            <p className="back-link" onClick={() => setMode("auth")}>
              ← Back to Login
            </p>
          </>
        )}

        {/* ===== FORGOT PASSWORD ===== */}
        {mode === "forgot" && (
          <>
            <h3 className="form-title">Reset Password</h3>

            <div className="input-group">
              <span className="input-icon">🆔</span>
              <input name="aadhaar" className="input-field" placeholder="Aadhaar ID" onChange={handleChange} autoComplete="off" />
            </div>
            <div className="input-group">
              <span className="input-icon">🔒</span>
              <input name="password" type="password" className="input-field" placeholder="New Password" onChange={handleChange} autoComplete="new-password" />
            </div>

            <div className="button-group">
              <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleResetPassword} disabled={loading}>
                {loading ? <span className="btn-spinner"></span> : 'Update Password'}
              </button>
            </div>

            <p className="back-link" onClick={() => setMode("auth")}>
              ← Back to Login
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default App;