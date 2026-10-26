const MEAL_SRC = "/other/food-scan.png";

export function OtherFoodScannerDemo() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-white">
      <img src={MEAL_SRC} alt="" className="h-full w-full object-cover object-center" />
      <span className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-red-600 opacity-0 shadow-[0_0_12px_#dc2626] transition-opacity duration-150 group-hover:opacity-100 group-hover:animate-food-scan" />
    </div>
  );
}
