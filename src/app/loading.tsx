export default function Loading() {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[3px]">
      <div className="h-full w-1/3 animate-[pe-loading_1.2s_ease-in-out_infinite] gold-gradient" />
    </div>
  );
}
