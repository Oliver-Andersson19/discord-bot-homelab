import { checkForNewDevicesRaw } from "./prometheus.js";

// Keep the previous snapshot
let knownDevices = new Map(); // mac -> device

export async function pollForDeviceChanges({ onJoin, onLeave }) {
  const devices = await checkForNewDevicesRaw();

  // Build a map of current devices: mac -> device
  const currentDevices = new Map();
  devices.forEach(device => {
    if (device.mac) currentDevices.set(device.mac, device);
  });

  // Joins: devices in current but not in known
  for (const [mac, device] of currentDevices) {
    if (!knownDevices.has(mac)) {
      onJoin?.(device);
    }
  }

  // Leaves: devices in known but not in current
  for (const [mac, device] of knownDevices) {
    if (!currentDevices.has(mac)) {
      onLeave?.(device);
    }
  }

  // Update snapshot for next poll
  knownDevices = currentDevices;
}
