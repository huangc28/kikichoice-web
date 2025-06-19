// components/DosageCard.tsx
import clsx from "clsx";

type Props = {
  species: string;
  phase: string;
  dose: string;
  color?: "blue" | "green" | "purple";
};

export default function DosageCard({
  species,
  phase,
  dose,
  color = "blue",
}: Props) {
  return (
    <div
      className={clsx(
        `bg-${color}-50`,
        "p-4 rounded-lg space-y-1 border border-opacity-10"
      )}
    >
      <h4 className={`font-medium text-${color}-800`}>{species}</h4>
      <p className={`text-sm text-${color}-700`}>{phase}：{dose}</p>
    </div>
  );
}
