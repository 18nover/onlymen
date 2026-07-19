/**
 * GPU detection utility for the simplified tier-profile system.
 *
 * Uses `nvidia-smi` to query the first GPU's name, total VRAM (MiB), and
 * CUDA compute capability. On success the result feeds `selectBestProfile`
 * to pick the best matching tier profile.
 *
 * **This module MUST NOT throw.** Any failure — missing binary, no GPU,
 * parse error — returns `null`. Callers treat `null` as "run without GPU
 * acceleration" and fall back to CPU/catalog defaults.
 *
 * **No model loading.** This file only spawns `nvidia-smi` for metadata
 * queries; it never starts llama-server or loads any GGUF files.
 *
 * Override: set `ELIZA_GPU_PROFILE=<id>` (e.g. `ELIZA_GPU_PROFILE=rtx-4090`)
 * to bypass detection entirely. `autoSelectProfile()` returns the named
 * profile directly without running nvidia-smi.
 */
import type { GpuProfile } from "./gpu-tier-profiles.js";
/** Raw data extracted from nvidia-smi for a single GPU. */
export interface DetectedGpu {
    /** Marketing name as reported by nvidia-smi, e.g. `"NVIDIA GeForce RTX 4090"`. */
    name: string;
    /** Total VRAM in MiB (as reported by `memory.total`). */
    vram_mb: number;
    /**
     * CUDA compute capability in dotted form, e.g. `"8.9"`.
     * `null` when nvidia-smi does not report `compute_cap` (older drivers).
     */
    cuda_compute: string | null;
}
/**
 * Query the first detected NVIDIA GPU via `nvidia-smi`.
 *
 * Runs:
 * ```
 * nvidia-smi --query-gpu=name,memory.total,compute_cap --format=csv,noheader,nounits
 * ```
 *
 * Parses the first output line. Returns `null` on any failure:
 *   - nvidia-smi not found in PATH
 *   - non-zero exit code (no NVIDIA driver / no GPU)
 *   - unexpected output format
 *   - any other exception
 *
 * The 2-second timeout prevents hangs in headless / CI environments.
 */
export declare function detectNvidiaGpu(): DetectedGpu | null;
/**
 * Auto-select the best GPU tier profile for the host.
 *
 * Resolution order:
 *   1. If `ELIZA_GPU_PROFILE` is set, return that profile (or `null` if
 *      the id is unrecognised).
 *   2. Otherwise, run `detectNvidiaGpu()` and call `selectBestProfile`.
 *   3. Return `null` when no GPU is detected or no profile fits.
 *
 * Never throws.
 */
export declare function autoSelectProfile(): GpuProfile | null;
//# sourceMappingURL=gpu-tier-detect.d.ts.map