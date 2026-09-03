from agent.monitor import get_all_metrics


def test_cpu_metrics_include_processor_name():
    data = get_all_metrics()
    assert 'processor_name' in data['cpu']
    assert isinstance(data['cpu']['processor_name'], str)
