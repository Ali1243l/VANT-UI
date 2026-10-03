interface Props {
  aspectRatioClass?: string;
}

export default function SkeletonCard({ aspectRatioClass = 'aspect-[3/4]' }: Props) {
  return (
    <div className="relative mb-3 sm:mb-4 overflow-hidden rounded-xl sm:rounded-2xl border border-black/5 dark:border-white/10 bg-white/70 dark:bg-[#15171e]/70 p-2 sm:p-2.5 shadow-2xs">
      {/* Image Skeleton Box with Linear Shimmer Sweep */}
      <div className={`relative overflow-hidden rounded-lg sm:rounded-xl bg-black/[0.04] dark:bg-white/[0.05] ${aspectRatioClass}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/[0.06] dark:via-white/[0.08] to-transparent animate-shimmer" />
        
        {/* Subtle top tag placeholder */}
        <div className="absolute top-2 ltr:left-2 rtl:right-2 h-4 w-14 rounded-md bg-black/[0.06] dark:bg-white/[0.08]" />
      </div>

      {/* Typography Skeleton Placeholders */}
      <div className="mt-2.5 px-0.5 space-y-1.5">
        {/* Category placeholder */}
        <div className="h-2.5 w-16 rounded bg-black/[0.05] dark:bg-white/[0.06]" />

        {/* Title placeholder */}
        <div className="h-3.5 w-3/4 rounded bg-black/[0.08] dark:bg-white/[0.1]" />

        {/* Price & fabric placeholder */}
        <div className="flex items-center justify-between pt-1">
          <div className="h-3 w-12 rounded bg-black/[0.07] dark:bg-white/[0.09]" />
          <div className="h-3 w-20 rounded bg-black/[0.04] dark:bg-white/[0.05]" />
        </div>
      </div>
    </div>
  );
}
