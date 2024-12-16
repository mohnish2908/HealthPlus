import ChangeProfilePicture from "./ChangeProfilePicture";
import DeleteAccount from "./DeleteAccount";
import { setLoading } from "../../../../slices/profileSlice";
import EditProfile from "./EditProfile";
import UpdatePassword from "./UpdatePassword";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import "../../../../App.css";

export default function Settings() {
  const { loading } = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  return (
    <section className="settings-container">
      {loading ? (
        <div className="loader" aria-label="Loading"></div>
      ) : (
        <div>
          <h1 className="mb-14 text-3xl font-medium text-richblack-5">
            Edit Profile
          </h1>
          <ChangeProfilePicture />
          <EditProfile />
          <UpdatePassword />
          <DeleteAccount />
        </div>
      )}
    </section>
  );
}
