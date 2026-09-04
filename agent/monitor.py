import psutil, datetime, os, platform, subprocess, re

def get_cpu():
    return{
        "usage_percent": psutil.cpu_percent(interval=1),
        "core_count": psutil.cpu_count(logical=True),
        "processor_name": get_processor_name(),
    }

def get_processor_name():
    if platform.system() == "Windows":
        return platform.processor()
    elif platform.system() == "Darwin":
        os.environ['PATH'] = os.environ['PATH'] + os.pathsep + '/usr/sbin'
        command ="sysctl -n machdep.cpu.brand_string"
        return subprocess.check_output(command).strip()
    elif platform.system() == "Linux":
        command = "cat /proc/cpuinfo"
        all_info = subprocess.check_output(command, shell=True).decode().strip()
        for line in all_info.split("\n"):
            if "model name" in line:
                return re.sub( ".*model name.*:", "", line,1)
    return ""

def get_gpu():
    try:
        if platform.system() == "Linux":
            # NVIDIA
            try:
                output = subprocess.check_output(
                    "nvidia-smi --query-gpu=name --format=csv,noheader",
                    shell=True,
                    text=True
                )
                name = output.strip().splitlines()[0]
                if name:
                    return {
                        "detected": True,
                        "name": name
                    }
            except Exception:
                pass

            # Generic GPU info fallback
            try:
                output = subprocess.check_output(
                    "lspci | grep -i 'vga\\|3d\\|display'",
                    shell=True,
                    text=True
                )
                if output.strip():
                    return {
                        "detected": True,
                        "name": output.strip().splitlines()[0]
                    }
            except Exception:
                pass

            return {
                "detected": False,
                "name": "No GPU detected",
                "usage_percent": None
            }

        elif platform.system() == "Windows":
            try:
                output = subprocess.check_output(
                    'wmic path win32_VideoController get name',
                    shell=True,
                    text=True
                )
                lines = [line.strip() for line in output.splitlines() if line.strip() and "Name" not in line]
                if lines:
                    return {
                        "detected": True,
                        "name": lines[0],
                        "usage_percent": None
                    }
            except Exception:
                pass

            return {
                "detected": False,
                "name": "No GPU detected",
                "usage_percent": None
            }

        elif platform.system() == "Darwin":
            try:
                output = subprocess.check_output(
                    "system_profiler SPDisplaysDataType | grep 'Chipset' | head -n 1",
                    shell=True,
                    text=True
                )
                if output.strip():
                    return {
                        "detected": True,
                        "name": output.split(":", 1)[1].strip(),
                        "usage_percent": None
                    }
            except Exception:
                pass

            return {
                "detected": False,
                "name": "No GPU detected",
                "usage_percent": None
            }

    except Exception:
        return {
            "detected": False,
            "name": "No GPU detected",
            "usage_percent": None
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
        "gpu": get_gpu(),
        "memory": get_memory(),
        "disk": get_disk(),
        "network": get_network()
    }

if __name__ == "__main__":
    import json
    metrics = get_all_metrics()
    print(json.dumps(metrics, indent=2))