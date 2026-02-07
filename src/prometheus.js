import { CONFIG } from "../config/config.js";

export async function fetchPrometheus(query) {
    const url = `${CONFIG.prometheusUrl}/api/v1/query?query=${encodeURIComponent(query)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Prometheus query failed: ${res.statusText}`);
    const data = await res.json();
    return data.data.result || [];
}

// Specific queries
export async function getTotalUniFiUsers() {
    const result = await fetchPrometheus('sum(unpoller_site_users)');
    if (!result || result.length === 0) return 'No users data';
    return result[0]?.value[1];
}

export async function getMemoryUsageGB() {
    const totalResult = await fetchPrometheus('node_memory_MemTotal_bytes');
    if (!totalResult || totalResult.length === 0) return 'No Memory data';
    const availResult = await fetchPrometheus('node_memory_MemAvailable_bytes');
    if (!availResult || totalResult.length === 0) return 'No Memory data';


    const totalGB = Number(totalResult[0]?.value[1] || 0) / 1024 / 1024 / 1024;
    const availGB = Number(availResult[0]?.value[1] || 0) / 1024 / 1024 / 1024;
    const usedGB = totalGB - availGB;

    return `${usedGB.toFixed(2)} / ${totalGB.toFixed(2)} GB`;
}

export async function getCpuUsagePercent() {
    const result = await fetchPrometheus(
        '100 - (avg by(instance) (rate(node_cpu_seconds_total{mode="idle"}[1m])) * 100)'
    );
    if (!result || result.length === 0) return 'No CPU data';

    const value = Number(result[0]?.value[1] || 0);
    return value.toFixed(1); // returns string like "4.3"
}

export async function getProxmoxTemps() {
    const result = await fetchPrometheus('node_thermal_zone_temp');
    if (!result || result.length === 0) return 'No temperature data';

    const temps = {
        zone0: result[0].value[1] + "°C",
        zone1: result[1].value[1] + "°C",
        cpu: result[2].value[1] + "°C"
    }

    return temps;
}

export async function checkForNewDevices() {
    const result = await fetchPrometheus('unpoller_client_uptime_seconds');
    if (!result || result.length === 0) return 'No clients data';

    const clients = result.map((c) => {   
        const name = c.metric.name || 'Unknown device';
        const wired = c.metric.wired || 'Unknown';
        const network = c.metric.network || 'Unknown'
        const ip = c.metric.ip || 'Unknown'
        

        return `${wired === "true" ? '🔌' : '📶'}  **${name}** on Network: **${network}** - IP: **${ip}** \n`;
    })

    console.log(clients)

    return clients.join('');
}