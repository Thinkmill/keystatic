export function DataDump({ data }: { data: any }) {
  return (
    <div className="mt-8 border-t p-8">
      <details className="bg-yellow-100 p-4">
        <summary>Toggle page data</summary>
        <pre className="bg-white text-sm mt-4 rounded-md shadow-sm p-4">
          {JSON.stringify(data, null, 2)}
        </pre>
      </details>
    </div>
  );
}
