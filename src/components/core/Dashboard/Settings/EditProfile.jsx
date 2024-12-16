import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "../../../../services/operations/SettingsAPI";
import IconBtn from "../../../common/IconBtn";

const genders = ["male", "female"];
const activityLevels = [
  "sedentary",
  "light",
  "moderate",
  "active",
  "very active",
];

export default function EditProfile() {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  console.log("edit profile user", user);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const submitProfileForm = async (data) => {
    try {
      dispatch(updateProfile(token, data));
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(submitProfileForm)}>
        {/* Profile Information */}
        <div className="my-10 flex flex-col gap-y-6 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
          <h2 className="text-lg font-semibold text-richblack-5">
            Profile Information
          </h2>
          <div className="flex flex-col gap-5 lg:flex-row ">
            <div className="flex flex-col gap-2 lg:w-[48%]">
              <label
                htmlFor="firstName"
                className="lable-style text-richblack-5"
              >
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                placeholder="Enter first name"
                className="form-style p-2 border rounded-md"
                {...register("firstName", { required: true })}
                defaultValue={user?.firstName}
              />
              {errors.firstName && (
                <span className="-mt-1 text-[12px] text-yellow-100">
                  Please enter your first name.
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2 lg:w-[48%]">
              <label
                htmlFor="lastName"
                className="lable-style text-richblack-5"
              >
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                placeholder="Enter first name"
                className="form-style p-2 border rounded-md"
                {...register("lastName", { required: true })}
                defaultValue={user?.lastName}
              />
              {errors.lastName && (
                <span className="-mt-1 text-[12px] text-yellow-100">
                  Please enter your last name.
                </span>
              )}
            </div>
          </div>

          {/* Age, Height, Weight, and Activity Level */}
          <div className="flex flex-col gap-5 lg:flex-row">
            <div className="flex flex-col gap-2 lg:w-[48%]">
              <label htmlFor="age" className="lable-style text-richblack-5">
                Age
              </label>
              <input
                type="number"
                name="age"
                id="age"
                placeholder="Enter age"
                className="form-style p-2 border rounded-md"
                {...register("age", { required: true })}
                defaultValue={user?.age}
              />
              {errors.age && (
                <span className="-mt-1 text-[12px] text-yellow-100">
                  Please enter your age.
                </span>
              )}
            </div>

            {/* Gender Field */}

            <div className="flex flex-col gap-2 lg:w-[48%]">
              <label htmlFor="gender" className="lable-style text-richblack-5">
                Gender
              </label>
              <select
                name="gender"
                id="gender"
                className="form-style p-2 border rounded-md"
                {...register("gender", { required: true })}
                defaultValue={user?.gender}
              >
                {genders.map((gender, index) => (
                  <option key={index} value={gender}>
                    {gender}
                  </option>
                ))}
              </select>
              {errors.gender && (
                <span className="-mt-1 text-[12px] text-yellow-100">
                  Please select your gender.
                </span>
              )}
            </div>
          </div>

          {user.accountType === "Client" && (
            <div className="flex flex-col gap-5 lg:flex-row">
              {/* Weight Input */}
              <div className="flex flex-col gap-2 lg:w-[48%]">
                <label
                  htmlFor="weight"
                  className="label-style text-richblack-5"
                >
                  Weight (kg)
                </label>
                <input
                  type="number"
                  name="weight"
                  id="weight"
                  placeholder="Enter weight"
                  className="form-style p-2 border rounded-md"
                  {...register("weight", {
                    required: "Weight is required.",
                    min: {
                      value: 1,
                      message: "Weight must be greater than 0.",
                    },
                  })}
                  defaultValue={user?.weight || ""}
                />
                {errors.weight && (
                  <span className="-mt-1 text-[12px] text-yellow-100">
                    {errors.weight.message}
                  </span>
                )}
              </div>

              {/* Activity Level Select */}
              <div className="flex flex-col gap-2 lg:w-[48%]">
                <label
                  htmlFor="activityLevel"
                  className="label-style text-richblack-5"
                >
                  Activity Level
                </label>
                <select
                  name="activityLevel"
                  id="activityLevel"
                  className="form-style p-2 border rounded-md"
                  {...register("activityLevel", {
                    required: "Activity Level is required.",
                  })}
                  defaultValue={user?.activityLevel || ""}
                >
                  {activityLevels.map((level, index) => (
                    <option key={index} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
                {errors.activityLevel && (
                  <span className="-mt-1 text-[12px] text-yellow-100">
                    {errors.activityLevel.message}
                  </span>
                )}
              </div>
              {/* Height Input */}
              <div className="flex flex-col gap-5 lg:flex-row">
                <div className="flex flex-col gap-2 lg:w-[48%]">
                  <label
                    htmlFor="height"
                    className="label-style text-richblack-5"
                  >
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    name="height"
                    id="height"
                    placeholder="Enter height"
                    className="form-style p-2 border rounded-md"
                    {...register("height", {
                      required: "Height is required.",
                      min: {
                        value: 1,
                        message: "Height must be greater than 0.",
                      },
                    })}
                    defaultValue={user?.height || ""}
                  />
                  {errors.height && (
                    <span className="-mt-1 text-[12px] text-yellow-100">
                      {errors.height.message}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={() => navigate("/dashboard/my-profile")}
            className="cursor-pointer rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50"
          >
            Cancel
          </button>
          <IconBtn type="submit" text="Save" />
        </div>
      </form>
    </>
  );
}
