import { useState } from "react";
import { Switch } from "@headlessui/react";

interface Props {
  label?: string;
  description: string;
  enabled: boolean;
  onSwitch: () => void;
}

const classNames = (...classes: any) => {
  return classes.filter(Boolean).join(" ");
};

const ToggleSwitch: React.FC<Props> = ({
  label,
  description,
  enabled,
  onSwitch,
}) => {
  return (
    <Switch.Group as="div" className="flex items-center justify-between">
      <span className="flex-grow flex flex-col w-72">
        <Switch.Label
          as="span"
          className="text-sm font-medium text-gray-900"
          passive
        >
          {label}
        </Switch.Label>
        <Switch.Description as="span" className="text-sm text-gray-500">
          {description}
        </Switch.Description>
      </span>
      <Switch
        checked={enabled}
        onChange={onSwitch}
        className={classNames(
          enabled ? "bg-indigo-600" : "bg-gray-200",
          "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        )}
      >
        <span
          aria-hidden="true"
          className={classNames(
            enabled ? "translate-x-5" : "translate-x-0",
            "flex-none justify-end pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
          )}
        />
      </Switch>
    </Switch.Group>
  );
};

export default ToggleSwitch;
