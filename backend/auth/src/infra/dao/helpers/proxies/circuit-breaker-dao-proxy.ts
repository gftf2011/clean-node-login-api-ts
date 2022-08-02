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

/**
 * @author Vladimir Topolev
 * @link https://medium.com/geekculture/nodejs-circuit-breaker-pattern-ed6b31896a57
 * @desc Controls the DAO request access
 * - It uses the {@link https://refactoring.guru/design-patterns/proxy Proxy} design pattern
 * - It uses the {@link https://microservices.io/patterns/reliability/circuit-breaker.html Circuit Breaker} architecture pattern
 */
export class CircuitBreakerDaoProxy implements Dao<any> {
  options: CircuitBreakerOptions;

  state = CircuitBreakerState.CLOSED;

  minWaitingTimeInMs: number = Date.now();

  failCount = 0;

  successCount = 0;

  constructor(private dao: Dao<any>, opts?: CircuitBreakerOptions) {
    this.options = {
      halfBreakerTimeoutInMs: opts?.halfBreakerTimeoutInMs || 60000,
      openBreakerTimeoutInMs: opts?.openBreakerTimeoutInMs || 5000,
      closedBreakerTimeoutInMs: opts?.closedBreakerTimeoutInMs || 10000,
      minFailedRequestThreshold: opts?.minFailedRequestThreshold || 15,
      percentageFailedRequestsThreshold:
        opts?.percentageFailedRequestsThreshold || 50,
    };
  }

  /**
   * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
   * @desc setter for fail count
   * @param {number} failCount - fail counter
   * @returns {void} returns nothing
   */
  private setFailCount(failCount: number): void {
    this.failCount = failCount;
  }

  /**
   * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
   * @desc setter for success count
   * @param {number} successCount - success counter
   * @returns {void} returns nothing
   */
  private setSuccessCount(successCount: number): void {
    this.successCount = successCount;
  }

  /**
   * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
   * @desc getter to return fail count
   * @returns {number} get fail count
   */
  private getFailCount(): number {
    return this.failCount;
  }

  /**
   * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
   * @desc getter to return success count
   * @returns {number} get success count
   */
  private getSuccessCount(): number {
    return this.successCount;
  }

  /**
   * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
   * @desc utility method to increase fail count by one every time
   * @returns {void} returns nothing
   */
  private increaseFailCount(): void {
    this.failCount++;
  }

  /**
   * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
   * @desc utility method to increase success count by one every time
   * @returns {void} returns nothing
   */
  private increaseSuccessCount(): void {
    this.successCount++;
  }

  /**
   * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
   * @desc setter to circuit breaker half state timeout
   * @param {number} newHalfBreakerTimeoutInMs - timestamp in milliseconds
   * @returns {void} returns nothing
   */
  private setHalfBreakerTimeoutInMs(newHalfBreakerTimeoutInMs: number): void {
    this.options.halfBreakerTimeoutInMs = newHalfBreakerTimeoutInMs;
  }

  /**
   * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
   * @desc setter to circuit breaker global minimum waiting time, before trying to change state again
   * @param {number} minWaitingTimeInMs - timestamp in milliseconds
   * @returns {void} returns nothing
   */
  private setMinWaitingTimeInMs(minWaitingTimeInMs: number): void {
    this.minWaitingTimeInMs = minWaitingTimeInMs;
  }

  /**
   * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
   * @desc getter to circuit breaker global minimum waiting time, before trying to change state again
   * @returns {number} get circuit breaker global minimum waiting time
   */
  private getMinWaitingTimeInMs(): number {
    return this.minWaitingTimeInMs;
  }

  /**
   * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
   * @desc setter to circuit breaker global current state
   * @param {CircuitBreakerState} state - get circuit breaker global minimum waiting time
   * @returns {void} returns nothing
   */
  private setState(state: CircuitBreakerState): void {
    this.state = state;
  }

  /**
   * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
   * @desc getter to circuit breaker global current state
   * @returns {CircuitBreakerState} gets circuit breaker global current state
   */
  private getState(): CircuitBreakerState {
    return this.state;
  }

  /**
   * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
   * @desc getter to circuit breaker closed state time amount to wait
   * @returns {number} gets circuit breaker closed state time amount to wait
   */
  private getClosedBreakerTimeoutInMs(): number {
    return this.options.closedBreakerTimeoutInMs;
  }

  /**
   * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
   * @desc getter to circuit breaker half state time amount to wait
   * @returns {number} gets circuit breaker half state time amount to wait
   */
  private getHalfBreakerTimeoutInMs(): number {
    return this.options.halfBreakerTimeoutInMs;
  }

  /**
   * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
   * @desc getter to circuit breaker open state time amount to wait
   * @returns {number} gets circuit breaker open state time amount to wait
   */
  private getOpenBreakerTimeoutInMs(): number {
    return this.options.openBreakerTimeoutInMs;
  }

  /**
   * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
   * @desc getter to circuit breaker failed request's minimum threshold
   * @returns {number} gets circuit breaker failed request's minimum threshold
   */
  private getMinFailedRequestThreshold(): number {
    return this.options.minFailedRequestThreshold;
  }

  /**
   * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
   * @desc getter to circuit breaker failed request's minimum percentage threshold
   * @returns {number} gets circuit breaker failed request's minimum percentage threshold
   */
  private getPercentageFailedRequestsThreshold(): number {
    return this.options.percentageFailedRequestsThreshold;
  }

  /**
   * @author Vladimir Topolev
   * @desc generic asynchronous execution method
   * @param {any[]} args - generic parameters
   * @returns {Promise<any>} returns generic response
   */
  async execute(...args: any[]): Promise<any> {
    const timestampNow = Date.now();

    if (
      this.getState() === CircuitBreakerState.OPENED &&
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

  /**
   * @author Vladimir Topolev
   * @desc resets breaker counters to initial status
   * @returns {void} returns nothing
   */
  private reset(): void {
    const newTimestamp = Date.now() + this.getHalfBreakerTimeoutInMs();

    this.setSuccessCount(0);
    this.setFailCount(0);
    this.setHalfBreakerTimeoutInMs(newTimestamp);
  }

  /**
   * @author Vladimir Topolev
   * @desc success returned from breaker operation
   * @returns {any} returns generic response
   */
  private success(response: any): any {
    const currentState = this.getState();

    let state = currentState;

    if (currentState === CircuitBreakerState.HALF) {
      const timestampNow = Date.now();

      this.increaseSuccessCount();
      // the previous tracking window closed, and
      // nothing happened to open the breaker
      if (timestampNow >= this.getHalfBreakerTimeoutInMs()) {
        state = CircuitBreakerState.CLOSED;
        this.reset();
      }
    }
    // attempt after openBreakerTimeoutInMs successful,
    // it means that we should close the breaker
    if (currentState === CircuitBreakerState.OPENED) {
      state = CircuitBreakerState.CLOSED;
      this.reset();
    }
    this.setState(state);

    return response;
  }

  /**
   * @author Vladimir Topolev
   * @desc failed operation from breaker
   * @returns {Error} returns error from failing operations
   */
  private fail(e: Error, ..._args: any[]): Error {
    const currentState = this.getState();

    let state = currentState;
    // breaker opened and new attempt is failed
    if (currentState === CircuitBreakerState.OPENED) {
      const newTimestamp = Date.now() + this.getOpenBreakerTimeoutInMs();

      this.setMinWaitingTimeInMs(newTimestamp);
    }

    // the first failed request comes in
    if (currentState === CircuitBreakerState.CLOSED) {
      const newTimestamp = Date.now() + this.getClosedBreakerTimeoutInMs();

      state = CircuitBreakerState.HALF;

      this.increaseFailCount();
      this.setHalfBreakerTimeoutInMs(newTimestamp);
    }

    if (currentState === CircuitBreakerState.HALF) {
      const timestampNow = Date.now();

      this.increaseFailCount();
      // it means that the previous tracking window closed
      // and nothing happened to open the breaker
      // but the new HALF state should be started immediately
      if (timestampNow > this.getHalfBreakerTimeoutInMs()) {
        const newTimestamp = timestampNow + this.getClosedBreakerTimeoutInMs();

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
          const newTimestamp = Date.now() + this.getOpenBreakerTimeoutInMs();

          state = CircuitBreakerState.OPENED;

          this.reset();
          this.setMinWaitingTimeInMs(newTimestamp);
        }
        const newTimestamp = Date.now() + this.getClosedBreakerTimeoutInMs();

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
