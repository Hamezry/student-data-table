import { Select, type SelectProps } from "@mantine/core";
import { ArrowDown2 } from "iconsax-react";

type FloatingLabelSelectProps = SelectProps & {
  label: string;
};

export default function FloatingLabelSelect({
  label,
  ...props
}: FloatingLabelSelectProps) {
  return (
    <div className="relative mt-6 max-w-[400px] ">
      <label className="absolute -top-2.5 left-4 text-[14px] text-gray-600 bg-white z-10">
        {label}
      </label>

      <Select
        classNames={{
          input:
            "!h-16  !py-2 !px-3 text-sm placeholder:text-xs border !border-[#ADB7BE] focus:border-gray-300 focus:ring-0 !rounded-md",
        }}
        rightSection={<ArrowDown2 size={18} color="#6B7280" variant="Linear" />}
        rightSectionWidth={30}
        radius={0} // This disables Mantine's built-in rounding
        {...props}
      />
    </div>
  );
}

