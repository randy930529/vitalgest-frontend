export default function Loading() {
  return (
    <div className="p-6 animate-pulse">
      <div className="max-w-7xl mx-auto">
        {/* Heading skeleton */}
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-6 dark:bg-gray-700" />

        {/* Grid of cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="border border-gray-100 rounded-lg p-4 bg-white dark:bg-neutral-900 dark:border-neutral-800"
            >
              <div className="h-40 bg-gray-200 rounded-md mb-4 dark:bg-gray-700" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 dark:bg-gray-700" />
              <div className="h-3 bg-gray-200 rounded w-1/2 dark:bg-gray-700" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
