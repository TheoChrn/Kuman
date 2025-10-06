export function nestArray<T extends { id: string; parentId: string | null }>(
  array: T[]
): (T & { children: (T & { children: any[] })[] })[] {
  const map = new Map<string, T & { children: T[] }>();
  const roots: (T & { children: any[] })[] = [];

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
      roots.push(node);
    }
  }

  return roots;
}
