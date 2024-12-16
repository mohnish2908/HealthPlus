import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { changePassword } from "../../../../services/operations/SettingsAPI";
import IconBtn from "../../../common/IconBtn";

export default function UpdatePassword() {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.profile); // Get user data
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const submitPasswordForm = async (data) => {
    // Add email to the data being submitted
    const formData = {
      ...data,
      email: user.email,  // Include email in the form submission
    };

    try {
      await changePassword(token, formData);
    } catch (error) {
      console.error("ERROR MESSAGE - ", error.message);
    }
  };

  const togglePasswordVisibility = (field) =>
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));

  return (
    <div>
      <form onSubmit={handleSubmit(submitPasswordForm)}>
        <div className="my-10 flex flex-col gap-y-6 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
          <h2 className="text-lg font-semibold text-richblack-5">Update Password</h2>
          
          

          <div className="flex flex-col gap-5 lg:flex-row">
            {/* Current Password */}
            <div className="relative flex flex-col gap-2 lg:w-[48%]">
              <label htmlFor="oldPassword" className="label-style text-richblack-5">
                Current Password
              </label>
              <input
                type={showPassword.old ? "text" : "password"}
                id="oldPassword"
                placeholder="Enter Current Password"
                className="form-style p-1.5 border rounded-md"
                {...register("oldPassword", { required: "Current password is required" })}
              />
              <span
                onClick={() => togglePasswordVisibility("old")}
                className="absolute right-3 top-[38px] z-[10] cursor-pointer"
              >
                {showPassword.old ? (
                  <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                ) : (
                  <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                )}
              </span>
              {errors.oldPassword && (
                <span className="-mt-1 text-[12px] text-yellow-100">{errors.oldPassword.message}</span>
              )}
            </div>

            {/* New Password */}
            <div className="relative flex flex-col gap-2 lg:w-[48%]">
              <label htmlFor="newPassword" className="label-style text-richblack-5">
                New Password
              </label>
              <input
                type={showPassword.new ? "text" : "password"}
                id="newPassword"
                placeholder="Enter New Password"
                className="form-style  p-1.5 border rounded-md"
                {...register("newPassword", {
                  required: "New password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              <span
                onClick={() => togglePasswordVisibility("new")}
                className="absolute right-3 top-[38px] z-[10] cursor-pointer"
              >
                {showPassword.new ? (
                  <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                ) : (
                  <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                )}
              </span>
              {errors.newPassword && (
                <span className="-mt-1 text-[12px] text-yellow-100">{errors.newPassword.message}</span>
              )}
            </div>

            {/* Confirm Password */}
            <div className="relative flex flex-col gap-2 lg:w-[48%]">
              <label htmlFor="confirmPassword" className="label-style text-richblack-5">
                Confirm Password
              </label>
              <input
                type={showPassword.confirm ? "text" : "password"}
                id="confirmPassword"
                placeholder="Confirm New Password"
                className="form-style p-1.5 border rounded-md"
                {...register("confirmPassword", {
                  required: "Please confirm your new password",
                  validate: (value) => value === watch("newPassword") || "Passwords do not match",
                })}
              />
              <span
                onClick={() => togglePasswordVisibility("confirm")}
                className="absolute right-3 top-[38px] z-[10] cursor-pointer"
              >
                {showPassword.confirm ? (
                  <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                ) : (
                  <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                )}
              </span>
              {errors.confirmPassword && (
                <span className="-mt-1 text-[12px] text-yellow-100">{errors.confirmPassword.message}</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => navigate("/dashboard/my-profile")}
            className="cursor-pointer rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50"
          >
            Cancel
          </button>
          <IconBtn type="submit" text="Update" />
        </div>
      </form>
    </div>
  );
}