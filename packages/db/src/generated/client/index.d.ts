/**
 * Client
 **/

import * as runtime from "./runtime/client.js";
import $Types = runtime.Types; // general types
import $Public = runtime.Types.Public;
import $Utils = runtime.Types.Utils;
import $Extensions = runtime.Types.Extensions;
import $Result = runtime.Types.Result;

export type PrismaPromise<T> = $Public.PrismaPromise<T>;

/**
 * Model User
 *
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>;
/**
 * Model Session
 *
 */
export type Session = $Result.DefaultSelection<Prisma.$SessionPayload>;
/**
 * Model Account
 *
 */
export type Account = $Result.DefaultSelection<Prisma.$AccountPayload>;
/**
 * Model Verification
 *
 */
export type Verification = $Result.DefaultSelection<Prisma.$VerificationPayload>;
/**
 * Model Incident
 *
 */
export type Incident = $Result.DefaultSelection<Prisma.$IncidentPayload>;
/**
 * Model IncidentEvent
 *
 */
export type IncidentEvent = $Result.DefaultSelection<Prisma.$IncidentEventPayload>;
/**
 * Model RegionalIncident
 *
 */
export type RegionalIncident = $Result.DefaultSelection<Prisma.$RegionalIncidentPayload>;
/**
 * Model NotificationChannel
 *
 */
export type NotificationChannel = $Result.DefaultSelection<Prisma.$NotificationChannelPayload>;
/**
 * Model AlertRule
 *
 */
export type AlertRule = $Result.DefaultSelection<Prisma.$AlertRulePayload>;
/**
 * Model Monitor
 *
 */
export type Monitor = $Result.DefaultSelection<Prisma.$MonitorPayload>;
/**
 * Model MonitorEvent
 *
 */
export type MonitorEvent = $Result.DefaultSelection<Prisma.$MonitorEventPayload>;
/**
 * Model MaintenanceWindow
 *
 */
export type MaintenanceWindow = $Result.DefaultSelection<Prisma.$MaintenanceWindowPayload>;

/**
 * Enums
 */
export namespace $Enums {
  export const IncidentStatus: {
    INVESTIGATING: "INVESTIGATING";
    IDENTIFIED: "IDENTIFIED";
    MONITORING: "MONITORING";
    RESOLVED: "RESOLVED";
  };

  export type IncidentStatus = (typeof IncidentStatus)[keyof typeof IncidentStatus];

  export const Severity: {
    HIGH: "HIGH";
    MEDIUM: "MEDIUM";
    LOW: "LOW";
  };

  export type Severity = (typeof Severity)[keyof typeof Severity];

  export const IncidentEventType: {
    STATE_CHANGE: "STATE_CHANGE";
    ALERT_SENT: "ALERT_SENT";
    COMMENT: "COMMENT";
    AUTO_RESOLVE: "AUTO_RESOLVE";
  };

  export type IncidentEventType = (typeof IncidentEventType)[keyof typeof IncidentEventType];

  export const NotificationType: {
    EMAIL: "EMAIL";
    DISCORD: "DISCORD";
    SLACK: "SLACK";
    WEBHOOK: "WEBHOOK";
    TELEGRAM: "TELEGRAM";
    SMS: "SMS";
  };

  export type NotificationType = (typeof NotificationType)[keyof typeof NotificationType];

  export const AlertTrigger: {
    STATUS_CHANGE: "STATUS_CHANGE";
    LATENCY: "LATENCY";
    SSL_EXPIRY: "SSL_EXPIRY";
  };

  export type AlertTrigger = (typeof AlertTrigger)[keyof typeof AlertTrigger];

  export const ComparisonOperator: {
    GT: "GT";
    LT: "LT";
  };

  export type ComparisonOperator = (typeof ComparisonOperator)[keyof typeof ComparisonOperator];

  export const MonitorType: {
    HTTP: "HTTP";
    PING: "PING";
    PORT: "PORT";
  };

  export type MonitorType = (typeof MonitorType)[keyof typeof MonitorType];

  export const MonitorStatus: {
    UP: "UP";
    DOWN: "DOWN";
    PAUSED: "PAUSED";
    MAINTENANCE: "MAINTENANCE";
  };

  export type MonitorStatus = (typeof MonitorStatus)[keyof typeof MonitorStatus];
}

export type IncidentStatus = $Enums.IncidentStatus;

export const IncidentStatus: typeof $Enums.IncidentStatus;

export type Severity = $Enums.Severity;

export const Severity: typeof $Enums.Severity;

export type IncidentEventType = $Enums.IncidentEventType;

export const IncidentEventType: typeof $Enums.IncidentEventType;

export type NotificationType = $Enums.NotificationType;

export const NotificationType: typeof $Enums.NotificationType;

export type AlertTrigger = $Enums.AlertTrigger;

export const AlertTrigger: typeof $Enums.AlertTrigger;

export type ComparisonOperator = $Enums.ComparisonOperator;

export const ComparisonOperator: typeof $Enums.ComparisonOperator;

export type MonitorType = $Enums.MonitorType;

export const MonitorType: typeof $Enums.MonitorType;

export type MonitorStatus = $Enums.MonitorStatus;

export const MonitorStatus: typeof $Enums.MonitorStatus;

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = "log" extends keyof ClientOptions
    ? ClientOptions["log"] extends Array<Prisma.LogLevel | Prisma.LogDefinition>
      ? Prisma.GetEvents<ClientOptions["log"]>
      : never
    : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>["other"] };

  /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(
    eventType: V,
    callback: (event: V extends "query" ? Prisma.QueryEvent : Prisma.LogEvent) => void,
  ): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(
    query: TemplateStringsArray | Prisma.Sql,
    ...values: any[]
  ): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(
    query: TemplateStringsArray | Prisma.Sql,
    ...values: any[]
  ): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(
    arg: [...P],
    options?: { isolationLevel?: Prisma.TransactionIsolationLevel },
  ): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>;

  $transaction<R>(
    fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>,
    options?: {
      maxWait?: number;
      timeout?: number;
      isolationLevel?: Prisma.TransactionIsolationLevel;
    },
  ): $Utils.JsPromise<R>;

  $extends: $Extensions.ExtendsHook<
    "extends",
    Prisma.TypeMapCb<ClientOptions>,
    ExtArgs,
    $Utils.Call<
      Prisma.TypeMapCb<ClientOptions>,
      {
        extArgs: ExtArgs;
      }
    >
  >;

  /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.session`: Exposes CRUD operations for the **Session** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Sessions
   * const sessions = await prisma.session.findMany()
   * ```
   */
  get session(): Prisma.SessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.account`: Exposes CRUD operations for the **Account** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Accounts
   * const accounts = await prisma.account.findMany()
   * ```
   */
  get account(): Prisma.AccountDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.verification`: Exposes CRUD operations for the **Verification** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Verifications
   * const verifications = await prisma.verification.findMany()
   * ```
   */
  get verification(): Prisma.VerificationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.incident`: Exposes CRUD operations for the **Incident** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Incidents
   * const incidents = await prisma.incident.findMany()
   * ```
   */
  get incident(): Prisma.IncidentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.incidentEvent`: Exposes CRUD operations for the **IncidentEvent** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more IncidentEvents
   * const incidentEvents = await prisma.incidentEvent.findMany()
   * ```
   */
  get incidentEvent(): Prisma.IncidentEventDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.regionalIncident`: Exposes CRUD operations for the **RegionalIncident** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more RegionalIncidents
   * const regionalIncidents = await prisma.regionalIncident.findMany()
   * ```
   */
  get regionalIncident(): Prisma.RegionalIncidentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.notificationChannel`: Exposes CRUD operations for the **NotificationChannel** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more NotificationChannels
   * const notificationChannels = await prisma.notificationChannel.findMany()
   * ```
   */
  get notificationChannel(): Prisma.NotificationChannelDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.alertRule`: Exposes CRUD operations for the **AlertRule** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more AlertRules
   * const alertRules = await prisma.alertRule.findMany()
   * ```
   */
  get alertRule(): Prisma.AlertRuleDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.monitor`: Exposes CRUD operations for the **Monitor** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Monitors
   * const monitors = await prisma.monitor.findMany()
   * ```
   */
  get monitor(): Prisma.MonitorDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.monitorEvent`: Exposes CRUD operations for the **MonitorEvent** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more MonitorEvents
   * const monitorEvents = await prisma.monitorEvent.findMany()
   * ```
   */
  get monitorEvent(): Prisma.MonitorEventDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.maintenanceWindow`: Exposes CRUD operations for the **MaintenanceWindow** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more MaintenanceWindows
   * const maintenanceWindows = await prisma.maintenanceWindow.findMany()
   * ```
   */
  get maintenanceWindow(): Prisma.MaintenanceWindowDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF;

  export type PrismaPromise<T> = $Public.PrismaPromise<T>;

  /**
   * Validator
   */
  export import validator = runtime.Public.validator;

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError;
  export import PrismaClientValidationError = runtime.PrismaClientValidationError;

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag;
  export import empty = runtime.empty;
  export import join = runtime.join;
  export import raw = runtime.raw;
  export import Sql = runtime.Sql;

  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal;

  export type DecimalJsLike = runtime.DecimalJsLike;

  /**
   * Extensions
   */
  export import Extension = $Extensions.UserArgs;
  export import getExtensionContext = runtime.Extensions.getExtensionContext;
  export import Args = $Public.Args;
  export import Payload = $Public.Payload;
  export import Result = $Public.Result;
  export import Exact = $Public.Exact;

  /**
   * Prisma Client JS version: 7.3.0
   * Query Engine version: 9d6ad21cbbceab97458517b147a6a09ff43aa735
   */
  export type PrismaVersion = {
    client: string;
    engine: string;
  };

  export const prismaVersion: PrismaVersion;

  /**
   * Utility Types
   */

  export import Bytes = runtime.Bytes;
  export import JsonObject = runtime.JsonObject;
  export import JsonArray = runtime.JsonArray;
  export import JsonValue = runtime.JsonValue;
  export import InputJsonObject = runtime.InputJsonObject;
  export import InputJsonArray = runtime.InputJsonArray;
  export import InputJsonValue = runtime.InputJsonValue;

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
     * Type of `Prisma.DbNull`.
     *
     * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
     *
     * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
     */
    class DbNull {
      private DbNull: never;
      private constructor();
    }

    /**
     * Type of `Prisma.JsonNull`.
     *
     * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
     *
     * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
     */
    class JsonNull {
      private JsonNull: never;
      private constructor();
    }

    /**
     * Type of `Prisma.AnyNull`.
     *
     * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
     *
     * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
     */
    class AnyNull {
      private AnyNull: never;
      private constructor();
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull;

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull;

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull;

  type SelectAndInclude = {
    select: any;
    include: any;
  };

  type SelectAndOmit = {
    select: any;
    omit: any;
  };

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<
    ReturnType<T>
  >;

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
    [P in K]: T[P];
  };

  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K;
  }[keyof T];

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K;
  };

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>;

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  } & (T extends SelectAndInclude
    ? "Please either choose `select` or `include`."
    : T extends SelectAndOmit
      ? "Please either choose `select` or `omit`."
      : {});

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  } & K;

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> = T extends object
    ? U extends object
      ? (Without<T, U> & U) | (Without<U, T> & T)
      : U
    : T;

  /**
   * Is T a Record?
   */
  type IsObject<T extends any> =
    T extends Array<any>
      ? False
      : T extends Date
        ? False
        : T extends Uint8Array
          ? False
          : T extends BigInt
            ? False
            : T extends object
              ? True
              : False;

  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T;

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O>; // With K possibilities
    }[K];

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>;

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>;

  type _Either<O extends object, K extends Key, strict extends Boolean> = {
    1: EitherStrict<O, K>;
    0: EitherLoose<O, K>;
  }[strict];

  type Either<O extends object, K extends Key, strict extends Boolean = 1> = O extends unknown
    ? _Either<O, K, strict>
    : never;

  export type Union = any;

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K];
  } & {};

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (U extends unknown ? (k: U) => void : never) extends (
    k: infer I,
  ) => void
    ? I
    : never;

  export type Overwrite<O extends object, O1 extends object> = {
    [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<
    Overwrite<
      U,
      {
        [K in keyof U]-?: At<U, K>;
      }
    >
  >;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
    1: AtStrict<O, K>;
    0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function
    ? A
    : {
        [K in keyof A]: A[K];
      } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
      ?
          | (K extends keyof O ? { [P in K]: O[P] } & O : O)
          | ({ [P in keyof O as P extends K ? P : never]-?: O[P] } & O)
      : never
  >;

  type _Strict<U, _U = U> = U extends unknown
    ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>>
    : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False;

  // /**
  // 1
  // */
  export type True = 1;

  /**
  0
  */
  export type False = 0;

  export type Not<B extends Boolean> = {
    0: 1;
    1: 0;
  }[B];

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
      ? 1
      : 0;

  export type Has<U extends Union, U1 extends Union> = Not<Extends<Exclude<U1, U>, U1>>;

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0;
      1: 1;
    };
    1: {
      0: 1;
      1: 1;
    };
  }[B1][B2];

  export type Keys<U extends Union> = U extends unknown ? keyof U : never;

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;

  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object
    ? {
        [P in keyof T]: P extends keyof O ? O[P] : never;
      }
    : never;

  type FieldPaths<T, U = Omit<T, "_avg" | "_sum" | "_count" | "_min" | "_max">> =
    IsObject<T> extends True ? U : T;

  type GetHavingFields<T> = {
    [K in keyof T]: Or<Or<Extends<"OR", K>, Extends<"AND", K>>, Extends<"NOT", K>> extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
        ? never
        : K;
  }[keyof T];

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never;
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>;
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T;

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<
    T,
    MaybeTupleToUnion<K>
  >;

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T;

  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>;

  type FieldRefInputType<Model, FieldType> = Model extends never
    ? never
    : FieldRef<Model, FieldType>;

  export const ModelName: {
    User: "User";
    Session: "Session";
    Account: "Account";
    Verification: "Verification";
    Incident: "Incident";
    IncidentEvent: "IncidentEvent";
    RegionalIncident: "RegionalIncident";
    NotificationChannel: "NotificationChannel";
    AlertRule: "AlertRule";
    Monitor: "Monitor";
    MonitorEvent: "MonitorEvent";
    MaintenanceWindow: "MaintenanceWindow";
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName];

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<
    { extArgs: $Extensions.InternalArgs },
    $Utils.Record<string, any>
  > {
    returns: Prisma.TypeMap<
      this["params"]["extArgs"],
      ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}
    >;
  }

  export type TypeMap<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > = {
    globalOmitOptions: {
      omit: GlobalOmitOptions;
    };
    meta: {
      modelProps:
        | "user"
        | "session"
        | "account"
        | "verification"
        | "incident"
        | "incidentEvent"
        | "regionalIncident"
        | "notificationChannel"
        | "alertRule"
        | "monitor"
        | "monitorEvent"
        | "maintenanceWindow";
      txIsolationLevel: Prisma.TransactionIsolationLevel;
    };
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>;
        fields: Prisma.UserFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>;
          };
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>;
          };
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[];
          };
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>;
          };
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[];
          };
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>;
          };
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>;
          };
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[];
          };
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>;
          };
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateUser>;
          };
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>;
            result: $Utils.Optional<UserGroupByOutputType>[];
          };
          count: {
            args: Prisma.UserCountArgs<ExtArgs>;
            result: $Utils.Optional<UserCountAggregateOutputType> | number;
          };
        };
      };
      Session: {
        payload: Prisma.$SessionPayload<ExtArgs>;
        fields: Prisma.SessionFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.SessionFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.SessionFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>;
          };
          findFirst: {
            args: Prisma.SessionFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.SessionFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>;
          };
          findMany: {
            args: Prisma.SessionFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[];
          };
          create: {
            args: Prisma.SessionCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>;
          };
          createMany: {
            args: Prisma.SessionCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.SessionCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[];
          };
          delete: {
            args: Prisma.SessionDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>;
          };
          update: {
            args: Prisma.SessionUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>;
          };
          deleteMany: {
            args: Prisma.SessionDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.SessionUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.SessionUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[];
          };
          upsert: {
            args: Prisma.SessionUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>;
          };
          aggregate: {
            args: Prisma.SessionAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateSession>;
          };
          groupBy: {
            args: Prisma.SessionGroupByArgs<ExtArgs>;
            result: $Utils.Optional<SessionGroupByOutputType>[];
          };
          count: {
            args: Prisma.SessionCountArgs<ExtArgs>;
            result: $Utils.Optional<SessionCountAggregateOutputType> | number;
          };
        };
      };
      Account: {
        payload: Prisma.$AccountPayload<ExtArgs>;
        fields: Prisma.AccountFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.AccountFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AccountPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.AccountFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>;
          };
          findFirst: {
            args: Prisma.AccountFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AccountPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.AccountFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>;
          };
          findMany: {
            args: Prisma.AccountFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[];
          };
          create: {
            args: Prisma.AccountCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>;
          };
          createMany: {
            args: Prisma.AccountCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.AccountCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[];
          };
          delete: {
            args: Prisma.AccountDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>;
          };
          update: {
            args: Prisma.AccountUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>;
          };
          deleteMany: {
            args: Prisma.AccountDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.AccountUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.AccountUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[];
          };
          upsert: {
            args: Prisma.AccountUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>;
          };
          aggregate: {
            args: Prisma.AccountAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateAccount>;
          };
          groupBy: {
            args: Prisma.AccountGroupByArgs<ExtArgs>;
            result: $Utils.Optional<AccountGroupByOutputType>[];
          };
          count: {
            args: Prisma.AccountCountArgs<ExtArgs>;
            result: $Utils.Optional<AccountCountAggregateOutputType> | number;
          };
        };
      };
      Verification: {
        payload: Prisma.$VerificationPayload<ExtArgs>;
        fields: Prisma.VerificationFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.VerificationFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.VerificationFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>;
          };
          findFirst: {
            args: Prisma.VerificationFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.VerificationFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>;
          };
          findMany: {
            args: Prisma.VerificationFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>[];
          };
          create: {
            args: Prisma.VerificationCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>;
          };
          createMany: {
            args: Prisma.VerificationCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.VerificationCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>[];
          };
          delete: {
            args: Prisma.VerificationDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>;
          };
          update: {
            args: Prisma.VerificationUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>;
          };
          deleteMany: {
            args: Prisma.VerificationDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.VerificationUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.VerificationUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>[];
          };
          upsert: {
            args: Prisma.VerificationUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>;
          };
          aggregate: {
            args: Prisma.VerificationAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateVerification>;
          };
          groupBy: {
            args: Prisma.VerificationGroupByArgs<ExtArgs>;
            result: $Utils.Optional<VerificationGroupByOutputType>[];
          };
          count: {
            args: Prisma.VerificationCountArgs<ExtArgs>;
            result: $Utils.Optional<VerificationCountAggregateOutputType> | number;
          };
        };
      };
      Incident: {
        payload: Prisma.$IncidentPayload<ExtArgs>;
        fields: Prisma.IncidentFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.IncidentFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$IncidentPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.IncidentFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$IncidentPayload>;
          };
          findFirst: {
            args: Prisma.IncidentFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$IncidentPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.IncidentFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$IncidentPayload>;
          };
          findMany: {
            args: Prisma.IncidentFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$IncidentPayload>[];
          };
          create: {
            args: Prisma.IncidentCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$IncidentPayload>;
          };
          createMany: {
            args: Prisma.IncidentCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.IncidentCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$IncidentPayload>[];
          };
          delete: {
            args: Prisma.IncidentDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$IncidentPayload>;
          };
          update: {
            args: Prisma.IncidentUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$IncidentPayload>;
          };
          deleteMany: {
            args: Prisma.IncidentDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.IncidentUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.IncidentUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$IncidentPayload>[];
          };
          upsert: {
            args: Prisma.IncidentUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$IncidentPayload>;
          };
          aggregate: {
            args: Prisma.IncidentAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateIncident>;
          };
          groupBy: {
            args: Prisma.IncidentGroupByArgs<ExtArgs>;
            result: $Utils.Optional<IncidentGroupByOutputType>[];
          };
          count: {
            args: Prisma.IncidentCountArgs<ExtArgs>;
            result: $Utils.Optional<IncidentCountAggregateOutputType> | number;
          };
        };
      };
      IncidentEvent: {
        payload: Prisma.$IncidentEventPayload<ExtArgs>;
        fields: Prisma.IncidentEventFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.IncidentEventFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$IncidentEventPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.IncidentEventFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$IncidentEventPayload>;
          };
          findFirst: {
            args: Prisma.IncidentEventFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$IncidentEventPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.IncidentEventFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$IncidentEventPayload>;
          };
          findMany: {
            args: Prisma.IncidentEventFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$IncidentEventPayload>[];
          };
          create: {
            args: Prisma.IncidentEventCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$IncidentEventPayload>;
          };
          createMany: {
            args: Prisma.IncidentEventCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.IncidentEventCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$IncidentEventPayload>[];
          };
          delete: {
            args: Prisma.IncidentEventDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$IncidentEventPayload>;
          };
          update: {
            args: Prisma.IncidentEventUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$IncidentEventPayload>;
          };
          deleteMany: {
            args: Prisma.IncidentEventDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.IncidentEventUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.IncidentEventUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$IncidentEventPayload>[];
          };
          upsert: {
            args: Prisma.IncidentEventUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$IncidentEventPayload>;
          };
          aggregate: {
            args: Prisma.IncidentEventAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateIncidentEvent>;
          };
          groupBy: {
            args: Prisma.IncidentEventGroupByArgs<ExtArgs>;
            result: $Utils.Optional<IncidentEventGroupByOutputType>[];
          };
          count: {
            args: Prisma.IncidentEventCountArgs<ExtArgs>;
            result: $Utils.Optional<IncidentEventCountAggregateOutputType> | number;
          };
        };
      };
      RegionalIncident: {
        payload: Prisma.$RegionalIncidentPayload<ExtArgs>;
        fields: Prisma.RegionalIncidentFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.RegionalIncidentFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$RegionalIncidentPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.RegionalIncidentFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$RegionalIncidentPayload>;
          };
          findFirst: {
            args: Prisma.RegionalIncidentFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$RegionalIncidentPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.RegionalIncidentFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$RegionalIncidentPayload>;
          };
          findMany: {
            args: Prisma.RegionalIncidentFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$RegionalIncidentPayload>[];
          };
          create: {
            args: Prisma.RegionalIncidentCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$RegionalIncidentPayload>;
          };
          createMany: {
            args: Prisma.RegionalIncidentCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.RegionalIncidentCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$RegionalIncidentPayload>[];
          };
          delete: {
            args: Prisma.RegionalIncidentDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$RegionalIncidentPayload>;
          };
          update: {
            args: Prisma.RegionalIncidentUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$RegionalIncidentPayload>;
          };
          deleteMany: {
            args: Prisma.RegionalIncidentDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.RegionalIncidentUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.RegionalIncidentUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$RegionalIncidentPayload>[];
          };
          upsert: {
            args: Prisma.RegionalIncidentUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$RegionalIncidentPayload>;
          };
          aggregate: {
            args: Prisma.RegionalIncidentAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateRegionalIncident>;
          };
          groupBy: {
            args: Prisma.RegionalIncidentGroupByArgs<ExtArgs>;
            result: $Utils.Optional<RegionalIncidentGroupByOutputType>[];
          };
          count: {
            args: Prisma.RegionalIncidentCountArgs<ExtArgs>;
            result: $Utils.Optional<RegionalIncidentCountAggregateOutputType> | number;
          };
        };
      };
      NotificationChannel: {
        payload: Prisma.$NotificationChannelPayload<ExtArgs>;
        fields: Prisma.NotificationChannelFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.NotificationChannelFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$NotificationChannelPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.NotificationChannelFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$NotificationChannelPayload>;
          };
          findFirst: {
            args: Prisma.NotificationChannelFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$NotificationChannelPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.NotificationChannelFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$NotificationChannelPayload>;
          };
          findMany: {
            args: Prisma.NotificationChannelFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$NotificationChannelPayload>[];
          };
          create: {
            args: Prisma.NotificationChannelCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$NotificationChannelPayload>;
          };
          createMany: {
            args: Prisma.NotificationChannelCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.NotificationChannelCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$NotificationChannelPayload>[];
          };
          delete: {
            args: Prisma.NotificationChannelDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$NotificationChannelPayload>;
          };
          update: {
            args: Prisma.NotificationChannelUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$NotificationChannelPayload>;
          };
          deleteMany: {
            args: Prisma.NotificationChannelDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.NotificationChannelUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.NotificationChannelUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$NotificationChannelPayload>[];
          };
          upsert: {
            args: Prisma.NotificationChannelUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$NotificationChannelPayload>;
          };
          aggregate: {
            args: Prisma.NotificationChannelAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateNotificationChannel>;
          };
          groupBy: {
            args: Prisma.NotificationChannelGroupByArgs<ExtArgs>;
            result: $Utils.Optional<NotificationChannelGroupByOutputType>[];
          };
          count: {
            args: Prisma.NotificationChannelCountArgs<ExtArgs>;
            result: $Utils.Optional<NotificationChannelCountAggregateOutputType> | number;
          };
        };
      };
      AlertRule: {
        payload: Prisma.$AlertRulePayload<ExtArgs>;
        fields: Prisma.AlertRuleFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.AlertRuleFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AlertRulePayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.AlertRuleFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AlertRulePayload>;
          };
          findFirst: {
            args: Prisma.AlertRuleFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AlertRulePayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.AlertRuleFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AlertRulePayload>;
          };
          findMany: {
            args: Prisma.AlertRuleFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AlertRulePayload>[];
          };
          create: {
            args: Prisma.AlertRuleCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AlertRulePayload>;
          };
          createMany: {
            args: Prisma.AlertRuleCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.AlertRuleCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AlertRulePayload>[];
          };
          delete: {
            args: Prisma.AlertRuleDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AlertRulePayload>;
          };
          update: {
            args: Prisma.AlertRuleUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AlertRulePayload>;
          };
          deleteMany: {
            args: Prisma.AlertRuleDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.AlertRuleUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.AlertRuleUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AlertRulePayload>[];
          };
          upsert: {
            args: Prisma.AlertRuleUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AlertRulePayload>;
          };
          aggregate: {
            args: Prisma.AlertRuleAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateAlertRule>;
          };
          groupBy: {
            args: Prisma.AlertRuleGroupByArgs<ExtArgs>;
            result: $Utils.Optional<AlertRuleGroupByOutputType>[];
          };
          count: {
            args: Prisma.AlertRuleCountArgs<ExtArgs>;
            result: $Utils.Optional<AlertRuleCountAggregateOutputType> | number;
          };
        };
      };
      Monitor: {
        payload: Prisma.$MonitorPayload<ExtArgs>;
        fields: Prisma.MonitorFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.MonitorFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$MonitorPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.MonitorFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$MonitorPayload>;
          };
          findFirst: {
            args: Prisma.MonitorFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$MonitorPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.MonitorFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$MonitorPayload>;
          };
          findMany: {
            args: Prisma.MonitorFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$MonitorPayload>[];
          };
          create: {
            args: Prisma.MonitorCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$MonitorPayload>;
          };
          createMany: {
            args: Prisma.MonitorCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.MonitorCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$MonitorPayload>[];
          };
          delete: {
            args: Prisma.MonitorDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$MonitorPayload>;
          };
          update: {
            args: Prisma.MonitorUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$MonitorPayload>;
          };
          deleteMany: {
            args: Prisma.MonitorDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.MonitorUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.MonitorUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$MonitorPayload>[];
          };
          upsert: {
            args: Prisma.MonitorUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$MonitorPayload>;
          };
          aggregate: {
            args: Prisma.MonitorAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateMonitor>;
          };
          groupBy: {
            args: Prisma.MonitorGroupByArgs<ExtArgs>;
            result: $Utils.Optional<MonitorGroupByOutputType>[];
          };
          count: {
            args: Prisma.MonitorCountArgs<ExtArgs>;
            result: $Utils.Optional<MonitorCountAggregateOutputType> | number;
          };
        };
      };
      MonitorEvent: {
        payload: Prisma.$MonitorEventPayload<ExtArgs>;
        fields: Prisma.MonitorEventFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.MonitorEventFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$MonitorEventPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.MonitorEventFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$MonitorEventPayload>;
          };
          findFirst: {
            args: Prisma.MonitorEventFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$MonitorEventPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.MonitorEventFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$MonitorEventPayload>;
          };
          findMany: {
            args: Prisma.MonitorEventFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$MonitorEventPayload>[];
          };
          create: {
            args: Prisma.MonitorEventCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$MonitorEventPayload>;
          };
          createMany: {
            args: Prisma.MonitorEventCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.MonitorEventCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$MonitorEventPayload>[];
          };
          delete: {
            args: Prisma.MonitorEventDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$MonitorEventPayload>;
          };
          update: {
            args: Prisma.MonitorEventUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$MonitorEventPayload>;
          };
          deleteMany: {
            args: Prisma.MonitorEventDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.MonitorEventUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.MonitorEventUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$MonitorEventPayload>[];
          };
          upsert: {
            args: Prisma.MonitorEventUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$MonitorEventPayload>;
          };
          aggregate: {
            args: Prisma.MonitorEventAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateMonitorEvent>;
          };
          groupBy: {
            args: Prisma.MonitorEventGroupByArgs<ExtArgs>;
            result: $Utils.Optional<MonitorEventGroupByOutputType>[];
          };
          count: {
            args: Prisma.MonitorEventCountArgs<ExtArgs>;
            result: $Utils.Optional<MonitorEventCountAggregateOutputType> | number;
          };
        };
      };
      MaintenanceWindow: {
        payload: Prisma.$MaintenanceWindowPayload<ExtArgs>;
        fields: Prisma.MaintenanceWindowFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.MaintenanceWindowFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$MaintenanceWindowPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.MaintenanceWindowFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$MaintenanceWindowPayload>;
          };
          findFirst: {
            args: Prisma.MaintenanceWindowFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$MaintenanceWindowPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.MaintenanceWindowFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$MaintenanceWindowPayload>;
          };
          findMany: {
            args: Prisma.MaintenanceWindowFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$MaintenanceWindowPayload>[];
          };
          create: {
            args: Prisma.MaintenanceWindowCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$MaintenanceWindowPayload>;
          };
          createMany: {
            args: Prisma.MaintenanceWindowCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.MaintenanceWindowCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$MaintenanceWindowPayload>[];
          };
          delete: {
            args: Prisma.MaintenanceWindowDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$MaintenanceWindowPayload>;
          };
          update: {
            args: Prisma.MaintenanceWindowUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$MaintenanceWindowPayload>;
          };
          deleteMany: {
            args: Prisma.MaintenanceWindowDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.MaintenanceWindowUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.MaintenanceWindowUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$MaintenanceWindowPayload>[];
          };
          upsert: {
            args: Prisma.MaintenanceWindowUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$MaintenanceWindowPayload>;
          };
          aggregate: {
            args: Prisma.MaintenanceWindowAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateMaintenanceWindow>;
          };
          groupBy: {
            args: Prisma.MaintenanceWindowGroupByArgs<ExtArgs>;
            result: $Utils.Optional<MaintenanceWindowGroupByOutputType>[];
          };
          count: {
            args: Prisma.MaintenanceWindowCountArgs<ExtArgs>;
            result: $Utils.Optional<MaintenanceWindowCountAggregateOutputType> | number;
          };
        };
      };
    };
  } & {
    other: {
      payload: any;
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]];
          result: any;
        };
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]];
          result: any;
        };
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]];
          result: any;
        };
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]];
          result: any;
        };
      };
    };
  };
  export const defineExtension: $Extensions.ExtendsHook<
    "define",
    Prisma.TypeMapCb,
    $Extensions.DefaultArgs
  >;
  export type DefaultPrismaClient = PrismaClient;
  export type ErrorFormat = "pretty" | "colorless" | "minimal";
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat;
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     *
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     *
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     *
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[];
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number;
      timeout?: number;
      isolationLevel?: Prisma.TransactionIsolationLevel;
    };
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory;
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string;
    /**
     * Global configuration for omitting model fields by default.
     *
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig;
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     *
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[];
  }
  export type GlobalOmitConfig = {
    user?: UserOmit;
    session?: SessionOmit;
    account?: AccountOmit;
    verification?: VerificationOmit;
    incident?: IncidentOmit;
    incidentEvent?: IncidentEventOmit;
    regionalIncident?: RegionalIncidentOmit;
    notificationChannel?: NotificationChannelOmit;
    alertRule?: AlertRuleOmit;
    monitor?: MonitorOmit;
    monitorEvent?: MonitorEventOmit;
    maintenanceWindow?: MaintenanceWindowOmit;
  };

  /* Types for Logging */
  export type LogLevel = "info" | "query" | "warn" | "error";
  export type LogDefinition = {
    level: LogLevel;
    emit: "stdout" | "event";
  };

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<T extends LogDefinition ? T["level"] : T>;

  export type GetEvents<T extends any[]> =
    T extends Array<LogLevel | LogDefinition> ? GetLogType<T[number]> : never;

  export type QueryEvent = {
    timestamp: Date;
    query: string;
    params: string;
    duration: number;
    target: string;
  };

  export type LogEvent = {
    timestamp: Date;
    message: string;
    target: string;
  };
  /* End Types for Logging */

  export type PrismaAction =
    | "findUnique"
    | "findUniqueOrThrow"
    | "findMany"
    | "findFirst"
    | "findFirstOrThrow"
    | "create"
    | "createMany"
    | "createManyAndReturn"
    | "update"
    | "updateMany"
    | "updateManyAndReturn"
    | "upsert"
    | "delete"
    | "deleteMany"
    | "executeRaw"
    | "queryRaw"
    | "aggregate"
    | "count"
    | "runCommandRaw"
    | "findRaw"
    | "groupBy";

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>;

  export type Datasource = {
    url?: string;
  };

  /**
   * Count Types
   */

  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    sessions: number;
    accounts: number;
    monitors: number;
    notificationChannels: number;
  };

  export type UserCountOutputTypeSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    sessions?: boolean | UserCountOutputTypeCountSessionsArgs;
    accounts?: boolean | UserCountOutputTypeCountAccountsArgs;
    monitors?: boolean | UserCountOutputTypeCountMonitorsArgs;
    notificationChannels?: boolean | UserCountOutputTypeCountNotificationChannelsArgs;
  };

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null;
  };

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSessionsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: SessionWhereInput;
  };

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAccountsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: AccountWhereInput;
  };

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountMonitorsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: MonitorWhereInput;
  };

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountNotificationChannelsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: NotificationChannelWhereInput;
  };

  /**
   * Count Type IncidentCountOutputType
   */

  export type IncidentCountOutputType = {
    events: number;
  };

  export type IncidentCountOutputTypeSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    events?: boolean | IncidentCountOutputTypeCountEventsArgs;
  };

  // Custom InputTypes
  /**
   * IncidentCountOutputType without action
   */
  export type IncidentCountOutputTypeDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the IncidentCountOutputType
     */
    select?: IncidentCountOutputTypeSelect<ExtArgs> | null;
  };

  /**
   * IncidentCountOutputType without action
   */
  export type IncidentCountOutputTypeCountEventsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: IncidentEventWhereInput;
  };

  /**
   * Count Type NotificationChannelCountOutputType
   */

  export type NotificationChannelCountOutputType = {
    alertRules: number;
  };

  export type NotificationChannelCountOutputTypeSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    alertRules?: boolean | NotificationChannelCountOutputTypeCountAlertRulesArgs;
  };

  // Custom InputTypes
  /**
   * NotificationChannelCountOutputType without action
   */
  export type NotificationChannelCountOutputTypeDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the NotificationChannelCountOutputType
     */
    select?: NotificationChannelCountOutputTypeSelect<ExtArgs> | null;
  };

  /**
   * NotificationChannelCountOutputType without action
   */
  export type NotificationChannelCountOutputTypeCountAlertRulesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: AlertRuleWhereInput;
  };

  /**
   * Count Type AlertRuleCountOutputType
   */

  export type AlertRuleCountOutputType = {
    channels: number;
  };

  export type AlertRuleCountOutputTypeSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    channels?: boolean | AlertRuleCountOutputTypeCountChannelsArgs;
  };

  // Custom InputTypes
  /**
   * AlertRuleCountOutputType without action
   */
  export type AlertRuleCountOutputTypeDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AlertRuleCountOutputType
     */
    select?: AlertRuleCountOutputTypeSelect<ExtArgs> | null;
  };

  /**
   * AlertRuleCountOutputType without action
   */
  export type AlertRuleCountOutputTypeCountChannelsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: NotificationChannelWhereInput;
  };

  /**
   * Count Type MonitorCountOutputType
   */

  export type MonitorCountOutputType = {
    events: number;
    maintenanceWindows: number;
    alertRules: number;
    incidents: number;
    regionalIncidents: number;
  };

  export type MonitorCountOutputTypeSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    events?: boolean | MonitorCountOutputTypeCountEventsArgs;
    maintenanceWindows?: boolean | MonitorCountOutputTypeCountMaintenanceWindowsArgs;
    alertRules?: boolean | MonitorCountOutputTypeCountAlertRulesArgs;
    incidents?: boolean | MonitorCountOutputTypeCountIncidentsArgs;
    regionalIncidents?: boolean | MonitorCountOutputTypeCountRegionalIncidentsArgs;
  };

  // Custom InputTypes
  /**
   * MonitorCountOutputType without action
   */
  export type MonitorCountOutputTypeDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the MonitorCountOutputType
     */
    select?: MonitorCountOutputTypeSelect<ExtArgs> | null;
  };

  /**
   * MonitorCountOutputType without action
   */
  export type MonitorCountOutputTypeCountEventsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: MonitorEventWhereInput;
  };

  /**
   * MonitorCountOutputType without action
   */
  export type MonitorCountOutputTypeCountMaintenanceWindowsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: MaintenanceWindowWhereInput;
  };

  /**
   * MonitorCountOutputType without action
   */
  export type MonitorCountOutputTypeCountAlertRulesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: AlertRuleWhereInput;
  };

  /**
   * MonitorCountOutputType without action
   */
  export type MonitorCountOutputTypeCountIncidentsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: IncidentWhereInput;
  };

  /**
   * MonitorCountOutputType without action
   */
  export type MonitorCountOutputTypeCountRegionalIncidentsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: RegionalIncidentWhereInput;
  };

  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null;
    _min: UserMinAggregateOutputType | null;
    _max: UserMaxAggregateOutputType | null;
  };

  export type UserMinAggregateOutputType = {
    id: string | null;
    name: string | null;
    email: string | null;
    emailVerified: boolean | null;
    image: string | null;
    timezone: string | null;
    dateFormat: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type UserMaxAggregateOutputType = {
    id: string | null;
    name: string | null;
    email: string | null;
    emailVerified: boolean | null;
    image: string | null;
    timezone: string | null;
    dateFormat: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type UserCountAggregateOutputType = {
    id: number;
    name: number;
    email: number;
    emailVerified: number;
    image: number;
    timezone: number;
    dateFormat: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
  };

  export type UserMinAggregateInputType = {
    id?: true;
    name?: true;
    email?: true;
    emailVerified?: true;
    image?: true;
    timezone?: true;
    dateFormat?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type UserMaxAggregateInputType = {
    id?: true;
    name?: true;
    email?: true;
    emailVerified?: true;
    image?: true;
    timezone?: true;
    dateFormat?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type UserCountAggregateInputType = {
    id?: true;
    name?: true;
    email?: true;
    emailVerified?: true;
    image?: true;
    timezone?: true;
    dateFormat?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
  };

  export type UserAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Users from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Users.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Users
     **/
    _count?: true | UserCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: UserMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: UserMaxAggregateInputType;
  };

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
    [P in keyof T & keyof AggregateUser]: P extends "_count" | "count"
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>;
  };

  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      where?: UserWhereInput;
      orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[];
      by: UserScalarFieldEnum[] | UserScalarFieldEnum;
      having?: UserScalarWhereWithAggregatesInput;
      take?: number;
      skip?: number;
      _count?: UserCountAggregateInputType | true;
      _min?: UserMinAggregateInputType;
      _max?: UserMaxAggregateInputType;
    };

  export type UserGroupByOutputType = {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image: string | null;
    timezone: string | null;
    dateFormat: string | null;
    createdAt: Date;
    updatedAt: Date;
    _count: UserCountAggregateOutputType | null;
    _min: UserMinAggregateOutputType | null;
    _max: UserMaxAggregateOutputType | null;
  };

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T["by"]> & {
        [P in keyof T & keyof UserGroupByOutputType]: P extends "_count"
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], UserGroupByOutputType[P]>
          : GetScalarType<T[P], UserGroupByOutputType[P]>;
      }
    >
  >;

  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetSelect<
      {
        id?: boolean;
        name?: boolean;
        email?: boolean;
        emailVerified?: boolean;
        image?: boolean;
        timezone?: boolean;
        dateFormat?: boolean;
        createdAt?: boolean;
        updatedAt?: boolean;
        sessions?: boolean | User$sessionsArgs<ExtArgs>;
        accounts?: boolean | User$accountsArgs<ExtArgs>;
        monitors?: boolean | User$monitorsArgs<ExtArgs>;
        notificationChannels?: boolean | User$notificationChannelsArgs<ExtArgs>;
        _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>;
      },
      ExtArgs["result"]["user"]
    >;

  export type UserSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      name?: boolean;
      email?: boolean;
      emailVerified?: boolean;
      image?: boolean;
      timezone?: boolean;
      dateFormat?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
    },
    ExtArgs["result"]["user"]
  >;

  export type UserSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      name?: boolean;
      email?: boolean;
      emailVerified?: boolean;
      image?: boolean;
      timezone?: boolean;
      dateFormat?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
    },
    ExtArgs["result"]["user"]
  >;

  export type UserSelectScalar = {
    id?: boolean;
    name?: boolean;
    email?: boolean;
    emailVerified?: boolean;
    image?: boolean;
    timezone?: boolean;
    dateFormat?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
  };

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetOmit<
      | "id"
      | "name"
      | "email"
      | "emailVerified"
      | "image"
      | "timezone"
      | "dateFormat"
      | "createdAt"
      | "updatedAt",
      ExtArgs["result"]["user"]
    >;
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sessions?: boolean | User$sessionsArgs<ExtArgs>;
    accounts?: boolean | User$accountsArgs<ExtArgs>;
    monitors?: boolean | User$monitorsArgs<ExtArgs>;
    notificationChannels?: boolean | User$notificationChannelsArgs<ExtArgs>;
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>;
  };
  export type UserIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {};
  export type UserIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {};

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User";
    objects: {
      sessions: Prisma.$SessionPayload<ExtArgs>[];
      accounts: Prisma.$AccountPayload<ExtArgs>[];
      monitors: Prisma.$MonitorPayload<ExtArgs>[];
      notificationChannels: Prisma.$NotificationChannelPayload<ExtArgs>[];
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        name: string;
        email: string;
        emailVerified: boolean;
        image: string | null;
        timezone: string | null;
        dateFormat: string | null;
        createdAt: Date;
        updatedAt: Date;
      },
      ExtArgs["result"]["user"]
    >;
    composites: {};
  };

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<
    Prisma.$UserPayload,
    S
  >;

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = Omit<
    UserFindManyArgs,
    "select" | "include" | "distinct" | "omit"
  > & {
    select?: UserCountAggregateInputType | true;
  };

  export interface UserDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>["model"]["User"]; meta: { name: "User" } };
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(
      args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>,
    ): Prisma__UserClient<
      $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(
      args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__UserClient<
      $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(
      args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>,
    ): Prisma__UserClient<
      $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(
      args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__UserClient<
      $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     *
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     *
     */
    findMany<T extends UserFindManyArgs>(
      args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>
    >;

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     *
     */
    create<T extends UserCreateArgs>(
      args: SelectSubset<T, UserCreateArgs<ExtArgs>>,
    ): Prisma__UserClient<
      $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends UserCreateManyArgs>(
      args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(
      args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>
    >;

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     *
     */
    delete<T extends UserDeleteArgs>(
      args: SelectSubset<T, UserDeleteArgs<ExtArgs>>,
    ): Prisma__UserClient<
      $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends UserUpdateArgs>(
      args: SelectSubset<T, UserUpdateArgs<ExtArgs>>,
    ): Prisma__UserClient<
      $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends UserDeleteManyArgs>(
      args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends UserUpdateManyArgs>(
      args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(
      args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>
    >;

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(
      args: SelectSubset<T, UserUpsertArgs<ExtArgs>>,
    ): Prisma__UserClient<
      $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
     **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<"select", any>
        ? T["select"] extends true
          ? number
          : GetScalarType<T["select"], UserCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends UserAggregateArgs>(
      args: Subset<T, UserAggregateArgs>,
    ): Prisma.PrismaPromise<GetUserAggregateType<T>>;

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<Extends<"skip", Keys<T>>, Extends<"take", Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs["orderBy"] }
        : { orderBy?: UserGroupByArgs["orderBy"] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T["orderBy"]>>>,
      ByFields extends MaybeTupleToUnion<T["by"]>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T["having"]>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T["by"] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [Error, "Field ", P, ` in "having" needs to be provided in "by"`];
            }[HavingFields]
          : "take" extends Keys<T>
            ? "orderBy" extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : "skip" extends Keys<T>
              ? "orderBy" extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the User model
     */
    readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    sessions<T extends User$sessionsArgs<ExtArgs> = {}>(
      args?: Subset<T, User$sessionsArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null
    >;
    accounts<T extends User$accountsArgs<ExtArgs> = {}>(
      args?: Subset<T, User$accountsArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null
    >;
    monitors<T extends User$monitorsArgs<ExtArgs> = {}>(
      args?: Subset<T, User$monitorsArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$MonitorPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null
    >;
    notificationChannels<T extends User$notificationChannelsArgs<ExtArgs> = {}>(
      args?: Subset<T, User$notificationChannelsArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$NotificationChannelPayload<ExtArgs>,
          T,
          "findMany",
          GlobalOmitOptions
        >
      | Null
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", "String">;
    readonly name: FieldRef<"User", "String">;
    readonly email: FieldRef<"User", "String">;
    readonly emailVerified: FieldRef<"User", "Boolean">;
    readonly image: FieldRef<"User", "String">;
    readonly timezone: FieldRef<"User", "String">;
    readonly dateFormat: FieldRef<"User", "String">;
    readonly createdAt: FieldRef<"User", "DateTime">;
    readonly updatedAt: FieldRef<"User", "DateTime">;
  }

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput;
  };

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput;
  };

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Users from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Users.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[];
  };

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Users from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Users.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[];
  };

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      /**
       * Select specific fields to fetch from the User
       */
      select?: UserSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the User
       */
      omit?: UserOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: UserInclude<ExtArgs> | null;
      /**
       * Filter, which Users to fetch.
       */
      where?: UserWhereInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
       *
       * Determine the order of Users to fetch.
       */
      orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[];
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
       *
       * Sets the position for listing Users.
       */
      cursor?: UserWhereUniqueInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Take `±n` Users from the position of the cursor.
       */
      take?: number;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Skip the first `n` Users.
       */
      skip?: number;
      distinct?: UserScalarFieldEnum | UserScalarFieldEnum[];
    };

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>;
  };

  /**
   * User createMany
   */
  export type UserCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>;
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput;
  };

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>;
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput;
    /**
     * Limit how many Users to update.
     */
    limit?: number;
  };

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>;
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput;
    /**
     * Limit how many Users to update.
     */
    limit?: number;
  };

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput;
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>;
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>;
  };

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput;
  };

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput;
    /**
     * Limit how many Users to delete.
     */
    limit?: number;
  };

  /**
   * User.sessions
   */
  export type User$sessionsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null;
    where?: SessionWhereInput;
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[];
    cursor?: SessionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[];
  };

  /**
   * User.accounts
   */
  export type User$accountsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null;
    where?: AccountWhereInput;
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[];
    cursor?: AccountWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[];
  };

  /**
   * User.monitors
   */
  export type User$monitorsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Monitor
     */
    select?: MonitorSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Monitor
     */
    omit?: MonitorOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MonitorInclude<ExtArgs> | null;
    where?: MonitorWhereInput;
    orderBy?: MonitorOrderByWithRelationInput | MonitorOrderByWithRelationInput[];
    cursor?: MonitorWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: MonitorScalarFieldEnum | MonitorScalarFieldEnum[];
  };

  /**
   * User.notificationChannels
   */
  export type User$notificationChannelsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the NotificationChannel
     */
    select?: NotificationChannelSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the NotificationChannel
     */
    omit?: NotificationChannelOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationChannelInclude<ExtArgs> | null;
    where?: NotificationChannelWhereInput;
    orderBy?:
      | NotificationChannelOrderByWithRelationInput
      | NotificationChannelOrderByWithRelationInput[];
    cursor?: NotificationChannelWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: NotificationChannelScalarFieldEnum | NotificationChannelScalarFieldEnum[];
  };

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      /**
       * Select specific fields to fetch from the User
       */
      select?: UserSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the User
       */
      omit?: UserOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: UserInclude<ExtArgs> | null;
    };

  /**
   * Model Session
   */

  export type AggregateSession = {
    _count: SessionCountAggregateOutputType | null;
    _min: SessionMinAggregateOutputType | null;
    _max: SessionMaxAggregateOutputType | null;
  };

  export type SessionMinAggregateOutputType = {
    id: string | null;
    expiresAt: Date | null;
    token: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    ipAddress: string | null;
    userAgent: string | null;
    userId: string | null;
  };

  export type SessionMaxAggregateOutputType = {
    id: string | null;
    expiresAt: Date | null;
    token: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    ipAddress: string | null;
    userAgent: string | null;
    userId: string | null;
  };

  export type SessionCountAggregateOutputType = {
    id: number;
    expiresAt: number;
    token: number;
    createdAt: number;
    updatedAt: number;
    ipAddress: number;
    userAgent: number;
    userId: number;
    _all: number;
  };

  export type SessionMinAggregateInputType = {
    id?: true;
    expiresAt?: true;
    token?: true;
    createdAt?: true;
    updatedAt?: true;
    ipAddress?: true;
    userAgent?: true;
    userId?: true;
  };

  export type SessionMaxAggregateInputType = {
    id?: true;
    expiresAt?: true;
    token?: true;
    createdAt?: true;
    updatedAt?: true;
    ipAddress?: true;
    userAgent?: true;
    userId?: true;
  };

  export type SessionCountAggregateInputType = {
    id?: true;
    expiresAt?: true;
    token?: true;
    createdAt?: true;
    updatedAt?: true;
    ipAddress?: true;
    userAgent?: true;
    userId?: true;
    _all?: true;
  };

  export type SessionAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Session to aggregate.
     */
    where?: SessionWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: SessionWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Sessions.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Sessions
     **/
    _count?: true | SessionCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: SessionMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: SessionMaxAggregateInputType;
  };

  export type GetSessionAggregateType<T extends SessionAggregateArgs> = {
    [P in keyof T & keyof AggregateSession]: P extends "_count" | "count"
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSession[P]>
      : GetScalarType<T[P], AggregateSession[P]>;
  };

  export type SessionGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: SessionWhereInput;
    orderBy?: SessionOrderByWithAggregationInput | SessionOrderByWithAggregationInput[];
    by: SessionScalarFieldEnum[] | SessionScalarFieldEnum;
    having?: SessionScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: SessionCountAggregateInputType | true;
    _min?: SessionMinAggregateInputType;
    _max?: SessionMaxAggregateInputType;
  };

  export type SessionGroupByOutputType = {
    id: string;
    expiresAt: Date;
    token: string;
    createdAt: Date;
    updatedAt: Date;
    ipAddress: string | null;
    userAgent: string | null;
    userId: string;
    _count: SessionCountAggregateOutputType | null;
    _min: SessionMinAggregateOutputType | null;
    _max: SessionMaxAggregateOutputType | null;
  };

  type GetSessionGroupByPayload<T extends SessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SessionGroupByOutputType, T["by"]> & {
        [P in keyof T & keyof SessionGroupByOutputType]: P extends "_count"
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], SessionGroupByOutputType[P]>
          : GetScalarType<T[P], SessionGroupByOutputType[P]>;
      }
    >
  >;

  export type SessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetSelect<
      {
        id?: boolean;
        expiresAt?: boolean;
        token?: boolean;
        createdAt?: boolean;
        updatedAt?: boolean;
        ipAddress?: boolean;
        userAgent?: boolean;
        userId?: boolean;
        user?: boolean | UserDefaultArgs<ExtArgs>;
      },
      ExtArgs["result"]["session"]
    >;

  export type SessionSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      expiresAt?: boolean;
      token?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      ipAddress?: boolean;
      userAgent?: boolean;
      userId?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs["result"]["session"]
  >;

  export type SessionSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      expiresAt?: boolean;
      token?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      ipAddress?: boolean;
      userAgent?: boolean;
      userId?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs["result"]["session"]
  >;

  export type SessionSelectScalar = {
    id?: boolean;
    expiresAt?: boolean;
    token?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    ipAddress?: boolean;
    userAgent?: boolean;
    userId?: boolean;
  };

  export type SessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetOmit<
      | "id"
      | "expiresAt"
      | "token"
      | "createdAt"
      | "updatedAt"
      | "ipAddress"
      | "userAgent"
      | "userId",
      ExtArgs["result"]["session"]
    >;
  export type SessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
  };
  export type SessionIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
  };
  export type SessionIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
  };

  export type $SessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      name: "Session";
      objects: {
        user: Prisma.$UserPayload<ExtArgs>;
      };
      scalars: $Extensions.GetPayloadResult<
        {
          id: string;
          expiresAt: Date;
          token: string;
          createdAt: Date;
          updatedAt: Date;
          ipAddress: string | null;
          userAgent: string | null;
          userId: string;
        },
        ExtArgs["result"]["session"]
      >;
      composites: {};
    };

  type SessionGetPayload<S extends boolean | null | undefined | SessionDefaultArgs> =
    $Result.GetResult<Prisma.$SessionPayload, S>;

  type SessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = Omit<
    SessionFindManyArgs,
    "select" | "include" | "distinct" | "omit"
  > & {
    select?: SessionCountAggregateInputType | true;
  };

  export interface SessionDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>["model"]["Session"]; meta: { name: "Session" } };
    /**
     * Find zero or one Session that matches the filter.
     * @param {SessionFindUniqueArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SessionFindUniqueArgs>(
      args: SelectSubset<T, SessionFindUniqueArgs<ExtArgs>>,
    ): Prisma__SessionClient<
      $Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one Session that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SessionFindUniqueOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SessionFindUniqueOrThrowArgs>(
      args: SelectSubset<T, SessionFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__SessionClient<
      $Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Session that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SessionFindFirstArgs>(
      args?: SelectSubset<T, SessionFindFirstArgs<ExtArgs>>,
    ): Prisma__SessionClient<
      $Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Session that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SessionFindFirstOrThrowArgs>(
      args?: SelectSubset<T, SessionFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__SessionClient<
      $Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more Sessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Sessions
     * const sessions = await prisma.session.findMany()
     *
     * // Get first 10 Sessions
     * const sessions = await prisma.session.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const sessionWithIdOnly = await prisma.session.findMany({ select: { id: true } })
     *
     */
    findMany<T extends SessionFindManyArgs>(
      args?: SelectSubset<T, SessionFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>
    >;

    /**
     * Create a Session.
     * @param {SessionCreateArgs} args - Arguments to create a Session.
     * @example
     * // Create one Session
     * const Session = await prisma.session.create({
     *   data: {
     *     // ... data to create a Session
     *   }
     * })
     *
     */
    create<T extends SessionCreateArgs>(
      args: SelectSubset<T, SessionCreateArgs<ExtArgs>>,
    ): Prisma__SessionClient<
      $Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many Sessions.
     * @param {SessionCreateManyArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends SessionCreateManyArgs>(
      args?: SelectSubset<T, SessionCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many Sessions and returns the data saved in the database.
     * @param {SessionCreateManyAndReturnArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Sessions and only return the `id`
     * const sessionWithIdOnly = await prisma.session.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends SessionCreateManyAndReturnArgs>(
      args?: SelectSubset<T, SessionCreateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$SessionPayload<ExtArgs>,
        T,
        "createManyAndReturn",
        GlobalOmitOptions
      >
    >;

    /**
     * Delete a Session.
     * @param {SessionDeleteArgs} args - Arguments to delete one Session.
     * @example
     * // Delete one Session
     * const Session = await prisma.session.delete({
     *   where: {
     *     // ... filter to delete one Session
     *   }
     * })
     *
     */
    delete<T extends SessionDeleteArgs>(
      args: SelectSubset<T, SessionDeleteArgs<ExtArgs>>,
    ): Prisma__SessionClient<
      $Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one Session.
     * @param {SessionUpdateArgs} args - Arguments to update one Session.
     * @example
     * // Update one Session
     * const session = await prisma.session.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends SessionUpdateArgs>(
      args: SelectSubset<T, SessionUpdateArgs<ExtArgs>>,
    ): Prisma__SessionClient<
      $Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more Sessions.
     * @param {SessionDeleteManyArgs} args - Arguments to filter Sessions to delete.
     * @example
     * // Delete a few Sessions
     * const { count } = await prisma.session.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends SessionDeleteManyArgs>(
      args?: SelectSubset<T, SessionDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends SessionUpdateManyArgs>(
      args: SelectSubset<T, SessionUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Sessions and returns the data updated in the database.
     * @param {SessionUpdateManyAndReturnArgs} args - Arguments to update many Sessions.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Sessions and only return the `id`
     * const sessionWithIdOnly = await prisma.session.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends SessionUpdateManyAndReturnArgs>(
      args: SelectSubset<T, SessionUpdateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$SessionPayload<ExtArgs>,
        T,
        "updateManyAndReturn",
        GlobalOmitOptions
      >
    >;

    /**
     * Create or update one Session.
     * @param {SessionUpsertArgs} args - Arguments to update or create a Session.
     * @example
     * // Update or create a Session
     * const session = await prisma.session.upsert({
     *   create: {
     *     // ... data to create a Session
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Session we want to update
     *   }
     * })
     */
    upsert<T extends SessionUpsertArgs>(
      args: SelectSubset<T, SessionUpsertArgs<ExtArgs>>,
    ): Prisma__SessionClient<
      $Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionCountArgs} args - Arguments to filter Sessions to count.
     * @example
     * // Count the number of Sessions
     * const count = await prisma.session.count({
     *   where: {
     *     // ... the filter for the Sessions we want to count
     *   }
     * })
     **/
    count<T extends SessionCountArgs>(
      args?: Subset<T, SessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<"select", any>
        ? T["select"] extends true
          ? number
          : GetScalarType<T["select"], SessionCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends SessionAggregateArgs>(
      args: Subset<T, SessionAggregateArgs>,
    ): Prisma.PrismaPromise<GetSessionAggregateType<T>>;

    /**
     * Group by Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends SessionGroupByArgs,
      HasSelectOrTake extends Or<Extends<"skip", Keys<T>>, Extends<"take", Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SessionGroupByArgs["orderBy"] }
        : { orderBy?: SessionGroupByArgs["orderBy"] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T["orderBy"]>>>,
      ByFields extends MaybeTupleToUnion<T["by"]>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T["having"]>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T["by"] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [Error, "Field ", P, ` in "having" needs to be provided in "by"`];
            }[HavingFields]
          : "take" extends Keys<T>
            ? "orderBy" extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : "skip" extends Keys<T>
              ? "orderBy" extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, SessionGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors ? GetSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Session model
     */
    readonly fields: SessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Session.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SessionClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    user<T extends UserDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, UserDefaultArgs<ExtArgs>>,
    ): Prisma__UserClient<
      | $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the Session model
   */
  interface SessionFieldRefs {
    readonly id: FieldRef<"Session", "String">;
    readonly expiresAt: FieldRef<"Session", "DateTime">;
    readonly token: FieldRef<"Session", "String">;
    readonly createdAt: FieldRef<"Session", "DateTime">;
    readonly updatedAt: FieldRef<"Session", "DateTime">;
    readonly ipAddress: FieldRef<"Session", "String">;
    readonly userAgent: FieldRef<"Session", "String">;
    readonly userId: FieldRef<"Session", "String">;
  }

  // Custom InputTypes
  /**
   * Session findUnique
   */
  export type SessionFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null;
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput;
  };

  /**
   * Session findUniqueOrThrow
   */
  export type SessionFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null;
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput;
  };

  /**
   * Session findFirst
   */
  export type SessionFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null;
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Sessions.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[];
  };

  /**
   * Session findFirstOrThrow
   */
  export type SessionFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null;
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Sessions.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[];
  };

  /**
   * Session findMany
   */
  export type SessionFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null;
    /**
     * Filter, which Sessions to fetch.
     */
    where?: SessionWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Sessions.
     */
    cursor?: SessionWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Sessions.
     */
    skip?: number;
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[];
  };

  /**
   * Session create
   */
  export type SessionCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null;
    /**
     * The data needed to create a Session.
     */
    data: XOR<SessionCreateInput, SessionUncheckedCreateInput>;
  };

  /**
   * Session createMany
   */
  export type SessionCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * Session createManyAndReturn
   */
  export type SessionCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null;
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * Session update
   */
  export type SessionUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null;
    /**
     * The data needed to update a Session.
     */
    data: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>;
    /**
     * Choose, which Session to update.
     */
    where: SessionWhereUniqueInput;
  };

  /**
   * Session updateMany
   */
  export type SessionUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>;
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput;
    /**
     * Limit how many Sessions to update.
     */
    limit?: number;
  };

  /**
   * Session updateManyAndReturn
   */
  export type SessionUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null;
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>;
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput;
    /**
     * Limit how many Sessions to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionIncludeUpdateManyAndReturn<ExtArgs> | null;
  };

  /**
   * Session upsert
   */
  export type SessionUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null;
    /**
     * The filter to search for the Session to update in case it exists.
     */
    where: SessionWhereUniqueInput;
    /**
     * In case the Session found by the `where` argument doesn't exist, create a new Session with this data.
     */
    create: XOR<SessionCreateInput, SessionUncheckedCreateInput>;
    /**
     * In case the Session was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>;
  };

  /**
   * Session delete
   */
  export type SessionDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null;
    /**
     * Filter which Session to delete.
     */
    where: SessionWhereUniqueInput;
  };

  /**
   * Session deleteMany
   */
  export type SessionDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Sessions to delete
     */
    where?: SessionWhereInput;
    /**
     * Limit how many Sessions to delete.
     */
    limit?: number;
  };

  /**
   * Session without action
   */
  export type SessionDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null;
  };

  /**
   * Model Account
   */

  export type AggregateAccount = {
    _count: AccountCountAggregateOutputType | null;
    _min: AccountMinAggregateOutputType | null;
    _max: AccountMaxAggregateOutputType | null;
  };

  export type AccountMinAggregateOutputType = {
    id: string | null;
    accountId: string | null;
    providerId: string | null;
    userId: string | null;
    accessToken: string | null;
    refreshToken: string | null;
    idToken: string | null;
    accessTokenExpiresAt: Date | null;
    refreshTokenExpiresAt: Date | null;
    scope: string | null;
    password: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type AccountMaxAggregateOutputType = {
    id: string | null;
    accountId: string | null;
    providerId: string | null;
    userId: string | null;
    accessToken: string | null;
    refreshToken: string | null;
    idToken: string | null;
    accessTokenExpiresAt: Date | null;
    refreshTokenExpiresAt: Date | null;
    scope: string | null;
    password: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type AccountCountAggregateOutputType = {
    id: number;
    accountId: number;
    providerId: number;
    userId: number;
    accessToken: number;
    refreshToken: number;
    idToken: number;
    accessTokenExpiresAt: number;
    refreshTokenExpiresAt: number;
    scope: number;
    password: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
  };

  export type AccountMinAggregateInputType = {
    id?: true;
    accountId?: true;
    providerId?: true;
    userId?: true;
    accessToken?: true;
    refreshToken?: true;
    idToken?: true;
    accessTokenExpiresAt?: true;
    refreshTokenExpiresAt?: true;
    scope?: true;
    password?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type AccountMaxAggregateInputType = {
    id?: true;
    accountId?: true;
    providerId?: true;
    userId?: true;
    accessToken?: true;
    refreshToken?: true;
    idToken?: true;
    accessTokenExpiresAt?: true;
    refreshTokenExpiresAt?: true;
    scope?: true;
    password?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type AccountCountAggregateInputType = {
    id?: true;
    accountId?: true;
    providerId?: true;
    userId?: true;
    accessToken?: true;
    refreshToken?: true;
    idToken?: true;
    accessTokenExpiresAt?: true;
    refreshTokenExpiresAt?: true;
    scope?: true;
    password?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
  };

  export type AccountAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Account to aggregate.
     */
    where?: AccountWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: AccountWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Accounts.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Accounts
     **/
    _count?: true | AccountCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: AccountMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: AccountMaxAggregateInputType;
  };

  export type GetAccountAggregateType<T extends AccountAggregateArgs> = {
    [P in keyof T & keyof AggregateAccount]: P extends "_count" | "count"
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAccount[P]>
      : GetScalarType<T[P], AggregateAccount[P]>;
  };

  export type AccountGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: AccountWhereInput;
    orderBy?: AccountOrderByWithAggregationInput | AccountOrderByWithAggregationInput[];
    by: AccountScalarFieldEnum[] | AccountScalarFieldEnum;
    having?: AccountScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: AccountCountAggregateInputType | true;
    _min?: AccountMinAggregateInputType;
    _max?: AccountMaxAggregateInputType;
  };

  export type AccountGroupByOutputType = {
    id: string;
    accountId: string;
    providerId: string;
    userId: string;
    accessToken: string | null;
    refreshToken: string | null;
    idToken: string | null;
    accessTokenExpiresAt: Date | null;
    refreshTokenExpiresAt: Date | null;
    scope: string | null;
    password: string | null;
    createdAt: Date;
    updatedAt: Date;
    _count: AccountCountAggregateOutputType | null;
    _min: AccountMinAggregateOutputType | null;
    _max: AccountMaxAggregateOutputType | null;
  };

  type GetAccountGroupByPayload<T extends AccountGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AccountGroupByOutputType, T["by"]> & {
        [P in keyof T & keyof AccountGroupByOutputType]: P extends "_count"
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], AccountGroupByOutputType[P]>
          : GetScalarType<T[P], AccountGroupByOutputType[P]>;
      }
    >
  >;

  export type AccountSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetSelect<
      {
        id?: boolean;
        accountId?: boolean;
        providerId?: boolean;
        userId?: boolean;
        accessToken?: boolean;
        refreshToken?: boolean;
        idToken?: boolean;
        accessTokenExpiresAt?: boolean;
        refreshTokenExpiresAt?: boolean;
        scope?: boolean;
        password?: boolean;
        createdAt?: boolean;
        updatedAt?: boolean;
        user?: boolean | UserDefaultArgs<ExtArgs>;
      },
      ExtArgs["result"]["account"]
    >;

  export type AccountSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      accountId?: boolean;
      providerId?: boolean;
      userId?: boolean;
      accessToken?: boolean;
      refreshToken?: boolean;
      idToken?: boolean;
      accessTokenExpiresAt?: boolean;
      refreshTokenExpiresAt?: boolean;
      scope?: boolean;
      password?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs["result"]["account"]
  >;

  export type AccountSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      accountId?: boolean;
      providerId?: boolean;
      userId?: boolean;
      accessToken?: boolean;
      refreshToken?: boolean;
      idToken?: boolean;
      accessTokenExpiresAt?: boolean;
      refreshTokenExpiresAt?: boolean;
      scope?: boolean;
      password?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs["result"]["account"]
  >;

  export type AccountSelectScalar = {
    id?: boolean;
    accountId?: boolean;
    providerId?: boolean;
    userId?: boolean;
    accessToken?: boolean;
    refreshToken?: boolean;
    idToken?: boolean;
    accessTokenExpiresAt?: boolean;
    refreshTokenExpiresAt?: boolean;
    scope?: boolean;
    password?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
  };

  export type AccountOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetOmit<
      | "id"
      | "accountId"
      | "providerId"
      | "userId"
      | "accessToken"
      | "refreshToken"
      | "idToken"
      | "accessTokenExpiresAt"
      | "refreshTokenExpiresAt"
      | "scope"
      | "password"
      | "createdAt"
      | "updatedAt",
      ExtArgs["result"]["account"]
    >;
  export type AccountInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
  };
  export type AccountIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
  };
  export type AccountIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
  };

  export type $AccountPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      name: "Account";
      objects: {
        user: Prisma.$UserPayload<ExtArgs>;
      };
      scalars: $Extensions.GetPayloadResult<
        {
          id: string;
          accountId: string;
          providerId: string;
          userId: string;
          accessToken: string | null;
          refreshToken: string | null;
          idToken: string | null;
          accessTokenExpiresAt: Date | null;
          refreshTokenExpiresAt: Date | null;
          scope: string | null;
          password: string | null;
          createdAt: Date;
          updatedAt: Date;
        },
        ExtArgs["result"]["account"]
      >;
      composites: {};
    };

  type AccountGetPayload<S extends boolean | null | undefined | AccountDefaultArgs> =
    $Result.GetResult<Prisma.$AccountPayload, S>;

  type AccountCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = Omit<
    AccountFindManyArgs,
    "select" | "include" | "distinct" | "omit"
  > & {
    select?: AccountCountAggregateInputType | true;
  };

  export interface AccountDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>["model"]["Account"]; meta: { name: "Account" } };
    /**
     * Find zero or one Account that matches the filter.
     * @param {AccountFindUniqueArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AccountFindUniqueArgs>(
      args: SelectSubset<T, AccountFindUniqueArgs<ExtArgs>>,
    ): Prisma__AccountClient<
      $Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one Account that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AccountFindUniqueOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AccountFindUniqueOrThrowArgs>(
      args: SelectSubset<T, AccountFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__AccountClient<
      $Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Account that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindFirstArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AccountFindFirstArgs>(
      args?: SelectSubset<T, AccountFindFirstArgs<ExtArgs>>,
    ): Prisma__AccountClient<
      $Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Account that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindFirstOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AccountFindFirstOrThrowArgs>(
      args?: SelectSubset<T, AccountFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__AccountClient<
      $Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more Accounts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Accounts
     * const accounts = await prisma.account.findMany()
     *
     * // Get first 10 Accounts
     * const accounts = await prisma.account.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const accountWithIdOnly = await prisma.account.findMany({ select: { id: true } })
     *
     */
    findMany<T extends AccountFindManyArgs>(
      args?: SelectSubset<T, AccountFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>
    >;

    /**
     * Create a Account.
     * @param {AccountCreateArgs} args - Arguments to create a Account.
     * @example
     * // Create one Account
     * const Account = await prisma.account.create({
     *   data: {
     *     // ... data to create a Account
     *   }
     * })
     *
     */
    create<T extends AccountCreateArgs>(
      args: SelectSubset<T, AccountCreateArgs<ExtArgs>>,
    ): Prisma__AccountClient<
      $Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "create", GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many Accounts.
     * @param {AccountCreateManyArgs} args - Arguments to create many Accounts.
     * @example
     * // Create many Accounts
     * const account = await prisma.account.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends AccountCreateManyArgs>(
      args?: SelectSubset<T, AccountCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many Accounts and returns the data saved in the database.
     * @param {AccountCreateManyAndReturnArgs} args - Arguments to create many Accounts.
     * @example
     * // Create many Accounts
     * const account = await prisma.account.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Accounts and only return the `id`
     * const accountWithIdOnly = await prisma.account.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends AccountCreateManyAndReturnArgs>(
      args?: SelectSubset<T, AccountCreateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$AccountPayload<ExtArgs>,
        T,
        "createManyAndReturn",
        GlobalOmitOptions
      >
    >;

    /**
     * Delete a Account.
     * @param {AccountDeleteArgs} args - Arguments to delete one Account.
     * @example
     * // Delete one Account
     * const Account = await prisma.account.delete({
     *   where: {
     *     // ... filter to delete one Account
     *   }
     * })
     *
     */
    delete<T extends AccountDeleteArgs>(
      args: SelectSubset<T, AccountDeleteArgs<ExtArgs>>,
    ): Prisma__AccountClient<
      $Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "delete", GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one Account.
     * @param {AccountUpdateArgs} args - Arguments to update one Account.
     * @example
     * // Update one Account
     * const account = await prisma.account.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends AccountUpdateArgs>(
      args: SelectSubset<T, AccountUpdateArgs<ExtArgs>>,
    ): Prisma__AccountClient<
      $Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "update", GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more Accounts.
     * @param {AccountDeleteManyArgs} args - Arguments to filter Accounts to delete.
     * @example
     * // Delete a few Accounts
     * const { count } = await prisma.account.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends AccountDeleteManyArgs>(
      args?: SelectSubset<T, AccountDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Accounts
     * const account = await prisma.account.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends AccountUpdateManyArgs>(
      args: SelectSubset<T, AccountUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Accounts and returns the data updated in the database.
     * @param {AccountUpdateManyAndReturnArgs} args - Arguments to update many Accounts.
     * @example
     * // Update many Accounts
     * const account = await prisma.account.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Accounts and only return the `id`
     * const accountWithIdOnly = await prisma.account.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends AccountUpdateManyAndReturnArgs>(
      args: SelectSubset<T, AccountUpdateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$AccountPayload<ExtArgs>,
        T,
        "updateManyAndReturn",
        GlobalOmitOptions
      >
    >;

    /**
     * Create or update one Account.
     * @param {AccountUpsertArgs} args - Arguments to update or create a Account.
     * @example
     * // Update or create a Account
     * const account = await prisma.account.upsert({
     *   create: {
     *     // ... data to create a Account
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Account we want to update
     *   }
     * })
     */
    upsert<T extends AccountUpsertArgs>(
      args: SelectSubset<T, AccountUpsertArgs<ExtArgs>>,
    ): Prisma__AccountClient<
      $Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountCountArgs} args - Arguments to filter Accounts to count.
     * @example
     * // Count the number of Accounts
     * const count = await prisma.account.count({
     *   where: {
     *     // ... the filter for the Accounts we want to count
     *   }
     * })
     **/
    count<T extends AccountCountArgs>(
      args?: Subset<T, AccountCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<"select", any>
        ? T["select"] extends true
          ? number
          : GetScalarType<T["select"], AccountCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends AccountAggregateArgs>(
      args: Subset<T, AccountAggregateArgs>,
    ): Prisma.PrismaPromise<GetAccountAggregateType<T>>;

    /**
     * Group by Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends AccountGroupByArgs,
      HasSelectOrTake extends Or<Extends<"skip", Keys<T>>, Extends<"take", Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AccountGroupByArgs["orderBy"] }
        : { orderBy?: AccountGroupByArgs["orderBy"] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T["orderBy"]>>>,
      ByFields extends MaybeTupleToUnion<T["by"]>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T["having"]>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T["by"] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [Error, "Field ", P, ` in "having" needs to be provided in "by"`];
            }[HavingFields]
          : "take" extends Keys<T>
            ? "orderBy" extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : "skip" extends Keys<T>
              ? "orderBy" extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, AccountGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors ? GetAccountGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Account model
     */
    readonly fields: AccountFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Account.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AccountClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    user<T extends UserDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, UserDefaultArgs<ExtArgs>>,
    ): Prisma__UserClient<
      | $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the Account model
   */
  interface AccountFieldRefs {
    readonly id: FieldRef<"Account", "String">;
    readonly accountId: FieldRef<"Account", "String">;
    readonly providerId: FieldRef<"Account", "String">;
    readonly userId: FieldRef<"Account", "String">;
    readonly accessToken: FieldRef<"Account", "String">;
    readonly refreshToken: FieldRef<"Account", "String">;
    readonly idToken: FieldRef<"Account", "String">;
    readonly accessTokenExpiresAt: FieldRef<"Account", "DateTime">;
    readonly refreshTokenExpiresAt: FieldRef<"Account", "DateTime">;
    readonly scope: FieldRef<"Account", "String">;
    readonly password: FieldRef<"Account", "String">;
    readonly createdAt: FieldRef<"Account", "DateTime">;
    readonly updatedAt: FieldRef<"Account", "DateTime">;
  }

  // Custom InputTypes
  /**
   * Account findUnique
   */
  export type AccountFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null;
    /**
     * Filter, which Account to fetch.
     */
    where: AccountWhereUniqueInput;
  };

  /**
   * Account findUniqueOrThrow
   */
  export type AccountFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null;
    /**
     * Filter, which Account to fetch.
     */
    where: AccountWhereUniqueInput;
  };

  /**
   * Account findFirst
   */
  export type AccountFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null;
    /**
     * Filter, which Account to fetch.
     */
    where?: AccountWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Accounts.
     */
    cursor?: AccountWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Accounts.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[];
  };

  /**
   * Account findFirstOrThrow
   */
  export type AccountFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null;
    /**
     * Filter, which Account to fetch.
     */
    where?: AccountWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Accounts.
     */
    cursor?: AccountWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Accounts.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[];
  };

  /**
   * Account findMany
   */
  export type AccountFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null;
    /**
     * Filter, which Accounts to fetch.
     */
    where?: AccountWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Accounts.
     */
    cursor?: AccountWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Accounts.
     */
    skip?: number;
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[];
  };

  /**
   * Account create
   */
  export type AccountCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null;
    /**
     * The data needed to create a Account.
     */
    data: XOR<AccountCreateInput, AccountUncheckedCreateInput>;
  };

  /**
   * Account createMany
   */
  export type AccountCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many Accounts.
     */
    data: AccountCreateManyInput | AccountCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * Account createManyAndReturn
   */
  export type AccountCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null;
    /**
     * The data used to create many Accounts.
     */
    data: AccountCreateManyInput | AccountCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * Account update
   */
  export type AccountUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null;
    /**
     * The data needed to update a Account.
     */
    data: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>;
    /**
     * Choose, which Account to update.
     */
    where: AccountWhereUniqueInput;
  };

  /**
   * Account updateMany
   */
  export type AccountUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update Accounts.
     */
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyInput>;
    /**
     * Filter which Accounts to update
     */
    where?: AccountWhereInput;
    /**
     * Limit how many Accounts to update.
     */
    limit?: number;
  };

  /**
   * Account updateManyAndReturn
   */
  export type AccountUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null;
    /**
     * The data used to update Accounts.
     */
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyInput>;
    /**
     * Filter which Accounts to update
     */
    where?: AccountWhereInput;
    /**
     * Limit how many Accounts to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountIncludeUpdateManyAndReturn<ExtArgs> | null;
  };

  /**
   * Account upsert
   */
  export type AccountUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null;
    /**
     * The filter to search for the Account to update in case it exists.
     */
    where: AccountWhereUniqueInput;
    /**
     * In case the Account found by the `where` argument doesn't exist, create a new Account with this data.
     */
    create: XOR<AccountCreateInput, AccountUncheckedCreateInput>;
    /**
     * In case the Account was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>;
  };

  /**
   * Account delete
   */
  export type AccountDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null;
    /**
     * Filter which Account to delete.
     */
    where: AccountWhereUniqueInput;
  };

  /**
   * Account deleteMany
   */
  export type AccountDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Accounts to delete
     */
    where?: AccountWhereInput;
    /**
     * Limit how many Accounts to delete.
     */
    limit?: number;
  };

  /**
   * Account without action
   */
  export type AccountDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null;
  };

  /**
   * Model Verification
   */

  export type AggregateVerification = {
    _count: VerificationCountAggregateOutputType | null;
    _min: VerificationMinAggregateOutputType | null;
    _max: VerificationMaxAggregateOutputType | null;
  };

  export type VerificationMinAggregateOutputType = {
    id: string | null;
    identifier: string | null;
    value: string | null;
    expiresAt: Date | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type VerificationMaxAggregateOutputType = {
    id: string | null;
    identifier: string | null;
    value: string | null;
    expiresAt: Date | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type VerificationCountAggregateOutputType = {
    id: number;
    identifier: number;
    value: number;
    expiresAt: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
  };

  export type VerificationMinAggregateInputType = {
    id?: true;
    identifier?: true;
    value?: true;
    expiresAt?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type VerificationMaxAggregateInputType = {
    id?: true;
    identifier?: true;
    value?: true;
    expiresAt?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type VerificationCountAggregateInputType = {
    id?: true;
    identifier?: true;
    value?: true;
    expiresAt?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
  };

  export type VerificationAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Verification to aggregate.
     */
    where?: VerificationWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Verifications to fetch.
     */
    orderBy?: VerificationOrderByWithRelationInput | VerificationOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: VerificationWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Verifications from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Verifications.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Verifications
     **/
    _count?: true | VerificationCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: VerificationMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: VerificationMaxAggregateInputType;
  };

  export type GetVerificationAggregateType<T extends VerificationAggregateArgs> = {
    [P in keyof T & keyof AggregateVerification]: P extends "_count" | "count"
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVerification[P]>
      : GetScalarType<T[P], AggregateVerification[P]>;
  };

  export type VerificationGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: VerificationWhereInput;
    orderBy?: VerificationOrderByWithAggregationInput | VerificationOrderByWithAggregationInput[];
    by: VerificationScalarFieldEnum[] | VerificationScalarFieldEnum;
    having?: VerificationScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: VerificationCountAggregateInputType | true;
    _min?: VerificationMinAggregateInputType;
    _max?: VerificationMaxAggregateInputType;
  };

  export type VerificationGroupByOutputType = {
    id: string;
    identifier: string;
    value: string;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
    _count: VerificationCountAggregateOutputType | null;
    _min: VerificationMinAggregateOutputType | null;
    _max: VerificationMaxAggregateOutputType | null;
  };

  type GetVerificationGroupByPayload<T extends VerificationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VerificationGroupByOutputType, T["by"]> & {
        [P in keyof T & keyof VerificationGroupByOutputType]: P extends "_count"
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], VerificationGroupByOutputType[P]>
          : GetScalarType<T[P], VerificationGroupByOutputType[P]>;
      }
    >
  >;

  export type VerificationSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      identifier?: boolean;
      value?: boolean;
      expiresAt?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
    },
    ExtArgs["result"]["verification"]
  >;

  export type VerificationSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      identifier?: boolean;
      value?: boolean;
      expiresAt?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
    },
    ExtArgs["result"]["verification"]
  >;

  export type VerificationSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      identifier?: boolean;
      value?: boolean;
      expiresAt?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
    },
    ExtArgs["result"]["verification"]
  >;

  export type VerificationSelectScalar = {
    id?: boolean;
    identifier?: boolean;
    value?: boolean;
    expiresAt?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
  };

  export type VerificationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetOmit<
      "id" | "identifier" | "value" | "expiresAt" | "createdAt" | "updatedAt",
      ExtArgs["result"]["verification"]
    >;

  export type $VerificationPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: "Verification";
    objects: {};
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        identifier: string;
        value: string;
        expiresAt: Date;
        createdAt: Date;
        updatedAt: Date;
      },
      ExtArgs["result"]["verification"]
    >;
    composites: {};
  };

  type VerificationGetPayload<S extends boolean | null | undefined | VerificationDefaultArgs> =
    $Result.GetResult<Prisma.$VerificationPayload, S>;

  type VerificationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<VerificationFindManyArgs, "select" | "include" | "distinct" | "omit"> & {
      select?: VerificationCountAggregateInputType | true;
    };

  export interface VerificationDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>["model"]["Verification"];
      meta: { name: "Verification" };
    };
    /**
     * Find zero or one Verification that matches the filter.
     * @param {VerificationFindUniqueArgs} args - Arguments to find a Verification
     * @example
     * // Get one Verification
     * const verification = await prisma.verification.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VerificationFindUniqueArgs>(
      args: SelectSubset<T, VerificationFindUniqueArgs<ExtArgs>>,
    ): Prisma__VerificationClient<
      $Result.GetResult<
        Prisma.$VerificationPayload<ExtArgs>,
        T,
        "findUnique",
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one Verification that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {VerificationFindUniqueOrThrowArgs} args - Arguments to find a Verification
     * @example
     * // Get one Verification
     * const verification = await prisma.verification.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VerificationFindUniqueOrThrowArgs>(
      args: SelectSubset<T, VerificationFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__VerificationClient<
      $Result.GetResult<
        Prisma.$VerificationPayload<ExtArgs>,
        T,
        "findUniqueOrThrow",
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Verification that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationFindFirstArgs} args - Arguments to find a Verification
     * @example
     * // Get one Verification
     * const verification = await prisma.verification.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VerificationFindFirstArgs>(
      args?: SelectSubset<T, VerificationFindFirstArgs<ExtArgs>>,
    ): Prisma__VerificationClient<
      $Result.GetResult<
        Prisma.$VerificationPayload<ExtArgs>,
        T,
        "findFirst",
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Verification that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationFindFirstOrThrowArgs} args - Arguments to find a Verification
     * @example
     * // Get one Verification
     * const verification = await prisma.verification.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VerificationFindFirstOrThrowArgs>(
      args?: SelectSubset<T, VerificationFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__VerificationClient<
      $Result.GetResult<
        Prisma.$VerificationPayload<ExtArgs>,
        T,
        "findFirstOrThrow",
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more Verifications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Verifications
     * const verifications = await prisma.verification.findMany()
     *
     * // Get first 10 Verifications
     * const verifications = await prisma.verification.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const verificationWithIdOnly = await prisma.verification.findMany({ select: { id: true } })
     *
     */
    findMany<T extends VerificationFindManyArgs>(
      args?: SelectSubset<T, VerificationFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>
    >;

    /**
     * Create a Verification.
     * @param {VerificationCreateArgs} args - Arguments to create a Verification.
     * @example
     * // Create one Verification
     * const Verification = await prisma.verification.create({
     *   data: {
     *     // ... data to create a Verification
     *   }
     * })
     *
     */
    create<T extends VerificationCreateArgs>(
      args: SelectSubset<T, VerificationCreateArgs<ExtArgs>>,
    ): Prisma__VerificationClient<
      $Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "create", GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many Verifications.
     * @param {VerificationCreateManyArgs} args - Arguments to create many Verifications.
     * @example
     * // Create many Verifications
     * const verification = await prisma.verification.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends VerificationCreateManyArgs>(
      args?: SelectSubset<T, VerificationCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many Verifications and returns the data saved in the database.
     * @param {VerificationCreateManyAndReturnArgs} args - Arguments to create many Verifications.
     * @example
     * // Create many Verifications
     * const verification = await prisma.verification.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Verifications and only return the `id`
     * const verificationWithIdOnly = await prisma.verification.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends VerificationCreateManyAndReturnArgs>(
      args?: SelectSubset<T, VerificationCreateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$VerificationPayload<ExtArgs>,
        T,
        "createManyAndReturn",
        GlobalOmitOptions
      >
    >;

    /**
     * Delete a Verification.
     * @param {VerificationDeleteArgs} args - Arguments to delete one Verification.
     * @example
     * // Delete one Verification
     * const Verification = await prisma.verification.delete({
     *   where: {
     *     // ... filter to delete one Verification
     *   }
     * })
     *
     */
    delete<T extends VerificationDeleteArgs>(
      args: SelectSubset<T, VerificationDeleteArgs<ExtArgs>>,
    ): Prisma__VerificationClient<
      $Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one Verification.
     * @param {VerificationUpdateArgs} args - Arguments to update one Verification.
     * @example
     * // Update one Verification
     * const verification = await prisma.verification.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends VerificationUpdateArgs>(
      args: SelectSubset<T, VerificationUpdateArgs<ExtArgs>>,
    ): Prisma__VerificationClient<
      $Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "update", GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more Verifications.
     * @param {VerificationDeleteManyArgs} args - Arguments to filter Verifications to delete.
     * @example
     * // Delete a few Verifications
     * const { count } = await prisma.verification.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends VerificationDeleteManyArgs>(
      args?: SelectSubset<T, VerificationDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Verifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Verifications
     * const verification = await prisma.verification.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends VerificationUpdateManyArgs>(
      args: SelectSubset<T, VerificationUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Verifications and returns the data updated in the database.
     * @param {VerificationUpdateManyAndReturnArgs} args - Arguments to update many Verifications.
     * @example
     * // Update many Verifications
     * const verification = await prisma.verification.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Verifications and only return the `id`
     * const verificationWithIdOnly = await prisma.verification.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends VerificationUpdateManyAndReturnArgs>(
      args: SelectSubset<T, VerificationUpdateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$VerificationPayload<ExtArgs>,
        T,
        "updateManyAndReturn",
        GlobalOmitOptions
      >
    >;

    /**
     * Create or update one Verification.
     * @param {VerificationUpsertArgs} args - Arguments to update or create a Verification.
     * @example
     * // Update or create a Verification
     * const verification = await prisma.verification.upsert({
     *   create: {
     *     // ... data to create a Verification
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Verification we want to update
     *   }
     * })
     */
    upsert<T extends VerificationUpsertArgs>(
      args: SelectSubset<T, VerificationUpsertArgs<ExtArgs>>,
    ): Prisma__VerificationClient<
      $Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of Verifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationCountArgs} args - Arguments to filter Verifications to count.
     * @example
     * // Count the number of Verifications
     * const count = await prisma.verification.count({
     *   where: {
     *     // ... the filter for the Verifications we want to count
     *   }
     * })
     **/
    count<T extends VerificationCountArgs>(
      args?: Subset<T, VerificationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<"select", any>
        ? T["select"] extends true
          ? number
          : GetScalarType<T["select"], VerificationCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a Verification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends VerificationAggregateArgs>(
      args: Subset<T, VerificationAggregateArgs>,
    ): Prisma.PrismaPromise<GetVerificationAggregateType<T>>;

    /**
     * Group by Verification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends VerificationGroupByArgs,
      HasSelectOrTake extends Or<Extends<"skip", Keys<T>>, Extends<"take", Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VerificationGroupByArgs["orderBy"] }
        : { orderBy?: VerificationGroupByArgs["orderBy"] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T["orderBy"]>>>,
      ByFields extends MaybeTupleToUnion<T["by"]>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T["having"]>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T["by"] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [Error, "Field ", P, ` in "having" needs to be provided in "by"`];
            }[HavingFields]
          : "take" extends Keys<T>
            ? "orderBy" extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : "skip" extends Keys<T>
              ? "orderBy" extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, VerificationGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors
      ? GetVerificationGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Verification model
     */
    readonly fields: VerificationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Verification.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VerificationClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the Verification model
   */
  interface VerificationFieldRefs {
    readonly id: FieldRef<"Verification", "String">;
    readonly identifier: FieldRef<"Verification", "String">;
    readonly value: FieldRef<"Verification", "String">;
    readonly expiresAt: FieldRef<"Verification", "DateTime">;
    readonly createdAt: FieldRef<"Verification", "DateTime">;
    readonly updatedAt: FieldRef<"Verification", "DateTime">;
  }

  // Custom InputTypes
  /**
   * Verification findUnique
   */
  export type VerificationFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null;
    /**
     * Filter, which Verification to fetch.
     */
    where: VerificationWhereUniqueInput;
  };

  /**
   * Verification findUniqueOrThrow
   */
  export type VerificationFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null;
    /**
     * Filter, which Verification to fetch.
     */
    where: VerificationWhereUniqueInput;
  };

  /**
   * Verification findFirst
   */
  export type VerificationFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null;
    /**
     * Filter, which Verification to fetch.
     */
    where?: VerificationWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Verifications to fetch.
     */
    orderBy?: VerificationOrderByWithRelationInput | VerificationOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Verifications.
     */
    cursor?: VerificationWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Verifications from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Verifications.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Verifications.
     */
    distinct?: VerificationScalarFieldEnum | VerificationScalarFieldEnum[];
  };

  /**
   * Verification findFirstOrThrow
   */
  export type VerificationFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null;
    /**
     * Filter, which Verification to fetch.
     */
    where?: VerificationWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Verifications to fetch.
     */
    orderBy?: VerificationOrderByWithRelationInput | VerificationOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Verifications.
     */
    cursor?: VerificationWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Verifications from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Verifications.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Verifications.
     */
    distinct?: VerificationScalarFieldEnum | VerificationScalarFieldEnum[];
  };

  /**
   * Verification findMany
   */
  export type VerificationFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null;
    /**
     * Filter, which Verifications to fetch.
     */
    where?: VerificationWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Verifications to fetch.
     */
    orderBy?: VerificationOrderByWithRelationInput | VerificationOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Verifications.
     */
    cursor?: VerificationWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Verifications from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Verifications.
     */
    skip?: number;
    distinct?: VerificationScalarFieldEnum | VerificationScalarFieldEnum[];
  };

  /**
   * Verification create
   */
  export type VerificationCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null;
    /**
     * The data needed to create a Verification.
     */
    data: XOR<VerificationCreateInput, VerificationUncheckedCreateInput>;
  };

  /**
   * Verification createMany
   */
  export type VerificationCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many Verifications.
     */
    data: VerificationCreateManyInput | VerificationCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * Verification createManyAndReturn
   */
  export type VerificationCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null;
    /**
     * The data used to create many Verifications.
     */
    data: VerificationCreateManyInput | VerificationCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * Verification update
   */
  export type VerificationUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null;
    /**
     * The data needed to update a Verification.
     */
    data: XOR<VerificationUpdateInput, VerificationUncheckedUpdateInput>;
    /**
     * Choose, which Verification to update.
     */
    where: VerificationWhereUniqueInput;
  };

  /**
   * Verification updateMany
   */
  export type VerificationUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update Verifications.
     */
    data: XOR<VerificationUpdateManyMutationInput, VerificationUncheckedUpdateManyInput>;
    /**
     * Filter which Verifications to update
     */
    where?: VerificationWhereInput;
    /**
     * Limit how many Verifications to update.
     */
    limit?: number;
  };

  /**
   * Verification updateManyAndReturn
   */
  export type VerificationUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null;
    /**
     * The data used to update Verifications.
     */
    data: XOR<VerificationUpdateManyMutationInput, VerificationUncheckedUpdateManyInput>;
    /**
     * Filter which Verifications to update
     */
    where?: VerificationWhereInput;
    /**
     * Limit how many Verifications to update.
     */
    limit?: number;
  };

  /**
   * Verification upsert
   */
  export type VerificationUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null;
    /**
     * The filter to search for the Verification to update in case it exists.
     */
    where: VerificationWhereUniqueInput;
    /**
     * In case the Verification found by the `where` argument doesn't exist, create a new Verification with this data.
     */
    create: XOR<VerificationCreateInput, VerificationUncheckedCreateInput>;
    /**
     * In case the Verification was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VerificationUpdateInput, VerificationUncheckedUpdateInput>;
  };

  /**
   * Verification delete
   */
  export type VerificationDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null;
    /**
     * Filter which Verification to delete.
     */
    where: VerificationWhereUniqueInput;
  };

  /**
   * Verification deleteMany
   */
  export type VerificationDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Verifications to delete
     */
    where?: VerificationWhereInput;
    /**
     * Limit how many Verifications to delete.
     */
    limit?: number;
  };

  /**
   * Verification without action
   */
  export type VerificationDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null;
  };

  /**
   * Model Incident
   */

  export type AggregateIncident = {
    _count: IncidentCountAggregateOutputType | null;
    _min: IncidentMinAggregateOutputType | null;
    _max: IncidentMaxAggregateOutputType | null;
  };

  export type IncidentMinAggregateOutputType = {
    id: string | null;
    monitorId: string | null;
    status: $Enums.IncidentStatus | null;
    severity: $Enums.Severity | null;
    title: string | null;
    description: string | null;
    startedAt: Date | null;
    resolvedAt: Date | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type IncidentMaxAggregateOutputType = {
    id: string | null;
    monitorId: string | null;
    status: $Enums.IncidentStatus | null;
    severity: $Enums.Severity | null;
    title: string | null;
    description: string | null;
    startedAt: Date | null;
    resolvedAt: Date | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type IncidentCountAggregateOutputType = {
    id: number;
    monitorId: number;
    status: number;
    severity: number;
    title: number;
    description: number;
    startedAt: number;
    resolvedAt: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
  };

  export type IncidentMinAggregateInputType = {
    id?: true;
    monitorId?: true;
    status?: true;
    severity?: true;
    title?: true;
    description?: true;
    startedAt?: true;
    resolvedAt?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type IncidentMaxAggregateInputType = {
    id?: true;
    monitorId?: true;
    status?: true;
    severity?: true;
    title?: true;
    description?: true;
    startedAt?: true;
    resolvedAt?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type IncidentCountAggregateInputType = {
    id?: true;
    monitorId?: true;
    status?: true;
    severity?: true;
    title?: true;
    description?: true;
    startedAt?: true;
    resolvedAt?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
  };

  export type IncidentAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Incident to aggregate.
     */
    where?: IncidentWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Incidents to fetch.
     */
    orderBy?: IncidentOrderByWithRelationInput | IncidentOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: IncidentWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Incidents from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Incidents.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Incidents
     **/
    _count?: true | IncidentCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: IncidentMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: IncidentMaxAggregateInputType;
  };

  export type GetIncidentAggregateType<T extends IncidentAggregateArgs> = {
    [P in keyof T & keyof AggregateIncident]: P extends "_count" | "count"
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateIncident[P]>
      : GetScalarType<T[P], AggregateIncident[P]>;
  };

  export type IncidentGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: IncidentWhereInput;
    orderBy?: IncidentOrderByWithAggregationInput | IncidentOrderByWithAggregationInput[];
    by: IncidentScalarFieldEnum[] | IncidentScalarFieldEnum;
    having?: IncidentScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: IncidentCountAggregateInputType | true;
    _min?: IncidentMinAggregateInputType;
    _max?: IncidentMaxAggregateInputType;
  };

  export type IncidentGroupByOutputType = {
    id: string;
    monitorId: string;
    status: $Enums.IncidentStatus;
    severity: $Enums.Severity;
    title: string;
    description: string | null;
    startedAt: Date;
    resolvedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    _count: IncidentCountAggregateOutputType | null;
    _min: IncidentMinAggregateOutputType | null;
    _max: IncidentMaxAggregateOutputType | null;
  };

  type GetIncidentGroupByPayload<T extends IncidentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<IncidentGroupByOutputType, T["by"]> & {
        [P in keyof T & keyof IncidentGroupByOutputType]: P extends "_count"
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], IncidentGroupByOutputType[P]>
          : GetScalarType<T[P], IncidentGroupByOutputType[P]>;
      }
    >
  >;

  export type IncidentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetSelect<
      {
        id?: boolean;
        monitorId?: boolean;
        status?: boolean;
        severity?: boolean;
        title?: boolean;
        description?: boolean;
        startedAt?: boolean;
        resolvedAt?: boolean;
        createdAt?: boolean;
        updatedAt?: boolean;
        monitor?: boolean | MonitorDefaultArgs<ExtArgs>;
        events?: boolean | Incident$eventsArgs<ExtArgs>;
        _count?: boolean | IncidentCountOutputTypeDefaultArgs<ExtArgs>;
      },
      ExtArgs["result"]["incident"]
    >;

  export type IncidentSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      monitorId?: boolean;
      status?: boolean;
      severity?: boolean;
      title?: boolean;
      description?: boolean;
      startedAt?: boolean;
      resolvedAt?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      monitor?: boolean | MonitorDefaultArgs<ExtArgs>;
    },
    ExtArgs["result"]["incident"]
  >;

  export type IncidentSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      monitorId?: boolean;
      status?: boolean;
      severity?: boolean;
      title?: boolean;
      description?: boolean;
      startedAt?: boolean;
      resolvedAt?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      monitor?: boolean | MonitorDefaultArgs<ExtArgs>;
    },
    ExtArgs["result"]["incident"]
  >;

  export type IncidentSelectScalar = {
    id?: boolean;
    monitorId?: boolean;
    status?: boolean;
    severity?: boolean;
    title?: boolean;
    description?: boolean;
    startedAt?: boolean;
    resolvedAt?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
  };

  export type IncidentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetOmit<
      | "id"
      | "monitorId"
      | "status"
      | "severity"
      | "title"
      | "description"
      | "startedAt"
      | "resolvedAt"
      | "createdAt"
      | "updatedAt",
      ExtArgs["result"]["incident"]
    >;
  export type IncidentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      monitor?: boolean | MonitorDefaultArgs<ExtArgs>;
      events?: boolean | Incident$eventsArgs<ExtArgs>;
      _count?: boolean | IncidentCountOutputTypeDefaultArgs<ExtArgs>;
    };
  export type IncidentIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    monitor?: boolean | MonitorDefaultArgs<ExtArgs>;
  };
  export type IncidentIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    monitor?: boolean | MonitorDefaultArgs<ExtArgs>;
  };

  export type $IncidentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      name: "Incident";
      objects: {
        monitor: Prisma.$MonitorPayload<ExtArgs>;
        events: Prisma.$IncidentEventPayload<ExtArgs>[];
      };
      scalars: $Extensions.GetPayloadResult<
        {
          id: string;
          monitorId: string;
          status: $Enums.IncidentStatus;
          severity: $Enums.Severity;
          title: string;
          description: string | null;
          startedAt: Date;
          resolvedAt: Date | null;
          createdAt: Date;
          updatedAt: Date;
        },
        ExtArgs["result"]["incident"]
      >;
      composites: {};
    };

  type IncidentGetPayload<S extends boolean | null | undefined | IncidentDefaultArgs> =
    $Result.GetResult<Prisma.$IncidentPayload, S>;

  type IncidentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = Omit<
    IncidentFindManyArgs,
    "select" | "include" | "distinct" | "omit"
  > & {
    select?: IncidentCountAggregateInputType | true;
  };

  export interface IncidentDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>["model"]["Incident"];
      meta: { name: "Incident" };
    };
    /**
     * Find zero or one Incident that matches the filter.
     * @param {IncidentFindUniqueArgs} args - Arguments to find a Incident
     * @example
     * // Get one Incident
     * const incident = await prisma.incident.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends IncidentFindUniqueArgs>(
      args: SelectSubset<T, IncidentFindUniqueArgs<ExtArgs>>,
    ): Prisma__IncidentClient<
      $Result.GetResult<
        Prisma.$IncidentPayload<ExtArgs>,
        T,
        "findUnique",
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one Incident that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {IncidentFindUniqueOrThrowArgs} args - Arguments to find a Incident
     * @example
     * // Get one Incident
     * const incident = await prisma.incident.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends IncidentFindUniqueOrThrowArgs>(
      args: SelectSubset<T, IncidentFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__IncidentClient<
      $Result.GetResult<
        Prisma.$IncidentPayload<ExtArgs>,
        T,
        "findUniqueOrThrow",
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Incident that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IncidentFindFirstArgs} args - Arguments to find a Incident
     * @example
     * // Get one Incident
     * const incident = await prisma.incident.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends IncidentFindFirstArgs>(
      args?: SelectSubset<T, IncidentFindFirstArgs<ExtArgs>>,
    ): Prisma__IncidentClient<
      $Result.GetResult<Prisma.$IncidentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Incident that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IncidentFindFirstOrThrowArgs} args - Arguments to find a Incident
     * @example
     * // Get one Incident
     * const incident = await prisma.incident.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends IncidentFindFirstOrThrowArgs>(
      args?: SelectSubset<T, IncidentFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__IncidentClient<
      $Result.GetResult<Prisma.$IncidentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more Incidents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IncidentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Incidents
     * const incidents = await prisma.incident.findMany()
     *
     * // Get first 10 Incidents
     * const incidents = await prisma.incident.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const incidentWithIdOnly = await prisma.incident.findMany({ select: { id: true } })
     *
     */
    findMany<T extends IncidentFindManyArgs>(
      args?: SelectSubset<T, IncidentFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$IncidentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>
    >;

    /**
     * Create a Incident.
     * @param {IncidentCreateArgs} args - Arguments to create a Incident.
     * @example
     * // Create one Incident
     * const Incident = await prisma.incident.create({
     *   data: {
     *     // ... data to create a Incident
     *   }
     * })
     *
     */
    create<T extends IncidentCreateArgs>(
      args: SelectSubset<T, IncidentCreateArgs<ExtArgs>>,
    ): Prisma__IncidentClient<
      $Result.GetResult<Prisma.$IncidentPayload<ExtArgs>, T, "create", GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many Incidents.
     * @param {IncidentCreateManyArgs} args - Arguments to create many Incidents.
     * @example
     * // Create many Incidents
     * const incident = await prisma.incident.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends IncidentCreateManyArgs>(
      args?: SelectSubset<T, IncidentCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many Incidents and returns the data saved in the database.
     * @param {IncidentCreateManyAndReturnArgs} args - Arguments to create many Incidents.
     * @example
     * // Create many Incidents
     * const incident = await prisma.incident.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Incidents and only return the `id`
     * const incidentWithIdOnly = await prisma.incident.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends IncidentCreateManyAndReturnArgs>(
      args?: SelectSubset<T, IncidentCreateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$IncidentPayload<ExtArgs>,
        T,
        "createManyAndReturn",
        GlobalOmitOptions
      >
    >;

    /**
     * Delete a Incident.
     * @param {IncidentDeleteArgs} args - Arguments to delete one Incident.
     * @example
     * // Delete one Incident
     * const Incident = await prisma.incident.delete({
     *   where: {
     *     // ... filter to delete one Incident
     *   }
     * })
     *
     */
    delete<T extends IncidentDeleteArgs>(
      args: SelectSubset<T, IncidentDeleteArgs<ExtArgs>>,
    ): Prisma__IncidentClient<
      $Result.GetResult<Prisma.$IncidentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one Incident.
     * @param {IncidentUpdateArgs} args - Arguments to update one Incident.
     * @example
     * // Update one Incident
     * const incident = await prisma.incident.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends IncidentUpdateArgs>(
      args: SelectSubset<T, IncidentUpdateArgs<ExtArgs>>,
    ): Prisma__IncidentClient<
      $Result.GetResult<Prisma.$IncidentPayload<ExtArgs>, T, "update", GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more Incidents.
     * @param {IncidentDeleteManyArgs} args - Arguments to filter Incidents to delete.
     * @example
     * // Delete a few Incidents
     * const { count } = await prisma.incident.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends IncidentDeleteManyArgs>(
      args?: SelectSubset<T, IncidentDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Incidents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IncidentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Incidents
     * const incident = await prisma.incident.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends IncidentUpdateManyArgs>(
      args: SelectSubset<T, IncidentUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Incidents and returns the data updated in the database.
     * @param {IncidentUpdateManyAndReturnArgs} args - Arguments to update many Incidents.
     * @example
     * // Update many Incidents
     * const incident = await prisma.incident.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Incidents and only return the `id`
     * const incidentWithIdOnly = await prisma.incident.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends IncidentUpdateManyAndReturnArgs>(
      args: SelectSubset<T, IncidentUpdateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$IncidentPayload<ExtArgs>,
        T,
        "updateManyAndReturn",
        GlobalOmitOptions
      >
    >;

    /**
     * Create or update one Incident.
     * @param {IncidentUpsertArgs} args - Arguments to update or create a Incident.
     * @example
     * // Update or create a Incident
     * const incident = await prisma.incident.upsert({
     *   create: {
     *     // ... data to create a Incident
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Incident we want to update
     *   }
     * })
     */
    upsert<T extends IncidentUpsertArgs>(
      args: SelectSubset<T, IncidentUpsertArgs<ExtArgs>>,
    ): Prisma__IncidentClient<
      $Result.GetResult<Prisma.$IncidentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of Incidents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IncidentCountArgs} args - Arguments to filter Incidents to count.
     * @example
     * // Count the number of Incidents
     * const count = await prisma.incident.count({
     *   where: {
     *     // ... the filter for the Incidents we want to count
     *   }
     * })
     **/
    count<T extends IncidentCountArgs>(
      args?: Subset<T, IncidentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<"select", any>
        ? T["select"] extends true
          ? number
          : GetScalarType<T["select"], IncidentCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a Incident.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IncidentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends IncidentAggregateArgs>(
      args: Subset<T, IncidentAggregateArgs>,
    ): Prisma.PrismaPromise<GetIncidentAggregateType<T>>;

    /**
     * Group by Incident.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IncidentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends IncidentGroupByArgs,
      HasSelectOrTake extends Or<Extends<"skip", Keys<T>>, Extends<"take", Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: IncidentGroupByArgs["orderBy"] }
        : { orderBy?: IncidentGroupByArgs["orderBy"] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T["orderBy"]>>>,
      ByFields extends MaybeTupleToUnion<T["by"]>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T["having"]>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T["by"] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [Error, "Field ", P, ` in "having" needs to be provided in "by"`];
            }[HavingFields]
          : "take" extends Keys<T>
            ? "orderBy" extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : "skip" extends Keys<T>
              ? "orderBy" extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, IncidentGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors ? GetIncidentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Incident model
     */
    readonly fields: IncidentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Incident.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__IncidentClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    monitor<T extends MonitorDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, MonitorDefaultArgs<ExtArgs>>,
    ): Prisma__MonitorClient<
      | $Result.GetResult<
          Prisma.$MonitorPayload<ExtArgs>,
          T,
          "findUniqueOrThrow",
          GlobalOmitOptions
        >
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    events<T extends Incident$eventsArgs<ExtArgs> = {}>(
      args?: Subset<T, Incident$eventsArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      | $Result.GetResult<Prisma.$IncidentEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>
      | Null
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the Incident model
   */
  interface IncidentFieldRefs {
    readonly id: FieldRef<"Incident", "String">;
    readonly monitorId: FieldRef<"Incident", "String">;
    readonly status: FieldRef<"Incident", "IncidentStatus">;
    readonly severity: FieldRef<"Incident", "Severity">;
    readonly title: FieldRef<"Incident", "String">;
    readonly description: FieldRef<"Incident", "String">;
    readonly startedAt: FieldRef<"Incident", "DateTime">;
    readonly resolvedAt: FieldRef<"Incident", "DateTime">;
    readonly createdAt: FieldRef<"Incident", "DateTime">;
    readonly updatedAt: FieldRef<"Incident", "DateTime">;
  }

  // Custom InputTypes
  /**
   * Incident findUnique
   */
  export type IncidentFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Incident
     */
    select?: IncidentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Incident
     */
    omit?: IncidentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IncidentInclude<ExtArgs> | null;
    /**
     * Filter, which Incident to fetch.
     */
    where: IncidentWhereUniqueInput;
  };

  /**
   * Incident findUniqueOrThrow
   */
  export type IncidentFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Incident
     */
    select?: IncidentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Incident
     */
    omit?: IncidentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IncidentInclude<ExtArgs> | null;
    /**
     * Filter, which Incident to fetch.
     */
    where: IncidentWhereUniqueInput;
  };

  /**
   * Incident findFirst
   */
  export type IncidentFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Incident
     */
    select?: IncidentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Incident
     */
    omit?: IncidentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IncidentInclude<ExtArgs> | null;
    /**
     * Filter, which Incident to fetch.
     */
    where?: IncidentWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Incidents to fetch.
     */
    orderBy?: IncidentOrderByWithRelationInput | IncidentOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Incidents.
     */
    cursor?: IncidentWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Incidents from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Incidents.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Incidents.
     */
    distinct?: IncidentScalarFieldEnum | IncidentScalarFieldEnum[];
  };

  /**
   * Incident findFirstOrThrow
   */
  export type IncidentFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Incident
     */
    select?: IncidentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Incident
     */
    omit?: IncidentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IncidentInclude<ExtArgs> | null;
    /**
     * Filter, which Incident to fetch.
     */
    where?: IncidentWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Incidents to fetch.
     */
    orderBy?: IncidentOrderByWithRelationInput | IncidentOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Incidents.
     */
    cursor?: IncidentWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Incidents from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Incidents.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Incidents.
     */
    distinct?: IncidentScalarFieldEnum | IncidentScalarFieldEnum[];
  };

  /**
   * Incident findMany
   */
  export type IncidentFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Incident
     */
    select?: IncidentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Incident
     */
    omit?: IncidentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IncidentInclude<ExtArgs> | null;
    /**
     * Filter, which Incidents to fetch.
     */
    where?: IncidentWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Incidents to fetch.
     */
    orderBy?: IncidentOrderByWithRelationInput | IncidentOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Incidents.
     */
    cursor?: IncidentWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Incidents from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Incidents.
     */
    skip?: number;
    distinct?: IncidentScalarFieldEnum | IncidentScalarFieldEnum[];
  };

  /**
   * Incident create
   */
  export type IncidentCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Incident
     */
    select?: IncidentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Incident
     */
    omit?: IncidentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IncidentInclude<ExtArgs> | null;
    /**
     * The data needed to create a Incident.
     */
    data: XOR<IncidentCreateInput, IncidentUncheckedCreateInput>;
  };

  /**
   * Incident createMany
   */
  export type IncidentCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many Incidents.
     */
    data: IncidentCreateManyInput | IncidentCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * Incident createManyAndReturn
   */
  export type IncidentCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Incident
     */
    select?: IncidentSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Incident
     */
    omit?: IncidentOmit<ExtArgs> | null;
    /**
     * The data used to create many Incidents.
     */
    data: IncidentCreateManyInput | IncidentCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IncidentIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * Incident update
   */
  export type IncidentUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Incident
     */
    select?: IncidentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Incident
     */
    omit?: IncidentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IncidentInclude<ExtArgs> | null;
    /**
     * The data needed to update a Incident.
     */
    data: XOR<IncidentUpdateInput, IncidentUncheckedUpdateInput>;
    /**
     * Choose, which Incident to update.
     */
    where: IncidentWhereUniqueInput;
  };

  /**
   * Incident updateMany
   */
  export type IncidentUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update Incidents.
     */
    data: XOR<IncidentUpdateManyMutationInput, IncidentUncheckedUpdateManyInput>;
    /**
     * Filter which Incidents to update
     */
    where?: IncidentWhereInput;
    /**
     * Limit how many Incidents to update.
     */
    limit?: number;
  };

  /**
   * Incident updateManyAndReturn
   */
  export type IncidentUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Incident
     */
    select?: IncidentSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Incident
     */
    omit?: IncidentOmit<ExtArgs> | null;
    /**
     * The data used to update Incidents.
     */
    data: XOR<IncidentUpdateManyMutationInput, IncidentUncheckedUpdateManyInput>;
    /**
     * Filter which Incidents to update
     */
    where?: IncidentWhereInput;
    /**
     * Limit how many Incidents to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IncidentIncludeUpdateManyAndReturn<ExtArgs> | null;
  };

  /**
   * Incident upsert
   */
  export type IncidentUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Incident
     */
    select?: IncidentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Incident
     */
    omit?: IncidentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IncidentInclude<ExtArgs> | null;
    /**
     * The filter to search for the Incident to update in case it exists.
     */
    where: IncidentWhereUniqueInput;
    /**
     * In case the Incident found by the `where` argument doesn't exist, create a new Incident with this data.
     */
    create: XOR<IncidentCreateInput, IncidentUncheckedCreateInput>;
    /**
     * In case the Incident was found with the provided `where` argument, update it with this data.
     */
    update: XOR<IncidentUpdateInput, IncidentUncheckedUpdateInput>;
  };

  /**
   * Incident delete
   */
  export type IncidentDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Incident
     */
    select?: IncidentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Incident
     */
    omit?: IncidentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IncidentInclude<ExtArgs> | null;
    /**
     * Filter which Incident to delete.
     */
    where: IncidentWhereUniqueInput;
  };

  /**
   * Incident deleteMany
   */
  export type IncidentDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Incidents to delete
     */
    where?: IncidentWhereInput;
    /**
     * Limit how many Incidents to delete.
     */
    limit?: number;
  };

  /**
   * Incident.events
   */
  export type Incident$eventsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the IncidentEvent
     */
    select?: IncidentEventSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the IncidentEvent
     */
    omit?: IncidentEventOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IncidentEventInclude<ExtArgs> | null;
    where?: IncidentEventWhereInput;
    orderBy?: IncidentEventOrderByWithRelationInput | IncidentEventOrderByWithRelationInput[];
    cursor?: IncidentEventWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: IncidentEventScalarFieldEnum | IncidentEventScalarFieldEnum[];
  };

  /**
   * Incident without action
   */
  export type IncidentDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Incident
     */
    select?: IncidentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Incident
     */
    omit?: IncidentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IncidentInclude<ExtArgs> | null;
  };

  /**
   * Model IncidentEvent
   */

  export type AggregateIncidentEvent = {
    _count: IncidentEventCountAggregateOutputType | null;
    _min: IncidentEventMinAggregateOutputType | null;
    _max: IncidentEventMaxAggregateOutputType | null;
  };

  export type IncidentEventMinAggregateOutputType = {
    id: string | null;
    incidentId: string | null;
    type: $Enums.IncidentEventType | null;
    message: string | null;
    createdAt: Date | null;
  };

  export type IncidentEventMaxAggregateOutputType = {
    id: string | null;
    incidentId: string | null;
    type: $Enums.IncidentEventType | null;
    message: string | null;
    createdAt: Date | null;
  };

  export type IncidentEventCountAggregateOutputType = {
    id: number;
    incidentId: number;
    type: number;
    message: number;
    createdAt: number;
    _all: number;
  };

  export type IncidentEventMinAggregateInputType = {
    id?: true;
    incidentId?: true;
    type?: true;
    message?: true;
    createdAt?: true;
  };

  export type IncidentEventMaxAggregateInputType = {
    id?: true;
    incidentId?: true;
    type?: true;
    message?: true;
    createdAt?: true;
  };

  export type IncidentEventCountAggregateInputType = {
    id?: true;
    incidentId?: true;
    type?: true;
    message?: true;
    createdAt?: true;
    _all?: true;
  };

  export type IncidentEventAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which IncidentEvent to aggregate.
     */
    where?: IncidentEventWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of IncidentEvents to fetch.
     */
    orderBy?: IncidentEventOrderByWithRelationInput | IncidentEventOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: IncidentEventWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` IncidentEvents from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` IncidentEvents.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned IncidentEvents
     **/
    _count?: true | IncidentEventCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: IncidentEventMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: IncidentEventMaxAggregateInputType;
  };

  export type GetIncidentEventAggregateType<T extends IncidentEventAggregateArgs> = {
    [P in keyof T & keyof AggregateIncidentEvent]: P extends "_count" | "count"
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateIncidentEvent[P]>
      : GetScalarType<T[P], AggregateIncidentEvent[P]>;
  };

  export type IncidentEventGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: IncidentEventWhereInput;
    orderBy?: IncidentEventOrderByWithAggregationInput | IncidentEventOrderByWithAggregationInput[];
    by: IncidentEventScalarFieldEnum[] | IncidentEventScalarFieldEnum;
    having?: IncidentEventScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: IncidentEventCountAggregateInputType | true;
    _min?: IncidentEventMinAggregateInputType;
    _max?: IncidentEventMaxAggregateInputType;
  };

  export type IncidentEventGroupByOutputType = {
    id: string;
    incidentId: string;
    type: $Enums.IncidentEventType;
    message: string;
    createdAt: Date;
    _count: IncidentEventCountAggregateOutputType | null;
    _min: IncidentEventMinAggregateOutputType | null;
    _max: IncidentEventMaxAggregateOutputType | null;
  };

  type GetIncidentEventGroupByPayload<T extends IncidentEventGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<IncidentEventGroupByOutputType, T["by"]> & {
        [P in keyof T & keyof IncidentEventGroupByOutputType]: P extends "_count"
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], IncidentEventGroupByOutputType[P]>
          : GetScalarType<T[P], IncidentEventGroupByOutputType[P]>;
      }
    >
  >;

  export type IncidentEventSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      incidentId?: boolean;
      type?: boolean;
      message?: boolean;
      createdAt?: boolean;
      incident?: boolean | IncidentDefaultArgs<ExtArgs>;
    },
    ExtArgs["result"]["incidentEvent"]
  >;

  export type IncidentEventSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      incidentId?: boolean;
      type?: boolean;
      message?: boolean;
      createdAt?: boolean;
      incident?: boolean | IncidentDefaultArgs<ExtArgs>;
    },
    ExtArgs["result"]["incidentEvent"]
  >;

  export type IncidentEventSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      incidentId?: boolean;
      type?: boolean;
      message?: boolean;
      createdAt?: boolean;
      incident?: boolean | IncidentDefaultArgs<ExtArgs>;
    },
    ExtArgs["result"]["incidentEvent"]
  >;

  export type IncidentEventSelectScalar = {
    id?: boolean;
    incidentId?: boolean;
    type?: boolean;
    message?: boolean;
    createdAt?: boolean;
  };

  export type IncidentEventOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetOmit<
    "id" | "incidentId" | "type" | "message" | "createdAt",
    ExtArgs["result"]["incidentEvent"]
  >;
  export type IncidentEventInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    incident?: boolean | IncidentDefaultArgs<ExtArgs>;
  };
  export type IncidentEventIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    incident?: boolean | IncidentDefaultArgs<ExtArgs>;
  };
  export type IncidentEventIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    incident?: boolean | IncidentDefaultArgs<ExtArgs>;
  };

  export type $IncidentEventPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: "IncidentEvent";
    objects: {
      incident: Prisma.$IncidentPayload<ExtArgs>;
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        incidentId: string;
        type: $Enums.IncidentEventType;
        message: string;
        createdAt: Date;
      },
      ExtArgs["result"]["incidentEvent"]
    >;
    composites: {};
  };

  type IncidentEventGetPayload<S extends boolean | null | undefined | IncidentEventDefaultArgs> =
    $Result.GetResult<Prisma.$IncidentEventPayload, S>;

  type IncidentEventCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<IncidentEventFindManyArgs, "select" | "include" | "distinct" | "omit"> & {
      select?: IncidentEventCountAggregateInputType | true;
    };

  export interface IncidentEventDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>["model"]["IncidentEvent"];
      meta: { name: "IncidentEvent" };
    };
    /**
     * Find zero or one IncidentEvent that matches the filter.
     * @param {IncidentEventFindUniqueArgs} args - Arguments to find a IncidentEvent
     * @example
     * // Get one IncidentEvent
     * const incidentEvent = await prisma.incidentEvent.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends IncidentEventFindUniqueArgs>(
      args: SelectSubset<T, IncidentEventFindUniqueArgs<ExtArgs>>,
    ): Prisma__IncidentEventClient<
      $Result.GetResult<
        Prisma.$IncidentEventPayload<ExtArgs>,
        T,
        "findUnique",
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one IncidentEvent that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {IncidentEventFindUniqueOrThrowArgs} args - Arguments to find a IncidentEvent
     * @example
     * // Get one IncidentEvent
     * const incidentEvent = await prisma.incidentEvent.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends IncidentEventFindUniqueOrThrowArgs>(
      args: SelectSubset<T, IncidentEventFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__IncidentEventClient<
      $Result.GetResult<
        Prisma.$IncidentEventPayload<ExtArgs>,
        T,
        "findUniqueOrThrow",
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first IncidentEvent that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IncidentEventFindFirstArgs} args - Arguments to find a IncidentEvent
     * @example
     * // Get one IncidentEvent
     * const incidentEvent = await prisma.incidentEvent.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends IncidentEventFindFirstArgs>(
      args?: SelectSubset<T, IncidentEventFindFirstArgs<ExtArgs>>,
    ): Prisma__IncidentEventClient<
      $Result.GetResult<
        Prisma.$IncidentEventPayload<ExtArgs>,
        T,
        "findFirst",
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first IncidentEvent that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IncidentEventFindFirstOrThrowArgs} args - Arguments to find a IncidentEvent
     * @example
     * // Get one IncidentEvent
     * const incidentEvent = await prisma.incidentEvent.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends IncidentEventFindFirstOrThrowArgs>(
      args?: SelectSubset<T, IncidentEventFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__IncidentEventClient<
      $Result.GetResult<
        Prisma.$IncidentEventPayload<ExtArgs>,
        T,
        "findFirstOrThrow",
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more IncidentEvents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IncidentEventFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all IncidentEvents
     * const incidentEvents = await prisma.incidentEvent.findMany()
     *
     * // Get first 10 IncidentEvents
     * const incidentEvents = await prisma.incidentEvent.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const incidentEventWithIdOnly = await prisma.incidentEvent.findMany({ select: { id: true } })
     *
     */
    findMany<T extends IncidentEventFindManyArgs>(
      args?: SelectSubset<T, IncidentEventFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$IncidentEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>
    >;

    /**
     * Create a IncidentEvent.
     * @param {IncidentEventCreateArgs} args - Arguments to create a IncidentEvent.
     * @example
     * // Create one IncidentEvent
     * const IncidentEvent = await prisma.incidentEvent.create({
     *   data: {
     *     // ... data to create a IncidentEvent
     *   }
     * })
     *
     */
    create<T extends IncidentEventCreateArgs>(
      args: SelectSubset<T, IncidentEventCreateArgs<ExtArgs>>,
    ): Prisma__IncidentEventClient<
      $Result.GetResult<Prisma.$IncidentEventPayload<ExtArgs>, T, "create", GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many IncidentEvents.
     * @param {IncidentEventCreateManyArgs} args - Arguments to create many IncidentEvents.
     * @example
     * // Create many IncidentEvents
     * const incidentEvent = await prisma.incidentEvent.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends IncidentEventCreateManyArgs>(
      args?: SelectSubset<T, IncidentEventCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many IncidentEvents and returns the data saved in the database.
     * @param {IncidentEventCreateManyAndReturnArgs} args - Arguments to create many IncidentEvents.
     * @example
     * // Create many IncidentEvents
     * const incidentEvent = await prisma.incidentEvent.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many IncidentEvents and only return the `id`
     * const incidentEventWithIdOnly = await prisma.incidentEvent.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends IncidentEventCreateManyAndReturnArgs>(
      args?: SelectSubset<T, IncidentEventCreateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$IncidentEventPayload<ExtArgs>,
        T,
        "createManyAndReturn",
        GlobalOmitOptions
      >
    >;

    /**
     * Delete a IncidentEvent.
     * @param {IncidentEventDeleteArgs} args - Arguments to delete one IncidentEvent.
     * @example
     * // Delete one IncidentEvent
     * const IncidentEvent = await prisma.incidentEvent.delete({
     *   where: {
     *     // ... filter to delete one IncidentEvent
     *   }
     * })
     *
     */
    delete<T extends IncidentEventDeleteArgs>(
      args: SelectSubset<T, IncidentEventDeleteArgs<ExtArgs>>,
    ): Prisma__IncidentEventClient<
      $Result.GetResult<Prisma.$IncidentEventPayload<ExtArgs>, T, "delete", GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one IncidentEvent.
     * @param {IncidentEventUpdateArgs} args - Arguments to update one IncidentEvent.
     * @example
     * // Update one IncidentEvent
     * const incidentEvent = await prisma.incidentEvent.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends IncidentEventUpdateArgs>(
      args: SelectSubset<T, IncidentEventUpdateArgs<ExtArgs>>,
    ): Prisma__IncidentEventClient<
      $Result.GetResult<Prisma.$IncidentEventPayload<ExtArgs>, T, "update", GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more IncidentEvents.
     * @param {IncidentEventDeleteManyArgs} args - Arguments to filter IncidentEvents to delete.
     * @example
     * // Delete a few IncidentEvents
     * const { count } = await prisma.incidentEvent.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends IncidentEventDeleteManyArgs>(
      args?: SelectSubset<T, IncidentEventDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more IncidentEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IncidentEventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many IncidentEvents
     * const incidentEvent = await prisma.incidentEvent.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends IncidentEventUpdateManyArgs>(
      args: SelectSubset<T, IncidentEventUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more IncidentEvents and returns the data updated in the database.
     * @param {IncidentEventUpdateManyAndReturnArgs} args - Arguments to update many IncidentEvents.
     * @example
     * // Update many IncidentEvents
     * const incidentEvent = await prisma.incidentEvent.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more IncidentEvents and only return the `id`
     * const incidentEventWithIdOnly = await prisma.incidentEvent.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends IncidentEventUpdateManyAndReturnArgs>(
      args: SelectSubset<T, IncidentEventUpdateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$IncidentEventPayload<ExtArgs>,
        T,
        "updateManyAndReturn",
        GlobalOmitOptions
      >
    >;

    /**
     * Create or update one IncidentEvent.
     * @param {IncidentEventUpsertArgs} args - Arguments to update or create a IncidentEvent.
     * @example
     * // Update or create a IncidentEvent
     * const incidentEvent = await prisma.incidentEvent.upsert({
     *   create: {
     *     // ... data to create a IncidentEvent
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the IncidentEvent we want to update
     *   }
     * })
     */
    upsert<T extends IncidentEventUpsertArgs>(
      args: SelectSubset<T, IncidentEventUpsertArgs<ExtArgs>>,
    ): Prisma__IncidentEventClient<
      $Result.GetResult<Prisma.$IncidentEventPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of IncidentEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IncidentEventCountArgs} args - Arguments to filter IncidentEvents to count.
     * @example
     * // Count the number of IncidentEvents
     * const count = await prisma.incidentEvent.count({
     *   where: {
     *     // ... the filter for the IncidentEvents we want to count
     *   }
     * })
     **/
    count<T extends IncidentEventCountArgs>(
      args?: Subset<T, IncidentEventCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<"select", any>
        ? T["select"] extends true
          ? number
          : GetScalarType<T["select"], IncidentEventCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a IncidentEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IncidentEventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends IncidentEventAggregateArgs>(
      args: Subset<T, IncidentEventAggregateArgs>,
    ): Prisma.PrismaPromise<GetIncidentEventAggregateType<T>>;

    /**
     * Group by IncidentEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IncidentEventGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends IncidentEventGroupByArgs,
      HasSelectOrTake extends Or<Extends<"skip", Keys<T>>, Extends<"take", Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: IncidentEventGroupByArgs["orderBy"] }
        : { orderBy?: IncidentEventGroupByArgs["orderBy"] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T["orderBy"]>>>,
      ByFields extends MaybeTupleToUnion<T["by"]>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T["having"]>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T["by"] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [Error, "Field ", P, ` in "having" needs to be provided in "by"`];
            }[HavingFields]
          : "take" extends Keys<T>
            ? "orderBy" extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : "skip" extends Keys<T>
              ? "orderBy" extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, IncidentEventGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors
      ? GetIncidentEventGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the IncidentEvent model
     */
    readonly fields: IncidentEventFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for IncidentEvent.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__IncidentEventClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    incident<T extends IncidentDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, IncidentDefaultArgs<ExtArgs>>,
    ): Prisma__IncidentClient<
      | $Result.GetResult<
          Prisma.$IncidentPayload<ExtArgs>,
          T,
          "findUniqueOrThrow",
          GlobalOmitOptions
        >
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the IncidentEvent model
   */
  interface IncidentEventFieldRefs {
    readonly id: FieldRef<"IncidentEvent", "String">;
    readonly incidentId: FieldRef<"IncidentEvent", "String">;
    readonly type: FieldRef<"IncidentEvent", "IncidentEventType">;
    readonly message: FieldRef<"IncidentEvent", "String">;
    readonly createdAt: FieldRef<"IncidentEvent", "DateTime">;
  }

  // Custom InputTypes
  /**
   * IncidentEvent findUnique
   */
  export type IncidentEventFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the IncidentEvent
     */
    select?: IncidentEventSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the IncidentEvent
     */
    omit?: IncidentEventOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IncidentEventInclude<ExtArgs> | null;
    /**
     * Filter, which IncidentEvent to fetch.
     */
    where: IncidentEventWhereUniqueInput;
  };

  /**
   * IncidentEvent findUniqueOrThrow
   */
  export type IncidentEventFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the IncidentEvent
     */
    select?: IncidentEventSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the IncidentEvent
     */
    omit?: IncidentEventOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IncidentEventInclude<ExtArgs> | null;
    /**
     * Filter, which IncidentEvent to fetch.
     */
    where: IncidentEventWhereUniqueInput;
  };

  /**
   * IncidentEvent findFirst
   */
  export type IncidentEventFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the IncidentEvent
     */
    select?: IncidentEventSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the IncidentEvent
     */
    omit?: IncidentEventOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IncidentEventInclude<ExtArgs> | null;
    /**
     * Filter, which IncidentEvent to fetch.
     */
    where?: IncidentEventWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of IncidentEvents to fetch.
     */
    orderBy?: IncidentEventOrderByWithRelationInput | IncidentEventOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for IncidentEvents.
     */
    cursor?: IncidentEventWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` IncidentEvents from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` IncidentEvents.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of IncidentEvents.
     */
    distinct?: IncidentEventScalarFieldEnum | IncidentEventScalarFieldEnum[];
  };

  /**
   * IncidentEvent findFirstOrThrow
   */
  export type IncidentEventFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the IncidentEvent
     */
    select?: IncidentEventSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the IncidentEvent
     */
    omit?: IncidentEventOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IncidentEventInclude<ExtArgs> | null;
    /**
     * Filter, which IncidentEvent to fetch.
     */
    where?: IncidentEventWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of IncidentEvents to fetch.
     */
    orderBy?: IncidentEventOrderByWithRelationInput | IncidentEventOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for IncidentEvents.
     */
    cursor?: IncidentEventWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` IncidentEvents from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` IncidentEvents.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of IncidentEvents.
     */
    distinct?: IncidentEventScalarFieldEnum | IncidentEventScalarFieldEnum[];
  };

  /**
   * IncidentEvent findMany
   */
  export type IncidentEventFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the IncidentEvent
     */
    select?: IncidentEventSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the IncidentEvent
     */
    omit?: IncidentEventOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IncidentEventInclude<ExtArgs> | null;
    /**
     * Filter, which IncidentEvents to fetch.
     */
    where?: IncidentEventWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of IncidentEvents to fetch.
     */
    orderBy?: IncidentEventOrderByWithRelationInput | IncidentEventOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing IncidentEvents.
     */
    cursor?: IncidentEventWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` IncidentEvents from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` IncidentEvents.
     */
    skip?: number;
    distinct?: IncidentEventScalarFieldEnum | IncidentEventScalarFieldEnum[];
  };

  /**
   * IncidentEvent create
   */
  export type IncidentEventCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the IncidentEvent
     */
    select?: IncidentEventSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the IncidentEvent
     */
    omit?: IncidentEventOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IncidentEventInclude<ExtArgs> | null;
    /**
     * The data needed to create a IncidentEvent.
     */
    data: XOR<IncidentEventCreateInput, IncidentEventUncheckedCreateInput>;
  };

  /**
   * IncidentEvent createMany
   */
  export type IncidentEventCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many IncidentEvents.
     */
    data: IncidentEventCreateManyInput | IncidentEventCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * IncidentEvent createManyAndReturn
   */
  export type IncidentEventCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the IncidentEvent
     */
    select?: IncidentEventSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the IncidentEvent
     */
    omit?: IncidentEventOmit<ExtArgs> | null;
    /**
     * The data used to create many IncidentEvents.
     */
    data: IncidentEventCreateManyInput | IncidentEventCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IncidentEventIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * IncidentEvent update
   */
  export type IncidentEventUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the IncidentEvent
     */
    select?: IncidentEventSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the IncidentEvent
     */
    omit?: IncidentEventOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IncidentEventInclude<ExtArgs> | null;
    /**
     * The data needed to update a IncidentEvent.
     */
    data: XOR<IncidentEventUpdateInput, IncidentEventUncheckedUpdateInput>;
    /**
     * Choose, which IncidentEvent to update.
     */
    where: IncidentEventWhereUniqueInput;
  };

  /**
   * IncidentEvent updateMany
   */
  export type IncidentEventUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update IncidentEvents.
     */
    data: XOR<IncidentEventUpdateManyMutationInput, IncidentEventUncheckedUpdateManyInput>;
    /**
     * Filter which IncidentEvents to update
     */
    where?: IncidentEventWhereInput;
    /**
     * Limit how many IncidentEvents to update.
     */
    limit?: number;
  };

  /**
   * IncidentEvent updateManyAndReturn
   */
  export type IncidentEventUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the IncidentEvent
     */
    select?: IncidentEventSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the IncidentEvent
     */
    omit?: IncidentEventOmit<ExtArgs> | null;
    /**
     * The data used to update IncidentEvents.
     */
    data: XOR<IncidentEventUpdateManyMutationInput, IncidentEventUncheckedUpdateManyInput>;
    /**
     * Filter which IncidentEvents to update
     */
    where?: IncidentEventWhereInput;
    /**
     * Limit how many IncidentEvents to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IncidentEventIncludeUpdateManyAndReturn<ExtArgs> | null;
  };

  /**
   * IncidentEvent upsert
   */
  export type IncidentEventUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the IncidentEvent
     */
    select?: IncidentEventSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the IncidentEvent
     */
    omit?: IncidentEventOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IncidentEventInclude<ExtArgs> | null;
    /**
     * The filter to search for the IncidentEvent to update in case it exists.
     */
    where: IncidentEventWhereUniqueInput;
    /**
     * In case the IncidentEvent found by the `where` argument doesn't exist, create a new IncidentEvent with this data.
     */
    create: XOR<IncidentEventCreateInput, IncidentEventUncheckedCreateInput>;
    /**
     * In case the IncidentEvent was found with the provided `where` argument, update it with this data.
     */
    update: XOR<IncidentEventUpdateInput, IncidentEventUncheckedUpdateInput>;
  };

  /**
   * IncidentEvent delete
   */
  export type IncidentEventDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the IncidentEvent
     */
    select?: IncidentEventSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the IncidentEvent
     */
    omit?: IncidentEventOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IncidentEventInclude<ExtArgs> | null;
    /**
     * Filter which IncidentEvent to delete.
     */
    where: IncidentEventWhereUniqueInput;
  };

  /**
   * IncidentEvent deleteMany
   */
  export type IncidentEventDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which IncidentEvents to delete
     */
    where?: IncidentEventWhereInput;
    /**
     * Limit how many IncidentEvents to delete.
     */
    limit?: number;
  };

  /**
   * IncidentEvent without action
   */
  export type IncidentEventDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the IncidentEvent
     */
    select?: IncidentEventSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the IncidentEvent
     */
    omit?: IncidentEventOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IncidentEventInclude<ExtArgs> | null;
  };

  /**
   * Model RegionalIncident
   */

  export type AggregateRegionalIncident = {
    _count: RegionalIncidentCountAggregateOutputType | null;
    _min: RegionalIncidentMinAggregateOutputType | null;
    _max: RegionalIncidentMaxAggregateOutputType | null;
  };

  export type RegionalIncidentMinAggregateOutputType = {
    id: string | null;
    monitorId: string | null;
    region: string | null;
    status: $Enums.IncidentStatus | null;
    startedAt: Date | null;
    resolvedAt: Date | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type RegionalIncidentMaxAggregateOutputType = {
    id: string | null;
    monitorId: string | null;
    region: string | null;
    status: $Enums.IncidentStatus | null;
    startedAt: Date | null;
    resolvedAt: Date | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type RegionalIncidentCountAggregateOutputType = {
    id: number;
    monitorId: number;
    region: number;
    status: number;
    startedAt: number;
    resolvedAt: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
  };

  export type RegionalIncidentMinAggregateInputType = {
    id?: true;
    monitorId?: true;
    region?: true;
    status?: true;
    startedAt?: true;
    resolvedAt?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type RegionalIncidentMaxAggregateInputType = {
    id?: true;
    monitorId?: true;
    region?: true;
    status?: true;
    startedAt?: true;
    resolvedAt?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type RegionalIncidentCountAggregateInputType = {
    id?: true;
    monitorId?: true;
    region?: true;
    status?: true;
    startedAt?: true;
    resolvedAt?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
  };

  export type RegionalIncidentAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which RegionalIncident to aggregate.
     */
    where?: RegionalIncidentWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of RegionalIncidents to fetch.
     */
    orderBy?: RegionalIncidentOrderByWithRelationInput | RegionalIncidentOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: RegionalIncidentWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` RegionalIncidents from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` RegionalIncidents.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned RegionalIncidents
     **/
    _count?: true | RegionalIncidentCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: RegionalIncidentMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: RegionalIncidentMaxAggregateInputType;
  };

  export type GetRegionalIncidentAggregateType<T extends RegionalIncidentAggregateArgs> = {
    [P in keyof T & keyof AggregateRegionalIncident]: P extends "_count" | "count"
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRegionalIncident[P]>
      : GetScalarType<T[P], AggregateRegionalIncident[P]>;
  };

  export type RegionalIncidentGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: RegionalIncidentWhereInput;
    orderBy?:
      | RegionalIncidentOrderByWithAggregationInput
      | RegionalIncidentOrderByWithAggregationInput[];
    by: RegionalIncidentScalarFieldEnum[] | RegionalIncidentScalarFieldEnum;
    having?: RegionalIncidentScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: RegionalIncidentCountAggregateInputType | true;
    _min?: RegionalIncidentMinAggregateInputType;
    _max?: RegionalIncidentMaxAggregateInputType;
  };

  export type RegionalIncidentGroupByOutputType = {
    id: string;
    monitorId: string;
    region: string;
    status: $Enums.IncidentStatus;
    startedAt: Date;
    resolvedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    _count: RegionalIncidentCountAggregateOutputType | null;
    _min: RegionalIncidentMinAggregateOutputType | null;
    _max: RegionalIncidentMaxAggregateOutputType | null;
  };

  type GetRegionalIncidentGroupByPayload<T extends RegionalIncidentGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<RegionalIncidentGroupByOutputType, T["by"]> & {
          [P in keyof T & keyof RegionalIncidentGroupByOutputType]: P extends "_count"
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RegionalIncidentGroupByOutputType[P]>
            : GetScalarType<T[P], RegionalIncidentGroupByOutputType[P]>;
        }
      >
    >;

  export type RegionalIncidentSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      monitorId?: boolean;
      region?: boolean;
      status?: boolean;
      startedAt?: boolean;
      resolvedAt?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      monitor?: boolean | MonitorDefaultArgs<ExtArgs>;
    },
    ExtArgs["result"]["regionalIncident"]
  >;

  export type RegionalIncidentSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      monitorId?: boolean;
      region?: boolean;
      status?: boolean;
      startedAt?: boolean;
      resolvedAt?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      monitor?: boolean | MonitorDefaultArgs<ExtArgs>;
    },
    ExtArgs["result"]["regionalIncident"]
  >;

  export type RegionalIncidentSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      monitorId?: boolean;
      region?: boolean;
      status?: boolean;
      startedAt?: boolean;
      resolvedAt?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      monitor?: boolean | MonitorDefaultArgs<ExtArgs>;
    },
    ExtArgs["result"]["regionalIncident"]
  >;

  export type RegionalIncidentSelectScalar = {
    id?: boolean;
    monitorId?: boolean;
    region?: boolean;
    status?: boolean;
    startedAt?: boolean;
    resolvedAt?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
  };

  export type RegionalIncidentOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetOmit<
    | "id"
    | "monitorId"
    | "region"
    | "status"
    | "startedAt"
    | "resolvedAt"
    | "createdAt"
    | "updatedAt",
    ExtArgs["result"]["regionalIncident"]
  >;
  export type RegionalIncidentInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    monitor?: boolean | MonitorDefaultArgs<ExtArgs>;
  };
  export type RegionalIncidentIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    monitor?: boolean | MonitorDefaultArgs<ExtArgs>;
  };
  export type RegionalIncidentIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    monitor?: boolean | MonitorDefaultArgs<ExtArgs>;
  };

  export type $RegionalIncidentPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: "RegionalIncident";
    objects: {
      monitor: Prisma.$MonitorPayload<ExtArgs>;
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        monitorId: string;
        region: string;
        status: $Enums.IncidentStatus;
        startedAt: Date;
        resolvedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
      },
      ExtArgs["result"]["regionalIncident"]
    >;
    composites: {};
  };

  type RegionalIncidentGetPayload<
    S extends boolean | null | undefined | RegionalIncidentDefaultArgs,
  > = $Result.GetResult<Prisma.$RegionalIncidentPayload, S>;

  type RegionalIncidentCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<RegionalIncidentFindManyArgs, "select" | "include" | "distinct" | "omit"> & {
    select?: RegionalIncidentCountAggregateInputType | true;
  };

  export interface RegionalIncidentDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>["model"]["RegionalIncident"];
      meta: { name: "RegionalIncident" };
    };
    /**
     * Find zero or one RegionalIncident that matches the filter.
     * @param {RegionalIncidentFindUniqueArgs} args - Arguments to find a RegionalIncident
     * @example
     * // Get one RegionalIncident
     * const regionalIncident = await prisma.regionalIncident.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RegionalIncidentFindUniqueArgs>(
      args: SelectSubset<T, RegionalIncidentFindUniqueArgs<ExtArgs>>,
    ): Prisma__RegionalIncidentClient<
      $Result.GetResult<
        Prisma.$RegionalIncidentPayload<ExtArgs>,
        T,
        "findUnique",
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one RegionalIncident that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RegionalIncidentFindUniqueOrThrowArgs} args - Arguments to find a RegionalIncident
     * @example
     * // Get one RegionalIncident
     * const regionalIncident = await prisma.regionalIncident.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RegionalIncidentFindUniqueOrThrowArgs>(
      args: SelectSubset<T, RegionalIncidentFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__RegionalIncidentClient<
      $Result.GetResult<
        Prisma.$RegionalIncidentPayload<ExtArgs>,
        T,
        "findUniqueOrThrow",
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first RegionalIncident that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RegionalIncidentFindFirstArgs} args - Arguments to find a RegionalIncident
     * @example
     * // Get one RegionalIncident
     * const regionalIncident = await prisma.regionalIncident.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RegionalIncidentFindFirstArgs>(
      args?: SelectSubset<T, RegionalIncidentFindFirstArgs<ExtArgs>>,
    ): Prisma__RegionalIncidentClient<
      $Result.GetResult<
        Prisma.$RegionalIncidentPayload<ExtArgs>,
        T,
        "findFirst",
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first RegionalIncident that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RegionalIncidentFindFirstOrThrowArgs} args - Arguments to find a RegionalIncident
     * @example
     * // Get one RegionalIncident
     * const regionalIncident = await prisma.regionalIncident.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RegionalIncidentFindFirstOrThrowArgs>(
      args?: SelectSubset<T, RegionalIncidentFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__RegionalIncidentClient<
      $Result.GetResult<
        Prisma.$RegionalIncidentPayload<ExtArgs>,
        T,
        "findFirstOrThrow",
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more RegionalIncidents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RegionalIncidentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RegionalIncidents
     * const regionalIncidents = await prisma.regionalIncident.findMany()
     *
     * // Get first 10 RegionalIncidents
     * const regionalIncidents = await prisma.regionalIncident.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const regionalIncidentWithIdOnly = await prisma.regionalIncident.findMany({ select: { id: true } })
     *
     */
    findMany<T extends RegionalIncidentFindManyArgs>(
      args?: SelectSubset<T, RegionalIncidentFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$RegionalIncidentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>
    >;

    /**
     * Create a RegionalIncident.
     * @param {RegionalIncidentCreateArgs} args - Arguments to create a RegionalIncident.
     * @example
     * // Create one RegionalIncident
     * const RegionalIncident = await prisma.regionalIncident.create({
     *   data: {
     *     // ... data to create a RegionalIncident
     *   }
     * })
     *
     */
    create<T extends RegionalIncidentCreateArgs>(
      args: SelectSubset<T, RegionalIncidentCreateArgs<ExtArgs>>,
    ): Prisma__RegionalIncidentClient<
      $Result.GetResult<Prisma.$RegionalIncidentPayload<ExtArgs>, T, "create", GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many RegionalIncidents.
     * @param {RegionalIncidentCreateManyArgs} args - Arguments to create many RegionalIncidents.
     * @example
     * // Create many RegionalIncidents
     * const regionalIncident = await prisma.regionalIncident.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends RegionalIncidentCreateManyArgs>(
      args?: SelectSubset<T, RegionalIncidentCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many RegionalIncidents and returns the data saved in the database.
     * @param {RegionalIncidentCreateManyAndReturnArgs} args - Arguments to create many RegionalIncidents.
     * @example
     * // Create many RegionalIncidents
     * const regionalIncident = await prisma.regionalIncident.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many RegionalIncidents and only return the `id`
     * const regionalIncidentWithIdOnly = await prisma.regionalIncident.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends RegionalIncidentCreateManyAndReturnArgs>(
      args?: SelectSubset<T, RegionalIncidentCreateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$RegionalIncidentPayload<ExtArgs>,
        T,
        "createManyAndReturn",
        GlobalOmitOptions
      >
    >;

    /**
     * Delete a RegionalIncident.
     * @param {RegionalIncidentDeleteArgs} args - Arguments to delete one RegionalIncident.
     * @example
     * // Delete one RegionalIncident
     * const RegionalIncident = await prisma.regionalIncident.delete({
     *   where: {
     *     // ... filter to delete one RegionalIncident
     *   }
     * })
     *
     */
    delete<T extends RegionalIncidentDeleteArgs>(
      args: SelectSubset<T, RegionalIncidentDeleteArgs<ExtArgs>>,
    ): Prisma__RegionalIncidentClient<
      $Result.GetResult<Prisma.$RegionalIncidentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one RegionalIncident.
     * @param {RegionalIncidentUpdateArgs} args - Arguments to update one RegionalIncident.
     * @example
     * // Update one RegionalIncident
     * const regionalIncident = await prisma.regionalIncident.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends RegionalIncidentUpdateArgs>(
      args: SelectSubset<T, RegionalIncidentUpdateArgs<ExtArgs>>,
    ): Prisma__RegionalIncidentClient<
      $Result.GetResult<Prisma.$RegionalIncidentPayload<ExtArgs>, T, "update", GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more RegionalIncidents.
     * @param {RegionalIncidentDeleteManyArgs} args - Arguments to filter RegionalIncidents to delete.
     * @example
     * // Delete a few RegionalIncidents
     * const { count } = await prisma.regionalIncident.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends RegionalIncidentDeleteManyArgs>(
      args?: SelectSubset<T, RegionalIncidentDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more RegionalIncidents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RegionalIncidentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RegionalIncidents
     * const regionalIncident = await prisma.regionalIncident.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends RegionalIncidentUpdateManyArgs>(
      args: SelectSubset<T, RegionalIncidentUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more RegionalIncidents and returns the data updated in the database.
     * @param {RegionalIncidentUpdateManyAndReturnArgs} args - Arguments to update many RegionalIncidents.
     * @example
     * // Update many RegionalIncidents
     * const regionalIncident = await prisma.regionalIncident.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more RegionalIncidents and only return the `id`
     * const regionalIncidentWithIdOnly = await prisma.regionalIncident.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends RegionalIncidentUpdateManyAndReturnArgs>(
      args: SelectSubset<T, RegionalIncidentUpdateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$RegionalIncidentPayload<ExtArgs>,
        T,
        "updateManyAndReturn",
        GlobalOmitOptions
      >
    >;

    /**
     * Create or update one RegionalIncident.
     * @param {RegionalIncidentUpsertArgs} args - Arguments to update or create a RegionalIncident.
     * @example
     * // Update or create a RegionalIncident
     * const regionalIncident = await prisma.regionalIncident.upsert({
     *   create: {
     *     // ... data to create a RegionalIncident
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RegionalIncident we want to update
     *   }
     * })
     */
    upsert<T extends RegionalIncidentUpsertArgs>(
      args: SelectSubset<T, RegionalIncidentUpsertArgs<ExtArgs>>,
    ): Prisma__RegionalIncidentClient<
      $Result.GetResult<Prisma.$RegionalIncidentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of RegionalIncidents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RegionalIncidentCountArgs} args - Arguments to filter RegionalIncidents to count.
     * @example
     * // Count the number of RegionalIncidents
     * const count = await prisma.regionalIncident.count({
     *   where: {
     *     // ... the filter for the RegionalIncidents we want to count
     *   }
     * })
     **/
    count<T extends RegionalIncidentCountArgs>(
      args?: Subset<T, RegionalIncidentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<"select", any>
        ? T["select"] extends true
          ? number
          : GetScalarType<T["select"], RegionalIncidentCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a RegionalIncident.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RegionalIncidentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends RegionalIncidentAggregateArgs>(
      args: Subset<T, RegionalIncidentAggregateArgs>,
    ): Prisma.PrismaPromise<GetRegionalIncidentAggregateType<T>>;

    /**
     * Group by RegionalIncident.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RegionalIncidentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends RegionalIncidentGroupByArgs,
      HasSelectOrTake extends Or<Extends<"skip", Keys<T>>, Extends<"take", Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RegionalIncidentGroupByArgs["orderBy"] }
        : { orderBy?: RegionalIncidentGroupByArgs["orderBy"] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T["orderBy"]>>>,
      ByFields extends MaybeTupleToUnion<T["by"]>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T["having"]>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T["by"] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [Error, "Field ", P, ` in "having" needs to be provided in "by"`];
            }[HavingFields]
          : "take" extends Keys<T>
            ? "orderBy" extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : "skip" extends Keys<T>
              ? "orderBy" extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, RegionalIncidentGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors
      ? GetRegionalIncidentGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the RegionalIncident model
     */
    readonly fields: RegionalIncidentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RegionalIncident.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RegionalIncidentClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    monitor<T extends MonitorDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, MonitorDefaultArgs<ExtArgs>>,
    ): Prisma__MonitorClient<
      | $Result.GetResult<
          Prisma.$MonitorPayload<ExtArgs>,
          T,
          "findUniqueOrThrow",
          GlobalOmitOptions
        >
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the RegionalIncident model
   */
  interface RegionalIncidentFieldRefs {
    readonly id: FieldRef<"RegionalIncident", "String">;
    readonly monitorId: FieldRef<"RegionalIncident", "String">;
    readonly region: FieldRef<"RegionalIncident", "String">;
    readonly status: FieldRef<"RegionalIncident", "IncidentStatus">;
    readonly startedAt: FieldRef<"RegionalIncident", "DateTime">;
    readonly resolvedAt: FieldRef<"RegionalIncident", "DateTime">;
    readonly createdAt: FieldRef<"RegionalIncident", "DateTime">;
    readonly updatedAt: FieldRef<"RegionalIncident", "DateTime">;
  }

  // Custom InputTypes
  /**
   * RegionalIncident findUnique
   */
  export type RegionalIncidentFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the RegionalIncident
     */
    select?: RegionalIncidentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the RegionalIncident
     */
    omit?: RegionalIncidentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RegionalIncidentInclude<ExtArgs> | null;
    /**
     * Filter, which RegionalIncident to fetch.
     */
    where: RegionalIncidentWhereUniqueInput;
  };

  /**
   * RegionalIncident findUniqueOrThrow
   */
  export type RegionalIncidentFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the RegionalIncident
     */
    select?: RegionalIncidentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the RegionalIncident
     */
    omit?: RegionalIncidentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RegionalIncidentInclude<ExtArgs> | null;
    /**
     * Filter, which RegionalIncident to fetch.
     */
    where: RegionalIncidentWhereUniqueInput;
  };

  /**
   * RegionalIncident findFirst
   */
  export type RegionalIncidentFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the RegionalIncident
     */
    select?: RegionalIncidentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the RegionalIncident
     */
    omit?: RegionalIncidentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RegionalIncidentInclude<ExtArgs> | null;
    /**
     * Filter, which RegionalIncident to fetch.
     */
    where?: RegionalIncidentWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of RegionalIncidents to fetch.
     */
    orderBy?: RegionalIncidentOrderByWithRelationInput | RegionalIncidentOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for RegionalIncidents.
     */
    cursor?: RegionalIncidentWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` RegionalIncidents from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` RegionalIncidents.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of RegionalIncidents.
     */
    distinct?: RegionalIncidentScalarFieldEnum | RegionalIncidentScalarFieldEnum[];
  };

  /**
   * RegionalIncident findFirstOrThrow
   */
  export type RegionalIncidentFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the RegionalIncident
     */
    select?: RegionalIncidentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the RegionalIncident
     */
    omit?: RegionalIncidentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RegionalIncidentInclude<ExtArgs> | null;
    /**
     * Filter, which RegionalIncident to fetch.
     */
    where?: RegionalIncidentWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of RegionalIncidents to fetch.
     */
    orderBy?: RegionalIncidentOrderByWithRelationInput | RegionalIncidentOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for RegionalIncidents.
     */
    cursor?: RegionalIncidentWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` RegionalIncidents from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` RegionalIncidents.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of RegionalIncidents.
     */
    distinct?: RegionalIncidentScalarFieldEnum | RegionalIncidentScalarFieldEnum[];
  };

  /**
   * RegionalIncident findMany
   */
  export type RegionalIncidentFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the RegionalIncident
     */
    select?: RegionalIncidentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the RegionalIncident
     */
    omit?: RegionalIncidentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RegionalIncidentInclude<ExtArgs> | null;
    /**
     * Filter, which RegionalIncidents to fetch.
     */
    where?: RegionalIncidentWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of RegionalIncidents to fetch.
     */
    orderBy?: RegionalIncidentOrderByWithRelationInput | RegionalIncidentOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing RegionalIncidents.
     */
    cursor?: RegionalIncidentWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` RegionalIncidents from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` RegionalIncidents.
     */
    skip?: number;
    distinct?: RegionalIncidentScalarFieldEnum | RegionalIncidentScalarFieldEnum[];
  };

  /**
   * RegionalIncident create
   */
  export type RegionalIncidentCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the RegionalIncident
     */
    select?: RegionalIncidentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the RegionalIncident
     */
    omit?: RegionalIncidentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RegionalIncidentInclude<ExtArgs> | null;
    /**
     * The data needed to create a RegionalIncident.
     */
    data: XOR<RegionalIncidentCreateInput, RegionalIncidentUncheckedCreateInput>;
  };

  /**
   * RegionalIncident createMany
   */
  export type RegionalIncidentCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many RegionalIncidents.
     */
    data: RegionalIncidentCreateManyInput | RegionalIncidentCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * RegionalIncident createManyAndReturn
   */
  export type RegionalIncidentCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the RegionalIncident
     */
    select?: RegionalIncidentSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the RegionalIncident
     */
    omit?: RegionalIncidentOmit<ExtArgs> | null;
    /**
     * The data used to create many RegionalIncidents.
     */
    data: RegionalIncidentCreateManyInput | RegionalIncidentCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RegionalIncidentIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * RegionalIncident update
   */
  export type RegionalIncidentUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the RegionalIncident
     */
    select?: RegionalIncidentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the RegionalIncident
     */
    omit?: RegionalIncidentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RegionalIncidentInclude<ExtArgs> | null;
    /**
     * The data needed to update a RegionalIncident.
     */
    data: XOR<RegionalIncidentUpdateInput, RegionalIncidentUncheckedUpdateInput>;
    /**
     * Choose, which RegionalIncident to update.
     */
    where: RegionalIncidentWhereUniqueInput;
  };

  /**
   * RegionalIncident updateMany
   */
  export type RegionalIncidentUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update RegionalIncidents.
     */
    data: XOR<RegionalIncidentUpdateManyMutationInput, RegionalIncidentUncheckedUpdateManyInput>;
    /**
     * Filter which RegionalIncidents to update
     */
    where?: RegionalIncidentWhereInput;
    /**
     * Limit how many RegionalIncidents to update.
     */
    limit?: number;
  };

  /**
   * RegionalIncident updateManyAndReturn
   */
  export type RegionalIncidentUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the RegionalIncident
     */
    select?: RegionalIncidentSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the RegionalIncident
     */
    omit?: RegionalIncidentOmit<ExtArgs> | null;
    /**
     * The data used to update RegionalIncidents.
     */
    data: XOR<RegionalIncidentUpdateManyMutationInput, RegionalIncidentUncheckedUpdateManyInput>;
    /**
     * Filter which RegionalIncidents to update
     */
    where?: RegionalIncidentWhereInput;
    /**
     * Limit how many RegionalIncidents to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RegionalIncidentIncludeUpdateManyAndReturn<ExtArgs> | null;
  };

  /**
   * RegionalIncident upsert
   */
  export type RegionalIncidentUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the RegionalIncident
     */
    select?: RegionalIncidentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the RegionalIncident
     */
    omit?: RegionalIncidentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RegionalIncidentInclude<ExtArgs> | null;
    /**
     * The filter to search for the RegionalIncident to update in case it exists.
     */
    where: RegionalIncidentWhereUniqueInput;
    /**
     * In case the RegionalIncident found by the `where` argument doesn't exist, create a new RegionalIncident with this data.
     */
    create: XOR<RegionalIncidentCreateInput, RegionalIncidentUncheckedCreateInput>;
    /**
     * In case the RegionalIncident was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RegionalIncidentUpdateInput, RegionalIncidentUncheckedUpdateInput>;
  };

  /**
   * RegionalIncident delete
   */
  export type RegionalIncidentDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the RegionalIncident
     */
    select?: RegionalIncidentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the RegionalIncident
     */
    omit?: RegionalIncidentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RegionalIncidentInclude<ExtArgs> | null;
    /**
     * Filter which RegionalIncident to delete.
     */
    where: RegionalIncidentWhereUniqueInput;
  };

  /**
   * RegionalIncident deleteMany
   */
  export type RegionalIncidentDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which RegionalIncidents to delete
     */
    where?: RegionalIncidentWhereInput;
    /**
     * Limit how many RegionalIncidents to delete.
     */
    limit?: number;
  };

  /**
   * RegionalIncident without action
   */
  export type RegionalIncidentDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the RegionalIncident
     */
    select?: RegionalIncidentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the RegionalIncident
     */
    omit?: RegionalIncidentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RegionalIncidentInclude<ExtArgs> | null;
  };

  /**
   * Model NotificationChannel
   */

  export type AggregateNotificationChannel = {
    _count: NotificationChannelCountAggregateOutputType | null;
    _min: NotificationChannelMinAggregateOutputType | null;
    _max: NotificationChannelMaxAggregateOutputType | null;
  };

  export type NotificationChannelMinAggregateOutputType = {
    id: string | null;
    name: string | null;
    type: $Enums.NotificationType | null;
    userId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type NotificationChannelMaxAggregateOutputType = {
    id: string | null;
    name: string | null;
    type: $Enums.NotificationType | null;
    userId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type NotificationChannelCountAggregateOutputType = {
    id: number;
    name: number;
    type: number;
    config: number;
    userId: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
  };

  export type NotificationChannelMinAggregateInputType = {
    id?: true;
    name?: true;
    type?: true;
    userId?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type NotificationChannelMaxAggregateInputType = {
    id?: true;
    name?: true;
    type?: true;
    userId?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type NotificationChannelCountAggregateInputType = {
    id?: true;
    name?: true;
    type?: true;
    config?: true;
    userId?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
  };

  export type NotificationChannelAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which NotificationChannel to aggregate.
     */
    where?: NotificationChannelWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of NotificationChannels to fetch.
     */
    orderBy?:
      | NotificationChannelOrderByWithRelationInput
      | NotificationChannelOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: NotificationChannelWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` NotificationChannels from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` NotificationChannels.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned NotificationChannels
     **/
    _count?: true | NotificationChannelCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: NotificationChannelMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: NotificationChannelMaxAggregateInputType;
  };

  export type GetNotificationChannelAggregateType<T extends NotificationChannelAggregateArgs> = {
    [P in keyof T & keyof AggregateNotificationChannel]: P extends "_count" | "count"
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateNotificationChannel[P]>
      : GetScalarType<T[P], AggregateNotificationChannel[P]>;
  };

  export type NotificationChannelGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: NotificationChannelWhereInput;
    orderBy?:
      | NotificationChannelOrderByWithAggregationInput
      | NotificationChannelOrderByWithAggregationInput[];
    by: NotificationChannelScalarFieldEnum[] | NotificationChannelScalarFieldEnum;
    having?: NotificationChannelScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: NotificationChannelCountAggregateInputType | true;
    _min?: NotificationChannelMinAggregateInputType;
    _max?: NotificationChannelMaxAggregateInputType;
  };

  export type NotificationChannelGroupByOutputType = {
    id: string;
    name: string;
    type: $Enums.NotificationType;
    config: JsonValue;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    _count: NotificationChannelCountAggregateOutputType | null;
    _min: NotificationChannelMinAggregateOutputType | null;
    _max: NotificationChannelMaxAggregateOutputType | null;
  };

  type GetNotificationChannelGroupByPayload<T extends NotificationChannelGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<NotificationChannelGroupByOutputType, T["by"]> & {
          [P in keyof T & keyof NotificationChannelGroupByOutputType]: P extends "_count"
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], NotificationChannelGroupByOutputType[P]>
            : GetScalarType<T[P], NotificationChannelGroupByOutputType[P]>;
        }
      >
    >;

  export type NotificationChannelSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      name?: boolean;
      type?: boolean;
      config?: boolean;
      userId?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
      alertRules?: boolean | NotificationChannel$alertRulesArgs<ExtArgs>;
      _count?: boolean | NotificationChannelCountOutputTypeDefaultArgs<ExtArgs>;
    },
    ExtArgs["result"]["notificationChannel"]
  >;

  export type NotificationChannelSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      name?: boolean;
      type?: boolean;
      config?: boolean;
      userId?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs["result"]["notificationChannel"]
  >;

  export type NotificationChannelSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      name?: boolean;
      type?: boolean;
      config?: boolean;
      userId?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs["result"]["notificationChannel"]
  >;

  export type NotificationChannelSelectScalar = {
    id?: boolean;
    name?: boolean;
    type?: boolean;
    config?: boolean;
    userId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
  };

  export type NotificationChannelOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetOmit<
    "id" | "name" | "type" | "config" | "userId" | "createdAt" | "updatedAt",
    ExtArgs["result"]["notificationChannel"]
  >;
  export type NotificationChannelInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
    alertRules?: boolean | NotificationChannel$alertRulesArgs<ExtArgs>;
    _count?: boolean | NotificationChannelCountOutputTypeDefaultArgs<ExtArgs>;
  };
  export type NotificationChannelIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
  };
  export type NotificationChannelIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
  };

  export type $NotificationChannelPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: "NotificationChannel";
    objects: {
      user: Prisma.$UserPayload<ExtArgs>;
      alertRules: Prisma.$AlertRulePayload<ExtArgs>[];
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        name: string;
        type: $Enums.NotificationType;
        config: Prisma.JsonValue;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
      },
      ExtArgs["result"]["notificationChannel"]
    >;
    composites: {};
  };

  type NotificationChannelGetPayload<
    S extends boolean | null | undefined | NotificationChannelDefaultArgs,
  > = $Result.GetResult<Prisma.$NotificationChannelPayload, S>;

  type NotificationChannelCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<NotificationChannelFindManyArgs, "select" | "include" | "distinct" | "omit"> & {
    select?: NotificationChannelCountAggregateInputType | true;
  };

  export interface NotificationChannelDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>["model"]["NotificationChannel"];
      meta: { name: "NotificationChannel" };
    };
    /**
     * Find zero or one NotificationChannel that matches the filter.
     * @param {NotificationChannelFindUniqueArgs} args - Arguments to find a NotificationChannel
     * @example
     * // Get one NotificationChannel
     * const notificationChannel = await prisma.notificationChannel.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends NotificationChannelFindUniqueArgs>(
      args: SelectSubset<T, NotificationChannelFindUniqueArgs<ExtArgs>>,
    ): Prisma__NotificationChannelClient<
      $Result.GetResult<
        Prisma.$NotificationChannelPayload<ExtArgs>,
        T,
        "findUnique",
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one NotificationChannel that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {NotificationChannelFindUniqueOrThrowArgs} args - Arguments to find a NotificationChannel
     * @example
     * // Get one NotificationChannel
     * const notificationChannel = await prisma.notificationChannel.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends NotificationChannelFindUniqueOrThrowArgs>(
      args: SelectSubset<T, NotificationChannelFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__NotificationChannelClient<
      $Result.GetResult<
        Prisma.$NotificationChannelPayload<ExtArgs>,
        T,
        "findUniqueOrThrow",
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first NotificationChannel that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationChannelFindFirstArgs} args - Arguments to find a NotificationChannel
     * @example
     * // Get one NotificationChannel
     * const notificationChannel = await prisma.notificationChannel.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends NotificationChannelFindFirstArgs>(
      args?: SelectSubset<T, NotificationChannelFindFirstArgs<ExtArgs>>,
    ): Prisma__NotificationChannelClient<
      $Result.GetResult<
        Prisma.$NotificationChannelPayload<ExtArgs>,
        T,
        "findFirst",
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first NotificationChannel that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationChannelFindFirstOrThrowArgs} args - Arguments to find a NotificationChannel
     * @example
     * // Get one NotificationChannel
     * const notificationChannel = await prisma.notificationChannel.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends NotificationChannelFindFirstOrThrowArgs>(
      args?: SelectSubset<T, NotificationChannelFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__NotificationChannelClient<
      $Result.GetResult<
        Prisma.$NotificationChannelPayload<ExtArgs>,
        T,
        "findFirstOrThrow",
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more NotificationChannels that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationChannelFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all NotificationChannels
     * const notificationChannels = await prisma.notificationChannel.findMany()
     *
     * // Get first 10 NotificationChannels
     * const notificationChannels = await prisma.notificationChannel.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const notificationChannelWithIdOnly = await prisma.notificationChannel.findMany({ select: { id: true } })
     *
     */
    findMany<T extends NotificationChannelFindManyArgs>(
      args?: SelectSubset<T, NotificationChannelFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$NotificationChannelPayload<ExtArgs>,
        T,
        "findMany",
        GlobalOmitOptions
      >
    >;

    /**
     * Create a NotificationChannel.
     * @param {NotificationChannelCreateArgs} args - Arguments to create a NotificationChannel.
     * @example
     * // Create one NotificationChannel
     * const NotificationChannel = await prisma.notificationChannel.create({
     *   data: {
     *     // ... data to create a NotificationChannel
     *   }
     * })
     *
     */
    create<T extends NotificationChannelCreateArgs>(
      args: SelectSubset<T, NotificationChannelCreateArgs<ExtArgs>>,
    ): Prisma__NotificationChannelClient<
      $Result.GetResult<
        Prisma.$NotificationChannelPayload<ExtArgs>,
        T,
        "create",
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many NotificationChannels.
     * @param {NotificationChannelCreateManyArgs} args - Arguments to create many NotificationChannels.
     * @example
     * // Create many NotificationChannels
     * const notificationChannel = await prisma.notificationChannel.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends NotificationChannelCreateManyArgs>(
      args?: SelectSubset<T, NotificationChannelCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many NotificationChannels and returns the data saved in the database.
     * @param {NotificationChannelCreateManyAndReturnArgs} args - Arguments to create many NotificationChannels.
     * @example
     * // Create many NotificationChannels
     * const notificationChannel = await prisma.notificationChannel.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many NotificationChannels and only return the `id`
     * const notificationChannelWithIdOnly = await prisma.notificationChannel.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends NotificationChannelCreateManyAndReturnArgs>(
      args?: SelectSubset<T, NotificationChannelCreateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$NotificationChannelPayload<ExtArgs>,
        T,
        "createManyAndReturn",
        GlobalOmitOptions
      >
    >;

    /**
     * Delete a NotificationChannel.
     * @param {NotificationChannelDeleteArgs} args - Arguments to delete one NotificationChannel.
     * @example
     * // Delete one NotificationChannel
     * const NotificationChannel = await prisma.notificationChannel.delete({
     *   where: {
     *     // ... filter to delete one NotificationChannel
     *   }
     * })
     *
     */
    delete<T extends NotificationChannelDeleteArgs>(
      args: SelectSubset<T, NotificationChannelDeleteArgs<ExtArgs>>,
    ): Prisma__NotificationChannelClient<
      $Result.GetResult<
        Prisma.$NotificationChannelPayload<ExtArgs>,
        T,
        "delete",
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one NotificationChannel.
     * @param {NotificationChannelUpdateArgs} args - Arguments to update one NotificationChannel.
     * @example
     * // Update one NotificationChannel
     * const notificationChannel = await prisma.notificationChannel.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends NotificationChannelUpdateArgs>(
      args: SelectSubset<T, NotificationChannelUpdateArgs<ExtArgs>>,
    ): Prisma__NotificationChannelClient<
      $Result.GetResult<
        Prisma.$NotificationChannelPayload<ExtArgs>,
        T,
        "update",
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more NotificationChannels.
     * @param {NotificationChannelDeleteManyArgs} args - Arguments to filter NotificationChannels to delete.
     * @example
     * // Delete a few NotificationChannels
     * const { count } = await prisma.notificationChannel.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends NotificationChannelDeleteManyArgs>(
      args?: SelectSubset<T, NotificationChannelDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more NotificationChannels.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationChannelUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many NotificationChannels
     * const notificationChannel = await prisma.notificationChannel.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends NotificationChannelUpdateManyArgs>(
      args: SelectSubset<T, NotificationChannelUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more NotificationChannels and returns the data updated in the database.
     * @param {NotificationChannelUpdateManyAndReturnArgs} args - Arguments to update many NotificationChannels.
     * @example
     * // Update many NotificationChannels
     * const notificationChannel = await prisma.notificationChannel.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more NotificationChannels and only return the `id`
     * const notificationChannelWithIdOnly = await prisma.notificationChannel.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends NotificationChannelUpdateManyAndReturnArgs>(
      args: SelectSubset<T, NotificationChannelUpdateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$NotificationChannelPayload<ExtArgs>,
        T,
        "updateManyAndReturn",
        GlobalOmitOptions
      >
    >;

    /**
     * Create or update one NotificationChannel.
     * @param {NotificationChannelUpsertArgs} args - Arguments to update or create a NotificationChannel.
     * @example
     * // Update or create a NotificationChannel
     * const notificationChannel = await prisma.notificationChannel.upsert({
     *   create: {
     *     // ... data to create a NotificationChannel
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the NotificationChannel we want to update
     *   }
     * })
     */
    upsert<T extends NotificationChannelUpsertArgs>(
      args: SelectSubset<T, NotificationChannelUpsertArgs<ExtArgs>>,
    ): Prisma__NotificationChannelClient<
      $Result.GetResult<
        Prisma.$NotificationChannelPayload<ExtArgs>,
        T,
        "upsert",
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of NotificationChannels.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationChannelCountArgs} args - Arguments to filter NotificationChannels to count.
     * @example
     * // Count the number of NotificationChannels
     * const count = await prisma.notificationChannel.count({
     *   where: {
     *     // ... the filter for the NotificationChannels we want to count
     *   }
     * })
     **/
    count<T extends NotificationChannelCountArgs>(
      args?: Subset<T, NotificationChannelCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<"select", any>
        ? T["select"] extends true
          ? number
          : GetScalarType<T["select"], NotificationChannelCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a NotificationChannel.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationChannelAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends NotificationChannelAggregateArgs>(
      args: Subset<T, NotificationChannelAggregateArgs>,
    ): Prisma.PrismaPromise<GetNotificationChannelAggregateType<T>>;

    /**
     * Group by NotificationChannel.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationChannelGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends NotificationChannelGroupByArgs,
      HasSelectOrTake extends Or<Extends<"skip", Keys<T>>, Extends<"take", Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: NotificationChannelGroupByArgs["orderBy"] }
        : { orderBy?: NotificationChannelGroupByArgs["orderBy"] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T["orderBy"]>>>,
      ByFields extends MaybeTupleToUnion<T["by"]>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T["having"]>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T["by"] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [Error, "Field ", P, ` in "having" needs to be provided in "by"`];
            }[HavingFields]
          : "take" extends Keys<T>
            ? "orderBy" extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : "skip" extends Keys<T>
              ? "orderBy" extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, NotificationChannelGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors
      ? GetNotificationChannelGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the NotificationChannel model
     */
    readonly fields: NotificationChannelFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for NotificationChannel.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__NotificationChannelClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    user<T extends UserDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, UserDefaultArgs<ExtArgs>>,
    ): Prisma__UserClient<
      | $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    alertRules<T extends NotificationChannel$alertRulesArgs<ExtArgs> = {}>(
      args?: Subset<T, NotificationChannel$alertRulesArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$AlertRulePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the NotificationChannel model
   */
  interface NotificationChannelFieldRefs {
    readonly id: FieldRef<"NotificationChannel", "String">;
    readonly name: FieldRef<"NotificationChannel", "String">;
    readonly type: FieldRef<"NotificationChannel", "NotificationType">;
    readonly config: FieldRef<"NotificationChannel", "Json">;
    readonly userId: FieldRef<"NotificationChannel", "String">;
    readonly createdAt: FieldRef<"NotificationChannel", "DateTime">;
    readonly updatedAt: FieldRef<"NotificationChannel", "DateTime">;
  }

  // Custom InputTypes
  /**
   * NotificationChannel findUnique
   */
  export type NotificationChannelFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the NotificationChannel
     */
    select?: NotificationChannelSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the NotificationChannel
     */
    omit?: NotificationChannelOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationChannelInclude<ExtArgs> | null;
    /**
     * Filter, which NotificationChannel to fetch.
     */
    where: NotificationChannelWhereUniqueInput;
  };

  /**
   * NotificationChannel findUniqueOrThrow
   */
  export type NotificationChannelFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the NotificationChannel
     */
    select?: NotificationChannelSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the NotificationChannel
     */
    omit?: NotificationChannelOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationChannelInclude<ExtArgs> | null;
    /**
     * Filter, which NotificationChannel to fetch.
     */
    where: NotificationChannelWhereUniqueInput;
  };

  /**
   * NotificationChannel findFirst
   */
  export type NotificationChannelFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the NotificationChannel
     */
    select?: NotificationChannelSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the NotificationChannel
     */
    omit?: NotificationChannelOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationChannelInclude<ExtArgs> | null;
    /**
     * Filter, which NotificationChannel to fetch.
     */
    where?: NotificationChannelWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of NotificationChannels to fetch.
     */
    orderBy?:
      | NotificationChannelOrderByWithRelationInput
      | NotificationChannelOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for NotificationChannels.
     */
    cursor?: NotificationChannelWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` NotificationChannels from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` NotificationChannels.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of NotificationChannels.
     */
    distinct?: NotificationChannelScalarFieldEnum | NotificationChannelScalarFieldEnum[];
  };

  /**
   * NotificationChannel findFirstOrThrow
   */
  export type NotificationChannelFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the NotificationChannel
     */
    select?: NotificationChannelSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the NotificationChannel
     */
    omit?: NotificationChannelOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationChannelInclude<ExtArgs> | null;
    /**
     * Filter, which NotificationChannel to fetch.
     */
    where?: NotificationChannelWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of NotificationChannels to fetch.
     */
    orderBy?:
      | NotificationChannelOrderByWithRelationInput
      | NotificationChannelOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for NotificationChannels.
     */
    cursor?: NotificationChannelWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` NotificationChannels from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` NotificationChannels.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of NotificationChannels.
     */
    distinct?: NotificationChannelScalarFieldEnum | NotificationChannelScalarFieldEnum[];
  };

  /**
   * NotificationChannel findMany
   */
  export type NotificationChannelFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the NotificationChannel
     */
    select?: NotificationChannelSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the NotificationChannel
     */
    omit?: NotificationChannelOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationChannelInclude<ExtArgs> | null;
    /**
     * Filter, which NotificationChannels to fetch.
     */
    where?: NotificationChannelWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of NotificationChannels to fetch.
     */
    orderBy?:
      | NotificationChannelOrderByWithRelationInput
      | NotificationChannelOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing NotificationChannels.
     */
    cursor?: NotificationChannelWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` NotificationChannels from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` NotificationChannels.
     */
    skip?: number;
    distinct?: NotificationChannelScalarFieldEnum | NotificationChannelScalarFieldEnum[];
  };

  /**
   * NotificationChannel create
   */
  export type NotificationChannelCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the NotificationChannel
     */
    select?: NotificationChannelSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the NotificationChannel
     */
    omit?: NotificationChannelOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationChannelInclude<ExtArgs> | null;
    /**
     * The data needed to create a NotificationChannel.
     */
    data: XOR<NotificationChannelCreateInput, NotificationChannelUncheckedCreateInput>;
  };

  /**
   * NotificationChannel createMany
   */
  export type NotificationChannelCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many NotificationChannels.
     */
    data: NotificationChannelCreateManyInput | NotificationChannelCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * NotificationChannel createManyAndReturn
   */
  export type NotificationChannelCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the NotificationChannel
     */
    select?: NotificationChannelSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the NotificationChannel
     */
    omit?: NotificationChannelOmit<ExtArgs> | null;
    /**
     * The data used to create many NotificationChannels.
     */
    data: NotificationChannelCreateManyInput | NotificationChannelCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationChannelIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * NotificationChannel update
   */
  export type NotificationChannelUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the NotificationChannel
     */
    select?: NotificationChannelSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the NotificationChannel
     */
    omit?: NotificationChannelOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationChannelInclude<ExtArgs> | null;
    /**
     * The data needed to update a NotificationChannel.
     */
    data: XOR<NotificationChannelUpdateInput, NotificationChannelUncheckedUpdateInput>;
    /**
     * Choose, which NotificationChannel to update.
     */
    where: NotificationChannelWhereUniqueInput;
  };

  /**
   * NotificationChannel updateMany
   */
  export type NotificationChannelUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update NotificationChannels.
     */
    data: XOR<
      NotificationChannelUpdateManyMutationInput,
      NotificationChannelUncheckedUpdateManyInput
    >;
    /**
     * Filter which NotificationChannels to update
     */
    where?: NotificationChannelWhereInput;
    /**
     * Limit how many NotificationChannels to update.
     */
    limit?: number;
  };

  /**
   * NotificationChannel updateManyAndReturn
   */
  export type NotificationChannelUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the NotificationChannel
     */
    select?: NotificationChannelSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the NotificationChannel
     */
    omit?: NotificationChannelOmit<ExtArgs> | null;
    /**
     * The data used to update NotificationChannels.
     */
    data: XOR<
      NotificationChannelUpdateManyMutationInput,
      NotificationChannelUncheckedUpdateManyInput
    >;
    /**
     * Filter which NotificationChannels to update
     */
    where?: NotificationChannelWhereInput;
    /**
     * Limit how many NotificationChannels to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationChannelIncludeUpdateManyAndReturn<ExtArgs> | null;
  };

  /**
   * NotificationChannel upsert
   */
  export type NotificationChannelUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the NotificationChannel
     */
    select?: NotificationChannelSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the NotificationChannel
     */
    omit?: NotificationChannelOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationChannelInclude<ExtArgs> | null;
    /**
     * The filter to search for the NotificationChannel to update in case it exists.
     */
    where: NotificationChannelWhereUniqueInput;
    /**
     * In case the NotificationChannel found by the `where` argument doesn't exist, create a new NotificationChannel with this data.
     */
    create: XOR<NotificationChannelCreateInput, NotificationChannelUncheckedCreateInput>;
    /**
     * In case the NotificationChannel was found with the provided `where` argument, update it with this data.
     */
    update: XOR<NotificationChannelUpdateInput, NotificationChannelUncheckedUpdateInput>;
  };

  /**
   * NotificationChannel delete
   */
  export type NotificationChannelDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the NotificationChannel
     */
    select?: NotificationChannelSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the NotificationChannel
     */
    omit?: NotificationChannelOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationChannelInclude<ExtArgs> | null;
    /**
     * Filter which NotificationChannel to delete.
     */
    where: NotificationChannelWhereUniqueInput;
  };

  /**
   * NotificationChannel deleteMany
   */
  export type NotificationChannelDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which NotificationChannels to delete
     */
    where?: NotificationChannelWhereInput;
    /**
     * Limit how many NotificationChannels to delete.
     */
    limit?: number;
  };

  /**
   * NotificationChannel.alertRules
   */
  export type NotificationChannel$alertRulesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AlertRule
     */
    select?: AlertRuleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AlertRule
     */
    omit?: AlertRuleOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlertRuleInclude<ExtArgs> | null;
    where?: AlertRuleWhereInput;
    orderBy?: AlertRuleOrderByWithRelationInput | AlertRuleOrderByWithRelationInput[];
    cursor?: AlertRuleWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: AlertRuleScalarFieldEnum | AlertRuleScalarFieldEnum[];
  };

  /**
   * NotificationChannel without action
   */
  export type NotificationChannelDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the NotificationChannel
     */
    select?: NotificationChannelSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the NotificationChannel
     */
    omit?: NotificationChannelOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationChannelInclude<ExtArgs> | null;
  };

  /**
   * Model AlertRule
   */

  export type AggregateAlertRule = {
    _count: AlertRuleCountAggregateOutputType | null;
    _avg: AlertRuleAvgAggregateOutputType | null;
    _sum: AlertRuleSumAggregateOutputType | null;
    _min: AlertRuleMinAggregateOutputType | null;
    _max: AlertRuleMaxAggregateOutputType | null;
  };

  export type AlertRuleAvgAggregateOutputType = {
    threshold: number | null;
  };

  export type AlertRuleSumAggregateOutputType = {
    threshold: number | null;
  };

  export type AlertRuleMinAggregateOutputType = {
    id: string | null;
    monitorId: string | null;
    trigger: $Enums.AlertTrigger | null;
    threshold: number | null;
    comparison: $Enums.ComparisonOperator | null;
    targetStatus: $Enums.MonitorStatus | null;
    enabled: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type AlertRuleMaxAggregateOutputType = {
    id: string | null;
    monitorId: string | null;
    trigger: $Enums.AlertTrigger | null;
    threshold: number | null;
    comparison: $Enums.ComparisonOperator | null;
    targetStatus: $Enums.MonitorStatus | null;
    enabled: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type AlertRuleCountAggregateOutputType = {
    id: number;
    monitorId: number;
    trigger: number;
    threshold: number;
    comparison: number;
    targetStatus: number;
    enabled: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
  };

  export type AlertRuleAvgAggregateInputType = {
    threshold?: true;
  };

  export type AlertRuleSumAggregateInputType = {
    threshold?: true;
  };

  export type AlertRuleMinAggregateInputType = {
    id?: true;
    monitorId?: true;
    trigger?: true;
    threshold?: true;
    comparison?: true;
    targetStatus?: true;
    enabled?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type AlertRuleMaxAggregateInputType = {
    id?: true;
    monitorId?: true;
    trigger?: true;
    threshold?: true;
    comparison?: true;
    targetStatus?: true;
    enabled?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type AlertRuleCountAggregateInputType = {
    id?: true;
    monitorId?: true;
    trigger?: true;
    threshold?: true;
    comparison?: true;
    targetStatus?: true;
    enabled?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
  };

  export type AlertRuleAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which AlertRule to aggregate.
     */
    where?: AlertRuleWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AlertRules to fetch.
     */
    orderBy?: AlertRuleOrderByWithRelationInput | AlertRuleOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: AlertRuleWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AlertRules from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AlertRules.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned AlertRules
     **/
    _count?: true | AlertRuleCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: AlertRuleAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: AlertRuleSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: AlertRuleMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: AlertRuleMaxAggregateInputType;
  };

  export type GetAlertRuleAggregateType<T extends AlertRuleAggregateArgs> = {
    [P in keyof T & keyof AggregateAlertRule]: P extends "_count" | "count"
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAlertRule[P]>
      : GetScalarType<T[P], AggregateAlertRule[P]>;
  };

  export type AlertRuleGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: AlertRuleWhereInput;
    orderBy?: AlertRuleOrderByWithAggregationInput | AlertRuleOrderByWithAggregationInput[];
    by: AlertRuleScalarFieldEnum[] | AlertRuleScalarFieldEnum;
    having?: AlertRuleScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: AlertRuleCountAggregateInputType | true;
    _avg?: AlertRuleAvgAggregateInputType;
    _sum?: AlertRuleSumAggregateInputType;
    _min?: AlertRuleMinAggregateInputType;
    _max?: AlertRuleMaxAggregateInputType;
  };

  export type AlertRuleGroupByOutputType = {
    id: string;
    monitorId: string;
    trigger: $Enums.AlertTrigger;
    threshold: number | null;
    comparison: $Enums.ComparisonOperator | null;
    targetStatus: $Enums.MonitorStatus | null;
    enabled: boolean;
    createdAt: Date;
    updatedAt: Date;
    _count: AlertRuleCountAggregateOutputType | null;
    _avg: AlertRuleAvgAggregateOutputType | null;
    _sum: AlertRuleSumAggregateOutputType | null;
    _min: AlertRuleMinAggregateOutputType | null;
    _max: AlertRuleMaxAggregateOutputType | null;
  };

  type GetAlertRuleGroupByPayload<T extends AlertRuleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AlertRuleGroupByOutputType, T["by"]> & {
        [P in keyof T & keyof AlertRuleGroupByOutputType]: P extends "_count"
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], AlertRuleGroupByOutputType[P]>
          : GetScalarType<T[P], AlertRuleGroupByOutputType[P]>;
      }
    >
  >;

  export type AlertRuleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetSelect<
      {
        id?: boolean;
        monitorId?: boolean;
        trigger?: boolean;
        threshold?: boolean;
        comparison?: boolean;
        targetStatus?: boolean;
        enabled?: boolean;
        createdAt?: boolean;
        updatedAt?: boolean;
        monitor?: boolean | MonitorDefaultArgs<ExtArgs>;
        channels?: boolean | AlertRule$channelsArgs<ExtArgs>;
        _count?: boolean | AlertRuleCountOutputTypeDefaultArgs<ExtArgs>;
      },
      ExtArgs["result"]["alertRule"]
    >;

  export type AlertRuleSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      monitorId?: boolean;
      trigger?: boolean;
      threshold?: boolean;
      comparison?: boolean;
      targetStatus?: boolean;
      enabled?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      monitor?: boolean | MonitorDefaultArgs<ExtArgs>;
    },
    ExtArgs["result"]["alertRule"]
  >;

  export type AlertRuleSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      monitorId?: boolean;
      trigger?: boolean;
      threshold?: boolean;
      comparison?: boolean;
      targetStatus?: boolean;
      enabled?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      monitor?: boolean | MonitorDefaultArgs<ExtArgs>;
    },
    ExtArgs["result"]["alertRule"]
  >;

  export type AlertRuleSelectScalar = {
    id?: boolean;
    monitorId?: boolean;
    trigger?: boolean;
    threshold?: boolean;
    comparison?: boolean;
    targetStatus?: boolean;
    enabled?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
  };

  export type AlertRuleOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetOmit<
      | "id"
      | "monitorId"
      | "trigger"
      | "threshold"
      | "comparison"
      | "targetStatus"
      | "enabled"
      | "createdAt"
      | "updatedAt",
      ExtArgs["result"]["alertRule"]
    >;
  export type AlertRuleInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      monitor?: boolean | MonitorDefaultArgs<ExtArgs>;
      channels?: boolean | AlertRule$channelsArgs<ExtArgs>;
      _count?: boolean | AlertRuleCountOutputTypeDefaultArgs<ExtArgs>;
    };
  export type AlertRuleIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    monitor?: boolean | MonitorDefaultArgs<ExtArgs>;
  };
  export type AlertRuleIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    monitor?: boolean | MonitorDefaultArgs<ExtArgs>;
  };

  export type $AlertRulePayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: "AlertRule";
    objects: {
      monitor: Prisma.$MonitorPayload<ExtArgs>;
      channels: Prisma.$NotificationChannelPayload<ExtArgs>[];
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        monitorId: string;
        trigger: $Enums.AlertTrigger;
        threshold: number | null;
        comparison: $Enums.ComparisonOperator | null;
        targetStatus: $Enums.MonitorStatus | null;
        enabled: boolean;
        createdAt: Date;
        updatedAt: Date;
      },
      ExtArgs["result"]["alertRule"]
    >;
    composites: {};
  };

  type AlertRuleGetPayload<S extends boolean | null | undefined | AlertRuleDefaultArgs> =
    $Result.GetResult<Prisma.$AlertRulePayload, S>;

  type AlertRuleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AlertRuleFindManyArgs, "select" | "include" | "distinct" | "omit"> & {
      select?: AlertRuleCountAggregateInputType | true;
    };

  export interface AlertRuleDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>["model"]["AlertRule"];
      meta: { name: "AlertRule" };
    };
    /**
     * Find zero or one AlertRule that matches the filter.
     * @param {AlertRuleFindUniqueArgs} args - Arguments to find a AlertRule
     * @example
     * // Get one AlertRule
     * const alertRule = await prisma.alertRule.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AlertRuleFindUniqueArgs>(
      args: SelectSubset<T, AlertRuleFindUniqueArgs<ExtArgs>>,
    ): Prisma__AlertRuleClient<
      $Result.GetResult<
        Prisma.$AlertRulePayload<ExtArgs>,
        T,
        "findUnique",
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one AlertRule that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AlertRuleFindUniqueOrThrowArgs} args - Arguments to find a AlertRule
     * @example
     * // Get one AlertRule
     * const alertRule = await prisma.alertRule.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AlertRuleFindUniqueOrThrowArgs>(
      args: SelectSubset<T, AlertRuleFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__AlertRuleClient<
      $Result.GetResult<
        Prisma.$AlertRulePayload<ExtArgs>,
        T,
        "findUniqueOrThrow",
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first AlertRule that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlertRuleFindFirstArgs} args - Arguments to find a AlertRule
     * @example
     * // Get one AlertRule
     * const alertRule = await prisma.alertRule.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AlertRuleFindFirstArgs>(
      args?: SelectSubset<T, AlertRuleFindFirstArgs<ExtArgs>>,
    ): Prisma__AlertRuleClient<
      $Result.GetResult<
        Prisma.$AlertRulePayload<ExtArgs>,
        T,
        "findFirst",
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first AlertRule that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlertRuleFindFirstOrThrowArgs} args - Arguments to find a AlertRule
     * @example
     * // Get one AlertRule
     * const alertRule = await prisma.alertRule.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AlertRuleFindFirstOrThrowArgs>(
      args?: SelectSubset<T, AlertRuleFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__AlertRuleClient<
      $Result.GetResult<
        Prisma.$AlertRulePayload<ExtArgs>,
        T,
        "findFirstOrThrow",
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more AlertRules that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlertRuleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AlertRules
     * const alertRules = await prisma.alertRule.findMany()
     *
     * // Get first 10 AlertRules
     * const alertRules = await prisma.alertRule.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const alertRuleWithIdOnly = await prisma.alertRule.findMany({ select: { id: true } })
     *
     */
    findMany<T extends AlertRuleFindManyArgs>(
      args?: SelectSubset<T, AlertRuleFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$AlertRulePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>
    >;

    /**
     * Create a AlertRule.
     * @param {AlertRuleCreateArgs} args - Arguments to create a AlertRule.
     * @example
     * // Create one AlertRule
     * const AlertRule = await prisma.alertRule.create({
     *   data: {
     *     // ... data to create a AlertRule
     *   }
     * })
     *
     */
    create<T extends AlertRuleCreateArgs>(
      args: SelectSubset<T, AlertRuleCreateArgs<ExtArgs>>,
    ): Prisma__AlertRuleClient<
      $Result.GetResult<Prisma.$AlertRulePayload<ExtArgs>, T, "create", GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many AlertRules.
     * @param {AlertRuleCreateManyArgs} args - Arguments to create many AlertRules.
     * @example
     * // Create many AlertRules
     * const alertRule = await prisma.alertRule.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends AlertRuleCreateManyArgs>(
      args?: SelectSubset<T, AlertRuleCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many AlertRules and returns the data saved in the database.
     * @param {AlertRuleCreateManyAndReturnArgs} args - Arguments to create many AlertRules.
     * @example
     * // Create many AlertRules
     * const alertRule = await prisma.alertRule.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many AlertRules and only return the `id`
     * const alertRuleWithIdOnly = await prisma.alertRule.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends AlertRuleCreateManyAndReturnArgs>(
      args?: SelectSubset<T, AlertRuleCreateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$AlertRulePayload<ExtArgs>,
        T,
        "createManyAndReturn",
        GlobalOmitOptions
      >
    >;

    /**
     * Delete a AlertRule.
     * @param {AlertRuleDeleteArgs} args - Arguments to delete one AlertRule.
     * @example
     * // Delete one AlertRule
     * const AlertRule = await prisma.alertRule.delete({
     *   where: {
     *     // ... filter to delete one AlertRule
     *   }
     * })
     *
     */
    delete<T extends AlertRuleDeleteArgs>(
      args: SelectSubset<T, AlertRuleDeleteArgs<ExtArgs>>,
    ): Prisma__AlertRuleClient<
      $Result.GetResult<Prisma.$AlertRulePayload<ExtArgs>, T, "delete", GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one AlertRule.
     * @param {AlertRuleUpdateArgs} args - Arguments to update one AlertRule.
     * @example
     * // Update one AlertRule
     * const alertRule = await prisma.alertRule.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends AlertRuleUpdateArgs>(
      args: SelectSubset<T, AlertRuleUpdateArgs<ExtArgs>>,
    ): Prisma__AlertRuleClient<
      $Result.GetResult<Prisma.$AlertRulePayload<ExtArgs>, T, "update", GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more AlertRules.
     * @param {AlertRuleDeleteManyArgs} args - Arguments to filter AlertRules to delete.
     * @example
     * // Delete a few AlertRules
     * const { count } = await prisma.alertRule.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends AlertRuleDeleteManyArgs>(
      args?: SelectSubset<T, AlertRuleDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more AlertRules.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlertRuleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AlertRules
     * const alertRule = await prisma.alertRule.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends AlertRuleUpdateManyArgs>(
      args: SelectSubset<T, AlertRuleUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more AlertRules and returns the data updated in the database.
     * @param {AlertRuleUpdateManyAndReturnArgs} args - Arguments to update many AlertRules.
     * @example
     * // Update many AlertRules
     * const alertRule = await prisma.alertRule.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more AlertRules and only return the `id`
     * const alertRuleWithIdOnly = await prisma.alertRule.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends AlertRuleUpdateManyAndReturnArgs>(
      args: SelectSubset<T, AlertRuleUpdateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$AlertRulePayload<ExtArgs>,
        T,
        "updateManyAndReturn",
        GlobalOmitOptions
      >
    >;

    /**
     * Create or update one AlertRule.
     * @param {AlertRuleUpsertArgs} args - Arguments to update or create a AlertRule.
     * @example
     * // Update or create a AlertRule
     * const alertRule = await prisma.alertRule.upsert({
     *   create: {
     *     // ... data to create a AlertRule
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AlertRule we want to update
     *   }
     * })
     */
    upsert<T extends AlertRuleUpsertArgs>(
      args: SelectSubset<T, AlertRuleUpsertArgs<ExtArgs>>,
    ): Prisma__AlertRuleClient<
      $Result.GetResult<Prisma.$AlertRulePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of AlertRules.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlertRuleCountArgs} args - Arguments to filter AlertRules to count.
     * @example
     * // Count the number of AlertRules
     * const count = await prisma.alertRule.count({
     *   where: {
     *     // ... the filter for the AlertRules we want to count
     *   }
     * })
     **/
    count<T extends AlertRuleCountArgs>(
      args?: Subset<T, AlertRuleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<"select", any>
        ? T["select"] extends true
          ? number
          : GetScalarType<T["select"], AlertRuleCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a AlertRule.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlertRuleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends AlertRuleAggregateArgs>(
      args: Subset<T, AlertRuleAggregateArgs>,
    ): Prisma.PrismaPromise<GetAlertRuleAggregateType<T>>;

    /**
     * Group by AlertRule.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlertRuleGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends AlertRuleGroupByArgs,
      HasSelectOrTake extends Or<Extends<"skip", Keys<T>>, Extends<"take", Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AlertRuleGroupByArgs["orderBy"] }
        : { orderBy?: AlertRuleGroupByArgs["orderBy"] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T["orderBy"]>>>,
      ByFields extends MaybeTupleToUnion<T["by"]>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T["having"]>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T["by"] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [Error, "Field ", P, ` in "having" needs to be provided in "by"`];
            }[HavingFields]
          : "take" extends Keys<T>
            ? "orderBy" extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : "skip" extends Keys<T>
              ? "orderBy" extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, AlertRuleGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors ? GetAlertRuleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the AlertRule model
     */
    readonly fields: AlertRuleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AlertRule.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AlertRuleClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    monitor<T extends MonitorDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, MonitorDefaultArgs<ExtArgs>>,
    ): Prisma__MonitorClient<
      | $Result.GetResult<
          Prisma.$MonitorPayload<ExtArgs>,
          T,
          "findUniqueOrThrow",
          GlobalOmitOptions
        >
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    channels<T extends AlertRule$channelsArgs<ExtArgs> = {}>(
      args?: Subset<T, AlertRule$channelsArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$NotificationChannelPayload<ExtArgs>,
          T,
          "findMany",
          GlobalOmitOptions
        >
      | Null
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the AlertRule model
   */
  interface AlertRuleFieldRefs {
    readonly id: FieldRef<"AlertRule", "String">;
    readonly monitorId: FieldRef<"AlertRule", "String">;
    readonly trigger: FieldRef<"AlertRule", "AlertTrigger">;
    readonly threshold: FieldRef<"AlertRule", "Int">;
    readonly comparison: FieldRef<"AlertRule", "ComparisonOperator">;
    readonly targetStatus: FieldRef<"AlertRule", "MonitorStatus">;
    readonly enabled: FieldRef<"AlertRule", "Boolean">;
    readonly createdAt: FieldRef<"AlertRule", "DateTime">;
    readonly updatedAt: FieldRef<"AlertRule", "DateTime">;
  }

  // Custom InputTypes
  /**
   * AlertRule findUnique
   */
  export type AlertRuleFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AlertRule
     */
    select?: AlertRuleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AlertRule
     */
    omit?: AlertRuleOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlertRuleInclude<ExtArgs> | null;
    /**
     * Filter, which AlertRule to fetch.
     */
    where: AlertRuleWhereUniqueInput;
  };

  /**
   * AlertRule findUniqueOrThrow
   */
  export type AlertRuleFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AlertRule
     */
    select?: AlertRuleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AlertRule
     */
    omit?: AlertRuleOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlertRuleInclude<ExtArgs> | null;
    /**
     * Filter, which AlertRule to fetch.
     */
    where: AlertRuleWhereUniqueInput;
  };

  /**
   * AlertRule findFirst
   */
  export type AlertRuleFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AlertRule
     */
    select?: AlertRuleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AlertRule
     */
    omit?: AlertRuleOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlertRuleInclude<ExtArgs> | null;
    /**
     * Filter, which AlertRule to fetch.
     */
    where?: AlertRuleWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AlertRules to fetch.
     */
    orderBy?: AlertRuleOrderByWithRelationInput | AlertRuleOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for AlertRules.
     */
    cursor?: AlertRuleWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AlertRules from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AlertRules.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of AlertRules.
     */
    distinct?: AlertRuleScalarFieldEnum | AlertRuleScalarFieldEnum[];
  };

  /**
   * AlertRule findFirstOrThrow
   */
  export type AlertRuleFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AlertRule
     */
    select?: AlertRuleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AlertRule
     */
    omit?: AlertRuleOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlertRuleInclude<ExtArgs> | null;
    /**
     * Filter, which AlertRule to fetch.
     */
    where?: AlertRuleWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AlertRules to fetch.
     */
    orderBy?: AlertRuleOrderByWithRelationInput | AlertRuleOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for AlertRules.
     */
    cursor?: AlertRuleWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AlertRules from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AlertRules.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of AlertRules.
     */
    distinct?: AlertRuleScalarFieldEnum | AlertRuleScalarFieldEnum[];
  };

  /**
   * AlertRule findMany
   */
  export type AlertRuleFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AlertRule
     */
    select?: AlertRuleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AlertRule
     */
    omit?: AlertRuleOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlertRuleInclude<ExtArgs> | null;
    /**
     * Filter, which AlertRules to fetch.
     */
    where?: AlertRuleWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AlertRules to fetch.
     */
    orderBy?: AlertRuleOrderByWithRelationInput | AlertRuleOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing AlertRules.
     */
    cursor?: AlertRuleWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AlertRules from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AlertRules.
     */
    skip?: number;
    distinct?: AlertRuleScalarFieldEnum | AlertRuleScalarFieldEnum[];
  };

  /**
   * AlertRule create
   */
  export type AlertRuleCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AlertRule
     */
    select?: AlertRuleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AlertRule
     */
    omit?: AlertRuleOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlertRuleInclude<ExtArgs> | null;
    /**
     * The data needed to create a AlertRule.
     */
    data: XOR<AlertRuleCreateInput, AlertRuleUncheckedCreateInput>;
  };

  /**
   * AlertRule createMany
   */
  export type AlertRuleCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many AlertRules.
     */
    data: AlertRuleCreateManyInput | AlertRuleCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * AlertRule createManyAndReturn
   */
  export type AlertRuleCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AlertRule
     */
    select?: AlertRuleSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the AlertRule
     */
    omit?: AlertRuleOmit<ExtArgs> | null;
    /**
     * The data used to create many AlertRules.
     */
    data: AlertRuleCreateManyInput | AlertRuleCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlertRuleIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * AlertRule update
   */
  export type AlertRuleUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AlertRule
     */
    select?: AlertRuleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AlertRule
     */
    omit?: AlertRuleOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlertRuleInclude<ExtArgs> | null;
    /**
     * The data needed to update a AlertRule.
     */
    data: XOR<AlertRuleUpdateInput, AlertRuleUncheckedUpdateInput>;
    /**
     * Choose, which AlertRule to update.
     */
    where: AlertRuleWhereUniqueInput;
  };

  /**
   * AlertRule updateMany
   */
  export type AlertRuleUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update AlertRules.
     */
    data: XOR<AlertRuleUpdateManyMutationInput, AlertRuleUncheckedUpdateManyInput>;
    /**
     * Filter which AlertRules to update
     */
    where?: AlertRuleWhereInput;
    /**
     * Limit how many AlertRules to update.
     */
    limit?: number;
  };

  /**
   * AlertRule updateManyAndReturn
   */
  export type AlertRuleUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AlertRule
     */
    select?: AlertRuleSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the AlertRule
     */
    omit?: AlertRuleOmit<ExtArgs> | null;
    /**
     * The data used to update AlertRules.
     */
    data: XOR<AlertRuleUpdateManyMutationInput, AlertRuleUncheckedUpdateManyInput>;
    /**
     * Filter which AlertRules to update
     */
    where?: AlertRuleWhereInput;
    /**
     * Limit how many AlertRules to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlertRuleIncludeUpdateManyAndReturn<ExtArgs> | null;
  };

  /**
   * AlertRule upsert
   */
  export type AlertRuleUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AlertRule
     */
    select?: AlertRuleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AlertRule
     */
    omit?: AlertRuleOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlertRuleInclude<ExtArgs> | null;
    /**
     * The filter to search for the AlertRule to update in case it exists.
     */
    where: AlertRuleWhereUniqueInput;
    /**
     * In case the AlertRule found by the `where` argument doesn't exist, create a new AlertRule with this data.
     */
    create: XOR<AlertRuleCreateInput, AlertRuleUncheckedCreateInput>;
    /**
     * In case the AlertRule was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AlertRuleUpdateInput, AlertRuleUncheckedUpdateInput>;
  };

  /**
   * AlertRule delete
   */
  export type AlertRuleDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AlertRule
     */
    select?: AlertRuleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AlertRule
     */
    omit?: AlertRuleOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlertRuleInclude<ExtArgs> | null;
    /**
     * Filter which AlertRule to delete.
     */
    where: AlertRuleWhereUniqueInput;
  };

  /**
   * AlertRule deleteMany
   */
  export type AlertRuleDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which AlertRules to delete
     */
    where?: AlertRuleWhereInput;
    /**
     * Limit how many AlertRules to delete.
     */
    limit?: number;
  };

  /**
   * AlertRule.channels
   */
  export type AlertRule$channelsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the NotificationChannel
     */
    select?: NotificationChannelSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the NotificationChannel
     */
    omit?: NotificationChannelOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationChannelInclude<ExtArgs> | null;
    where?: NotificationChannelWhereInput;
    orderBy?:
      | NotificationChannelOrderByWithRelationInput
      | NotificationChannelOrderByWithRelationInput[];
    cursor?: NotificationChannelWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: NotificationChannelScalarFieldEnum | NotificationChannelScalarFieldEnum[];
  };

  /**
   * AlertRule without action
   */
  export type AlertRuleDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AlertRule
     */
    select?: AlertRuleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AlertRule
     */
    omit?: AlertRuleOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlertRuleInclude<ExtArgs> | null;
  };

  /**
   * Model Monitor
   */

  export type AggregateMonitor = {
    _count: MonitorCountAggregateOutputType | null;
    _avg: MonitorAvgAggregateOutputType | null;
    _sum: MonitorSumAggregateOutputType | null;
    _min: MonitorMinAggregateOutputType | null;
    _max: MonitorMaxAggregateOutputType | null;
  };

  export type MonitorAvgAggregateOutputType = {
    interval: number | null;
    timeout: number | null;
    alertThreshold: number | null;
  };

  export type MonitorSumAggregateOutputType = {
    interval: number | null;
    timeout: number | null;
    alertThreshold: number | null;
  };

  export type MonitorMinAggregateOutputType = {
    id: string | null;
    name: string | null;
    url: string | null;
    type: $Enums.MonitorType | null;
    interval: number | null;
    timeout: number | null;
    status: $Enums.MonitorStatus | null;
    userId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    nextCheck: Date | null;
    lastCheck: Date | null;
    checkRegions: string | null;
    alertThreshold: number | null;
  };

  export type MonitorMaxAggregateOutputType = {
    id: string | null;
    name: string | null;
    url: string | null;
    type: $Enums.MonitorType | null;
    interval: number | null;
    timeout: number | null;
    status: $Enums.MonitorStatus | null;
    userId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    nextCheck: Date | null;
    lastCheck: Date | null;
    checkRegions: string | null;
    alertThreshold: number | null;
  };

  export type MonitorCountAggregateOutputType = {
    id: number;
    name: number;
    url: number;
    type: number;
    interval: number;
    timeout: number;
    status: number;
    userId: number;
    createdAt: number;
    updatedAt: number;
    nextCheck: number;
    lastCheck: number;
    checkRegions: number;
    alertThreshold: number;
    _all: number;
  };

  export type MonitorAvgAggregateInputType = {
    interval?: true;
    timeout?: true;
    alertThreshold?: true;
  };

  export type MonitorSumAggregateInputType = {
    interval?: true;
    timeout?: true;
    alertThreshold?: true;
  };

  export type MonitorMinAggregateInputType = {
    id?: true;
    name?: true;
    url?: true;
    type?: true;
    interval?: true;
    timeout?: true;
    status?: true;
    userId?: true;
    createdAt?: true;
    updatedAt?: true;
    nextCheck?: true;
    lastCheck?: true;
    checkRegions?: true;
    alertThreshold?: true;
  };

  export type MonitorMaxAggregateInputType = {
    id?: true;
    name?: true;
    url?: true;
    type?: true;
    interval?: true;
    timeout?: true;
    status?: true;
    userId?: true;
    createdAt?: true;
    updatedAt?: true;
    nextCheck?: true;
    lastCheck?: true;
    checkRegions?: true;
    alertThreshold?: true;
  };

  export type MonitorCountAggregateInputType = {
    id?: true;
    name?: true;
    url?: true;
    type?: true;
    interval?: true;
    timeout?: true;
    status?: true;
    userId?: true;
    createdAt?: true;
    updatedAt?: true;
    nextCheck?: true;
    lastCheck?: true;
    checkRegions?: true;
    alertThreshold?: true;
    _all?: true;
  };

  export type MonitorAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Monitor to aggregate.
     */
    where?: MonitorWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Monitors to fetch.
     */
    orderBy?: MonitorOrderByWithRelationInput | MonitorOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: MonitorWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Monitors from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Monitors.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Monitors
     **/
    _count?: true | MonitorCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: MonitorAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: MonitorSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: MonitorMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: MonitorMaxAggregateInputType;
  };

  export type GetMonitorAggregateType<T extends MonitorAggregateArgs> = {
    [P in keyof T & keyof AggregateMonitor]: P extends "_count" | "count"
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMonitor[P]>
      : GetScalarType<T[P], AggregateMonitor[P]>;
  };

  export type MonitorGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: MonitorWhereInput;
    orderBy?: MonitorOrderByWithAggregationInput | MonitorOrderByWithAggregationInput[];
    by: MonitorScalarFieldEnum[] | MonitorScalarFieldEnum;
    having?: MonitorScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: MonitorCountAggregateInputType | true;
    _avg?: MonitorAvgAggregateInputType;
    _sum?: MonitorSumAggregateInputType;
    _min?: MonitorMinAggregateInputType;
    _max?: MonitorMaxAggregateInputType;
  };

  export type MonitorGroupByOutputType = {
    id: string;
    name: string;
    url: string;
    type: $Enums.MonitorType;
    interval: number;
    timeout: number;
    status: $Enums.MonitorStatus;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    nextCheck: Date | null;
    lastCheck: Date | null;
    checkRegions: string | null;
    alertThreshold: number;
    _count: MonitorCountAggregateOutputType | null;
    _avg: MonitorAvgAggregateOutputType | null;
    _sum: MonitorSumAggregateOutputType | null;
    _min: MonitorMinAggregateOutputType | null;
    _max: MonitorMaxAggregateOutputType | null;
  };

  type GetMonitorGroupByPayload<T extends MonitorGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MonitorGroupByOutputType, T["by"]> & {
        [P in keyof T & keyof MonitorGroupByOutputType]: P extends "_count"
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], MonitorGroupByOutputType[P]>
          : GetScalarType<T[P], MonitorGroupByOutputType[P]>;
      }
    >
  >;

  export type MonitorSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetSelect<
      {
        id?: boolean;
        name?: boolean;
        url?: boolean;
        type?: boolean;
        interval?: boolean;
        timeout?: boolean;
        status?: boolean;
        userId?: boolean;
        createdAt?: boolean;
        updatedAt?: boolean;
        nextCheck?: boolean;
        lastCheck?: boolean;
        checkRegions?: boolean;
        alertThreshold?: boolean;
        user?: boolean | UserDefaultArgs<ExtArgs>;
        events?: boolean | Monitor$eventsArgs<ExtArgs>;
        maintenanceWindows?: boolean | Monitor$maintenanceWindowsArgs<ExtArgs>;
        alertRules?: boolean | Monitor$alertRulesArgs<ExtArgs>;
        incidents?: boolean | Monitor$incidentsArgs<ExtArgs>;
        regionalIncidents?: boolean | Monitor$regionalIncidentsArgs<ExtArgs>;
        _count?: boolean | MonitorCountOutputTypeDefaultArgs<ExtArgs>;
      },
      ExtArgs["result"]["monitor"]
    >;

  export type MonitorSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      name?: boolean;
      url?: boolean;
      type?: boolean;
      interval?: boolean;
      timeout?: boolean;
      status?: boolean;
      userId?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      nextCheck?: boolean;
      lastCheck?: boolean;
      checkRegions?: boolean;
      alertThreshold?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs["result"]["monitor"]
  >;

  export type MonitorSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      name?: boolean;
      url?: boolean;
      type?: boolean;
      interval?: boolean;
      timeout?: boolean;
      status?: boolean;
      userId?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      nextCheck?: boolean;
      lastCheck?: boolean;
      checkRegions?: boolean;
      alertThreshold?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs["result"]["monitor"]
  >;

  export type MonitorSelectScalar = {
    id?: boolean;
    name?: boolean;
    url?: boolean;
    type?: boolean;
    interval?: boolean;
    timeout?: boolean;
    status?: boolean;
    userId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    nextCheck?: boolean;
    lastCheck?: boolean;
    checkRegions?: boolean;
    alertThreshold?: boolean;
  };

  export type MonitorOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetOmit<
      | "id"
      | "name"
      | "url"
      | "type"
      | "interval"
      | "timeout"
      | "status"
      | "userId"
      | "createdAt"
      | "updatedAt"
      | "nextCheck"
      | "lastCheck"
      | "checkRegions"
      | "alertThreshold",
      ExtArgs["result"]["monitor"]
    >;
  export type MonitorInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
    events?: boolean | Monitor$eventsArgs<ExtArgs>;
    maintenanceWindows?: boolean | Monitor$maintenanceWindowsArgs<ExtArgs>;
    alertRules?: boolean | Monitor$alertRulesArgs<ExtArgs>;
    incidents?: boolean | Monitor$incidentsArgs<ExtArgs>;
    regionalIncidents?: boolean | Monitor$regionalIncidentsArgs<ExtArgs>;
    _count?: boolean | MonitorCountOutputTypeDefaultArgs<ExtArgs>;
  };
  export type MonitorIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
  };
  export type MonitorIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
  };

  export type $MonitorPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      name: "Monitor";
      objects: {
        user: Prisma.$UserPayload<ExtArgs>;
        events: Prisma.$MonitorEventPayload<ExtArgs>[];
        maintenanceWindows: Prisma.$MaintenanceWindowPayload<ExtArgs>[];
        alertRules: Prisma.$AlertRulePayload<ExtArgs>[];
        incidents: Prisma.$IncidentPayload<ExtArgs>[];
        regionalIncidents: Prisma.$RegionalIncidentPayload<ExtArgs>[];
      };
      scalars: $Extensions.GetPayloadResult<
        {
          id: string;
          name: string;
          url: string;
          type: $Enums.MonitorType;
          interval: number;
          timeout: number;
          status: $Enums.MonitorStatus;
          userId: string;
          createdAt: Date;
          updatedAt: Date;
          nextCheck: Date | null;
          lastCheck: Date | null;
          checkRegions: string | null;
          alertThreshold: number;
        },
        ExtArgs["result"]["monitor"]
      >;
      composites: {};
    };

  type MonitorGetPayload<S extends boolean | null | undefined | MonitorDefaultArgs> =
    $Result.GetResult<Prisma.$MonitorPayload, S>;

  type MonitorCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = Omit<
    MonitorFindManyArgs,
    "select" | "include" | "distinct" | "omit"
  > & {
    select?: MonitorCountAggregateInputType | true;
  };

  export interface MonitorDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>["model"]["Monitor"]; meta: { name: "Monitor" } };
    /**
     * Find zero or one Monitor that matches the filter.
     * @param {MonitorFindUniqueArgs} args - Arguments to find a Monitor
     * @example
     * // Get one Monitor
     * const monitor = await prisma.monitor.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MonitorFindUniqueArgs>(
      args: SelectSubset<T, MonitorFindUniqueArgs<ExtArgs>>,
    ): Prisma__MonitorClient<
      $Result.GetResult<Prisma.$MonitorPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one Monitor that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MonitorFindUniqueOrThrowArgs} args - Arguments to find a Monitor
     * @example
     * // Get one Monitor
     * const monitor = await prisma.monitor.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MonitorFindUniqueOrThrowArgs>(
      args: SelectSubset<T, MonitorFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__MonitorClient<
      $Result.GetResult<Prisma.$MonitorPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Monitor that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MonitorFindFirstArgs} args - Arguments to find a Monitor
     * @example
     * // Get one Monitor
     * const monitor = await prisma.monitor.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MonitorFindFirstArgs>(
      args?: SelectSubset<T, MonitorFindFirstArgs<ExtArgs>>,
    ): Prisma__MonitorClient<
      $Result.GetResult<Prisma.$MonitorPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Monitor that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MonitorFindFirstOrThrowArgs} args - Arguments to find a Monitor
     * @example
     * // Get one Monitor
     * const monitor = await prisma.monitor.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MonitorFindFirstOrThrowArgs>(
      args?: SelectSubset<T, MonitorFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__MonitorClient<
      $Result.GetResult<Prisma.$MonitorPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more Monitors that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MonitorFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Monitors
     * const monitors = await prisma.monitor.findMany()
     *
     * // Get first 10 Monitors
     * const monitors = await prisma.monitor.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const monitorWithIdOnly = await prisma.monitor.findMany({ select: { id: true } })
     *
     */
    findMany<T extends MonitorFindManyArgs>(
      args?: SelectSubset<T, MonitorFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$MonitorPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>
    >;

    /**
     * Create a Monitor.
     * @param {MonitorCreateArgs} args - Arguments to create a Monitor.
     * @example
     * // Create one Monitor
     * const Monitor = await prisma.monitor.create({
     *   data: {
     *     // ... data to create a Monitor
     *   }
     * })
     *
     */
    create<T extends MonitorCreateArgs>(
      args: SelectSubset<T, MonitorCreateArgs<ExtArgs>>,
    ): Prisma__MonitorClient<
      $Result.GetResult<Prisma.$MonitorPayload<ExtArgs>, T, "create", GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many Monitors.
     * @param {MonitorCreateManyArgs} args - Arguments to create many Monitors.
     * @example
     * // Create many Monitors
     * const monitor = await prisma.monitor.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends MonitorCreateManyArgs>(
      args?: SelectSubset<T, MonitorCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many Monitors and returns the data saved in the database.
     * @param {MonitorCreateManyAndReturnArgs} args - Arguments to create many Monitors.
     * @example
     * // Create many Monitors
     * const monitor = await prisma.monitor.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Monitors and only return the `id`
     * const monitorWithIdOnly = await prisma.monitor.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends MonitorCreateManyAndReturnArgs>(
      args?: SelectSubset<T, MonitorCreateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$MonitorPayload<ExtArgs>,
        T,
        "createManyAndReturn",
        GlobalOmitOptions
      >
    >;

    /**
     * Delete a Monitor.
     * @param {MonitorDeleteArgs} args - Arguments to delete one Monitor.
     * @example
     * // Delete one Monitor
     * const Monitor = await prisma.monitor.delete({
     *   where: {
     *     // ... filter to delete one Monitor
     *   }
     * })
     *
     */
    delete<T extends MonitorDeleteArgs>(
      args: SelectSubset<T, MonitorDeleteArgs<ExtArgs>>,
    ): Prisma__MonitorClient<
      $Result.GetResult<Prisma.$MonitorPayload<ExtArgs>, T, "delete", GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one Monitor.
     * @param {MonitorUpdateArgs} args - Arguments to update one Monitor.
     * @example
     * // Update one Monitor
     * const monitor = await prisma.monitor.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends MonitorUpdateArgs>(
      args: SelectSubset<T, MonitorUpdateArgs<ExtArgs>>,
    ): Prisma__MonitorClient<
      $Result.GetResult<Prisma.$MonitorPayload<ExtArgs>, T, "update", GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more Monitors.
     * @param {MonitorDeleteManyArgs} args - Arguments to filter Monitors to delete.
     * @example
     * // Delete a few Monitors
     * const { count } = await prisma.monitor.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends MonitorDeleteManyArgs>(
      args?: SelectSubset<T, MonitorDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Monitors.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MonitorUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Monitors
     * const monitor = await prisma.monitor.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends MonitorUpdateManyArgs>(
      args: SelectSubset<T, MonitorUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Monitors and returns the data updated in the database.
     * @param {MonitorUpdateManyAndReturnArgs} args - Arguments to update many Monitors.
     * @example
     * // Update many Monitors
     * const monitor = await prisma.monitor.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Monitors and only return the `id`
     * const monitorWithIdOnly = await prisma.monitor.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends MonitorUpdateManyAndReturnArgs>(
      args: SelectSubset<T, MonitorUpdateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$MonitorPayload<ExtArgs>,
        T,
        "updateManyAndReturn",
        GlobalOmitOptions
      >
    >;

    /**
     * Create or update one Monitor.
     * @param {MonitorUpsertArgs} args - Arguments to update or create a Monitor.
     * @example
     * // Update or create a Monitor
     * const monitor = await prisma.monitor.upsert({
     *   create: {
     *     // ... data to create a Monitor
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Monitor we want to update
     *   }
     * })
     */
    upsert<T extends MonitorUpsertArgs>(
      args: SelectSubset<T, MonitorUpsertArgs<ExtArgs>>,
    ): Prisma__MonitorClient<
      $Result.GetResult<Prisma.$MonitorPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of Monitors.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MonitorCountArgs} args - Arguments to filter Monitors to count.
     * @example
     * // Count the number of Monitors
     * const count = await prisma.monitor.count({
     *   where: {
     *     // ... the filter for the Monitors we want to count
     *   }
     * })
     **/
    count<T extends MonitorCountArgs>(
      args?: Subset<T, MonitorCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<"select", any>
        ? T["select"] extends true
          ? number
          : GetScalarType<T["select"], MonitorCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a Monitor.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MonitorAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends MonitorAggregateArgs>(
      args: Subset<T, MonitorAggregateArgs>,
    ): Prisma.PrismaPromise<GetMonitorAggregateType<T>>;

    /**
     * Group by Monitor.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MonitorGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends MonitorGroupByArgs,
      HasSelectOrTake extends Or<Extends<"skip", Keys<T>>, Extends<"take", Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MonitorGroupByArgs["orderBy"] }
        : { orderBy?: MonitorGroupByArgs["orderBy"] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T["orderBy"]>>>,
      ByFields extends MaybeTupleToUnion<T["by"]>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T["having"]>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T["by"] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [Error, "Field ", P, ` in "having" needs to be provided in "by"`];
            }[HavingFields]
          : "take" extends Keys<T>
            ? "orderBy" extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : "skip" extends Keys<T>
              ? "orderBy" extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, MonitorGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors ? GetMonitorGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Monitor model
     */
    readonly fields: MonitorFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Monitor.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MonitorClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    user<T extends UserDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, UserDefaultArgs<ExtArgs>>,
    ): Prisma__UserClient<
      | $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    events<T extends Monitor$eventsArgs<ExtArgs> = {}>(
      args?: Subset<T, Monitor$eventsArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      | $Result.GetResult<Prisma.$MonitorEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>
      | Null
    >;
    maintenanceWindows<T extends Monitor$maintenanceWindowsArgs<ExtArgs> = {}>(
      args?: Subset<T, Monitor$maintenanceWindowsArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$MaintenanceWindowPayload<ExtArgs>,
          T,
          "findMany",
          GlobalOmitOptions
        >
      | Null
    >;
    alertRules<T extends Monitor$alertRulesArgs<ExtArgs> = {}>(
      args?: Subset<T, Monitor$alertRulesArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$AlertRulePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null
    >;
    incidents<T extends Monitor$incidentsArgs<ExtArgs> = {}>(
      args?: Subset<T, Monitor$incidentsArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$IncidentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null
    >;
    regionalIncidents<T extends Monitor$regionalIncidentsArgs<ExtArgs> = {}>(
      args?: Subset<T, Monitor$regionalIncidentsArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$RegionalIncidentPayload<ExtArgs>,
          T,
          "findMany",
          GlobalOmitOptions
        >
      | Null
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the Monitor model
   */
  interface MonitorFieldRefs {
    readonly id: FieldRef<"Monitor", "String">;
    readonly name: FieldRef<"Monitor", "String">;
    readonly url: FieldRef<"Monitor", "String">;
    readonly type: FieldRef<"Monitor", "MonitorType">;
    readonly interval: FieldRef<"Monitor", "Int">;
    readonly timeout: FieldRef<"Monitor", "Int">;
    readonly status: FieldRef<"Monitor", "MonitorStatus">;
    readonly userId: FieldRef<"Monitor", "String">;
    readonly createdAt: FieldRef<"Monitor", "DateTime">;
    readonly updatedAt: FieldRef<"Monitor", "DateTime">;
    readonly nextCheck: FieldRef<"Monitor", "DateTime">;
    readonly lastCheck: FieldRef<"Monitor", "DateTime">;
    readonly checkRegions: FieldRef<"Monitor", "String">;
    readonly alertThreshold: FieldRef<"Monitor", "Int">;
  }

  // Custom InputTypes
  /**
   * Monitor findUnique
   */
  export type MonitorFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Monitor
     */
    select?: MonitorSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Monitor
     */
    omit?: MonitorOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MonitorInclude<ExtArgs> | null;
    /**
     * Filter, which Monitor to fetch.
     */
    where: MonitorWhereUniqueInput;
  };

  /**
   * Monitor findUniqueOrThrow
   */
  export type MonitorFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Monitor
     */
    select?: MonitorSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Monitor
     */
    omit?: MonitorOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MonitorInclude<ExtArgs> | null;
    /**
     * Filter, which Monitor to fetch.
     */
    where: MonitorWhereUniqueInput;
  };

  /**
   * Monitor findFirst
   */
  export type MonitorFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Monitor
     */
    select?: MonitorSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Monitor
     */
    omit?: MonitorOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MonitorInclude<ExtArgs> | null;
    /**
     * Filter, which Monitor to fetch.
     */
    where?: MonitorWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Monitors to fetch.
     */
    orderBy?: MonitorOrderByWithRelationInput | MonitorOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Monitors.
     */
    cursor?: MonitorWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Monitors from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Monitors.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Monitors.
     */
    distinct?: MonitorScalarFieldEnum | MonitorScalarFieldEnum[];
  };

  /**
   * Monitor findFirstOrThrow
   */
  export type MonitorFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Monitor
     */
    select?: MonitorSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Monitor
     */
    omit?: MonitorOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MonitorInclude<ExtArgs> | null;
    /**
     * Filter, which Monitor to fetch.
     */
    where?: MonitorWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Monitors to fetch.
     */
    orderBy?: MonitorOrderByWithRelationInput | MonitorOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Monitors.
     */
    cursor?: MonitorWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Monitors from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Monitors.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Monitors.
     */
    distinct?: MonitorScalarFieldEnum | MonitorScalarFieldEnum[];
  };

  /**
   * Monitor findMany
   */
  export type MonitorFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Monitor
     */
    select?: MonitorSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Monitor
     */
    omit?: MonitorOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MonitorInclude<ExtArgs> | null;
    /**
     * Filter, which Monitors to fetch.
     */
    where?: MonitorWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Monitors to fetch.
     */
    orderBy?: MonitorOrderByWithRelationInput | MonitorOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Monitors.
     */
    cursor?: MonitorWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Monitors from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Monitors.
     */
    skip?: number;
    distinct?: MonitorScalarFieldEnum | MonitorScalarFieldEnum[];
  };

  /**
   * Monitor create
   */
  export type MonitorCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Monitor
     */
    select?: MonitorSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Monitor
     */
    omit?: MonitorOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MonitorInclude<ExtArgs> | null;
    /**
     * The data needed to create a Monitor.
     */
    data: XOR<MonitorCreateInput, MonitorUncheckedCreateInput>;
  };

  /**
   * Monitor createMany
   */
  export type MonitorCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many Monitors.
     */
    data: MonitorCreateManyInput | MonitorCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * Monitor createManyAndReturn
   */
  export type MonitorCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Monitor
     */
    select?: MonitorSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Monitor
     */
    omit?: MonitorOmit<ExtArgs> | null;
    /**
     * The data used to create many Monitors.
     */
    data: MonitorCreateManyInput | MonitorCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MonitorIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * Monitor update
   */
  export type MonitorUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Monitor
     */
    select?: MonitorSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Monitor
     */
    omit?: MonitorOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MonitorInclude<ExtArgs> | null;
    /**
     * The data needed to update a Monitor.
     */
    data: XOR<MonitorUpdateInput, MonitorUncheckedUpdateInput>;
    /**
     * Choose, which Monitor to update.
     */
    where: MonitorWhereUniqueInput;
  };

  /**
   * Monitor updateMany
   */
  export type MonitorUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update Monitors.
     */
    data: XOR<MonitorUpdateManyMutationInput, MonitorUncheckedUpdateManyInput>;
    /**
     * Filter which Monitors to update
     */
    where?: MonitorWhereInput;
    /**
     * Limit how many Monitors to update.
     */
    limit?: number;
  };

  /**
   * Monitor updateManyAndReturn
   */
  export type MonitorUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Monitor
     */
    select?: MonitorSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Monitor
     */
    omit?: MonitorOmit<ExtArgs> | null;
    /**
     * The data used to update Monitors.
     */
    data: XOR<MonitorUpdateManyMutationInput, MonitorUncheckedUpdateManyInput>;
    /**
     * Filter which Monitors to update
     */
    where?: MonitorWhereInput;
    /**
     * Limit how many Monitors to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MonitorIncludeUpdateManyAndReturn<ExtArgs> | null;
  };

  /**
   * Monitor upsert
   */
  export type MonitorUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Monitor
     */
    select?: MonitorSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Monitor
     */
    omit?: MonitorOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MonitorInclude<ExtArgs> | null;
    /**
     * The filter to search for the Monitor to update in case it exists.
     */
    where: MonitorWhereUniqueInput;
    /**
     * In case the Monitor found by the `where` argument doesn't exist, create a new Monitor with this data.
     */
    create: XOR<MonitorCreateInput, MonitorUncheckedCreateInput>;
    /**
     * In case the Monitor was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MonitorUpdateInput, MonitorUncheckedUpdateInput>;
  };

  /**
   * Monitor delete
   */
  export type MonitorDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Monitor
     */
    select?: MonitorSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Monitor
     */
    omit?: MonitorOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MonitorInclude<ExtArgs> | null;
    /**
     * Filter which Monitor to delete.
     */
    where: MonitorWhereUniqueInput;
  };

  /**
   * Monitor deleteMany
   */
  export type MonitorDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Monitors to delete
     */
    where?: MonitorWhereInput;
    /**
     * Limit how many Monitors to delete.
     */
    limit?: number;
  };

  /**
   * Monitor.events
   */
  export type Monitor$eventsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the MonitorEvent
     */
    select?: MonitorEventSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MonitorEvent
     */
    omit?: MonitorEventOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MonitorEventInclude<ExtArgs> | null;
    where?: MonitorEventWhereInput;
    orderBy?: MonitorEventOrderByWithRelationInput | MonitorEventOrderByWithRelationInput[];
    cursor?: MonitorEventWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: MonitorEventScalarFieldEnum | MonitorEventScalarFieldEnum[];
  };

  /**
   * Monitor.maintenanceWindows
   */
  export type Monitor$maintenanceWindowsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the MaintenanceWindow
     */
    select?: MaintenanceWindowSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MaintenanceWindow
     */
    omit?: MaintenanceWindowOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaintenanceWindowInclude<ExtArgs> | null;
    where?: MaintenanceWindowWhereInput;
    orderBy?:
      | MaintenanceWindowOrderByWithRelationInput
      | MaintenanceWindowOrderByWithRelationInput[];
    cursor?: MaintenanceWindowWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: MaintenanceWindowScalarFieldEnum | MaintenanceWindowScalarFieldEnum[];
  };

  /**
   * Monitor.alertRules
   */
  export type Monitor$alertRulesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AlertRule
     */
    select?: AlertRuleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AlertRule
     */
    omit?: AlertRuleOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlertRuleInclude<ExtArgs> | null;
    where?: AlertRuleWhereInput;
    orderBy?: AlertRuleOrderByWithRelationInput | AlertRuleOrderByWithRelationInput[];
    cursor?: AlertRuleWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: AlertRuleScalarFieldEnum | AlertRuleScalarFieldEnum[];
  };

  /**
   * Monitor.incidents
   */
  export type Monitor$incidentsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Incident
     */
    select?: IncidentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Incident
     */
    omit?: IncidentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IncidentInclude<ExtArgs> | null;
    where?: IncidentWhereInput;
    orderBy?: IncidentOrderByWithRelationInput | IncidentOrderByWithRelationInput[];
    cursor?: IncidentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: IncidentScalarFieldEnum | IncidentScalarFieldEnum[];
  };

  /**
   * Monitor.regionalIncidents
   */
  export type Monitor$regionalIncidentsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the RegionalIncident
     */
    select?: RegionalIncidentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the RegionalIncident
     */
    omit?: RegionalIncidentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RegionalIncidentInclude<ExtArgs> | null;
    where?: RegionalIncidentWhereInput;
    orderBy?: RegionalIncidentOrderByWithRelationInput | RegionalIncidentOrderByWithRelationInput[];
    cursor?: RegionalIncidentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: RegionalIncidentScalarFieldEnum | RegionalIncidentScalarFieldEnum[];
  };

  /**
   * Monitor without action
   */
  export type MonitorDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Monitor
     */
    select?: MonitorSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Monitor
     */
    omit?: MonitorOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MonitorInclude<ExtArgs> | null;
  };

  /**
   * Model MonitorEvent
   */

  export type AggregateMonitorEvent = {
    _count: MonitorEventCountAggregateOutputType | null;
    _avg: MonitorEventAvgAggregateOutputType | null;
    _sum: MonitorEventSumAggregateOutputType | null;
    _min: MonitorEventMinAggregateOutputType | null;
    _max: MonitorEventMaxAggregateOutputType | null;
  };

  export type MonitorEventAvgAggregateOutputType = {
    latency: number | null;
  };

  export type MonitorEventSumAggregateOutputType = {
    latency: number | null;
  };

  export type MonitorEventMinAggregateOutputType = {
    id: string | null;
    monitorId: string | null;
    status: $Enums.MonitorStatus | null;
    latency: number | null;
    errorReason: string | null;
    timestamp: Date | null;
    region: string | null;
  };

  export type MonitorEventMaxAggregateOutputType = {
    id: string | null;
    monitorId: string | null;
    status: $Enums.MonitorStatus | null;
    latency: number | null;
    errorReason: string | null;
    timestamp: Date | null;
    region: string | null;
  };

  export type MonitorEventCountAggregateOutputType = {
    id: number;
    monitorId: number;
    status: number;
    latency: number;
    errorReason: number;
    timestamp: number;
    region: number;
    _all: number;
  };

  export type MonitorEventAvgAggregateInputType = {
    latency?: true;
  };

  export type MonitorEventSumAggregateInputType = {
    latency?: true;
  };

  export type MonitorEventMinAggregateInputType = {
    id?: true;
    monitorId?: true;
    status?: true;
    latency?: true;
    errorReason?: true;
    timestamp?: true;
    region?: true;
  };

  export type MonitorEventMaxAggregateInputType = {
    id?: true;
    monitorId?: true;
    status?: true;
    latency?: true;
    errorReason?: true;
    timestamp?: true;
    region?: true;
  };

  export type MonitorEventCountAggregateInputType = {
    id?: true;
    monitorId?: true;
    status?: true;
    latency?: true;
    errorReason?: true;
    timestamp?: true;
    region?: true;
    _all?: true;
  };

  export type MonitorEventAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which MonitorEvent to aggregate.
     */
    where?: MonitorEventWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of MonitorEvents to fetch.
     */
    orderBy?: MonitorEventOrderByWithRelationInput | MonitorEventOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: MonitorEventWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` MonitorEvents from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` MonitorEvents.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned MonitorEvents
     **/
    _count?: true | MonitorEventCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: MonitorEventAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: MonitorEventSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: MonitorEventMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: MonitorEventMaxAggregateInputType;
  };

  export type GetMonitorEventAggregateType<T extends MonitorEventAggregateArgs> = {
    [P in keyof T & keyof AggregateMonitorEvent]: P extends "_count" | "count"
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMonitorEvent[P]>
      : GetScalarType<T[P], AggregateMonitorEvent[P]>;
  };

  export type MonitorEventGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: MonitorEventWhereInput;
    orderBy?: MonitorEventOrderByWithAggregationInput | MonitorEventOrderByWithAggregationInput[];
    by: MonitorEventScalarFieldEnum[] | MonitorEventScalarFieldEnum;
    having?: MonitorEventScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: MonitorEventCountAggregateInputType | true;
    _avg?: MonitorEventAvgAggregateInputType;
    _sum?: MonitorEventSumAggregateInputType;
    _min?: MonitorEventMinAggregateInputType;
    _max?: MonitorEventMaxAggregateInputType;
  };

  export type MonitorEventGroupByOutputType = {
    id: string;
    monitorId: string;
    status: $Enums.MonitorStatus;
    latency: number;
    errorReason: string | null;
    timestamp: Date;
    region: string | null;
    _count: MonitorEventCountAggregateOutputType | null;
    _avg: MonitorEventAvgAggregateOutputType | null;
    _sum: MonitorEventSumAggregateOutputType | null;
    _min: MonitorEventMinAggregateOutputType | null;
    _max: MonitorEventMaxAggregateOutputType | null;
  };

  type GetMonitorEventGroupByPayload<T extends MonitorEventGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MonitorEventGroupByOutputType, T["by"]> & {
        [P in keyof T & keyof MonitorEventGroupByOutputType]: P extends "_count"
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], MonitorEventGroupByOutputType[P]>
          : GetScalarType<T[P], MonitorEventGroupByOutputType[P]>;
      }
    >
  >;

  export type MonitorEventSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      monitorId?: boolean;
      status?: boolean;
      latency?: boolean;
      errorReason?: boolean;
      timestamp?: boolean;
      region?: boolean;
      monitor?: boolean | MonitorDefaultArgs<ExtArgs>;
    },
    ExtArgs["result"]["monitorEvent"]
  >;

  export type MonitorEventSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      monitorId?: boolean;
      status?: boolean;
      latency?: boolean;
      errorReason?: boolean;
      timestamp?: boolean;
      region?: boolean;
      monitor?: boolean | MonitorDefaultArgs<ExtArgs>;
    },
    ExtArgs["result"]["monitorEvent"]
  >;

  export type MonitorEventSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      monitorId?: boolean;
      status?: boolean;
      latency?: boolean;
      errorReason?: boolean;
      timestamp?: boolean;
      region?: boolean;
      monitor?: boolean | MonitorDefaultArgs<ExtArgs>;
    },
    ExtArgs["result"]["monitorEvent"]
  >;

  export type MonitorEventSelectScalar = {
    id?: boolean;
    monitorId?: boolean;
    status?: boolean;
    latency?: boolean;
    errorReason?: boolean;
    timestamp?: boolean;
    region?: boolean;
  };

  export type MonitorEventOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetOmit<
      "id" | "monitorId" | "status" | "latency" | "errorReason" | "timestamp" | "region",
      ExtArgs["result"]["monitorEvent"]
    >;
  export type MonitorEventInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    monitor?: boolean | MonitorDefaultArgs<ExtArgs>;
  };
  export type MonitorEventIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    monitor?: boolean | MonitorDefaultArgs<ExtArgs>;
  };
  export type MonitorEventIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    monitor?: boolean | MonitorDefaultArgs<ExtArgs>;
  };

  export type $MonitorEventPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: "MonitorEvent";
    objects: {
      monitor: Prisma.$MonitorPayload<ExtArgs>;
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        monitorId: string;
        status: $Enums.MonitorStatus;
        latency: number;
        errorReason: string | null;
        timestamp: Date;
        region: string | null;
      },
      ExtArgs["result"]["monitorEvent"]
    >;
    composites: {};
  };

  type MonitorEventGetPayload<S extends boolean | null | undefined | MonitorEventDefaultArgs> =
    $Result.GetResult<Prisma.$MonitorEventPayload, S>;

  type MonitorEventCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MonitorEventFindManyArgs, "select" | "include" | "distinct" | "omit"> & {
      select?: MonitorEventCountAggregateInputType | true;
    };

  export interface MonitorEventDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>["model"]["MonitorEvent"];
      meta: { name: "MonitorEvent" };
    };
    /**
     * Find zero or one MonitorEvent that matches the filter.
     * @param {MonitorEventFindUniqueArgs} args - Arguments to find a MonitorEvent
     * @example
     * // Get one MonitorEvent
     * const monitorEvent = await prisma.monitorEvent.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MonitorEventFindUniqueArgs>(
      args: SelectSubset<T, MonitorEventFindUniqueArgs<ExtArgs>>,
    ): Prisma__MonitorEventClient<
      $Result.GetResult<
        Prisma.$MonitorEventPayload<ExtArgs>,
        T,
        "findUnique",
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one MonitorEvent that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MonitorEventFindUniqueOrThrowArgs} args - Arguments to find a MonitorEvent
     * @example
     * // Get one MonitorEvent
     * const monitorEvent = await prisma.monitorEvent.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MonitorEventFindUniqueOrThrowArgs>(
      args: SelectSubset<T, MonitorEventFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__MonitorEventClient<
      $Result.GetResult<
        Prisma.$MonitorEventPayload<ExtArgs>,
        T,
        "findUniqueOrThrow",
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first MonitorEvent that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MonitorEventFindFirstArgs} args - Arguments to find a MonitorEvent
     * @example
     * // Get one MonitorEvent
     * const monitorEvent = await prisma.monitorEvent.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MonitorEventFindFirstArgs>(
      args?: SelectSubset<T, MonitorEventFindFirstArgs<ExtArgs>>,
    ): Prisma__MonitorEventClient<
      $Result.GetResult<
        Prisma.$MonitorEventPayload<ExtArgs>,
        T,
        "findFirst",
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first MonitorEvent that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MonitorEventFindFirstOrThrowArgs} args - Arguments to find a MonitorEvent
     * @example
     * // Get one MonitorEvent
     * const monitorEvent = await prisma.monitorEvent.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MonitorEventFindFirstOrThrowArgs>(
      args?: SelectSubset<T, MonitorEventFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__MonitorEventClient<
      $Result.GetResult<
        Prisma.$MonitorEventPayload<ExtArgs>,
        T,
        "findFirstOrThrow",
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more MonitorEvents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MonitorEventFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MonitorEvents
     * const monitorEvents = await prisma.monitorEvent.findMany()
     *
     * // Get first 10 MonitorEvents
     * const monitorEvents = await prisma.monitorEvent.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const monitorEventWithIdOnly = await prisma.monitorEvent.findMany({ select: { id: true } })
     *
     */
    findMany<T extends MonitorEventFindManyArgs>(
      args?: SelectSubset<T, MonitorEventFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$MonitorEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>
    >;

    /**
     * Create a MonitorEvent.
     * @param {MonitorEventCreateArgs} args - Arguments to create a MonitorEvent.
     * @example
     * // Create one MonitorEvent
     * const MonitorEvent = await prisma.monitorEvent.create({
     *   data: {
     *     // ... data to create a MonitorEvent
     *   }
     * })
     *
     */
    create<T extends MonitorEventCreateArgs>(
      args: SelectSubset<T, MonitorEventCreateArgs<ExtArgs>>,
    ): Prisma__MonitorEventClient<
      $Result.GetResult<Prisma.$MonitorEventPayload<ExtArgs>, T, "create", GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many MonitorEvents.
     * @param {MonitorEventCreateManyArgs} args - Arguments to create many MonitorEvents.
     * @example
     * // Create many MonitorEvents
     * const monitorEvent = await prisma.monitorEvent.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends MonitorEventCreateManyArgs>(
      args?: SelectSubset<T, MonitorEventCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many MonitorEvents and returns the data saved in the database.
     * @param {MonitorEventCreateManyAndReturnArgs} args - Arguments to create many MonitorEvents.
     * @example
     * // Create many MonitorEvents
     * const monitorEvent = await prisma.monitorEvent.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many MonitorEvents and only return the `id`
     * const monitorEventWithIdOnly = await prisma.monitorEvent.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends MonitorEventCreateManyAndReturnArgs>(
      args?: SelectSubset<T, MonitorEventCreateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$MonitorEventPayload<ExtArgs>,
        T,
        "createManyAndReturn",
        GlobalOmitOptions
      >
    >;

    /**
     * Delete a MonitorEvent.
     * @param {MonitorEventDeleteArgs} args - Arguments to delete one MonitorEvent.
     * @example
     * // Delete one MonitorEvent
     * const MonitorEvent = await prisma.monitorEvent.delete({
     *   where: {
     *     // ... filter to delete one MonitorEvent
     *   }
     * })
     *
     */
    delete<T extends MonitorEventDeleteArgs>(
      args: SelectSubset<T, MonitorEventDeleteArgs<ExtArgs>>,
    ): Prisma__MonitorEventClient<
      $Result.GetResult<Prisma.$MonitorEventPayload<ExtArgs>, T, "delete", GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one MonitorEvent.
     * @param {MonitorEventUpdateArgs} args - Arguments to update one MonitorEvent.
     * @example
     * // Update one MonitorEvent
     * const monitorEvent = await prisma.monitorEvent.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends MonitorEventUpdateArgs>(
      args: SelectSubset<T, MonitorEventUpdateArgs<ExtArgs>>,
    ): Prisma__MonitorEventClient<
      $Result.GetResult<Prisma.$MonitorEventPayload<ExtArgs>, T, "update", GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more MonitorEvents.
     * @param {MonitorEventDeleteManyArgs} args - Arguments to filter MonitorEvents to delete.
     * @example
     * // Delete a few MonitorEvents
     * const { count } = await prisma.monitorEvent.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends MonitorEventDeleteManyArgs>(
      args?: SelectSubset<T, MonitorEventDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more MonitorEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MonitorEventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MonitorEvents
     * const monitorEvent = await prisma.monitorEvent.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends MonitorEventUpdateManyArgs>(
      args: SelectSubset<T, MonitorEventUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more MonitorEvents and returns the data updated in the database.
     * @param {MonitorEventUpdateManyAndReturnArgs} args - Arguments to update many MonitorEvents.
     * @example
     * // Update many MonitorEvents
     * const monitorEvent = await prisma.monitorEvent.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more MonitorEvents and only return the `id`
     * const monitorEventWithIdOnly = await prisma.monitorEvent.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends MonitorEventUpdateManyAndReturnArgs>(
      args: SelectSubset<T, MonitorEventUpdateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$MonitorEventPayload<ExtArgs>,
        T,
        "updateManyAndReturn",
        GlobalOmitOptions
      >
    >;

    /**
     * Create or update one MonitorEvent.
     * @param {MonitorEventUpsertArgs} args - Arguments to update or create a MonitorEvent.
     * @example
     * // Update or create a MonitorEvent
     * const monitorEvent = await prisma.monitorEvent.upsert({
     *   create: {
     *     // ... data to create a MonitorEvent
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MonitorEvent we want to update
     *   }
     * })
     */
    upsert<T extends MonitorEventUpsertArgs>(
      args: SelectSubset<T, MonitorEventUpsertArgs<ExtArgs>>,
    ): Prisma__MonitorEventClient<
      $Result.GetResult<Prisma.$MonitorEventPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of MonitorEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MonitorEventCountArgs} args - Arguments to filter MonitorEvents to count.
     * @example
     * // Count the number of MonitorEvents
     * const count = await prisma.monitorEvent.count({
     *   where: {
     *     // ... the filter for the MonitorEvents we want to count
     *   }
     * })
     **/
    count<T extends MonitorEventCountArgs>(
      args?: Subset<T, MonitorEventCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<"select", any>
        ? T["select"] extends true
          ? number
          : GetScalarType<T["select"], MonitorEventCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a MonitorEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MonitorEventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends MonitorEventAggregateArgs>(
      args: Subset<T, MonitorEventAggregateArgs>,
    ): Prisma.PrismaPromise<GetMonitorEventAggregateType<T>>;

    /**
     * Group by MonitorEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MonitorEventGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends MonitorEventGroupByArgs,
      HasSelectOrTake extends Or<Extends<"skip", Keys<T>>, Extends<"take", Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MonitorEventGroupByArgs["orderBy"] }
        : { orderBy?: MonitorEventGroupByArgs["orderBy"] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T["orderBy"]>>>,
      ByFields extends MaybeTupleToUnion<T["by"]>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T["having"]>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T["by"] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [Error, "Field ", P, ` in "having" needs to be provided in "by"`];
            }[HavingFields]
          : "take" extends Keys<T>
            ? "orderBy" extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : "skip" extends Keys<T>
              ? "orderBy" extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, MonitorEventGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors
      ? GetMonitorEventGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the MonitorEvent model
     */
    readonly fields: MonitorEventFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MonitorEvent.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MonitorEventClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    monitor<T extends MonitorDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, MonitorDefaultArgs<ExtArgs>>,
    ): Prisma__MonitorClient<
      | $Result.GetResult<
          Prisma.$MonitorPayload<ExtArgs>,
          T,
          "findUniqueOrThrow",
          GlobalOmitOptions
        >
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the MonitorEvent model
   */
  interface MonitorEventFieldRefs {
    readonly id: FieldRef<"MonitorEvent", "String">;
    readonly monitorId: FieldRef<"MonitorEvent", "String">;
    readonly status: FieldRef<"MonitorEvent", "MonitorStatus">;
    readonly latency: FieldRef<"MonitorEvent", "Int">;
    readonly errorReason: FieldRef<"MonitorEvent", "String">;
    readonly timestamp: FieldRef<"MonitorEvent", "DateTime">;
    readonly region: FieldRef<"MonitorEvent", "String">;
  }

  // Custom InputTypes
  /**
   * MonitorEvent findUnique
   */
  export type MonitorEventFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the MonitorEvent
     */
    select?: MonitorEventSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MonitorEvent
     */
    omit?: MonitorEventOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MonitorEventInclude<ExtArgs> | null;
    /**
     * Filter, which MonitorEvent to fetch.
     */
    where: MonitorEventWhereUniqueInput;
  };

  /**
   * MonitorEvent findUniqueOrThrow
   */
  export type MonitorEventFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the MonitorEvent
     */
    select?: MonitorEventSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MonitorEvent
     */
    omit?: MonitorEventOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MonitorEventInclude<ExtArgs> | null;
    /**
     * Filter, which MonitorEvent to fetch.
     */
    where: MonitorEventWhereUniqueInput;
  };

  /**
   * MonitorEvent findFirst
   */
  export type MonitorEventFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the MonitorEvent
     */
    select?: MonitorEventSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MonitorEvent
     */
    omit?: MonitorEventOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MonitorEventInclude<ExtArgs> | null;
    /**
     * Filter, which MonitorEvent to fetch.
     */
    where?: MonitorEventWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of MonitorEvents to fetch.
     */
    orderBy?: MonitorEventOrderByWithRelationInput | MonitorEventOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for MonitorEvents.
     */
    cursor?: MonitorEventWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` MonitorEvents from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` MonitorEvents.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of MonitorEvents.
     */
    distinct?: MonitorEventScalarFieldEnum | MonitorEventScalarFieldEnum[];
  };

  /**
   * MonitorEvent findFirstOrThrow
   */
  export type MonitorEventFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the MonitorEvent
     */
    select?: MonitorEventSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MonitorEvent
     */
    omit?: MonitorEventOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MonitorEventInclude<ExtArgs> | null;
    /**
     * Filter, which MonitorEvent to fetch.
     */
    where?: MonitorEventWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of MonitorEvents to fetch.
     */
    orderBy?: MonitorEventOrderByWithRelationInput | MonitorEventOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for MonitorEvents.
     */
    cursor?: MonitorEventWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` MonitorEvents from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` MonitorEvents.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of MonitorEvents.
     */
    distinct?: MonitorEventScalarFieldEnum | MonitorEventScalarFieldEnum[];
  };

  /**
   * MonitorEvent findMany
   */
  export type MonitorEventFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the MonitorEvent
     */
    select?: MonitorEventSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MonitorEvent
     */
    omit?: MonitorEventOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MonitorEventInclude<ExtArgs> | null;
    /**
     * Filter, which MonitorEvents to fetch.
     */
    where?: MonitorEventWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of MonitorEvents to fetch.
     */
    orderBy?: MonitorEventOrderByWithRelationInput | MonitorEventOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing MonitorEvents.
     */
    cursor?: MonitorEventWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` MonitorEvents from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` MonitorEvents.
     */
    skip?: number;
    distinct?: MonitorEventScalarFieldEnum | MonitorEventScalarFieldEnum[];
  };

  /**
   * MonitorEvent create
   */
  export type MonitorEventCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the MonitorEvent
     */
    select?: MonitorEventSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MonitorEvent
     */
    omit?: MonitorEventOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MonitorEventInclude<ExtArgs> | null;
    /**
     * The data needed to create a MonitorEvent.
     */
    data: XOR<MonitorEventCreateInput, MonitorEventUncheckedCreateInput>;
  };

  /**
   * MonitorEvent createMany
   */
  export type MonitorEventCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many MonitorEvents.
     */
    data: MonitorEventCreateManyInput | MonitorEventCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * MonitorEvent createManyAndReturn
   */
  export type MonitorEventCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the MonitorEvent
     */
    select?: MonitorEventSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the MonitorEvent
     */
    omit?: MonitorEventOmit<ExtArgs> | null;
    /**
     * The data used to create many MonitorEvents.
     */
    data: MonitorEventCreateManyInput | MonitorEventCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MonitorEventIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * MonitorEvent update
   */
  export type MonitorEventUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the MonitorEvent
     */
    select?: MonitorEventSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MonitorEvent
     */
    omit?: MonitorEventOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MonitorEventInclude<ExtArgs> | null;
    /**
     * The data needed to update a MonitorEvent.
     */
    data: XOR<MonitorEventUpdateInput, MonitorEventUncheckedUpdateInput>;
    /**
     * Choose, which MonitorEvent to update.
     */
    where: MonitorEventWhereUniqueInput;
  };

  /**
   * MonitorEvent updateMany
   */
  export type MonitorEventUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update MonitorEvents.
     */
    data: XOR<MonitorEventUpdateManyMutationInput, MonitorEventUncheckedUpdateManyInput>;
    /**
     * Filter which MonitorEvents to update
     */
    where?: MonitorEventWhereInput;
    /**
     * Limit how many MonitorEvents to update.
     */
    limit?: number;
  };

  /**
   * MonitorEvent updateManyAndReturn
   */
  export type MonitorEventUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the MonitorEvent
     */
    select?: MonitorEventSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the MonitorEvent
     */
    omit?: MonitorEventOmit<ExtArgs> | null;
    /**
     * The data used to update MonitorEvents.
     */
    data: XOR<MonitorEventUpdateManyMutationInput, MonitorEventUncheckedUpdateManyInput>;
    /**
     * Filter which MonitorEvents to update
     */
    where?: MonitorEventWhereInput;
    /**
     * Limit how many MonitorEvents to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MonitorEventIncludeUpdateManyAndReturn<ExtArgs> | null;
  };

  /**
   * MonitorEvent upsert
   */
  export type MonitorEventUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the MonitorEvent
     */
    select?: MonitorEventSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MonitorEvent
     */
    omit?: MonitorEventOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MonitorEventInclude<ExtArgs> | null;
    /**
     * The filter to search for the MonitorEvent to update in case it exists.
     */
    where: MonitorEventWhereUniqueInput;
    /**
     * In case the MonitorEvent found by the `where` argument doesn't exist, create a new MonitorEvent with this data.
     */
    create: XOR<MonitorEventCreateInput, MonitorEventUncheckedCreateInput>;
    /**
     * In case the MonitorEvent was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MonitorEventUpdateInput, MonitorEventUncheckedUpdateInput>;
  };

  /**
   * MonitorEvent delete
   */
  export type MonitorEventDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the MonitorEvent
     */
    select?: MonitorEventSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MonitorEvent
     */
    omit?: MonitorEventOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MonitorEventInclude<ExtArgs> | null;
    /**
     * Filter which MonitorEvent to delete.
     */
    where: MonitorEventWhereUniqueInput;
  };

  /**
   * MonitorEvent deleteMany
   */
  export type MonitorEventDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which MonitorEvents to delete
     */
    where?: MonitorEventWhereInput;
    /**
     * Limit how many MonitorEvents to delete.
     */
    limit?: number;
  };

  /**
   * MonitorEvent without action
   */
  export type MonitorEventDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the MonitorEvent
     */
    select?: MonitorEventSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MonitorEvent
     */
    omit?: MonitorEventOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MonitorEventInclude<ExtArgs> | null;
  };

  /**
   * Model MaintenanceWindow
   */

  export type AggregateMaintenanceWindow = {
    _count: MaintenanceWindowCountAggregateOutputType | null;
    _min: MaintenanceWindowMinAggregateOutputType | null;
    _max: MaintenanceWindowMaxAggregateOutputType | null;
  };

  export type MaintenanceWindowMinAggregateOutputType = {
    id: string | null;
    monitorId: string | null;
    description: string | null;
    startAt: Date | null;
    endAt: Date | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type MaintenanceWindowMaxAggregateOutputType = {
    id: string | null;
    monitorId: string | null;
    description: string | null;
    startAt: Date | null;
    endAt: Date | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type MaintenanceWindowCountAggregateOutputType = {
    id: number;
    monitorId: number;
    description: number;
    startAt: number;
    endAt: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
  };

  export type MaintenanceWindowMinAggregateInputType = {
    id?: true;
    monitorId?: true;
    description?: true;
    startAt?: true;
    endAt?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type MaintenanceWindowMaxAggregateInputType = {
    id?: true;
    monitorId?: true;
    description?: true;
    startAt?: true;
    endAt?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type MaintenanceWindowCountAggregateInputType = {
    id?: true;
    monitorId?: true;
    description?: true;
    startAt?: true;
    endAt?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
  };

  export type MaintenanceWindowAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which MaintenanceWindow to aggregate.
     */
    where?: MaintenanceWindowWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of MaintenanceWindows to fetch.
     */
    orderBy?:
      | MaintenanceWindowOrderByWithRelationInput
      | MaintenanceWindowOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: MaintenanceWindowWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` MaintenanceWindows from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` MaintenanceWindows.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned MaintenanceWindows
     **/
    _count?: true | MaintenanceWindowCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: MaintenanceWindowMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: MaintenanceWindowMaxAggregateInputType;
  };

  export type GetMaintenanceWindowAggregateType<T extends MaintenanceWindowAggregateArgs> = {
    [P in keyof T & keyof AggregateMaintenanceWindow]: P extends "_count" | "count"
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMaintenanceWindow[P]>
      : GetScalarType<T[P], AggregateMaintenanceWindow[P]>;
  };

  export type MaintenanceWindowGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: MaintenanceWindowWhereInput;
    orderBy?:
      | MaintenanceWindowOrderByWithAggregationInput
      | MaintenanceWindowOrderByWithAggregationInput[];
    by: MaintenanceWindowScalarFieldEnum[] | MaintenanceWindowScalarFieldEnum;
    having?: MaintenanceWindowScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: MaintenanceWindowCountAggregateInputType | true;
    _min?: MaintenanceWindowMinAggregateInputType;
    _max?: MaintenanceWindowMaxAggregateInputType;
  };

  export type MaintenanceWindowGroupByOutputType = {
    id: string;
    monitorId: string;
    description: string | null;
    startAt: Date;
    endAt: Date;
    createdAt: Date;
    updatedAt: Date;
    _count: MaintenanceWindowCountAggregateOutputType | null;
    _min: MaintenanceWindowMinAggregateOutputType | null;
    _max: MaintenanceWindowMaxAggregateOutputType | null;
  };

  type GetMaintenanceWindowGroupByPayload<T extends MaintenanceWindowGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<MaintenanceWindowGroupByOutputType, T["by"]> & {
          [P in keyof T & keyof MaintenanceWindowGroupByOutputType]: P extends "_count"
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MaintenanceWindowGroupByOutputType[P]>
            : GetScalarType<T[P], MaintenanceWindowGroupByOutputType[P]>;
        }
      >
    >;

  export type MaintenanceWindowSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      monitorId?: boolean;
      description?: boolean;
      startAt?: boolean;
      endAt?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      monitor?: boolean | MonitorDefaultArgs<ExtArgs>;
    },
    ExtArgs["result"]["maintenanceWindow"]
  >;

  export type MaintenanceWindowSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      monitorId?: boolean;
      description?: boolean;
      startAt?: boolean;
      endAt?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      monitor?: boolean | MonitorDefaultArgs<ExtArgs>;
    },
    ExtArgs["result"]["maintenanceWindow"]
  >;

  export type MaintenanceWindowSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      monitorId?: boolean;
      description?: boolean;
      startAt?: boolean;
      endAt?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      monitor?: boolean | MonitorDefaultArgs<ExtArgs>;
    },
    ExtArgs["result"]["maintenanceWindow"]
  >;

  export type MaintenanceWindowSelectScalar = {
    id?: boolean;
    monitorId?: boolean;
    description?: boolean;
    startAt?: boolean;
    endAt?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
  };

  export type MaintenanceWindowOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetOmit<
    "id" | "monitorId" | "description" | "startAt" | "endAt" | "createdAt" | "updatedAt",
    ExtArgs["result"]["maintenanceWindow"]
  >;
  export type MaintenanceWindowInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    monitor?: boolean | MonitorDefaultArgs<ExtArgs>;
  };
  export type MaintenanceWindowIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    monitor?: boolean | MonitorDefaultArgs<ExtArgs>;
  };
  export type MaintenanceWindowIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    monitor?: boolean | MonitorDefaultArgs<ExtArgs>;
  };

  export type $MaintenanceWindowPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: "MaintenanceWindow";
    objects: {
      monitor: Prisma.$MonitorPayload<ExtArgs>;
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        monitorId: string;
        description: string | null;
        startAt: Date;
        endAt: Date;
        createdAt: Date;
        updatedAt: Date;
      },
      ExtArgs["result"]["maintenanceWindow"]
    >;
    composites: {};
  };

  type MaintenanceWindowGetPayload<
    S extends boolean | null | undefined | MaintenanceWindowDefaultArgs,
  > = $Result.GetResult<Prisma.$MaintenanceWindowPayload, S>;

  type MaintenanceWindowCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<MaintenanceWindowFindManyArgs, "select" | "include" | "distinct" | "omit"> & {
    select?: MaintenanceWindowCountAggregateInputType | true;
  };

  export interface MaintenanceWindowDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>["model"]["MaintenanceWindow"];
      meta: { name: "MaintenanceWindow" };
    };
    /**
     * Find zero or one MaintenanceWindow that matches the filter.
     * @param {MaintenanceWindowFindUniqueArgs} args - Arguments to find a MaintenanceWindow
     * @example
     * // Get one MaintenanceWindow
     * const maintenanceWindow = await prisma.maintenanceWindow.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MaintenanceWindowFindUniqueArgs>(
      args: SelectSubset<T, MaintenanceWindowFindUniqueArgs<ExtArgs>>,
    ): Prisma__MaintenanceWindowClient<
      $Result.GetResult<
        Prisma.$MaintenanceWindowPayload<ExtArgs>,
        T,
        "findUnique",
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one MaintenanceWindow that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MaintenanceWindowFindUniqueOrThrowArgs} args - Arguments to find a MaintenanceWindow
     * @example
     * // Get one MaintenanceWindow
     * const maintenanceWindow = await prisma.maintenanceWindow.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MaintenanceWindowFindUniqueOrThrowArgs>(
      args: SelectSubset<T, MaintenanceWindowFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__MaintenanceWindowClient<
      $Result.GetResult<
        Prisma.$MaintenanceWindowPayload<ExtArgs>,
        T,
        "findUniqueOrThrow",
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first MaintenanceWindow that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaintenanceWindowFindFirstArgs} args - Arguments to find a MaintenanceWindow
     * @example
     * // Get one MaintenanceWindow
     * const maintenanceWindow = await prisma.maintenanceWindow.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MaintenanceWindowFindFirstArgs>(
      args?: SelectSubset<T, MaintenanceWindowFindFirstArgs<ExtArgs>>,
    ): Prisma__MaintenanceWindowClient<
      $Result.GetResult<
        Prisma.$MaintenanceWindowPayload<ExtArgs>,
        T,
        "findFirst",
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first MaintenanceWindow that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaintenanceWindowFindFirstOrThrowArgs} args - Arguments to find a MaintenanceWindow
     * @example
     * // Get one MaintenanceWindow
     * const maintenanceWindow = await prisma.maintenanceWindow.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MaintenanceWindowFindFirstOrThrowArgs>(
      args?: SelectSubset<T, MaintenanceWindowFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__MaintenanceWindowClient<
      $Result.GetResult<
        Prisma.$MaintenanceWindowPayload<ExtArgs>,
        T,
        "findFirstOrThrow",
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more MaintenanceWindows that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaintenanceWindowFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MaintenanceWindows
     * const maintenanceWindows = await prisma.maintenanceWindow.findMany()
     *
     * // Get first 10 MaintenanceWindows
     * const maintenanceWindows = await prisma.maintenanceWindow.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const maintenanceWindowWithIdOnly = await prisma.maintenanceWindow.findMany({ select: { id: true } })
     *
     */
    findMany<T extends MaintenanceWindowFindManyArgs>(
      args?: SelectSubset<T, MaintenanceWindowFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$MaintenanceWindowPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>
    >;

    /**
     * Create a MaintenanceWindow.
     * @param {MaintenanceWindowCreateArgs} args - Arguments to create a MaintenanceWindow.
     * @example
     * // Create one MaintenanceWindow
     * const MaintenanceWindow = await prisma.maintenanceWindow.create({
     *   data: {
     *     // ... data to create a MaintenanceWindow
     *   }
     * })
     *
     */
    create<T extends MaintenanceWindowCreateArgs>(
      args: SelectSubset<T, MaintenanceWindowCreateArgs<ExtArgs>>,
    ): Prisma__MaintenanceWindowClient<
      $Result.GetResult<Prisma.$MaintenanceWindowPayload<ExtArgs>, T, "create", GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many MaintenanceWindows.
     * @param {MaintenanceWindowCreateManyArgs} args - Arguments to create many MaintenanceWindows.
     * @example
     * // Create many MaintenanceWindows
     * const maintenanceWindow = await prisma.maintenanceWindow.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends MaintenanceWindowCreateManyArgs>(
      args?: SelectSubset<T, MaintenanceWindowCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many MaintenanceWindows and returns the data saved in the database.
     * @param {MaintenanceWindowCreateManyAndReturnArgs} args - Arguments to create many MaintenanceWindows.
     * @example
     * // Create many MaintenanceWindows
     * const maintenanceWindow = await prisma.maintenanceWindow.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many MaintenanceWindows and only return the `id`
     * const maintenanceWindowWithIdOnly = await prisma.maintenanceWindow.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends MaintenanceWindowCreateManyAndReturnArgs>(
      args?: SelectSubset<T, MaintenanceWindowCreateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$MaintenanceWindowPayload<ExtArgs>,
        T,
        "createManyAndReturn",
        GlobalOmitOptions
      >
    >;

    /**
     * Delete a MaintenanceWindow.
     * @param {MaintenanceWindowDeleteArgs} args - Arguments to delete one MaintenanceWindow.
     * @example
     * // Delete one MaintenanceWindow
     * const MaintenanceWindow = await prisma.maintenanceWindow.delete({
     *   where: {
     *     // ... filter to delete one MaintenanceWindow
     *   }
     * })
     *
     */
    delete<T extends MaintenanceWindowDeleteArgs>(
      args: SelectSubset<T, MaintenanceWindowDeleteArgs<ExtArgs>>,
    ): Prisma__MaintenanceWindowClient<
      $Result.GetResult<Prisma.$MaintenanceWindowPayload<ExtArgs>, T, "delete", GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one MaintenanceWindow.
     * @param {MaintenanceWindowUpdateArgs} args - Arguments to update one MaintenanceWindow.
     * @example
     * // Update one MaintenanceWindow
     * const maintenanceWindow = await prisma.maintenanceWindow.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends MaintenanceWindowUpdateArgs>(
      args: SelectSubset<T, MaintenanceWindowUpdateArgs<ExtArgs>>,
    ): Prisma__MaintenanceWindowClient<
      $Result.GetResult<Prisma.$MaintenanceWindowPayload<ExtArgs>, T, "update", GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more MaintenanceWindows.
     * @param {MaintenanceWindowDeleteManyArgs} args - Arguments to filter MaintenanceWindows to delete.
     * @example
     * // Delete a few MaintenanceWindows
     * const { count } = await prisma.maintenanceWindow.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends MaintenanceWindowDeleteManyArgs>(
      args?: SelectSubset<T, MaintenanceWindowDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more MaintenanceWindows.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaintenanceWindowUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MaintenanceWindows
     * const maintenanceWindow = await prisma.maintenanceWindow.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends MaintenanceWindowUpdateManyArgs>(
      args: SelectSubset<T, MaintenanceWindowUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more MaintenanceWindows and returns the data updated in the database.
     * @param {MaintenanceWindowUpdateManyAndReturnArgs} args - Arguments to update many MaintenanceWindows.
     * @example
     * // Update many MaintenanceWindows
     * const maintenanceWindow = await prisma.maintenanceWindow.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more MaintenanceWindows and only return the `id`
     * const maintenanceWindowWithIdOnly = await prisma.maintenanceWindow.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends MaintenanceWindowUpdateManyAndReturnArgs>(
      args: SelectSubset<T, MaintenanceWindowUpdateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$MaintenanceWindowPayload<ExtArgs>,
        T,
        "updateManyAndReturn",
        GlobalOmitOptions
      >
    >;

    /**
     * Create or update one MaintenanceWindow.
     * @param {MaintenanceWindowUpsertArgs} args - Arguments to update or create a MaintenanceWindow.
     * @example
     * // Update or create a MaintenanceWindow
     * const maintenanceWindow = await prisma.maintenanceWindow.upsert({
     *   create: {
     *     // ... data to create a MaintenanceWindow
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MaintenanceWindow we want to update
     *   }
     * })
     */
    upsert<T extends MaintenanceWindowUpsertArgs>(
      args: SelectSubset<T, MaintenanceWindowUpsertArgs<ExtArgs>>,
    ): Prisma__MaintenanceWindowClient<
      $Result.GetResult<Prisma.$MaintenanceWindowPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of MaintenanceWindows.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaintenanceWindowCountArgs} args - Arguments to filter MaintenanceWindows to count.
     * @example
     * // Count the number of MaintenanceWindows
     * const count = await prisma.maintenanceWindow.count({
     *   where: {
     *     // ... the filter for the MaintenanceWindows we want to count
     *   }
     * })
     **/
    count<T extends MaintenanceWindowCountArgs>(
      args?: Subset<T, MaintenanceWindowCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<"select", any>
        ? T["select"] extends true
          ? number
          : GetScalarType<T["select"], MaintenanceWindowCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a MaintenanceWindow.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaintenanceWindowAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends MaintenanceWindowAggregateArgs>(
      args: Subset<T, MaintenanceWindowAggregateArgs>,
    ): Prisma.PrismaPromise<GetMaintenanceWindowAggregateType<T>>;

    /**
     * Group by MaintenanceWindow.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaintenanceWindowGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends MaintenanceWindowGroupByArgs,
      HasSelectOrTake extends Or<Extends<"skip", Keys<T>>, Extends<"take", Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MaintenanceWindowGroupByArgs["orderBy"] }
        : { orderBy?: MaintenanceWindowGroupByArgs["orderBy"] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T["orderBy"]>>>,
      ByFields extends MaybeTupleToUnion<T["by"]>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T["having"]>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T["by"] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [Error, "Field ", P, ` in "having" needs to be provided in "by"`];
            }[HavingFields]
          : "take" extends Keys<T>
            ? "orderBy" extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : "skip" extends Keys<T>
              ? "orderBy" extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, MaintenanceWindowGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors
      ? GetMaintenanceWindowGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the MaintenanceWindow model
     */
    readonly fields: MaintenanceWindowFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MaintenanceWindow.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MaintenanceWindowClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    monitor<T extends MonitorDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, MonitorDefaultArgs<ExtArgs>>,
    ): Prisma__MonitorClient<
      | $Result.GetResult<
          Prisma.$MonitorPayload<ExtArgs>,
          T,
          "findUniqueOrThrow",
          GlobalOmitOptions
        >
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the MaintenanceWindow model
   */
  interface MaintenanceWindowFieldRefs {
    readonly id: FieldRef<"MaintenanceWindow", "String">;
    readonly monitorId: FieldRef<"MaintenanceWindow", "String">;
    readonly description: FieldRef<"MaintenanceWindow", "String">;
    readonly startAt: FieldRef<"MaintenanceWindow", "DateTime">;
    readonly endAt: FieldRef<"MaintenanceWindow", "DateTime">;
    readonly createdAt: FieldRef<"MaintenanceWindow", "DateTime">;
    readonly updatedAt: FieldRef<"MaintenanceWindow", "DateTime">;
  }

  // Custom InputTypes
  /**
   * MaintenanceWindow findUnique
   */
  export type MaintenanceWindowFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the MaintenanceWindow
     */
    select?: MaintenanceWindowSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MaintenanceWindow
     */
    omit?: MaintenanceWindowOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaintenanceWindowInclude<ExtArgs> | null;
    /**
     * Filter, which MaintenanceWindow to fetch.
     */
    where: MaintenanceWindowWhereUniqueInput;
  };

  /**
   * MaintenanceWindow findUniqueOrThrow
   */
  export type MaintenanceWindowFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the MaintenanceWindow
     */
    select?: MaintenanceWindowSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MaintenanceWindow
     */
    omit?: MaintenanceWindowOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaintenanceWindowInclude<ExtArgs> | null;
    /**
     * Filter, which MaintenanceWindow to fetch.
     */
    where: MaintenanceWindowWhereUniqueInput;
  };

  /**
   * MaintenanceWindow findFirst
   */
  export type MaintenanceWindowFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the MaintenanceWindow
     */
    select?: MaintenanceWindowSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MaintenanceWindow
     */
    omit?: MaintenanceWindowOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaintenanceWindowInclude<ExtArgs> | null;
    /**
     * Filter, which MaintenanceWindow to fetch.
     */
    where?: MaintenanceWindowWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of MaintenanceWindows to fetch.
     */
    orderBy?:
      | MaintenanceWindowOrderByWithRelationInput
      | MaintenanceWindowOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for MaintenanceWindows.
     */
    cursor?: MaintenanceWindowWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` MaintenanceWindows from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` MaintenanceWindows.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of MaintenanceWindows.
     */
    distinct?: MaintenanceWindowScalarFieldEnum | MaintenanceWindowScalarFieldEnum[];
  };

  /**
   * MaintenanceWindow findFirstOrThrow
   */
  export type MaintenanceWindowFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the MaintenanceWindow
     */
    select?: MaintenanceWindowSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MaintenanceWindow
     */
    omit?: MaintenanceWindowOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaintenanceWindowInclude<ExtArgs> | null;
    /**
     * Filter, which MaintenanceWindow to fetch.
     */
    where?: MaintenanceWindowWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of MaintenanceWindows to fetch.
     */
    orderBy?:
      | MaintenanceWindowOrderByWithRelationInput
      | MaintenanceWindowOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for MaintenanceWindows.
     */
    cursor?: MaintenanceWindowWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` MaintenanceWindows from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` MaintenanceWindows.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of MaintenanceWindows.
     */
    distinct?: MaintenanceWindowScalarFieldEnum | MaintenanceWindowScalarFieldEnum[];
  };

  /**
   * MaintenanceWindow findMany
   */
  export type MaintenanceWindowFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the MaintenanceWindow
     */
    select?: MaintenanceWindowSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MaintenanceWindow
     */
    omit?: MaintenanceWindowOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaintenanceWindowInclude<ExtArgs> | null;
    /**
     * Filter, which MaintenanceWindows to fetch.
     */
    where?: MaintenanceWindowWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of MaintenanceWindows to fetch.
     */
    orderBy?:
      | MaintenanceWindowOrderByWithRelationInput
      | MaintenanceWindowOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing MaintenanceWindows.
     */
    cursor?: MaintenanceWindowWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` MaintenanceWindows from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` MaintenanceWindows.
     */
    skip?: number;
    distinct?: MaintenanceWindowScalarFieldEnum | MaintenanceWindowScalarFieldEnum[];
  };

  /**
   * MaintenanceWindow create
   */
  export type MaintenanceWindowCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the MaintenanceWindow
     */
    select?: MaintenanceWindowSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MaintenanceWindow
     */
    omit?: MaintenanceWindowOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaintenanceWindowInclude<ExtArgs> | null;
    /**
     * The data needed to create a MaintenanceWindow.
     */
    data: XOR<MaintenanceWindowCreateInput, MaintenanceWindowUncheckedCreateInput>;
  };

  /**
   * MaintenanceWindow createMany
   */
  export type MaintenanceWindowCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many MaintenanceWindows.
     */
    data: MaintenanceWindowCreateManyInput | MaintenanceWindowCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * MaintenanceWindow createManyAndReturn
   */
  export type MaintenanceWindowCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the MaintenanceWindow
     */
    select?: MaintenanceWindowSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the MaintenanceWindow
     */
    omit?: MaintenanceWindowOmit<ExtArgs> | null;
    /**
     * The data used to create many MaintenanceWindows.
     */
    data: MaintenanceWindowCreateManyInput | MaintenanceWindowCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaintenanceWindowIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * MaintenanceWindow update
   */
  export type MaintenanceWindowUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the MaintenanceWindow
     */
    select?: MaintenanceWindowSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MaintenanceWindow
     */
    omit?: MaintenanceWindowOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaintenanceWindowInclude<ExtArgs> | null;
    /**
     * The data needed to update a MaintenanceWindow.
     */
    data: XOR<MaintenanceWindowUpdateInput, MaintenanceWindowUncheckedUpdateInput>;
    /**
     * Choose, which MaintenanceWindow to update.
     */
    where: MaintenanceWindowWhereUniqueInput;
  };

  /**
   * MaintenanceWindow updateMany
   */
  export type MaintenanceWindowUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update MaintenanceWindows.
     */
    data: XOR<MaintenanceWindowUpdateManyMutationInput, MaintenanceWindowUncheckedUpdateManyInput>;
    /**
     * Filter which MaintenanceWindows to update
     */
    where?: MaintenanceWindowWhereInput;
    /**
     * Limit how many MaintenanceWindows to update.
     */
    limit?: number;
  };

  /**
   * MaintenanceWindow updateManyAndReturn
   */
  export type MaintenanceWindowUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the MaintenanceWindow
     */
    select?: MaintenanceWindowSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the MaintenanceWindow
     */
    omit?: MaintenanceWindowOmit<ExtArgs> | null;
    /**
     * The data used to update MaintenanceWindows.
     */
    data: XOR<MaintenanceWindowUpdateManyMutationInput, MaintenanceWindowUncheckedUpdateManyInput>;
    /**
     * Filter which MaintenanceWindows to update
     */
    where?: MaintenanceWindowWhereInput;
    /**
     * Limit how many MaintenanceWindows to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaintenanceWindowIncludeUpdateManyAndReturn<ExtArgs> | null;
  };

  /**
   * MaintenanceWindow upsert
   */
  export type MaintenanceWindowUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the MaintenanceWindow
     */
    select?: MaintenanceWindowSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MaintenanceWindow
     */
    omit?: MaintenanceWindowOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaintenanceWindowInclude<ExtArgs> | null;
    /**
     * The filter to search for the MaintenanceWindow to update in case it exists.
     */
    where: MaintenanceWindowWhereUniqueInput;
    /**
     * In case the MaintenanceWindow found by the `where` argument doesn't exist, create a new MaintenanceWindow with this data.
     */
    create: XOR<MaintenanceWindowCreateInput, MaintenanceWindowUncheckedCreateInput>;
    /**
     * In case the MaintenanceWindow was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MaintenanceWindowUpdateInput, MaintenanceWindowUncheckedUpdateInput>;
  };

  /**
   * MaintenanceWindow delete
   */
  export type MaintenanceWindowDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the MaintenanceWindow
     */
    select?: MaintenanceWindowSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MaintenanceWindow
     */
    omit?: MaintenanceWindowOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaintenanceWindowInclude<ExtArgs> | null;
    /**
     * Filter which MaintenanceWindow to delete.
     */
    where: MaintenanceWindowWhereUniqueInput;
  };

  /**
   * MaintenanceWindow deleteMany
   */
  export type MaintenanceWindowDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which MaintenanceWindows to delete
     */
    where?: MaintenanceWindowWhereInput;
    /**
     * Limit how many MaintenanceWindows to delete.
     */
    limit?: number;
  };

  /**
   * MaintenanceWindow without action
   */
  export type MaintenanceWindowDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the MaintenanceWindow
     */
    select?: MaintenanceWindowSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MaintenanceWindow
     */
    omit?: MaintenanceWindowOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaintenanceWindowInclude<ExtArgs> | null;
  };

  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: "ReadUncommitted";
    ReadCommitted: "ReadCommitted";
    RepeatableRead: "RepeatableRead";
    Serializable: "Serializable";
  };

  export type TransactionIsolationLevel =
    (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];

  export const UserScalarFieldEnum: {
    id: "id";
    name: "name";
    email: "email";
    emailVerified: "emailVerified";
    image: "image";
    timezone: "timezone";
    dateFormat: "dateFormat";
    createdAt: "createdAt";
    updatedAt: "updatedAt";
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum];

  export const SessionScalarFieldEnum: {
    id: "id";
    expiresAt: "expiresAt";
    token: "token";
    createdAt: "createdAt";
    updatedAt: "updatedAt";
    ipAddress: "ipAddress";
    userAgent: "userAgent";
    userId: "userId";
  };

  export type SessionScalarFieldEnum =
    (typeof SessionScalarFieldEnum)[keyof typeof SessionScalarFieldEnum];

  export const AccountScalarFieldEnum: {
    id: "id";
    accountId: "accountId";
    providerId: "providerId";
    userId: "userId";
    accessToken: "accessToken";
    refreshToken: "refreshToken";
    idToken: "idToken";
    accessTokenExpiresAt: "accessTokenExpiresAt";
    refreshTokenExpiresAt: "refreshTokenExpiresAt";
    scope: "scope";
    password: "password";
    createdAt: "createdAt";
    updatedAt: "updatedAt";
  };

  export type AccountScalarFieldEnum =
    (typeof AccountScalarFieldEnum)[keyof typeof AccountScalarFieldEnum];

  export const VerificationScalarFieldEnum: {
    id: "id";
    identifier: "identifier";
    value: "value";
    expiresAt: "expiresAt";
    createdAt: "createdAt";
    updatedAt: "updatedAt";
  };

  export type VerificationScalarFieldEnum =
    (typeof VerificationScalarFieldEnum)[keyof typeof VerificationScalarFieldEnum];

  export const IncidentScalarFieldEnum: {
    id: "id";
    monitorId: "monitorId";
    status: "status";
    severity: "severity";
    title: "title";
    description: "description";
    startedAt: "startedAt";
    resolvedAt: "resolvedAt";
    createdAt: "createdAt";
    updatedAt: "updatedAt";
  };

  export type IncidentScalarFieldEnum =
    (typeof IncidentScalarFieldEnum)[keyof typeof IncidentScalarFieldEnum];

  export const IncidentEventScalarFieldEnum: {
    id: "id";
    incidentId: "incidentId";
    type: "type";
    message: "message";
    createdAt: "createdAt";
  };

  export type IncidentEventScalarFieldEnum =
    (typeof IncidentEventScalarFieldEnum)[keyof typeof IncidentEventScalarFieldEnum];

  export const RegionalIncidentScalarFieldEnum: {
    id: "id";
    monitorId: "monitorId";
    region: "region";
    status: "status";
    startedAt: "startedAt";
    resolvedAt: "resolvedAt";
    createdAt: "createdAt";
    updatedAt: "updatedAt";
  };

  export type RegionalIncidentScalarFieldEnum =
    (typeof RegionalIncidentScalarFieldEnum)[keyof typeof RegionalIncidentScalarFieldEnum];

  export const NotificationChannelScalarFieldEnum: {
    id: "id";
    name: "name";
    type: "type";
    config: "config";
    userId: "userId";
    createdAt: "createdAt";
    updatedAt: "updatedAt";
  };

  export type NotificationChannelScalarFieldEnum =
    (typeof NotificationChannelScalarFieldEnum)[keyof typeof NotificationChannelScalarFieldEnum];

  export const AlertRuleScalarFieldEnum: {
    id: "id";
    monitorId: "monitorId";
    trigger: "trigger";
    threshold: "threshold";
    comparison: "comparison";
    targetStatus: "targetStatus";
    enabled: "enabled";
    createdAt: "createdAt";
    updatedAt: "updatedAt";
  };

  export type AlertRuleScalarFieldEnum =
    (typeof AlertRuleScalarFieldEnum)[keyof typeof AlertRuleScalarFieldEnum];

  export const MonitorScalarFieldEnum: {
    id: "id";
    name: "name";
    url: "url";
    type: "type";
    interval: "interval";
    timeout: "timeout";
    status: "status";
    userId: "userId";
    createdAt: "createdAt";
    updatedAt: "updatedAt";
    nextCheck: "nextCheck";
    lastCheck: "lastCheck";
    checkRegions: "checkRegions";
    alertThreshold: "alertThreshold";
  };

  export type MonitorScalarFieldEnum =
    (typeof MonitorScalarFieldEnum)[keyof typeof MonitorScalarFieldEnum];

  export const MonitorEventScalarFieldEnum: {
    id: "id";
    monitorId: "monitorId";
    status: "status";
    latency: "latency";
    errorReason: "errorReason";
    timestamp: "timestamp";
    region: "region";
  };

  export type MonitorEventScalarFieldEnum =
    (typeof MonitorEventScalarFieldEnum)[keyof typeof MonitorEventScalarFieldEnum];

  export const MaintenanceWindowScalarFieldEnum: {
    id: "id";
    monitorId: "monitorId";
    description: "description";
    startAt: "startAt";
    endAt: "endAt";
    createdAt: "createdAt";
    updatedAt: "updatedAt";
  };

  export type MaintenanceWindowScalarFieldEnum =
    (typeof MaintenanceWindowScalarFieldEnum)[keyof typeof MaintenanceWindowScalarFieldEnum];

  export const SortOrder: {
    asc: "asc";
    desc: "desc";
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];

  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull;
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput];

  export const QueryMode: {
    default: "default";
    insensitive: "insensitive";
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];

  export const NullsOrder: {
    first: "first";
    last: "last";
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];

  export const JsonNullValueFilter: {
    DbNull: typeof DbNull;
    JsonNull: typeof JsonNull;
    AnyNull: typeof AnyNull;
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter];

  /**
   * Field references
   */

  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, "String">;

  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, "String[]">;

  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, "Boolean">;

  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, "DateTime">;

  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    "DateTime[]"
  >;

  /**
   * Reference to a field of type 'IncidentStatus'
   */
  export type EnumIncidentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    "IncidentStatus"
  >;

  /**
   * Reference to a field of type 'IncidentStatus[]'
   */
  export type ListEnumIncidentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    "IncidentStatus[]"
  >;

  /**
   * Reference to a field of type 'Severity'
   */
  export type EnumSeverityFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, "Severity">;

  /**
   * Reference to a field of type 'Severity[]'
   */
  export type ListEnumSeverityFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    "Severity[]"
  >;

  /**
   * Reference to a field of type 'IncidentEventType'
   */
  export type EnumIncidentEventTypeFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    "IncidentEventType"
  >;

  /**
   * Reference to a field of type 'IncidentEventType[]'
   */
  export type ListEnumIncidentEventTypeFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    "IncidentEventType[]"
  >;

  /**
   * Reference to a field of type 'NotificationType'
   */
  export type EnumNotificationTypeFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    "NotificationType"
  >;

  /**
   * Reference to a field of type 'NotificationType[]'
   */
  export type ListEnumNotificationTypeFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    "NotificationType[]"
  >;

  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, "Json">;

  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    "QueryMode"
  >;

  /**
   * Reference to a field of type 'AlertTrigger'
   */
  export type EnumAlertTriggerFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    "AlertTrigger"
  >;

  /**
   * Reference to a field of type 'AlertTrigger[]'
   */
  export type ListEnumAlertTriggerFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    "AlertTrigger[]"
  >;

  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, "Int">;

  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, "Int[]">;

  /**
   * Reference to a field of type 'ComparisonOperator'
   */
  export type EnumComparisonOperatorFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    "ComparisonOperator"
  >;

  /**
   * Reference to a field of type 'ComparisonOperator[]'
   */
  export type ListEnumComparisonOperatorFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    "ComparisonOperator[]"
  >;

  /**
   * Reference to a field of type 'MonitorStatus'
   */
  export type EnumMonitorStatusFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    "MonitorStatus"
  >;

  /**
   * Reference to a field of type 'MonitorStatus[]'
   */
  export type ListEnumMonitorStatusFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    "MonitorStatus[]"
  >;

  /**
   * Reference to a field of type 'MonitorType'
   */
  export type EnumMonitorTypeFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    "MonitorType"
  >;

  /**
   * Reference to a field of type 'MonitorType[]'
   */
  export type ListEnumMonitorTypeFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    "MonitorType[]"
  >;

  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, "Float">;

  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, "Float[]">;

  /**
   * Deep Input Types
   */

  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[];
    OR?: UserWhereInput[];
    NOT?: UserWhereInput | UserWhereInput[];
    id?: StringFilter<"User"> | string;
    name?: StringFilter<"User"> | string;
    email?: StringFilter<"User"> | string;
    emailVerified?: BoolFilter<"User"> | boolean;
    image?: StringNullableFilter<"User"> | string | null;
    timezone?: StringNullableFilter<"User"> | string | null;
    dateFormat?: StringNullableFilter<"User"> | string | null;
    createdAt?: DateTimeFilter<"User"> | Date | string;
    updatedAt?: DateTimeFilter<"User"> | Date | string;
    sessions?: SessionListRelationFilter;
    accounts?: AccountListRelationFilter;
    monitors?: MonitorListRelationFilter;
    notificationChannels?: NotificationChannelListRelationFilter;
  };

  export type UserOrderByWithRelationInput = {
    id?: SortOrder;
    name?: SortOrder;
    email?: SortOrder;
    emailVerified?: SortOrder;
    image?: SortOrderInput | SortOrder;
    timezone?: SortOrderInput | SortOrder;
    dateFormat?: SortOrderInput | SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    sessions?: SessionOrderByRelationAggregateInput;
    accounts?: AccountOrderByRelationAggregateInput;
    monitors?: MonitorOrderByRelationAggregateInput;
    notificationChannels?: NotificationChannelOrderByRelationAggregateInput;
  };

  export type UserWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      email?: string;
      AND?: UserWhereInput | UserWhereInput[];
      OR?: UserWhereInput[];
      NOT?: UserWhereInput | UserWhereInput[];
      name?: StringFilter<"User"> | string;
      emailVerified?: BoolFilter<"User"> | boolean;
      image?: StringNullableFilter<"User"> | string | null;
      timezone?: StringNullableFilter<"User"> | string | null;
      dateFormat?: StringNullableFilter<"User"> | string | null;
      createdAt?: DateTimeFilter<"User"> | Date | string;
      updatedAt?: DateTimeFilter<"User"> | Date | string;
      sessions?: SessionListRelationFilter;
      accounts?: AccountListRelationFilter;
      monitors?: MonitorListRelationFilter;
      notificationChannels?: NotificationChannelListRelationFilter;
    },
    "id" | "email"
  >;

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder;
    name?: SortOrder;
    email?: SortOrder;
    emailVerified?: SortOrder;
    image?: SortOrderInput | SortOrder;
    timezone?: SortOrderInput | SortOrder;
    dateFormat?: SortOrderInput | SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    _count?: UserCountOrderByAggregateInput;
    _max?: UserMaxOrderByAggregateInput;
    _min?: UserMinOrderByAggregateInput;
  };

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[];
    OR?: UserScalarWhereWithAggregatesInput[];
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<"User"> | string;
    name?: StringWithAggregatesFilter<"User"> | string;
    email?: StringWithAggregatesFilter<"User"> | string;
    emailVerified?: BoolWithAggregatesFilter<"User"> | boolean;
    image?: StringNullableWithAggregatesFilter<"User"> | string | null;
    timezone?: StringNullableWithAggregatesFilter<"User"> | string | null;
    dateFormat?: StringNullableWithAggregatesFilter<"User"> | string | null;
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string;
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string;
  };

  export type SessionWhereInput = {
    AND?: SessionWhereInput | SessionWhereInput[];
    OR?: SessionWhereInput[];
    NOT?: SessionWhereInput | SessionWhereInput[];
    id?: StringFilter<"Session"> | string;
    expiresAt?: DateTimeFilter<"Session"> | Date | string;
    token?: StringFilter<"Session"> | string;
    createdAt?: DateTimeFilter<"Session"> | Date | string;
    updatedAt?: DateTimeFilter<"Session"> | Date | string;
    ipAddress?: StringNullableFilter<"Session"> | string | null;
    userAgent?: StringNullableFilter<"Session"> | string | null;
    userId?: StringFilter<"Session"> | string;
    user?: XOR<UserScalarRelationFilter, UserWhereInput>;
  };

  export type SessionOrderByWithRelationInput = {
    id?: SortOrder;
    expiresAt?: SortOrder;
    token?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    ipAddress?: SortOrderInput | SortOrder;
    userAgent?: SortOrderInput | SortOrder;
    userId?: SortOrder;
    user?: UserOrderByWithRelationInput;
  };

  export type SessionWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      token?: string;
      AND?: SessionWhereInput | SessionWhereInput[];
      OR?: SessionWhereInput[];
      NOT?: SessionWhereInput | SessionWhereInput[];
      expiresAt?: DateTimeFilter<"Session"> | Date | string;
      createdAt?: DateTimeFilter<"Session"> | Date | string;
      updatedAt?: DateTimeFilter<"Session"> | Date | string;
      ipAddress?: StringNullableFilter<"Session"> | string | null;
      userAgent?: StringNullableFilter<"Session"> | string | null;
      userId?: StringFilter<"Session"> | string;
      user?: XOR<UserScalarRelationFilter, UserWhereInput>;
    },
    "id" | "token"
  >;

  export type SessionOrderByWithAggregationInput = {
    id?: SortOrder;
    expiresAt?: SortOrder;
    token?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    ipAddress?: SortOrderInput | SortOrder;
    userAgent?: SortOrderInput | SortOrder;
    userId?: SortOrder;
    _count?: SessionCountOrderByAggregateInput;
    _max?: SessionMaxOrderByAggregateInput;
    _min?: SessionMinOrderByAggregateInput;
  };

  export type SessionScalarWhereWithAggregatesInput = {
    AND?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[];
    OR?: SessionScalarWhereWithAggregatesInput[];
    NOT?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<"Session"> | string;
    expiresAt?: DateTimeWithAggregatesFilter<"Session"> | Date | string;
    token?: StringWithAggregatesFilter<"Session"> | string;
    createdAt?: DateTimeWithAggregatesFilter<"Session"> | Date | string;
    updatedAt?: DateTimeWithAggregatesFilter<"Session"> | Date | string;
    ipAddress?: StringNullableWithAggregatesFilter<"Session"> | string | null;
    userAgent?: StringNullableWithAggregatesFilter<"Session"> | string | null;
    userId?: StringWithAggregatesFilter<"Session"> | string;
  };

  export type AccountWhereInput = {
    AND?: AccountWhereInput | AccountWhereInput[];
    OR?: AccountWhereInput[];
    NOT?: AccountWhereInput | AccountWhereInput[];
    id?: StringFilter<"Account"> | string;
    accountId?: StringFilter<"Account"> | string;
    providerId?: StringFilter<"Account"> | string;
    userId?: StringFilter<"Account"> | string;
    accessToken?: StringNullableFilter<"Account"> | string | null;
    refreshToken?: StringNullableFilter<"Account"> | string | null;
    idToken?: StringNullableFilter<"Account"> | string | null;
    accessTokenExpiresAt?: DateTimeNullableFilter<"Account"> | Date | string | null;
    refreshTokenExpiresAt?: DateTimeNullableFilter<"Account"> | Date | string | null;
    scope?: StringNullableFilter<"Account"> | string | null;
    password?: StringNullableFilter<"Account"> | string | null;
    createdAt?: DateTimeFilter<"Account"> | Date | string;
    updatedAt?: DateTimeFilter<"Account"> | Date | string;
    user?: XOR<UserScalarRelationFilter, UserWhereInput>;
  };

  export type AccountOrderByWithRelationInput = {
    id?: SortOrder;
    accountId?: SortOrder;
    providerId?: SortOrder;
    userId?: SortOrder;
    accessToken?: SortOrderInput | SortOrder;
    refreshToken?: SortOrderInput | SortOrder;
    idToken?: SortOrderInput | SortOrder;
    accessTokenExpiresAt?: SortOrderInput | SortOrder;
    refreshTokenExpiresAt?: SortOrderInput | SortOrder;
    scope?: SortOrderInput | SortOrder;
    password?: SortOrderInput | SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    user?: UserOrderByWithRelationInput;
  };

  export type AccountWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      AND?: AccountWhereInput | AccountWhereInput[];
      OR?: AccountWhereInput[];
      NOT?: AccountWhereInput | AccountWhereInput[];
      accountId?: StringFilter<"Account"> | string;
      providerId?: StringFilter<"Account"> | string;
      userId?: StringFilter<"Account"> | string;
      accessToken?: StringNullableFilter<"Account"> | string | null;
      refreshToken?: StringNullableFilter<"Account"> | string | null;
      idToken?: StringNullableFilter<"Account"> | string | null;
      accessTokenExpiresAt?: DateTimeNullableFilter<"Account"> | Date | string | null;
      refreshTokenExpiresAt?: DateTimeNullableFilter<"Account"> | Date | string | null;
      scope?: StringNullableFilter<"Account"> | string | null;
      password?: StringNullableFilter<"Account"> | string | null;
      createdAt?: DateTimeFilter<"Account"> | Date | string;
      updatedAt?: DateTimeFilter<"Account"> | Date | string;
      user?: XOR<UserScalarRelationFilter, UserWhereInput>;
    },
    "id"
  >;

  export type AccountOrderByWithAggregationInput = {
    id?: SortOrder;
    accountId?: SortOrder;
    providerId?: SortOrder;
    userId?: SortOrder;
    accessToken?: SortOrderInput | SortOrder;
    refreshToken?: SortOrderInput | SortOrder;
    idToken?: SortOrderInput | SortOrder;
    accessTokenExpiresAt?: SortOrderInput | SortOrder;
    refreshTokenExpiresAt?: SortOrderInput | SortOrder;
    scope?: SortOrderInput | SortOrder;
    password?: SortOrderInput | SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    _count?: AccountCountOrderByAggregateInput;
    _max?: AccountMaxOrderByAggregateInput;
    _min?: AccountMinOrderByAggregateInput;
  };

  export type AccountScalarWhereWithAggregatesInput = {
    AND?: AccountScalarWhereWithAggregatesInput | AccountScalarWhereWithAggregatesInput[];
    OR?: AccountScalarWhereWithAggregatesInput[];
    NOT?: AccountScalarWhereWithAggregatesInput | AccountScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<"Account"> | string;
    accountId?: StringWithAggregatesFilter<"Account"> | string;
    providerId?: StringWithAggregatesFilter<"Account"> | string;
    userId?: StringWithAggregatesFilter<"Account"> | string;
    accessToken?: StringNullableWithAggregatesFilter<"Account"> | string | null;
    refreshToken?: StringNullableWithAggregatesFilter<"Account"> | string | null;
    idToken?: StringNullableWithAggregatesFilter<"Account"> | string | null;
    accessTokenExpiresAt?: DateTimeNullableWithAggregatesFilter<"Account"> | Date | string | null;
    refreshTokenExpiresAt?: DateTimeNullableWithAggregatesFilter<"Account"> | Date | string | null;
    scope?: StringNullableWithAggregatesFilter<"Account"> | string | null;
    password?: StringNullableWithAggregatesFilter<"Account"> | string | null;
    createdAt?: DateTimeWithAggregatesFilter<"Account"> | Date | string;
    updatedAt?: DateTimeWithAggregatesFilter<"Account"> | Date | string;
  };

  export type VerificationWhereInput = {
    AND?: VerificationWhereInput | VerificationWhereInput[];
    OR?: VerificationWhereInput[];
    NOT?: VerificationWhereInput | VerificationWhereInput[];
    id?: StringFilter<"Verification"> | string;
    identifier?: StringFilter<"Verification"> | string;
    value?: StringFilter<"Verification"> | string;
    expiresAt?: DateTimeFilter<"Verification"> | Date | string;
    createdAt?: DateTimeFilter<"Verification"> | Date | string;
    updatedAt?: DateTimeFilter<"Verification"> | Date | string;
  };

  export type VerificationOrderByWithRelationInput = {
    id?: SortOrder;
    identifier?: SortOrder;
    value?: SortOrder;
    expiresAt?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type VerificationWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      AND?: VerificationWhereInput | VerificationWhereInput[];
      OR?: VerificationWhereInput[];
      NOT?: VerificationWhereInput | VerificationWhereInput[];
      identifier?: StringFilter<"Verification"> | string;
      value?: StringFilter<"Verification"> | string;
      expiresAt?: DateTimeFilter<"Verification"> | Date | string;
      createdAt?: DateTimeFilter<"Verification"> | Date | string;
      updatedAt?: DateTimeFilter<"Verification"> | Date | string;
    },
    "id"
  >;

  export type VerificationOrderByWithAggregationInput = {
    id?: SortOrder;
    identifier?: SortOrder;
    value?: SortOrder;
    expiresAt?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    _count?: VerificationCountOrderByAggregateInput;
    _max?: VerificationMaxOrderByAggregateInput;
    _min?: VerificationMinOrderByAggregateInput;
  };

  export type VerificationScalarWhereWithAggregatesInput = {
    AND?: VerificationScalarWhereWithAggregatesInput | VerificationScalarWhereWithAggregatesInput[];
    OR?: VerificationScalarWhereWithAggregatesInput[];
    NOT?: VerificationScalarWhereWithAggregatesInput | VerificationScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<"Verification"> | string;
    identifier?: StringWithAggregatesFilter<"Verification"> | string;
    value?: StringWithAggregatesFilter<"Verification"> | string;
    expiresAt?: DateTimeWithAggregatesFilter<"Verification"> | Date | string;
    createdAt?: DateTimeWithAggregatesFilter<"Verification"> | Date | string;
    updatedAt?: DateTimeWithAggregatesFilter<"Verification"> | Date | string;
  };

  export type IncidentWhereInput = {
    AND?: IncidentWhereInput | IncidentWhereInput[];
    OR?: IncidentWhereInput[];
    NOT?: IncidentWhereInput | IncidentWhereInput[];
    id?: StringFilter<"Incident"> | string;
    monitorId?: StringFilter<"Incident"> | string;
    status?: EnumIncidentStatusFilter<"Incident"> | $Enums.IncidentStatus;
    severity?: EnumSeverityFilter<"Incident"> | $Enums.Severity;
    title?: StringFilter<"Incident"> | string;
    description?: StringNullableFilter<"Incident"> | string | null;
    startedAt?: DateTimeFilter<"Incident"> | Date | string;
    resolvedAt?: DateTimeNullableFilter<"Incident"> | Date | string | null;
    createdAt?: DateTimeFilter<"Incident"> | Date | string;
    updatedAt?: DateTimeFilter<"Incident"> | Date | string;
    monitor?: XOR<MonitorScalarRelationFilter, MonitorWhereInput>;
    events?: IncidentEventListRelationFilter;
  };

  export type IncidentOrderByWithRelationInput = {
    id?: SortOrder;
    monitorId?: SortOrder;
    status?: SortOrder;
    severity?: SortOrder;
    title?: SortOrder;
    description?: SortOrderInput | SortOrder;
    startedAt?: SortOrder;
    resolvedAt?: SortOrderInput | SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    monitor?: MonitorOrderByWithRelationInput;
    events?: IncidentEventOrderByRelationAggregateInput;
  };

  export type IncidentWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      AND?: IncidentWhereInput | IncidentWhereInput[];
      OR?: IncidentWhereInput[];
      NOT?: IncidentWhereInput | IncidentWhereInput[];
      monitorId?: StringFilter<"Incident"> | string;
      status?: EnumIncidentStatusFilter<"Incident"> | $Enums.IncidentStatus;
      severity?: EnumSeverityFilter<"Incident"> | $Enums.Severity;
      title?: StringFilter<"Incident"> | string;
      description?: StringNullableFilter<"Incident"> | string | null;
      startedAt?: DateTimeFilter<"Incident"> | Date | string;
      resolvedAt?: DateTimeNullableFilter<"Incident"> | Date | string | null;
      createdAt?: DateTimeFilter<"Incident"> | Date | string;
      updatedAt?: DateTimeFilter<"Incident"> | Date | string;
      monitor?: XOR<MonitorScalarRelationFilter, MonitorWhereInput>;
      events?: IncidentEventListRelationFilter;
    },
    "id"
  >;

  export type IncidentOrderByWithAggregationInput = {
    id?: SortOrder;
    monitorId?: SortOrder;
    status?: SortOrder;
    severity?: SortOrder;
    title?: SortOrder;
    description?: SortOrderInput | SortOrder;
    startedAt?: SortOrder;
    resolvedAt?: SortOrderInput | SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    _count?: IncidentCountOrderByAggregateInput;
    _max?: IncidentMaxOrderByAggregateInput;
    _min?: IncidentMinOrderByAggregateInput;
  };

  export type IncidentScalarWhereWithAggregatesInput = {
    AND?: IncidentScalarWhereWithAggregatesInput | IncidentScalarWhereWithAggregatesInput[];
    OR?: IncidentScalarWhereWithAggregatesInput[];
    NOT?: IncidentScalarWhereWithAggregatesInput | IncidentScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<"Incident"> | string;
    monitorId?: StringWithAggregatesFilter<"Incident"> | string;
    status?: EnumIncidentStatusWithAggregatesFilter<"Incident"> | $Enums.IncidentStatus;
    severity?: EnumSeverityWithAggregatesFilter<"Incident"> | $Enums.Severity;
    title?: StringWithAggregatesFilter<"Incident"> | string;
    description?: StringNullableWithAggregatesFilter<"Incident"> | string | null;
    startedAt?: DateTimeWithAggregatesFilter<"Incident"> | Date | string;
    resolvedAt?: DateTimeNullableWithAggregatesFilter<"Incident"> | Date | string | null;
    createdAt?: DateTimeWithAggregatesFilter<"Incident"> | Date | string;
    updatedAt?: DateTimeWithAggregatesFilter<"Incident"> | Date | string;
  };

  export type IncidentEventWhereInput = {
    AND?: IncidentEventWhereInput | IncidentEventWhereInput[];
    OR?: IncidentEventWhereInput[];
    NOT?: IncidentEventWhereInput | IncidentEventWhereInput[];
    id?: StringFilter<"IncidentEvent"> | string;
    incidentId?: StringFilter<"IncidentEvent"> | string;
    type?: EnumIncidentEventTypeFilter<"IncidentEvent"> | $Enums.IncidentEventType;
    message?: StringFilter<"IncidentEvent"> | string;
    createdAt?: DateTimeFilter<"IncidentEvent"> | Date | string;
    incident?: XOR<IncidentScalarRelationFilter, IncidentWhereInput>;
  };

  export type IncidentEventOrderByWithRelationInput = {
    id?: SortOrder;
    incidentId?: SortOrder;
    type?: SortOrder;
    message?: SortOrder;
    createdAt?: SortOrder;
    incident?: IncidentOrderByWithRelationInput;
  };

  export type IncidentEventWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      AND?: IncidentEventWhereInput | IncidentEventWhereInput[];
      OR?: IncidentEventWhereInput[];
      NOT?: IncidentEventWhereInput | IncidentEventWhereInput[];
      incidentId?: StringFilter<"IncidentEvent"> | string;
      type?: EnumIncidentEventTypeFilter<"IncidentEvent"> | $Enums.IncidentEventType;
      message?: StringFilter<"IncidentEvent"> | string;
      createdAt?: DateTimeFilter<"IncidentEvent"> | Date | string;
      incident?: XOR<IncidentScalarRelationFilter, IncidentWhereInput>;
    },
    "id"
  >;

  export type IncidentEventOrderByWithAggregationInput = {
    id?: SortOrder;
    incidentId?: SortOrder;
    type?: SortOrder;
    message?: SortOrder;
    createdAt?: SortOrder;
    _count?: IncidentEventCountOrderByAggregateInput;
    _max?: IncidentEventMaxOrderByAggregateInput;
    _min?: IncidentEventMinOrderByAggregateInput;
  };

  export type IncidentEventScalarWhereWithAggregatesInput = {
    AND?:
      | IncidentEventScalarWhereWithAggregatesInput
      | IncidentEventScalarWhereWithAggregatesInput[];
    OR?: IncidentEventScalarWhereWithAggregatesInput[];
    NOT?:
      | IncidentEventScalarWhereWithAggregatesInput
      | IncidentEventScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<"IncidentEvent"> | string;
    incidentId?: StringWithAggregatesFilter<"IncidentEvent"> | string;
    type?: EnumIncidentEventTypeWithAggregatesFilter<"IncidentEvent"> | $Enums.IncidentEventType;
    message?: StringWithAggregatesFilter<"IncidentEvent"> | string;
    createdAt?: DateTimeWithAggregatesFilter<"IncidentEvent"> | Date | string;
  };

  export type RegionalIncidentWhereInput = {
    AND?: RegionalIncidentWhereInput | RegionalIncidentWhereInput[];
    OR?: RegionalIncidentWhereInput[];
    NOT?: RegionalIncidentWhereInput | RegionalIncidentWhereInput[];
    id?: StringFilter<"RegionalIncident"> | string;
    monitorId?: StringFilter<"RegionalIncident"> | string;
    region?: StringFilter<"RegionalIncident"> | string;
    status?: EnumIncidentStatusFilter<"RegionalIncident"> | $Enums.IncidentStatus;
    startedAt?: DateTimeFilter<"RegionalIncident"> | Date | string;
    resolvedAt?: DateTimeNullableFilter<"RegionalIncident"> | Date | string | null;
    createdAt?: DateTimeFilter<"RegionalIncident"> | Date | string;
    updatedAt?: DateTimeFilter<"RegionalIncident"> | Date | string;
    monitor?: XOR<MonitorScalarRelationFilter, MonitorWhereInput>;
  };

  export type RegionalIncidentOrderByWithRelationInput = {
    id?: SortOrder;
    monitorId?: SortOrder;
    region?: SortOrder;
    status?: SortOrder;
    startedAt?: SortOrder;
    resolvedAt?: SortOrderInput | SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    monitor?: MonitorOrderByWithRelationInput;
  };

  export type RegionalIncidentWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      AND?: RegionalIncidentWhereInput | RegionalIncidentWhereInput[];
      OR?: RegionalIncidentWhereInput[];
      NOT?: RegionalIncidentWhereInput | RegionalIncidentWhereInput[];
      monitorId?: StringFilter<"RegionalIncident"> | string;
      region?: StringFilter<"RegionalIncident"> | string;
      status?: EnumIncidentStatusFilter<"RegionalIncident"> | $Enums.IncidentStatus;
      startedAt?: DateTimeFilter<"RegionalIncident"> | Date | string;
      resolvedAt?: DateTimeNullableFilter<"RegionalIncident"> | Date | string | null;
      createdAt?: DateTimeFilter<"RegionalIncident"> | Date | string;
      updatedAt?: DateTimeFilter<"RegionalIncident"> | Date | string;
      monitor?: XOR<MonitorScalarRelationFilter, MonitorWhereInput>;
    },
    "id"
  >;

  export type RegionalIncidentOrderByWithAggregationInput = {
    id?: SortOrder;
    monitorId?: SortOrder;
    region?: SortOrder;
    status?: SortOrder;
    startedAt?: SortOrder;
    resolvedAt?: SortOrderInput | SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    _count?: RegionalIncidentCountOrderByAggregateInput;
    _max?: RegionalIncidentMaxOrderByAggregateInput;
    _min?: RegionalIncidentMinOrderByAggregateInput;
  };

  export type RegionalIncidentScalarWhereWithAggregatesInput = {
    AND?:
      | RegionalIncidentScalarWhereWithAggregatesInput
      | RegionalIncidentScalarWhereWithAggregatesInput[];
    OR?: RegionalIncidentScalarWhereWithAggregatesInput[];
    NOT?:
      | RegionalIncidentScalarWhereWithAggregatesInput
      | RegionalIncidentScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<"RegionalIncident"> | string;
    monitorId?: StringWithAggregatesFilter<"RegionalIncident"> | string;
    region?: StringWithAggregatesFilter<"RegionalIncident"> | string;
    status?: EnumIncidentStatusWithAggregatesFilter<"RegionalIncident"> | $Enums.IncidentStatus;
    startedAt?: DateTimeWithAggregatesFilter<"RegionalIncident"> | Date | string;
    resolvedAt?: DateTimeNullableWithAggregatesFilter<"RegionalIncident"> | Date | string | null;
    createdAt?: DateTimeWithAggregatesFilter<"RegionalIncident"> | Date | string;
    updatedAt?: DateTimeWithAggregatesFilter<"RegionalIncident"> | Date | string;
  };

  export type NotificationChannelWhereInput = {
    AND?: NotificationChannelWhereInput | NotificationChannelWhereInput[];
    OR?: NotificationChannelWhereInput[];
    NOT?: NotificationChannelWhereInput | NotificationChannelWhereInput[];
    id?: StringFilter<"NotificationChannel"> | string;
    name?: StringFilter<"NotificationChannel"> | string;
    type?: EnumNotificationTypeFilter<"NotificationChannel"> | $Enums.NotificationType;
    config?: JsonFilter<"NotificationChannel">;
    userId?: StringFilter<"NotificationChannel"> | string;
    createdAt?: DateTimeFilter<"NotificationChannel"> | Date | string;
    updatedAt?: DateTimeFilter<"NotificationChannel"> | Date | string;
    user?: XOR<UserScalarRelationFilter, UserWhereInput>;
    alertRules?: AlertRuleListRelationFilter;
  };

  export type NotificationChannelOrderByWithRelationInput = {
    id?: SortOrder;
    name?: SortOrder;
    type?: SortOrder;
    config?: SortOrder;
    userId?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    user?: UserOrderByWithRelationInput;
    alertRules?: AlertRuleOrderByRelationAggregateInput;
  };

  export type NotificationChannelWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      AND?: NotificationChannelWhereInput | NotificationChannelWhereInput[];
      OR?: NotificationChannelWhereInput[];
      NOT?: NotificationChannelWhereInput | NotificationChannelWhereInput[];
      name?: StringFilter<"NotificationChannel"> | string;
      type?: EnumNotificationTypeFilter<"NotificationChannel"> | $Enums.NotificationType;
      config?: JsonFilter<"NotificationChannel">;
      userId?: StringFilter<"NotificationChannel"> | string;
      createdAt?: DateTimeFilter<"NotificationChannel"> | Date | string;
      updatedAt?: DateTimeFilter<"NotificationChannel"> | Date | string;
      user?: XOR<UserScalarRelationFilter, UserWhereInput>;
      alertRules?: AlertRuleListRelationFilter;
    },
    "id"
  >;

  export type NotificationChannelOrderByWithAggregationInput = {
    id?: SortOrder;
    name?: SortOrder;
    type?: SortOrder;
    config?: SortOrder;
    userId?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    _count?: NotificationChannelCountOrderByAggregateInput;
    _max?: NotificationChannelMaxOrderByAggregateInput;
    _min?: NotificationChannelMinOrderByAggregateInput;
  };

  export type NotificationChannelScalarWhereWithAggregatesInput = {
    AND?:
      | NotificationChannelScalarWhereWithAggregatesInput
      | NotificationChannelScalarWhereWithAggregatesInput[];
    OR?: NotificationChannelScalarWhereWithAggregatesInput[];
    NOT?:
      | NotificationChannelScalarWhereWithAggregatesInput
      | NotificationChannelScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<"NotificationChannel"> | string;
    name?: StringWithAggregatesFilter<"NotificationChannel"> | string;
    type?:
      | EnumNotificationTypeWithAggregatesFilter<"NotificationChannel">
      | $Enums.NotificationType;
    config?: JsonWithAggregatesFilter<"NotificationChannel">;
    userId?: StringWithAggregatesFilter<"NotificationChannel"> | string;
    createdAt?: DateTimeWithAggregatesFilter<"NotificationChannel"> | Date | string;
    updatedAt?: DateTimeWithAggregatesFilter<"NotificationChannel"> | Date | string;
  };

  export type AlertRuleWhereInput = {
    AND?: AlertRuleWhereInput | AlertRuleWhereInput[];
    OR?: AlertRuleWhereInput[];
    NOT?: AlertRuleWhereInput | AlertRuleWhereInput[];
    id?: StringFilter<"AlertRule"> | string;
    monitorId?: StringFilter<"AlertRule"> | string;
    trigger?: EnumAlertTriggerFilter<"AlertRule"> | $Enums.AlertTrigger;
    threshold?: IntNullableFilter<"AlertRule"> | number | null;
    comparison?:
      | EnumComparisonOperatorNullableFilter<"AlertRule">
      | $Enums.ComparisonOperator
      | null;
    targetStatus?: EnumMonitorStatusNullableFilter<"AlertRule"> | $Enums.MonitorStatus | null;
    enabled?: BoolFilter<"AlertRule"> | boolean;
    createdAt?: DateTimeFilter<"AlertRule"> | Date | string;
    updatedAt?: DateTimeFilter<"AlertRule"> | Date | string;
    monitor?: XOR<MonitorScalarRelationFilter, MonitorWhereInput>;
    channels?: NotificationChannelListRelationFilter;
  };

  export type AlertRuleOrderByWithRelationInput = {
    id?: SortOrder;
    monitorId?: SortOrder;
    trigger?: SortOrder;
    threshold?: SortOrderInput | SortOrder;
    comparison?: SortOrderInput | SortOrder;
    targetStatus?: SortOrderInput | SortOrder;
    enabled?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    monitor?: MonitorOrderByWithRelationInput;
    channels?: NotificationChannelOrderByRelationAggregateInput;
  };

  export type AlertRuleWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      AND?: AlertRuleWhereInput | AlertRuleWhereInput[];
      OR?: AlertRuleWhereInput[];
      NOT?: AlertRuleWhereInput | AlertRuleWhereInput[];
      monitorId?: StringFilter<"AlertRule"> | string;
      trigger?: EnumAlertTriggerFilter<"AlertRule"> | $Enums.AlertTrigger;
      threshold?: IntNullableFilter<"AlertRule"> | number | null;
      comparison?:
        | EnumComparisonOperatorNullableFilter<"AlertRule">
        | $Enums.ComparisonOperator
        | null;
      targetStatus?: EnumMonitorStatusNullableFilter<"AlertRule"> | $Enums.MonitorStatus | null;
      enabled?: BoolFilter<"AlertRule"> | boolean;
      createdAt?: DateTimeFilter<"AlertRule"> | Date | string;
      updatedAt?: DateTimeFilter<"AlertRule"> | Date | string;
      monitor?: XOR<MonitorScalarRelationFilter, MonitorWhereInput>;
      channels?: NotificationChannelListRelationFilter;
    },
    "id"
  >;

  export type AlertRuleOrderByWithAggregationInput = {
    id?: SortOrder;
    monitorId?: SortOrder;
    trigger?: SortOrder;
    threshold?: SortOrderInput | SortOrder;
    comparison?: SortOrderInput | SortOrder;
    targetStatus?: SortOrderInput | SortOrder;
    enabled?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    _count?: AlertRuleCountOrderByAggregateInput;
    _avg?: AlertRuleAvgOrderByAggregateInput;
    _max?: AlertRuleMaxOrderByAggregateInput;
    _min?: AlertRuleMinOrderByAggregateInput;
    _sum?: AlertRuleSumOrderByAggregateInput;
  };

  export type AlertRuleScalarWhereWithAggregatesInput = {
    AND?: AlertRuleScalarWhereWithAggregatesInput | AlertRuleScalarWhereWithAggregatesInput[];
    OR?: AlertRuleScalarWhereWithAggregatesInput[];
    NOT?: AlertRuleScalarWhereWithAggregatesInput | AlertRuleScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<"AlertRule"> | string;
    monitorId?: StringWithAggregatesFilter<"AlertRule"> | string;
    trigger?: EnumAlertTriggerWithAggregatesFilter<"AlertRule"> | $Enums.AlertTrigger;
    threshold?: IntNullableWithAggregatesFilter<"AlertRule"> | number | null;
    comparison?:
      | EnumComparisonOperatorNullableWithAggregatesFilter<"AlertRule">
      | $Enums.ComparisonOperator
      | null;
    targetStatus?:
      | EnumMonitorStatusNullableWithAggregatesFilter<"AlertRule">
      | $Enums.MonitorStatus
      | null;
    enabled?: BoolWithAggregatesFilter<"AlertRule"> | boolean;
    createdAt?: DateTimeWithAggregatesFilter<"AlertRule"> | Date | string;
    updatedAt?: DateTimeWithAggregatesFilter<"AlertRule"> | Date | string;
  };

  export type MonitorWhereInput = {
    AND?: MonitorWhereInput | MonitorWhereInput[];
    OR?: MonitorWhereInput[];
    NOT?: MonitorWhereInput | MonitorWhereInput[];
    id?: StringFilter<"Monitor"> | string;
    name?: StringFilter<"Monitor"> | string;
    url?: StringFilter<"Monitor"> | string;
    type?: EnumMonitorTypeFilter<"Monitor"> | $Enums.MonitorType;
    interval?: IntFilter<"Monitor"> | number;
    timeout?: IntFilter<"Monitor"> | number;
    status?: EnumMonitorStatusFilter<"Monitor"> | $Enums.MonitorStatus;
    userId?: StringFilter<"Monitor"> | string;
    createdAt?: DateTimeFilter<"Monitor"> | Date | string;
    updatedAt?: DateTimeFilter<"Monitor"> | Date | string;
    nextCheck?: DateTimeNullableFilter<"Monitor"> | Date | string | null;
    lastCheck?: DateTimeNullableFilter<"Monitor"> | Date | string | null;
    checkRegions?: StringNullableFilter<"Monitor"> | string | null;
    alertThreshold?: IntFilter<"Monitor"> | number;
    user?: XOR<UserScalarRelationFilter, UserWhereInput>;
    events?: MonitorEventListRelationFilter;
    maintenanceWindows?: MaintenanceWindowListRelationFilter;
    alertRules?: AlertRuleListRelationFilter;
    incidents?: IncidentListRelationFilter;
    regionalIncidents?: RegionalIncidentListRelationFilter;
  };

  export type MonitorOrderByWithRelationInput = {
    id?: SortOrder;
    name?: SortOrder;
    url?: SortOrder;
    type?: SortOrder;
    interval?: SortOrder;
    timeout?: SortOrder;
    status?: SortOrder;
    userId?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    nextCheck?: SortOrderInput | SortOrder;
    lastCheck?: SortOrderInput | SortOrder;
    checkRegions?: SortOrderInput | SortOrder;
    alertThreshold?: SortOrder;
    user?: UserOrderByWithRelationInput;
    events?: MonitorEventOrderByRelationAggregateInput;
    maintenanceWindows?: MaintenanceWindowOrderByRelationAggregateInput;
    alertRules?: AlertRuleOrderByRelationAggregateInput;
    incidents?: IncidentOrderByRelationAggregateInput;
    regionalIncidents?: RegionalIncidentOrderByRelationAggregateInput;
  };

  export type MonitorWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      AND?: MonitorWhereInput | MonitorWhereInput[];
      OR?: MonitorWhereInput[];
      NOT?: MonitorWhereInput | MonitorWhereInput[];
      name?: StringFilter<"Monitor"> | string;
      url?: StringFilter<"Monitor"> | string;
      type?: EnumMonitorTypeFilter<"Monitor"> | $Enums.MonitorType;
      interval?: IntFilter<"Monitor"> | number;
      timeout?: IntFilter<"Monitor"> | number;
      status?: EnumMonitorStatusFilter<"Monitor"> | $Enums.MonitorStatus;
      userId?: StringFilter<"Monitor"> | string;
      createdAt?: DateTimeFilter<"Monitor"> | Date | string;
      updatedAt?: DateTimeFilter<"Monitor"> | Date | string;
      nextCheck?: DateTimeNullableFilter<"Monitor"> | Date | string | null;
      lastCheck?: DateTimeNullableFilter<"Monitor"> | Date | string | null;
      checkRegions?: StringNullableFilter<"Monitor"> | string | null;
      alertThreshold?: IntFilter<"Monitor"> | number;
      user?: XOR<UserScalarRelationFilter, UserWhereInput>;
      events?: MonitorEventListRelationFilter;
      maintenanceWindows?: MaintenanceWindowListRelationFilter;
      alertRules?: AlertRuleListRelationFilter;
      incidents?: IncidentListRelationFilter;
      regionalIncidents?: RegionalIncidentListRelationFilter;
    },
    "id"
  >;

  export type MonitorOrderByWithAggregationInput = {
    id?: SortOrder;
    name?: SortOrder;
    url?: SortOrder;
    type?: SortOrder;
    interval?: SortOrder;
    timeout?: SortOrder;
    status?: SortOrder;
    userId?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    nextCheck?: SortOrderInput | SortOrder;
    lastCheck?: SortOrderInput | SortOrder;
    checkRegions?: SortOrderInput | SortOrder;
    alertThreshold?: SortOrder;
    _count?: MonitorCountOrderByAggregateInput;
    _avg?: MonitorAvgOrderByAggregateInput;
    _max?: MonitorMaxOrderByAggregateInput;
    _min?: MonitorMinOrderByAggregateInput;
    _sum?: MonitorSumOrderByAggregateInput;
  };

  export type MonitorScalarWhereWithAggregatesInput = {
    AND?: MonitorScalarWhereWithAggregatesInput | MonitorScalarWhereWithAggregatesInput[];
    OR?: MonitorScalarWhereWithAggregatesInput[];
    NOT?: MonitorScalarWhereWithAggregatesInput | MonitorScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<"Monitor"> | string;
    name?: StringWithAggregatesFilter<"Monitor"> | string;
    url?: StringWithAggregatesFilter<"Monitor"> | string;
    type?: EnumMonitorTypeWithAggregatesFilter<"Monitor"> | $Enums.MonitorType;
    interval?: IntWithAggregatesFilter<"Monitor"> | number;
    timeout?: IntWithAggregatesFilter<"Monitor"> | number;
    status?: EnumMonitorStatusWithAggregatesFilter<"Monitor"> | $Enums.MonitorStatus;
    userId?: StringWithAggregatesFilter<"Monitor"> | string;
    createdAt?: DateTimeWithAggregatesFilter<"Monitor"> | Date | string;
    updatedAt?: DateTimeWithAggregatesFilter<"Monitor"> | Date | string;
    nextCheck?: DateTimeNullableWithAggregatesFilter<"Monitor"> | Date | string | null;
    lastCheck?: DateTimeNullableWithAggregatesFilter<"Monitor"> | Date | string | null;
    checkRegions?: StringNullableWithAggregatesFilter<"Monitor"> | string | null;
    alertThreshold?: IntWithAggregatesFilter<"Monitor"> | number;
  };

  export type MonitorEventWhereInput = {
    AND?: MonitorEventWhereInput | MonitorEventWhereInput[];
    OR?: MonitorEventWhereInput[];
    NOT?: MonitorEventWhereInput | MonitorEventWhereInput[];
    id?: StringFilter<"MonitorEvent"> | string;
    monitorId?: StringFilter<"MonitorEvent"> | string;
    status?: EnumMonitorStatusFilter<"MonitorEvent"> | $Enums.MonitorStatus;
    latency?: IntFilter<"MonitorEvent"> | number;
    errorReason?: StringNullableFilter<"MonitorEvent"> | string | null;
    timestamp?: DateTimeFilter<"MonitorEvent"> | Date | string;
    region?: StringNullableFilter<"MonitorEvent"> | string | null;
    monitor?: XOR<MonitorScalarRelationFilter, MonitorWhereInput>;
  };

  export type MonitorEventOrderByWithRelationInput = {
    id?: SortOrder;
    monitorId?: SortOrder;
    status?: SortOrder;
    latency?: SortOrder;
    errorReason?: SortOrderInput | SortOrder;
    timestamp?: SortOrder;
    region?: SortOrderInput | SortOrder;
    monitor?: MonitorOrderByWithRelationInput;
  };

  export type MonitorEventWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      AND?: MonitorEventWhereInput | MonitorEventWhereInput[];
      OR?: MonitorEventWhereInput[];
      NOT?: MonitorEventWhereInput | MonitorEventWhereInput[];
      monitorId?: StringFilter<"MonitorEvent"> | string;
      status?: EnumMonitorStatusFilter<"MonitorEvent"> | $Enums.MonitorStatus;
      latency?: IntFilter<"MonitorEvent"> | number;
      errorReason?: StringNullableFilter<"MonitorEvent"> | string | null;
      timestamp?: DateTimeFilter<"MonitorEvent"> | Date | string;
      region?: StringNullableFilter<"MonitorEvent"> | string | null;
      monitor?: XOR<MonitorScalarRelationFilter, MonitorWhereInput>;
    },
    "id"
  >;

  export type MonitorEventOrderByWithAggregationInput = {
    id?: SortOrder;
    monitorId?: SortOrder;
    status?: SortOrder;
    latency?: SortOrder;
    errorReason?: SortOrderInput | SortOrder;
    timestamp?: SortOrder;
    region?: SortOrderInput | SortOrder;
    _count?: MonitorEventCountOrderByAggregateInput;
    _avg?: MonitorEventAvgOrderByAggregateInput;
    _max?: MonitorEventMaxOrderByAggregateInput;
    _min?: MonitorEventMinOrderByAggregateInput;
    _sum?: MonitorEventSumOrderByAggregateInput;
  };

  export type MonitorEventScalarWhereWithAggregatesInput = {
    AND?: MonitorEventScalarWhereWithAggregatesInput | MonitorEventScalarWhereWithAggregatesInput[];
    OR?: MonitorEventScalarWhereWithAggregatesInput[];
    NOT?: MonitorEventScalarWhereWithAggregatesInput | MonitorEventScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<"MonitorEvent"> | string;
    monitorId?: StringWithAggregatesFilter<"MonitorEvent"> | string;
    status?: EnumMonitorStatusWithAggregatesFilter<"MonitorEvent"> | $Enums.MonitorStatus;
    latency?: IntWithAggregatesFilter<"MonitorEvent"> | number;
    errorReason?: StringNullableWithAggregatesFilter<"MonitorEvent"> | string | null;
    timestamp?: DateTimeWithAggregatesFilter<"MonitorEvent"> | Date | string;
    region?: StringNullableWithAggregatesFilter<"MonitorEvent"> | string | null;
  };

  export type MaintenanceWindowWhereInput = {
    AND?: MaintenanceWindowWhereInput | MaintenanceWindowWhereInput[];
    OR?: MaintenanceWindowWhereInput[];
    NOT?: MaintenanceWindowWhereInput | MaintenanceWindowWhereInput[];
    id?: StringFilter<"MaintenanceWindow"> | string;
    monitorId?: StringFilter<"MaintenanceWindow"> | string;
    description?: StringNullableFilter<"MaintenanceWindow"> | string | null;
    startAt?: DateTimeFilter<"MaintenanceWindow"> | Date | string;
    endAt?: DateTimeFilter<"MaintenanceWindow"> | Date | string;
    createdAt?: DateTimeFilter<"MaintenanceWindow"> | Date | string;
    updatedAt?: DateTimeFilter<"MaintenanceWindow"> | Date | string;
    monitor?: XOR<MonitorScalarRelationFilter, MonitorWhereInput>;
  };

  export type MaintenanceWindowOrderByWithRelationInput = {
    id?: SortOrder;
    monitorId?: SortOrder;
    description?: SortOrderInput | SortOrder;
    startAt?: SortOrder;
    endAt?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    monitor?: MonitorOrderByWithRelationInput;
  };

  export type MaintenanceWindowWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      AND?: MaintenanceWindowWhereInput | MaintenanceWindowWhereInput[];
      OR?: MaintenanceWindowWhereInput[];
      NOT?: MaintenanceWindowWhereInput | MaintenanceWindowWhereInput[];
      monitorId?: StringFilter<"MaintenanceWindow"> | string;
      description?: StringNullableFilter<"MaintenanceWindow"> | string | null;
      startAt?: DateTimeFilter<"MaintenanceWindow"> | Date | string;
      endAt?: DateTimeFilter<"MaintenanceWindow"> | Date | string;
      createdAt?: DateTimeFilter<"MaintenanceWindow"> | Date | string;
      updatedAt?: DateTimeFilter<"MaintenanceWindow"> | Date | string;
      monitor?: XOR<MonitorScalarRelationFilter, MonitorWhereInput>;
    },
    "id"
  >;

  export type MaintenanceWindowOrderByWithAggregationInput = {
    id?: SortOrder;
    monitorId?: SortOrder;
    description?: SortOrderInput | SortOrder;
    startAt?: SortOrder;
    endAt?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    _count?: MaintenanceWindowCountOrderByAggregateInput;
    _max?: MaintenanceWindowMaxOrderByAggregateInput;
    _min?: MaintenanceWindowMinOrderByAggregateInput;
  };

  export type MaintenanceWindowScalarWhereWithAggregatesInput = {
    AND?:
      | MaintenanceWindowScalarWhereWithAggregatesInput
      | MaintenanceWindowScalarWhereWithAggregatesInput[];
    OR?: MaintenanceWindowScalarWhereWithAggregatesInput[];
    NOT?:
      | MaintenanceWindowScalarWhereWithAggregatesInput
      | MaintenanceWindowScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<"MaintenanceWindow"> | string;
    monitorId?: StringWithAggregatesFilter<"MaintenanceWindow"> | string;
    description?: StringNullableWithAggregatesFilter<"MaintenanceWindow"> | string | null;
    startAt?: DateTimeWithAggregatesFilter<"MaintenanceWindow"> | Date | string;
    endAt?: DateTimeWithAggregatesFilter<"MaintenanceWindow"> | Date | string;
    createdAt?: DateTimeWithAggregatesFilter<"MaintenanceWindow"> | Date | string;
    updatedAt?: DateTimeWithAggregatesFilter<"MaintenanceWindow"> | Date | string;
  };

  export type UserCreateInput = {
    id: string;
    name: string;
    email: string;
    emailVerified?: boolean;
    image?: string | null;
    timezone?: string | null;
    dateFormat?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    sessions?: SessionCreateNestedManyWithoutUserInput;
    accounts?: AccountCreateNestedManyWithoutUserInput;
    monitors?: MonitorCreateNestedManyWithoutUserInput;
    notificationChannels?: NotificationChannelCreateNestedManyWithoutUserInput;
  };

  export type UserUncheckedCreateInput = {
    id: string;
    name: string;
    email: string;
    emailVerified?: boolean;
    image?: string | null;
    timezone?: string | null;
    dateFormat?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput;
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput;
    monitors?: MonitorUncheckedCreateNestedManyWithoutUserInput;
    notificationChannels?: NotificationChannelUncheckedCreateNestedManyWithoutUserInput;
  };

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    emailVerified?: BoolFieldUpdateOperationsInput | boolean;
    image?: NullableStringFieldUpdateOperationsInput | string | null;
    timezone?: NullableStringFieldUpdateOperationsInput | string | null;
    dateFormat?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    sessions?: SessionUpdateManyWithoutUserNestedInput;
    accounts?: AccountUpdateManyWithoutUserNestedInput;
    monitors?: MonitorUpdateManyWithoutUserNestedInput;
    notificationChannels?: NotificationChannelUpdateManyWithoutUserNestedInput;
  };

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    emailVerified?: BoolFieldUpdateOperationsInput | boolean;
    image?: NullableStringFieldUpdateOperationsInput | string | null;
    timezone?: NullableStringFieldUpdateOperationsInput | string | null;
    dateFormat?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput;
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput;
    monitors?: MonitorUncheckedUpdateManyWithoutUserNestedInput;
    notificationChannels?: NotificationChannelUncheckedUpdateManyWithoutUserNestedInput;
  };

  export type UserCreateManyInput = {
    id: string;
    name: string;
    email: string;
    emailVerified?: boolean;
    image?: string | null;
    timezone?: string | null;
    dateFormat?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    emailVerified?: BoolFieldUpdateOperationsInput | boolean;
    image?: NullableStringFieldUpdateOperationsInput | string | null;
    timezone?: NullableStringFieldUpdateOperationsInput | string | null;
    dateFormat?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    emailVerified?: BoolFieldUpdateOperationsInput | boolean;
    image?: NullableStringFieldUpdateOperationsInput | string | null;
    timezone?: NullableStringFieldUpdateOperationsInput | string | null;
    dateFormat?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type SessionCreateInput = {
    id: string;
    expiresAt: Date | string;
    token: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    ipAddress?: string | null;
    userAgent?: string | null;
    user: UserCreateNestedOneWithoutSessionsInput;
  };

  export type SessionUncheckedCreateInput = {
    id: string;
    expiresAt: Date | string;
    token: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    ipAddress?: string | null;
    userAgent?: string | null;
    userId: string;
  };

  export type SessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    token?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null;
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null;
    user?: UserUpdateOneRequiredWithoutSessionsNestedInput;
  };

  export type SessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    token?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null;
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null;
    userId?: StringFieldUpdateOperationsInput | string;
  };

  export type SessionCreateManyInput = {
    id: string;
    expiresAt: Date | string;
    token: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    ipAddress?: string | null;
    userAgent?: string | null;
    userId: string;
  };

  export type SessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    token?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null;
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null;
  };

  export type SessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    token?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null;
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null;
    userId?: StringFieldUpdateOperationsInput | string;
  };

  export type AccountCreateInput = {
    id: string;
    accountId: string;
    providerId: string;
    accessToken?: string | null;
    refreshToken?: string | null;
    idToken?: string | null;
    accessTokenExpiresAt?: Date | string | null;
    refreshTokenExpiresAt?: Date | string | null;
    scope?: string | null;
    password?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    user: UserCreateNestedOneWithoutAccountsInput;
  };

  export type AccountUncheckedCreateInput = {
    id: string;
    accountId: string;
    providerId: string;
    userId: string;
    accessToken?: string | null;
    refreshToken?: string | null;
    idToken?: string | null;
    accessTokenExpiresAt?: Date | string | null;
    refreshTokenExpiresAt?: Date | string | null;
    scope?: string | null;
    password?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type AccountUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    accountId?: StringFieldUpdateOperationsInput | string;
    providerId?: StringFieldUpdateOperationsInput | string;
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null;
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null;
    idToken?: NullableStringFieldUpdateOperationsInput | string | null;
    accessTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    refreshTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    scope?: NullableStringFieldUpdateOperationsInput | string | null;
    password?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    user?: UserUpdateOneRequiredWithoutAccountsNestedInput;
  };

  export type AccountUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    accountId?: StringFieldUpdateOperationsInput | string;
    providerId?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null;
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null;
    idToken?: NullableStringFieldUpdateOperationsInput | string | null;
    accessTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    refreshTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    scope?: NullableStringFieldUpdateOperationsInput | string | null;
    password?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type AccountCreateManyInput = {
    id: string;
    accountId: string;
    providerId: string;
    userId: string;
    accessToken?: string | null;
    refreshToken?: string | null;
    idToken?: string | null;
    accessTokenExpiresAt?: Date | string | null;
    refreshTokenExpiresAt?: Date | string | null;
    scope?: string | null;
    password?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type AccountUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    accountId?: StringFieldUpdateOperationsInput | string;
    providerId?: StringFieldUpdateOperationsInput | string;
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null;
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null;
    idToken?: NullableStringFieldUpdateOperationsInput | string | null;
    accessTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    refreshTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    scope?: NullableStringFieldUpdateOperationsInput | string | null;
    password?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type AccountUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    accountId?: StringFieldUpdateOperationsInput | string;
    providerId?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null;
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null;
    idToken?: NullableStringFieldUpdateOperationsInput | string | null;
    accessTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    refreshTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    scope?: NullableStringFieldUpdateOperationsInput | string | null;
    password?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type VerificationCreateInput = {
    id: string;
    identifier: string;
    value: string;
    expiresAt: Date | string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type VerificationUncheckedCreateInput = {
    id: string;
    identifier: string;
    value: string;
    expiresAt: Date | string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type VerificationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    identifier?: StringFieldUpdateOperationsInput | string;
    value?: StringFieldUpdateOperationsInput | string;
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type VerificationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    identifier?: StringFieldUpdateOperationsInput | string;
    value?: StringFieldUpdateOperationsInput | string;
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type VerificationCreateManyInput = {
    id: string;
    identifier: string;
    value: string;
    expiresAt: Date | string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type VerificationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    identifier?: StringFieldUpdateOperationsInput | string;
    value?: StringFieldUpdateOperationsInput | string;
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type VerificationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    identifier?: StringFieldUpdateOperationsInput | string;
    value?: StringFieldUpdateOperationsInput | string;
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type IncidentCreateInput = {
    id?: string;
    status?: $Enums.IncidentStatus;
    severity?: $Enums.Severity;
    title: string;
    description?: string | null;
    startedAt?: Date | string;
    resolvedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    monitor: MonitorCreateNestedOneWithoutIncidentsInput;
    events?: IncidentEventCreateNestedManyWithoutIncidentInput;
  };

  export type IncidentUncheckedCreateInput = {
    id?: string;
    monitorId: string;
    status?: $Enums.IncidentStatus;
    severity?: $Enums.Severity;
    title: string;
    description?: string | null;
    startedAt?: Date | string;
    resolvedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    events?: IncidentEventUncheckedCreateNestedManyWithoutIncidentInput;
  };

  export type IncidentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    status?: EnumIncidentStatusFieldUpdateOperationsInput | $Enums.IncidentStatus;
    severity?: EnumSeverityFieldUpdateOperationsInput | $Enums.Severity;
    title?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    monitor?: MonitorUpdateOneRequiredWithoutIncidentsNestedInput;
    events?: IncidentEventUpdateManyWithoutIncidentNestedInput;
  };

  export type IncidentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    monitorId?: StringFieldUpdateOperationsInput | string;
    status?: EnumIncidentStatusFieldUpdateOperationsInput | $Enums.IncidentStatus;
    severity?: EnumSeverityFieldUpdateOperationsInput | $Enums.Severity;
    title?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    events?: IncidentEventUncheckedUpdateManyWithoutIncidentNestedInput;
  };

  export type IncidentCreateManyInput = {
    id?: string;
    monitorId: string;
    status?: $Enums.IncidentStatus;
    severity?: $Enums.Severity;
    title: string;
    description?: string | null;
    startedAt?: Date | string;
    resolvedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type IncidentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    status?: EnumIncidentStatusFieldUpdateOperationsInput | $Enums.IncidentStatus;
    severity?: EnumSeverityFieldUpdateOperationsInput | $Enums.Severity;
    title?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type IncidentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    monitorId?: StringFieldUpdateOperationsInput | string;
    status?: EnumIncidentStatusFieldUpdateOperationsInput | $Enums.IncidentStatus;
    severity?: EnumSeverityFieldUpdateOperationsInput | $Enums.Severity;
    title?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type IncidentEventCreateInput = {
    id?: string;
    type: $Enums.IncidentEventType;
    message: string;
    createdAt?: Date | string;
    incident: IncidentCreateNestedOneWithoutEventsInput;
  };

  export type IncidentEventUncheckedCreateInput = {
    id?: string;
    incidentId: string;
    type: $Enums.IncidentEventType;
    message: string;
    createdAt?: Date | string;
  };

  export type IncidentEventUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    type?: EnumIncidentEventTypeFieldUpdateOperationsInput | $Enums.IncidentEventType;
    message?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    incident?: IncidentUpdateOneRequiredWithoutEventsNestedInput;
  };

  export type IncidentEventUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    incidentId?: StringFieldUpdateOperationsInput | string;
    type?: EnumIncidentEventTypeFieldUpdateOperationsInput | $Enums.IncidentEventType;
    message?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type IncidentEventCreateManyInput = {
    id?: string;
    incidentId: string;
    type: $Enums.IncidentEventType;
    message: string;
    createdAt?: Date | string;
  };

  export type IncidentEventUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    type?: EnumIncidentEventTypeFieldUpdateOperationsInput | $Enums.IncidentEventType;
    message?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type IncidentEventUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    incidentId?: StringFieldUpdateOperationsInput | string;
    type?: EnumIncidentEventTypeFieldUpdateOperationsInput | $Enums.IncidentEventType;
    message?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type RegionalIncidentCreateInput = {
    id?: string;
    region: string;
    status?: $Enums.IncidentStatus;
    startedAt?: Date | string;
    resolvedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    monitor: MonitorCreateNestedOneWithoutRegionalIncidentsInput;
  };

  export type RegionalIncidentUncheckedCreateInput = {
    id?: string;
    monitorId: string;
    region: string;
    status?: $Enums.IncidentStatus;
    startedAt?: Date | string;
    resolvedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type RegionalIncidentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    region?: StringFieldUpdateOperationsInput | string;
    status?: EnumIncidentStatusFieldUpdateOperationsInput | $Enums.IncidentStatus;
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    monitor?: MonitorUpdateOneRequiredWithoutRegionalIncidentsNestedInput;
  };

  export type RegionalIncidentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    monitorId?: StringFieldUpdateOperationsInput | string;
    region?: StringFieldUpdateOperationsInput | string;
    status?: EnumIncidentStatusFieldUpdateOperationsInput | $Enums.IncidentStatus;
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type RegionalIncidentCreateManyInput = {
    id?: string;
    monitorId: string;
    region: string;
    status?: $Enums.IncidentStatus;
    startedAt?: Date | string;
    resolvedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type RegionalIncidentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    region?: StringFieldUpdateOperationsInput | string;
    status?: EnumIncidentStatusFieldUpdateOperationsInput | $Enums.IncidentStatus;
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type RegionalIncidentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    monitorId?: StringFieldUpdateOperationsInput | string;
    region?: StringFieldUpdateOperationsInput | string;
    status?: EnumIncidentStatusFieldUpdateOperationsInput | $Enums.IncidentStatus;
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type NotificationChannelCreateInput = {
    id?: string;
    name: string;
    type: $Enums.NotificationType;
    config: JsonNullValueInput | InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    user: UserCreateNestedOneWithoutNotificationChannelsInput;
    alertRules?: AlertRuleCreateNestedManyWithoutChannelsInput;
  };

  export type NotificationChannelUncheckedCreateInput = {
    id?: string;
    name: string;
    type: $Enums.NotificationType;
    config: JsonNullValueInput | InputJsonValue;
    userId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    alertRules?: AlertRuleUncheckedCreateNestedManyWithoutChannelsInput;
  };

  export type NotificationChannelUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType;
    config?: JsonNullValueInput | InputJsonValue;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    user?: UserUpdateOneRequiredWithoutNotificationChannelsNestedInput;
    alertRules?: AlertRuleUpdateManyWithoutChannelsNestedInput;
  };

  export type NotificationChannelUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType;
    config?: JsonNullValueInput | InputJsonValue;
    userId?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    alertRules?: AlertRuleUncheckedUpdateManyWithoutChannelsNestedInput;
  };

  export type NotificationChannelCreateManyInput = {
    id?: string;
    name: string;
    type: $Enums.NotificationType;
    config: JsonNullValueInput | InputJsonValue;
    userId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type NotificationChannelUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType;
    config?: JsonNullValueInput | InputJsonValue;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type NotificationChannelUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType;
    config?: JsonNullValueInput | InputJsonValue;
    userId?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type AlertRuleCreateInput = {
    id?: string;
    trigger: $Enums.AlertTrigger;
    threshold?: number | null;
    comparison?: $Enums.ComparisonOperator | null;
    targetStatus?: $Enums.MonitorStatus | null;
    enabled?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    monitor: MonitorCreateNestedOneWithoutAlertRulesInput;
    channels?: NotificationChannelCreateNestedManyWithoutAlertRulesInput;
  };

  export type AlertRuleUncheckedCreateInput = {
    id?: string;
    monitorId: string;
    trigger: $Enums.AlertTrigger;
    threshold?: number | null;
    comparison?: $Enums.ComparisonOperator | null;
    targetStatus?: $Enums.MonitorStatus | null;
    enabled?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    channels?: NotificationChannelUncheckedCreateNestedManyWithoutAlertRulesInput;
  };

  export type AlertRuleUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    trigger?: EnumAlertTriggerFieldUpdateOperationsInput | $Enums.AlertTrigger;
    threshold?: NullableIntFieldUpdateOperationsInput | number | null;
    comparison?:
      | NullableEnumComparisonOperatorFieldUpdateOperationsInput
      | $Enums.ComparisonOperator
      | null;
    targetStatus?:
      | NullableEnumMonitorStatusFieldUpdateOperationsInput
      | $Enums.MonitorStatus
      | null;
    enabled?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    monitor?: MonitorUpdateOneRequiredWithoutAlertRulesNestedInput;
    channels?: NotificationChannelUpdateManyWithoutAlertRulesNestedInput;
  };

  export type AlertRuleUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    monitorId?: StringFieldUpdateOperationsInput | string;
    trigger?: EnumAlertTriggerFieldUpdateOperationsInput | $Enums.AlertTrigger;
    threshold?: NullableIntFieldUpdateOperationsInput | number | null;
    comparison?:
      | NullableEnumComparisonOperatorFieldUpdateOperationsInput
      | $Enums.ComparisonOperator
      | null;
    targetStatus?:
      | NullableEnumMonitorStatusFieldUpdateOperationsInput
      | $Enums.MonitorStatus
      | null;
    enabled?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    channels?: NotificationChannelUncheckedUpdateManyWithoutAlertRulesNestedInput;
  };

  export type AlertRuleCreateManyInput = {
    id?: string;
    monitorId: string;
    trigger: $Enums.AlertTrigger;
    threshold?: number | null;
    comparison?: $Enums.ComparisonOperator | null;
    targetStatus?: $Enums.MonitorStatus | null;
    enabled?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type AlertRuleUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    trigger?: EnumAlertTriggerFieldUpdateOperationsInput | $Enums.AlertTrigger;
    threshold?: NullableIntFieldUpdateOperationsInput | number | null;
    comparison?:
      | NullableEnumComparisonOperatorFieldUpdateOperationsInput
      | $Enums.ComparisonOperator
      | null;
    targetStatus?:
      | NullableEnumMonitorStatusFieldUpdateOperationsInput
      | $Enums.MonitorStatus
      | null;
    enabled?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type AlertRuleUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    monitorId?: StringFieldUpdateOperationsInput | string;
    trigger?: EnumAlertTriggerFieldUpdateOperationsInput | $Enums.AlertTrigger;
    threshold?: NullableIntFieldUpdateOperationsInput | number | null;
    comparison?:
      | NullableEnumComparisonOperatorFieldUpdateOperationsInput
      | $Enums.ComparisonOperator
      | null;
    targetStatus?:
      | NullableEnumMonitorStatusFieldUpdateOperationsInput
      | $Enums.MonitorStatus
      | null;
    enabled?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type MonitorCreateInput = {
    id?: string;
    name: string;
    url: string;
    type?: $Enums.MonitorType;
    interval?: number;
    timeout?: number;
    status?: $Enums.MonitorStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    nextCheck?: Date | string | null;
    lastCheck?: Date | string | null;
    checkRegions?: string | null;
    alertThreshold?: number;
    user: UserCreateNestedOneWithoutMonitorsInput;
    events?: MonitorEventCreateNestedManyWithoutMonitorInput;
    maintenanceWindows?: MaintenanceWindowCreateNestedManyWithoutMonitorInput;
    alertRules?: AlertRuleCreateNestedManyWithoutMonitorInput;
    incidents?: IncidentCreateNestedManyWithoutMonitorInput;
    regionalIncidents?: RegionalIncidentCreateNestedManyWithoutMonitorInput;
  };

  export type MonitorUncheckedCreateInput = {
    id?: string;
    name: string;
    url: string;
    type?: $Enums.MonitorType;
    interval?: number;
    timeout?: number;
    status?: $Enums.MonitorStatus;
    userId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    nextCheck?: Date | string | null;
    lastCheck?: Date | string | null;
    checkRegions?: string | null;
    alertThreshold?: number;
    events?: MonitorEventUncheckedCreateNestedManyWithoutMonitorInput;
    maintenanceWindows?: MaintenanceWindowUncheckedCreateNestedManyWithoutMonitorInput;
    alertRules?: AlertRuleUncheckedCreateNestedManyWithoutMonitorInput;
    incidents?: IncidentUncheckedCreateNestedManyWithoutMonitorInput;
    regionalIncidents?: RegionalIncidentUncheckedCreateNestedManyWithoutMonitorInput;
  };

  export type MonitorUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    url?: StringFieldUpdateOperationsInput | string;
    type?: EnumMonitorTypeFieldUpdateOperationsInput | $Enums.MonitorType;
    interval?: IntFieldUpdateOperationsInput | number;
    timeout?: IntFieldUpdateOperationsInput | number;
    status?: EnumMonitorStatusFieldUpdateOperationsInput | $Enums.MonitorStatus;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    nextCheck?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lastCheck?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    checkRegions?: NullableStringFieldUpdateOperationsInput | string | null;
    alertThreshold?: IntFieldUpdateOperationsInput | number;
    user?: UserUpdateOneRequiredWithoutMonitorsNestedInput;
    events?: MonitorEventUpdateManyWithoutMonitorNestedInput;
    maintenanceWindows?: MaintenanceWindowUpdateManyWithoutMonitorNestedInput;
    alertRules?: AlertRuleUpdateManyWithoutMonitorNestedInput;
    incidents?: IncidentUpdateManyWithoutMonitorNestedInput;
    regionalIncidents?: RegionalIncidentUpdateManyWithoutMonitorNestedInput;
  };

  export type MonitorUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    url?: StringFieldUpdateOperationsInput | string;
    type?: EnumMonitorTypeFieldUpdateOperationsInput | $Enums.MonitorType;
    interval?: IntFieldUpdateOperationsInput | number;
    timeout?: IntFieldUpdateOperationsInput | number;
    status?: EnumMonitorStatusFieldUpdateOperationsInput | $Enums.MonitorStatus;
    userId?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    nextCheck?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lastCheck?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    checkRegions?: NullableStringFieldUpdateOperationsInput | string | null;
    alertThreshold?: IntFieldUpdateOperationsInput | number;
    events?: MonitorEventUncheckedUpdateManyWithoutMonitorNestedInput;
    maintenanceWindows?: MaintenanceWindowUncheckedUpdateManyWithoutMonitorNestedInput;
    alertRules?: AlertRuleUncheckedUpdateManyWithoutMonitorNestedInput;
    incidents?: IncidentUncheckedUpdateManyWithoutMonitorNestedInput;
    regionalIncidents?: RegionalIncidentUncheckedUpdateManyWithoutMonitorNestedInput;
  };

  export type MonitorCreateManyInput = {
    id?: string;
    name: string;
    url: string;
    type?: $Enums.MonitorType;
    interval?: number;
    timeout?: number;
    status?: $Enums.MonitorStatus;
    userId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    nextCheck?: Date | string | null;
    lastCheck?: Date | string | null;
    checkRegions?: string | null;
    alertThreshold?: number;
  };

  export type MonitorUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    url?: StringFieldUpdateOperationsInput | string;
    type?: EnumMonitorTypeFieldUpdateOperationsInput | $Enums.MonitorType;
    interval?: IntFieldUpdateOperationsInput | number;
    timeout?: IntFieldUpdateOperationsInput | number;
    status?: EnumMonitorStatusFieldUpdateOperationsInput | $Enums.MonitorStatus;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    nextCheck?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lastCheck?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    checkRegions?: NullableStringFieldUpdateOperationsInput | string | null;
    alertThreshold?: IntFieldUpdateOperationsInput | number;
  };

  export type MonitorUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    url?: StringFieldUpdateOperationsInput | string;
    type?: EnumMonitorTypeFieldUpdateOperationsInput | $Enums.MonitorType;
    interval?: IntFieldUpdateOperationsInput | number;
    timeout?: IntFieldUpdateOperationsInput | number;
    status?: EnumMonitorStatusFieldUpdateOperationsInput | $Enums.MonitorStatus;
    userId?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    nextCheck?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lastCheck?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    checkRegions?: NullableStringFieldUpdateOperationsInput | string | null;
    alertThreshold?: IntFieldUpdateOperationsInput | number;
  };

  export type MonitorEventCreateInput = {
    id?: string;
    status: $Enums.MonitorStatus;
    latency: number;
    errorReason?: string | null;
    timestamp?: Date | string;
    region?: string | null;
    monitor: MonitorCreateNestedOneWithoutEventsInput;
  };

  export type MonitorEventUncheckedCreateInput = {
    id?: string;
    monitorId: string;
    status: $Enums.MonitorStatus;
    latency: number;
    errorReason?: string | null;
    timestamp?: Date | string;
    region?: string | null;
  };

  export type MonitorEventUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    status?: EnumMonitorStatusFieldUpdateOperationsInput | $Enums.MonitorStatus;
    latency?: IntFieldUpdateOperationsInput | number;
    errorReason?: NullableStringFieldUpdateOperationsInput | string | null;
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string;
    region?: NullableStringFieldUpdateOperationsInput | string | null;
    monitor?: MonitorUpdateOneRequiredWithoutEventsNestedInput;
  };

  export type MonitorEventUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    monitorId?: StringFieldUpdateOperationsInput | string;
    status?: EnumMonitorStatusFieldUpdateOperationsInput | $Enums.MonitorStatus;
    latency?: IntFieldUpdateOperationsInput | number;
    errorReason?: NullableStringFieldUpdateOperationsInput | string | null;
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string;
    region?: NullableStringFieldUpdateOperationsInput | string | null;
  };

  export type MonitorEventCreateManyInput = {
    id?: string;
    monitorId: string;
    status: $Enums.MonitorStatus;
    latency: number;
    errorReason?: string | null;
    timestamp?: Date | string;
    region?: string | null;
  };

  export type MonitorEventUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    status?: EnumMonitorStatusFieldUpdateOperationsInput | $Enums.MonitorStatus;
    latency?: IntFieldUpdateOperationsInput | number;
    errorReason?: NullableStringFieldUpdateOperationsInput | string | null;
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string;
    region?: NullableStringFieldUpdateOperationsInput | string | null;
  };

  export type MonitorEventUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    monitorId?: StringFieldUpdateOperationsInput | string;
    status?: EnumMonitorStatusFieldUpdateOperationsInput | $Enums.MonitorStatus;
    latency?: IntFieldUpdateOperationsInput | number;
    errorReason?: NullableStringFieldUpdateOperationsInput | string | null;
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string;
    region?: NullableStringFieldUpdateOperationsInput | string | null;
  };

  export type MaintenanceWindowCreateInput = {
    id?: string;
    description?: string | null;
    startAt: Date | string;
    endAt: Date | string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    monitor: MonitorCreateNestedOneWithoutMaintenanceWindowsInput;
  };

  export type MaintenanceWindowUncheckedCreateInput = {
    id?: string;
    monitorId: string;
    description?: string | null;
    startAt: Date | string;
    endAt: Date | string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type MaintenanceWindowUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    startAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    endAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    monitor?: MonitorUpdateOneRequiredWithoutMaintenanceWindowsNestedInput;
  };

  export type MaintenanceWindowUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    monitorId?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    startAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    endAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type MaintenanceWindowCreateManyInput = {
    id?: string;
    monitorId: string;
    description?: string | null;
    startAt: Date | string;
    endAt: Date | string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type MaintenanceWindowUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    startAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    endAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type MaintenanceWindowUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    monitorId?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    startAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    endAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>;
    in?: string[] | ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    mode?: QueryMode;
    not?: NestedStringFilter<$PrismaModel> | string;
  };

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>;
    not?: NestedBoolFilter<$PrismaModel> | boolean;
  };

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    mode?: QueryMode;
    not?: NestedStringNullableFilter<$PrismaModel> | string | null;
  };

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string;
  };

  export type SessionListRelationFilter = {
    every?: SessionWhereInput;
    some?: SessionWhereInput;
    none?: SessionWhereInput;
  };

  export type AccountListRelationFilter = {
    every?: AccountWhereInput;
    some?: AccountWhereInput;
    none?: AccountWhereInput;
  };

  export type MonitorListRelationFilter = {
    every?: MonitorWhereInput;
    some?: MonitorWhereInput;
    none?: MonitorWhereInput;
  };

  export type NotificationChannelListRelationFilter = {
    every?: NotificationChannelWhereInput;
    some?: NotificationChannelWhereInput;
    none?: NotificationChannelWhereInput;
  };

  export type SortOrderInput = {
    sort: SortOrder;
    nulls?: NullsOrder;
  };

  export type SessionOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type AccountOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type MonitorOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type NotificationChannelOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    email?: SortOrder;
    emailVerified?: SortOrder;
    image?: SortOrder;
    timezone?: SortOrder;
    dateFormat?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    email?: SortOrder;
    emailVerified?: SortOrder;
    image?: SortOrder;
    timezone?: SortOrder;
    dateFormat?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    email?: SortOrder;
    emailVerified?: SortOrder;
    image?: SortOrder;
    timezone?: SortOrder;
    dateFormat?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>;
    in?: string[] | ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    mode?: QueryMode;
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedStringFilter<$PrismaModel>;
    _max?: NestedStringFilter<$PrismaModel>;
  };

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>;
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedBoolFilter<$PrismaModel>;
    _max?: NestedBoolFilter<$PrismaModel>;
  };

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    mode?: QueryMode;
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedStringNullableFilter<$PrismaModel>;
    _max?: NestedStringNullableFilter<$PrismaModel>;
  };

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedDateTimeFilter<$PrismaModel>;
    _max?: NestedDateTimeFilter<$PrismaModel>;
  };

  export type UserScalarRelationFilter = {
    is?: UserWhereInput;
    isNot?: UserWhereInput;
  };

  export type SessionCountOrderByAggregateInput = {
    id?: SortOrder;
    expiresAt?: SortOrder;
    token?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    ipAddress?: SortOrder;
    userAgent?: SortOrder;
    userId?: SortOrder;
  };

  export type SessionMaxOrderByAggregateInput = {
    id?: SortOrder;
    expiresAt?: SortOrder;
    token?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    ipAddress?: SortOrder;
    userAgent?: SortOrder;
    userId?: SortOrder;
  };

  export type SessionMinOrderByAggregateInput = {
    id?: SortOrder;
    expiresAt?: SortOrder;
    token?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    ipAddress?: SortOrder;
    userAgent?: SortOrder;
    userId?: SortOrder;
  };

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null;
  };

  export type AccountCountOrderByAggregateInput = {
    id?: SortOrder;
    accountId?: SortOrder;
    providerId?: SortOrder;
    userId?: SortOrder;
    accessToken?: SortOrder;
    refreshToken?: SortOrder;
    idToken?: SortOrder;
    accessTokenExpiresAt?: SortOrder;
    refreshTokenExpiresAt?: SortOrder;
    scope?: SortOrder;
    password?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type AccountMaxOrderByAggregateInput = {
    id?: SortOrder;
    accountId?: SortOrder;
    providerId?: SortOrder;
    userId?: SortOrder;
    accessToken?: SortOrder;
    refreshToken?: SortOrder;
    idToken?: SortOrder;
    accessTokenExpiresAt?: SortOrder;
    refreshTokenExpiresAt?: SortOrder;
    scope?: SortOrder;
    password?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type AccountMinOrderByAggregateInput = {
    id?: SortOrder;
    accountId?: SortOrder;
    providerId?: SortOrder;
    userId?: SortOrder;
    accessToken?: SortOrder;
    refreshToken?: SortOrder;
    idToken?: SortOrder;
    accessTokenExpiresAt?: SortOrder;
    refreshTokenExpiresAt?: SortOrder;
    scope?: SortOrder;
    password?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedDateTimeNullableFilter<$PrismaModel>;
    _max?: NestedDateTimeNullableFilter<$PrismaModel>;
  };

  export type VerificationCountOrderByAggregateInput = {
    id?: SortOrder;
    identifier?: SortOrder;
    value?: SortOrder;
    expiresAt?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type VerificationMaxOrderByAggregateInput = {
    id?: SortOrder;
    identifier?: SortOrder;
    value?: SortOrder;
    expiresAt?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type VerificationMinOrderByAggregateInput = {
    id?: SortOrder;
    identifier?: SortOrder;
    value?: SortOrder;
    expiresAt?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type EnumIncidentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.IncidentStatus | EnumIncidentStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.IncidentStatus[] | ListEnumIncidentStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.IncidentStatus[] | ListEnumIncidentStatusFieldRefInput<$PrismaModel>;
    not?: NestedEnumIncidentStatusFilter<$PrismaModel> | $Enums.IncidentStatus;
  };

  export type EnumSeverityFilter<$PrismaModel = never> = {
    equals?: $Enums.Severity | EnumSeverityFieldRefInput<$PrismaModel>;
    in?: $Enums.Severity[] | ListEnumSeverityFieldRefInput<$PrismaModel>;
    notIn?: $Enums.Severity[] | ListEnumSeverityFieldRefInput<$PrismaModel>;
    not?: NestedEnumSeverityFilter<$PrismaModel> | $Enums.Severity;
  };

  export type MonitorScalarRelationFilter = {
    is?: MonitorWhereInput;
    isNot?: MonitorWhereInput;
  };

  export type IncidentEventListRelationFilter = {
    every?: IncidentEventWhereInput;
    some?: IncidentEventWhereInput;
    none?: IncidentEventWhereInput;
  };

  export type IncidentEventOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type IncidentCountOrderByAggregateInput = {
    id?: SortOrder;
    monitorId?: SortOrder;
    status?: SortOrder;
    severity?: SortOrder;
    title?: SortOrder;
    description?: SortOrder;
    startedAt?: SortOrder;
    resolvedAt?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type IncidentMaxOrderByAggregateInput = {
    id?: SortOrder;
    monitorId?: SortOrder;
    status?: SortOrder;
    severity?: SortOrder;
    title?: SortOrder;
    description?: SortOrder;
    startedAt?: SortOrder;
    resolvedAt?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type IncidentMinOrderByAggregateInput = {
    id?: SortOrder;
    monitorId?: SortOrder;
    status?: SortOrder;
    severity?: SortOrder;
    title?: SortOrder;
    description?: SortOrder;
    startedAt?: SortOrder;
    resolvedAt?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type EnumIncidentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.IncidentStatus | EnumIncidentStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.IncidentStatus[] | ListEnumIncidentStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.IncidentStatus[] | ListEnumIncidentStatusFieldRefInput<$PrismaModel>;
    not?: NestedEnumIncidentStatusWithAggregatesFilter<$PrismaModel> | $Enums.IncidentStatus;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedEnumIncidentStatusFilter<$PrismaModel>;
    _max?: NestedEnumIncidentStatusFilter<$PrismaModel>;
  };

  export type EnumSeverityWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Severity | EnumSeverityFieldRefInput<$PrismaModel>;
    in?: $Enums.Severity[] | ListEnumSeverityFieldRefInput<$PrismaModel>;
    notIn?: $Enums.Severity[] | ListEnumSeverityFieldRefInput<$PrismaModel>;
    not?: NestedEnumSeverityWithAggregatesFilter<$PrismaModel> | $Enums.Severity;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedEnumSeverityFilter<$PrismaModel>;
    _max?: NestedEnumSeverityFilter<$PrismaModel>;
  };

  export type EnumIncidentEventTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.IncidentEventType | EnumIncidentEventTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.IncidentEventType[] | ListEnumIncidentEventTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.IncidentEventType[] | ListEnumIncidentEventTypeFieldRefInput<$PrismaModel>;
    not?: NestedEnumIncidentEventTypeFilter<$PrismaModel> | $Enums.IncidentEventType;
  };

  export type IncidentScalarRelationFilter = {
    is?: IncidentWhereInput;
    isNot?: IncidentWhereInput;
  };

  export type IncidentEventCountOrderByAggregateInput = {
    id?: SortOrder;
    incidentId?: SortOrder;
    type?: SortOrder;
    message?: SortOrder;
    createdAt?: SortOrder;
  };

  export type IncidentEventMaxOrderByAggregateInput = {
    id?: SortOrder;
    incidentId?: SortOrder;
    type?: SortOrder;
    message?: SortOrder;
    createdAt?: SortOrder;
  };

  export type IncidentEventMinOrderByAggregateInput = {
    id?: SortOrder;
    incidentId?: SortOrder;
    type?: SortOrder;
    message?: SortOrder;
    createdAt?: SortOrder;
  };

  export type EnumIncidentEventTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.IncidentEventType | EnumIncidentEventTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.IncidentEventType[] | ListEnumIncidentEventTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.IncidentEventType[] | ListEnumIncidentEventTypeFieldRefInput<$PrismaModel>;
    not?: NestedEnumIncidentEventTypeWithAggregatesFilter<$PrismaModel> | $Enums.IncidentEventType;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedEnumIncidentEventTypeFilter<$PrismaModel>;
    _max?: NestedEnumIncidentEventTypeFilter<$PrismaModel>;
  };

  export type RegionalIncidentCountOrderByAggregateInput = {
    id?: SortOrder;
    monitorId?: SortOrder;
    region?: SortOrder;
    status?: SortOrder;
    startedAt?: SortOrder;
    resolvedAt?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type RegionalIncidentMaxOrderByAggregateInput = {
    id?: SortOrder;
    monitorId?: SortOrder;
    region?: SortOrder;
    status?: SortOrder;
    startedAt?: SortOrder;
    resolvedAt?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type RegionalIncidentMinOrderByAggregateInput = {
    id?: SortOrder;
    monitorId?: SortOrder;
    region?: SortOrder;
    status?: SortOrder;
    startedAt?: SortOrder;
    resolvedAt?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type EnumNotificationTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationType | EnumNotificationTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.NotificationType[] | ListEnumNotificationTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.NotificationType[] | ListEnumNotificationTypeFieldRefInput<$PrismaModel>;
    not?: NestedEnumNotificationTypeFilter<$PrismaModel> | $Enums.NotificationType;
  };
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<
          Required<JsonFilterBase<$PrismaModel>>,
          Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, "path">
        >,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, "path">>;

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter;
    path?: string[];
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>;
    string_contains?: string | StringFieldRefInput<$PrismaModel>;
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>;
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>;
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter;
  };

  export type AlertRuleListRelationFilter = {
    every?: AlertRuleWhereInput;
    some?: AlertRuleWhereInput;
    none?: AlertRuleWhereInput;
  };

  export type AlertRuleOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type NotificationChannelCountOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    type?: SortOrder;
    config?: SortOrder;
    userId?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type NotificationChannelMaxOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    type?: SortOrder;
    userId?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type NotificationChannelMinOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    type?: SortOrder;
    userId?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type EnumNotificationTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationType | EnumNotificationTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.NotificationType[] | ListEnumNotificationTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.NotificationType[] | ListEnumNotificationTypeFieldRefInput<$PrismaModel>;
    not?: NestedEnumNotificationTypeWithAggregatesFilter<$PrismaModel> | $Enums.NotificationType;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedEnumNotificationTypeFilter<$PrismaModel>;
    _max?: NestedEnumNotificationTypeFilter<$PrismaModel>;
  };
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<
          Required<JsonWithAggregatesFilterBase<$PrismaModel>>,
          Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, "path">
        >,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, "path">>;

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter;
    path?: string[];
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>;
    string_contains?: string | StringFieldRefInput<$PrismaModel>;
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>;
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>;
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedJsonFilter<$PrismaModel>;
    _max?: NestedJsonFilter<$PrismaModel>;
  };

  export type EnumAlertTriggerFilter<$PrismaModel = never> = {
    equals?: $Enums.AlertTrigger | EnumAlertTriggerFieldRefInput<$PrismaModel>;
    in?: $Enums.AlertTrigger[] | ListEnumAlertTriggerFieldRefInput<$PrismaModel>;
    notIn?: $Enums.AlertTrigger[] | ListEnumAlertTriggerFieldRefInput<$PrismaModel>;
    not?: NestedEnumAlertTriggerFilter<$PrismaModel> | $Enums.AlertTrigger;
  };

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntNullableFilter<$PrismaModel> | number | null;
  };

  export type EnumComparisonOperatorNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.ComparisonOperator | EnumComparisonOperatorFieldRefInput<$PrismaModel> | null;
    in?: $Enums.ComparisonOperator[] | ListEnumComparisonOperatorFieldRefInput<$PrismaModel> | null;
    notIn?:
      | $Enums.ComparisonOperator[]
      | ListEnumComparisonOperatorFieldRefInput<$PrismaModel>
      | null;
    not?:
      | NestedEnumComparisonOperatorNullableFilter<$PrismaModel>
      | $Enums.ComparisonOperator
      | null;
  };

  export type EnumMonitorStatusNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.MonitorStatus | EnumMonitorStatusFieldRefInput<$PrismaModel> | null;
    in?: $Enums.MonitorStatus[] | ListEnumMonitorStatusFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.MonitorStatus[] | ListEnumMonitorStatusFieldRefInput<$PrismaModel> | null;
    not?: NestedEnumMonitorStatusNullableFilter<$PrismaModel> | $Enums.MonitorStatus | null;
  };

  export type AlertRuleCountOrderByAggregateInput = {
    id?: SortOrder;
    monitorId?: SortOrder;
    trigger?: SortOrder;
    threshold?: SortOrder;
    comparison?: SortOrder;
    targetStatus?: SortOrder;
    enabled?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type AlertRuleAvgOrderByAggregateInput = {
    threshold?: SortOrder;
  };

  export type AlertRuleMaxOrderByAggregateInput = {
    id?: SortOrder;
    monitorId?: SortOrder;
    trigger?: SortOrder;
    threshold?: SortOrder;
    comparison?: SortOrder;
    targetStatus?: SortOrder;
    enabled?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type AlertRuleMinOrderByAggregateInput = {
    id?: SortOrder;
    monitorId?: SortOrder;
    trigger?: SortOrder;
    threshold?: SortOrder;
    comparison?: SortOrder;
    targetStatus?: SortOrder;
    enabled?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type AlertRuleSumOrderByAggregateInput = {
    threshold?: SortOrder;
  };

  export type EnumAlertTriggerWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AlertTrigger | EnumAlertTriggerFieldRefInput<$PrismaModel>;
    in?: $Enums.AlertTrigger[] | ListEnumAlertTriggerFieldRefInput<$PrismaModel>;
    notIn?: $Enums.AlertTrigger[] | ListEnumAlertTriggerFieldRefInput<$PrismaModel>;
    not?: NestedEnumAlertTriggerWithAggregatesFilter<$PrismaModel> | $Enums.AlertTrigger;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedEnumAlertTriggerFilter<$PrismaModel>;
    _max?: NestedEnumAlertTriggerFilter<$PrismaModel>;
  };

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _avg?: NestedFloatNullableFilter<$PrismaModel>;
    _sum?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedIntNullableFilter<$PrismaModel>;
    _max?: NestedIntNullableFilter<$PrismaModel>;
  };

  export type EnumComparisonOperatorNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ComparisonOperator | EnumComparisonOperatorFieldRefInput<$PrismaModel> | null;
    in?: $Enums.ComparisonOperator[] | ListEnumComparisonOperatorFieldRefInput<$PrismaModel> | null;
    notIn?:
      | $Enums.ComparisonOperator[]
      | ListEnumComparisonOperatorFieldRefInput<$PrismaModel>
      | null;
    not?:
      | NestedEnumComparisonOperatorNullableWithAggregatesFilter<$PrismaModel>
      | $Enums.ComparisonOperator
      | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedEnumComparisonOperatorNullableFilter<$PrismaModel>;
    _max?: NestedEnumComparisonOperatorNullableFilter<$PrismaModel>;
  };

  export type EnumMonitorStatusNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MonitorStatus | EnumMonitorStatusFieldRefInput<$PrismaModel> | null;
    in?: $Enums.MonitorStatus[] | ListEnumMonitorStatusFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.MonitorStatus[] | ListEnumMonitorStatusFieldRefInput<$PrismaModel> | null;
    not?:
      | NestedEnumMonitorStatusNullableWithAggregatesFilter<$PrismaModel>
      | $Enums.MonitorStatus
      | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedEnumMonitorStatusNullableFilter<$PrismaModel>;
    _max?: NestedEnumMonitorStatusNullableFilter<$PrismaModel>;
  };

  export type EnumMonitorTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.MonitorType | EnumMonitorTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.MonitorType[] | ListEnumMonitorTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.MonitorType[] | ListEnumMonitorTypeFieldRefInput<$PrismaModel>;
    not?: NestedEnumMonitorTypeFilter<$PrismaModel> | $Enums.MonitorType;
  };

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>;
    in?: number[] | ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntFilter<$PrismaModel> | number;
  };

  export type EnumMonitorStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.MonitorStatus | EnumMonitorStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.MonitorStatus[] | ListEnumMonitorStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.MonitorStatus[] | ListEnumMonitorStatusFieldRefInput<$PrismaModel>;
    not?: NestedEnumMonitorStatusFilter<$PrismaModel> | $Enums.MonitorStatus;
  };

  export type MonitorEventListRelationFilter = {
    every?: MonitorEventWhereInput;
    some?: MonitorEventWhereInput;
    none?: MonitorEventWhereInput;
  };

  export type MaintenanceWindowListRelationFilter = {
    every?: MaintenanceWindowWhereInput;
    some?: MaintenanceWindowWhereInput;
    none?: MaintenanceWindowWhereInput;
  };

  export type IncidentListRelationFilter = {
    every?: IncidentWhereInput;
    some?: IncidentWhereInput;
    none?: IncidentWhereInput;
  };

  export type RegionalIncidentListRelationFilter = {
    every?: RegionalIncidentWhereInput;
    some?: RegionalIncidentWhereInput;
    none?: RegionalIncidentWhereInput;
  };

  export type MonitorEventOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type MaintenanceWindowOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type IncidentOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type RegionalIncidentOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type MonitorCountOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    url?: SortOrder;
    type?: SortOrder;
    interval?: SortOrder;
    timeout?: SortOrder;
    status?: SortOrder;
    userId?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    nextCheck?: SortOrder;
    lastCheck?: SortOrder;
    checkRegions?: SortOrder;
    alertThreshold?: SortOrder;
  };

  export type MonitorAvgOrderByAggregateInput = {
    interval?: SortOrder;
    timeout?: SortOrder;
    alertThreshold?: SortOrder;
  };

  export type MonitorMaxOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    url?: SortOrder;
    type?: SortOrder;
    interval?: SortOrder;
    timeout?: SortOrder;
    status?: SortOrder;
    userId?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    nextCheck?: SortOrder;
    lastCheck?: SortOrder;
    checkRegions?: SortOrder;
    alertThreshold?: SortOrder;
  };

  export type MonitorMinOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    url?: SortOrder;
    type?: SortOrder;
    interval?: SortOrder;
    timeout?: SortOrder;
    status?: SortOrder;
    userId?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    nextCheck?: SortOrder;
    lastCheck?: SortOrder;
    checkRegions?: SortOrder;
    alertThreshold?: SortOrder;
  };

  export type MonitorSumOrderByAggregateInput = {
    interval?: SortOrder;
    timeout?: SortOrder;
    alertThreshold?: SortOrder;
  };

  export type EnumMonitorTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MonitorType | EnumMonitorTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.MonitorType[] | ListEnumMonitorTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.MonitorType[] | ListEnumMonitorTypeFieldRefInput<$PrismaModel>;
    not?: NestedEnumMonitorTypeWithAggregatesFilter<$PrismaModel> | $Enums.MonitorType;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedEnumMonitorTypeFilter<$PrismaModel>;
    _max?: NestedEnumMonitorTypeFilter<$PrismaModel>;
  };

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>;
    in?: number[] | ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number;
    _count?: NestedIntFilter<$PrismaModel>;
    _avg?: NestedFloatFilter<$PrismaModel>;
    _sum?: NestedIntFilter<$PrismaModel>;
    _min?: NestedIntFilter<$PrismaModel>;
    _max?: NestedIntFilter<$PrismaModel>;
  };

  export type EnumMonitorStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MonitorStatus | EnumMonitorStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.MonitorStatus[] | ListEnumMonitorStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.MonitorStatus[] | ListEnumMonitorStatusFieldRefInput<$PrismaModel>;
    not?: NestedEnumMonitorStatusWithAggregatesFilter<$PrismaModel> | $Enums.MonitorStatus;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedEnumMonitorStatusFilter<$PrismaModel>;
    _max?: NestedEnumMonitorStatusFilter<$PrismaModel>;
  };

  export type MonitorEventCountOrderByAggregateInput = {
    id?: SortOrder;
    monitorId?: SortOrder;
    status?: SortOrder;
    latency?: SortOrder;
    errorReason?: SortOrder;
    timestamp?: SortOrder;
    region?: SortOrder;
  };

  export type MonitorEventAvgOrderByAggregateInput = {
    latency?: SortOrder;
  };

  export type MonitorEventMaxOrderByAggregateInput = {
    id?: SortOrder;
    monitorId?: SortOrder;
    status?: SortOrder;
    latency?: SortOrder;
    errorReason?: SortOrder;
    timestamp?: SortOrder;
    region?: SortOrder;
  };

  export type MonitorEventMinOrderByAggregateInput = {
    id?: SortOrder;
    monitorId?: SortOrder;
    status?: SortOrder;
    latency?: SortOrder;
    errorReason?: SortOrder;
    timestamp?: SortOrder;
    region?: SortOrder;
  };

  export type MonitorEventSumOrderByAggregateInput = {
    latency?: SortOrder;
  };

  export type MaintenanceWindowCountOrderByAggregateInput = {
    id?: SortOrder;
    monitorId?: SortOrder;
    description?: SortOrder;
    startAt?: SortOrder;
    endAt?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type MaintenanceWindowMaxOrderByAggregateInput = {
    id?: SortOrder;
    monitorId?: SortOrder;
    description?: SortOrder;
    startAt?: SortOrder;
    endAt?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type MaintenanceWindowMinOrderByAggregateInput = {
    id?: SortOrder;
    monitorId?: SortOrder;
    description?: SortOrder;
    startAt?: SortOrder;
    endAt?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type SessionCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>
      | SessionCreateWithoutUserInput[]
      | SessionUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | SessionCreateOrConnectWithoutUserInput
      | SessionCreateOrConnectWithoutUserInput[];
    createMany?: SessionCreateManyUserInputEnvelope;
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[];
  };

  export type AccountCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput>
      | AccountCreateWithoutUserInput[]
      | AccountUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | AccountCreateOrConnectWithoutUserInput
      | AccountCreateOrConnectWithoutUserInput[];
    createMany?: AccountCreateManyUserInputEnvelope;
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[];
  };

  export type MonitorCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<MonitorCreateWithoutUserInput, MonitorUncheckedCreateWithoutUserInput>
      | MonitorCreateWithoutUserInput[]
      | MonitorUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | MonitorCreateOrConnectWithoutUserInput
      | MonitorCreateOrConnectWithoutUserInput[];
    createMany?: MonitorCreateManyUserInputEnvelope;
    connect?: MonitorWhereUniqueInput | MonitorWhereUniqueInput[];
  };

  export type NotificationChannelCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<
          NotificationChannelCreateWithoutUserInput,
          NotificationChannelUncheckedCreateWithoutUserInput
        >
      | NotificationChannelCreateWithoutUserInput[]
      | NotificationChannelUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | NotificationChannelCreateOrConnectWithoutUserInput
      | NotificationChannelCreateOrConnectWithoutUserInput[];
    createMany?: NotificationChannelCreateManyUserInputEnvelope;
    connect?: NotificationChannelWhereUniqueInput | NotificationChannelWhereUniqueInput[];
  };

  export type SessionUncheckedCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>
      | SessionCreateWithoutUserInput[]
      | SessionUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | SessionCreateOrConnectWithoutUserInput
      | SessionCreateOrConnectWithoutUserInput[];
    createMany?: SessionCreateManyUserInputEnvelope;
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[];
  };

  export type AccountUncheckedCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput>
      | AccountCreateWithoutUserInput[]
      | AccountUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | AccountCreateOrConnectWithoutUserInput
      | AccountCreateOrConnectWithoutUserInput[];
    createMany?: AccountCreateManyUserInputEnvelope;
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[];
  };

  export type MonitorUncheckedCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<MonitorCreateWithoutUserInput, MonitorUncheckedCreateWithoutUserInput>
      | MonitorCreateWithoutUserInput[]
      | MonitorUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | MonitorCreateOrConnectWithoutUserInput
      | MonitorCreateOrConnectWithoutUserInput[];
    createMany?: MonitorCreateManyUserInputEnvelope;
    connect?: MonitorWhereUniqueInput | MonitorWhereUniqueInput[];
  };

  export type NotificationChannelUncheckedCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<
          NotificationChannelCreateWithoutUserInput,
          NotificationChannelUncheckedCreateWithoutUserInput
        >
      | NotificationChannelCreateWithoutUserInput[]
      | NotificationChannelUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | NotificationChannelCreateOrConnectWithoutUserInput
      | NotificationChannelCreateOrConnectWithoutUserInput[];
    createMany?: NotificationChannelCreateManyUserInputEnvelope;
    connect?: NotificationChannelWhereUniqueInput | NotificationChannelWhereUniqueInput[];
  };

  export type StringFieldUpdateOperationsInput = {
    set?: string;
  };

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean;
  };

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null;
  };

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string;
  };

  export type SessionUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>
      | SessionCreateWithoutUserInput[]
      | SessionUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | SessionCreateOrConnectWithoutUserInput
      | SessionCreateOrConnectWithoutUserInput[];
    upsert?:
      | SessionUpsertWithWhereUniqueWithoutUserInput
      | SessionUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: SessionCreateManyUserInputEnvelope;
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[];
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[];
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[];
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[];
    update?:
      | SessionUpdateWithWhereUniqueWithoutUserInput
      | SessionUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?:
      | SessionUpdateManyWithWhereWithoutUserInput
      | SessionUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[];
  };

  export type AccountUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput>
      | AccountCreateWithoutUserInput[]
      | AccountUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | AccountCreateOrConnectWithoutUserInput
      | AccountCreateOrConnectWithoutUserInput[];
    upsert?:
      | AccountUpsertWithWhereUniqueWithoutUserInput
      | AccountUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: AccountCreateManyUserInputEnvelope;
    set?: AccountWhereUniqueInput | AccountWhereUniqueInput[];
    disconnect?: AccountWhereUniqueInput | AccountWhereUniqueInput[];
    delete?: AccountWhereUniqueInput | AccountWhereUniqueInput[];
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[];
    update?:
      | AccountUpdateWithWhereUniqueWithoutUserInput
      | AccountUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?:
      | AccountUpdateManyWithWhereWithoutUserInput
      | AccountUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: AccountScalarWhereInput | AccountScalarWhereInput[];
  };

  export type MonitorUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<MonitorCreateWithoutUserInput, MonitorUncheckedCreateWithoutUserInput>
      | MonitorCreateWithoutUserInput[]
      | MonitorUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | MonitorCreateOrConnectWithoutUserInput
      | MonitorCreateOrConnectWithoutUserInput[];
    upsert?:
      | MonitorUpsertWithWhereUniqueWithoutUserInput
      | MonitorUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: MonitorCreateManyUserInputEnvelope;
    set?: MonitorWhereUniqueInput | MonitorWhereUniqueInput[];
    disconnect?: MonitorWhereUniqueInput | MonitorWhereUniqueInput[];
    delete?: MonitorWhereUniqueInput | MonitorWhereUniqueInput[];
    connect?: MonitorWhereUniqueInput | MonitorWhereUniqueInput[];
    update?:
      | MonitorUpdateWithWhereUniqueWithoutUserInput
      | MonitorUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?:
      | MonitorUpdateManyWithWhereWithoutUserInput
      | MonitorUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: MonitorScalarWhereInput | MonitorScalarWhereInput[];
  };

  export type NotificationChannelUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<
          NotificationChannelCreateWithoutUserInput,
          NotificationChannelUncheckedCreateWithoutUserInput
        >
      | NotificationChannelCreateWithoutUserInput[]
      | NotificationChannelUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | NotificationChannelCreateOrConnectWithoutUserInput
      | NotificationChannelCreateOrConnectWithoutUserInput[];
    upsert?:
      | NotificationChannelUpsertWithWhereUniqueWithoutUserInput
      | NotificationChannelUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: NotificationChannelCreateManyUserInputEnvelope;
    set?: NotificationChannelWhereUniqueInput | NotificationChannelWhereUniqueInput[];
    disconnect?: NotificationChannelWhereUniqueInput | NotificationChannelWhereUniqueInput[];
    delete?: NotificationChannelWhereUniqueInput | NotificationChannelWhereUniqueInput[];
    connect?: NotificationChannelWhereUniqueInput | NotificationChannelWhereUniqueInput[];
    update?:
      | NotificationChannelUpdateWithWhereUniqueWithoutUserInput
      | NotificationChannelUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?:
      | NotificationChannelUpdateManyWithWhereWithoutUserInput
      | NotificationChannelUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: NotificationChannelScalarWhereInput | NotificationChannelScalarWhereInput[];
  };

  export type SessionUncheckedUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>
      | SessionCreateWithoutUserInput[]
      | SessionUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | SessionCreateOrConnectWithoutUserInput
      | SessionCreateOrConnectWithoutUserInput[];
    upsert?:
      | SessionUpsertWithWhereUniqueWithoutUserInput
      | SessionUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: SessionCreateManyUserInputEnvelope;
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[];
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[];
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[];
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[];
    update?:
      | SessionUpdateWithWhereUniqueWithoutUserInput
      | SessionUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?:
      | SessionUpdateManyWithWhereWithoutUserInput
      | SessionUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[];
  };

  export type AccountUncheckedUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput>
      | AccountCreateWithoutUserInput[]
      | AccountUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | AccountCreateOrConnectWithoutUserInput
      | AccountCreateOrConnectWithoutUserInput[];
    upsert?:
      | AccountUpsertWithWhereUniqueWithoutUserInput
      | AccountUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: AccountCreateManyUserInputEnvelope;
    set?: AccountWhereUniqueInput | AccountWhereUniqueInput[];
    disconnect?: AccountWhereUniqueInput | AccountWhereUniqueInput[];
    delete?: AccountWhereUniqueInput | AccountWhereUniqueInput[];
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[];
    update?:
      | AccountUpdateWithWhereUniqueWithoutUserInput
      | AccountUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?:
      | AccountUpdateManyWithWhereWithoutUserInput
      | AccountUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: AccountScalarWhereInput | AccountScalarWhereInput[];
  };

  export type MonitorUncheckedUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<MonitorCreateWithoutUserInput, MonitorUncheckedCreateWithoutUserInput>
      | MonitorCreateWithoutUserInput[]
      | MonitorUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | MonitorCreateOrConnectWithoutUserInput
      | MonitorCreateOrConnectWithoutUserInput[];
    upsert?:
      | MonitorUpsertWithWhereUniqueWithoutUserInput
      | MonitorUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: MonitorCreateManyUserInputEnvelope;
    set?: MonitorWhereUniqueInput | MonitorWhereUniqueInput[];
    disconnect?: MonitorWhereUniqueInput | MonitorWhereUniqueInput[];
    delete?: MonitorWhereUniqueInput | MonitorWhereUniqueInput[];
    connect?: MonitorWhereUniqueInput | MonitorWhereUniqueInput[];
    update?:
      | MonitorUpdateWithWhereUniqueWithoutUserInput
      | MonitorUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?:
      | MonitorUpdateManyWithWhereWithoutUserInput
      | MonitorUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: MonitorScalarWhereInput | MonitorScalarWhereInput[];
  };

  export type NotificationChannelUncheckedUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<
          NotificationChannelCreateWithoutUserInput,
          NotificationChannelUncheckedCreateWithoutUserInput
        >
      | NotificationChannelCreateWithoutUserInput[]
      | NotificationChannelUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | NotificationChannelCreateOrConnectWithoutUserInput
      | NotificationChannelCreateOrConnectWithoutUserInput[];
    upsert?:
      | NotificationChannelUpsertWithWhereUniqueWithoutUserInput
      | NotificationChannelUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: NotificationChannelCreateManyUserInputEnvelope;
    set?: NotificationChannelWhereUniqueInput | NotificationChannelWhereUniqueInput[];
    disconnect?: NotificationChannelWhereUniqueInput | NotificationChannelWhereUniqueInput[];
    delete?: NotificationChannelWhereUniqueInput | NotificationChannelWhereUniqueInput[];
    connect?: NotificationChannelWhereUniqueInput | NotificationChannelWhereUniqueInput[];
    update?:
      | NotificationChannelUpdateWithWhereUniqueWithoutUserInput
      | NotificationChannelUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?:
      | NotificationChannelUpdateManyWithWhereWithoutUserInput
      | NotificationChannelUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: NotificationChannelScalarWhereInput | NotificationChannelScalarWhereInput[];
  };

  export type UserCreateNestedOneWithoutSessionsInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>;
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput;
    connect?: UserWhereUniqueInput;
  };

  export type UserUpdateOneRequiredWithoutSessionsNestedInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>;
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput;
    upsert?: UserUpsertWithoutSessionsInput;
    connect?: UserWhereUniqueInput;
    update?: XOR<
      XOR<UserUpdateToOneWithWhereWithoutSessionsInput, UserUpdateWithoutSessionsInput>,
      UserUncheckedUpdateWithoutSessionsInput
    >;
  };

  export type UserCreateNestedOneWithoutAccountsInput = {
    create?: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>;
    connectOrCreate?: UserCreateOrConnectWithoutAccountsInput;
    connect?: UserWhereUniqueInput;
  };

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null;
  };

  export type UserUpdateOneRequiredWithoutAccountsNestedInput = {
    create?: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>;
    connectOrCreate?: UserCreateOrConnectWithoutAccountsInput;
    upsert?: UserUpsertWithoutAccountsInput;
    connect?: UserWhereUniqueInput;
    update?: XOR<
      XOR<UserUpdateToOneWithWhereWithoutAccountsInput, UserUpdateWithoutAccountsInput>,
      UserUncheckedUpdateWithoutAccountsInput
    >;
  };

  export type MonitorCreateNestedOneWithoutIncidentsInput = {
    create?: XOR<MonitorCreateWithoutIncidentsInput, MonitorUncheckedCreateWithoutIncidentsInput>;
    connectOrCreate?: MonitorCreateOrConnectWithoutIncidentsInput;
    connect?: MonitorWhereUniqueInput;
  };

  export type IncidentEventCreateNestedManyWithoutIncidentInput = {
    create?:
      | XOR<
          IncidentEventCreateWithoutIncidentInput,
          IncidentEventUncheckedCreateWithoutIncidentInput
        >
      | IncidentEventCreateWithoutIncidentInput[]
      | IncidentEventUncheckedCreateWithoutIncidentInput[];
    connectOrCreate?:
      | IncidentEventCreateOrConnectWithoutIncidentInput
      | IncidentEventCreateOrConnectWithoutIncidentInput[];
    createMany?: IncidentEventCreateManyIncidentInputEnvelope;
    connect?: IncidentEventWhereUniqueInput | IncidentEventWhereUniqueInput[];
  };

  export type IncidentEventUncheckedCreateNestedManyWithoutIncidentInput = {
    create?:
      | XOR<
          IncidentEventCreateWithoutIncidentInput,
          IncidentEventUncheckedCreateWithoutIncidentInput
        >
      | IncidentEventCreateWithoutIncidentInput[]
      | IncidentEventUncheckedCreateWithoutIncidentInput[];
    connectOrCreate?:
      | IncidentEventCreateOrConnectWithoutIncidentInput
      | IncidentEventCreateOrConnectWithoutIncidentInput[];
    createMany?: IncidentEventCreateManyIncidentInputEnvelope;
    connect?: IncidentEventWhereUniqueInput | IncidentEventWhereUniqueInput[];
  };

  export type EnumIncidentStatusFieldUpdateOperationsInput = {
    set?: $Enums.IncidentStatus;
  };

  export type EnumSeverityFieldUpdateOperationsInput = {
    set?: $Enums.Severity;
  };

  export type MonitorUpdateOneRequiredWithoutIncidentsNestedInput = {
    create?: XOR<MonitorCreateWithoutIncidentsInput, MonitorUncheckedCreateWithoutIncidentsInput>;
    connectOrCreate?: MonitorCreateOrConnectWithoutIncidentsInput;
    upsert?: MonitorUpsertWithoutIncidentsInput;
    connect?: MonitorWhereUniqueInput;
    update?: XOR<
      XOR<MonitorUpdateToOneWithWhereWithoutIncidentsInput, MonitorUpdateWithoutIncidentsInput>,
      MonitorUncheckedUpdateWithoutIncidentsInput
    >;
  };

  export type IncidentEventUpdateManyWithoutIncidentNestedInput = {
    create?:
      | XOR<
          IncidentEventCreateWithoutIncidentInput,
          IncidentEventUncheckedCreateWithoutIncidentInput
        >
      | IncidentEventCreateWithoutIncidentInput[]
      | IncidentEventUncheckedCreateWithoutIncidentInput[];
    connectOrCreate?:
      | IncidentEventCreateOrConnectWithoutIncidentInput
      | IncidentEventCreateOrConnectWithoutIncidentInput[];
    upsert?:
      | IncidentEventUpsertWithWhereUniqueWithoutIncidentInput
      | IncidentEventUpsertWithWhereUniqueWithoutIncidentInput[];
    createMany?: IncidentEventCreateManyIncidentInputEnvelope;
    set?: IncidentEventWhereUniqueInput | IncidentEventWhereUniqueInput[];
    disconnect?: IncidentEventWhereUniqueInput | IncidentEventWhereUniqueInput[];
    delete?: IncidentEventWhereUniqueInput | IncidentEventWhereUniqueInput[];
    connect?: IncidentEventWhereUniqueInput | IncidentEventWhereUniqueInput[];
    update?:
      | IncidentEventUpdateWithWhereUniqueWithoutIncidentInput
      | IncidentEventUpdateWithWhereUniqueWithoutIncidentInput[];
    updateMany?:
      | IncidentEventUpdateManyWithWhereWithoutIncidentInput
      | IncidentEventUpdateManyWithWhereWithoutIncidentInput[];
    deleteMany?: IncidentEventScalarWhereInput | IncidentEventScalarWhereInput[];
  };

  export type IncidentEventUncheckedUpdateManyWithoutIncidentNestedInput = {
    create?:
      | XOR<
          IncidentEventCreateWithoutIncidentInput,
          IncidentEventUncheckedCreateWithoutIncidentInput
        >
      | IncidentEventCreateWithoutIncidentInput[]
      | IncidentEventUncheckedCreateWithoutIncidentInput[];
    connectOrCreate?:
      | IncidentEventCreateOrConnectWithoutIncidentInput
      | IncidentEventCreateOrConnectWithoutIncidentInput[];
    upsert?:
      | IncidentEventUpsertWithWhereUniqueWithoutIncidentInput
      | IncidentEventUpsertWithWhereUniqueWithoutIncidentInput[];
    createMany?: IncidentEventCreateManyIncidentInputEnvelope;
    set?: IncidentEventWhereUniqueInput | IncidentEventWhereUniqueInput[];
    disconnect?: IncidentEventWhereUniqueInput | IncidentEventWhereUniqueInput[];
    delete?: IncidentEventWhereUniqueInput | IncidentEventWhereUniqueInput[];
    connect?: IncidentEventWhereUniqueInput | IncidentEventWhereUniqueInput[];
    update?:
      | IncidentEventUpdateWithWhereUniqueWithoutIncidentInput
      | IncidentEventUpdateWithWhereUniqueWithoutIncidentInput[];
    updateMany?:
      | IncidentEventUpdateManyWithWhereWithoutIncidentInput
      | IncidentEventUpdateManyWithWhereWithoutIncidentInput[];
    deleteMany?: IncidentEventScalarWhereInput | IncidentEventScalarWhereInput[];
  };

  export type IncidentCreateNestedOneWithoutEventsInput = {
    create?: XOR<IncidentCreateWithoutEventsInput, IncidentUncheckedCreateWithoutEventsInput>;
    connectOrCreate?: IncidentCreateOrConnectWithoutEventsInput;
    connect?: IncidentWhereUniqueInput;
  };

  export type EnumIncidentEventTypeFieldUpdateOperationsInput = {
    set?: $Enums.IncidentEventType;
  };

  export type IncidentUpdateOneRequiredWithoutEventsNestedInput = {
    create?: XOR<IncidentCreateWithoutEventsInput, IncidentUncheckedCreateWithoutEventsInput>;
    connectOrCreate?: IncidentCreateOrConnectWithoutEventsInput;
    upsert?: IncidentUpsertWithoutEventsInput;
    connect?: IncidentWhereUniqueInput;
    update?: XOR<
      XOR<IncidentUpdateToOneWithWhereWithoutEventsInput, IncidentUpdateWithoutEventsInput>,
      IncidentUncheckedUpdateWithoutEventsInput
    >;
  };

  export type MonitorCreateNestedOneWithoutRegionalIncidentsInput = {
    create?: XOR<
      MonitorCreateWithoutRegionalIncidentsInput,
      MonitorUncheckedCreateWithoutRegionalIncidentsInput
    >;
    connectOrCreate?: MonitorCreateOrConnectWithoutRegionalIncidentsInput;
    connect?: MonitorWhereUniqueInput;
  };

  export type MonitorUpdateOneRequiredWithoutRegionalIncidentsNestedInput = {
    create?: XOR<
      MonitorCreateWithoutRegionalIncidentsInput,
      MonitorUncheckedCreateWithoutRegionalIncidentsInput
    >;
    connectOrCreate?: MonitorCreateOrConnectWithoutRegionalIncidentsInput;
    upsert?: MonitorUpsertWithoutRegionalIncidentsInput;
    connect?: MonitorWhereUniqueInput;
    update?: XOR<
      XOR<
        MonitorUpdateToOneWithWhereWithoutRegionalIncidentsInput,
        MonitorUpdateWithoutRegionalIncidentsInput
      >,
      MonitorUncheckedUpdateWithoutRegionalIncidentsInput
    >;
  };

  export type UserCreateNestedOneWithoutNotificationChannelsInput = {
    create?: XOR<
      UserCreateWithoutNotificationChannelsInput,
      UserUncheckedCreateWithoutNotificationChannelsInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutNotificationChannelsInput;
    connect?: UserWhereUniqueInput;
  };

  export type AlertRuleCreateNestedManyWithoutChannelsInput = {
    create?:
      | XOR<AlertRuleCreateWithoutChannelsInput, AlertRuleUncheckedCreateWithoutChannelsInput>
      | AlertRuleCreateWithoutChannelsInput[]
      | AlertRuleUncheckedCreateWithoutChannelsInput[];
    connectOrCreate?:
      | AlertRuleCreateOrConnectWithoutChannelsInput
      | AlertRuleCreateOrConnectWithoutChannelsInput[];
    connect?: AlertRuleWhereUniqueInput | AlertRuleWhereUniqueInput[];
  };

  export type AlertRuleUncheckedCreateNestedManyWithoutChannelsInput = {
    create?:
      | XOR<AlertRuleCreateWithoutChannelsInput, AlertRuleUncheckedCreateWithoutChannelsInput>
      | AlertRuleCreateWithoutChannelsInput[]
      | AlertRuleUncheckedCreateWithoutChannelsInput[];
    connectOrCreate?:
      | AlertRuleCreateOrConnectWithoutChannelsInput
      | AlertRuleCreateOrConnectWithoutChannelsInput[];
    connect?: AlertRuleWhereUniqueInput | AlertRuleWhereUniqueInput[];
  };

  export type EnumNotificationTypeFieldUpdateOperationsInput = {
    set?: $Enums.NotificationType;
  };

  export type UserUpdateOneRequiredWithoutNotificationChannelsNestedInput = {
    create?: XOR<
      UserCreateWithoutNotificationChannelsInput,
      UserUncheckedCreateWithoutNotificationChannelsInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutNotificationChannelsInput;
    upsert?: UserUpsertWithoutNotificationChannelsInput;
    connect?: UserWhereUniqueInput;
    update?: XOR<
      XOR<
        UserUpdateToOneWithWhereWithoutNotificationChannelsInput,
        UserUpdateWithoutNotificationChannelsInput
      >,
      UserUncheckedUpdateWithoutNotificationChannelsInput
    >;
  };

  export type AlertRuleUpdateManyWithoutChannelsNestedInput = {
    create?:
      | XOR<AlertRuleCreateWithoutChannelsInput, AlertRuleUncheckedCreateWithoutChannelsInput>
      | AlertRuleCreateWithoutChannelsInput[]
      | AlertRuleUncheckedCreateWithoutChannelsInput[];
    connectOrCreate?:
      | AlertRuleCreateOrConnectWithoutChannelsInput
      | AlertRuleCreateOrConnectWithoutChannelsInput[];
    upsert?:
      | AlertRuleUpsertWithWhereUniqueWithoutChannelsInput
      | AlertRuleUpsertWithWhereUniqueWithoutChannelsInput[];
    set?: AlertRuleWhereUniqueInput | AlertRuleWhereUniqueInput[];
    disconnect?: AlertRuleWhereUniqueInput | AlertRuleWhereUniqueInput[];
    delete?: AlertRuleWhereUniqueInput | AlertRuleWhereUniqueInput[];
    connect?: AlertRuleWhereUniqueInput | AlertRuleWhereUniqueInput[];
    update?:
      | AlertRuleUpdateWithWhereUniqueWithoutChannelsInput
      | AlertRuleUpdateWithWhereUniqueWithoutChannelsInput[];
    updateMany?:
      | AlertRuleUpdateManyWithWhereWithoutChannelsInput
      | AlertRuleUpdateManyWithWhereWithoutChannelsInput[];
    deleteMany?: AlertRuleScalarWhereInput | AlertRuleScalarWhereInput[];
  };

  export type AlertRuleUncheckedUpdateManyWithoutChannelsNestedInput = {
    create?:
      | XOR<AlertRuleCreateWithoutChannelsInput, AlertRuleUncheckedCreateWithoutChannelsInput>
      | AlertRuleCreateWithoutChannelsInput[]
      | AlertRuleUncheckedCreateWithoutChannelsInput[];
    connectOrCreate?:
      | AlertRuleCreateOrConnectWithoutChannelsInput
      | AlertRuleCreateOrConnectWithoutChannelsInput[];
    upsert?:
      | AlertRuleUpsertWithWhereUniqueWithoutChannelsInput
      | AlertRuleUpsertWithWhereUniqueWithoutChannelsInput[];
    set?: AlertRuleWhereUniqueInput | AlertRuleWhereUniqueInput[];
    disconnect?: AlertRuleWhereUniqueInput | AlertRuleWhereUniqueInput[];
    delete?: AlertRuleWhereUniqueInput | AlertRuleWhereUniqueInput[];
    connect?: AlertRuleWhereUniqueInput | AlertRuleWhereUniqueInput[];
    update?:
      | AlertRuleUpdateWithWhereUniqueWithoutChannelsInput
      | AlertRuleUpdateWithWhereUniqueWithoutChannelsInput[];
    updateMany?:
      | AlertRuleUpdateManyWithWhereWithoutChannelsInput
      | AlertRuleUpdateManyWithWhereWithoutChannelsInput[];
    deleteMany?: AlertRuleScalarWhereInput | AlertRuleScalarWhereInput[];
  };

  export type MonitorCreateNestedOneWithoutAlertRulesInput = {
    create?: XOR<MonitorCreateWithoutAlertRulesInput, MonitorUncheckedCreateWithoutAlertRulesInput>;
    connectOrCreate?: MonitorCreateOrConnectWithoutAlertRulesInput;
    connect?: MonitorWhereUniqueInput;
  };

  export type NotificationChannelCreateNestedManyWithoutAlertRulesInput = {
    create?:
      | XOR<
          NotificationChannelCreateWithoutAlertRulesInput,
          NotificationChannelUncheckedCreateWithoutAlertRulesInput
        >
      | NotificationChannelCreateWithoutAlertRulesInput[]
      | NotificationChannelUncheckedCreateWithoutAlertRulesInput[];
    connectOrCreate?:
      | NotificationChannelCreateOrConnectWithoutAlertRulesInput
      | NotificationChannelCreateOrConnectWithoutAlertRulesInput[];
    connect?: NotificationChannelWhereUniqueInput | NotificationChannelWhereUniqueInput[];
  };

  export type NotificationChannelUncheckedCreateNestedManyWithoutAlertRulesInput = {
    create?:
      | XOR<
          NotificationChannelCreateWithoutAlertRulesInput,
          NotificationChannelUncheckedCreateWithoutAlertRulesInput
        >
      | NotificationChannelCreateWithoutAlertRulesInput[]
      | NotificationChannelUncheckedCreateWithoutAlertRulesInput[];
    connectOrCreate?:
      | NotificationChannelCreateOrConnectWithoutAlertRulesInput
      | NotificationChannelCreateOrConnectWithoutAlertRulesInput[];
    connect?: NotificationChannelWhereUniqueInput | NotificationChannelWhereUniqueInput[];
  };

  export type EnumAlertTriggerFieldUpdateOperationsInput = {
    set?: $Enums.AlertTrigger;
  };

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
  };

  export type NullableEnumComparisonOperatorFieldUpdateOperationsInput = {
    set?: $Enums.ComparisonOperator | null;
  };

  export type NullableEnumMonitorStatusFieldUpdateOperationsInput = {
    set?: $Enums.MonitorStatus | null;
  };

  export type MonitorUpdateOneRequiredWithoutAlertRulesNestedInput = {
    create?: XOR<MonitorCreateWithoutAlertRulesInput, MonitorUncheckedCreateWithoutAlertRulesInput>;
    connectOrCreate?: MonitorCreateOrConnectWithoutAlertRulesInput;
    upsert?: MonitorUpsertWithoutAlertRulesInput;
    connect?: MonitorWhereUniqueInput;
    update?: XOR<
      XOR<MonitorUpdateToOneWithWhereWithoutAlertRulesInput, MonitorUpdateWithoutAlertRulesInput>,
      MonitorUncheckedUpdateWithoutAlertRulesInput
    >;
  };

  export type NotificationChannelUpdateManyWithoutAlertRulesNestedInput = {
    create?:
      | XOR<
          NotificationChannelCreateWithoutAlertRulesInput,
          NotificationChannelUncheckedCreateWithoutAlertRulesInput
        >
      | NotificationChannelCreateWithoutAlertRulesInput[]
      | NotificationChannelUncheckedCreateWithoutAlertRulesInput[];
    connectOrCreate?:
      | NotificationChannelCreateOrConnectWithoutAlertRulesInput
      | NotificationChannelCreateOrConnectWithoutAlertRulesInput[];
    upsert?:
      | NotificationChannelUpsertWithWhereUniqueWithoutAlertRulesInput
      | NotificationChannelUpsertWithWhereUniqueWithoutAlertRulesInput[];
    set?: NotificationChannelWhereUniqueInput | NotificationChannelWhereUniqueInput[];
    disconnect?: NotificationChannelWhereUniqueInput | NotificationChannelWhereUniqueInput[];
    delete?: NotificationChannelWhereUniqueInput | NotificationChannelWhereUniqueInput[];
    connect?: NotificationChannelWhereUniqueInput | NotificationChannelWhereUniqueInput[];
    update?:
      | NotificationChannelUpdateWithWhereUniqueWithoutAlertRulesInput
      | NotificationChannelUpdateWithWhereUniqueWithoutAlertRulesInput[];
    updateMany?:
      | NotificationChannelUpdateManyWithWhereWithoutAlertRulesInput
      | NotificationChannelUpdateManyWithWhereWithoutAlertRulesInput[];
    deleteMany?: NotificationChannelScalarWhereInput | NotificationChannelScalarWhereInput[];
  };

  export type NotificationChannelUncheckedUpdateManyWithoutAlertRulesNestedInput = {
    create?:
      | XOR<
          NotificationChannelCreateWithoutAlertRulesInput,
          NotificationChannelUncheckedCreateWithoutAlertRulesInput
        >
      | NotificationChannelCreateWithoutAlertRulesInput[]
      | NotificationChannelUncheckedCreateWithoutAlertRulesInput[];
    connectOrCreate?:
      | NotificationChannelCreateOrConnectWithoutAlertRulesInput
      | NotificationChannelCreateOrConnectWithoutAlertRulesInput[];
    upsert?:
      | NotificationChannelUpsertWithWhereUniqueWithoutAlertRulesInput
      | NotificationChannelUpsertWithWhereUniqueWithoutAlertRulesInput[];
    set?: NotificationChannelWhereUniqueInput | NotificationChannelWhereUniqueInput[];
    disconnect?: NotificationChannelWhereUniqueInput | NotificationChannelWhereUniqueInput[];
    delete?: NotificationChannelWhereUniqueInput | NotificationChannelWhereUniqueInput[];
    connect?: NotificationChannelWhereUniqueInput | NotificationChannelWhereUniqueInput[];
    update?:
      | NotificationChannelUpdateWithWhereUniqueWithoutAlertRulesInput
      | NotificationChannelUpdateWithWhereUniqueWithoutAlertRulesInput[];
    updateMany?:
      | NotificationChannelUpdateManyWithWhereWithoutAlertRulesInput
      | NotificationChannelUpdateManyWithWhereWithoutAlertRulesInput[];
    deleteMany?: NotificationChannelScalarWhereInput | NotificationChannelScalarWhereInput[];
  };

  export type UserCreateNestedOneWithoutMonitorsInput = {
    create?: XOR<UserCreateWithoutMonitorsInput, UserUncheckedCreateWithoutMonitorsInput>;
    connectOrCreate?: UserCreateOrConnectWithoutMonitorsInput;
    connect?: UserWhereUniqueInput;
  };

  export type MonitorEventCreateNestedManyWithoutMonitorInput = {
    create?:
      | XOR<MonitorEventCreateWithoutMonitorInput, MonitorEventUncheckedCreateWithoutMonitorInput>
      | MonitorEventCreateWithoutMonitorInput[]
      | MonitorEventUncheckedCreateWithoutMonitorInput[];
    connectOrCreate?:
      | MonitorEventCreateOrConnectWithoutMonitorInput
      | MonitorEventCreateOrConnectWithoutMonitorInput[];
    createMany?: MonitorEventCreateManyMonitorInputEnvelope;
    connect?: MonitorEventWhereUniqueInput | MonitorEventWhereUniqueInput[];
  };

  export type MaintenanceWindowCreateNestedManyWithoutMonitorInput = {
    create?:
      | XOR<
          MaintenanceWindowCreateWithoutMonitorInput,
          MaintenanceWindowUncheckedCreateWithoutMonitorInput
        >
      | MaintenanceWindowCreateWithoutMonitorInput[]
      | MaintenanceWindowUncheckedCreateWithoutMonitorInput[];
    connectOrCreate?:
      | MaintenanceWindowCreateOrConnectWithoutMonitorInput
      | MaintenanceWindowCreateOrConnectWithoutMonitorInput[];
    createMany?: MaintenanceWindowCreateManyMonitorInputEnvelope;
    connect?: MaintenanceWindowWhereUniqueInput | MaintenanceWindowWhereUniqueInput[];
  };

  export type AlertRuleCreateNestedManyWithoutMonitorInput = {
    create?:
      | XOR<AlertRuleCreateWithoutMonitorInput, AlertRuleUncheckedCreateWithoutMonitorInput>
      | AlertRuleCreateWithoutMonitorInput[]
      | AlertRuleUncheckedCreateWithoutMonitorInput[];
    connectOrCreate?:
      | AlertRuleCreateOrConnectWithoutMonitorInput
      | AlertRuleCreateOrConnectWithoutMonitorInput[];
    createMany?: AlertRuleCreateManyMonitorInputEnvelope;
    connect?: AlertRuleWhereUniqueInput | AlertRuleWhereUniqueInput[];
  };

  export type IncidentCreateNestedManyWithoutMonitorInput = {
    create?:
      | XOR<IncidentCreateWithoutMonitorInput, IncidentUncheckedCreateWithoutMonitorInput>
      | IncidentCreateWithoutMonitorInput[]
      | IncidentUncheckedCreateWithoutMonitorInput[];
    connectOrCreate?:
      | IncidentCreateOrConnectWithoutMonitorInput
      | IncidentCreateOrConnectWithoutMonitorInput[];
    createMany?: IncidentCreateManyMonitorInputEnvelope;
    connect?: IncidentWhereUniqueInput | IncidentWhereUniqueInput[];
  };

  export type RegionalIncidentCreateNestedManyWithoutMonitorInput = {
    create?:
      | XOR<
          RegionalIncidentCreateWithoutMonitorInput,
          RegionalIncidentUncheckedCreateWithoutMonitorInput
        >
      | RegionalIncidentCreateWithoutMonitorInput[]
      | RegionalIncidentUncheckedCreateWithoutMonitorInput[];
    connectOrCreate?:
      | RegionalIncidentCreateOrConnectWithoutMonitorInput
      | RegionalIncidentCreateOrConnectWithoutMonitorInput[];
    createMany?: RegionalIncidentCreateManyMonitorInputEnvelope;
    connect?: RegionalIncidentWhereUniqueInput | RegionalIncidentWhereUniqueInput[];
  };

  export type MonitorEventUncheckedCreateNestedManyWithoutMonitorInput = {
    create?:
      | XOR<MonitorEventCreateWithoutMonitorInput, MonitorEventUncheckedCreateWithoutMonitorInput>
      | MonitorEventCreateWithoutMonitorInput[]
      | MonitorEventUncheckedCreateWithoutMonitorInput[];
    connectOrCreate?:
      | MonitorEventCreateOrConnectWithoutMonitorInput
      | MonitorEventCreateOrConnectWithoutMonitorInput[];
    createMany?: MonitorEventCreateManyMonitorInputEnvelope;
    connect?: MonitorEventWhereUniqueInput | MonitorEventWhereUniqueInput[];
  };

  export type MaintenanceWindowUncheckedCreateNestedManyWithoutMonitorInput = {
    create?:
      | XOR<
          MaintenanceWindowCreateWithoutMonitorInput,
          MaintenanceWindowUncheckedCreateWithoutMonitorInput
        >
      | MaintenanceWindowCreateWithoutMonitorInput[]
      | MaintenanceWindowUncheckedCreateWithoutMonitorInput[];
    connectOrCreate?:
      | MaintenanceWindowCreateOrConnectWithoutMonitorInput
      | MaintenanceWindowCreateOrConnectWithoutMonitorInput[];
    createMany?: MaintenanceWindowCreateManyMonitorInputEnvelope;
    connect?: MaintenanceWindowWhereUniqueInput | MaintenanceWindowWhereUniqueInput[];
  };

  export type AlertRuleUncheckedCreateNestedManyWithoutMonitorInput = {
    create?:
      | XOR<AlertRuleCreateWithoutMonitorInput, AlertRuleUncheckedCreateWithoutMonitorInput>
      | AlertRuleCreateWithoutMonitorInput[]
      | AlertRuleUncheckedCreateWithoutMonitorInput[];
    connectOrCreate?:
      | AlertRuleCreateOrConnectWithoutMonitorInput
      | AlertRuleCreateOrConnectWithoutMonitorInput[];
    createMany?: AlertRuleCreateManyMonitorInputEnvelope;
    connect?: AlertRuleWhereUniqueInput | AlertRuleWhereUniqueInput[];
  };

  export type IncidentUncheckedCreateNestedManyWithoutMonitorInput = {
    create?:
      | XOR<IncidentCreateWithoutMonitorInput, IncidentUncheckedCreateWithoutMonitorInput>
      | IncidentCreateWithoutMonitorInput[]
      | IncidentUncheckedCreateWithoutMonitorInput[];
    connectOrCreate?:
      | IncidentCreateOrConnectWithoutMonitorInput
      | IncidentCreateOrConnectWithoutMonitorInput[];
    createMany?: IncidentCreateManyMonitorInputEnvelope;
    connect?: IncidentWhereUniqueInput | IncidentWhereUniqueInput[];
  };

  export type RegionalIncidentUncheckedCreateNestedManyWithoutMonitorInput = {
    create?:
      | XOR<
          RegionalIncidentCreateWithoutMonitorInput,
          RegionalIncidentUncheckedCreateWithoutMonitorInput
        >
      | RegionalIncidentCreateWithoutMonitorInput[]
      | RegionalIncidentUncheckedCreateWithoutMonitorInput[];
    connectOrCreate?:
      | RegionalIncidentCreateOrConnectWithoutMonitorInput
      | RegionalIncidentCreateOrConnectWithoutMonitorInput[];
    createMany?: RegionalIncidentCreateManyMonitorInputEnvelope;
    connect?: RegionalIncidentWhereUniqueInput | RegionalIncidentWhereUniqueInput[];
  };

  export type EnumMonitorTypeFieldUpdateOperationsInput = {
    set?: $Enums.MonitorType;
  };

  export type IntFieldUpdateOperationsInput = {
    set?: number;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
  };

  export type EnumMonitorStatusFieldUpdateOperationsInput = {
    set?: $Enums.MonitorStatus;
  };

  export type UserUpdateOneRequiredWithoutMonitorsNestedInput = {
    create?: XOR<UserCreateWithoutMonitorsInput, UserUncheckedCreateWithoutMonitorsInput>;
    connectOrCreate?: UserCreateOrConnectWithoutMonitorsInput;
    upsert?: UserUpsertWithoutMonitorsInput;
    connect?: UserWhereUniqueInput;
    update?: XOR<
      XOR<UserUpdateToOneWithWhereWithoutMonitorsInput, UserUpdateWithoutMonitorsInput>,
      UserUncheckedUpdateWithoutMonitorsInput
    >;
  };

  export type MonitorEventUpdateManyWithoutMonitorNestedInput = {
    create?:
      | XOR<MonitorEventCreateWithoutMonitorInput, MonitorEventUncheckedCreateWithoutMonitorInput>
      | MonitorEventCreateWithoutMonitorInput[]
      | MonitorEventUncheckedCreateWithoutMonitorInput[];
    connectOrCreate?:
      | MonitorEventCreateOrConnectWithoutMonitorInput
      | MonitorEventCreateOrConnectWithoutMonitorInput[];
    upsert?:
      | MonitorEventUpsertWithWhereUniqueWithoutMonitorInput
      | MonitorEventUpsertWithWhereUniqueWithoutMonitorInput[];
    createMany?: MonitorEventCreateManyMonitorInputEnvelope;
    set?: MonitorEventWhereUniqueInput | MonitorEventWhereUniqueInput[];
    disconnect?: MonitorEventWhereUniqueInput | MonitorEventWhereUniqueInput[];
    delete?: MonitorEventWhereUniqueInput | MonitorEventWhereUniqueInput[];
    connect?: MonitorEventWhereUniqueInput | MonitorEventWhereUniqueInput[];
    update?:
      | MonitorEventUpdateWithWhereUniqueWithoutMonitorInput
      | MonitorEventUpdateWithWhereUniqueWithoutMonitorInput[];
    updateMany?:
      | MonitorEventUpdateManyWithWhereWithoutMonitorInput
      | MonitorEventUpdateManyWithWhereWithoutMonitorInput[];
    deleteMany?: MonitorEventScalarWhereInput | MonitorEventScalarWhereInput[];
  };

  export type MaintenanceWindowUpdateManyWithoutMonitorNestedInput = {
    create?:
      | XOR<
          MaintenanceWindowCreateWithoutMonitorInput,
          MaintenanceWindowUncheckedCreateWithoutMonitorInput
        >
      | MaintenanceWindowCreateWithoutMonitorInput[]
      | MaintenanceWindowUncheckedCreateWithoutMonitorInput[];
    connectOrCreate?:
      | MaintenanceWindowCreateOrConnectWithoutMonitorInput
      | MaintenanceWindowCreateOrConnectWithoutMonitorInput[];
    upsert?:
      | MaintenanceWindowUpsertWithWhereUniqueWithoutMonitorInput
      | MaintenanceWindowUpsertWithWhereUniqueWithoutMonitorInput[];
    createMany?: MaintenanceWindowCreateManyMonitorInputEnvelope;
    set?: MaintenanceWindowWhereUniqueInput | MaintenanceWindowWhereUniqueInput[];
    disconnect?: MaintenanceWindowWhereUniqueInput | MaintenanceWindowWhereUniqueInput[];
    delete?: MaintenanceWindowWhereUniqueInput | MaintenanceWindowWhereUniqueInput[];
    connect?: MaintenanceWindowWhereUniqueInput | MaintenanceWindowWhereUniqueInput[];
    update?:
      | MaintenanceWindowUpdateWithWhereUniqueWithoutMonitorInput
      | MaintenanceWindowUpdateWithWhereUniqueWithoutMonitorInput[];
    updateMany?:
      | MaintenanceWindowUpdateManyWithWhereWithoutMonitorInput
      | MaintenanceWindowUpdateManyWithWhereWithoutMonitorInput[];
    deleteMany?: MaintenanceWindowScalarWhereInput | MaintenanceWindowScalarWhereInput[];
  };

  export type AlertRuleUpdateManyWithoutMonitorNestedInput = {
    create?:
      | XOR<AlertRuleCreateWithoutMonitorInput, AlertRuleUncheckedCreateWithoutMonitorInput>
      | AlertRuleCreateWithoutMonitorInput[]
      | AlertRuleUncheckedCreateWithoutMonitorInput[];
    connectOrCreate?:
      | AlertRuleCreateOrConnectWithoutMonitorInput
      | AlertRuleCreateOrConnectWithoutMonitorInput[];
    upsert?:
      | AlertRuleUpsertWithWhereUniqueWithoutMonitorInput
      | AlertRuleUpsertWithWhereUniqueWithoutMonitorInput[];
    createMany?: AlertRuleCreateManyMonitorInputEnvelope;
    set?: AlertRuleWhereUniqueInput | AlertRuleWhereUniqueInput[];
    disconnect?: AlertRuleWhereUniqueInput | AlertRuleWhereUniqueInput[];
    delete?: AlertRuleWhereUniqueInput | AlertRuleWhereUniqueInput[];
    connect?: AlertRuleWhereUniqueInput | AlertRuleWhereUniqueInput[];
    update?:
      | AlertRuleUpdateWithWhereUniqueWithoutMonitorInput
      | AlertRuleUpdateWithWhereUniqueWithoutMonitorInput[];
    updateMany?:
      | AlertRuleUpdateManyWithWhereWithoutMonitorInput
      | AlertRuleUpdateManyWithWhereWithoutMonitorInput[];
    deleteMany?: AlertRuleScalarWhereInput | AlertRuleScalarWhereInput[];
  };

  export type IncidentUpdateManyWithoutMonitorNestedInput = {
    create?:
      | XOR<IncidentCreateWithoutMonitorInput, IncidentUncheckedCreateWithoutMonitorInput>
      | IncidentCreateWithoutMonitorInput[]
      | IncidentUncheckedCreateWithoutMonitorInput[];
    connectOrCreate?:
      | IncidentCreateOrConnectWithoutMonitorInput
      | IncidentCreateOrConnectWithoutMonitorInput[];
    upsert?:
      | IncidentUpsertWithWhereUniqueWithoutMonitorInput
      | IncidentUpsertWithWhereUniqueWithoutMonitorInput[];
    createMany?: IncidentCreateManyMonitorInputEnvelope;
    set?: IncidentWhereUniqueInput | IncidentWhereUniqueInput[];
    disconnect?: IncidentWhereUniqueInput | IncidentWhereUniqueInput[];
    delete?: IncidentWhereUniqueInput | IncidentWhereUniqueInput[];
    connect?: IncidentWhereUniqueInput | IncidentWhereUniqueInput[];
    update?:
      | IncidentUpdateWithWhereUniqueWithoutMonitorInput
      | IncidentUpdateWithWhereUniqueWithoutMonitorInput[];
    updateMany?:
      | IncidentUpdateManyWithWhereWithoutMonitorInput
      | IncidentUpdateManyWithWhereWithoutMonitorInput[];
    deleteMany?: IncidentScalarWhereInput | IncidentScalarWhereInput[];
  };

  export type RegionalIncidentUpdateManyWithoutMonitorNestedInput = {
    create?:
      | XOR<
          RegionalIncidentCreateWithoutMonitorInput,
          RegionalIncidentUncheckedCreateWithoutMonitorInput
        >
      | RegionalIncidentCreateWithoutMonitorInput[]
      | RegionalIncidentUncheckedCreateWithoutMonitorInput[];
    connectOrCreate?:
      | RegionalIncidentCreateOrConnectWithoutMonitorInput
      | RegionalIncidentCreateOrConnectWithoutMonitorInput[];
    upsert?:
      | RegionalIncidentUpsertWithWhereUniqueWithoutMonitorInput
      | RegionalIncidentUpsertWithWhereUniqueWithoutMonitorInput[];
    createMany?: RegionalIncidentCreateManyMonitorInputEnvelope;
    set?: RegionalIncidentWhereUniqueInput | RegionalIncidentWhereUniqueInput[];
    disconnect?: RegionalIncidentWhereUniqueInput | RegionalIncidentWhereUniqueInput[];
    delete?: RegionalIncidentWhereUniqueInput | RegionalIncidentWhereUniqueInput[];
    connect?: RegionalIncidentWhereUniqueInput | RegionalIncidentWhereUniqueInput[];
    update?:
      | RegionalIncidentUpdateWithWhereUniqueWithoutMonitorInput
      | RegionalIncidentUpdateWithWhereUniqueWithoutMonitorInput[];
    updateMany?:
      | RegionalIncidentUpdateManyWithWhereWithoutMonitorInput
      | RegionalIncidentUpdateManyWithWhereWithoutMonitorInput[];
    deleteMany?: RegionalIncidentScalarWhereInput | RegionalIncidentScalarWhereInput[];
  };

  export type MonitorEventUncheckedUpdateManyWithoutMonitorNestedInput = {
    create?:
      | XOR<MonitorEventCreateWithoutMonitorInput, MonitorEventUncheckedCreateWithoutMonitorInput>
      | MonitorEventCreateWithoutMonitorInput[]
      | MonitorEventUncheckedCreateWithoutMonitorInput[];
    connectOrCreate?:
      | MonitorEventCreateOrConnectWithoutMonitorInput
      | MonitorEventCreateOrConnectWithoutMonitorInput[];
    upsert?:
      | MonitorEventUpsertWithWhereUniqueWithoutMonitorInput
      | MonitorEventUpsertWithWhereUniqueWithoutMonitorInput[];
    createMany?: MonitorEventCreateManyMonitorInputEnvelope;
    set?: MonitorEventWhereUniqueInput | MonitorEventWhereUniqueInput[];
    disconnect?: MonitorEventWhereUniqueInput | MonitorEventWhereUniqueInput[];
    delete?: MonitorEventWhereUniqueInput | MonitorEventWhereUniqueInput[];
    connect?: MonitorEventWhereUniqueInput | MonitorEventWhereUniqueInput[];
    update?:
      | MonitorEventUpdateWithWhereUniqueWithoutMonitorInput
      | MonitorEventUpdateWithWhereUniqueWithoutMonitorInput[];
    updateMany?:
      | MonitorEventUpdateManyWithWhereWithoutMonitorInput
      | MonitorEventUpdateManyWithWhereWithoutMonitorInput[];
    deleteMany?: MonitorEventScalarWhereInput | MonitorEventScalarWhereInput[];
  };

  export type MaintenanceWindowUncheckedUpdateManyWithoutMonitorNestedInput = {
    create?:
      | XOR<
          MaintenanceWindowCreateWithoutMonitorInput,
          MaintenanceWindowUncheckedCreateWithoutMonitorInput
        >
      | MaintenanceWindowCreateWithoutMonitorInput[]
      | MaintenanceWindowUncheckedCreateWithoutMonitorInput[];
    connectOrCreate?:
      | MaintenanceWindowCreateOrConnectWithoutMonitorInput
      | MaintenanceWindowCreateOrConnectWithoutMonitorInput[];
    upsert?:
      | MaintenanceWindowUpsertWithWhereUniqueWithoutMonitorInput
      | MaintenanceWindowUpsertWithWhereUniqueWithoutMonitorInput[];
    createMany?: MaintenanceWindowCreateManyMonitorInputEnvelope;
    set?: MaintenanceWindowWhereUniqueInput | MaintenanceWindowWhereUniqueInput[];
    disconnect?: MaintenanceWindowWhereUniqueInput | MaintenanceWindowWhereUniqueInput[];
    delete?: MaintenanceWindowWhereUniqueInput | MaintenanceWindowWhereUniqueInput[];
    connect?: MaintenanceWindowWhereUniqueInput | MaintenanceWindowWhereUniqueInput[];
    update?:
      | MaintenanceWindowUpdateWithWhereUniqueWithoutMonitorInput
      | MaintenanceWindowUpdateWithWhereUniqueWithoutMonitorInput[];
    updateMany?:
      | MaintenanceWindowUpdateManyWithWhereWithoutMonitorInput
      | MaintenanceWindowUpdateManyWithWhereWithoutMonitorInput[];
    deleteMany?: MaintenanceWindowScalarWhereInput | MaintenanceWindowScalarWhereInput[];
  };

  export type AlertRuleUncheckedUpdateManyWithoutMonitorNestedInput = {
    create?:
      | XOR<AlertRuleCreateWithoutMonitorInput, AlertRuleUncheckedCreateWithoutMonitorInput>
      | AlertRuleCreateWithoutMonitorInput[]
      | AlertRuleUncheckedCreateWithoutMonitorInput[];
    connectOrCreate?:
      | AlertRuleCreateOrConnectWithoutMonitorInput
      | AlertRuleCreateOrConnectWithoutMonitorInput[];
    upsert?:
      | AlertRuleUpsertWithWhereUniqueWithoutMonitorInput
      | AlertRuleUpsertWithWhereUniqueWithoutMonitorInput[];
    createMany?: AlertRuleCreateManyMonitorInputEnvelope;
    set?: AlertRuleWhereUniqueInput | AlertRuleWhereUniqueInput[];
    disconnect?: AlertRuleWhereUniqueInput | AlertRuleWhereUniqueInput[];
    delete?: AlertRuleWhereUniqueInput | AlertRuleWhereUniqueInput[];
    connect?: AlertRuleWhereUniqueInput | AlertRuleWhereUniqueInput[];
    update?:
      | AlertRuleUpdateWithWhereUniqueWithoutMonitorInput
      | AlertRuleUpdateWithWhereUniqueWithoutMonitorInput[];
    updateMany?:
      | AlertRuleUpdateManyWithWhereWithoutMonitorInput
      | AlertRuleUpdateManyWithWhereWithoutMonitorInput[];
    deleteMany?: AlertRuleScalarWhereInput | AlertRuleScalarWhereInput[];
  };

  export type IncidentUncheckedUpdateManyWithoutMonitorNestedInput = {
    create?:
      | XOR<IncidentCreateWithoutMonitorInput, IncidentUncheckedCreateWithoutMonitorInput>
      | IncidentCreateWithoutMonitorInput[]
      | IncidentUncheckedCreateWithoutMonitorInput[];
    connectOrCreate?:
      | IncidentCreateOrConnectWithoutMonitorInput
      | IncidentCreateOrConnectWithoutMonitorInput[];
    upsert?:
      | IncidentUpsertWithWhereUniqueWithoutMonitorInput
      | IncidentUpsertWithWhereUniqueWithoutMonitorInput[];
    createMany?: IncidentCreateManyMonitorInputEnvelope;
    set?: IncidentWhereUniqueInput | IncidentWhereUniqueInput[];
    disconnect?: IncidentWhereUniqueInput | IncidentWhereUniqueInput[];
    delete?: IncidentWhereUniqueInput | IncidentWhereUniqueInput[];
    connect?: IncidentWhereUniqueInput | IncidentWhereUniqueInput[];
    update?:
      | IncidentUpdateWithWhereUniqueWithoutMonitorInput
      | IncidentUpdateWithWhereUniqueWithoutMonitorInput[];
    updateMany?:
      | IncidentUpdateManyWithWhereWithoutMonitorInput
      | IncidentUpdateManyWithWhereWithoutMonitorInput[];
    deleteMany?: IncidentScalarWhereInput | IncidentScalarWhereInput[];
  };

  export type RegionalIncidentUncheckedUpdateManyWithoutMonitorNestedInput = {
    create?:
      | XOR<
          RegionalIncidentCreateWithoutMonitorInput,
          RegionalIncidentUncheckedCreateWithoutMonitorInput
        >
      | RegionalIncidentCreateWithoutMonitorInput[]
      | RegionalIncidentUncheckedCreateWithoutMonitorInput[];
    connectOrCreate?:
      | RegionalIncidentCreateOrConnectWithoutMonitorInput
      | RegionalIncidentCreateOrConnectWithoutMonitorInput[];
    upsert?:
      | RegionalIncidentUpsertWithWhereUniqueWithoutMonitorInput
      | RegionalIncidentUpsertWithWhereUniqueWithoutMonitorInput[];
    createMany?: RegionalIncidentCreateManyMonitorInputEnvelope;
    set?: RegionalIncidentWhereUniqueInput | RegionalIncidentWhereUniqueInput[];
    disconnect?: RegionalIncidentWhereUniqueInput | RegionalIncidentWhereUniqueInput[];
    delete?: RegionalIncidentWhereUniqueInput | RegionalIncidentWhereUniqueInput[];
    connect?: RegionalIncidentWhereUniqueInput | RegionalIncidentWhereUniqueInput[];
    update?:
      | RegionalIncidentUpdateWithWhereUniqueWithoutMonitorInput
      | RegionalIncidentUpdateWithWhereUniqueWithoutMonitorInput[];
    updateMany?:
      | RegionalIncidentUpdateManyWithWhereWithoutMonitorInput
      | RegionalIncidentUpdateManyWithWhereWithoutMonitorInput[];
    deleteMany?: RegionalIncidentScalarWhereInput | RegionalIncidentScalarWhereInput[];
  };

  export type MonitorCreateNestedOneWithoutEventsInput = {
    create?: XOR<MonitorCreateWithoutEventsInput, MonitorUncheckedCreateWithoutEventsInput>;
    connectOrCreate?: MonitorCreateOrConnectWithoutEventsInput;
    connect?: MonitorWhereUniqueInput;
  };

  export type MonitorUpdateOneRequiredWithoutEventsNestedInput = {
    create?: XOR<MonitorCreateWithoutEventsInput, MonitorUncheckedCreateWithoutEventsInput>;
    connectOrCreate?: MonitorCreateOrConnectWithoutEventsInput;
    upsert?: MonitorUpsertWithoutEventsInput;
    connect?: MonitorWhereUniqueInput;
    update?: XOR<
      XOR<MonitorUpdateToOneWithWhereWithoutEventsInput, MonitorUpdateWithoutEventsInput>,
      MonitorUncheckedUpdateWithoutEventsInput
    >;
  };

  export type MonitorCreateNestedOneWithoutMaintenanceWindowsInput = {
    create?: XOR<
      MonitorCreateWithoutMaintenanceWindowsInput,
      MonitorUncheckedCreateWithoutMaintenanceWindowsInput
    >;
    connectOrCreate?: MonitorCreateOrConnectWithoutMaintenanceWindowsInput;
    connect?: MonitorWhereUniqueInput;
  };

  export type MonitorUpdateOneRequiredWithoutMaintenanceWindowsNestedInput = {
    create?: XOR<
      MonitorCreateWithoutMaintenanceWindowsInput,
      MonitorUncheckedCreateWithoutMaintenanceWindowsInput
    >;
    connectOrCreate?: MonitorCreateOrConnectWithoutMaintenanceWindowsInput;
    upsert?: MonitorUpsertWithoutMaintenanceWindowsInput;
    connect?: MonitorWhereUniqueInput;
    update?: XOR<
      XOR<
        MonitorUpdateToOneWithWhereWithoutMaintenanceWindowsInput,
        MonitorUpdateWithoutMaintenanceWindowsInput
      >,
      MonitorUncheckedUpdateWithoutMaintenanceWindowsInput
    >;
  };

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>;
    in?: string[] | ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    not?: NestedStringFilter<$PrismaModel> | string;
  };

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>;
    not?: NestedBoolFilter<$PrismaModel> | boolean;
  };

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    not?: NestedStringNullableFilter<$PrismaModel> | string | null;
  };

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string;
  };

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>;
    in?: string[] | ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedStringFilter<$PrismaModel>;
    _max?: NestedStringFilter<$PrismaModel>;
  };

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>;
    in?: number[] | ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntFilter<$PrismaModel> | number;
  };

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>;
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedBoolFilter<$PrismaModel>;
    _max?: NestedBoolFilter<$PrismaModel>;
  };

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedStringNullableFilter<$PrismaModel>;
    _max?: NestedStringNullableFilter<$PrismaModel>;
  };

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntNullableFilter<$PrismaModel> | number | null;
  };

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedDateTimeFilter<$PrismaModel>;
    _max?: NestedDateTimeFilter<$PrismaModel>;
  };

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null;
  };

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedDateTimeNullableFilter<$PrismaModel>;
    _max?: NestedDateTimeNullableFilter<$PrismaModel>;
  };

  export type NestedEnumIncidentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.IncidentStatus | EnumIncidentStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.IncidentStatus[] | ListEnumIncidentStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.IncidentStatus[] | ListEnumIncidentStatusFieldRefInput<$PrismaModel>;
    not?: NestedEnumIncidentStatusFilter<$PrismaModel> | $Enums.IncidentStatus;
  };

  export type NestedEnumSeverityFilter<$PrismaModel = never> = {
    equals?: $Enums.Severity | EnumSeverityFieldRefInput<$PrismaModel>;
    in?: $Enums.Severity[] | ListEnumSeverityFieldRefInput<$PrismaModel>;
    notIn?: $Enums.Severity[] | ListEnumSeverityFieldRefInput<$PrismaModel>;
    not?: NestedEnumSeverityFilter<$PrismaModel> | $Enums.Severity;
  };

  export type NestedEnumIncidentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.IncidentStatus | EnumIncidentStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.IncidentStatus[] | ListEnumIncidentStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.IncidentStatus[] | ListEnumIncidentStatusFieldRefInput<$PrismaModel>;
    not?: NestedEnumIncidentStatusWithAggregatesFilter<$PrismaModel> | $Enums.IncidentStatus;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedEnumIncidentStatusFilter<$PrismaModel>;
    _max?: NestedEnumIncidentStatusFilter<$PrismaModel>;
  };

  export type NestedEnumSeverityWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Severity | EnumSeverityFieldRefInput<$PrismaModel>;
    in?: $Enums.Severity[] | ListEnumSeverityFieldRefInput<$PrismaModel>;
    notIn?: $Enums.Severity[] | ListEnumSeverityFieldRefInput<$PrismaModel>;
    not?: NestedEnumSeverityWithAggregatesFilter<$PrismaModel> | $Enums.Severity;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedEnumSeverityFilter<$PrismaModel>;
    _max?: NestedEnumSeverityFilter<$PrismaModel>;
  };

  export type NestedEnumIncidentEventTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.IncidentEventType | EnumIncidentEventTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.IncidentEventType[] | ListEnumIncidentEventTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.IncidentEventType[] | ListEnumIncidentEventTypeFieldRefInput<$PrismaModel>;
    not?: NestedEnumIncidentEventTypeFilter<$PrismaModel> | $Enums.IncidentEventType;
  };

  export type NestedEnumIncidentEventTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.IncidentEventType | EnumIncidentEventTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.IncidentEventType[] | ListEnumIncidentEventTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.IncidentEventType[] | ListEnumIncidentEventTypeFieldRefInput<$PrismaModel>;
    not?: NestedEnumIncidentEventTypeWithAggregatesFilter<$PrismaModel> | $Enums.IncidentEventType;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedEnumIncidentEventTypeFilter<$PrismaModel>;
    _max?: NestedEnumIncidentEventTypeFilter<$PrismaModel>;
  };

  export type NestedEnumNotificationTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationType | EnumNotificationTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.NotificationType[] | ListEnumNotificationTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.NotificationType[] | ListEnumNotificationTypeFieldRefInput<$PrismaModel>;
    not?: NestedEnumNotificationTypeFilter<$PrismaModel> | $Enums.NotificationType;
  };

  export type NestedEnumNotificationTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationType | EnumNotificationTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.NotificationType[] | ListEnumNotificationTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.NotificationType[] | ListEnumNotificationTypeFieldRefInput<$PrismaModel>;
    not?: NestedEnumNotificationTypeWithAggregatesFilter<$PrismaModel> | $Enums.NotificationType;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedEnumNotificationTypeFilter<$PrismaModel>;
    _max?: NestedEnumNotificationTypeFilter<$PrismaModel>;
  };
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<
          Required<NestedJsonFilterBase<$PrismaModel>>,
          Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, "path">
        >,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, "path">>;

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter;
    path?: string[];
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>;
    string_contains?: string | StringFieldRefInput<$PrismaModel>;
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>;
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>;
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter;
  };

  export type NestedEnumAlertTriggerFilter<$PrismaModel = never> = {
    equals?: $Enums.AlertTrigger | EnumAlertTriggerFieldRefInput<$PrismaModel>;
    in?: $Enums.AlertTrigger[] | ListEnumAlertTriggerFieldRefInput<$PrismaModel>;
    notIn?: $Enums.AlertTrigger[] | ListEnumAlertTriggerFieldRefInput<$PrismaModel>;
    not?: NestedEnumAlertTriggerFilter<$PrismaModel> | $Enums.AlertTrigger;
  };

  export type NestedEnumComparisonOperatorNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.ComparisonOperator | EnumComparisonOperatorFieldRefInput<$PrismaModel> | null;
    in?: $Enums.ComparisonOperator[] | ListEnumComparisonOperatorFieldRefInput<$PrismaModel> | null;
    notIn?:
      | $Enums.ComparisonOperator[]
      | ListEnumComparisonOperatorFieldRefInput<$PrismaModel>
      | null;
    not?:
      | NestedEnumComparisonOperatorNullableFilter<$PrismaModel>
      | $Enums.ComparisonOperator
      | null;
  };

  export type NestedEnumMonitorStatusNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.MonitorStatus | EnumMonitorStatusFieldRefInput<$PrismaModel> | null;
    in?: $Enums.MonitorStatus[] | ListEnumMonitorStatusFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.MonitorStatus[] | ListEnumMonitorStatusFieldRefInput<$PrismaModel> | null;
    not?: NestedEnumMonitorStatusNullableFilter<$PrismaModel> | $Enums.MonitorStatus | null;
  };

  export type NestedEnumAlertTriggerWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AlertTrigger | EnumAlertTriggerFieldRefInput<$PrismaModel>;
    in?: $Enums.AlertTrigger[] | ListEnumAlertTriggerFieldRefInput<$PrismaModel>;
    notIn?: $Enums.AlertTrigger[] | ListEnumAlertTriggerFieldRefInput<$PrismaModel>;
    not?: NestedEnumAlertTriggerWithAggregatesFilter<$PrismaModel> | $Enums.AlertTrigger;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedEnumAlertTriggerFilter<$PrismaModel>;
    _max?: NestedEnumAlertTriggerFilter<$PrismaModel>;
  };

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _avg?: NestedFloatNullableFilter<$PrismaModel>;
    _sum?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedIntNullableFilter<$PrismaModel>;
    _max?: NestedIntNullableFilter<$PrismaModel>;
  };

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null;
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null;
    lt?: number | FloatFieldRefInput<$PrismaModel>;
    lte?: number | FloatFieldRefInput<$PrismaModel>;
    gt?: number | FloatFieldRefInput<$PrismaModel>;
    gte?: number | FloatFieldRefInput<$PrismaModel>;
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null;
  };

  export type NestedEnumComparisonOperatorNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ComparisonOperator | EnumComparisonOperatorFieldRefInput<$PrismaModel> | null;
    in?: $Enums.ComparisonOperator[] | ListEnumComparisonOperatorFieldRefInput<$PrismaModel> | null;
    notIn?:
      | $Enums.ComparisonOperator[]
      | ListEnumComparisonOperatorFieldRefInput<$PrismaModel>
      | null;
    not?:
      | NestedEnumComparisonOperatorNullableWithAggregatesFilter<$PrismaModel>
      | $Enums.ComparisonOperator
      | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedEnumComparisonOperatorNullableFilter<$PrismaModel>;
    _max?: NestedEnumComparisonOperatorNullableFilter<$PrismaModel>;
  };

  export type NestedEnumMonitorStatusNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MonitorStatus | EnumMonitorStatusFieldRefInput<$PrismaModel> | null;
    in?: $Enums.MonitorStatus[] | ListEnumMonitorStatusFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.MonitorStatus[] | ListEnumMonitorStatusFieldRefInput<$PrismaModel> | null;
    not?:
      | NestedEnumMonitorStatusNullableWithAggregatesFilter<$PrismaModel>
      | $Enums.MonitorStatus
      | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedEnumMonitorStatusNullableFilter<$PrismaModel>;
    _max?: NestedEnumMonitorStatusNullableFilter<$PrismaModel>;
  };

  export type NestedEnumMonitorTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.MonitorType | EnumMonitorTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.MonitorType[] | ListEnumMonitorTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.MonitorType[] | ListEnumMonitorTypeFieldRefInput<$PrismaModel>;
    not?: NestedEnumMonitorTypeFilter<$PrismaModel> | $Enums.MonitorType;
  };

  export type NestedEnumMonitorStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.MonitorStatus | EnumMonitorStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.MonitorStatus[] | ListEnumMonitorStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.MonitorStatus[] | ListEnumMonitorStatusFieldRefInput<$PrismaModel>;
    not?: NestedEnumMonitorStatusFilter<$PrismaModel> | $Enums.MonitorStatus;
  };

  export type NestedEnumMonitorTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MonitorType | EnumMonitorTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.MonitorType[] | ListEnumMonitorTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.MonitorType[] | ListEnumMonitorTypeFieldRefInput<$PrismaModel>;
    not?: NestedEnumMonitorTypeWithAggregatesFilter<$PrismaModel> | $Enums.MonitorType;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedEnumMonitorTypeFilter<$PrismaModel>;
    _max?: NestedEnumMonitorTypeFilter<$PrismaModel>;
  };

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>;
    in?: number[] | ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number;
    _count?: NestedIntFilter<$PrismaModel>;
    _avg?: NestedFloatFilter<$PrismaModel>;
    _sum?: NestedIntFilter<$PrismaModel>;
    _min?: NestedIntFilter<$PrismaModel>;
    _max?: NestedIntFilter<$PrismaModel>;
  };

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>;
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>;
    lt?: number | FloatFieldRefInput<$PrismaModel>;
    lte?: number | FloatFieldRefInput<$PrismaModel>;
    gt?: number | FloatFieldRefInput<$PrismaModel>;
    gte?: number | FloatFieldRefInput<$PrismaModel>;
    not?: NestedFloatFilter<$PrismaModel> | number;
  };

  export type NestedEnumMonitorStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MonitorStatus | EnumMonitorStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.MonitorStatus[] | ListEnumMonitorStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.MonitorStatus[] | ListEnumMonitorStatusFieldRefInput<$PrismaModel>;
    not?: NestedEnumMonitorStatusWithAggregatesFilter<$PrismaModel> | $Enums.MonitorStatus;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedEnumMonitorStatusFilter<$PrismaModel>;
    _max?: NestedEnumMonitorStatusFilter<$PrismaModel>;
  };

  export type SessionCreateWithoutUserInput = {
    id: string;
    expiresAt: Date | string;
    token: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    ipAddress?: string | null;
    userAgent?: string | null;
  };

  export type SessionUncheckedCreateWithoutUserInput = {
    id: string;
    expiresAt: Date | string;
    token: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    ipAddress?: string | null;
    userAgent?: string | null;
  };

  export type SessionCreateOrConnectWithoutUserInput = {
    where: SessionWhereUniqueInput;
    create: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>;
  };

  export type SessionCreateManyUserInputEnvelope = {
    data: SessionCreateManyUserInput | SessionCreateManyUserInput[];
    skipDuplicates?: boolean;
  };

  export type AccountCreateWithoutUserInput = {
    id: string;
    accountId: string;
    providerId: string;
    accessToken?: string | null;
    refreshToken?: string | null;
    idToken?: string | null;
    accessTokenExpiresAt?: Date | string | null;
    refreshTokenExpiresAt?: Date | string | null;
    scope?: string | null;
    password?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type AccountUncheckedCreateWithoutUserInput = {
    id: string;
    accountId: string;
    providerId: string;
    accessToken?: string | null;
    refreshToken?: string | null;
    idToken?: string | null;
    accessTokenExpiresAt?: Date | string | null;
    refreshTokenExpiresAt?: Date | string | null;
    scope?: string | null;
    password?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type AccountCreateOrConnectWithoutUserInput = {
    where: AccountWhereUniqueInput;
    create: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput>;
  };

  export type AccountCreateManyUserInputEnvelope = {
    data: AccountCreateManyUserInput | AccountCreateManyUserInput[];
    skipDuplicates?: boolean;
  };

  export type MonitorCreateWithoutUserInput = {
    id?: string;
    name: string;
    url: string;
    type?: $Enums.MonitorType;
    interval?: number;
    timeout?: number;
    status?: $Enums.MonitorStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    nextCheck?: Date | string | null;
    lastCheck?: Date | string | null;
    checkRegions?: string | null;
    alertThreshold?: number;
    events?: MonitorEventCreateNestedManyWithoutMonitorInput;
    maintenanceWindows?: MaintenanceWindowCreateNestedManyWithoutMonitorInput;
    alertRules?: AlertRuleCreateNestedManyWithoutMonitorInput;
    incidents?: IncidentCreateNestedManyWithoutMonitorInput;
    regionalIncidents?: RegionalIncidentCreateNestedManyWithoutMonitorInput;
  };

  export type MonitorUncheckedCreateWithoutUserInput = {
    id?: string;
    name: string;
    url: string;
    type?: $Enums.MonitorType;
    interval?: number;
    timeout?: number;
    status?: $Enums.MonitorStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    nextCheck?: Date | string | null;
    lastCheck?: Date | string | null;
    checkRegions?: string | null;
    alertThreshold?: number;
    events?: MonitorEventUncheckedCreateNestedManyWithoutMonitorInput;
    maintenanceWindows?: MaintenanceWindowUncheckedCreateNestedManyWithoutMonitorInput;
    alertRules?: AlertRuleUncheckedCreateNestedManyWithoutMonitorInput;
    incidents?: IncidentUncheckedCreateNestedManyWithoutMonitorInput;
    regionalIncidents?: RegionalIncidentUncheckedCreateNestedManyWithoutMonitorInput;
  };

  export type MonitorCreateOrConnectWithoutUserInput = {
    where: MonitorWhereUniqueInput;
    create: XOR<MonitorCreateWithoutUserInput, MonitorUncheckedCreateWithoutUserInput>;
  };

  export type MonitorCreateManyUserInputEnvelope = {
    data: MonitorCreateManyUserInput | MonitorCreateManyUserInput[];
    skipDuplicates?: boolean;
  };

  export type NotificationChannelCreateWithoutUserInput = {
    id?: string;
    name: string;
    type: $Enums.NotificationType;
    config: JsonNullValueInput | InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    alertRules?: AlertRuleCreateNestedManyWithoutChannelsInput;
  };

  export type NotificationChannelUncheckedCreateWithoutUserInput = {
    id?: string;
    name: string;
    type: $Enums.NotificationType;
    config: JsonNullValueInput | InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    alertRules?: AlertRuleUncheckedCreateNestedManyWithoutChannelsInput;
  };

  export type NotificationChannelCreateOrConnectWithoutUserInput = {
    where: NotificationChannelWhereUniqueInput;
    create: XOR<
      NotificationChannelCreateWithoutUserInput,
      NotificationChannelUncheckedCreateWithoutUserInput
    >;
  };

  export type NotificationChannelCreateManyUserInputEnvelope = {
    data: NotificationChannelCreateManyUserInput | NotificationChannelCreateManyUserInput[];
    skipDuplicates?: boolean;
  };

  export type SessionUpsertWithWhereUniqueWithoutUserInput = {
    where: SessionWhereUniqueInput;
    update: XOR<SessionUpdateWithoutUserInput, SessionUncheckedUpdateWithoutUserInput>;
    create: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>;
  };

  export type SessionUpdateWithWhereUniqueWithoutUserInput = {
    where: SessionWhereUniqueInput;
    data: XOR<SessionUpdateWithoutUserInput, SessionUncheckedUpdateWithoutUserInput>;
  };

  export type SessionUpdateManyWithWhereWithoutUserInput = {
    where: SessionScalarWhereInput;
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyWithoutUserInput>;
  };

  export type SessionScalarWhereInput = {
    AND?: SessionScalarWhereInput | SessionScalarWhereInput[];
    OR?: SessionScalarWhereInput[];
    NOT?: SessionScalarWhereInput | SessionScalarWhereInput[];
    id?: StringFilter<"Session"> | string;
    expiresAt?: DateTimeFilter<"Session"> | Date | string;
    token?: StringFilter<"Session"> | string;
    createdAt?: DateTimeFilter<"Session"> | Date | string;
    updatedAt?: DateTimeFilter<"Session"> | Date | string;
    ipAddress?: StringNullableFilter<"Session"> | string | null;
    userAgent?: StringNullableFilter<"Session"> | string | null;
    userId?: StringFilter<"Session"> | string;
  };

  export type AccountUpsertWithWhereUniqueWithoutUserInput = {
    where: AccountWhereUniqueInput;
    update: XOR<AccountUpdateWithoutUserInput, AccountUncheckedUpdateWithoutUserInput>;
    create: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput>;
  };

  export type AccountUpdateWithWhereUniqueWithoutUserInput = {
    where: AccountWhereUniqueInput;
    data: XOR<AccountUpdateWithoutUserInput, AccountUncheckedUpdateWithoutUserInput>;
  };

  export type AccountUpdateManyWithWhereWithoutUserInput = {
    where: AccountScalarWhereInput;
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyWithoutUserInput>;
  };

  export type AccountScalarWhereInput = {
    AND?: AccountScalarWhereInput | AccountScalarWhereInput[];
    OR?: AccountScalarWhereInput[];
    NOT?: AccountScalarWhereInput | AccountScalarWhereInput[];
    id?: StringFilter<"Account"> | string;
    accountId?: StringFilter<"Account"> | string;
    providerId?: StringFilter<"Account"> | string;
    userId?: StringFilter<"Account"> | string;
    accessToken?: StringNullableFilter<"Account"> | string | null;
    refreshToken?: StringNullableFilter<"Account"> | string | null;
    idToken?: StringNullableFilter<"Account"> | string | null;
    accessTokenExpiresAt?: DateTimeNullableFilter<"Account"> | Date | string | null;
    refreshTokenExpiresAt?: DateTimeNullableFilter<"Account"> | Date | string | null;
    scope?: StringNullableFilter<"Account"> | string | null;
    password?: StringNullableFilter<"Account"> | string | null;
    createdAt?: DateTimeFilter<"Account"> | Date | string;
    updatedAt?: DateTimeFilter<"Account"> | Date | string;
  };

  export type MonitorUpsertWithWhereUniqueWithoutUserInput = {
    where: MonitorWhereUniqueInput;
    update: XOR<MonitorUpdateWithoutUserInput, MonitorUncheckedUpdateWithoutUserInput>;
    create: XOR<MonitorCreateWithoutUserInput, MonitorUncheckedCreateWithoutUserInput>;
  };

  export type MonitorUpdateWithWhereUniqueWithoutUserInput = {
    where: MonitorWhereUniqueInput;
    data: XOR<MonitorUpdateWithoutUserInput, MonitorUncheckedUpdateWithoutUserInput>;
  };

  export type MonitorUpdateManyWithWhereWithoutUserInput = {
    where: MonitorScalarWhereInput;
    data: XOR<MonitorUpdateManyMutationInput, MonitorUncheckedUpdateManyWithoutUserInput>;
  };

  export type MonitorScalarWhereInput = {
    AND?: MonitorScalarWhereInput | MonitorScalarWhereInput[];
    OR?: MonitorScalarWhereInput[];
    NOT?: MonitorScalarWhereInput | MonitorScalarWhereInput[];
    id?: StringFilter<"Monitor"> | string;
    name?: StringFilter<"Monitor"> | string;
    url?: StringFilter<"Monitor"> | string;
    type?: EnumMonitorTypeFilter<"Monitor"> | $Enums.MonitorType;
    interval?: IntFilter<"Monitor"> | number;
    timeout?: IntFilter<"Monitor"> | number;
    status?: EnumMonitorStatusFilter<"Monitor"> | $Enums.MonitorStatus;
    userId?: StringFilter<"Monitor"> | string;
    createdAt?: DateTimeFilter<"Monitor"> | Date | string;
    updatedAt?: DateTimeFilter<"Monitor"> | Date | string;
    nextCheck?: DateTimeNullableFilter<"Monitor"> | Date | string | null;
    lastCheck?: DateTimeNullableFilter<"Monitor"> | Date | string | null;
    checkRegions?: StringNullableFilter<"Monitor"> | string | null;
    alertThreshold?: IntFilter<"Monitor"> | number;
  };

  export type NotificationChannelUpsertWithWhereUniqueWithoutUserInput = {
    where: NotificationChannelWhereUniqueInput;
    update: XOR<
      NotificationChannelUpdateWithoutUserInput,
      NotificationChannelUncheckedUpdateWithoutUserInput
    >;
    create: XOR<
      NotificationChannelCreateWithoutUserInput,
      NotificationChannelUncheckedCreateWithoutUserInput
    >;
  };

  export type NotificationChannelUpdateWithWhereUniqueWithoutUserInput = {
    where: NotificationChannelWhereUniqueInput;
    data: XOR<
      NotificationChannelUpdateWithoutUserInput,
      NotificationChannelUncheckedUpdateWithoutUserInput
    >;
  };

  export type NotificationChannelUpdateManyWithWhereWithoutUserInput = {
    where: NotificationChannelScalarWhereInput;
    data: XOR<
      NotificationChannelUpdateManyMutationInput,
      NotificationChannelUncheckedUpdateManyWithoutUserInput
    >;
  };

  export type NotificationChannelScalarWhereInput = {
    AND?: NotificationChannelScalarWhereInput | NotificationChannelScalarWhereInput[];
    OR?: NotificationChannelScalarWhereInput[];
    NOT?: NotificationChannelScalarWhereInput | NotificationChannelScalarWhereInput[];
    id?: StringFilter<"NotificationChannel"> | string;
    name?: StringFilter<"NotificationChannel"> | string;
    type?: EnumNotificationTypeFilter<"NotificationChannel"> | $Enums.NotificationType;
    config?: JsonFilter<"NotificationChannel">;
    userId?: StringFilter<"NotificationChannel"> | string;
    createdAt?: DateTimeFilter<"NotificationChannel"> | Date | string;
    updatedAt?: DateTimeFilter<"NotificationChannel"> | Date | string;
  };

  export type UserCreateWithoutSessionsInput = {
    id: string;
    name: string;
    email: string;
    emailVerified?: boolean;
    image?: string | null;
    timezone?: string | null;
    dateFormat?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    accounts?: AccountCreateNestedManyWithoutUserInput;
    monitors?: MonitorCreateNestedManyWithoutUserInput;
    notificationChannels?: NotificationChannelCreateNestedManyWithoutUserInput;
  };

  export type UserUncheckedCreateWithoutSessionsInput = {
    id: string;
    name: string;
    email: string;
    emailVerified?: boolean;
    image?: string | null;
    timezone?: string | null;
    dateFormat?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput;
    monitors?: MonitorUncheckedCreateNestedManyWithoutUserInput;
    notificationChannels?: NotificationChannelUncheckedCreateNestedManyWithoutUserInput;
  };

  export type UserCreateOrConnectWithoutSessionsInput = {
    where: UserWhereUniqueInput;
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>;
  };

  export type UserUpsertWithoutSessionsInput = {
    update: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>;
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>;
    where?: UserWhereInput;
  };

  export type UserUpdateToOneWithWhereWithoutSessionsInput = {
    where?: UserWhereInput;
    data: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>;
  };

  export type UserUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    emailVerified?: BoolFieldUpdateOperationsInput | boolean;
    image?: NullableStringFieldUpdateOperationsInput | string | null;
    timezone?: NullableStringFieldUpdateOperationsInput | string | null;
    dateFormat?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    accounts?: AccountUpdateManyWithoutUserNestedInput;
    monitors?: MonitorUpdateManyWithoutUserNestedInput;
    notificationChannels?: NotificationChannelUpdateManyWithoutUserNestedInput;
  };

  export type UserUncheckedUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    emailVerified?: BoolFieldUpdateOperationsInput | boolean;
    image?: NullableStringFieldUpdateOperationsInput | string | null;
    timezone?: NullableStringFieldUpdateOperationsInput | string | null;
    dateFormat?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput;
    monitors?: MonitorUncheckedUpdateManyWithoutUserNestedInput;
    notificationChannels?: NotificationChannelUncheckedUpdateManyWithoutUserNestedInput;
  };

  export type UserCreateWithoutAccountsInput = {
    id: string;
    name: string;
    email: string;
    emailVerified?: boolean;
    image?: string | null;
    timezone?: string | null;
    dateFormat?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    sessions?: SessionCreateNestedManyWithoutUserInput;
    monitors?: MonitorCreateNestedManyWithoutUserInput;
    notificationChannels?: NotificationChannelCreateNestedManyWithoutUserInput;
  };

  export type UserUncheckedCreateWithoutAccountsInput = {
    id: string;
    name: string;
    email: string;
    emailVerified?: boolean;
    image?: string | null;
    timezone?: string | null;
    dateFormat?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput;
    monitors?: MonitorUncheckedCreateNestedManyWithoutUserInput;
    notificationChannels?: NotificationChannelUncheckedCreateNestedManyWithoutUserInput;
  };

  export type UserCreateOrConnectWithoutAccountsInput = {
    where: UserWhereUniqueInput;
    create: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>;
  };

  export type UserUpsertWithoutAccountsInput = {
    update: XOR<UserUpdateWithoutAccountsInput, UserUncheckedUpdateWithoutAccountsInput>;
    create: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>;
    where?: UserWhereInput;
  };

  export type UserUpdateToOneWithWhereWithoutAccountsInput = {
    where?: UserWhereInput;
    data: XOR<UserUpdateWithoutAccountsInput, UserUncheckedUpdateWithoutAccountsInput>;
  };

  export type UserUpdateWithoutAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    emailVerified?: BoolFieldUpdateOperationsInput | boolean;
    image?: NullableStringFieldUpdateOperationsInput | string | null;
    timezone?: NullableStringFieldUpdateOperationsInput | string | null;
    dateFormat?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    sessions?: SessionUpdateManyWithoutUserNestedInput;
    monitors?: MonitorUpdateManyWithoutUserNestedInput;
    notificationChannels?: NotificationChannelUpdateManyWithoutUserNestedInput;
  };

  export type UserUncheckedUpdateWithoutAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    emailVerified?: BoolFieldUpdateOperationsInput | boolean;
    image?: NullableStringFieldUpdateOperationsInput | string | null;
    timezone?: NullableStringFieldUpdateOperationsInput | string | null;
    dateFormat?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput;
    monitors?: MonitorUncheckedUpdateManyWithoutUserNestedInput;
    notificationChannels?: NotificationChannelUncheckedUpdateManyWithoutUserNestedInput;
  };

  export type MonitorCreateWithoutIncidentsInput = {
    id?: string;
    name: string;
    url: string;
    type?: $Enums.MonitorType;
    interval?: number;
    timeout?: number;
    status?: $Enums.MonitorStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    nextCheck?: Date | string | null;
    lastCheck?: Date | string | null;
    checkRegions?: string | null;
    alertThreshold?: number;
    user: UserCreateNestedOneWithoutMonitorsInput;
    events?: MonitorEventCreateNestedManyWithoutMonitorInput;
    maintenanceWindows?: MaintenanceWindowCreateNestedManyWithoutMonitorInput;
    alertRules?: AlertRuleCreateNestedManyWithoutMonitorInput;
    regionalIncidents?: RegionalIncidentCreateNestedManyWithoutMonitorInput;
  };

  export type MonitorUncheckedCreateWithoutIncidentsInput = {
    id?: string;
    name: string;
    url: string;
    type?: $Enums.MonitorType;
    interval?: number;
    timeout?: number;
    status?: $Enums.MonitorStatus;
    userId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    nextCheck?: Date | string | null;
    lastCheck?: Date | string | null;
    checkRegions?: string | null;
    alertThreshold?: number;
    events?: MonitorEventUncheckedCreateNestedManyWithoutMonitorInput;
    maintenanceWindows?: MaintenanceWindowUncheckedCreateNestedManyWithoutMonitorInput;
    alertRules?: AlertRuleUncheckedCreateNestedManyWithoutMonitorInput;
    regionalIncidents?: RegionalIncidentUncheckedCreateNestedManyWithoutMonitorInput;
  };

  export type MonitorCreateOrConnectWithoutIncidentsInput = {
    where: MonitorWhereUniqueInput;
    create: XOR<MonitorCreateWithoutIncidentsInput, MonitorUncheckedCreateWithoutIncidentsInput>;
  };

  export type IncidentEventCreateWithoutIncidentInput = {
    id?: string;
    type: $Enums.IncidentEventType;
    message: string;
    createdAt?: Date | string;
  };

  export type IncidentEventUncheckedCreateWithoutIncidentInput = {
    id?: string;
    type: $Enums.IncidentEventType;
    message: string;
    createdAt?: Date | string;
  };

  export type IncidentEventCreateOrConnectWithoutIncidentInput = {
    where: IncidentEventWhereUniqueInput;
    create: XOR<
      IncidentEventCreateWithoutIncidentInput,
      IncidentEventUncheckedCreateWithoutIncidentInput
    >;
  };

  export type IncidentEventCreateManyIncidentInputEnvelope = {
    data: IncidentEventCreateManyIncidentInput | IncidentEventCreateManyIncidentInput[];
    skipDuplicates?: boolean;
  };

  export type MonitorUpsertWithoutIncidentsInput = {
    update: XOR<MonitorUpdateWithoutIncidentsInput, MonitorUncheckedUpdateWithoutIncidentsInput>;
    create: XOR<MonitorCreateWithoutIncidentsInput, MonitorUncheckedCreateWithoutIncidentsInput>;
    where?: MonitorWhereInput;
  };

  export type MonitorUpdateToOneWithWhereWithoutIncidentsInput = {
    where?: MonitorWhereInput;
    data: XOR<MonitorUpdateWithoutIncidentsInput, MonitorUncheckedUpdateWithoutIncidentsInput>;
  };

  export type MonitorUpdateWithoutIncidentsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    url?: StringFieldUpdateOperationsInput | string;
    type?: EnumMonitorTypeFieldUpdateOperationsInput | $Enums.MonitorType;
    interval?: IntFieldUpdateOperationsInput | number;
    timeout?: IntFieldUpdateOperationsInput | number;
    status?: EnumMonitorStatusFieldUpdateOperationsInput | $Enums.MonitorStatus;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    nextCheck?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lastCheck?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    checkRegions?: NullableStringFieldUpdateOperationsInput | string | null;
    alertThreshold?: IntFieldUpdateOperationsInput | number;
    user?: UserUpdateOneRequiredWithoutMonitorsNestedInput;
    events?: MonitorEventUpdateManyWithoutMonitorNestedInput;
    maintenanceWindows?: MaintenanceWindowUpdateManyWithoutMonitorNestedInput;
    alertRules?: AlertRuleUpdateManyWithoutMonitorNestedInput;
    regionalIncidents?: RegionalIncidentUpdateManyWithoutMonitorNestedInput;
  };

  export type MonitorUncheckedUpdateWithoutIncidentsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    url?: StringFieldUpdateOperationsInput | string;
    type?: EnumMonitorTypeFieldUpdateOperationsInput | $Enums.MonitorType;
    interval?: IntFieldUpdateOperationsInput | number;
    timeout?: IntFieldUpdateOperationsInput | number;
    status?: EnumMonitorStatusFieldUpdateOperationsInput | $Enums.MonitorStatus;
    userId?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    nextCheck?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lastCheck?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    checkRegions?: NullableStringFieldUpdateOperationsInput | string | null;
    alertThreshold?: IntFieldUpdateOperationsInput | number;
    events?: MonitorEventUncheckedUpdateManyWithoutMonitorNestedInput;
    maintenanceWindows?: MaintenanceWindowUncheckedUpdateManyWithoutMonitorNestedInput;
    alertRules?: AlertRuleUncheckedUpdateManyWithoutMonitorNestedInput;
    regionalIncidents?: RegionalIncidentUncheckedUpdateManyWithoutMonitorNestedInput;
  };

  export type IncidentEventUpsertWithWhereUniqueWithoutIncidentInput = {
    where: IncidentEventWhereUniqueInput;
    update: XOR<
      IncidentEventUpdateWithoutIncidentInput,
      IncidentEventUncheckedUpdateWithoutIncidentInput
    >;
    create: XOR<
      IncidentEventCreateWithoutIncidentInput,
      IncidentEventUncheckedCreateWithoutIncidentInput
    >;
  };

  export type IncidentEventUpdateWithWhereUniqueWithoutIncidentInput = {
    where: IncidentEventWhereUniqueInput;
    data: XOR<
      IncidentEventUpdateWithoutIncidentInput,
      IncidentEventUncheckedUpdateWithoutIncidentInput
    >;
  };

  export type IncidentEventUpdateManyWithWhereWithoutIncidentInput = {
    where: IncidentEventScalarWhereInput;
    data: XOR<
      IncidentEventUpdateManyMutationInput,
      IncidentEventUncheckedUpdateManyWithoutIncidentInput
    >;
  };

  export type IncidentEventScalarWhereInput = {
    AND?: IncidentEventScalarWhereInput | IncidentEventScalarWhereInput[];
    OR?: IncidentEventScalarWhereInput[];
    NOT?: IncidentEventScalarWhereInput | IncidentEventScalarWhereInput[];
    id?: StringFilter<"IncidentEvent"> | string;
    incidentId?: StringFilter<"IncidentEvent"> | string;
    type?: EnumIncidentEventTypeFilter<"IncidentEvent"> | $Enums.IncidentEventType;
    message?: StringFilter<"IncidentEvent"> | string;
    createdAt?: DateTimeFilter<"IncidentEvent"> | Date | string;
  };

  export type IncidentCreateWithoutEventsInput = {
    id?: string;
    status?: $Enums.IncidentStatus;
    severity?: $Enums.Severity;
    title: string;
    description?: string | null;
    startedAt?: Date | string;
    resolvedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    monitor: MonitorCreateNestedOneWithoutIncidentsInput;
  };

  export type IncidentUncheckedCreateWithoutEventsInput = {
    id?: string;
    monitorId: string;
    status?: $Enums.IncidentStatus;
    severity?: $Enums.Severity;
    title: string;
    description?: string | null;
    startedAt?: Date | string;
    resolvedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type IncidentCreateOrConnectWithoutEventsInput = {
    where: IncidentWhereUniqueInput;
    create: XOR<IncidentCreateWithoutEventsInput, IncidentUncheckedCreateWithoutEventsInput>;
  };

  export type IncidentUpsertWithoutEventsInput = {
    update: XOR<IncidentUpdateWithoutEventsInput, IncidentUncheckedUpdateWithoutEventsInput>;
    create: XOR<IncidentCreateWithoutEventsInput, IncidentUncheckedCreateWithoutEventsInput>;
    where?: IncidentWhereInput;
  };

  export type IncidentUpdateToOneWithWhereWithoutEventsInput = {
    where?: IncidentWhereInput;
    data: XOR<IncidentUpdateWithoutEventsInput, IncidentUncheckedUpdateWithoutEventsInput>;
  };

  export type IncidentUpdateWithoutEventsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    status?: EnumIncidentStatusFieldUpdateOperationsInput | $Enums.IncidentStatus;
    severity?: EnumSeverityFieldUpdateOperationsInput | $Enums.Severity;
    title?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    monitor?: MonitorUpdateOneRequiredWithoutIncidentsNestedInput;
  };

  export type IncidentUncheckedUpdateWithoutEventsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    monitorId?: StringFieldUpdateOperationsInput | string;
    status?: EnumIncidentStatusFieldUpdateOperationsInput | $Enums.IncidentStatus;
    severity?: EnumSeverityFieldUpdateOperationsInput | $Enums.Severity;
    title?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type MonitorCreateWithoutRegionalIncidentsInput = {
    id?: string;
    name: string;
    url: string;
    type?: $Enums.MonitorType;
    interval?: number;
    timeout?: number;
    status?: $Enums.MonitorStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    nextCheck?: Date | string | null;
    lastCheck?: Date | string | null;
    checkRegions?: string | null;
    alertThreshold?: number;
    user: UserCreateNestedOneWithoutMonitorsInput;
    events?: MonitorEventCreateNestedManyWithoutMonitorInput;
    maintenanceWindows?: MaintenanceWindowCreateNestedManyWithoutMonitorInput;
    alertRules?: AlertRuleCreateNestedManyWithoutMonitorInput;
    incidents?: IncidentCreateNestedManyWithoutMonitorInput;
  };

  export type MonitorUncheckedCreateWithoutRegionalIncidentsInput = {
    id?: string;
    name: string;
    url: string;
    type?: $Enums.MonitorType;
    interval?: number;
    timeout?: number;
    status?: $Enums.MonitorStatus;
    userId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    nextCheck?: Date | string | null;
    lastCheck?: Date | string | null;
    checkRegions?: string | null;
    alertThreshold?: number;
    events?: MonitorEventUncheckedCreateNestedManyWithoutMonitorInput;
    maintenanceWindows?: MaintenanceWindowUncheckedCreateNestedManyWithoutMonitorInput;
    alertRules?: AlertRuleUncheckedCreateNestedManyWithoutMonitorInput;
    incidents?: IncidentUncheckedCreateNestedManyWithoutMonitorInput;
  };

  export type MonitorCreateOrConnectWithoutRegionalIncidentsInput = {
    where: MonitorWhereUniqueInput;
    create: XOR<
      MonitorCreateWithoutRegionalIncidentsInput,
      MonitorUncheckedCreateWithoutRegionalIncidentsInput
    >;
  };

  export type MonitorUpsertWithoutRegionalIncidentsInput = {
    update: XOR<
      MonitorUpdateWithoutRegionalIncidentsInput,
      MonitorUncheckedUpdateWithoutRegionalIncidentsInput
    >;
    create: XOR<
      MonitorCreateWithoutRegionalIncidentsInput,
      MonitorUncheckedCreateWithoutRegionalIncidentsInput
    >;
    where?: MonitorWhereInput;
  };

  export type MonitorUpdateToOneWithWhereWithoutRegionalIncidentsInput = {
    where?: MonitorWhereInput;
    data: XOR<
      MonitorUpdateWithoutRegionalIncidentsInput,
      MonitorUncheckedUpdateWithoutRegionalIncidentsInput
    >;
  };

  export type MonitorUpdateWithoutRegionalIncidentsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    url?: StringFieldUpdateOperationsInput | string;
    type?: EnumMonitorTypeFieldUpdateOperationsInput | $Enums.MonitorType;
    interval?: IntFieldUpdateOperationsInput | number;
    timeout?: IntFieldUpdateOperationsInput | number;
    status?: EnumMonitorStatusFieldUpdateOperationsInput | $Enums.MonitorStatus;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    nextCheck?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lastCheck?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    checkRegions?: NullableStringFieldUpdateOperationsInput | string | null;
    alertThreshold?: IntFieldUpdateOperationsInput | number;
    user?: UserUpdateOneRequiredWithoutMonitorsNestedInput;
    events?: MonitorEventUpdateManyWithoutMonitorNestedInput;
    maintenanceWindows?: MaintenanceWindowUpdateManyWithoutMonitorNestedInput;
    alertRules?: AlertRuleUpdateManyWithoutMonitorNestedInput;
    incidents?: IncidentUpdateManyWithoutMonitorNestedInput;
  };

  export type MonitorUncheckedUpdateWithoutRegionalIncidentsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    url?: StringFieldUpdateOperationsInput | string;
    type?: EnumMonitorTypeFieldUpdateOperationsInput | $Enums.MonitorType;
    interval?: IntFieldUpdateOperationsInput | number;
    timeout?: IntFieldUpdateOperationsInput | number;
    status?: EnumMonitorStatusFieldUpdateOperationsInput | $Enums.MonitorStatus;
    userId?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    nextCheck?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lastCheck?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    checkRegions?: NullableStringFieldUpdateOperationsInput | string | null;
    alertThreshold?: IntFieldUpdateOperationsInput | number;
    events?: MonitorEventUncheckedUpdateManyWithoutMonitorNestedInput;
    maintenanceWindows?: MaintenanceWindowUncheckedUpdateManyWithoutMonitorNestedInput;
    alertRules?: AlertRuleUncheckedUpdateManyWithoutMonitorNestedInput;
    incidents?: IncidentUncheckedUpdateManyWithoutMonitorNestedInput;
  };

  export type UserCreateWithoutNotificationChannelsInput = {
    id: string;
    name: string;
    email: string;
    emailVerified?: boolean;
    image?: string | null;
    timezone?: string | null;
    dateFormat?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    sessions?: SessionCreateNestedManyWithoutUserInput;
    accounts?: AccountCreateNestedManyWithoutUserInput;
    monitors?: MonitorCreateNestedManyWithoutUserInput;
  };

  export type UserUncheckedCreateWithoutNotificationChannelsInput = {
    id: string;
    name: string;
    email: string;
    emailVerified?: boolean;
    image?: string | null;
    timezone?: string | null;
    dateFormat?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput;
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput;
    monitors?: MonitorUncheckedCreateNestedManyWithoutUserInput;
  };

  export type UserCreateOrConnectWithoutNotificationChannelsInput = {
    where: UserWhereUniqueInput;
    create: XOR<
      UserCreateWithoutNotificationChannelsInput,
      UserUncheckedCreateWithoutNotificationChannelsInput
    >;
  };

  export type AlertRuleCreateWithoutChannelsInput = {
    id?: string;
    trigger: $Enums.AlertTrigger;
    threshold?: number | null;
    comparison?: $Enums.ComparisonOperator | null;
    targetStatus?: $Enums.MonitorStatus | null;
    enabled?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    monitor: MonitorCreateNestedOneWithoutAlertRulesInput;
  };

  export type AlertRuleUncheckedCreateWithoutChannelsInput = {
    id?: string;
    monitorId: string;
    trigger: $Enums.AlertTrigger;
    threshold?: number | null;
    comparison?: $Enums.ComparisonOperator | null;
    targetStatus?: $Enums.MonitorStatus | null;
    enabled?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type AlertRuleCreateOrConnectWithoutChannelsInput = {
    where: AlertRuleWhereUniqueInput;
    create: XOR<AlertRuleCreateWithoutChannelsInput, AlertRuleUncheckedCreateWithoutChannelsInput>;
  };

  export type UserUpsertWithoutNotificationChannelsInput = {
    update: XOR<
      UserUpdateWithoutNotificationChannelsInput,
      UserUncheckedUpdateWithoutNotificationChannelsInput
    >;
    create: XOR<
      UserCreateWithoutNotificationChannelsInput,
      UserUncheckedCreateWithoutNotificationChannelsInput
    >;
    where?: UserWhereInput;
  };

  export type UserUpdateToOneWithWhereWithoutNotificationChannelsInput = {
    where?: UserWhereInput;
    data: XOR<
      UserUpdateWithoutNotificationChannelsInput,
      UserUncheckedUpdateWithoutNotificationChannelsInput
    >;
  };

  export type UserUpdateWithoutNotificationChannelsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    emailVerified?: BoolFieldUpdateOperationsInput | boolean;
    image?: NullableStringFieldUpdateOperationsInput | string | null;
    timezone?: NullableStringFieldUpdateOperationsInput | string | null;
    dateFormat?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    sessions?: SessionUpdateManyWithoutUserNestedInput;
    accounts?: AccountUpdateManyWithoutUserNestedInput;
    monitors?: MonitorUpdateManyWithoutUserNestedInput;
  };

  export type UserUncheckedUpdateWithoutNotificationChannelsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    emailVerified?: BoolFieldUpdateOperationsInput | boolean;
    image?: NullableStringFieldUpdateOperationsInput | string | null;
    timezone?: NullableStringFieldUpdateOperationsInput | string | null;
    dateFormat?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput;
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput;
    monitors?: MonitorUncheckedUpdateManyWithoutUserNestedInput;
  };

  export type AlertRuleUpsertWithWhereUniqueWithoutChannelsInput = {
    where: AlertRuleWhereUniqueInput;
    update: XOR<AlertRuleUpdateWithoutChannelsInput, AlertRuleUncheckedUpdateWithoutChannelsInput>;
    create: XOR<AlertRuleCreateWithoutChannelsInput, AlertRuleUncheckedCreateWithoutChannelsInput>;
  };

  export type AlertRuleUpdateWithWhereUniqueWithoutChannelsInput = {
    where: AlertRuleWhereUniqueInput;
    data: XOR<AlertRuleUpdateWithoutChannelsInput, AlertRuleUncheckedUpdateWithoutChannelsInput>;
  };

  export type AlertRuleUpdateManyWithWhereWithoutChannelsInput = {
    where: AlertRuleScalarWhereInput;
    data: XOR<AlertRuleUpdateManyMutationInput, AlertRuleUncheckedUpdateManyWithoutChannelsInput>;
  };

  export type AlertRuleScalarWhereInput = {
    AND?: AlertRuleScalarWhereInput | AlertRuleScalarWhereInput[];
    OR?: AlertRuleScalarWhereInput[];
    NOT?: AlertRuleScalarWhereInput | AlertRuleScalarWhereInput[];
    id?: StringFilter<"AlertRule"> | string;
    monitorId?: StringFilter<"AlertRule"> | string;
    trigger?: EnumAlertTriggerFilter<"AlertRule"> | $Enums.AlertTrigger;
    threshold?: IntNullableFilter<"AlertRule"> | number | null;
    comparison?:
      | EnumComparisonOperatorNullableFilter<"AlertRule">
      | $Enums.ComparisonOperator
      | null;
    targetStatus?: EnumMonitorStatusNullableFilter<"AlertRule"> | $Enums.MonitorStatus | null;
    enabled?: BoolFilter<"AlertRule"> | boolean;
    createdAt?: DateTimeFilter<"AlertRule"> | Date | string;
    updatedAt?: DateTimeFilter<"AlertRule"> | Date | string;
  };

  export type MonitorCreateWithoutAlertRulesInput = {
    id?: string;
    name: string;
    url: string;
    type?: $Enums.MonitorType;
    interval?: number;
    timeout?: number;
    status?: $Enums.MonitorStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    nextCheck?: Date | string | null;
    lastCheck?: Date | string | null;
    checkRegions?: string | null;
    alertThreshold?: number;
    user: UserCreateNestedOneWithoutMonitorsInput;
    events?: MonitorEventCreateNestedManyWithoutMonitorInput;
    maintenanceWindows?: MaintenanceWindowCreateNestedManyWithoutMonitorInput;
    incidents?: IncidentCreateNestedManyWithoutMonitorInput;
    regionalIncidents?: RegionalIncidentCreateNestedManyWithoutMonitorInput;
  };

  export type MonitorUncheckedCreateWithoutAlertRulesInput = {
    id?: string;
    name: string;
    url: string;
    type?: $Enums.MonitorType;
    interval?: number;
    timeout?: number;
    status?: $Enums.MonitorStatus;
    userId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    nextCheck?: Date | string | null;
    lastCheck?: Date | string | null;
    checkRegions?: string | null;
    alertThreshold?: number;
    events?: MonitorEventUncheckedCreateNestedManyWithoutMonitorInput;
    maintenanceWindows?: MaintenanceWindowUncheckedCreateNestedManyWithoutMonitorInput;
    incidents?: IncidentUncheckedCreateNestedManyWithoutMonitorInput;
    regionalIncidents?: RegionalIncidentUncheckedCreateNestedManyWithoutMonitorInput;
  };

  export type MonitorCreateOrConnectWithoutAlertRulesInput = {
    where: MonitorWhereUniqueInput;
    create: XOR<MonitorCreateWithoutAlertRulesInput, MonitorUncheckedCreateWithoutAlertRulesInput>;
  };

  export type NotificationChannelCreateWithoutAlertRulesInput = {
    id?: string;
    name: string;
    type: $Enums.NotificationType;
    config: JsonNullValueInput | InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    user: UserCreateNestedOneWithoutNotificationChannelsInput;
  };

  export type NotificationChannelUncheckedCreateWithoutAlertRulesInput = {
    id?: string;
    name: string;
    type: $Enums.NotificationType;
    config: JsonNullValueInput | InputJsonValue;
    userId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type NotificationChannelCreateOrConnectWithoutAlertRulesInput = {
    where: NotificationChannelWhereUniqueInput;
    create: XOR<
      NotificationChannelCreateWithoutAlertRulesInput,
      NotificationChannelUncheckedCreateWithoutAlertRulesInput
    >;
  };

  export type MonitorUpsertWithoutAlertRulesInput = {
    update: XOR<MonitorUpdateWithoutAlertRulesInput, MonitorUncheckedUpdateWithoutAlertRulesInput>;
    create: XOR<MonitorCreateWithoutAlertRulesInput, MonitorUncheckedCreateWithoutAlertRulesInput>;
    where?: MonitorWhereInput;
  };

  export type MonitorUpdateToOneWithWhereWithoutAlertRulesInput = {
    where?: MonitorWhereInput;
    data: XOR<MonitorUpdateWithoutAlertRulesInput, MonitorUncheckedUpdateWithoutAlertRulesInput>;
  };

  export type MonitorUpdateWithoutAlertRulesInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    url?: StringFieldUpdateOperationsInput | string;
    type?: EnumMonitorTypeFieldUpdateOperationsInput | $Enums.MonitorType;
    interval?: IntFieldUpdateOperationsInput | number;
    timeout?: IntFieldUpdateOperationsInput | number;
    status?: EnumMonitorStatusFieldUpdateOperationsInput | $Enums.MonitorStatus;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    nextCheck?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lastCheck?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    checkRegions?: NullableStringFieldUpdateOperationsInput | string | null;
    alertThreshold?: IntFieldUpdateOperationsInput | number;
    user?: UserUpdateOneRequiredWithoutMonitorsNestedInput;
    events?: MonitorEventUpdateManyWithoutMonitorNestedInput;
    maintenanceWindows?: MaintenanceWindowUpdateManyWithoutMonitorNestedInput;
    incidents?: IncidentUpdateManyWithoutMonitorNestedInput;
    regionalIncidents?: RegionalIncidentUpdateManyWithoutMonitorNestedInput;
  };

  export type MonitorUncheckedUpdateWithoutAlertRulesInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    url?: StringFieldUpdateOperationsInput | string;
    type?: EnumMonitorTypeFieldUpdateOperationsInput | $Enums.MonitorType;
    interval?: IntFieldUpdateOperationsInput | number;
    timeout?: IntFieldUpdateOperationsInput | number;
    status?: EnumMonitorStatusFieldUpdateOperationsInput | $Enums.MonitorStatus;
    userId?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    nextCheck?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lastCheck?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    checkRegions?: NullableStringFieldUpdateOperationsInput | string | null;
    alertThreshold?: IntFieldUpdateOperationsInput | number;
    events?: MonitorEventUncheckedUpdateManyWithoutMonitorNestedInput;
    maintenanceWindows?: MaintenanceWindowUncheckedUpdateManyWithoutMonitorNestedInput;
    incidents?: IncidentUncheckedUpdateManyWithoutMonitorNestedInput;
    regionalIncidents?: RegionalIncidentUncheckedUpdateManyWithoutMonitorNestedInput;
  };

  export type NotificationChannelUpsertWithWhereUniqueWithoutAlertRulesInput = {
    where: NotificationChannelWhereUniqueInput;
    update: XOR<
      NotificationChannelUpdateWithoutAlertRulesInput,
      NotificationChannelUncheckedUpdateWithoutAlertRulesInput
    >;
    create: XOR<
      NotificationChannelCreateWithoutAlertRulesInput,
      NotificationChannelUncheckedCreateWithoutAlertRulesInput
    >;
  };

  export type NotificationChannelUpdateWithWhereUniqueWithoutAlertRulesInput = {
    where: NotificationChannelWhereUniqueInput;
    data: XOR<
      NotificationChannelUpdateWithoutAlertRulesInput,
      NotificationChannelUncheckedUpdateWithoutAlertRulesInput
    >;
  };

  export type NotificationChannelUpdateManyWithWhereWithoutAlertRulesInput = {
    where: NotificationChannelScalarWhereInput;
    data: XOR<
      NotificationChannelUpdateManyMutationInput,
      NotificationChannelUncheckedUpdateManyWithoutAlertRulesInput
    >;
  };

  export type UserCreateWithoutMonitorsInput = {
    id: string;
    name: string;
    email: string;
    emailVerified?: boolean;
    image?: string | null;
    timezone?: string | null;
    dateFormat?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    sessions?: SessionCreateNestedManyWithoutUserInput;
    accounts?: AccountCreateNestedManyWithoutUserInput;
    notificationChannels?: NotificationChannelCreateNestedManyWithoutUserInput;
  };

  export type UserUncheckedCreateWithoutMonitorsInput = {
    id: string;
    name: string;
    email: string;
    emailVerified?: boolean;
    image?: string | null;
    timezone?: string | null;
    dateFormat?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput;
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput;
    notificationChannels?: NotificationChannelUncheckedCreateNestedManyWithoutUserInput;
  };

  export type UserCreateOrConnectWithoutMonitorsInput = {
    where: UserWhereUniqueInput;
    create: XOR<UserCreateWithoutMonitorsInput, UserUncheckedCreateWithoutMonitorsInput>;
  };

  export type MonitorEventCreateWithoutMonitorInput = {
    id?: string;
    status: $Enums.MonitorStatus;
    latency: number;
    errorReason?: string | null;
    timestamp?: Date | string;
    region?: string | null;
  };

  export type MonitorEventUncheckedCreateWithoutMonitorInput = {
    id?: string;
    status: $Enums.MonitorStatus;
    latency: number;
    errorReason?: string | null;
    timestamp?: Date | string;
    region?: string | null;
  };

  export type MonitorEventCreateOrConnectWithoutMonitorInput = {
    where: MonitorEventWhereUniqueInput;
    create: XOR<
      MonitorEventCreateWithoutMonitorInput,
      MonitorEventUncheckedCreateWithoutMonitorInput
    >;
  };

  export type MonitorEventCreateManyMonitorInputEnvelope = {
    data: MonitorEventCreateManyMonitorInput | MonitorEventCreateManyMonitorInput[];
    skipDuplicates?: boolean;
  };

  export type MaintenanceWindowCreateWithoutMonitorInput = {
    id?: string;
    description?: string | null;
    startAt: Date | string;
    endAt: Date | string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type MaintenanceWindowUncheckedCreateWithoutMonitorInput = {
    id?: string;
    description?: string | null;
    startAt: Date | string;
    endAt: Date | string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type MaintenanceWindowCreateOrConnectWithoutMonitorInput = {
    where: MaintenanceWindowWhereUniqueInput;
    create: XOR<
      MaintenanceWindowCreateWithoutMonitorInput,
      MaintenanceWindowUncheckedCreateWithoutMonitorInput
    >;
  };

  export type MaintenanceWindowCreateManyMonitorInputEnvelope = {
    data: MaintenanceWindowCreateManyMonitorInput | MaintenanceWindowCreateManyMonitorInput[];
    skipDuplicates?: boolean;
  };

  export type AlertRuleCreateWithoutMonitorInput = {
    id?: string;
    trigger: $Enums.AlertTrigger;
    threshold?: number | null;
    comparison?: $Enums.ComparisonOperator | null;
    targetStatus?: $Enums.MonitorStatus | null;
    enabled?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    channels?: NotificationChannelCreateNestedManyWithoutAlertRulesInput;
  };

  export type AlertRuleUncheckedCreateWithoutMonitorInput = {
    id?: string;
    trigger: $Enums.AlertTrigger;
    threshold?: number | null;
    comparison?: $Enums.ComparisonOperator | null;
    targetStatus?: $Enums.MonitorStatus | null;
    enabled?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    channels?: NotificationChannelUncheckedCreateNestedManyWithoutAlertRulesInput;
  };

  export type AlertRuleCreateOrConnectWithoutMonitorInput = {
    where: AlertRuleWhereUniqueInput;
    create: XOR<AlertRuleCreateWithoutMonitorInput, AlertRuleUncheckedCreateWithoutMonitorInput>;
  };

  export type AlertRuleCreateManyMonitorInputEnvelope = {
    data: AlertRuleCreateManyMonitorInput | AlertRuleCreateManyMonitorInput[];
    skipDuplicates?: boolean;
  };

  export type IncidentCreateWithoutMonitorInput = {
    id?: string;
    status?: $Enums.IncidentStatus;
    severity?: $Enums.Severity;
    title: string;
    description?: string | null;
    startedAt?: Date | string;
    resolvedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    events?: IncidentEventCreateNestedManyWithoutIncidentInput;
  };

  export type IncidentUncheckedCreateWithoutMonitorInput = {
    id?: string;
    status?: $Enums.IncidentStatus;
    severity?: $Enums.Severity;
    title: string;
    description?: string | null;
    startedAt?: Date | string;
    resolvedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    events?: IncidentEventUncheckedCreateNestedManyWithoutIncidentInput;
  };

  export type IncidentCreateOrConnectWithoutMonitorInput = {
    where: IncidentWhereUniqueInput;
    create: XOR<IncidentCreateWithoutMonitorInput, IncidentUncheckedCreateWithoutMonitorInput>;
  };

  export type IncidentCreateManyMonitorInputEnvelope = {
    data: IncidentCreateManyMonitorInput | IncidentCreateManyMonitorInput[];
    skipDuplicates?: boolean;
  };

  export type RegionalIncidentCreateWithoutMonitorInput = {
    id?: string;
    region: string;
    status?: $Enums.IncidentStatus;
    startedAt?: Date | string;
    resolvedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type RegionalIncidentUncheckedCreateWithoutMonitorInput = {
    id?: string;
    region: string;
    status?: $Enums.IncidentStatus;
    startedAt?: Date | string;
    resolvedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type RegionalIncidentCreateOrConnectWithoutMonitorInput = {
    where: RegionalIncidentWhereUniqueInput;
    create: XOR<
      RegionalIncidentCreateWithoutMonitorInput,
      RegionalIncidentUncheckedCreateWithoutMonitorInput
    >;
  };

  export type RegionalIncidentCreateManyMonitorInputEnvelope = {
    data: RegionalIncidentCreateManyMonitorInput | RegionalIncidentCreateManyMonitorInput[];
    skipDuplicates?: boolean;
  };

  export type UserUpsertWithoutMonitorsInput = {
    update: XOR<UserUpdateWithoutMonitorsInput, UserUncheckedUpdateWithoutMonitorsInput>;
    create: XOR<UserCreateWithoutMonitorsInput, UserUncheckedCreateWithoutMonitorsInput>;
    where?: UserWhereInput;
  };

  export type UserUpdateToOneWithWhereWithoutMonitorsInput = {
    where?: UserWhereInput;
    data: XOR<UserUpdateWithoutMonitorsInput, UserUncheckedUpdateWithoutMonitorsInput>;
  };

  export type UserUpdateWithoutMonitorsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    emailVerified?: BoolFieldUpdateOperationsInput | boolean;
    image?: NullableStringFieldUpdateOperationsInput | string | null;
    timezone?: NullableStringFieldUpdateOperationsInput | string | null;
    dateFormat?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    sessions?: SessionUpdateManyWithoutUserNestedInput;
    accounts?: AccountUpdateManyWithoutUserNestedInput;
    notificationChannels?: NotificationChannelUpdateManyWithoutUserNestedInput;
  };

  export type UserUncheckedUpdateWithoutMonitorsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    emailVerified?: BoolFieldUpdateOperationsInput | boolean;
    image?: NullableStringFieldUpdateOperationsInput | string | null;
    timezone?: NullableStringFieldUpdateOperationsInput | string | null;
    dateFormat?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput;
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput;
    notificationChannels?: NotificationChannelUncheckedUpdateManyWithoutUserNestedInput;
  };

  export type MonitorEventUpsertWithWhereUniqueWithoutMonitorInput = {
    where: MonitorEventWhereUniqueInput;
    update: XOR<
      MonitorEventUpdateWithoutMonitorInput,
      MonitorEventUncheckedUpdateWithoutMonitorInput
    >;
    create: XOR<
      MonitorEventCreateWithoutMonitorInput,
      MonitorEventUncheckedCreateWithoutMonitorInput
    >;
  };

  export type MonitorEventUpdateWithWhereUniqueWithoutMonitorInput = {
    where: MonitorEventWhereUniqueInput;
    data: XOR<
      MonitorEventUpdateWithoutMonitorInput,
      MonitorEventUncheckedUpdateWithoutMonitorInput
    >;
  };

  export type MonitorEventUpdateManyWithWhereWithoutMonitorInput = {
    where: MonitorEventScalarWhereInput;
    data: XOR<
      MonitorEventUpdateManyMutationInput,
      MonitorEventUncheckedUpdateManyWithoutMonitorInput
    >;
  };

  export type MonitorEventScalarWhereInput = {
    AND?: MonitorEventScalarWhereInput | MonitorEventScalarWhereInput[];
    OR?: MonitorEventScalarWhereInput[];
    NOT?: MonitorEventScalarWhereInput | MonitorEventScalarWhereInput[];
    id?: StringFilter<"MonitorEvent"> | string;
    monitorId?: StringFilter<"MonitorEvent"> | string;
    status?: EnumMonitorStatusFilter<"MonitorEvent"> | $Enums.MonitorStatus;
    latency?: IntFilter<"MonitorEvent"> | number;
    errorReason?: StringNullableFilter<"MonitorEvent"> | string | null;
    timestamp?: DateTimeFilter<"MonitorEvent"> | Date | string;
    region?: StringNullableFilter<"MonitorEvent"> | string | null;
  };

  export type MaintenanceWindowUpsertWithWhereUniqueWithoutMonitorInput = {
    where: MaintenanceWindowWhereUniqueInput;
    update: XOR<
      MaintenanceWindowUpdateWithoutMonitorInput,
      MaintenanceWindowUncheckedUpdateWithoutMonitorInput
    >;
    create: XOR<
      MaintenanceWindowCreateWithoutMonitorInput,
      MaintenanceWindowUncheckedCreateWithoutMonitorInput
    >;
  };

  export type MaintenanceWindowUpdateWithWhereUniqueWithoutMonitorInput = {
    where: MaintenanceWindowWhereUniqueInput;
    data: XOR<
      MaintenanceWindowUpdateWithoutMonitorInput,
      MaintenanceWindowUncheckedUpdateWithoutMonitorInput
    >;
  };

  export type MaintenanceWindowUpdateManyWithWhereWithoutMonitorInput = {
    where: MaintenanceWindowScalarWhereInput;
    data: XOR<
      MaintenanceWindowUpdateManyMutationInput,
      MaintenanceWindowUncheckedUpdateManyWithoutMonitorInput
    >;
  };

  export type MaintenanceWindowScalarWhereInput = {
    AND?: MaintenanceWindowScalarWhereInput | MaintenanceWindowScalarWhereInput[];
    OR?: MaintenanceWindowScalarWhereInput[];
    NOT?: MaintenanceWindowScalarWhereInput | MaintenanceWindowScalarWhereInput[];
    id?: StringFilter<"MaintenanceWindow"> | string;
    monitorId?: StringFilter<"MaintenanceWindow"> | string;
    description?: StringNullableFilter<"MaintenanceWindow"> | string | null;
    startAt?: DateTimeFilter<"MaintenanceWindow"> | Date | string;
    endAt?: DateTimeFilter<"MaintenanceWindow"> | Date | string;
    createdAt?: DateTimeFilter<"MaintenanceWindow"> | Date | string;
    updatedAt?: DateTimeFilter<"MaintenanceWindow"> | Date | string;
  };

  export type AlertRuleUpsertWithWhereUniqueWithoutMonitorInput = {
    where: AlertRuleWhereUniqueInput;
    update: XOR<AlertRuleUpdateWithoutMonitorInput, AlertRuleUncheckedUpdateWithoutMonitorInput>;
    create: XOR<AlertRuleCreateWithoutMonitorInput, AlertRuleUncheckedCreateWithoutMonitorInput>;
  };

  export type AlertRuleUpdateWithWhereUniqueWithoutMonitorInput = {
    where: AlertRuleWhereUniqueInput;
    data: XOR<AlertRuleUpdateWithoutMonitorInput, AlertRuleUncheckedUpdateWithoutMonitorInput>;
  };

  export type AlertRuleUpdateManyWithWhereWithoutMonitorInput = {
    where: AlertRuleScalarWhereInput;
    data: XOR<AlertRuleUpdateManyMutationInput, AlertRuleUncheckedUpdateManyWithoutMonitorInput>;
  };

  export type IncidentUpsertWithWhereUniqueWithoutMonitorInput = {
    where: IncidentWhereUniqueInput;
    update: XOR<IncidentUpdateWithoutMonitorInput, IncidentUncheckedUpdateWithoutMonitorInput>;
    create: XOR<IncidentCreateWithoutMonitorInput, IncidentUncheckedCreateWithoutMonitorInput>;
  };

  export type IncidentUpdateWithWhereUniqueWithoutMonitorInput = {
    where: IncidentWhereUniqueInput;
    data: XOR<IncidentUpdateWithoutMonitorInput, IncidentUncheckedUpdateWithoutMonitorInput>;
  };

  export type IncidentUpdateManyWithWhereWithoutMonitorInput = {
    where: IncidentScalarWhereInput;
    data: XOR<IncidentUpdateManyMutationInput, IncidentUncheckedUpdateManyWithoutMonitorInput>;
  };

  export type IncidentScalarWhereInput = {
    AND?: IncidentScalarWhereInput | IncidentScalarWhereInput[];
    OR?: IncidentScalarWhereInput[];
    NOT?: IncidentScalarWhereInput | IncidentScalarWhereInput[];
    id?: StringFilter<"Incident"> | string;
    monitorId?: StringFilter<"Incident"> | string;
    status?: EnumIncidentStatusFilter<"Incident"> | $Enums.IncidentStatus;
    severity?: EnumSeverityFilter<"Incident"> | $Enums.Severity;
    title?: StringFilter<"Incident"> | string;
    description?: StringNullableFilter<"Incident"> | string | null;
    startedAt?: DateTimeFilter<"Incident"> | Date | string;
    resolvedAt?: DateTimeNullableFilter<"Incident"> | Date | string | null;
    createdAt?: DateTimeFilter<"Incident"> | Date | string;
    updatedAt?: DateTimeFilter<"Incident"> | Date | string;
  };

  export type RegionalIncidentUpsertWithWhereUniqueWithoutMonitorInput = {
    where: RegionalIncidentWhereUniqueInput;
    update: XOR<
      RegionalIncidentUpdateWithoutMonitorInput,
      RegionalIncidentUncheckedUpdateWithoutMonitorInput
    >;
    create: XOR<
      RegionalIncidentCreateWithoutMonitorInput,
      RegionalIncidentUncheckedCreateWithoutMonitorInput
    >;
  };

  export type RegionalIncidentUpdateWithWhereUniqueWithoutMonitorInput = {
    where: RegionalIncidentWhereUniqueInput;
    data: XOR<
      RegionalIncidentUpdateWithoutMonitorInput,
      RegionalIncidentUncheckedUpdateWithoutMonitorInput
    >;
  };

  export type RegionalIncidentUpdateManyWithWhereWithoutMonitorInput = {
    where: RegionalIncidentScalarWhereInput;
    data: XOR<
      RegionalIncidentUpdateManyMutationInput,
      RegionalIncidentUncheckedUpdateManyWithoutMonitorInput
    >;
  };

  export type RegionalIncidentScalarWhereInput = {
    AND?: RegionalIncidentScalarWhereInput | RegionalIncidentScalarWhereInput[];
    OR?: RegionalIncidentScalarWhereInput[];
    NOT?: RegionalIncidentScalarWhereInput | RegionalIncidentScalarWhereInput[];
    id?: StringFilter<"RegionalIncident"> | string;
    monitorId?: StringFilter<"RegionalIncident"> | string;
    region?: StringFilter<"RegionalIncident"> | string;
    status?: EnumIncidentStatusFilter<"RegionalIncident"> | $Enums.IncidentStatus;
    startedAt?: DateTimeFilter<"RegionalIncident"> | Date | string;
    resolvedAt?: DateTimeNullableFilter<"RegionalIncident"> | Date | string | null;
    createdAt?: DateTimeFilter<"RegionalIncident"> | Date | string;
    updatedAt?: DateTimeFilter<"RegionalIncident"> | Date | string;
  };

  export type MonitorCreateWithoutEventsInput = {
    id?: string;
    name: string;
    url: string;
    type?: $Enums.MonitorType;
    interval?: number;
    timeout?: number;
    status?: $Enums.MonitorStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    nextCheck?: Date | string | null;
    lastCheck?: Date | string | null;
    checkRegions?: string | null;
    alertThreshold?: number;
    user: UserCreateNestedOneWithoutMonitorsInput;
    maintenanceWindows?: MaintenanceWindowCreateNestedManyWithoutMonitorInput;
    alertRules?: AlertRuleCreateNestedManyWithoutMonitorInput;
    incidents?: IncidentCreateNestedManyWithoutMonitorInput;
    regionalIncidents?: RegionalIncidentCreateNestedManyWithoutMonitorInput;
  };

  export type MonitorUncheckedCreateWithoutEventsInput = {
    id?: string;
    name: string;
    url: string;
    type?: $Enums.MonitorType;
    interval?: number;
    timeout?: number;
    status?: $Enums.MonitorStatus;
    userId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    nextCheck?: Date | string | null;
    lastCheck?: Date | string | null;
    checkRegions?: string | null;
    alertThreshold?: number;
    maintenanceWindows?: MaintenanceWindowUncheckedCreateNestedManyWithoutMonitorInput;
    alertRules?: AlertRuleUncheckedCreateNestedManyWithoutMonitorInput;
    incidents?: IncidentUncheckedCreateNestedManyWithoutMonitorInput;
    regionalIncidents?: RegionalIncidentUncheckedCreateNestedManyWithoutMonitorInput;
  };

  export type MonitorCreateOrConnectWithoutEventsInput = {
    where: MonitorWhereUniqueInput;
    create: XOR<MonitorCreateWithoutEventsInput, MonitorUncheckedCreateWithoutEventsInput>;
  };

  export type MonitorUpsertWithoutEventsInput = {
    update: XOR<MonitorUpdateWithoutEventsInput, MonitorUncheckedUpdateWithoutEventsInput>;
    create: XOR<MonitorCreateWithoutEventsInput, MonitorUncheckedCreateWithoutEventsInput>;
    where?: MonitorWhereInput;
  };

  export type MonitorUpdateToOneWithWhereWithoutEventsInput = {
    where?: MonitorWhereInput;
    data: XOR<MonitorUpdateWithoutEventsInput, MonitorUncheckedUpdateWithoutEventsInput>;
  };

  export type MonitorUpdateWithoutEventsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    url?: StringFieldUpdateOperationsInput | string;
    type?: EnumMonitorTypeFieldUpdateOperationsInput | $Enums.MonitorType;
    interval?: IntFieldUpdateOperationsInput | number;
    timeout?: IntFieldUpdateOperationsInput | number;
    status?: EnumMonitorStatusFieldUpdateOperationsInput | $Enums.MonitorStatus;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    nextCheck?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lastCheck?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    checkRegions?: NullableStringFieldUpdateOperationsInput | string | null;
    alertThreshold?: IntFieldUpdateOperationsInput | number;
    user?: UserUpdateOneRequiredWithoutMonitorsNestedInput;
    maintenanceWindows?: MaintenanceWindowUpdateManyWithoutMonitorNestedInput;
    alertRules?: AlertRuleUpdateManyWithoutMonitorNestedInput;
    incidents?: IncidentUpdateManyWithoutMonitorNestedInput;
    regionalIncidents?: RegionalIncidentUpdateManyWithoutMonitorNestedInput;
  };

  export type MonitorUncheckedUpdateWithoutEventsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    url?: StringFieldUpdateOperationsInput | string;
    type?: EnumMonitorTypeFieldUpdateOperationsInput | $Enums.MonitorType;
    interval?: IntFieldUpdateOperationsInput | number;
    timeout?: IntFieldUpdateOperationsInput | number;
    status?: EnumMonitorStatusFieldUpdateOperationsInput | $Enums.MonitorStatus;
    userId?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    nextCheck?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lastCheck?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    checkRegions?: NullableStringFieldUpdateOperationsInput | string | null;
    alertThreshold?: IntFieldUpdateOperationsInput | number;
    maintenanceWindows?: MaintenanceWindowUncheckedUpdateManyWithoutMonitorNestedInput;
    alertRules?: AlertRuleUncheckedUpdateManyWithoutMonitorNestedInput;
    incidents?: IncidentUncheckedUpdateManyWithoutMonitorNestedInput;
    regionalIncidents?: RegionalIncidentUncheckedUpdateManyWithoutMonitorNestedInput;
  };

  export type MonitorCreateWithoutMaintenanceWindowsInput = {
    id?: string;
    name: string;
    url: string;
    type?: $Enums.MonitorType;
    interval?: number;
    timeout?: number;
    status?: $Enums.MonitorStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    nextCheck?: Date | string | null;
    lastCheck?: Date | string | null;
    checkRegions?: string | null;
    alertThreshold?: number;
    user: UserCreateNestedOneWithoutMonitorsInput;
    events?: MonitorEventCreateNestedManyWithoutMonitorInput;
    alertRules?: AlertRuleCreateNestedManyWithoutMonitorInput;
    incidents?: IncidentCreateNestedManyWithoutMonitorInput;
    regionalIncidents?: RegionalIncidentCreateNestedManyWithoutMonitorInput;
  };

  export type MonitorUncheckedCreateWithoutMaintenanceWindowsInput = {
    id?: string;
    name: string;
    url: string;
    type?: $Enums.MonitorType;
    interval?: number;
    timeout?: number;
    status?: $Enums.MonitorStatus;
    userId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    nextCheck?: Date | string | null;
    lastCheck?: Date | string | null;
    checkRegions?: string | null;
    alertThreshold?: number;
    events?: MonitorEventUncheckedCreateNestedManyWithoutMonitorInput;
    alertRules?: AlertRuleUncheckedCreateNestedManyWithoutMonitorInput;
    incidents?: IncidentUncheckedCreateNestedManyWithoutMonitorInput;
    regionalIncidents?: RegionalIncidentUncheckedCreateNestedManyWithoutMonitorInput;
  };

  export type MonitorCreateOrConnectWithoutMaintenanceWindowsInput = {
    where: MonitorWhereUniqueInput;
    create: XOR<
      MonitorCreateWithoutMaintenanceWindowsInput,
      MonitorUncheckedCreateWithoutMaintenanceWindowsInput
    >;
  };

  export type MonitorUpsertWithoutMaintenanceWindowsInput = {
    update: XOR<
      MonitorUpdateWithoutMaintenanceWindowsInput,
      MonitorUncheckedUpdateWithoutMaintenanceWindowsInput
    >;
    create: XOR<
      MonitorCreateWithoutMaintenanceWindowsInput,
      MonitorUncheckedCreateWithoutMaintenanceWindowsInput
    >;
    where?: MonitorWhereInput;
  };

  export type MonitorUpdateToOneWithWhereWithoutMaintenanceWindowsInput = {
    where?: MonitorWhereInput;
    data: XOR<
      MonitorUpdateWithoutMaintenanceWindowsInput,
      MonitorUncheckedUpdateWithoutMaintenanceWindowsInput
    >;
  };

  export type MonitorUpdateWithoutMaintenanceWindowsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    url?: StringFieldUpdateOperationsInput | string;
    type?: EnumMonitorTypeFieldUpdateOperationsInput | $Enums.MonitorType;
    interval?: IntFieldUpdateOperationsInput | number;
    timeout?: IntFieldUpdateOperationsInput | number;
    status?: EnumMonitorStatusFieldUpdateOperationsInput | $Enums.MonitorStatus;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    nextCheck?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lastCheck?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    checkRegions?: NullableStringFieldUpdateOperationsInput | string | null;
    alertThreshold?: IntFieldUpdateOperationsInput | number;
    user?: UserUpdateOneRequiredWithoutMonitorsNestedInput;
    events?: MonitorEventUpdateManyWithoutMonitorNestedInput;
    alertRules?: AlertRuleUpdateManyWithoutMonitorNestedInput;
    incidents?: IncidentUpdateManyWithoutMonitorNestedInput;
    regionalIncidents?: RegionalIncidentUpdateManyWithoutMonitorNestedInput;
  };

  export type MonitorUncheckedUpdateWithoutMaintenanceWindowsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    url?: StringFieldUpdateOperationsInput | string;
    type?: EnumMonitorTypeFieldUpdateOperationsInput | $Enums.MonitorType;
    interval?: IntFieldUpdateOperationsInput | number;
    timeout?: IntFieldUpdateOperationsInput | number;
    status?: EnumMonitorStatusFieldUpdateOperationsInput | $Enums.MonitorStatus;
    userId?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    nextCheck?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lastCheck?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    checkRegions?: NullableStringFieldUpdateOperationsInput | string | null;
    alertThreshold?: IntFieldUpdateOperationsInput | number;
    events?: MonitorEventUncheckedUpdateManyWithoutMonitorNestedInput;
    alertRules?: AlertRuleUncheckedUpdateManyWithoutMonitorNestedInput;
    incidents?: IncidentUncheckedUpdateManyWithoutMonitorNestedInput;
    regionalIncidents?: RegionalIncidentUncheckedUpdateManyWithoutMonitorNestedInput;
  };

  export type SessionCreateManyUserInput = {
    id: string;
    expiresAt: Date | string;
    token: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    ipAddress?: string | null;
    userAgent?: string | null;
  };

  export type AccountCreateManyUserInput = {
    id: string;
    accountId: string;
    providerId: string;
    accessToken?: string | null;
    refreshToken?: string | null;
    idToken?: string | null;
    accessTokenExpiresAt?: Date | string | null;
    refreshTokenExpiresAt?: Date | string | null;
    scope?: string | null;
    password?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type MonitorCreateManyUserInput = {
    id?: string;
    name: string;
    url: string;
    type?: $Enums.MonitorType;
    interval?: number;
    timeout?: number;
    status?: $Enums.MonitorStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    nextCheck?: Date | string | null;
    lastCheck?: Date | string | null;
    checkRegions?: string | null;
    alertThreshold?: number;
  };

  export type NotificationChannelCreateManyUserInput = {
    id?: string;
    name: string;
    type: $Enums.NotificationType;
    config: JsonNullValueInput | InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type SessionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    token?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null;
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null;
  };

  export type SessionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    token?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null;
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null;
  };

  export type SessionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    token?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null;
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null;
  };

  export type AccountUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    accountId?: StringFieldUpdateOperationsInput | string;
    providerId?: StringFieldUpdateOperationsInput | string;
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null;
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null;
    idToken?: NullableStringFieldUpdateOperationsInput | string | null;
    accessTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    refreshTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    scope?: NullableStringFieldUpdateOperationsInput | string | null;
    password?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type AccountUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    accountId?: StringFieldUpdateOperationsInput | string;
    providerId?: StringFieldUpdateOperationsInput | string;
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null;
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null;
    idToken?: NullableStringFieldUpdateOperationsInput | string | null;
    accessTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    refreshTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    scope?: NullableStringFieldUpdateOperationsInput | string | null;
    password?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type AccountUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    accountId?: StringFieldUpdateOperationsInput | string;
    providerId?: StringFieldUpdateOperationsInput | string;
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null;
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null;
    idToken?: NullableStringFieldUpdateOperationsInput | string | null;
    accessTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    refreshTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    scope?: NullableStringFieldUpdateOperationsInput | string | null;
    password?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type MonitorUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    url?: StringFieldUpdateOperationsInput | string;
    type?: EnumMonitorTypeFieldUpdateOperationsInput | $Enums.MonitorType;
    interval?: IntFieldUpdateOperationsInput | number;
    timeout?: IntFieldUpdateOperationsInput | number;
    status?: EnumMonitorStatusFieldUpdateOperationsInput | $Enums.MonitorStatus;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    nextCheck?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lastCheck?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    checkRegions?: NullableStringFieldUpdateOperationsInput | string | null;
    alertThreshold?: IntFieldUpdateOperationsInput | number;
    events?: MonitorEventUpdateManyWithoutMonitorNestedInput;
    maintenanceWindows?: MaintenanceWindowUpdateManyWithoutMonitorNestedInput;
    alertRules?: AlertRuleUpdateManyWithoutMonitorNestedInput;
    incidents?: IncidentUpdateManyWithoutMonitorNestedInput;
    regionalIncidents?: RegionalIncidentUpdateManyWithoutMonitorNestedInput;
  };

  export type MonitorUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    url?: StringFieldUpdateOperationsInput | string;
    type?: EnumMonitorTypeFieldUpdateOperationsInput | $Enums.MonitorType;
    interval?: IntFieldUpdateOperationsInput | number;
    timeout?: IntFieldUpdateOperationsInput | number;
    status?: EnumMonitorStatusFieldUpdateOperationsInput | $Enums.MonitorStatus;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    nextCheck?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lastCheck?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    checkRegions?: NullableStringFieldUpdateOperationsInput | string | null;
    alertThreshold?: IntFieldUpdateOperationsInput | number;
    events?: MonitorEventUncheckedUpdateManyWithoutMonitorNestedInput;
    maintenanceWindows?: MaintenanceWindowUncheckedUpdateManyWithoutMonitorNestedInput;
    alertRules?: AlertRuleUncheckedUpdateManyWithoutMonitorNestedInput;
    incidents?: IncidentUncheckedUpdateManyWithoutMonitorNestedInput;
    regionalIncidents?: RegionalIncidentUncheckedUpdateManyWithoutMonitorNestedInput;
  };

  export type MonitorUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    url?: StringFieldUpdateOperationsInput | string;
    type?: EnumMonitorTypeFieldUpdateOperationsInput | $Enums.MonitorType;
    interval?: IntFieldUpdateOperationsInput | number;
    timeout?: IntFieldUpdateOperationsInput | number;
    status?: EnumMonitorStatusFieldUpdateOperationsInput | $Enums.MonitorStatus;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    nextCheck?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lastCheck?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    checkRegions?: NullableStringFieldUpdateOperationsInput | string | null;
    alertThreshold?: IntFieldUpdateOperationsInput | number;
  };

  export type NotificationChannelUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType;
    config?: JsonNullValueInput | InputJsonValue;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    alertRules?: AlertRuleUpdateManyWithoutChannelsNestedInput;
  };

  export type NotificationChannelUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType;
    config?: JsonNullValueInput | InputJsonValue;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    alertRules?: AlertRuleUncheckedUpdateManyWithoutChannelsNestedInput;
  };

  export type NotificationChannelUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType;
    config?: JsonNullValueInput | InputJsonValue;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type IncidentEventCreateManyIncidentInput = {
    id?: string;
    type: $Enums.IncidentEventType;
    message: string;
    createdAt?: Date | string;
  };

  export type IncidentEventUpdateWithoutIncidentInput = {
    id?: StringFieldUpdateOperationsInput | string;
    type?: EnumIncidentEventTypeFieldUpdateOperationsInput | $Enums.IncidentEventType;
    message?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type IncidentEventUncheckedUpdateWithoutIncidentInput = {
    id?: StringFieldUpdateOperationsInput | string;
    type?: EnumIncidentEventTypeFieldUpdateOperationsInput | $Enums.IncidentEventType;
    message?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type IncidentEventUncheckedUpdateManyWithoutIncidentInput = {
    id?: StringFieldUpdateOperationsInput | string;
    type?: EnumIncidentEventTypeFieldUpdateOperationsInput | $Enums.IncidentEventType;
    message?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type AlertRuleUpdateWithoutChannelsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    trigger?: EnumAlertTriggerFieldUpdateOperationsInput | $Enums.AlertTrigger;
    threshold?: NullableIntFieldUpdateOperationsInput | number | null;
    comparison?:
      | NullableEnumComparisonOperatorFieldUpdateOperationsInput
      | $Enums.ComparisonOperator
      | null;
    targetStatus?:
      | NullableEnumMonitorStatusFieldUpdateOperationsInput
      | $Enums.MonitorStatus
      | null;
    enabled?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    monitor?: MonitorUpdateOneRequiredWithoutAlertRulesNestedInput;
  };

  export type AlertRuleUncheckedUpdateWithoutChannelsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    monitorId?: StringFieldUpdateOperationsInput | string;
    trigger?: EnumAlertTriggerFieldUpdateOperationsInput | $Enums.AlertTrigger;
    threshold?: NullableIntFieldUpdateOperationsInput | number | null;
    comparison?:
      | NullableEnumComparisonOperatorFieldUpdateOperationsInput
      | $Enums.ComparisonOperator
      | null;
    targetStatus?:
      | NullableEnumMonitorStatusFieldUpdateOperationsInput
      | $Enums.MonitorStatus
      | null;
    enabled?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type AlertRuleUncheckedUpdateManyWithoutChannelsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    monitorId?: StringFieldUpdateOperationsInput | string;
    trigger?: EnumAlertTriggerFieldUpdateOperationsInput | $Enums.AlertTrigger;
    threshold?: NullableIntFieldUpdateOperationsInput | number | null;
    comparison?:
      | NullableEnumComparisonOperatorFieldUpdateOperationsInput
      | $Enums.ComparisonOperator
      | null;
    targetStatus?:
      | NullableEnumMonitorStatusFieldUpdateOperationsInput
      | $Enums.MonitorStatus
      | null;
    enabled?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type NotificationChannelUpdateWithoutAlertRulesInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType;
    config?: JsonNullValueInput | InputJsonValue;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    user?: UserUpdateOneRequiredWithoutNotificationChannelsNestedInput;
  };

  export type NotificationChannelUncheckedUpdateWithoutAlertRulesInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType;
    config?: JsonNullValueInput | InputJsonValue;
    userId?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type NotificationChannelUncheckedUpdateManyWithoutAlertRulesInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType;
    config?: JsonNullValueInput | InputJsonValue;
    userId?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type MonitorEventCreateManyMonitorInput = {
    id?: string;
    status: $Enums.MonitorStatus;
    latency: number;
    errorReason?: string | null;
    timestamp?: Date | string;
    region?: string | null;
  };

  export type MaintenanceWindowCreateManyMonitorInput = {
    id?: string;
    description?: string | null;
    startAt: Date | string;
    endAt: Date | string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type AlertRuleCreateManyMonitorInput = {
    id?: string;
    trigger: $Enums.AlertTrigger;
    threshold?: number | null;
    comparison?: $Enums.ComparisonOperator | null;
    targetStatus?: $Enums.MonitorStatus | null;
    enabled?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type IncidentCreateManyMonitorInput = {
    id?: string;
    status?: $Enums.IncidentStatus;
    severity?: $Enums.Severity;
    title: string;
    description?: string | null;
    startedAt?: Date | string;
    resolvedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type RegionalIncidentCreateManyMonitorInput = {
    id?: string;
    region: string;
    status?: $Enums.IncidentStatus;
    startedAt?: Date | string;
    resolvedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type MonitorEventUpdateWithoutMonitorInput = {
    id?: StringFieldUpdateOperationsInput | string;
    status?: EnumMonitorStatusFieldUpdateOperationsInput | $Enums.MonitorStatus;
    latency?: IntFieldUpdateOperationsInput | number;
    errorReason?: NullableStringFieldUpdateOperationsInput | string | null;
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string;
    region?: NullableStringFieldUpdateOperationsInput | string | null;
  };

  export type MonitorEventUncheckedUpdateWithoutMonitorInput = {
    id?: StringFieldUpdateOperationsInput | string;
    status?: EnumMonitorStatusFieldUpdateOperationsInput | $Enums.MonitorStatus;
    latency?: IntFieldUpdateOperationsInput | number;
    errorReason?: NullableStringFieldUpdateOperationsInput | string | null;
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string;
    region?: NullableStringFieldUpdateOperationsInput | string | null;
  };

  export type MonitorEventUncheckedUpdateManyWithoutMonitorInput = {
    id?: StringFieldUpdateOperationsInput | string;
    status?: EnumMonitorStatusFieldUpdateOperationsInput | $Enums.MonitorStatus;
    latency?: IntFieldUpdateOperationsInput | number;
    errorReason?: NullableStringFieldUpdateOperationsInput | string | null;
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string;
    region?: NullableStringFieldUpdateOperationsInput | string | null;
  };

  export type MaintenanceWindowUpdateWithoutMonitorInput = {
    id?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    startAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    endAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type MaintenanceWindowUncheckedUpdateWithoutMonitorInput = {
    id?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    startAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    endAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type MaintenanceWindowUncheckedUpdateManyWithoutMonitorInput = {
    id?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    startAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    endAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type AlertRuleUpdateWithoutMonitorInput = {
    id?: StringFieldUpdateOperationsInput | string;
    trigger?: EnumAlertTriggerFieldUpdateOperationsInput | $Enums.AlertTrigger;
    threshold?: NullableIntFieldUpdateOperationsInput | number | null;
    comparison?:
      | NullableEnumComparisonOperatorFieldUpdateOperationsInput
      | $Enums.ComparisonOperator
      | null;
    targetStatus?:
      | NullableEnumMonitorStatusFieldUpdateOperationsInput
      | $Enums.MonitorStatus
      | null;
    enabled?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    channels?: NotificationChannelUpdateManyWithoutAlertRulesNestedInput;
  };

  export type AlertRuleUncheckedUpdateWithoutMonitorInput = {
    id?: StringFieldUpdateOperationsInput | string;
    trigger?: EnumAlertTriggerFieldUpdateOperationsInput | $Enums.AlertTrigger;
    threshold?: NullableIntFieldUpdateOperationsInput | number | null;
    comparison?:
      | NullableEnumComparisonOperatorFieldUpdateOperationsInput
      | $Enums.ComparisonOperator
      | null;
    targetStatus?:
      | NullableEnumMonitorStatusFieldUpdateOperationsInput
      | $Enums.MonitorStatus
      | null;
    enabled?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    channels?: NotificationChannelUncheckedUpdateManyWithoutAlertRulesNestedInput;
  };

  export type AlertRuleUncheckedUpdateManyWithoutMonitorInput = {
    id?: StringFieldUpdateOperationsInput | string;
    trigger?: EnumAlertTriggerFieldUpdateOperationsInput | $Enums.AlertTrigger;
    threshold?: NullableIntFieldUpdateOperationsInput | number | null;
    comparison?:
      | NullableEnumComparisonOperatorFieldUpdateOperationsInput
      | $Enums.ComparisonOperator
      | null;
    targetStatus?:
      | NullableEnumMonitorStatusFieldUpdateOperationsInput
      | $Enums.MonitorStatus
      | null;
    enabled?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type IncidentUpdateWithoutMonitorInput = {
    id?: StringFieldUpdateOperationsInput | string;
    status?: EnumIncidentStatusFieldUpdateOperationsInput | $Enums.IncidentStatus;
    severity?: EnumSeverityFieldUpdateOperationsInput | $Enums.Severity;
    title?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    events?: IncidentEventUpdateManyWithoutIncidentNestedInput;
  };

  export type IncidentUncheckedUpdateWithoutMonitorInput = {
    id?: StringFieldUpdateOperationsInput | string;
    status?: EnumIncidentStatusFieldUpdateOperationsInput | $Enums.IncidentStatus;
    severity?: EnumSeverityFieldUpdateOperationsInput | $Enums.Severity;
    title?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    events?: IncidentEventUncheckedUpdateManyWithoutIncidentNestedInput;
  };

  export type IncidentUncheckedUpdateManyWithoutMonitorInput = {
    id?: StringFieldUpdateOperationsInput | string;
    status?: EnumIncidentStatusFieldUpdateOperationsInput | $Enums.IncidentStatus;
    severity?: EnumSeverityFieldUpdateOperationsInput | $Enums.Severity;
    title?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type RegionalIncidentUpdateWithoutMonitorInput = {
    id?: StringFieldUpdateOperationsInput | string;
    region?: StringFieldUpdateOperationsInput | string;
    status?: EnumIncidentStatusFieldUpdateOperationsInput | $Enums.IncidentStatus;
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type RegionalIncidentUncheckedUpdateWithoutMonitorInput = {
    id?: StringFieldUpdateOperationsInput | string;
    region?: StringFieldUpdateOperationsInput | string;
    status?: EnumIncidentStatusFieldUpdateOperationsInput | $Enums.IncidentStatus;
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type RegionalIncidentUncheckedUpdateManyWithoutMonitorInput = {
    id?: StringFieldUpdateOperationsInput | string;
    region?: StringFieldUpdateOperationsInput | string;
    status?: EnumIncidentStatusFieldUpdateOperationsInput | $Enums.IncidentStatus;
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number;
  };

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF;
}
