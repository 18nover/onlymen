---
name: computer-vision
description: "Computer vision skill for Vision. Camera analysis, frame sampling, object detection (YOLOv8, TFLite), edge inference, cloud fallback, confidence scoring, deduplication, privacy rules, and alert generation."
version: 1.0.0
author: NottyBoi Engineering
agent: Vision
category: perception
tags:
  - computer-vision
  - object-detection
  - yolo
  - tflite
  - edge-inference
  - privacy
  - camera
---

# Computer Vision Skill

This skill covers camera-based perception for the Vision agent: capturing frames, detecting objects locally or in the cloud, scoring confidence, deduplicating results, enforcing strict privacy rules, and generating actionable alerts.

---

## 1. Camera Analysis Setup

### Camera Initialization

```python
import cv2

class CameraManager:
    def __init__(self, device_id=0, resolution=(640, 480), fps=15):
        self.cap = cv2.VideoCapture(device_id)
        self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, resolution[0])
        self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, resolution[1])
        self.cap.set(cv2.CAP_PROP_FPS, fps)

    def read_frame(self):
        ret, frame = self.cap.read()
        if not ret:
            raise CameraReadError(f"Failed to read from device")
        return frame

    def release(self):
        self.cap.release()
```

### Configuration Requirements

| Parameter        | Default   | Notes                                      |
|------------------|-----------|--------------------------------------------|
| `device_id`      | `0`       | USB index or RTSP URL for IP cameras       |
| `resolution`     | `640x480` | Higher res = more compute, better accuracy |
| `fps`            | `15`      | Balance between latency and CPU usage       |
| `buffer_size`    | `5`       | Frames held before processing              |
| `color_space`    | `BGR`     | OpenCV default; convert for model input     |

### Camera Health Checks

Before any detection loop, verify:

1. Camera device is accessible (`cap.isOpened()`)
2. Frame reads succeed for at least 3 consecutive frames
3. Frame resolution matches expected dimensions
4. No stale frames (compare timestamps between reads)

---

## 2. Frame Sampling Strategies

Do not process every frame. Use a sampling strategy matched to your hardware.

### Fixed Interval Sampling

Process every Nth frame. Simple and predictable.

```python
SAMPLE_INTERVAL = 3  # process every 3rd frame

for i, frame in enumerate(camera_stream):
    if i % SAMPLE_INTERVAL == 0:
        results = detect(frame)
```

### Motion-Triggered Sampling

Only process when scene change exceeds a threshold.

```python
import numpy as np

def motion_detected(current_frame, previous_frame, threshold=0.05):
    diff = cv2.absdiff(current_frame, previous_frame)
    non_zero = np.count_nonzero(diff)
    total = diff.size
    return (non_zero / total) > threshold
```

### Adaptive Sampling

Increase frame rate when objects of interest are detected; reduce when idle.

```python
class AdaptiveSampler:
    def __init__(self, min_interval=1, max_interval=10):
        self.min_interval = min_interval
        self.max_interval = max_interval
        self.current_interval = min_interval
        self.frames_since_detection = 0

    def update(self, detected):
        if detected:
            self.current_interval = self.min_interval
            self.frames_since_detection = 0
        else:
            self.frames_since_detection += 1
            self.current_interval = min(
                self.current_interval + 1,
                self.max_interval
            )

    def should_process(self, frame_count):
        return frame_count % self.current_interval == 0
```

### Recommended Strategies by Use Case

| Use Case              | Strategy            | Interval | Rationale                          |
|-----------------------|---------------------|----------|------------------------------------|
| Security monitoring   | Motion-triggered    | N/A      | Low idle CPU, fast on event        |
| Package detection     | Fixed interval      | 2-5s     | Packages appear slowly             |
| Occupancy counting    | Fixed interval      | 1-2s     | Needs frequent tallies             |
| Anomaly detection     | Adaptive            | Varies   | React to activity, save when calm  |

---

## 3. Object Detection

### YOLOv8 (Primary)

Use YOLOv8 for the best accuracy/speed tradeoff on supported hardware.

```python
from ultralytics import YOLO

model = YOLO("yolov8n.pt")  # nano model for edge devices

def detect_yolo(frame, confidence_threshold=0.5):
    results = model.predict(
        source=frame,
        conf=confidence_threshold,
        verbose=False
    )
    detections = []
    for box in results[0].boxes:
        detections.append({
            "class": results[0].names[int(box.cls)],
            "confidence": float(box.conf),
            "bbox": box.xyxy.tolist()[0],
        })
    return detections
```

### Model Selection Guide

| Model    | Params | Speed (CPU) | Accuracy | Best For                |
|----------|--------|-------------|----------|-------------------------|
| YOLOv8n  | 3.2M   | ~30ms       | Good     | Raspberry Pi, edge      |
| YOLOv8s  | 11.2M  | ~80ms       | Better   | Jetson, edge w/ GPU     |
| YOLOv8m  | 25.9M  | ~200ms      | Great    | Cloud fallback          |
| YOLOv8l  | 43.7M  | ~400ms      | Best     | Cloud when accuracy critical |

### TensorFlow Lite (Lightweight Edge)

For constrained devices where YOLOv8 is too heavy.

```python
import tflite_runtime.interpreter as tflite

interpreter = tflite.Interpreter(model_path="model.tflite")
interpreter.allocate_tensors()

input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()

def detect_tflite(frame):
    input_data = preprocess(frame, input_details[0]['shape'])
    interpreter.set_tensor(input_details[0]['index'], input_data)
    interpreter.invoke()
    boxes = interpreter.get_tensor(output_details[0]['index'])[0]
    classes = interpreter.get_tensor(output_details[1]['index'])[0]
    scores = interpreter.get_tensor(output_details[2]['index'])[0]
    return decode_detections(boxes, classes, scores)
```

### Custom Model Integration

If you have a custom-trained model:

1. Export to ONNX for cross-platform compatibility
2. Benchmark inference time on target hardware
3. Validate accuracy against a held-out test set (minimum 500 images)
4. Document per-class precision and recall

---

## 4. Edge Inference

### Raspberry Pi Setup

```bash
# Install dependencies
pip install opencv-contrib-python-headless
pip install tflite-runtime
pip install picamera2  # for official Pi camera

# Enable GPU (Pi 4+)
echo "gpu_mem=256" >> /boot/config.txt
```

### Raspberry Pi Optimization Checklist

- [ ] Use `opencv-contrib-python-headless` (no GUI overhead)
- [ ] Set camera resolution to 640x480 or lower
- [ ] Use `tflite-runtime` instead of full TensorFlow
- [ ] Pin CPU performance mode: `echo performance | sudo tee /sys/devices/system/cpu/cpu*/cpufreq/scaling_governor`
- [ ] Pre-allocate tensors and reuse interpreter instances
- [ ] Run detection in a dedicated process with nice priority

### Jetson Nano / Orin Setup

```bash
# Use NVIDIA container runtime
docker run --runtime nvidia -it nvcr.io/nvidia/l4t-tensorrt:r8.5.2-runtime

pip install jetson-inference
pip install jetson-utils
```

### Performance Benchmarks

| Device        | YOLOv8n | YOLOv8s | TFLite MobileNet |
|---------------|---------|---------|------------------|
| Pi 4 (4GB)   | ~120ms  | ~350ms  | ~80ms            |
| Pi 5 (8GB)   | ~45ms   | ~130ms  | ~35ms            |
| Jetson Nano   | ~30ms   | ~60ms   | ~25ms            |
| Jetson Orin   | ~8ms    | ~15ms   | ~6ms             |

---

## 5. Cloud Fallback

When edge confidence is low or the model cannot handle the scenario, escalate to cloud.

### Fallback Decision Logic

```python
def should_fallback(edge_results, frame):
    # Low confidence on any detection
    if any(d["confidence"] < 0.4 for d in edge_results):
        return True

    # No detections but motion was detected (potential miss)
    if len(edge_results) == 0 and motion_detected(frame):
        return True

    # Custom classes that edge model cannot identify
    if any(d["class"] == "unknown" for d in edge_results):
        return True

    return False
```

### Cloud API Integration

```python
import httpx
import base64

CLOUD_ENDPOINT = "https://api.nottyboi.dev/vision/detect"

async def detect_cloud(frame, timeout=5.0):
    _, buffer = cv2.imencode(".jpg", frame)
    image_b64 = base64.b64encode(buffer).decode("utf-8")

    async with httpx.AsyncClient() as client:
        resp = await client.post(
            CLOUD_ENDPOINT,
            json={"image": image_b64, "model": "yolov8m"},
            timeout=timeout,
        )
        resp.raise_for_status()
        return resp.json()["detections"]
```

### Fallback Rules

1. Always prefer edge results when confidence >= 0.6
2. Cloud fallback adds 200-800ms latency; plan for it
3. Rate-limit cloud calls (max 10/minute per camera)
4. Cache cloud model results for 30 seconds for duplicate frames
5. Log every fallback trigger for analysis

---

## 6. Confidence Scoring

### Scoring Tiers

```python
def classify_confidence(score):
    if score >= 0.85:
        return "high"       # auto-alert, no human review needed
    elif score >= 0.60:
        return "medium"     # alert with context, flag for review
    elif score >= 0.40:
        return "low"        # log only, do not alert
    else:
        return "discard"    # drop entirely
```

### Confidence Calibration

Raw model scores are often poorly calibrated. Before deployment:

1. Run the model on a labeled validation set (200+ images minimum)
2. Compute precision at each confidence threshold
3. Adjust thresholds so that "high confidence" detections have >= 90% precision
4. Re-calibrate after any model update or environment change

### Score Adjustment Factors

| Factor                    | Adjustment         |
|---------------------------|--------------------|
| Poor lighting             | Reduce by 0.05-0.1 |
| Partial occlusion         | Reduce by 0.1-0.15 |
| Motion blur               | Reduce by 0.05     |
| Camera at known stable position | +0.02       |
| Consistent with prior detection | +0.03       |

---

## 7. Deduplication

Prevent the same object from generating multiple alerts.

### Spatial Deduplication

```python
import numpy as np

def deduplicateetections(detections, iou_threshold=0.5):
    """Remove overlapping detections using Non-Maximum Suppression."""
    if len(detections) == 0:
        return []

    boxes = np.array([d["bbox"] for d in detections])
    scores = np.array([d["confidence"] for d in detections])

    # Sort by score descending
    order = scores.argsort()[::-1]
    keep = []

    while len(order) > 0:
        i = order[0]
        keep.append(i)

        # Compute IoU of kept detection with remaining
        xx1 = np.maximum(boxes[i, 0], boxes[order[1:], 0])
        yy1 = np.maximum(boxes[i, 1], boxes[1:])
        xx2 = np.minimum(boxes[i, 2], boxes[order[1:], 2])
        yy2 = np.minimum(boxes[i, 3], boxes[order[1:], 3])

        inter = np.maximum(0, xx2 - xx1) * np.maximum(0, yy2 - yy1)
        area_i = inter / (iou_area(boxes[i]) + iou_area(boxes[order[1:]]) - inter)

        remaining = np.where(area_i <= iou_threshold)[0]
        order = order[remaining + 1]

    return [detections[i] for i in keep]
```

### Temporal Deduplication

The same object across consecutive frames should produce one event, not many.

```python
class TemporalDeduplicator:
    def __init__(self, tracking_window_seconds=30):
        self.recent_events = []
        self.window = tracking_window_seconds

    def is_duplicate(self, detection, timestamp):
        self.recent_events = [
            e for e in self.recent_events
            if timestamp - e["timestamp"] < self.window
        ]

        for event in self.recent_events:
            if (
                event["class"] == detection["class"]
                and spatial_overlap(event["bbox"], detection["bbox"]) > 0.7
            ):
                return True

        self.recent_events.append({
            **detection,
            "timestamp": timestamp,
        })
        return False
```

### Deduplication Rules

| Scenario               | Method             | Window         |
|------------------------|--------------------|----------------|
| Same object, same frame | NMS (IoU >= 0.5) | Single frame   |
| Same object, video stream | Temporal tracking | 30 seconds   |
| Same alert type, same location | Class+location | 5 minutes    |
| Repeated unknown objects | Class+area       | 10 minutes     |

---

## 8. Privacy Rules (STRICT)

These rules are **non-negotiable**. Violation is a critical incident.

### Prohibited Operations

- **NO facial recognition** -- never identify, classify, or label individuals by face
- **NO identity tracking** -- never follow or log the path of a specific person
- **NO biometric data collection** -- never extract facial landmarks, iris patterns, or gait signatures
- **NO demographic inference** -- never estimate age, gender, or ethnicity from images
- **NO face storage** -- never save face crops, face embeddings, or face-tagged images
- **NO person re-identification** -- never use appearance matching to link the same person across sessions

### Required Privacy Measures

```python
class PrivacyGuard:
    """Enforce privacy rules before any detection is processed or stored."""

    PROHIBITED_CLASSES = {"person", "face", "human_face"}

    def filter_detections(self, detections):
        """Remove person-related detections entirely."""
        return [d for d in detections if d["class"] not in self.PROHIBITED_CLASSES]

    def blur_regions(self, frame, detections):
        """Blur any regions where person detections were made."""
        for d in detections:
            if d["class"] == "person":
                x1, y1, x2, y2 = map(int, d["bbox"])
                roi = frame[y1:y2, x1:x2]
                blurred = cv2.GaussianBlur(roi, (99, 99), 30)
                frame[y1:y2, x1:x2] = blurred
        return frame

    def validate_output(self, result_data):
        """Verify no person data leaks into output."""
        prohibited_keys = {"face_embedding", "face_image", "person_track", "identity"}
        return {k: v for k, v in result_data.items() if k not in prohibited_keys}
```

### Storage Privacy

- Raw camera footage: **never store** unless explicitly required, then encrypt at rest with AES-256 and set 24-hour auto-delete
- Detection logs: store class, confidence, timestamp, and anonymized bounding box only
- No images or frame crops in any log, database, or alert payload
- All stored data must be encrypted at rest and in transit

### Audit Requirements

- Run a privacy audit on every detection pipeline change
- Log every access to camera feeds with timestamp, user, and purpose
- Quarterly review of stored detection data for compliance
- Immediate purge capability for any data retention request

---

## 9. Alert Generation

### Alert Schema

```json
{
  "alert_id": "uuid-v4",
  "timestamp": "2025-01-15T14:23:01Z",
  "camera_id": "cam-front-door",
  "event_type": "object_detected",
  "object_class": "package",
  "confidence": 0.87,
  "confidence_tier": "high",
  "location_zone": "front_porch",
  "bbox": [120, 80, 340, 290],
  "context": {
    "first_seen": "2025-01-15T14:22:45Z",
    "detection_count": 3,
    "camera_status": "healthy"
  },
  "action_required": true,
  "priority": "medium"
}
```

### Alert Priority Matrix

| Object Class | Confidence | Priority   | Channel           |
|-------------|------------|------------|-------------------|
| Package     | High       | Medium     | Push + Log        |
| Package     | Medium     | Low        | Log only          |
| Vehicle     | High       | Low        | Log only          |
| Animal      | High       | Low        | Log only          |
| Unknown     | High       | Medium     | Push + Log        |
| Intrusion*  | High       | Critical   | Push + SMS + Log  |

*Intrusion detection requires a separate, reviewed configuration.

### Alert Throttling

```python
class AlertThrottler:
    def __init__(self, max_alerts_per_camera_per_hour=5):
        self.alerts = {}
        self.limit = max_alerts_per_camera_per_hour

    def should_send(self, camera_id, timestamp):
        key = f"{camera_id}:{timestamp.hour}"
        count = self.alerts.get(key, 0)
        if count >= self.limit:
            return False
        self.alerts[key] = count + 1
        return True
```

---

## 10. Common Gotchas

- **Stale camera frames**: Always verify frame timestamps. A USB camera may return the same frame on read failure.
- **Lighting changes**: Sunrise, sunset, and headlights cause false positives. Use motion-triggered sampling to compensate.
- **Model drift**: Object detection accuracy degrades as real-world conditions diverge from training data. Retrain monthly.
- **Memory leaks**: OpenCV `VideoCapture` objects must be explicitly released. Always use context managers.
- **GPU contention**: Running detection and image preprocessing on the same GPU can cause OOM. Separate concerns.
- **NMS threshold tuning**: Too low = false merges, too high = duplicate detections. Default IoU of 0.5 works for most cases.
- **Cloud fallback storms**: A batch of low-confidence detections can trigger many cloud calls simultaneously. Use rate limiting.
- **Privacy by default**: Never start with person detection enabled. Disable it explicitly in configuration, never as a runtime flag.

---

## 11. Quality Standards

- All detection code must have unit tests for the detection pipeline (mock camera input)
- Integration tests must run against a set of 50+ annotated test images
- Privacy filter must have dedicated test cases verifying person data is never output
- Edge inference benchmarks must be documented for every target hardware platform
- Every alert schema must be validated against a JSON schema before dispatch
- Camera health checks must run on startup and every 60 seconds during operation
- All detection thresholds must be configurable via environment variables, not hardcoded
