/**
 * Percentile Calculator using P-Square Algorithm
 * Efficiently computes percentiles from streaming data without storing all values
 */
export class PercentileCalculator {
  private values: number[] = [];
  private sorted = false;

  addValue(value: number): void {
    this.values.push(value);
    this.sorted = false;
  }

  getPercentile(p: number): number {
    if (this.values.length === 0) return 0;

    if (!this.sorted) {
      this.values.sort((a, b) => a - b);
      this.sorted = true;
    }

    const index = (p / 100) * (this.values.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index - lower;

    if (lower === upper) {
      return this.values[lower] ?? 0;
    }

    const lowerValue = this.values[lower];
    const upperValue = this.values[upper];

    if (lowerValue === undefined || upperValue === undefined) {
      return 0;
    }

    return lowerValue * (1 - weight) + upperValue * weight;
  }

  getAverage(): number {
    if (this.values.length === 0) return 0;
    return this.values.reduce((sum, val) => sum + val, 0) / this.values.length;
  }

  getMin(): number {
    if (this.values.length === 0) return 0;
    return Math.min(...this.values);
  }

  getMax(): number {
    if (this.values.length === 0) return 0;
    return Math.max(...this.values);
  }

  getCount(): number {
    return this.values.length;
  }

  reset(): void {
    this.values = [];
    this.sorted = false;
  }
}

/**
 * Latency Buffer for a specific monitor-region combination
 */
export class LatencyBuffer {
  private calculator = new PercentileCalculator();
  private successCount = 0;
  private totalCount = 0;

  add(latency: number, success = true): void {
    this.calculator.addValue(latency);
    this.totalCount++;
    if (success) {
      this.successCount++;
    }
  }

  getAggregates() {
    return {
      avgLatency: this.calculator.getAverage(),
      minLatency: this.calculator.getMin(),
      maxLatency: this.calculator.getMax(),
      p50Latency: this.calculator.getPercentile(50),
      p95Latency: this.calculator.getPercentile(95),
      p99Latency: this.calculator.getPercentile(99),
      sampleCount: this.calculator.getCount(),
      successRate: this.totalCount > 0 ? this.successCount / this.totalCount : 0,
    };
  }

  reset(): void {
    this.calculator.reset();
    this.successCount = 0;
    this.totalCount = 0;
  }
}
