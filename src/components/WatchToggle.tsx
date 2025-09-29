type Props = {
  watched: boolean;
  onToggle: () => void;
};

export default function WatchToggle({ watched, onToggle }: Props) {
  return (
    <span
      className={`star ${watched ? "active" : ""}`}
      title={watched ? "Remove from watchlist" : "Add to watchlist"}
      onClick={onToggle}
      role="button"
      aria-label="toggle watch"
    >
      ★
    </span>
  );
}
