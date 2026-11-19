
import { categories } from "@/data/equipment-categories";

interface CategorySelectProps {
  value: string;
  onChange: (value: string) => void;
}

export default function CategorySelect({
  value,
  onChange,
}: CategorySelectProps) {
  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text font-medium">Category</span>
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="select select-bordered w-full"
        required
      >
        <option value="" disabled>
          Select a category
        </option>

        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
}
