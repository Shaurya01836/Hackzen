"use client";

import { useState, useEffect } from "react"
import { useAuth } from "../../context/AuthContext"
import HackZenDashboard from "./Dashbord";

export default function Page() {
  return (
    <>
      <HackZenDashboard />
    </>
  );
}
