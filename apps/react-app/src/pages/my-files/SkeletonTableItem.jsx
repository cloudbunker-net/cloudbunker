import Skeleton from "react-loading-skeleton";

export const SkeletonTableItem = ({ cards, index }) => {
  return Array(cards)
    .fill(0)
    .map(() => (
      <tr className="border-b border-gray-200 text-black h-10" key={index}>
        <td className="px-2 first:pl-6 last:pr-6 pr-5 whitespace-nowrap w-px">
          <Skeleton width={15} />
        </td>
        <td className="px-2 first:pl-5 last:pr-5 whitespace-nowrap cursor-pointer">
          <Skeleton className="h-6" />
        </td>
        <td className="px-2 first:pl-5 last:pr-5 whitespace-nowrap">
          <Skeleton className="h-6" />
        </td>
        <td className="px-2 first:pl-5 last:pr-5 whitespace-nowrap">
          <Skeleton className="h-6" />
        </td>
        <td className="px-2 first:pl-5 last:pr-5 whitespace-nowrap">
          <Skeleton className="h-6" />
        </td>
        <td className="px-2 first:pl-5 last:pr-5 whitespace-nowrap">
          <Skeleton className="h-6" />
        </td>
        <td className="px-2 first:pl-5 last:pr-5 whitespace-nowrap w-px">
          <Skeleton width={80} className="h-6" />
        </td>
      </tr>
    ));
};
