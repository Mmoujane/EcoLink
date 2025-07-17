import SideBar from "@/app/components/sideBar";
import Header from "@/app/components/Dachboardheader";
import Image from "next/image";
import React, {use} from 'react';
import ImpactContainer from "@/app/components/impactContainer";
import ProofForm from "@/app/components/ProofForm";
import SubmissionCardContainer from "@/app/components/submissionCardContainer";
import ReportForm from "@/app/components/reportForm";


export default function Home({ params }: { params: Promise<{ profileId: string }> }) {

    const resolvedParams = use(params);
  return (
    <div className="flex h-screen">
      <SideBar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header name={resolvedParams.profileId}/>
        <main className="flex-1 overflow-y-auto p-6">
            <ReportForm />
        </main>
      </div>
    </div>
  );
}
