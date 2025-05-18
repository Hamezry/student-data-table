import { useRef, useImperativeHandle, forwardRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

type Result = {
  coursecode: string;
  title: string;
  credit_unit: number;
  grade: string;
  total_point: number;
};

type Cummulative = {
  unts: number;
  untd: number;
  gpts: number;
  gptd: number;
  gpats: number;
  gpatd: number;
  remarks: string;
};

type StudentData = {
  id: number;
  surname: string;
  firstname: string;
  age: number;
  gender: string;
  level: string;
  state: string;
  reg_no: string;
  session: string;
  result: Result[];
  cummulative: Cummulative;
};

type Props = {
  studentData: StudentData;
  logo: string;
  profilePicture: string;
};

export type StudentResultPdfHandle = {
  downloadPdf: () => void;
};

const StudentResultPdf = forwardRef<StudentResultPdfHandle, Props>(
  ({ studentData, logo, profilePicture }, ref) => {
    const printRef = useRef<HTMLDivElement>(null);

    const handleDownloadPdf = async () => {
      if (!printRef.current) return;

      // Use dynamic scale based on window width for better responsiveness
      const scale = window.innerWidth < 600 ? 1 : 2;

      const canvas = await html2canvas(printRef.current, {
        scale: scale,
        useCORS: true, // Important for cross-origin images
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "pt", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${studentData.firstname}_${studentData.surname}_Result.pdf`);
    };

    useImperativeHandle(ref, () => ({
      downloadPdf: handleDownloadPdf,
    }));

    return (
      <div className="p-4 text-xs bg-gray-100">
        {/* Sticky header with button */}
        <div className="sticky top-0 bg-gray-100 z-10 py-4">
          <button
            onClick={handleDownloadPdf}
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-500 transition"
          >
            Download Result
          </button>
        </div>

        {/* Printable content */}
        <div
          ref={printRef}
          className="p-6 bg-white border border-gray-300 rounded shadow max-w-3xl mx-auto"
          style={{
            fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
            /* Add media queries if needed for enhanced responsiveness */
          }}
        >
          {/* Header - Logo, College Info, Profile Picture */}
          <div className="flex  items-center justify-between mb-6 ">
            <img
              src={logo}
              alt="Logo"
              className="h-24 w-24 "
              crossOrigin="anonymous"
            />

            <div className="text-center  w-full md:w-auto">
              <h1 className="text-base font-bold text-[#4F4F4F] py-2 uppercase">
                FREMONT COLLEGE OF EDUCATION
              </h1>
              <p className="text-xs text-[#4F4F4F]">
                No.5 Raymond Osuman Street, PMB 2191 Maitama, Abuja, Nigeria.
              </p>
              <p className="text-xl font-semibold text-[#333333] mt-1">
                Post Graduate Diploma in Education
              </p>
              <p className="text-xs text-[#333333] font-semibold mt-1">
                Student First Semester Statement Of Result
              </p>
            </div>

            <img
              src={profilePicture}
              alt="Profile"
              className="h-24 w-24 object-cover"
              crossOrigin="anonymous"
            />
          </div>

          {/* Student Info */}
          <div className="w-full flex  justify-between items-center mb-10 text-gray-800 px-2 ">
            <div className="flex flex-col gap-3">
              <p>
                <b>Name:</b> &nbsp; {studentData.firstname}{" "}
                {studentData.surname}
              </p>
              <p>
                <b>Level:</b> &nbsp;{studentData.level}
              </p>
            </div>
            <div className="flex flex-col gap-3 mt-4 md:mt-0">
              <p>
                <b>Reg No:</b> &nbsp;{studentData.reg_no}
              </p>
              <p>
                <b>Session:</b> &nbsp;{studentData.session}
              </p>
            </div>
          </div>

          {/* Results Table */}
          <div className="overflow-x-auto mb-12">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr>
                  <th className="px-3 py-2 bg-[#0D7590] text-white">S/N</th>
                  <th className="px-3 py-2 bg-[#0D7590] text-white">
                    Course Code
                  </th>
                  <th className="px-3 py-2 bg-[#0D7590] text-white">
                    Course Title
                  </th>
                  <th className="px-3 py-2 bg-[#0D7590] text-white">Unit</th>
                  <th className="px-3 py-2 bg-[#0D7590] text-white">Grade</th>
                  <th className="px-3 py-2 bg-[#0D7590] text-white">
                    Total Point
                  </th>
                </tr>
              </thead>
              <tbody>
                {studentData.result.map(
                  (
                    { coursecode, title, credit_unit, grade, total_point },
                    i
                  ) => (
                    <tr
                      key={coursecode + i}
                      className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-3 py-4 text-center">{i + 1}</td>
                      <td className="px-3 py-4">{coursecode}</td>
                      <td className="px-3 py-4">{title}</td>
                      <td className="px-3 py-4 text-center">{credit_unit}</td>
                      <td className="px-3 py-4 text-center">{grade}</td>
                      <td className="px-3 py-4 text-center">{total_point}</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>

          {/* Cumulative Table */}
          <div className="w-[70%] mb-3">
            <table className="w-full border-collapse mb-4 text-left">
              <thead>
                <tr>
                  {["UNTS", "UNTD", "GPTS", "GPTD", "GPATS", "GPATD"].map(
                    (head) => (
                      <th
                        key={head}
                        className="px-3 py-2 bg-[#0D7590] text-white"
                      >
                        {head}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-3 py-4">{studentData.cummulative.unts}</td>
                  <td className="px-3 py-4">{studentData.cummulative.untd}</td>
                  <td className="px-3 py-4">{studentData.cummulative.gpts}</td>
                  <td className="px-3 py-4">{studentData.cummulative.gptd}</td>
                  <td className="px-3 py-4">{studentData.cummulative.gpats}</td>
                  <td className="px-3 py-4">{studentData.cummulative.gpatd}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Remarks */}
          <p className="text-[#0D7590] mb-10 px-2 md:px-0">
            <b className="font-medium text-black">Remarks:</b>{" "}
            {studentData.cummulative.remarks}
          </p>

          {/* Signature */}
          <div className="flex flex-col ">
            <div className="border-t border-black w-1/2 mb-2"></div>
            <b className="font-medium text-black">Registrar</b>
          </div>
        </div>
      </div>
    );
  }
);

export default StudentResultPdf;

