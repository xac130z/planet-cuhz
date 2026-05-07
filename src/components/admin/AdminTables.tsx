interface AdminTableProps {
  columns: { key: string; label: string; }[];
  data: any[];
  onRowClick?: (row: any) => void;
}

export default function AdminTable({ columns, data, onRowClick }: AdminTableProps) {
  if (data.length === 0) {
    return (
      <div className="protocol-card" style={{ padding: 20 }}>
        <p className="text-muted-foreground">No data</p>
      </div>
    );
  }

  return (
    <div className="protocol-card" style={{ padding: 20 }}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-700">
              {columns.map((col) => (
                <th key={col.key} className="text-left py-2 px-4 text-sm font-semibold">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr
                key={idx}
                className="border-b border-neutral-800 hover:bg-black/30 cursor-pointer"
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((col) => (
                  <td key={col.key} className="py-2 px-4 text-sm">
                    {row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
