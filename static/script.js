const cpuGauge = document.getElementById('cpuGauge');
const memoryGauge = document.getElementById('memoryGauge');
const networkCard = document.querySelector('.network-card');
const diskBox = document.getElementById('disk-box');
const gaugeGeometry = new WeakMap();
const gaugeCircumference = 2 * Math.PI * 80;
const gaugeGapPercent = 0.3;
const gaugeArcPercent = 1 - gaugeGapPercent;
const gaugeArcLength = gaugeCircumference * gaugeArcPercent;
const gaugeArcSweep = 360 * gaugeArcPercent;

function initializeGauge(gauge) {
  const ticks = gauge.querySelector('.ticks');
  const track = gauge.querySelector('.track');
  const progress = gauge.querySelector('.progress');
  const needle = gauge.querySelector('.needle');

  track.style.strokeDasharray = `${gaugeArcLength} ${gaugeCircumference}`;

  for (let percentage = 0; percentage <= 100; percentage += 5) {
    const angle = (gaugeArcSweep * percentage) / 100;
    const radians = (angle * Math.PI) / 180;
    const outerRadius = 74;
    const innerRadius = percentage % 10 === 0 ? 62 : 68;
    const tick = document.createElementNS('http://www.w3.org/2000/svg', 'line');

    tick.setAttribute('class', percentage % 10 === 0 ? 'tick major' : 'tick');
    tick.setAttribute('x1', 100 + Math.cos(radians) * outerRadius);
    tick.setAttribute('y1', 100 + Math.sin(radians) * outerRadius);
    tick.setAttribute('x2', 100 + Math.cos(radians) * innerRadius);
    tick.setAttribute('y2', 100 + Math.sin(radians) * innerRadius);
    ticks.appendChild(tick);
  }

  gaugeGeometry.set(gauge, { progress, needle });
}

document.querySelectorAll('.gauge').forEach(initializeGauge);

function clampPercent(value) {
  return Math.min(100, Math.max(0, Number(value) || 0));
}

function setGaugeValue(gauge, value) {
  const percent = clampPercent(value);
  const { progress, needle } = gaugeGeometry.get(gauge);
  const ratio = percent / 100;

  progress.style.strokeDasharray = `${gaugeArcLength * ratio} ${gaugeCircumference}`;
  progress.style.strokeDashoffset = 0;
  needle.style.transform = `rotate(${gaugeArcSweep * ratio}deg)`;
}

function setAlertState(element, isAlert) {
  element.classList.toggle('alert', isAlert);
}

function setCriticalState(cpuAlert, memoryAlert, diskAlert) {
  const critical = cpuAlert && memoryAlert && diskAlert;
  networkCard.classList.toggle('critical-alert', critical);
  document.body.classList.toggle('critical-system', critical);
}

function updateCpu(data) {
  const percent = clampPercent(data.cpu.usage_percent);
  setGaugeValue(cpuGauge, percent);
  const isAlert = percent > 50;
  setAlertState(cpuGauge, isAlert);
  document.getElementById('cpu-reading').textContent = Math.round(percent);
  const processorName = data.cpu.processor_name || 'Unknown CPU';
  document.getElementById('cpu-name').textContent = processorName;
  return isAlert;
}

function updateMemory(data) {
  const percent = clampPercent(data.memory.usage_percent);
  setGaugeValue(memoryGauge, percent);
  const isAlert = percent > 60;
  setAlertState(memoryGauge, isAlert);
  document.getElementById('memory-reading').textContent = Math.round(percent);
  return isAlert;
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
  const isAlert = percent > 80;
  setAlertState(box, isAlert);
  return isAlert;
}

async function fetchMetrics() {
  try {
    const response = await fetch('/metrics');
    const data = await response.json();

    document.getElementById('timestamp').textContent =
      `Last updated: ${new Date(data.timestamp).toLocaleTimeString()}`;

    const cpuAlert = updateCpu(data);
    const memoryAlert = updateMemory(data);
    updateNetwork(data);
    const diskAlert = updateDisk(data);
    setCriticalState(cpuAlert, memoryAlert, diskAlert);
  } catch (error) {
    console.error('Failed to fetch metrics:', error);
  }
}

fetchMetrics();
setInterval(fetchMetrics, 3000);