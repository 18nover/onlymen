# Monitoring

## Overview

Monitoring stack configuration covering Prometheus metrics, Grafana dashboards, alert rules, log aggregation, distributed tracing, and SLOs/SLIs.

## Prometheus Metrics

### Application Metrics

```python
from prometheus_client import Counter, Histogram, Gauge, Info

# Request metrics
http_requests_total = Counter(
    'http_requests_total',
    'Total HTTP requests',
    ['method', 'endpoint', 'status']
)

http_request_duration_seconds = Histogram(
    'http_request_duration_seconds',
    'HTTP request duration',
    ['method', 'endpoint'],
    buckets=[0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1.0, 2.5, 5.0, 10.0]
)

# Business metrics
active_users = Gauge(
    'active_users_current',
    'Current number of active users'
)

posts_created_total = Counter(
    'posts_created_total',
    'Total posts created',
    ['type']
)

# System metrics
db_connection_pool_size = Gauge(
    'db_connection_pool_size',
    'Database connection pool size',
    ['state']  # active, idle
)

app_info = Info('app', 'Application information')
app_info.info({
    'version': '1.2.3',
    'environment': 'production',
    'commit': 'abc1234'
})
```

### Recording Rules

```yaml
# prometheus-rules.yml
groups:
  - name: application_rules
    rules:
      - record: http_request_duration:p99
        expr: histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m]))

      - record: http_request_duration:p95
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))

      - record: http_requests:rate5m
        expr: rate(http_requests_total[5m])

      - record: http_errors:ratio
        expr: rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m])
```

## Grafana Dashboards

### Dashboard Structure

```json
{
  "dashboard": {
    "title": "Application Overview",
    "panels": [
      {
        "title": "Request Rate",
        "type": "timeseries",
        "targets": [{
          "expr": "sum(rate(http_requests_total[5m])) by (endpoint)",
          "legendFormat": "{{endpoint}}"
        }]
      },
      {
        "title": "Error Rate",
        "type": "stat",
        "targets": [{
          "expr": "100 * http_errors:ratio",
          "legendFormat": "Error %"
        }],
        "fieldConfig": {
          "defaults": {
            "thresholds": {
              "steps": [
                {"value": 0, "color": "green"},
                {"value": 1, "color": "yellow"},
                {"value": 5, "color": "red"}
              ]
            }
          }
        }
      },
      {
        "title": "Latency Distribution",
        "type": "heatmap",
        "targets": [{
          "expr": "sum(rate(http_request_duration_seconds_bucket[5m])) by (le)",
          "format": "heatmap"
        }]
      },
      {
        "title": "Active Users",
        "type": "gauge",
        "targets": [{
          "expr": "active_users_current"
        }]
      }
    ]
  }
}
```

### Dashboard Variables

```json
{
  "templating": {
    "list": [
      {
        "name": "environment",
        "type": "custom",
        "query": "production,staging,development",
        "current": {"selected": true, "text": "production"}
      },
      {
        "name": "service",
        "type": "query",
        "query": "label_values(http_requests_total, service)",
        "multi": true
      }
    ]
  }
}
```

### Key Dashboard Panels

| Panel                 | Type        | Query                                      |
|-----------------------|-------------|--------------------------------------------|
| Request Rate          | Time series | `sum(rate(http_requests_total[5m]))`      |
| Error Rate            | Stat        | `100 * http_errors:ratio`                  |
| P50/P95/P99 Latency   | Time series | `histogram_quantile(0.99, ...)`           |
| Active Users          | Gauge       | `active_users_current`                     |
| CPU Usage             | Time series | `rate(process_cpu_seconds_total[5m])`     |
| Memory Usage          | Time series | `process_resident_memory_bytes`            |
| DB Connection Pool    | Time series | `db_connection_pool_size`                  |
| Queue Depth           | Gauge       | `message_queue_depth`                      |

## Alert Rules

### Critical Alerts

```yaml
# alerts.yml
groups:
  - name: critical
    rules:
      - alert: HighErrorRate
        expr: http_errors:ratio > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value | humanizePercentage }}"

      - alert: HighLatency
        expr: http_request_duration:p99 > 2.0
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "P99 latency exceeds 2s"

      - alert: ServiceDown
        expr: up == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Service {{ $labels.instance }} is down"

      - alert: HighMemoryUsage
        expr: process_resident_memory_bytes / 1024 / 1024 > 512
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Memory usage exceeds 512MB"
```

### Warning Alerts

```yaml
  - name: warning
    rules:
      - alert: SlowRequests
        expr: http_request_duration:p95 > 1.0
        for: 15m
        labels:
          severity: warning
        annotations:
          summary: "P95 latency elevated"

      - alert: DatabaseConnectionsHigh
        expr: db_connection_pool_size{state="active"} > 80
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "DB connection pool nearly exhausted"

      - alert: DiskSpaceLow
        expr: (node_filesystem_avail_bytes / node_filesystem_size_bytes) < 0.1
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "Disk space below 10%"
```

## Log Aggregation (Loki)

### Log Collection

```yaml
# promtail-config.yml
server:
  http_listen_port: 9080

positions:
  filename: /tmp/positions.yaml

clients:
  - url: http://loki:3100/loki/api/v1/push

scrape_configs:
  - job_name: app
    static_configs:
      - targets:
          - localhost
        labels:
          job: app
          environment: production
          __path__: /var/log/app/*.log

    pipeline_stages:
      - json:
          expressions:
            level: level
            msg: message
            trace_id: trace_id
      - labels:
          level:
          trace_id:
```

### Log Queries

```logql
# Error logs from specific service
{job="app"} |= "error" | logfmt | level="error"

# Logs with high latency
{job="app"} | json | duration > 1.0

# Error rate by endpoint
rate({job="app"} |= "error" [5m])

# Top 10 error messages
topk(10, sum by (msg) (count_over_time({job="app"} |= "error" [1h])))
```

## Distributed Tracing

### OpenTelemetry Configuration

```python
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter

provider = TracerProvider()
processor = BatchSpanProcessor(OTLPSpanExporter(endpoint="otel-collector:4317"))
provider.add_span_processor(processor)
trace.set_tracer_provider(provider)

tracer = trace.get_tracer(__name__)
```

### Span Creation

```python
@tracer.start_as_current_span("process_request")
def process_request(request):
    span = trace.get_current_span()
    span.set_attribute("user.id", request.user_id)
    span.set_attribute("request.method", request.method)

    with tracer.start_as_current_span("database_query"):
        result = db.execute(request.query)
        span.set_attribute("db.rows_affected", result.rowcount)

    with tracer.start_as_current_span("external_api"):
        external_data = call_external_api(request.external_id)

    return result
```

## SLOs and SLIs

### SLO Definition

```yaml
# slos.yml
slos:
  - name: "API Availability"
    sli:
      type: "availability"
      good_query: 'http_requests_total{status!~"5.."}'
      total_query: 'http_requests_total'
    objective: 99.9
    window: "30d"
    error_budget:
      policy: "burn-rate"
      burn_rate_thresholds:
        - window: "1h"
          threshold: 14.4   # 2% of budget per hour
        - window: "6h"
          threshold: 6.0
        - window: "1d"
          threshold: 1.0

  - name: "API Latency"
    sli:
      type: "latency"
      good_query: 'http_request_duration_seconds_bucket{le="0.5"}'
      total_query: 'http_request_duration_seconds_count'
    objective: 99.0
    window: "30d"
```

### SLI Metrics

| SLI              | Formula                                   | Target     |
|------------------|-------------------------------------------|------------|
| Availability     | successful requests / total requests       | 99.9%      |
| Latency (P95)    | requests < threshold / total requests     | 99.0%      |
| Error Rate       | error requests / total requests           | < 1%       |
| Throughput       | requests served within SLO / total        | 99.5%      |

### Error Budget

```python
def calculate_error_budget(slo_percent: float, window_days: int) -> dict:
    error_rate = 1 - (slo_percent / 100)
    total_minutes = window_days * 24 * 60
    allowed_downtime_minutes = total_minutes * error_rate

    return {
        "slo": slo_percent,
        "window_days": window_days,
        "allowed_downtime_minutes": allowed_downtime_minutes,
        "budget_remaining_pct": 100  # Start at 100%
    }
```

## On-Call Rotation

### Rotation Schedule

```yaml
# pagerduty-config.yml
rotation:
  schedule: "engineering-oncall"
  teams:
    - name: "primary"
      members:
        - user1@example.com
        - user2@example.com
      rotation: "weekly"
      handoff: "Monday 9am UTC"
    - name: "secondary"
      members:
        - user3@example.com
        - user4@example.com
      rotation: "weekly"
      handoff: "Monday 9am UTC"
      offset: "+7d"  # Stagger by 1 week
```

### Escalation Policy

```yaml
escalation:
  - delay: 0
    targets:
      - type: "primary_oncall"
        contact: "slack:#oncall"
  - delay: 5m
    targets:
      - type: "primary_oncall"
        contact: "phone"
  - delay: 15m
    targets:
      - type: "secondary_oncall"
        contact: "phone"
  - delay: 30m
    targets:
      - type: "engineering_manager"
        contact: "phone"
```

### Runbook Links

Each alert should include a link to its runbook:

```yaml
annotations:
  runbook_url: "https://wiki.example.com/runbooks/high-error-rate"
  dashboard_url: "https://grafana.example.com/d/app-overview"
```
