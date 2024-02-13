import {
  RiCheckboxCircleFill,
  RiCircleFill,
  RiCircleLine,
  RiCloseCircleFill,
  RiErrorWarningFill,
  RiIndeterminateCircleFill,
  RiMoreFill,
  RiProgress4Fill,
  RiSignalWifi1Fill,
  RiSignalWifi2Fill,
  RiSignalWifi3Fill,
} from "@remixicon/react";
import Avatar from "./Avatar";

export const imageMappings = {
  Todo: RiCircleLine,
  Done: RiCheckboxCircleFill,
  "In progress": RiProgress4Fill,
  Cancelled: RiCloseCircleFill,
  Backlog: RiIndeterminateCircleFill,
  "No priority": RiMoreFill,
  Low: RiSignalWifi1Fill,
  Medium: RiSignalWifi2Fill,
  High: RiSignalWifi3Fill,
  Urgent: RiErrorWarningFill,
  "Feature Request": RiCircleFill,
};

function IconRenderer({ size, name, isUser, userIsAvailable }) {
  if (isUser) {
    return <Avatar userIsAvailable={userIsAvailable} userName={name} />;
  }
  const Icon = imageMappings[name];
  if (Icon) {
    return <Icon size={size || 20} />;
  }
  return null;
}

export default IconRenderer;
