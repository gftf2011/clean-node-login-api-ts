/**
 * Infra
 */
import { Dao } from '../../../contracts';

/**
 * Shared
 */
import { ServiceUnavailableError } from '../../../../shared/errors';

export type CircuitBreakerOptions = {
  openBreakerTimeoutInMs?: number;
  closedBreakerTimeoutInMs?: number;
  halfBreakerTimeoutInMs?: number;
  minFailedRequestThreshold?: number;
  percentageFailedRequestsThreshold?: number;
};

enum CircuitBreakerState {
  OPENED = 'OPENED',
  CLOSED = 'CLOSED',
  HALF = 'HALF',
}

export class CircuitBreakerDaoProxy implements Dao<any> {
  options: CircuitBreakerOptions;

  state = CircuitBreakerState.OPENED;

  minWaitingTimeInMs: number = Date.now();

  failCount = 0;

  successCount = 0;

  constructor(private dao: Dao<any>, opts?: CircuitBreakerOptions) {
    this.options = {
      halfBreakerTimeoutInMs: opts?.halfBreakerTimeoutInMs || 60000,
      openBreakerTimeoutInMs: opts?.openBreakerTimeoutInMs || 10000,
      closedBreakerTimeoutInMs: opts?.closedBreakerTimeoutInMs || 5000,
      minFailedRequestThreshold: opts?.minFailedRequestThreshold || 15,
      percentageFailedRequestsThreshold:
        opts?.percentageFailedRequestsThreshold || 50,
    };
  }

  private setFailCount(failCount: number): void {
    this.failCount = failCount;
  }

  private setSuccessCount(successCount: number): void {
    this.successCount = successCount;
  }

  private getFailCount(): number {
    return this.failCount;
  }

  private getSuccessCount(): number {
    return this.successCount;
  }

  private increaseFailCount(): void {
    this.failCount++;
  }

  private increaseSuccessCount(): void {
    this.successCount++;
  }

  private setHalfBreakerTimeoutInMs(newHalfBreakerTimeoutInMs: number): void {
    this.options.halfBreakerTimeoutInMs = newHalfBreakerTimeoutInMs;
  }

  private setMinWaitingTimeInMs(minWaitingTimeInMs: number): void {
    this.minWaitingTimeInMs = minWaitingTimeInMs;
  }

  private getMinWaitingTimeInMs(): number {
    return this.minWaitingTimeInMs;
  }

  private setState(state: CircuitBreakerState): void {
    this.state = state;
  }

  private getState(): CircuitBreakerState {
    return this.state;
  }

  private getClosedBreakerTimeoutInMs(): number {
    return this.options.closedBreakerTimeoutInMs;
  }

  private getHalfBreakerTimeoutInMs(): number {
    return this.options.halfBreakerTimeoutInMs;
  }

  private getOpenBreakerTimeoutInMs(): number {
    return this.options.openBreakerTimeoutInMs;
  }

  private getMinFailedRequestThreshold(): number {
    return this.options.minFailedRequestThreshold;
  }

  private getPercentageFailedRequestsThreshold(): number {
    return this.options.percentageFailedRequestsThreshold;
  }

  async execute(...args: any[]): Promise<any> {
    const timestampNow = Date.now();

    if (
      this.getState() === CircuitBreakerState.CLOSED &&
      this.getMinWaitingTimeInMs() > timestampNow
    ) {
      throw new ServiceUnavailableError();
    }
    try {
      const response = await this.dao.execute(args);
      return this.success(response);
    } catch (error) {
      return this.fail(error as Error, args);
    }
  }

  private reset(): void {
    const newTimestamp = Date.now() + this.getHalfBreakerTimeoutInMs();

    this.setSuccessCount(0);
    this.setFailCount(0);
    this.setHalfBreakerTimeoutInMs(newTimestamp);
  }

  private success(response: any): any {
    const currentState = this.getState();

    let state = currentState;

    if (currentState === CircuitBreakerState.HALF) {
      const timestampNow = Date.now();

      this.increaseSuccessCount();
      // the previous tracking window closed, and
      // nothing happened to close the breaker
      if (timestampNow >= this.getHalfBreakerTimeoutInMs()) {
        state = CircuitBreakerState.OPENED;
        this.reset();
      }
    }
    // attempt after closedBreakerTimeoutInMs successful,
    // it means that we should open the breaker
    if (currentState === CircuitBreakerState.CLOSED) {
      state = CircuitBreakerState.OPENED;
      this.reset();
    }
    this.setState(state);

    return response;
  }

  private fail(e: Error, ..._args: any[]): Error {
    const currentState = this.getState();

    let state = currentState;
    // breaker closed and new attempt is failed
    if (currentState === CircuitBreakerState.CLOSED) {
      const newTimestamp = Date.now() + this.getClosedBreakerTimeoutInMs();

      this.setMinWaitingTimeInMs(newTimestamp);
    }

    // the first failed request comes in
    if (currentState === CircuitBreakerState.OPENED) {
      const newTimestamp = Date.now() + this.getOpenBreakerTimeoutInMs();

      state = CircuitBreakerState.HALF;

      this.increaseFailCount();
      this.setHalfBreakerTimeoutInMs(newTimestamp);
    }

    if (currentState === CircuitBreakerState.HALF) {
      const timestampNow = Date.now();

      this.increaseFailCount();
      // it means that the previous tracking window closed
      // and nothing happened to close breaker
      // but the new HALF state should be started immediately
      if (timestampNow > this.getHalfBreakerTimeoutInMs()) {
        const newTimestamp = timestampNow + this.getOpenBreakerTimeoutInMs();

        this.reset();
        this.increaseFailCount();
        this.setHalfBreakerTimeoutInMs(newTimestamp);
      }

      // the tracking window isn't closed yet
      if (this.getFailCount() >= this.getMinFailedRequestThreshold()) {
        const failRate =
          (this.getFailCount() * 100) /
          (this.getFailCount() + this.getSuccessCount());

        // failed rate exceeds and breaker is closed
        if (failRate >= this.getPercentageFailedRequestsThreshold()) {
          const newTimestamp = Date.now() + this.getClosedBreakerTimeoutInMs();

          state = CircuitBreakerState.CLOSED;

          this.reset();
          this.setMinWaitingTimeInMs(newTimestamp);
        }
        const newTimestamp = Date.now() + this.getOpenBreakerTimeoutInMs();

        // otherwise it's considered as normal state
        // but the new tracking window should be started
        this.reset();
        this.increaseFailCount();
        this.setHalfBreakerTimeoutInMs(newTimestamp);
      }
    }

    this.setState(state);

    return e;
  }
}
