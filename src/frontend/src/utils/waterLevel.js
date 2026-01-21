import { WATER_LEVELS, WATER_STAGES, NETWORK_STAGES } from "./constants.js";

export function waterStageFrom(device) {
  if (!device.online || device.water === null || device.water === undefined) {
    return WATER_STAGES.UNK;
  }
  const w = Number(device.water);
  if (Number.isNaN(w)) return WATER_STAGES.UNK;

  if (w >= WATER_LEVELS.CRIT) return WATER_STAGES.CRIT;
  if (w >= WATER_LEVELS.WARN) return WATER_STAGES.WARN;
  if (w >= WATER_LEVELS.CAUTION) return WATER_STAGES.CAUTION;
  return WATER_STAGES.OK;
}

export function waterText(stage) {
  switch (stage) {
    case WATER_STAGES.CRIT:
      return "심각 (90% ⇡)";
    case WATER_STAGES.WARN:
      return "경계 (80% ⇡)";
    case WATER_STAGES.CAUTION:
      return "주의 (70% ⇡)";
    case WATER_STAGES.OK:
      return "정상 (<70%)";
    default:
      return "UnKnown";
  }
}

export function networkStage(device) {
  if (!device) return NETWORK_STAGES.UNK;
  if (device.netError === true) return NETWORK_STAGES.ERROR;
  if (!device.online || device.water === null) return NETWORK_STAGES.UNK;
  return NETWORK_STAGES.OK;
}

export function networkLabel(device) {
  const stage = networkStage(device);
  if (stage === NETWORK_STAGES.OK) return "Operational";
  if (stage === NETWORK_STAGES.ERROR) return "Network Error";
  return "Unknown";
}

export function fillColorByStage(stage) {
  switch (stage) {
    case WATER_STAGES.CRIT:
      return "rgba(255, 77, 79, .90)";
    case WATER_STAGES.WARN:
      return "rgba(255, 159, 26, .90)";
    case WATER_STAGES.CAUTION:
      return "rgba(247, 201, 72, .90)";
    case WATER_STAGES.OK:
      return "rgba(39, 196, 107, .90)";
    default:
      return "rgba(154, 167, 183, .85)";
  }
}

export function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}
