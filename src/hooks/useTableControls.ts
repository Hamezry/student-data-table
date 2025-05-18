import {
  NumberParam,
  StringParam,
  useQueryParams,
  withDefault,
} from "use-query-params";

export function useTableControls(page_size = 10) {
  return useQueryParams({
    page: withDefault(NumberParam, 1),
    page_size: withDefault(NumberParam, page_size),
    search: withDefault(StringParam, ""),
    key: withDefault(StringParam, "search"),
    area_code: withDefault(StringParam, "all"),
  });
}

