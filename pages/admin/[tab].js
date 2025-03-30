import { useState, useEffect } from "react";
import Layout from "../../components/general/Layout";
import { useRouter } from "next/router";

import { CalendarIcon } from "@heroicons/react/24/outline";
import dynamic from "next/dynamic";

export default function Tab() {
  const [currentPage, setCurrentPage] = useState();
  const router = useRouter();

  const [pillTabs, setPillTabs] = useState([
    {
      name: "Operations",
      id: 2,
      code: "delete-product",
      href: "/admin/delete-product",
      icon: CalendarIcon,
      current: false,
    },
    {
      name: "Dashboard",
      id: 3,
      code: "dashboard",
      href: "/admin/dashboard",
      icon: CalendarIcon,
      current: false,
    },
  ]);

  useEffect(() => {
    const { tab } = router.query;

    const updatedTabs = pillTabs.map((pill) => {
      if (tab == pill.code) {
        return { ...pill, current: true };
      } else {
        return { ...pill, current: false };
      }
    });

    setPillTabs(updatedTabs);

    if (tab == "delete-product") {
      const DeleteProduct = dynamic(() =>
        import("../../components/dash/DeleteProduct")
      );
      setCurrentPage(<DeleteProduct />);
    } else if (tab == "dashboard") {
      const Dashboard = dynamic(() =>
        import("../../components/dash/Dashboard")
      );
      setCurrentPage(<Dashboard />);
    }
  }, [router]);

  return (
    <Layout>
      <div className="bg-white px-2  shadow-sm sticky top-0 z-40"></div>

      {currentPage}
    </Layout>
  );
}
