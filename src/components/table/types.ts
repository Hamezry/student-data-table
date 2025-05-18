import type { JSX, ReactElement, ReactNode } from "react";

import type { ColumnDef, RowData } from "@tanstack/react-table";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    row_className?: string;
    header_className?: string;
  }
}
export interface TableProps {
  status: "error" | "pending" | "success";
  data: Array<Record<string, unknown>>;
  rows: number;
  total_number_of_records?: number;
  columns: ColumnDef<Record<string, unknown>, unknown>[];
  title: ReactNode;
  subtitle?: string;
  CustomActions?: ReactElement;
  BulkActions?: (
    selected: Array<Record<string, unknown>>,
    resetSelected: () => void
  ) => ReactElement;
  LeftCustomActions?: ReactElement;
  classNames?: Partial<TableBaseClassNames>;
  inputPlaceholder?: string;
  withSerialNo?: boolean;
  withBulkAction?: boolean;
  pinSerialNo?: boolean;
  TableFooter?: JSX.Element;
  filter_keys?: string[];
}

interface TableBaseClassNames {
  wrapper: string;
  header: Partial<{
    wrapper: string;
    inner: string;
    title: string;
    subtitle: string;
    rightSection: string;
    filter: string;
    column: string;
  }>;
  table: Partial<{
    inner: string;
    header: string;
    row: string;
  }>;
  pagination: Partial<{
    wrapper: string;
    dots: string;
    control: string;
  }>;
  search: Partial<{
    wrapper: string;
    input: string;
  }>;
}

export const defaultClassNames: TableBaseClassNames = {
  wrapper: "",
  header: {
    wrapper: "",
    inner: "",
    title: "",
    subtitle: "",
    rightSection: "",
    column: "",
    filter: "",
  },
  table: {
    header: "",
    inner: "",
    row: "",
  },
  pagination: {
    wrapper: "",
    dots: "",
    control: "",
  },
  search: {
    wrapper: "",
    input: "",
  },
};

