type Props = {
  value: string;
  onChange: (v: string) => void;
};

export default function SearchBar({ value, onChange }: Props) {
  return (
    <input
      className="input"
      placeholder="Search coin by name or symbol..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
