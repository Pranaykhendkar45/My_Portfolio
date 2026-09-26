// Sheryians-style label: chhota bordered tag jiske 4 corners pe dots hote hain.
const dot = "absolute w-[3px] h-[3px] bg-black/60 z-10";

export default function SectionBadge({ children }) {
  return (
    <h2 className="relative inline-block w-fit px-4 pt-1.5 mx-auto uppercase text-xl md:text-2xl font-display font-light leading-none text-black/90 border-[0.5px] border-[#E8602E] bg-[#e8602e21]">
      {children}
      <span className={`${dot} top-0 left-0 -translate-x-1/2 -translate-y-1/2`} />
      <span className={`${dot} top-0 right-0 translate-x-1/2 -translate-y-1/2`} />
      <span className={`${dot} bottom-0 left-0 -translate-x-1/2 translate-y-1/2`} />
      <span className={`${dot} bottom-0 right-0 translate-x-1/2 translate-y-1/2`} />
    </h2>
  );
}
