import "./RecycleBinIcon.css";

interface RecycleBinIcon {
  name: string;
  imageSrc: string;
  onDoubleClick?: () => void;
}

export function RecycleBinIcon({ name, imageSrc, onDoubleClick }: RecycleBinIcon) {
  return (
    <div className="desktop-icon" onDoubleClick={onDoubleClick}>
      <img src={imageSrc} alt={name} className="desktop-icon-image" />
      <span className="desktop-icon-label">{name}</span>
    </div>
  );
}
