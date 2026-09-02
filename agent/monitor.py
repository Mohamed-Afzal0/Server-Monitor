import psutil
import datetime

def get_cpu():
    return{ 
        "usage_percent":psutil.cpu_percent(interval=1),
        "core_count":psutil.cpu_count(logical=True),
    }

def get_memory():
    mem = psutil.virtual_memory()
    return {
        "total_gb": round(mem.total / (1024 ** 3), 2),
        "used_gb": round(mem.used / (1024 ** 3), 2),
        "usage_percent": mem.percent
    }

def get_disk():
    disk = psutil.disk_usage('/')
    return {
        "total_gb": round(disk.total / (1024 ** 3), 2),
        "used_gb": round(disk.used / (1024 ** 3), 2),
        "usage_percent": disk.percent
    }

def get_network():
    net = psutil.net_io_counters()
    return {
        "bytes_sent_mb": round(net.bytes_sent / (1024 ** 2), 2),
        "bytes_recv_mb": round(net.bytes_recv / (1024 ** 2), 2)
    }

def get_all_metrics():
    return {
        "timestamp": datetime.datetime.now().isoformat(),
        "cpu": get_cpu(),
        "memory": get_memory(),
        "disk": get_disk(),
        "network": get_network()
    }

if __name__ == "__main__":
    import json
    metrics = get_all_metrics()
    print(json.dumps(metrics, indent=2))