// import { useState, useEffect } from "react";
// import { useRouter, useSearchParams, usePathname } from "next/navigation";

// export function useOrderFilters() {
//   const router = useRouter();
//   const pathname = usePathname();
//   const searchParams = useSearchParams();

//   const country = searchParams.get("country") ?? "";
//   const search = searchParams.get("search") ?? "";
//   const page = Number(searchParams.get("page") ?? "1");

//   const [searchInput, setSearchInput] = useState(search);

//   function updateParams(updates: Record<string, string>) {
//     const params = new URLSearchParams(searchParams.toString());
//     Object.entries(updates).forEach(([key, value]) => {
//       if (value) {
//         params.set(key, value);
//       } else {
//         params.delete(key);
//       }
//     });
//     router.push(`${pathname}?${params.toString()}`);
//   }

//   useEffect(() => {
//     const timeout = setTimeout(() => {
//       if (searchInput !== search) {
//         updateParams({ search: searchInput, page: "1" });
//       }
//     }, 500);

//     return () => clearTimeout(timeout);
//   }, [searchInput]);

//   return { country, search, page, searchInput, setSearchInput, updateParams };
// }

import { useQueryState, parseAsInteger, parseAsString } from "nuqs";

export function useOrderFilters() {
  const [country, setCountry] = useQueryState("country", parseAsString.withDefault(""));
  const [search, setSearch] = useQueryState(
    "search",
    parseAsString.withDefault("").withOptions({ throttleMs: 500 })
  );
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));

  const updateParams = (updates: { country?: string; search?: string; page?: string | number }) => {
    if (updates.country !== undefined) setCountry(updates.country || null);
    if (updates.search !== undefined) setSearch(updates.search || null);
    if (updates.page !== undefined) setPage(Number(updates.page));
  };

  return {
    country,
    search,
    page,
    searchInput: search, 
    setSearchInput: setSearch, 
    updateParams,
    setCountry,
    setSearch,
    setPage,
  };
}