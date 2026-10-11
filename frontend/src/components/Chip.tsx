export function Chip({
  label,
  on,
  onClick,
}: {
  label: string;
  on: boolean;
  onClick: () => void;
}) {
  return (
    <button type="button" className={`chip ${on ? "on" : ""}`} onClick={onClick}>
      {label}
    </button>
  );
}
