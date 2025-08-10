import type { Column, InferColumnsDataTypes, SQL } from "drizzle-orm";
import type { PgArray, PgColumn } from "drizzle-orm/pg-core";
import { DrizzleError, sql } from "drizzle-orm";

type InferMixedTypes<T extends Record<string, PgColumn | SQL<any>>> = {
  [K in keyof T]: T[K] extends PgColumn
    ? InferColumnsDataTypes<{ col: T[K] }>["col"]
    : T[K] extends SQL<infer U>
      ? U
      : never;
};

export function jsonAgg<T extends Record<string, PgColumn | SQL<string>>>(
  select: T,
  options?: { orderBy?: SQL[] },
) {
  const chunks: SQL[] = [];
  const entries = Object.entries(select);

  if (!entries.length) {
    throw new DrizzleError({ message: "Cannot aggregate an empty object" });
  }

  // Construct key-value pairs for json_build_object
  entries.forEach(([key, column], index) => {
    if (index > 0) chunks.push(sql`,`);
    chunks.push(sql.raw(`'${key}',`), sql`${column}`);
  });

  // Build a condition to check if all columns are null
  const allNullCondition = entries
    .map(([_, column]) => sql`${column} IS NULL`)
    .reduce((prev, curr) => sql`${prev} AND ${curr}`);

  const orderByClause = options?.orderBy?.length
    ? sql` ORDER BY ${sql.join(options.orderBy, sql`, `)}`
    : sql``;

  return sql<InferMixedTypes<T>[]>`
    COALESCE(
      json_arrayagg(
        CASE 
          WHEN ${allNullCondition} THEN NULL
          ELSE json_build_object(${sql.join(chunks)})
        END
        ${orderByClause}
      ),
      '[]'
    )
  `;
}

export function arrayContainsPartial<T extends string>(
  column: Column | PgArray<any, any>,
  searchTerm: T,
): SQL<boolean> {
  return sql<boolean>`EXISTS (
    SELECT 1 FROM unnest(${column}) as item 
    WHERE item ILIKE ${"%" + searchTerm + "%"}
  )`;
}
