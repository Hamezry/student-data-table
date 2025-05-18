import { Folder } from "iconsax-react";
import React, { useMemo, useState } from "react";

import {
  useReactTable,
  type SortingState,
  type VisibilityState,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { Loader } from "@mantine/core";

import { type TableProps, defaultClassNames } from "./types";
import { useTableControls } from "../../hooks";
import type { RowSelectionState } from "@tanstack/react-table";
export default function Table({
  classNames = defaultClassNames,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  inputPlaceholder = "Search",

  withSerialNo = true,
  pinSerialNo = false,
  TableFooter,
  ...props
}: TableProps) {
  const [tablePaginationControls] = useTableControls(props?.rows);

  const tableData = useMemo(() => {
    if (props?.status !== "success") return [];

    return props.data!;
  }, [props.data, props.status]);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnPinning, setColumnPinning] = React.useState({});

  const columnHelper = createColumnHelper<Record<string, unknown>>();

  const reactTable = useReactTable({
    data: tableData,
    columns: [
      columnHelper.accessor("id", {
        // eslint-disable-next-line no-empty-pattern
        header: ({}) => "",
        //   <Checkbox
        //     size="xs"
        //     checked={table.getIsAllRowsSelected()}
        //     onChange={() => table.toggleAllPageRowsSelected()}
        //   />
        // eslint-disable-next-line no-empty-pattern
        cell: ({}) => "",
        //   <Checkbox
        //     size="xs"
        //     checked={row.getIsSelected()}
        //     onChange={() => row.toggleSelected()}
        //   />
        enableSorting: false,
        size: 30,
      }),
      ...(withSerialNo
        ? [
            columnHelper.accessor("id", {
              header: () => "S/n",
              cell: ({ row }) =>
                tablePaginationControls.page_size *
                  tablePaginationControls.page -
                tablePaginationControls.page_size +
                row.index +
                1,
              meta: {
                header_className: pinSerialNo
                  ? "sticky left-0 z-10 bg-bg2"
                  : "",
                row_className: pinSerialNo ? "sticky left-0 z-10 bg-white" : "",
              },
              size: 30,
              maxSize: 45,
            }),
          ]
        : []),
      ...props.columns,
    ],
    enableSorting: true,
    enableRowSelection: true,
    enableMultiRowSelection: true,
    enablePinning: true,
    enableColumnPinning: true,
    manualPagination: true,

    state: {
      rowSelection,
      columnVisibility,
      sorting,

      columnPinning,
    },
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,

    onColumnVisibilityChange: setColumnVisibility,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnPinningChange: setColumnPinning,
  });

  const TableBodyView = {
    pending: (
      <tr>
        <td colSpan={reactTable?.getVisibleLeafColumns()?.length}>
          <div className="flex items-center justify-center my-10">
            <Loader color="green" />
          </div>
        </td>
      </tr>
    ),
    error: (
      <tr>
        <td colSpan={reactTable?.getVisibleLeafColumns()?.length}>
          <div className="flex flex-col gap-2 items-center justify-center mt-20 text-sm">
            <div className="bg-app-gray p-8 rounded-full">
              <Folder size={100} color="gray" />
            </div>
            <p>Error fetching data</p>
          </div>
        </td>
      </tr>
    ),
    success: (
      <>
        <tr key="Empty State" className="hidden last:table-row">
          <td colSpan={reactTable?.getVisibleLeafColumns()?.length}>
            <div className="flex flex-col gap-2 items-center justify-center mt-20 text-xs">
              <div className=" p-8 rounded-full">
                <Folder size={100} color="gray" />
              </div>
              <p>No records found.</p>
            </div>
          </td>
        </tr>
        {reactTable?.getRowModel()?.rows?.map((row, rowIndex) => (
          <tr className={`${classNames.table?.row}`} key={row.id + rowIndex}>
            {row?.getVisibleCells()?.map((cell, index) => (
              <td
                key={cell.id + index}
                className={`p-4 max-h-24 text-left border-b border-[#e2e2e2] text-sm align-middle ${cell.column.columnDef.meta?.row_className}`}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </>
    ),
  };

  return (
    <section
      className={` flex flex-col gap-4 overflow-auto ${classNames.wrapper}`}
    >
      <div
        className={`flex items-center justify-between ${classNames.header?.wrapper}`}
      >
        <div className={classNames.header?.rightSection}>
          {(reactTable.getIsSomeRowsSelected() ||
            reactTable.getIsAllRowsSelected()) &&
            props.BulkActions?.(
              reactTable
                .getSelectedRowModel()
                .flatRows.map((row) => row.original),
              reactTable.resetRowSelection
            )}
          {props.CustomActions}
        </div>
      </div>
      <div
        className={`relative h-[36rem] p-4 pb-20  ${classNames.table?.inner}`}
      >
        <div className="pb-2">
          <div className={classNames.header?.title}>{props.title}</div>
        </div>
        <div className={`relative h-full overflow-auto`}>
          <table className="overflow-auto w-full align-top">
            <thead
              className={`bg-[#F9F9FA] sticky top-0 z-[2] ${classNames.table?.header}`}
            >
              {reactTable
                .getHeaderGroups()
                .map((headerGroup, headerGroupIndex) => (
                  <tr key={headerGroup.id + headerGroupIndex}>
                    {headerGroup.headers.map((header, index) => (
                      <th
                        className={`text-xs font-semibold text-left p-3 px-4 text-app-text  gap-2 items-center cursor-pointer border-b border-[#e2e2e2]  whitespace-nowrap ${header.column.columnDef.meta?.header_className}`}
                        key={header.id + index}
                        colSpan={header.colSpan}
                        style={{
                          width:
                            header.id.toLowerCase() === "s/n"
                              ? "40px"
                              : header.getSize(),
                        }}
                      >
                        <div className="flex items-center gap-2">
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
            </thead>
            <tbody>{TableBodyView[props.status]}</tbody>
            {props.status === "success" ? TableFooter : null}
          </table>
        </div>
      </div>
    </section>
  );
}

