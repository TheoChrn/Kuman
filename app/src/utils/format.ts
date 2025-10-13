/**
 * Converts a flat array of items with `id` and `parentId` into a nested tree structure.
 * Each item will include a `children` array containing its direct descendants.
 *
 * @template T The type of each item, must include `id` (string) and `parentId` (string | null)
 * @param array The flat array of items to nest
 * @returns An array of root items, each with a nested `children` tree
 *
 * Example:
 * const flat = [
 *   { id: "1", parentId: null, name: "Root" },
 *   { id: "2", parentId: "1", name: "Child" },
 * ];
 * nestArray(flat);
 * // [
 * //   { id: "1", parentId: null, name: "Root", children: [
 * //       { id: "2", parentId: "1", name: "Child", children: [] }
 * //   ]}
 * // ]
 */

// Could be even more generic as width dynamic typed keys
export function nestArray<T extends { id: string; parentId: string | null }>(
  array: T[]
): (T & { children: (T & { children: any[] })[] })[] {
  const map = new Map<string, T & { children: T[] }>();
  const newArray: (T & { children: any[] })[] = [];

  for (const element of array) {
    map.set(element.id, { ...element, children: [] });
  }

  for (const element of array) {
    const node = map.get(element.id)!;
    if (element.parentId) {
      const parent = map.get(element.parentId);
      if (parent) {
        parent.children.push(node);
      }
    } else {
      newArray.push(node);
    }
  }

  return newArray;
}
