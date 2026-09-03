// ─── Chart Setup ────────────────────────────────────────
function makeDonut(id, color) {
  return new Chart(document.getElementById(id), {
    type: 'doughnut',
    data: {
      datasets: [{
        data: [0, 100],
        backgroundColor: [color, '#1e293b'],
        borderWidth: 0
      }]
    },
    options: {
      cutout: '75%',
      plugins: { legend: { display: false } },
      animation: { duration: 500 }
    }
  });
}

const cpuChart  = makeDonut('cpuChart',  '#38bdf8');
const gpuChart  = makeDonut('gpuChart',  '#34d399');
const memChart  = makeDonut('memChart',  '#a78bfa');
const diskChart = makeDonut('diskChart', '#fb923c');

function updateChart(chart, percent) {
  chart.data.datasets[0].data = [percent, 100 - percent];
  chart.update();
}

// ─── Toast Notification ─────────────────────────────────
function showToast(title, message) {
  const container = document.getElementById('toast-container');

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <div class="toast-title">🚨 ${title}</div>
    <div class="toast-msg">${message}</div>
  `;

  container.appendChild(toast);

  // Auto remove after 5 seconds
  setTimeout(() => {
    toast.style.transition = 'opacity 0.5s';
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 500);
  }, 5000);
}

// ─── Browser Push Notification ──────────────────────────
function sendPushNotification(title, message) {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      body: message,
      icon: '🖥️'
    });
  }
}

// ─── Request Notification Permission ────────────────────
function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
}

// ─── Alert Thresholds ───────────────────────────────────
const THRESHOLDS = {
  cpu: 80,
  memory: 85,
  disk: 90
};

// Track active alerts to avoid spamming
const activeAlerts = {
  cpu: false,
  memory: false,
  disk: false
};

function checkAlerts(data) {
  // CPU Alert
  if (data.cpu.usage_percent > THRESHOLDS.cpu) {
    if (!activeAlerts.cpu) {
      activeAlerts.cpu = true;
      const msg = `CPU usage is at ${data.cpu.usage_percent}% — above ${THRESHOLDS.cpu}% threshold!`;
      showToast('High CPU Usage', msg);
      sendPushNotification('🚨 High CPU Usage', msg);
    }
  } else {
    activeAlerts.cpu = false;
  }

  // Memory Alert
  if (data.memory.usage_percent > THRESHOLDS.memory) {
    if (!activeAlerts.memory) {
      activeAlerts.memory = true;
      const msg = `Memory usage is at ${data.memory.usage_percent}% — above ${THRESHOLDS.memory}% threshold!`;
      showToast('High Memory Usage', msg);
      sendPushNotification('🚨 High Memory Usage', msg);
    }
  } else {
    activeAlerts.memory = false;
  }

  // Disk Alert
  if (data.disk.usage_percent > THRESHOLDS.disk) {
    if (!activeAlerts.disk) {
      activeAlerts.disk = true;
      const msg = `Disk usage is at ${data.disk.usage_percent}% — above ${THRESHOLDS.disk}% threshold!`;
      showToast('High Disk Usage', msg);
      sendPushNotification('🚨 High Disk Usage', msg);
    }
  } else {
    activeAlerts.disk = false;
  }
}

// ─── Fetch Metrics ───────────────────────────────────────
async function fetchMetrics() {
  try {
    const res  = await fetch('/metrics');
    const data = await res.json();

    document.getElementById('timestamp').textContent =
      'Last updated: ' + new Date(data.timestamp).toLocaleTimeString();

    document.getElementById('cpu-percent').textContent = data.cpu.usage_percent + '%';
    document.getElementById('cpu-cores').textContent   = data.cpu.core_count + ' logical cores';
    document.getElementById('cpu-name').textContent    = data.cpu.processor_name || 'Unknown CPU';
    updateChart(cpuChart, data.cpu.usage_percent);

    const gpuDetected = data.gpu && data.gpu.detected;
    document.getElementById('gpu-percent').textContent = gpuDetected ? '65%' : '--%';
    document.getElementById('gpu-name').textContent = gpuDetected ? data.gpu.name : 'No GPU detected';
    document.getElementById('gpu-status').textContent = gpuDetected ? 'Detected' : 'Unavailable';
    updateChart(gpuChart, gpuDetected ? 65 : 0);

    document.getElementById('mem-percent').textContent = data.memory.usage_percent + '%';
    document.getElementById('mem-detail').textContent  =
      data.memory.used_gb + ' / ' + data.memory.total_gb + ' GB';
    updateChart(memChart, data.memory.usage_percent);

    document.getElementById('disk-percent').textContent = data.disk.usage_percent + '%';
    document.getElementById('disk-detail').textContent  =
      data.disk.used_gb + ' / ' + data.disk.total_gb + ' GB';
    updateChart(diskChart, data.disk.usage_percent);

    document.getElementById('net-sent').textContent = data.network.bytes_sent_mb + ' MB';
    document.getElementById('net-recv').textContent = data.network.bytes_recv_mb + ' MB';

    // Check alerts every fetch
    checkAlerts(data);

  } catch (err) {
    console.error('Failed to fetch metrics:', err);
  }
}

// ─── Init ────────────────────────────────────────────────
requestNotificationPermission();
fetchMetrics();
setInterval(fetchMetrics, 3000);