import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Modal } from "@mantine/core";
import FloatingLabelSelect from "../components/select";
import Table from "../components/table";
import { Button, Menu } from "@mantine/core";
import { createColumnHelper, type Row } from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";

import {
  fetchData,
  fetchAges,
  fetchGender,
  fetchStates,
  fetchLevels,
  filterData,
  getResults,
} from "../libs/request";
import StudentResultPdf from "../components/pdf";

type FilterState = {
  age: string | null;
  state: string | null;
  level: string | null;
  gender: string | null;
};

export default function StudentTable() {
  // Fetch initial unfiltered data
  const { data, status } = useQuery({
    queryKey: ["allData"],
    queryFn: fetchData,
  });

  // Fetch filter options
  const { data: ages } = useQuery({ queryKey: ["ages"], queryFn: fetchAges });
  const { data: gender } = useQuery({
    queryKey: ["gender"],
    queryFn: fetchGender,
  });
  const { data: states } = useQuery({
    queryKey: ["states"],
    queryFn: fetchStates,
  });
  const { data: levels } = useQuery({
    queryKey: ["levels"],
    queryFn: fetchLevels,
  });

  // State for filters
  const [filters, setFilters] = useState<FilterState>({
    age: null,
    state: null,
    level: null,
    gender: null,
  });

  const [shouldFilter, setShouldFilter] = useState(false);
  const [opened, setOpened] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);

  const {
    data: filteredResult,
    refetch: refetchFilteredData,
    isFetching: isFiltering,
  } = useQuery({
    queryKey: ["filteredData", filters],
    queryFn: () =>
      filterData({
        age: filters.age ? parseInt(filters.age) : undefined,
        state: filters.state || undefined,
        level: filters.level || undefined,
        gender: filters.gender || undefined,
      }),
    enabled: false, // disable automatic fetch
  });

  // Derived options for selects
  const ageOptions =
    ages?.data?.map((item: { id: number; age: number }) => ({
      value: item.age.toString(),
      label: `Age ${item.age}`,
    })) ?? [];

  const genderOptions =
    gender?.data?.map((item: { id: number; gender: string }) => ({
      value: item.gender,
      label: item.gender,
    })) ?? [];

  const stateOptions =
    states?.data?.map((item: { id: number; name: string }) => ({
      value: item.name,
      label: item.name,
    })) ?? [];

  const levelOptions =
    levels?.data?.map((item: { id: number; level: string }) => ({
      value: item.level,
      label: item.level,
    })) ?? [];

  const handleFilter = () => {
    refetchFilteredData(); // manually trigger fetch on click
    setShouldFilter(true); // mark that filtering happened (for showing Reset)
  };

  const handleReset = () => {
    setFilters({ age: null, state: null, level: null, gender: null });
    setShouldFilter(false);
  };

  const filteredData = filteredResult?.data?.students;
  const allData = data?.data?.students;
  const finalData = filteredData?.length ? filteredData : allData;

  const {
    data: resultData,
    refetch: fetchStudentResult,
    isFetching: isResultLoading,
  } = useQuery({
    queryKey: ["studentResult", selectedStudent?.id],
    queryFn: () => getResults(selectedStudent!.id),
    enabled: false,
  });

  useEffect(() => {
    if (selectedStudent) {
      fetchStudentResult();
    }
  }, [fetchStudentResult, selectedStudent]);

  useEffect(() => {
    if (resultData && selectedStudent) {
      setOpened(true);
    }
  }, [resultData, selectedStudent]);

  type User = {
    id: number;
    firstname: string;
    surname: string;
    age: number;
    gender: "male" | "female";
    level: string;
    state: string;
  };

  const columnHelper = createColumnHelper<User>();

  const columns = [
    columnHelper.accessor("firstname", {
      header: () => "First Name",
    }),
    columnHelper.accessor("surname", {
      header: () => "Surname",
    }),
    columnHelper.accessor("age", {
      header: () => "Age",
    }),
    columnHelper.accessor("gender", {
      header: () => "Gender",
    }),
    columnHelper.accessor("level", {
      header: () => "Level",
    }),
    columnHelper.accessor("state", {
      header: () => "State",
    }),

    {
      id: "actions",
      header: () => "Actions",
      cell: ({ row }: { row: Row<User> }) => (
        <Menu position="bottom-end" width={200} withArrow>
          <Menu.Target>
            <Button
              bg="green"
              color="white"
              className="text-white"
              variant="subtle"
            >
              Download
            </Button>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item
              onClick={() => {
                setSelectedStudent(row.original);
              }}
            >
              Download Result
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      ),
    },
  ].map((col) => col as ColumnDef<Record<string, unknown>, unknown>);

  return (
    <div className="mx-4 overflow-auto flex flex-col gap-10">
      <h1 className="font-bold text-2xl">Student Data Table</h1>

      <div className="w-full grid bg-white p-6">
        <h2 className=" text-[#616161] text-xl mb-3">
          Filter Student Table By:
        </h2>

        <div className="w-full grid md:grid-cols-3  grid-cols-1 gap-4 bg-white">
          <FloatingLabelSelect
            label="Age"
            data={ageOptions}
            placeholder="Select age"
            value={filters.age}
            onChange={(value) =>
              setFilters((prev) => ({ ...prev, age: value }))
            }
          />

          <FloatingLabelSelect
            label="State"
            data={stateOptions}
            placeholder="Select state"
            value={filters.state}
            onChange={(value) =>
              setFilters((prev) => ({ ...prev, state: value }))
            }
          />

          <FloatingLabelSelect
            label="Level"
            data={levelOptions}
            placeholder="Select level"
            value={filters.level}
            onChange={(value) =>
              setFilters((prev) => ({ ...prev, level: value }))
            }
          />

          <FloatingLabelSelect
            label="Gender"
            data={genderOptions}
            placeholder="Select gender"
            value={filters.gender}
            onChange={(value) =>
              setFilters((prev) => ({ ...prev, gender: value }))
            }
          />

          <button
            className="bg-[#46C35F] hover:bg-[#46C35F]/80 max-w-[400px] text-white px-6 h-14 mt-6 rounded"
            onClick={handleFilter}
            disabled={isFiltering}
          >
            {isFiltering ? "Searching..." : "Search"}
          </button>

          {shouldFilter && (
            <button
              className="bg-gray-300 hover:bg-gray-400 max-w-[400px] text-gray-800 px-6 h-14 mt-6 rounded"
              onClick={handleReset}
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      <div className="bg-white p-4">
        <Table
          withSerialNo={true}
          total_number_of_records={finalData?.length ?? 0}
          rows={10}
          columns={columns}
          data={finalData}
          status={status}
          title=""
        />
      </div>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        size="xl"
        fullScreen={window.innerWidth < 768}
        title="Student Result Preview"
        overlayProps={{
          blur: 3,
          backgroundOpacity: 0.55,
        }}
      >
        {isResultLoading ? (
          <p>Loading result...</p>
        ) : (
          resultData && (
            <StudentResultPdf
              studentData={resultData.student}
              logo={resultData.logo}
              profilePicture={resultData.profilePicture}
            />
          )
        )}
      </Modal>
    </div>
  );
}

