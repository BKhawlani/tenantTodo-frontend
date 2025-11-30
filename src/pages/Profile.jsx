import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { 
  FiEdit2, 
  FiCheck, 
  FiX, 
  FiLock, 
  FiUser, 
  FiMail, 
  FiCamera,
  FiArrowLeft,
  FiAlertCircle,
  FiCheckCircle,
  FiEye,
  FiEyeOff
} from "react-icons/fi";
import "./Profile.css";

function Profile() {
  const [user, setUser] = useState(null);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [alert, setAlert] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);

  // States for individual field editing
  const [editingName, setEditingName] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  
  // State for password dialog alert
  const [passwordAlert, setPasswordAlert] = useState({ type: "", text: "" });

  // States for password visibility
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const res = await api.get("/auth/me");
      const u = res.data.user;

      setUser(u);
      setName(u.name || "");
      setEmail(u.email || "");

    } catch (err) {
      setAlert({ type: "error", text: "Failed to load profile data." });
    }
  };

  // دالة مساعدة للحصول على رابط الصورة
  const getAvatarUrl = (avatarData) => {
    if (!avatarData) return "https://icons.veryicon.com/png/o/miscellaneous/rookie-official-icon-gallery/225-default-avatar.png";
    
    if (typeof avatarData === 'string') {
      return avatarData;
    }
    
    if (avatarData.url) {
      return avatarData.url;
    }
    
    if (avatarData.secure_url) {
      return avatarData.secure_url;
    }
    
    return "https://icons.veryicon.com/png/o/miscellaneous/rookie-official-icon-gallery/225-default-avatar.png";
  };

  // ------------- Avatar Upload ----------------
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setAlert({ type: "error", text: "Please select an image file." });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setAlert({ type: "error", text: "Image size should be less than 5MB." });
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      setAvatarLoading(true);
      const res = await api.put("/profile/upload-avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUser(res.data.user);
      setAlert({ type: "success", text: "Avatar updated successfully!" });

      setTimeout(() => setAlert({ type: "", text: "" }), 3000);

    } catch (err) {
      setAlert({
        type: "error",
        text: err.response?.data?.error || "Upload failed. Please try again.",
      });
    } finally {
      setAvatarLoading(false);
      e.target.value = '';
    }
  };

  // ---------------- Update Individual Fields ----------------
  const handleUpdateName = async () => {
    if (!name.trim()) {
      setAlert({ type: "error", text: "Name cannot be empty." });
      return;
    }

    if (name.trim() === user.name) {
      setEditingName(false);
      return;
    }

    setLoading(true);
    try {
      // استخدم endpoint منفصل لتحديث الاسم فقط
      const res = await api.put("/profile/update-name", {
        name: name.trim(),
      });

      setUser(res.data.user);
      setEditingName(false);

      setAlert({ type: "success", text: "Name updated successfully!" });

      setTimeout(() => setAlert({ type: "", text: "" }), 2000);

    } catch (err) {
      // إذا كان السيرفر لا يدعم endpoint منفصل، استخدم ال endpoint الأساسي
      if (err.response?.status === 404) {
        try {
          const res = await api.put("/profile/update", {
            name: name.trim(),
            email: user.email // أرسل الإيميل الحالي أيضاً
          });

          setUser(res.data.user);
          setEditingName(false);
          setAlert({ type: "success", text: "Name updated successfully!" });
        } catch (secondErr) {
          setAlert({
            type: "error",
            text: secondErr.response?.data?.message || "Failed to update name.",
          });
        }
      } else {
        setAlert({
          type: "error",
          text: err.response?.data?.message || "Failed to update name.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEmail = async () => {
    if (!email.trim()) {
      setAlert({ type: "error", text: "Email cannot be empty." });
      return;
    }

    if (email.trim() === user.email) {
      setEditingEmail(false);
      return;
    }

    // تحقق من صيغة الإيميل
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setAlert({ type: "error", text: "Please enter a valid email address." });
      return;
    }

    setLoading(true);
    try {
      // استخدم endpoint منفصل لتحديث الإيميل فقط
      const res = await api.put("/profile/update-email", {
        email: email.trim(),
      });

      setUser(res.data.user);
      setEditingEmail(false);

      setAlert({ type: "success", text: "Email updated successfully!" });

      setTimeout(() => setAlert({ type: "", text: "" }), 2000);

    } catch (err) {
      // إذا كان السيرفر لا يدعم endpoint منفصل، استخدم ال endpoint الأساسي
      if (err.response?.status === 404) {
        try {
          const res = await api.put("/profile/update", {
            name: user.name, // أرسل الاسم الحالي أيضاً
            email: email.trim()
          });

          setUser(res.data.user);
          setEditingEmail(false);
          setAlert({ type: "success", text: "Email updated successfully!" });
        } catch (secondErr) {
          setAlert({
            type: "error",
            text: secondErr.response?.data?.message || "Failed to update email.",
          });
        }
      } else {
        setAlert({
          type: "error",
          text: err.response?.data?.message || "Failed to update email.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Change Password ----------------
  const validatePassword = (password) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return regex.test(password);
};

const handlePasswordChange = async () => {
  if (!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
    setPasswordAlert({ type: "error", text: "Fill all password fields." });
    return;
  }

  if (newPassword !== confirmPassword) {
    setPasswordAlert({ type: "error", text: "New passwords do not match." });
    return;
  }

  if (!validatePassword(newPassword)) {
    setPasswordAlert({ 
      type: "error", 
      text: "Password must be at least 8 characters and include uppercase, lowercase letters, and a number." 
    });
    return;
  }

  setLoading(true);

  try {
    await api.put("/profile/update-password", {
      currentPassword,
      newPassword,
    });

    setPasswordAlert({ type: "success", text: "Password updated successfully!" });

    setTimeout(() => {
      setShowPasswordDialog(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordAlert({ type: "", text: "" });
    }, 1500);

  } catch (err) {
    setPasswordAlert({
      type: "error",
      text: err.response?.data?.message || "Failed to update password.",
    });
  } finally {
    setLoading(false);
  }
};

  // ---------------- Cancel Individual Edits ----------------
  const handleCancelNameEdit = () => {
    setName(user.name || "");
    setEditingName(false);
  };

  const handleCancelEmailEdit = () => {
    setEmail(user.email || "");
    setEditingEmail(false);
  };

  // ---------------- Back to Dashboard ----------------
  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  // ---------------- Loading State ----------------
  if (!user) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">

        {/* Back Button */}
        <button className="back-to-dashboard-btn" onClick={handleBackToDashboard}>
          <FiArrowLeft className="btn-icon" />
          Back to Dashboard
        </button>
      
        <div className="profile-header">
          <h2>My Profile</h2>
          <p>Manage your account</p>
        </div>

        {/* MESSAGE */}
        {alert.text && (
          <div className={`profile-message ${alert.type}`}>
            <span className="message-icon">
              {alert.type === "success" ? <FiCheckCircle /> : <FiAlertCircle />}
            </span>
            {alert.text}
          </div>
        )}

        {/* Avatar Section */}
        <div className="profile-avatar-section">
          <div className="avatar-container">
            <img
              src={getAvatarUrl(user.avatar)}
              alt="avatar"
              className="profile-avatar"
              onError={(e) => {
                e.target.src = "https://icons.veryicon.com/png/o/miscellaneous/rookie-official-icon-gallery/225-default-avatar.png";
              }}
            />
            {avatarLoading && (
              <div className="avatar-overlay">
                <div className="small-spinner"></div>
              </div>
            )}
          </div>
          
          <label className="avatar-upload-btn">
            <input 
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              disabled={avatarLoading}
            />
            <FiCamera className="btn-icon" />
            {avatarLoading ? "Uploading..." : "Edit Photo"}
          </label>
        </div>

        {/* Profile Information */}
        <div className="profile-info-section">
          {/* Name Field */}
         <div className="profile-field">
  <div className="profile-label-container">
    <label className="profile-label">
      <FiUser className="field-icon" />
      Name
    </label>
  </div>
  
  {editingName ? (
    <div className="field-edit-container">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="profile-input"
        disabled={loading}
        autoFocus
        placeholder="Enter your name"
      />
      <div className="field-edit-actions">
        <button 
          className="field-save-btn" 
          onClick={handleUpdateName}
          disabled={loading}
          title="Save name"
        >
          <FiCheck />
        </button>
        <button
          className="field-cancel-btn"
          onClick={handleCancelNameEdit}
          disabled={loading}
          title="Cancel"
        >
          <FiX />
        </button>
      </div>
    </div>
  ) : (
    <div className="profile-value-container">
      <div className="profile-value">{user.name}</div>
      <button 
        className="edit-field-btn"
        onClick={() => setEditingName(true)}
        title="Edit name"
        disabled={loading}
      >
        <FiEdit2 />
      </button>
    </div>
  )}
</div>
          {/* Email Field */}
          <div className="profile-field">
            <div className="profile-label-container">
              <label className="profile-label">
                <FiMail className="field-icon" />
                Email
              </label>
              
            </div>
            
            {editingEmail ? (
              <div className="field-edit-container">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="profile-input"
                  disabled={loading}
                  autoFocus
                  placeholder="Enter your email"
                />
                <div className="field-edit-actions">
                  <button 
                    className="field-save-btn" 
                    onClick={handleUpdateEmail}
                    disabled={loading}
                    title="Save email"
                  >
                    <FiCheck />
                  </button>
                  <button
                    className="field-cancel-btn"
                    onClick={handleCancelEmailEdit}
                    disabled={loading}
                    title="Cancel"
                  >
                    <FiX />
                  </button>
                </div>
              </div>
            ) : (
              <div className="profile-value">{user.email}</div>
              
            )}
            {!editingEmail ? (
                <button 
                  className="edit-field-btn"
                  onClick={() => setEditingEmail(true)}
                  title="Edit email"
                  disabled={loading}
                >
                  <FiEdit2 />
                </button>
              ) : null}
          </div>

          {/* Password Field */}
          <div className="profile-field">
            <div className="profile-label-container">
              <label className="profile-label">
                <FiLock className="field-icon" />
                Password
              </label>
        
            </div>
            <div className="profile-value password-field">
              ••••••••
            </div>
                  <button 
                className="edit-field-btn"
                onClick={() => setShowPasswordDialog(true)}
                title="Change password"
                disabled={loading}
              >
                <FiEdit2 />
              </button>
          </div>
        </div>

        {/* Password Change Dialog */}
        {showPasswordDialog && (
          <div className="dialog-overlay">
            <div className="dialog-content">
              <div className="dialog-header">
                <h3>
                  <FiLock className="dialog-icon" />
                  Change Password
                </h3>
                <button 
                  className="dialog-close"
                  onClick={() => {
                    setShowPasswordDialog(false);
                    setPasswordAlert({ type: "", text: "" });
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                  }}
                  disabled={loading}
                >
                  <FiX />
                </button>
              </div>
              
              <div className="dialog-body">
                {/* Password Alert inside Dialog */}
                {passwordAlert.text && (
                  <div className={`profile-message ${passwordAlert.type}`}>
                    <span className="message-icon">
                      {passwordAlert.type === "success" ? <FiCheckCircle /> : <FiAlertCircle />}
                    </span>
                    {passwordAlert.text}
                  </div>
                )}

                <div className="form-group">
                  <label>Current Password</label>
                  <div className="password-input-container">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="form-input"
                      disabled={loading}
                      placeholder="Enter current password"
                    />
                    <button 
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label>New Password</label>
                  <div className="password-input-container">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="form-input"
                      disabled={loading}
                      placeholder="Enter new password (min. 6 characters)"
                    />
                    <button 
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label>Confirm New Password</label>
                  <div className="password-input-container">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="form-input"
                      disabled={loading}
                      placeholder="Confirm new password"
                    />
                    <button 
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="dialog-actions">
                <button 
                  className="dialog-btn primary" 
                  onClick={handlePasswordChange}
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Password"}
                </button>
                <button
                  className="dialog-btn secondary"
                  onClick={() => {
                    setShowPasswordDialog(false);
                    setPasswordAlert({ type: "", text: "" });
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                  }}
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Profile;