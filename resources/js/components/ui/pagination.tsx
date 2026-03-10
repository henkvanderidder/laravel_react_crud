import { Link } from "@inertiajs/react"
import { type PaginationProps} from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue  } from '@/components/ui/select';

interface IndexProps {
  page: PaginationProps, 
  perPage: string,
  onPerPageChange:(value:string)=>void
}

export const Pagination = ({page, perPage, onPerPageChange} : IndexProps) => {
  
  console.log("Per Page: ",page.per_page, " en: ",perPage);

  return (
    <div className="flex items-center justify-between mt-4">
      <p>Showing <strong>{page.from}</strong> to <strong>{page.to}</strong> from total <strong>{page.total}</strong> entries </p>

      {/* Select per page zie:https://ui.shadcn.com/docs/components/select */}
      <div className="flex items-center gap-2">
        <span className="text-sm">
          Rows per page
        </span>
        <Select 
          onValueChange={onPerPageChange}
          value={perPage}
        >
          <SelectTrigger className="w-[90px]">
            <SelectValue placeholder="Row" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="25">25</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
            <SelectItem value="-1">All</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Pagination link */}
      <div className="flex gap-2">
        { page.links.map((link,index) => (
          <Link
            href={link.url || '#' }
            key={index}
            className={`px-3 py-2 border rounded ${link.active ? 'bg-black/10 text-black' : '' }`}
            dangerouslySetInnerHTML={ { __html: link.label }}
          />
        ))}
      </div>
    </div>
  )
}