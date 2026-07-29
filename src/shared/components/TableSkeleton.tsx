export function TableSkeleton({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="border-b border-slate-50">
          {Array.from({ length: cols }).map((_, j) => (
            <td key={j} className="px-6 py-3.5">
              <div className="h-4 bg-slate-100 rounded animate-pulse" style={{ width: j === 0 ? "80%" : "60%" }} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
