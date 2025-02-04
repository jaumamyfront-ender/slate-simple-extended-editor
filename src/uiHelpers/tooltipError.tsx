import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { usePopperTooltip } from "react-popper-tooltip";
import "react-popper-tooltip/dist/styles.css";

interface FieldTooltipErrorProps {
  error?: any;
  className?: string;
  isAbsolute?: boolean;
  minLength?: number;
  maxLength?: number;
}

const Tooltip = ({ trigger, children }: any) => {
  const {
    getArrowProps,
    getTooltipProps,
    setTooltipRef,
    setTriggerRef,
    visible,
  } = usePopperTooltip({ placement: "top" });

  return (
    <div tw="relative inline-block">
      <div ref={setTriggerRef} tw="cursor-pointer text-error text-lg">
        {trigger}
      </div>
      {visible && (
        <div
          ref={setTooltipRef}
          {...getTooltipProps({ className: "tooltip-container" })}
          tw="bg-error text-white text-xs py-2 px-3 rounded shadow-md z-50"
        >
          <div {...getArrowProps({ className: "tooltip-arrow" })} />
          {children}
        </div>
      )}
    </div>
  );
};

const FieldTooltipError = ({
  error,
  className,
  isAbsolute,
  minLength,
  maxLength,
}: FieldTooltipErrorProps) => {
  if (!error) return null;

  return (
    <Tooltip
      trigger={
        <FontAwesomeIcon icon={faCircleExclamation} className={className} />
      }
    >
      {`${error?.message ? error?.message : error?.type}${
        error.type === "maxLength" ? maxLength : minLength
      }`}
    </Tooltip>
  );
};

export { FieldTooltipError };
