// src/App.tsx
import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Input,
  Stack,
  Spinner,
  Text,
  Heading,
  Button,
  Table,
  IconButton,
  HStack,
  VStack,
  Switch,
  Checkbox,
  Badge,
  Flex,
} from "@chakra-ui/react";
import { LuChevronLeft, LuChevronRight, LuSearch, LuEye, LuEyeOff, LuArrowUpDown, LuArrowUp, LuArrowDown } from "react-icons/lu";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import { Virtuoso, TableVirtuoso } from "react-virtuoso";

// Helper function to format dates consistently
const formatDate = (dateStr: string): string => {
  if (!dateStr || dateStr.trim() === "") return "-";
  
  // Handle full datetime strings (e.g., "1965-07-01 00:00:00")
  if (dateStr.includes(" 00:00:00")) {
    const datePart = dateStr.split(" ")[0];
    try {
      const date = new Date(datePart);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      });
    } catch {
      return datePart;
    }
  }
  
  // Handle MM/DD/YYYY format
  if (dateStr.includes("/")) {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      });
    } catch {
      return dateStr;
    }
  }
  
  // Handle YYYY-MM format (e.g., "1909-10")
  if (dateStr.match(/^\d{4}-\d{2}$/)) {
    return `${dateStr}-??`;
  }
  
  // Handle YYYY-MM-DD format
  if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      });
    } catch {
      return dateStr;
    }
  }
  
  // Handle just year (e.g., "1897")
  if (dateStr.match(/^\d{4}$/)) {
    return dateStr;
  }
  
  // Handle years with question mark (e.g., "1863?")
  if (dateStr.match(/^\d{4}\?$/)) {
    return dateStr;
  }
  
  // Return as-is for any other format
  return dateStr;
};

interface CemeteryRecord {
  Lastname: string;
  Firstname: string;
  Middlename?: string;
  DOB?: string;
  DOD?: string;
  Section?: string;
  Block?: string;
  Plot?: string;
  "Place of birth"?: string;
  "Place of death"?: string;
  Notes?: string;
  extracted_all?: any;
  marriages?: any;
  widow?: any;
  divorced?: any;
  veteran?: any;
  sons?: any;
  brothers?: any;
}

const columnHelper = createColumnHelper<CemeteryRecord>();

interface SearchCategories {
  names: boolean;
  dates: boolean;
  location: boolean;
  places: boolean;
  notes: boolean;
  special: boolean;
}

// Optimized search function with selective categories
const createGlobalFilter = (searchCategories: SearchCategories) => {
  return (row: any, columnId: string, value: string) => {
    const searchValue = value.toLowerCase();
    if (!searchValue) return true;

    const searchFields: string[] = [];

    // Add fields based on selected categories
    if (searchCategories.names) {
      searchFields.push(
        row.original.Lastname || "",
        row.original.Firstname || "",
        row.original.Middlename || ""
      );
    }

    if (searchCategories.dates) {
      searchFields.push(
        formatDate(row.original.DOB || ""),
        formatDate(row.original.DOD || "")
      );
    }

    if (searchCategories.location) {
      searchFields.push(
        row.original.Section || "",
        row.original.Block || "",
        row.original.Plot || ""
      );
    }

    if (searchCategories.places) {
      searchFields.push(
        row.original["Place of birth"] || "",
        row.original["Place of death"] || ""
      );
    }

    if (searchCategories.notes) {
      searchFields.push(row.original.Notes || "");
    }

    // Special terms search
    if (searchCategories.special) {
      if (searchValue === "veteran" && row.original.veteran === true) return true;
      if (searchValue === "widow" && row.original.widow === true) return true;
      if (searchValue === "divorced" && row.original.divorced === true) return true;
    }

    return searchFields.some(field => 
      field.toLowerCase().includes(searchValue)
    );
  };
};

export default function App() {
  const [records, setRecords] = useState<CemeteryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [isVirtualized, setIsVirtualized] = useState(false);
  const [page, setPage] = useState(1);
  const [searchCategories, setSearchCategories] = useState<SearchCategories>({
    names: true,
    dates: false,
    location: false,
    places: false,
    notes: false,
    special: false,
  });
  const pageSize = 20;

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setGlobalFilterValue(searchInput);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    fetch("/cemetery_records_structured.json")
      .then((res) => res.json())
      .then((data: CemeteryRecord[]) => {
        setRecords(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading cemetery records:", error);
        setLoading(false);
      });
  }, []);

  const globalFilter = useMemo(() => createGlobalFilter(searchCategories), [searchCategories]);

  const columns = useMemo(() => [
    columnHelper.accessor("Lastname", {
      header: "Last Name",
      cell: info => info.getValue() || "-",
      enableSorting: true,
      enableColumnFilter: true,
    }),
    columnHelper.accessor("Firstname", {
      header: "First Name", 
      cell: info => info.getValue() || "-",
      enableSorting: true,
      enableColumnFilter: true,
    }),
    columnHelper.accessor("Middlename", {
      header: "Middle Name",
      cell: info => info.getValue() || "-",
      enableSorting: true,
      enableColumnFilter: true,
    }),
    columnHelper.accessor("DOB", {
      header: "Date of Birth",
      cell: info => formatDate(info.getValue() || ""),
      enableSorting: true,
      enableColumnFilter: true,
    }),
    columnHelper.accessor("DOD", {
      header: "Date of Death",
      cell: info => formatDate(info.getValue() || ""),
      enableSorting: true,
      enableColumnFilter: true,
    }),
    columnHelper.accessor("Section", {
      header: "Section",
      cell: info => info.getValue() || "-",
      enableSorting: true,
      enableColumnFilter: true,
    }),
    columnHelper.accessor("Block", {
      header: "Block",
      cell: info => info.getValue() || "-",
      enableSorting: true,
      enableColumnFilter: true,
    }),
    columnHelper.accessor("Plot", {
      header: "Plot",
      cell: info => info.getValue() || "-",
      enableSorting: true,
      enableColumnFilter: true,
    }),
    columnHelper.accessor("Place of birth", {
      header: "Place of Birth",
      cell: info => info.getValue() || "-",
      enableSorting: true,
      enableColumnFilter: true,
    }),
    columnHelper.accessor("Place of death", {
      header: "Place of Death",
      cell: info => info.getValue() || "-",
      enableSorting: true,
      enableColumnFilter: true,
    }),
    columnHelper.accessor("veteran", {
      header: "Veteran",
      cell: info => info.getValue() === true ? <Badge colorScheme="blue">Veteran</Badge> : "-",
      enableSorting: true,
      enableColumnFilter: true,
    }),
    columnHelper.accessor("Notes", {
      header: "Notes",
      cell: info => (
        <Text maxW="300px" truncate title={info.getValue() || ""}>
          {info.getValue() || "-"}
        </Text>
      ),
      enableSorting: true,
      enableColumnFilter: true,
    }),
  ], []);

  const table = useReactTable({
    data: records,
    columns,
    state: {
      globalFilter: globalFilterValue,
      columnFilters,
      sorting,
      columnVisibility,
    },
    onGlobalFilterChange: setGlobalFilterValue,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: globalFilter,
    enableGlobalFilter: true,
  });

  // Get the correct rows based on current filters and sorting
  const tableRows = table.getRowModel().rows;
  const paginatedRows = isVirtualized ? tableRows : tableRows.slice((page - 1) * pageSize, page * pageSize);
  const pageCount = Math.ceil(tableRows.length / pageSize);

  const TableHeader = () => (
    <Table.Header>
      {table.getHeaderGroups().map(headerGroup => (
        <Table.Row key={headerGroup.id}>
          {headerGroup.headers.map(header => (
            <Table.ColumnHeader key={header.id} w={header.getSize()}>
              {header.isPlaceholder ? null : (
                <Box>
                  <HStack>
                    <Text
                      cursor={header.column.getCanSort() ? "pointer" : "default"}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </Text>
                    {header.column.getCanSort() && (
                      <IconButton
                        aria-label="Sort"
                        size="xs"
                        variant="ghost"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {header.column.getIsSorted() === "asc" ? (
                          <LuArrowUp />
                        ) : header.column.getIsSorted() === "desc" ? (
                          <LuArrowDown />
                        ) : (
                          <LuArrowUpDown />
                        )}
                      </IconButton>
                    )}
                  </HStack>
                </Box>
              )}
            </Table.ColumnHeader>
          ))}
        </Table.Row>
      ))}
    </Table.Header>
  );

  const TableRowComponent = ({ index, row }: { index: number; row: any }) => (
    <Table.Row key={row.id}>
      {row.getVisibleCells().map((cell: any) => (
        <Table.Cell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </Table.Cell>
      ))}
    </Table.Row>
  );

  return (
    <Box maxW="1400px" mx="auto" p={4}>
      <VStack gap={4} align="stretch">
        <Heading>Jacksonville Cemetery Search</Heading>

        {/* Search and Controls */}
        <VStack gap={3} align="stretch">
          <Flex gap={4} wrap="wrap" align="center">
            <Box minW="300px">
              <Input
                placeholder="Search..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </Box>
            
            <Checkbox.Root
              checked={isVirtualized}
              onCheckedChange={(details) => {
                setIsVirtualized(Boolean(details.checked));
                setPage(1);
              }}
            >
              <Checkbox.HiddenInput />
              <Checkbox.Control />
              <Checkbox.Label>Virtualized View</Checkbox.Label>
            </Checkbox.Root>

            {globalFilterValue && (
              <Text fontSize="sm" color="gray.500">
                Found {tableRows.length} record{tableRows.length !== 1 ? 's' : ''}
              </Text>
            )}
          </Flex>

          {/* Search Categories */}
          <Box>
            <Text fontSize="sm" fontWeight="medium" mb={2}>Search In:</Text>
            <Flex gap={4} wrap="wrap">
              <Checkbox.Root
                checked={searchCategories.names}
                onCheckedChange={(details) => 
                  setSearchCategories(prev => ({ ...prev, names: Boolean(details.checked) }))
                }
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control />
                <Checkbox.Label>Names</Checkbox.Label>
              </Checkbox.Root>

              <Checkbox.Root
                checked={searchCategories.dates}
                onCheckedChange={(details) => 
                  setSearchCategories(prev => ({ ...prev, dates: Boolean(details.checked) }))
                }
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control />
                <Checkbox.Label>Dates</Checkbox.Label>
              </Checkbox.Root>

              <Checkbox.Root
                checked={searchCategories.location}
                onCheckedChange={(details) => 
                  setSearchCategories(prev => ({ ...prev, location: Boolean(details.checked) }))
                }
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control />
                <Checkbox.Label>Location</Checkbox.Label>
              </Checkbox.Root>

              <Checkbox.Root
                checked={searchCategories.places}
                onCheckedChange={(details) => 
                  setSearchCategories(prev => ({ ...prev, places: Boolean(details.checked) }))
                }
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control />
                <Checkbox.Label>Places</Checkbox.Label>
              </Checkbox.Root>

              <Checkbox.Root
                checked={searchCategories.notes}
                onCheckedChange={(details) => 
                  setSearchCategories(prev => ({ ...prev, notes: Boolean(details.checked) }))
                }
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control />
                <Checkbox.Label>Notes</Checkbox.Label>
              </Checkbox.Root>

              <Checkbox.Root
                checked={searchCategories.special}
                onCheckedChange={(details) => 
                  setSearchCategories(prev => ({ ...prev, special: Boolean(details.checked) }))
                }
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control />
                <Checkbox.Label>Special (veteran, widow)</Checkbox.Label>
              </Checkbox.Root>
            </Flex>
          </Box>
        </VStack>

        {/* Column Visibility Controls */}
        <Box>
          <Text fontSize="sm" fontWeight="medium" mb={2}>Show/Hide Columns:</Text>
          <Flex gap={4} wrap="wrap">
            {table.getAllLeafColumns().map(column => (
              <Checkbox.Root
                key={column.id}
                checked={column.getIsVisible()}
                onCheckedChange={() => column.toggleVisibility()}
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control />
                <Checkbox.Label>{column.columnDef.header as string}</Checkbox.Label>
              </Checkbox.Root>
            ))}
          </Flex>
        </Box>

        {loading ? (
          <Spinner mx="auto" />
        ) : (
          <Box>
            {isVirtualized ? (
              // Virtualized Table
              <Box overflowX="auto" border="1px solid" borderColor="gray.200" borderRadius="md">
                <TableVirtuoso
                  style={{ height: "600px", width: "100%" }}
                  data={tableRows}
                  components={{
                    Table: (props) => <Table.Root {...props} variant="outline" size="sm" />,
                    TableHead: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
                      <Table.Header {...props} ref={ref} />
                    )),
                    TableRow: ({ item: _item, ...props }) => <Table.Row {...props} />,
                    TableBody: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
                      <Table.Body {...props} ref={ref} />
                    )),
                  }}
                  fixedHeaderContent={() => (
                    table.getHeaderGroups().map(headerGroup => (
                      <Table.Row key={headerGroup.id}>
                        {headerGroup.headers.map(header => (
                          <Table.ColumnHeader key={header.id} w={header.getSize()}>
                            {header.isPlaceholder ? null : (
                              <Box>
                                <HStack>
                                  <Text
                                    cursor={header.column.getCanSort() ? "pointer" : "default"}
                                    onClick={header.column.getToggleSortingHandler()}
                                  >
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                  </Text>
                                  {header.column.getCanSort() && (
                                    <IconButton
                                      aria-label="Sort"
                                      size="xs"
                                      variant="ghost"
                                      onClick={header.column.getToggleSortingHandler()}
                                    >
                                      {header.column.getIsSorted() === "asc" ? (
                                        <LuArrowUp />
                                      ) : header.column.getIsSorted() === "desc" ? (
                                        <LuArrowDown />
                                      ) : (
                                        <LuArrowUpDown />
                                      )}
                                    </IconButton>
                                  )}
                                </HStack>
                              </Box>
                            )}
                          </Table.ColumnHeader>
                        ))}
                      </Table.Row>
                    ))
                  )}
                  itemContent={(index, row) => (
                    <>
                      {row.getVisibleCells().map((cell: any) => (
                        <Table.Cell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </Table.Cell>
                      ))}
                    </>
                  )}
                />
              </Box>
            ) : (
              // Paginated Table
              <>
                <Box overflowX="auto">
                  <Table.Root variant="outline" size="sm" striped>
                    <TableHeader />
                    <Table.Body>
                      {paginatedRows.map((row, index) => (
                        <TableRowComponent key={row.id} index={index} row={row} />
                      ))}
                    </Table.Body>
                  </Table.Root>
                </Box>

                {/* Pagination */}
                {tableRows.length > pageSize && (
                  <Stack align="center" gap={2} mt={4}>
                    <HStack gap={2}>
                      <IconButton
                        aria-label="Previous"
                        onClick={() => setPage(p => Math.max(p - 1, 1))}
                        disabled={page === 1}
                        variant="ghost"
                        size="sm"
                      >
                        <LuChevronLeft />
                      </IconButton>

                      {Array.from({ length: Math.min(pageCount, 10) }, (_, idx) => {
                        const pageNumber = idx + 1;
                        const isCurrentPage = pageNumber === page;
                        return (
                          <Button
                            key={pageNumber}
                            variant={isCurrentPage ? "solid" : "ghost"}
                            size="sm"
                            onClick={() => setPage(pageNumber)}
                          >
                            {pageNumber}
                          </Button>
                        );
                      })}

                      <IconButton
                        aria-label="Next"
                        onClick={() => setPage(p => Math.min(p + 1, pageCount))}
                        disabled={page === pageCount}
                        variant="ghost"
                        size="sm"
                      >
                        <LuChevronRight />
                      </IconButton>
                    </HStack>
                  </Stack>
                )}
              </>
            )}

            <Text mt={2} color="gray.500" textAlign="center">
              Showing {isVirtualized ? tableRows.length : paginatedRows.length} of {tableRows.length} records
              {records.length !== tableRows.length && ` (${records.length} total)`}
            </Text>
          </Box>
        )}
      </VStack>
    </Box>
  );
}
