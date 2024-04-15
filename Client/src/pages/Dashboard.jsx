import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashProfile from "../components/DashProfile.jsx";
import DashSideBar from "../components/DashSideBar.jsx";

export default function Dashboard() {
  const location = useLocation(); //It is used to access the current location of object in our component.
  const [tab, setTab] = useState("");

  useEffect(() => {
    // In this case, the UseEffect should only run when the location.search value changes.

    const urlParams = new URLSearchParams(location.search); // We create a new object of 'URLSearchParams' which is used to parse and manipulate URL query parameters, we passed 'location.search' URL string as parameter.
    const tabFromUrl = urlParams.get("tab"); // If the URL contains a parameter named "tab", its value will be returned , If the URL doesn't contain a parameter named "tab", It will return null.

    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, location.search);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
        {/*------------------------------Sidebar------------------------- */}
        <DashSideBar />
      </div>
      {/*------------------------------Profile------------------------- */}
      {tab === "profile" && <DashProfile />}{" "}
      {/*It will only 'DashProfile' when tab===profile*/}
    </div>
  );
}
