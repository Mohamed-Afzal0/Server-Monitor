const cpuGauge = document.getElementById('cpuGauge');
const memoryGauge = document.getElementById('memoryGauge');
const gpuGauge = document.getElementById('gpuGauge');

function clampPercent(value) {
  return Math.min(100, Math.max(0, Number(value) || 0));
}

function setGaugeValue(gauge, value) {
  const percent = clampPercent(value);
  const ratio = percent / 100;
  gauge.style.setProperty('--gauge-value', ratio.toFixed(3));
}

function updateCpu(data) {
  const percent = clampPercent(data.cpu.usage_percent);
  setGaugeValue(cpuGauge, percent);
  document.getElementById('cpu-reading').textContent = `${Math.round(percent)}%`;
  const processorName = data.cpu.processor_name || 'Unknown CPU';
  document.getElementById('cpu-name').textContent = processorName;
}

function updateMemory(data) {
  const percent = clampPercent(data.memory.usage_percent);
  setGaugeValue(memoryGauge, percent);
  document.getElementById('memory-reading').textContent = `${Math.round(percent)}%`;
}

function updateGpu(data) {
  const gpu = data.gpu || {};
  const usage = Number(gpu.usage_percent);
  const percent = Number.isFinite(usage) ? clampPercent(usage) : 0;
  setGaugeValue(gpuGauge, percent);

  const valueText = gpu.detected ? `${Math.round(percent)}%` : 'N/A';
  document.getElementById('gpu-reading').textContent = valueText;
}

function updateNetwork(data) {
  const network = data.network || {};
  const rx = Number(network.bytes_recv_mb) || 0;
  const tx = Number(network.bytes_sent_mb) || 0;

  document.getElementById('rx-speed').textContent = `${rx.toFixed(1)} MB/s`;
  document.getElementById('tx-speed').textContent = `${tx.toFixed(1)} MB/s`;
}

function updateDisk(data) {
  const disk = data.disk || {};
  const total = Number(disk.total_gb) || 0;
  const used = Number(disk.used_gb) || 0;
  const percent = clampPercent(disk.usage_percent);
  const box = document.getElementById('disk-box');
  box.textContent = `HDD ${used.toFixed(1)} GB / ${total.toFixed(1)} GB (${Math.round(percent)}%)`;
}

async function fetchMetrics() {
  try {
    const response = await fetch('/metrics');
    const data = await response.json();

    document.getElementById('timestamp').textContent =
      `Last updated: ${new Date(data.timestamp).toLocaleTimeString()}`;

    updateCpu(data);
    updateMemory(data);
    updateGpu(data);
    updateNetwork(data);
    updateDisk(data);
  } catch (error) {
    console.error('Failed to fetch metrics:', error);
  }
}

fetchMetrics();
setInterval(fetchMetrics, 3000);