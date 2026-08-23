'use client'

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export interface DashboardPageInfo {
  hasNextPage: boolean
  hasPreviousPage: boolean
}

interface DashboardPaginationProps {
  page: number
  pageSize: number
  totalCount: number
  pageInfo?: DashboardPageInfo
  onPageChange: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
  pageSizeOptions?: number[]
  itemLabel?: string
}

export function DashboardPagination({
  page,
  pageSize,
  totalCount,
  pageInfo,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 30],
  itemLabel = 'items',
}: DashboardPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))
  const hasPreviousPage = pageInfo?.hasPreviousPage ?? page > 1
  const hasNextPage = pageInfo?.hasNextPage ?? page < totalPages

  if (totalCount === 0 || (!hasPreviousPage && !hasNextPage)) {
    return null
  }

  const firstItem = (page - 1) * pageSize + 1
  const lastItem = Math.min(page * pageSize, totalCount)
  const getPageNumbers = (): Array<number | string> => {
    const pageNumbers: Array<number | string> = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      for (let pageNumber = 1; pageNumber <= totalPages; pageNumber += 1) {
        pageNumbers.push(pageNumber)
      }
    } else {
      pageNumbers.push(1)
      let start = Math.max(2, page - 1)
      let end = Math.min(totalPages - 1, page + 1)

      if (page <= 3) end = Math.min(4, totalPages - 1)
      if (page >= totalPages - 2) start = Math.max(totalPages - 3, 2)
      if (start > 2) pageNumbers.push('ellipsis-start')
      for (let pageNumber = start; pageNumber <= end; pageNumber += 1) {
        pageNumbers.push(pageNumber)
      }
      if (end < totalPages - 1) pageNumbers.push('ellipsis-end')
      pageNumbers.push(totalPages)
    }

    return pageNumbers
  }

  return (
    <>
      <nav
        aria-label="Pagination"
        className="flex flex-col items-center justify-between gap-4 border-t pt-6 sm:flex-row"
      >
      <div className="flex items-center gap-2">
        {onPageSizeChange && (
          <>
            <span className="text-sm text-muted-foreground">Show</span>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => onPageSizeChange(Number(value))}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={pageSize} />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((option) => (
                  <SelectItem key={option} value={option.toString()}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">per page</span>
          </>
        )}
      </div>
      <div className="text-sm text-muted-foreground">
        Showing{' '}
        <span className="font-semibold text-foreground">
          {firstItem}-{lastItem}
        </span>{' '}
        of{' '}
        <span className="font-semibold text-foreground">
          {totalCount.toLocaleString()}
        </span>{' '}
        {itemLabel}
      </div>
      <div className="hidden items-center gap-1 sm:flex">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(1)}
          disabled={!hasPreviousPage}
          aria-label="Go to first page"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPreviousPage}
          aria-label="Go to previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="mx-2 flex items-center gap-1">
          {getPageNumbers().map((pageNumber, index) =>
            typeof pageNumber === 'string' ? (
              <span
                key={`${pageNumber}-${index}`}
                className="flex h-8 w-8 items-center justify-center text-muted-foreground"
              >
                ...
              </span>
            ) : (
              <Button
                key={pageNumber}
                variant={page === pageNumber ? 'default' : 'outline'}
                size="icon"
                className="h-8 w-8 text-sm"
                onClick={() => onPageChange(pageNumber)}
                aria-current={page === pageNumber ? 'page' : undefined}
                aria-label={`Go to page ${pageNumber}`}
              >
                {pageNumber}
              </Button>
            ),
          )}
        </div>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNextPage}
          aria-label="Go to next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(totalPages)}
          disabled={!hasNextPage}
          aria-label="Go to last page"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
      </nav>
      <div className="flex items-center justify-between gap-4 border-t pt-4 sm:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPreviousPage}
          className="flex-1"
        >
          Previous
        </Button>
        <span className="text-sm font-medium">
          Page {page} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNextPage}
          className="flex-1"
        >
          Next
        </Button>
      </div>
    </>
  )
}
