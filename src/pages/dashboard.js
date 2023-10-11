import React from "react";
import SetRubrics from "@/components/setrubrics";

function Dashboard() {
  return (
    <>
      <div className="bg-neutral-950">
        <h1>Welcome to the Dashboard</h1>
        <p>
          This is a simple page wrapped in the <></> tag.
        </p>

        <SetRubrics />
      </div>
    </>
  );
}

export default Dashboard;
