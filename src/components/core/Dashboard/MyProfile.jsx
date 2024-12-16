import { RiEditBoxLine } from "react-icons/ri";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import IconBtn from "../../common/IconBtn";

export default function MyProfile() {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  return (
    <>
      <h1 className="mb-14 text-3xl font-medium text-richblack-5">My Profile</h1>
      <div className="flex items-center justify-between rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
        <div className="flex items-center gap-x-4">
          <img
            src={user?.image}
            alt={`profile-${user?.firstName}`}
            className="aspect-square w-[78px] rounded-full object-cover"
          />
          <div className="space-y-1">
            <p className="text-lg font-semibold text-richblack-5">
              {`${user?.firstName} ${user?.lastName}`}
            </p>
            <p className="text-sm text-richblack-300">{user?.email}</p>
          </div>
        </div>
        <IconBtn
          text="Edit"
          onclick={() => navigate("/dashboard/settings")}
        >
          <RiEditBoxLine />
        </IconBtn>
      </div>

      <div className="my-10 flex flex-col gap-y-10 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
        <div className="flex w-full items-center justify-between">
          <p className="text-lg font-semibold text-richblack-5">Personal Details</p>
          <IconBtn
            text="Edit"
            onclick={() => navigate("/dashboard/settings")}
          >
            <RiEditBoxLine />
          </IconBtn>
        </div>

        <div className="flex max-w-[500px] justify-between">
          <div className="flex flex-col gap-y-5">
            <div>
              <p className="mb-2 text-sm text-richblack-600">First Name</p>
              <p className="text-sm font-medium text-richblack-5">
                {user?.firstName || "Add First Name"}
              </p>
            </div>
            <div>
              <p className="mb-2 text-sm text-richblack-600">Email</p>
              <p className="text-sm font-medium text-richblack-5">
                {user?.email || "Add Email"}
              </p>
            </div>
            {user?.accountType === "Client" && (
              <>
                <div>
                  <p className="mb-2 text-sm text-richblack-600">Activity Level</p>
                  <p className="text-sm font-medium text-richblack-5">
                    {user?.activityLevel || "Add Activity Level"}
                  </p>
                </div>
                <div>
                  <p className="mb-2 text-sm text-richblack-600">Height</p>
                  <p className="text-sm font-medium text-richblack-5">
                    {user?.height ? `${user.height} cm` : "Add Height"}
                  </p>
                </div>
                <div>
                  <p className="mb-2 text-sm text-richblack-600">Weight</p>
                  <p className="text-sm font-medium text-richblack-5">
                    {user?.weight ? `${user.weight} kg` : "Add Weight"}
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="flex flex-col gap-y-5">
            <div>
              <p className="mb-2 text-sm text-richblack-600">Last Name</p>
              <p className="text-sm font-medium text-richblack-5">
                {user?.lastName || "Add Last Name"}
              </p>
            </div>
            <div>
              <p className="mb-2 text-sm text-richblack-600">Gender</p>
              <p className="text-sm font-medium text-richblack-5">
                {user?.gender || "Add Gender"}
              </p>
            </div>
            {user?.accountType === "Client" && (
              <>
                <div>
                  <p className="mb-2 text-sm text-richblack-600">Age</p>
                  <p className="text-sm font-medium text-richblack-5">
                    {user?.age || "Add Age"}
                  </p>
                </div>
                <div>
                  <p className="mb-2 text-sm text-richblack-600">BMI</p>
                  <p className="text-sm font-medium text-richblack-5">
                    {user?.bmi || "Add BMI"}
                  </p>
                </div>
                <div>
                  <p className="mb-2 text-sm text-richblack-600">
                    Daily Required Calories
                  </p>
                  <p className="text-sm font-medium text-richblack-5">
                    {user?.dailyRequiredCalories
                      ? `${user.dailyRequiredCalories} calories`
                      : "Add Calories Required"}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
