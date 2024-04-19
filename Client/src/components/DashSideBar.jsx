import { Sidebar } from "flowbite-react";
import { HiUser, HiArrowSmRight } from "react-icons/hi";
import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";

export default function DashSideBar() {
  const location = useLocation(); //It is used to access the current location of object in our component.
  const [tab, setTab] = useState("");

  useEffect(() => {
    // In this case, the UseEffect should only run when the location.search value changes.

    const urlParams = new URLSearchParams(location.search); // We create a new object of 'URLSearchParams' which is used to parse and manipulate URL query parameters, we passed 'location.search' URL string as parameter.
    const tabFromUrl = urlParams.get("tab"); // If the URL contains a parameter named "tab", its value will be returned , If the URL doesn't contain a parameter named "tab", It will return null.

    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              active={tab === "profile"}
              icon={HiUser}
              label={"User"}
              labelColor="dark"
              as="div"
            >
              Profile
            </Sidebar.Item>
          </Link>

          <Sidebar.Item icon={HiArrowSmRight} className="cursor-pointer">
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
