
import React from "react";
import { Link } from "react-router-dom";
import { 
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

interface CosmicBreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function CosmicBreadcrumb({ items, className }: CosmicBreadcrumbProps) {
  return (
    <Breadcrumb className={className} aria-label="Navigation breadcrumb">
      <BreadcrumbList className="flex items-center space-x-2 text-sm">
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem className="flex items-center">
              {item.isActive ? (
                <BreadcrumbPage 
                  className="text-[#F1F5F9] font-bold px-3 py-2 rounded-lg bg-gradient-to-r from-[#B3A369]/20 to-[#A0A0A0]/20 border border-[#B3A369]/30"
                  aria-current="page"
                >
                  {item.label}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link
                    to={item.href || "/"}
                    className="text-[#A0A0A0] hover:text-[#B3A369] transition-all duration-300 px-3 py-2 rounded-lg hover:bg-[#B3A369]/10 focus:outline-none focus:ring-2 focus:ring-[#B3A369]/50 focus:ring-offset-2 focus:ring-offset-[#232323]"
                    aria-label={`Navigate to ${item.label}`}
                  >
                    {item.label}
                  </Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index < items.length - 1 && (
              <BreadcrumbSeparator aria-hidden="true">
                <ChevronRight className="w-4 h-4 text-[#8A2BE2]" />
              </BreadcrumbSeparator>
            )}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
