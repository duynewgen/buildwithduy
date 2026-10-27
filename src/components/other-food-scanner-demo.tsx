const MEAL_SRC = "/other/food-scan.png";

export function OtherMealAnalysisDemo() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-white">
      <img src={MEAL_SRC} alt="" className="h-full w-full object-cover object-center" />
      <span className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-150 group-hover:opacity-100">
        <span className="h-8 w-8 rounded-full border-2 border-red-200 border-t-red-700 group-hover:animate-spin" />
      </span>
    </div>
  );
}
