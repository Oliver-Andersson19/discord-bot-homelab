import { getTotalUniFiUsers, getMemoryUsageGB, getCpuUsagePercent, getProxmoxTemps } from "../prometheus.js";

export default {
  name: "status",
  description: "Get full network and host status",
  async execute(message) {
    try {
    //   const [users, deviceTemps, proxmoxTemps] = await Promise.all([
    //     getUniFiUsers(),
    //     getDeviceTemps(),
    //     getProxmoxTemps()
    //   ]);

        const totalNetworkUsers = await getTotalUniFiUsers();
        const memoryUsageGB = await getMemoryUsageGB();
        const cpuUsagePercent = await getCpuUsagePercent();
        const proxmoxTemp = await getProxmoxTemps();

        let reply = ``
        
        reply += `**Temperatures**\n`;
        reply += `Motherboard Zone 0: ${proxmoxTemp.zone0}\n`
        reply += `Motherboard Zone 1: ${proxmoxTemp.zone1}\n`
        reply += `CPU: ${proxmoxTemp.cpu}\n\n`
        
        reply += `**Network Status**\n`;
        reply += `Total Connected Clients: ${totalNetworkUsers}\n\n`;

        reply += `**CPU Usage**\n`;
        reply += `Percentage: ${cpuUsagePercent}\n`;
        reply += `Temp: ${proxmoxTemp.cpu}\n\n`
        
        
        reply += `**Memory Usage**\n`;
        reply += `${memoryUsageGB}\n\n`;

    //   reply += `**UniFi Device Temperatures:**\n`;
    //   deviceTemps.forEach(d => {
    //     reply += `${d.name}: ${d.temp}°C\n`;
    //   });

    //   reply += `\n**Proxmox Node Temperatures:**\n`;
    //   proxmoxTemps.forEach(n => {
    //     reply += `${n.name}: ${n.temp}°C\n`;
    //   });

        message.reply(reply);
    } catch (err) {
        console.error(err);
        message.reply("Failed to fetch status from Prometheus.");
    }
  }
};
