import { useState } from "react";
import { toast } from "react-toastify";
import "./ProfileModal.css";

import {
  uploadProfilePic,
  getProfilePicUrl,
  changeStudentPassword
} from "../services/studentServices";

function ProfileModal({ user, onClose }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [imgRefresh, setImgRefresh] = useState(Date.now());

  /* ================= CHANGE PASSWORD ================= */

  const changePassword = async () => {
    if (!newPassword || !confirmPassword) {
      toast.warn("All fields are required");
      return;
    }

    const result = await changeStudentPassword(
      user.token,
      newPassword,
      confirmPassword
    );

    if (result.status === "success") {
      toast.success("Password changed");
      onClose();
    } else {
      toast.error(result.error || "Password change failed");
    }
  };

  /* ================= UPLOAD PROFILE PIC ================= */

  const uploadPic = async () => {
    if (!selectedFile) {
      toast.warn("Select an image first");
      return;
    }

    if (selectedFile.size > 200 * 1024) {
      toast.error("Image must be under 200 KB");
      return;
    }

    if (!["image/jpeg", "image/png"].includes(selectedFile.type)) {
      toast.error("Only JPG or PNG images allowed");
      return;
    }

    const result = await uploadProfilePic(user.token, selectedFile);

    if (result.status === "success") {
      toast.success("Profile picture updated");
      setImgRefresh(Date.now());
    } else {
      toast.error(result.error || "Upload failed");
    }
  };

  return (
    <div className="profile-overlay" onClick={onClose}>
      <div
        className="profile-popup"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="profile-header">
          <h6 className="mb-0">Profile</h6>
          <button className="btn-close" onClick={onClose}></button>
        </div>

        {/* BODY */}
        <div className="profile-body text-center">

          {user.role === "student" && (
            <>
              <img
                src={`${getProfilePicUrl(user.email)}?t=${imgRefresh}`}
                alt="Profile"
                className="profile-avatar mb-3"
              />

              <input
                type="file"
                className="form-control mb-2"
                accept="image/*"
                onChange={(e) => setSelectedFile(e.target.files[0])}
              />

              <button
                className="btn btn-outline-primary btn-sm mb-3"
                onClick={uploadPic}
              >
                Upload Photo
              </button>
            </>
          )}

          <div className="profile-info">
            <p><strong>Role:</strong> {user.role}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>

          {user.role === "student" && (
            <>
              <hr />
              <h6 className="text-start">Change Password</h6>

              <input
                type="password"
                className="form-control mb-2"
                placeholder="New Password"
                onChange={(e) => setNewPassword(e.target.value)}
              />

              <input
                type="password"
                className="form-control mb-2"
                placeholder="Confirm Password"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <button
                className="btn btn-primary w-100"
                onClick={changePassword}
              >
                Change Password
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileModal;
